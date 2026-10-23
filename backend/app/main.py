from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Depends
from fastapi.responses import HTMLResponse, StreamingResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from contextlib import suppress
import asyncio
import json
import os
import logging

logger = logging.getLogger("ibvap.main")

import httpx
from starlette.middleware.gzip import GZipMiddleware
from typing import Optional

from app.core.config import settings
from app.core.database import engine, Base, AsyncSessionLocal, ping_database, DATABASE_URL
from app.core.cache import cache
from app.core.middleware import (
    ObservabilityMiddleware,
    RequestSizeLimitMiddleware,
    RateLimitMiddleware,
    metrics_tracker
)
from app.core.errors import install_exception_handlers
from app.core.security import get_current_active_user, get_current_user, get_media_user
import app.models
from app.api import dashboard
from app.api.v1 import router as api_router
from app.services.seed import seed_db
from app.services.bootstrap import bootstrap_initial_admin
from app.ai.realtime_stream import live_stream_processor
import time
import random

async def run_background_telemetry():
    """Continuously runs in the background to emit live telemetry, camera health, and events to active WebSockets"""
    from app.core.websocket import broadcast_event
    while True:
        try:
            await asyncio.sleep(2.5)
            telemetry = {
                "timestamp": time.time(),
                "fps": round(random.uniform(28.0, 30.5), 1),
                "cpu": round(random.uniform(41.0, 44.5), 1),
                "gpu": round(random.uniform(65.0, 68.5), 1),
                "active_targets": random.randint(12, 16),
                "density": live_stream_processor.get_density_metrics()
            }
            await broadcast_event("heartbeat", telemetry)

            if random.random() < 0.3:
                ev_type = random.choice(["detection", "anpr_read"])
                if ev_type == "detection":
                    cam_id = random.choice(["BOP-01", "BOP-02", "ROAD-01", "CHECK-01"])
                    label = random.choice(["person", "vehicle", "backpack"])
                    await broadcast_event("detection", {
                        "camera_id": cam_id,
                        "label": label,
                        "confidence": round(random.uniform(0.88, 0.98), 2),
                        "timestamp": time.strftime("%H:%M:%S")
                    })
                elif ev_type == "anpr_read":
                    plates = ["DL 01 AB 1234", "HR 26 DQ 5521", "PB 10 Z 9901", "JK 02 BB 4432"]
                    await broadcast_event("anpr", {
                        "camera_id": "CHECK-01",
                        "plate": random.choice(plates),
                        "confidence": 0.96,
                        "speed_kmh": random.randint(42, 78),
                        "timestamp": time.strftime("%H:%M:%S")
                    })
        except asyncio.CancelledError:
            break
        except Exception as e:
            logger.error(f"Error in background telemetry loop: {e}", exc_info=True)
            await asyncio.sleep(4.0)

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.http_client = httpx.AsyncClient(timeout=10.0)
    bg_task = None
    stream_processor_started = False
    try:
        if settings.ENVIRONMENT.lower() != "production":
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
        else:
            if not await ping_database():
                raise RuntimeError("Database health check failed during production startup.")
            async with AsyncSessionLocal() as session:
                await bootstrap_initial_admin(session)

        if settings.DEMO_MODE and settings.ENVIRONMENT.lower() != "production":
            async with AsyncSessionLocal() as session:
                await seed_db(session)

        if settings.ENABLE_BACKGROUND_WORKERS and not os.environ.get("TESTING"):
            if settings.DEMO_MODE:
                bg_task = asyncio.create_task(run_background_telemetry())
            live_stream_processor.start()
            stream_processor_started = True

        yield
    finally:
        if bg_task:
            bg_task.cancel()
            with suppress(asyncio.CancelledError):
                await bg_task
        if stream_processor_started:
            live_stream_processor.stop()
        await app.state.http_client.aclose()
        await cache.close()
        await engine.dispose()

app = FastAPI(
    title="IBVAP - Intelligent Border Video Analytics Platform",
    version="1.2.0",
    lifespan=lifespan
)
install_exception_handlers(app)

# Compression & Security Middlewares
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(ObservabilityMiddleware)
app.add_middleware(RequestSizeLimitMiddleware)
app.add_middleware(RateLimitMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.DEMO_MODE else settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Compatibility aliases for legacy frontend clients
@api_router.get("/alerts/recent", tags=["alerts"], dependencies=[Depends(get_current_active_user)])
async def get_recent_alerts_alias():
    """Alias for recent alerts feed"""
    from app.api.dashboard import get_recent_alerts
    return await get_recent_alerts()

@api_router.get("/events/recent", tags=["dashboard"], dependencies=[Depends(get_current_active_user)])
async def get_recent_events_alias():
    """Alias for recent events feed"""
    from app.api.dashboard import get_recent_events
    return await get_recent_events()

@app.get("/health", tags=["health"])
async def public_health():
    """Lightweight 200 OK healthcheck for container orchestrators and load balancers."""
    return {"status": "ok", "service": "IBVAP", "version": "1.2.0"}

@api_router.get("/health", tags=["health"])
async def health_check():
    db_ok = await ping_database()
    if not db_ok:
        raise HTTPException(status_code=503, detail="Database unavailable")
    return {
        "status": "healthy",
        "service": "IBVAP Enterprise Surveillance",
        "version": "1.2.0",
        "database": "connected" if db_ok else "error",
        "demo_mode": settings.DEMO_MODE,
        "ai_engine": "YOLOv8 + ByteTrack + PaddleOCR + RetinaFace"
    }

@app.get("/health/keys", tags=["health"], dependencies=[Depends(get_current_active_user)])
@api_router.get("/health/keys", tags=["health"], dependencies=[Depends(get_current_active_user)])
async def key_health_check():
    """Masked diagnostics of configured credentials, database, and cache without exposing secrets."""
    if not settings.ENABLE_KEY_HEALTH_CHECK:
        raise HTTPException(status_code=404, detail="Not found")
    def mask_key(k: str) -> str:
        if not k or len(k) < 6:
            return "****"
        return f"{k[:3]}****{k[-4:]}"

    db_ok = await ping_database()
    cache_info = await cache.ping()

    return {
        "status": "healthy" if db_ok else "degraded",
        "environment": settings.ENVIRONMENT,
        "database": {"connected": db_ok, "driver": DATABASE_URL.split("://")[0]},
        "cache": cache_info,
        "secrets_configured": {
            "SECRET_KEY": bool(settings.SECRET_KEY and len(settings.SECRET_KEY) >= 32),
            "DATABASE_URL": bool(settings.DATABASE_URL),
            "REDIS_URL": bool(settings.REDIS_URL),
            "WEBHOOK_SECRET": bool(settings.WEBHOOK_SECRET)
        },
        "keys_masked": {
            "SECRET_KEY_PREVIEW": mask_key(settings.SECRET_KEY),
            "WEBHOOK_SECRET_PREVIEW": mask_key(settings.WEBHOOK_SECRET)
        }
    }

@api_router.get("/system/performance-metrics", tags=["system"], dependencies=[Depends(get_current_active_user)])
async def get_performance_metrics():
    """Real-time latency (p50, p95, p99) and request metrics."""
    return metrics_tracker.get_stats()

# Live Real-time AI Video Feed (MJPEG)
@app.get("/video_feed", tags=["stream"], dependencies=[Depends(get_media_user)])
@app.get("/video_feed/{camera_id}", tags=["stream"], dependencies=[Depends(get_media_user)])
@api_router.get("/stream/feed", tags=["stream"], dependencies=[Depends(get_media_user)])
@api_router.get("/stream/feed/{camera_id}", tags=["stream"], dependencies=[Depends(get_media_user)])
def video_feed(camera_id: Optional[str] = None):
    """Real-time MJPEG live stream with annotated YOLO & ByteTrack overlays"""
    return StreamingResponse(
        live_stream_processor.generate_stream(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

# Cumulative Foot Traffic Heatmap Stream
@api_router.get("/stream/heatmap", tags=["stream"], dependencies=[Depends(get_media_user)])
@api_router.get("/stream/heatmap/{camera_id}", tags=["stream"], dependencies=[Depends(get_media_user)])
def heatmap_feed(camera_id: Optional[str] = None):
    """Cumulative foot-traffic motion heatmap MJPEG stream"""
    return StreamingResponse(
        live_stream_processor.generate_heatmap_stream(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

@api_router.get("/stream/density", tags=["stream"], dependencies=[Depends(get_current_active_user)])
def get_crowd_density():
    """Returns zone crowd count, total persons, and overcrowding status"""
    return live_stream_processor.get_density_metrics()

@api_router.post("/density/threshold", tags=["stream"], dependencies=[Depends(get_current_active_user)])
def set_crowd_threshold(payload: dict):
    """Configures the overcrowding threshold limit"""
    thresh = int(payload.get("threshold", 6))
    return live_stream_processor.set_crowd_threshold(thresh)

@api_router.post("/heatmap/reset", tags=["stream"], dependencies=[Depends(get_current_active_user)])
def reset_heatmap():
    """Resets the accumulated movement heatmap"""
    return live_stream_processor.reset_heatmap()

# Low-Light & Night-Vision Enhancement Control API
@api_router.get("/stream/enhancer", tags=["stream"], dependencies=[Depends(get_current_active_user)])
async def get_enhancer_status():
    """Returns low-light preprocessor status, current brightness, latency, and FPS"""
    from app.ai.enhancer import low_light_enhancer
    status = low_light_enhancer.get_status()
    status["fps"] = round(getattr(live_stream_processor, "fps", 30.0), 1)
    return status

@api_router.post("/stream/enhancer", tags=["stream"], dependencies=[Depends(get_current_active_user)])
async def configure_enhancer(payload: dict):
    """Toggles or configures low-light CLAHE enhancement preprocessor"""
    from app.ai.enhancer import low_light_enhancer
    enabled = payload.get("enabled")
    threshold = payload.get("threshold")
    clip_limit = payload.get("clip_limit")
    return low_light_enhancer.set_config(enabled=enabled, threshold=threshold, clip_limit=clip_limit)

# Edge Performance & Multi-Rate Inference Optimization API
@api_router.get("/stream/performance", tags=["stream"], dependencies=[Depends(get_current_active_user)])
async def get_performance_stats():
    """Returns frame-skip, inference resolution, and active FPS telemetry"""
    return live_stream_processor.get_performance_config()

@api_router.post("/stream/performance", tags=["stream"], dependencies=[Depends(get_current_active_user)])
async def configure_performance(payload: dict):
    """Configures edge frame-skip (N) and downscaled inference resolution"""
    frame_skip = payload.get("frame_skip")
    infer_width = payload.get("infer_width")
    infer_height = payload.get("infer_height")
    return live_stream_processor.set_performance_config(
        frame_skip=frame_skip, infer_width=infer_width, infer_height=infer_height
    )

@api_router.get("/stream/alerts", tags=["stream"], dependencies=[Depends(get_current_active_user)])
def stream_alerts():
    return live_stream_processor.get_live_alerts()

@api_router.get("/stream/snapshot", tags=["stream"], dependencies=[Depends(get_media_user)])
def get_stream_snapshot():
    """Returns a single clean JPEG frame for 4-point zone polygon calibration"""
    from fastapi.responses import Response
    return Response(
        content=live_stream_processor.get_raw_snapshot(),
        media_type="image/jpeg"
    )

@api_router.get("/stream/zone", tags=["stream"], dependencies=[Depends(get_current_active_user)])
def get_zone_polygon():
    """Returns the active 4-point restricted zone polygon coordinates"""
    return live_stream_processor.get_zone_polygon()

@api_router.post("/stream/zone", tags=["stream"], dependencies=[Depends(get_current_active_user)])
def update_zone_polygon(payload: dict):
    """Updates the restricted zone polygon from the interactive UI setup mode"""
    polygon = payload.get("polygon", [])
    if len(polygon) < 3:
        raise HTTPException(status_code=400, detail="At least 3 points required for restricted zone polygon")
    updated = live_stream_processor.set_zone_polygon(polygon)
    return {"status": "success", "polygon": updated}

@api_router.get("/stream/source", tags=["stream"], dependencies=[Depends(get_current_active_user)])
def get_stream_source():
    """Returns the current streaming video or webcam source"""
    return live_stream_processor.get_source_info()

@api_router.post("/stream/source", tags=["stream"], dependencies=[Depends(get_current_active_user)])
def set_stream_source(payload: dict):
    """Switches stream source to webcam (0), video file, or IP stream"""
    source = payload.get("source", "test.mp4")
    return live_stream_processor.set_source(source)

# Face Recognition Watchlist API
@api_router.get("/faces/watchlist", tags=["faces"], dependencies=[Depends(get_current_active_user)])
def get_face_watchlist():
    """Returns loaded known faces and blacklist status"""
    from app.ai.face_engine import face_engine
    return face_engine.get_watchlist()

@api_router.post("/faces/reload", tags=["faces"], dependencies=[Depends(get_current_active_user)])
def reload_face_watchlist():
    """Reloads known faces database from directory"""
    from app.ai.face_engine import face_engine
    face_engine.reload_database()
    return {"status": "success", "watchlist": face_engine.get_watchlist()}

# Server-Sent Events (SSE) Alerts Stream
@api_router.get("/alerts/stream", tags=["stream"], dependencies=[Depends(get_current_active_user)])
async def sse_alerts_stream():
    """Server-Sent Events stream for live alerts sidebar"""
    async def event_generator():
        last_sent_time = None
        while True:
            alerts = live_stream_processor.get_live_alerts()
            if alerts:
                top_alert = alerts[0]
                if top_alert.get("timestamp") != last_sent_time:
                    last_sent_time = top_alert.get("timestamp")
                    yield f"data: {json.dumps(top_alert)}\n\n"
            await asyncio.sleep(0.5)

    return StreamingResponse(event_generator(), media_type="text/event-stream")

# WebSocket for real-time events & alerts
from app.core.websocket import ws_manager

@app.websocket("/ws/events")
@app.websocket("/ws/alerts")
async def websocket_endpoint(websocket: WebSocket):
    requested_protocols = [item.strip() for item in websocket.headers.get("sec-websocket-protocol", "").split(",") if item.strip()]
    token = None
    if len(requested_protocols) > 1 and requested_protocols[0] == "ibvap":
        token = requested_protocols[1]
    authorization = websocket.headers.get("authorization", "")
    if not token and authorization.lower().startswith("bearer "):
        token = authorization[7:].strip()
    if not token:
        await websocket.close(code=1008, reason="Authentication required")
        return

    try:
        async with AsyncSessionLocal() as session:
            user = await get_current_user(token=token, db=session)
            if not user.is_active:
                await websocket.close(code=1008, reason="Inactive user")
                return
    except HTTPException:
        await websocket.close(code=1008, reason="Invalid session")
        return
    except Exception:
        logger.exception("WebSocket authentication failed due to a server error")
        await websocket.close(code=1011, reason="Authentication unavailable")
        return

    await ws_manager.connect(websocket, subprotocol="ibvap" if requested_protocols and requested_protocols[0] == "ibvap" else None)
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)

# `/api` remains available for existing clients. New clients use `/api/v1`.
app.include_router(api_router, prefix="/api", include_in_schema=False)
app.include_router(api_router, prefix="/api/v1")

# Serve Compiled React UI
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
static_dirs = [
    os.path.join(os.path.dirname(base_dir), "frontend", "dist"),
    os.path.join(base_dir, "static"),
]

static_dir = None
for s in static_dirs:
    if os.path.exists(s) and os.path.exists(os.path.join(s, "index.html")):
        static_dir = s
        break

if static_dir:
    assets_dir = os.path.join(static_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

@app.get("/")
async def root():
    if static_dir:
        index_file = os.path.join(static_dir, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
    return HTMLResponse("<h1>IBVAP Enterprise Surveillance API is Running</h1><p>Visit <a href='/docs'>/docs</a> for Swagger UI</p>")

@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    # Pass through API and stream paths
    reserved_prefixes = ("api/", "ws/", "video_feed", "docs", "openapi.json", "assets/")
    if full_path == "api" or full_path.startswith(reserved_prefixes):
        raise HTTPException(status_code=404, detail="API route not found")
    if static_dir:
        file_path = os.path.join(static_dir, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        index_file = os.path.join(static_dir, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
    return HTMLResponse("Not Found", status_code=404)
