"""Versioned HTTP API routes."""

from fastapi import APIRouter, Depends
from app.core.security import get_current_active_user

from app.api import (
    ai_models,
    alerts,
    analytics,
    anpr,
    audit,
    auth,
    cameras,
    dashboard,
    detections,
    edge,
    evidence,
    faces,
    incidents,
    map as map_api,
    notifications,
    ptz,
    recordings,
    search,
    security,
    settings as settings_api,
    system,
    tracking,
    users,
    video_intelligence,
    zones,
)

router = APIRouter()

for resource_router in (
    auth.router,
    users.router,
    dashboard.router,
    cameras.router,
    detections.router,
    tracking.router,
    anpr.router,
    zones.router,
    faces.router,
    map_api.router,
    evidence.router,
    audit.router,
    security.router,
    alerts.router,
    incidents.router,
    edge.router,
    analytics.router,
    system.router,
    settings_api.router,
    notifications.router,
    search.router,
    video_intelligence.router,
    ai_models.router,
    ptz.router,
    recordings.router,
):
    # Keep the login/refresh endpoints public as designed; all resource APIs
    # require an active session even when an individual handler forgets to add it.
    if resource_router is auth.router:
        router.include_router(resource_router)
    else:
        router.include_router(resource_router, dependencies=[Depends(get_current_active_user)])
