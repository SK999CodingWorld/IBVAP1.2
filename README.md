# IBVAP — Intelligent Border Video Analytics Platform

A production-ready AI-powered video analytics platform for border surveillance, transforming existing CCTV infrastructure into an intelligent monitoring network using software-only computer vision.

## Features

| Capability | Status | Technology |
|------------|--------|------------|
| **Human Detection & Tracking** | ✅ | YOLOv8 + BoT-SORT |
| **Vehicle Detection & Classification** | ✅ | YOLOv8 (person, car, truck, bus, motorcycle) |
| **Face Detection & Recognition** | 🚧 Phase 2 | SCRFD + ArcFace (InsightFace) |
| **Automatic Number Plate Recognition (ANPR)** | 🚧 Phase 2 | YOLO-Plate + PaddleOCR |
| **Virtual Fence Intrusion Detection** | ✅ | Polygon/Line zones, dwell-time, direction |
| **Suspicious Activity Detection** | 🚧 Phase 2 | Pose estimation (loitering, running, grouping) |
| **Night-time Enhancement** | 🚧 Phase 2 | Retinex / EnlightenGAN preprocessing |
| **Real-time Alerts & Event Logging** | ✅ | Rule engine, cooldown, webhooks |
| **Multi-Camera IP Stream Ingestion** | ✅ | FFmpeg + Redis Streams |
| **Live Dashboard** | ✅ | FastAPI + React (planned) |
| **C2 System Integration** | 🚧 Phase 4 | REST webhooks, Kafka/NATS, STANAG 4607 |

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌────────────┐
│ IP CAMERAS  │────▶│ STREAM INGEST│────▶│  DETECTION  │────▶│  TRACKING  │
│  (RTSP)     │     │  (FFmpeg)    │     │  (YOLOv8)   │     │ (BoT-SORT) │
└─────────────┘     └──────────────┘     └─────────────┘     └─────┬──────┘
                                                                     │
                                              ┌──────────────────────┼──────────────────────┐
                                              ▼                      ▼                      ▼
                                    ┌───────────────┐       ┌───────────────┐       ┌───────────────┐
                                    │   ANALYTICS   │       │    ALERTS     │       │   RECORDING   │
                                    │  (ANPR/Face/  │       │  (Rule Engine,│       │  (Clips,      │
                                    │   Behavior)   │       │   Dedup,      │       │   Evidence)   │
                                    └───────────────┘       └───────────────┘       └───────────────┘
                                              │                      │                      │
                                              └──────────────────────┼──────────────────────┘
                                                                     ▼
                                                          ┌──────────────────┐
                                                          │   API GATEWAY    │
                                                          │   (FastAPI)      │
                                                          └────────┬─────────┘
                                                                   │
                                                          ┌────────▼─────────┐
                                                          │    DASHBOARD     │
                                                          │   (React/TS)     │
                                                          └──────────────────┘
```

## Project Structure

```
backend/app/
├── api/                 # Resource routers; api/v1 is the central route registry
├── core/                # Settings, database, cache, middleware, and errors
├── models/              # Persistence models
├── schemas/             # Request and response schemas
├── services/            # Business workflows and domain services
└── ai/                  # Computer vision and stream processing

frontend/src/
├── api/                 # Shared clients and domain endpoint services
├── components/          # Shared primitives and product-area UI
├── config/              # Validated public frontend configuration
├── features/            # UI-independent domain rules and workflows
├── layouts/             # Shared page chrome
├── lib/                 # Cross-cutting utilities
├── pages/               # Route-level screens
├── stores/              # Shared client state (Zustand)
└── types/               # Shared frontend contracts
```

See [the architecture guide](docs/ARCHITECTURE.md) for ownership boundaries,
configuration, API versioning, and extension conventions.

## Quick Start

### Prerequisites
- Python 3.11+
- Redis 7+ (`docker run -d -p 6379:6379 redis:7-alpine`)
- NVIDIA GPU (recommended) or CPU-only

### Installation

```bash
git clone <repo>
cd ibvap-project

# Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate  # Linux/macOS
# .venv\Scripts\Activate.ps1  # Windows PowerShell

# Install dependencies
pip install -r requirements.txt

# Copy backend environment config to the project root
cp .env.example .env
# Windows PowerShell: Copy-Item .env.example .env
```

### Running

**Local application**
```bash
python run.py
# Dashboard: http://localhost:8001
# API docs: http://localhost:8001/docs
```

**Build the frontend before starting the local app**
```bash
cd frontend
npm ci
npm run build
cd ..
python run.py
```

For container deployment, use `Dockerfile.prod` and `docker-compose.prod.yml`.
The older root `docker-compose.yml` still describes separate worker services.
For Vite hot reload, run the backend in one terminal and `npm run dev` in `frontend/` in another.

### Adding Cameras

```bash
curl -X POST http://localhost:8001/api/v1/cameras \
  -H "Content-Type: application/json" \
  -d '{
    "name": "BOP-North-Gate",
    "location": "Border Out Post North Gate",
    "latitude": 34.1234,
    "longitude": 74.5678,
    "protocol": "rtsp",
    "stream_url": "rtsp://user:pass@192.168.1.100:554/stream1",
    "enabled": true
  }'
```

### Defining Zones

Edit `zones.json` or use the API:

```json
{
  "id": "cam1_restricted",
  "config": {
    "type": "polygon",
    "coordinates": [[384,144], [896,144], [896,576], [384,576]],
    "name": "Restricted Zone",
    "camera_id": "cam1",
    "enabled": true,
    "classes": ["person", "car", "truck"],
    "dwell_time": 2.0
  }
}
```

Zone types: `polygon`, `rectangle`, `line`, `circle`

## API Endpoints

Use `/api/v1` as the API base path. Existing `/api/...` clients continue to work during migration.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | System health check |
| POST | `/api/v1/cameras` | Add camera |
| GET | `/api/v1/cameras` | List cameras |
| GET | `/api/v1/cameras/{id}` | Get camera |
| PATCH | `/api/v1/cameras/{id}` | Update camera |
| DELETE | `/api/v1/cameras/{id}` | Delete camera |
| GET | `/api/v1/cameras/{id}/health` | Camera health |
| GET | `/api/v1/alerts` | Get recent alerts |
| POST | `/api/v1/alerts/{id}/acknowledge` | Acknowledge alert |

Full OpenAPI docs at `http://localhost:8001/docs`

## Configuration

Key settings in `.env`:

```bash
# Detection
DETECTION_MODEL=yolov8n.pt        # yolov8n/s/m/l/x.pt
DETECTION_DEVICE=auto             # cpu, cuda, mps
DETECTION_CONF=0.35               # Confidence threshold
DETECTION_HALF=false              # FP16 inference

# Tracking
TRACKER_TYPE=botsort              # botsort, bytetrack
TRACK_BUFFER=30                   # Max frames to keep lost tracks

# Alerts
ALERT_COOLDOWN=5.0                # Seconds between same alerts
ALERT_MAX_HISTORY=1000

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

## Hardware Targets

| Device | GPU | Cameras @ 1080p30 | Use Case |
|--------|-----|-------------------|----------|
| Jetson Nano | 0.5 TOPS | 2-4 | Minimum |
| Jetson Orin NX 16GB | 70 TOPS | 12-16 | Standard |
| Jetson Orin AGX 64GB | 275 TOPS | 40+ | High-density |
| x86 + RTX 4070 | 300+ TOPS | 100+ | Server |

## Development Phases

| Phase | Duration | Focus |
|-------|----------|-------|
| **Phase 1** ✅ | Weeks 1-3 | Core detection, tracking, zones, alerts |
| **Phase 2** | Weeks 4-6 | ANPR, Face Recognition, Behavior, Night enhancement |
| **Phase 3** | Weeks 7-9 | Multi-camera mgmt, recording, edge sync |
| **Phase 4** | Weeks 10-12 | Dashboard, C2 integration, auth |
| **Phase 5** | Weeks 13-16 | TensorRT optimization, hardening, docs |

## Testing

```bash
# Unit tests
pytest tests/unit -v

# With coverage
pytest tests/unit --cov=shared --cov=services
```

## License

MIT — Free for commercial use
