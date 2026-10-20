import logging
from typing import Optional, Dict, Any, List
from fastapi import APIRouter, HTTPException, Body

logger = logging.getLogger("ibvap.ptz")

router = APIRouter(prefix="/ptz", tags=["ptz"])

# In-memory PTZ state per camera
_ptz_state: Dict[str, Dict[str, Any]] = {}
_ptz_presets: Dict[str, List[Dict[str, Any]]] = {}

def _get_or_init_state(camera_id: str) -> Dict[str, Any]:
    if camera_id not in _ptz_state:
        _ptz_state[camera_id] = {
            "pan": 0.0,
            "tilt": 0.0,
            "zoom": 1.0,
            "moving": False,
            "status": "idle",
            "last_error": None
        }
    return _ptz_state[camera_id]

def _get_or_init_presets(camera_id: str) -> List[Dict[str, Any]]:
    if camera_id not in _ptz_presets:
        _ptz_presets[camera_id] = [
            {"id": "p1", "name": "Gate Approach", "pan": 15.0, "tilt": -5.0, "zoom": 1.5},
            {"id": "p2", "name": "Perimeter West", "pan": -45.0, "tilt": 0.0, "zoom": 2.0},
            {"id": "p3", "name": "BOP Tower North", "pan": 60.0, "tilt": 10.0, "zoom": 3.0},
        ]
    return _ptz_presets[camera_id]


@router.post("/cameras/{camera_id}/initialize")
async def initialize_ptz(camera_id: str):
    """Initializes ONVIF or synthetic PTZ steering engine for camera"""
    state = _get_or_init_state(camera_id)
    state["status"] = "ready"
    logger.info(f"Initialized PTZ for camera {camera_id}")
    return {"status": "success", "message": f"PTZ initialized for camera {camera_id}"}


@router.get("/cameras/{camera_id}/status")
async def get_ptz_status(camera_id: str):
    """Returns current pan, tilt, zoom, and movement telemetry"""
    state = _get_or_init_state(camera_id)
    return {
        "status": "success",
        "camera_id": camera_id,
        "pan": state["pan"],
        "tilt": state["tilt"],
        "zoom": state["zoom"],
        "moving": state["moving"],
        "state": state["status"]
    }


@router.post("/cameras/{camera_id}/move/absolute")
async def move_absolute(camera_id: str, payload: Dict[str, Any] = Body(...)):
    """Positions camera to absolute pan, tilt, and zoom coordinates"""
    state = _get_or_init_state(camera_id)
    state["pan"] = float(payload.get("pan", state["pan"]))
    state["tilt"] = float(payload.get("tilt", state["tilt"]))
    state["zoom"] = float(payload.get("zoom", state["zoom"]))
    state["moving"] = False
    return {"status": "success", "message": f"Camera {camera_id} moved to absolute position", "position": state}


@router.post("/cameras/{camera_id}/move/relative")
async def move_relative(camera_id: str, payload: Dict[str, Any] = Body(...)):
    """Offsets camera pan, tilt, and zoom relatively"""
    state = _get_or_init_state(camera_id)
    state["pan"] = round(state["pan"] + float(payload.get("pan", 0.0)), 2)
    state["tilt"] = round(state["tilt"] + float(payload.get("tilt", 0.0)), 2)
    state["zoom"] = max(1.0, round(state["zoom"] + float(payload.get("zoom", 0.0)), 2))
    state["moving"] = False
    return {"status": "success", "message": f"Camera {camera_id} relative move applied", "position": state}


@router.post("/cameras/{camera_id}/move/continuous")
async def move_continuous(camera_id: str, payload: Dict[str, Any] = Body(...)):
    """Starts continuous PTZ movement with specified velocity vector"""
    state = _get_or_init_state(camera_id)
    state["moving"] = True
    state["status"] = "tracking"
    return {"status": "success", "message": f"Continuous movement active on camera {camera_id}"}


@router.post("/cameras/{camera_id}/stop")
async def stop_ptz(camera_id: str):
    """Halts all active PTZ movements"""
    state = _get_or_init_state(camera_id)
    state["moving"] = False
    state["status"] = "idle"
    return {"status": "success", "message": f"PTZ stopped for camera {camera_id}"}


@router.get("/cameras/{camera_id}/presets")
async def get_presets(camera_id: str):
    """Returns saved PTZ viewpoint presets"""
    presets = _get_or_init_presets(camera_id)
    return {"status": "success", "camera_id": camera_id, "presets": presets}


@router.post("/cameras/{camera_id}/presets")
async def create_preset(camera_id: str, preset: Dict[str, Any] = Body(...)):
    """Saves a new viewpoint preset"""
    presets = _get_or_init_presets(camera_id)
    state = _get_or_init_state(camera_id)
    new_preset = {
        "id": f"p{len(presets) + 1}",
        "name": preset.get("name", f"Preset {len(presets) + 1}"),
        "pan": preset.get("pan", state["pan"]),
        "tilt": preset.get("tilt", state["tilt"]),
        "zoom": preset.get("zoom", state["zoom"]),
    }
    presets.append(new_preset)
    return {"status": "success", "message": "Preset saved", "preset": new_preset}


@router.post("/cameras/{camera_id}/preset")
async def goto_preset(camera_id: str, payload: Dict[str, Any] = Body(...)):
    """Moves PTZ camera directly to a saved preset viewpoint"""
    preset_name = payload.get("preset_name") or payload.get("name")
    presets = _get_or_init_presets(camera_id)
    matched = next((p for p in presets if p["name"].lower() == str(preset_name).lower()), None)
    if not matched and presets:
        matched = presets[0]
    if matched:
        state = _get_or_init_state(camera_id)
        state["pan"] = matched["pan"]
        state["tilt"] = matched["tilt"]
        state["zoom"] = matched["zoom"]
        state["moving"] = False
        return {"status": "success", "message": f"Moved to preset {matched['name']}", "preset": matched}
    raise HTTPException(status_code=404, detail=f"Preset {preset_name} not found")
