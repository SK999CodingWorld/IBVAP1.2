# IBVAP 1.2 — API Contracts & Client-Server Compatibility Audit

> Historical compatibility audit. References to the retired `dashboard/` source tree are not current. The maintained API is documented at runtime in `/docs` under `/api/v1`; current module ownership is in [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md).

> **Document Purpose**: Exhaustive audit of request/response data contracts, schema constraints, serialization conventions, and empirical frontend-to-backend alignment across the IBVAP platform.

---

## Table of Contents
1. [Data Models & Schema Specifications](#1-data-models--schema-specifications)
2. [Enumerations & Constrained Types](#2-enumerations--constrained-types)
3. [API Design & Protocol Consistency Analysis](#3-api-design--protocol-consistency-analysis)
4. [Frontend-Backend Contract Alignment Audit (Discrepancy Matrix)](#4-frontend-backend-contract-alignment-audit-discrepancy-matrix)
5. [Field-Level Discrepancy Registry](#5-field-level-discrepancy-registry)
6. [Remediation Roadmap](#6-remediation-roadmap)

---

## 1. Data Models & Schema Specifications

IBVAP leverages Pydantic v2 schemas located in `backend/app/schemas/` to enforce strict type checking, serialization, and OpenAPI metadata generation.

### File: `backend/app/schemas/alert.py`

#### Model: `AlertBase` (inherits `BaseModel`)

- **Declared Line**: `backend/app/schemas/alert.py:5`

| Field Name | Type Annotation | Default / Nullability | Constraints |
|:---|:---|:---|:---|
| `severity` | `str` | `Required (`...`)` | None |
| `type` | `str` | `Required (`...`)` | None |
| `camera_id` | `int` | `Required (`...`)` | Integer range |
| `object_type` | `Optional[str]` | `None` | Nullable |
| `tracking_id` | `Optional[str]` | `None` | Nullable |
| `confidence` | `Optional[float]` | `None` | Nullable |
| `risk_score` | `Optional[float]` | `None` | Nullable |
| `risk_factors` | `Optional[Any]` | `None` | Nullable |
| `status` | `Optional[str]` | `'new'` | Nullable |
| `assigned_to` | `Optional[int]` | `None` | Nullable |


#### Model: `AlertCreate` (inherits `AlertBase`)

- **Declared Line**: `backend/app/schemas/alert.py:17`

| Field Name | Type Annotation | Default / Nullability | Constraints |
|:---|:---|:---|:---|
| `alert_id` | `str` | `Required (`...`)` | None |


#### Model: `AlertUpdate` (inherits `BaseModel`)

- **Declared Line**: `backend/app/schemas/alert.py:20`

| Field Name | Type Annotation | Default / Nullability | Constraints |
|:---|:---|:---|:---|
| `status` | `Optional[str]` | `None` | Nullable |
| `assigned_to` | `Optional[int]` | `None` | Nullable |


#### Model: `AlertResponse` (inherits `AlertBase`)

- **Declared Line**: `backend/app/schemas/alert.py:24`

| Field Name | Type Annotation | Default / Nullability | Constraints |
|:---|:---|:---|:---|
| `id` | `int` | `Required (`...`)` | Integer range |
| `alert_id` | `str` | `Required (`...`)` | None |
| `created_at` | `datetime` | `Required (`...`)` | None |
| `updated_at` | `Optional[datetime]` | `None` | Nullable |


### File: `backend/app/schemas/auth.py`

#### Model: `LoginRequest` (inherits `BaseModel`)

- **Declared Line**: `backend/app/schemas/auth.py:4`

| Field Name | Type Annotation | Default / Nullability | Constraints |
|:---|:---|:---|:---|
| `username` | `str` | `Required (`...`)` | None |
| `password` | `str` | `Required (`...`)` | None |


#### Model: `TokenResponse` (inherits `BaseModel`)

- **Declared Line**: `backend/app/schemas/auth.py:8`

| Field Name | Type Annotation | Default / Nullability | Constraints |
|:---|:---|:---|:---|
| `access_token` | `str` | `Required (`...`)` | None |
| `token_type` | `str` | `'bearer'` | None |


#### Model: `UserResponse` (inherits `BaseModel`)

- **Declared Line**: `backend/app/schemas/auth.py:12`

| Field Name | Type Annotation | Default / Nullability | Constraints |
|:---|:---|:---|:---|
| `id` | `int` | `Required (`...`)` | Integer range |
| `username` | `str` | `Required (`...`)` | None |
| `email` | `str` | `Required (`...`)` | None |
| `full_name` | `Optional[str]` | `None` | Nullable |
| `role` | `str` | `Required (`...`)` | None |
| `is_active` | `bool` | `Required (`...`)` | None |


### File: `backend/app/schemas/camera.py`

#### Model: `CameraBase` (inherits `BaseModel`)

- **Declared Line**: `backend/app/schemas/camera.py:5`

| Field Name | Type Annotation | Default / Nullability | Constraints |
|:---|:---|:---|:---|
| `camera_id` | `str` | `Required (`...`)` | None |
| `name` | `str` | `Required (`...`)` | None |
| `location` | `Optional[str]` | `None` | Nullable |
| `latitude` | `Optional[float]` | `None` | Nullable |
| `longitude` | `Optional[float]` | `None` | Nullable |
| `rtsp_url` | `Optional[str]` | `None` | Nullable |
| `resolution` | `Optional[str]` | `None` | Nullable |
| `fps` | `Optional[int]` | `None` | Nullable |
| `camera_type` | `Optional[str]` | `None` | Nullable |
| `zone` | `Optional[str]` | `None` | Nullable |
| `status` | `Optional[str]` | `'offline'` | Nullable |
| `night_vision` | `Optional[bool]` | `False` | Nullable |
| `onvif_support` | `Optional[bool]` | `False` | Nullable |


#### Model: `CameraCreate` (inherits `CameraBase`)

- **Declared Line**: `backend/app/schemas/camera.py:20`
- *No additional fields declared (Base pass-through)*



#### Model: `CameraUpdate` (inherits `CameraBase`)

- **Declared Line**: `backend/app/schemas/camera.py:23`

| Field Name | Type Annotation | Default / Nullability | Constraints |
|:---|:---|:---|:---|
| `camera_id` | `Optional[str]` | `None` | Nullable |
| `name` | `Optional[str]` | `None` | Nullable |


#### Model: `CameraResponse` (inherits `CameraBase`)

- **Declared Line**: `backend/app/schemas/camera.py:27`

| Field Name | Type Annotation | Default / Nullability | Constraints |
|:---|:---|:---|:---|
| `id` | `int` | `Required (`...`)` | Integer range |
| `created_at` | `datetime` | `Required (`...`)` | None |
| `updated_at` | `Optional[datetime]` | `None` | Nullable |


#### Model: `CameraHealthResponse` (inherits `BaseModel`)

- **Declared Line**: `backend/app/schemas/camera.py:34`

| Field Name | Type Annotation | Default / Nullability | Constraints |
|:---|:---|:---|:---|
| `id` | `int` | `Required (`...`)` | Integer range |
| `camera_id` | `int` | `Required (`...`)` | Integer range |
| `stream_status` | `Optional[str]` | `None` | Nullable |
| `fps_actual` | `Optional[float]` | `None` | Nullable |
| `latency_ms` | `Optional[int]` | `None` | Nullable |
| `signal_quality` | `Optional[int]` | `None` | Nullable |
| `ai_status` | `Optional[str]` | `None` | Nullable |
| `health_score` | `Optional[int]` | `None` | Nullable |
| `issues` | `Optional[Any]` | `None` | Nullable |
| `timestamp` | `datetime` | `Required (`...`)` | None |


### File: `backend/app/schemas/dashboard.py`

#### Model: `DashboardKPIs` (inherits `BaseModel`)

- **Declared Line**: `backend/app/schemas/dashboard.py:3`

| Field Name | Type Annotation | Default / Nullability | Constraints |
|:---|:---|:---|:---|
| `cameras_online` | `int` | `Required (`...`)` | None |
| `cameras_offline` | `int` | `Required (`...`)` | None |
| `active_alerts` | `int` | `Required (`...`)` | None |
| `critical_incidents` | `int` | `Required (`...`)` | Integer range |
| `people_detected` | `int` | `Required (`...`)` | None |
| `vehicles_detected` | `int` | `Required (`...`)` | None |
| `anpr_reads` | `int` | `Required (`...`)` | None |
| `restricted_zone_events` | `int` | `Required (`...`)` | None |
| `system_health_score` | `float` | `Required (`...`)` | None |
| `ai_processing_fps` | `float` | `Required (`...`)` | None |


### File: `backend/app/schemas/event.py`

#### Model: `DetectionResponse` (inherits `BaseModel`)

- **Declared Line**: `backend/app/schemas/event.py:5`

| Field Name | Type Annotation | Default / Nullability | Constraints |
|:---|:---|:---|:---|
| `id` | `int` | `Required (`...`)` | Integer range |
| `camera_id` | `int` | `Required (`...`)` | Integer range |
| `object_type` | `str` | `Required (`...`)` | None |
| `tracking_id` | `Optional[str]` | `Required (`...`)` | Nullable |
| `confidence` | `float` | `Required (`...`)` | None |
| `bbox_x` | `float` | `Required (`...`)` | None |
| `bbox_y` | `float` | `Required (`...`)` | None |
| `bbox_w` | `float` | `Required (`...`)` | None |
| `bbox_h` | `float` | `Required (`...`)` | None |
| `direction` | `Optional[str]` | `Required (`...`)` | Nullable |
| `speed` | `Optional[float]` | `Required (`...`)` | Nullable |
| `zone` | `Optional[str]` | `Required (`...`)` | Nullable |
| `timestamp` | `datetime` | `Required (`...`)` | None |


#### Model: `TrackResponse` (inherits `BaseModel`)

- **Declared Line**: `backend/app/schemas/event.py:22`

| Field Name | Type Annotation | Default / Nullability | Constraints |
|:---|:---|:---|:---|
| `id` | `int` | `Required (`...`)` | Integer range |
| `tracking_id` | `str` | `Required (`...`)` | None |
| `object_type` | `str` | `Required (`...`)` | None |
| `first_seen` | `datetime` | `Required (`...`)` | None |
| `last_seen` | `datetime` | `Required (`...`)` | None |
| `cameras` | `Any` | `Required (`...`)` | None |
| `path` | `Any` | `Required (`...`)` | None |
| `zone_transitions` | `Any` | `Required (`...`)` | None |
| `status` | `str` | `Required (`...`)` | None |


#### Model: `ANPRReadResponse` (inherits `BaseModel`)

- **Declared Line**: `backend/app/schemas/event.py:35`

| Field Name | Type Annotation | Default / Nullability | Constraints |
|:---|:---|:---|:---|
| `id` | `int` | `Required (`...`)` | Integer range |
| `camera_id` | `int` | `Required (`...`)` | Integer range |
| `plate_number` | `str` | `Required (`...`)` | None |
| `vehicle_type` | `Optional[str]` | `Required (`...`)` | Nullable |
| `confidence` | `float` | `Required (`...`)` | None |
| `plate_image_path` | `Optional[str]` | `Required (`...`)` | Nullable |
| `vehicle_image_path` | `Optional[str]` | `Required (`...`)` | Nullable |
| `timestamp` | `datetime` | `Required (`...`)` | None |


### File: `backend/app/schemas/incident.py`

#### Model: `IncidentBase` (inherits `BaseModel`)

- **Declared Line**: `backend/app/schemas/incident.py:5`

| Field Name | Type Annotation | Default / Nullability | Constraints |
|:---|:---|:---|:---|
| `severity` | `str` | `Required (`...`)` | None |
| `status` | `Optional[str]` | `'detected'` | Nullable |
| `camera_ids` | `Optional[List[int]]` | `None` | Nullable |
| `location` | `Optional[str]` | `None` | Nullable |
| `trigger` | `Optional[str]` | `None` | Nullable |
| `risk_score` | `Optional[float]` | `None` | Nullable |
| `evidence_ids` | `Optional[List[int]]` | `None` | Nullable |
| `related_alert_ids` | `Optional[List[int]]` | `None` | Nullable |
| `related_tracking_ids` | `Optional[List[str]]` | `None` | Nullable |
| `assigned_to` | `Optional[int]` | `None` | Nullable |
| `notes` | `Optional[List[Any]]` | `None` | Nullable |
| `timeline` | `Optional[List[Any]]` | `None` | Nullable |


#### Model: `IncidentCreate` (inherits `IncidentBase`)

- **Declared Line**: `backend/app/schemas/incident.py:19`

| Field Name | Type Annotation | Default / Nullability | Constraints |
|:---|:---|:---|:---|
| `incident_id` | `str` | `Required (`...`)` | None |


#### Model: `IncidentUpdate` (inherits `BaseModel`)

- **Declared Line**: `backend/app/schemas/incident.py:22`

| Field Name | Type Annotation | Default / Nullability | Constraints |
|:---|:---|:---|:---|
| `status` | `Optional[str]` | `None` | Nullable |
| `severity` | `Optional[str]` | `None` | Nullable |
| `assigned_to` | `Optional[int]` | `None` | Nullable |
| `notes` | `Optional[List[Any]]` | `None` | Nullable |
| `timeline` | `Optional[List[Any]]` | `None` | Nullable |


#### Model: `IncidentResponse` (inherits `IncidentBase`)

- **Declared Line**: `backend/app/schemas/incident.py:29`

| Field Name | Type Annotation | Default / Nullability | Constraints |
|:---|:---|:---|:---|
| `id` | `int` | `Required (`...`)` | Integer range |
| `incident_id` | `str` | `Required (`...`)` | None |
| `created_at` | `datetime` | `Required (`...`)` | None |
| `updated_at` | `Optional[datetime]` | `None` | Nullable |


### File: `backend/app/schemas/zone.py`

#### Model: `ZoneBase` (inherits `BaseModel`)

- **Declared Line**: `backend/app/schemas/zone.py:5`

| Field Name | Type Annotation | Default / Nullability | Constraints |
|:---|:---|:---|:---|
| `name` | `str` | `Required (`...`)` | None |
| `camera_id` | `int` | `Required (`...`)` | Integer range |
| `zone_type` | `str` | `Required (`...`)` | None |
| `coordinates` | `Any` | `Required (`...`)` | None |
| `allowed_direction` | `Optional[str]` | `None` | Nullable |
| `time_start` | `Optional[time]` | `None` | Nullable |
| `time_end` | `Optional[time]` | `None` | Nullable |
| `alert_severity` | `Optional[str]` | `'high'` | Nullable |
| `is_active` | `Optional[bool]` | `True` | Nullable |


#### Model: `ZoneCreate` (inherits `ZoneBase`)

- **Declared Line**: `backend/app/schemas/zone.py:16`
- *No additional fields declared (Base pass-through)*



#### Model: `ZoneUpdate` (inherits `ZoneBase`)

- **Declared Line**: `backend/app/schemas/zone.py:19`

| Field Name | Type Annotation | Default / Nullability | Constraints |
|:---|:---|:---|:---|
| `name` | `Optional[str]` | `None` | Nullable |
| `camera_id` | `Optional[int]` | `None` | Nullable |
| `zone_type` | `Optional[str]` | `None` | Nullable |
| `coordinates` | `Optional[Any]` | `None` | Nullable |


#### Model: `ZoneResponse` (inherits `ZoneBase`)

- **Declared Line**: `backend/app/schemas/zone.py:25`

| Field Name | Type Annotation | Default / Nullability | Constraints |
|:---|:---|:---|:---|
| `id` | `int` | `Required (`...`)` | Integer range |
| `created_at` | `datetime` | `Required (`...`)` | None |


## 2. Enumerations & Constrained Types

The backend defines multiple domain enumerations across models (`backend/app/models/`):

### `UserRole` (`backend/app/models/user.py`)
- Values:
  - `admin`: Superuser privileges, key management, KMS rotation, integration config, user management.
  - `operator`: Surveillance wall management, PTZ steering, alert acknowledgment/resolution.
  - `analyst`: Read-only access to analytics, audit logs, and evidence search.
  - `commander`: Tactical command-center oversight, threat escalation.

### `AlertSeverity` (`backend/app/models/alert.py`)
- Values:
  - `critical`: Immediate breach, armed threat, border fence compromise.
  - `high`: Unauthorized vehicle, blacklisted face, virtual perimeter entry.
  - `medium`: Loitering, crowd formation above threshold.
  - `low`: License plate scan, camera latency warning.
  - `info`: System health ping, operator session login.

### `AlertStatus` (`backend/app/models/alert.py`)
- Values:
  - `active`: Unhandled incoming alert.
  - `acknowledged`: Operator has taken ownership.
  - `investigating`: Under tactical or analytical review.
  - `resolved`: Threat cleared or mitigated.
  - `false_positive`: Marked as erroneous trigger.

### `CameraStatus` (`backend/app/models/camera.py`)
- Values:
  - `online`: RTSP stream decoding normally, FPS within nominal range.
  - `offline`: RTSP connection failed or socket timed out.
  - `degraded`: Frame drop rate > 25% or latency > 500ms.
  - `maintenance`: Admin disabled camera for hardware service.

### `IncidentStatus` (`backend/app/models/incident.py`)
- Values:
  - `open`: Initial incident dossier created.
  - `escalated`: Dispatched to tactical units.
  - `under_investigation`: Evidence linking and forensic review in progress.
  - `closed`: Incident post-mortem concluded.

---

## 3. API Design & Protocol Consistency Analysis

### 3.1 Naming Conventions: snake_case vs camelCase
- **Backend Standard**: Strict Python PEP 8 `snake_case` across all Pydantic schemas, database columns, and JSON outputs (e.g. `camera_id`, `created_at`, `bounding_box`, `full_name`, `license_plate`).
- **Frontend Standard**: Mixed:
  - `frontend/src/types/`: Uses `snake_case` in newer components.
  - `dashboard/src/api/types.ts`: Strictly defines `camelCase` properties (e.g. `cameraId`, `createdAt`, `ruleName`, `boundingBox`).
- **Impact**: Without an automated camelCase-to-snake_case serialization middleware, components reading `dashboard/src/` fail to populate UI cards because `response.cameraId` is `undefined` when the server returns `{"camera_id": "CAM-01"}`.

### 3.2 Timestamp Representations
The platform currently exhibits three different timestamp conventions:
1. **ISO 8601 UTC Strings**: Used by SQLAlchemy/Pydantic serialization (`2026-10-03T15:30:00.123456Z`) across `/api/alerts`, `/api/incidents`, `/api/cameras`.
2. **Unix Epoch Floats**: Used in WebSocket telemetry and middleware metrics (`1727951234.5678`) in `/ws/events` and `/api/system/performance-metrics`.
3. **Local Wall-Clock Strings**: Used in simulated telemetry loops (`time.strftime("%H:%M:%S")`) yielding strings like `"15:42:01"`.
- **Inconsistency Assessment**: Frontend parsing code must implement multiple date parsing branches or risk `Invalid Date` rendering in telemetry panels.

### 3.3 Pagination Patterns
- **Standard SQL Pattern**: `/api/cameras`, `/api/alerts`, `/api/audit`, `/api/detections` utilize `skip: int = 0` and `limit: int = 50`.
- **Non-Standard Endpoints**:
  - `/api/anpr/reads`: Uses `limit` but lacks `skip`/`offset`.
  - `/api/evidence/search`: Uses free-text filter without offset pagination.
  - `/api/dashboard/recent-alerts`: Hardcoded `limit=5`, no pagination parameters allowed.
- **Envelope Inconsistency**: Some paginated routes return bare arrays (`[ ... ]`), whereas `/api/evidence` returns a wrapped manifest object `{"items": [...], "total": 120}`.

### 3.4 Response Envelopes
- Pattern A (Bare Entity): Returns direct JSON object or list (e.g. `GET /api/cameras` -> `CameraResponse[]`).
- Pattern B (Success Wrapper): Returns `{"status": "success", "data": ...}` or `{"status": "success", "message": ...}` (e.g. `POST /api/stream/zone`, `POST /api/faces/reload`).
- Pattern C (FastAPI Detail Wrapper): Errors return `{"detail": "..."}` or `{"detail": [...]}`.

---

## 4. Frontend-Backend Contract Alignment Audit (Discrepancy Matrix)

The following matrix represents all contract discrepancies detected between the frontend clients (`frontend/src` and `dashboard/src`) and backend route controllers (`backend/app/api/` and `backend/app/main.py`).

| # | Endpoint / Resource | Client Call Location | Issue Description | Client Expectation | Server Implementation | Severity |
|:---|:---|:---|:---|:---|:---|:---|
| **1** | `/api/cameras/{id}` | `dashboard/src/api/client.ts:70` | HTTP Method Mismatch | `PATCH /api/cameras/${id}` | `PUT /api/cameras/{camera_id}` | **HIGH** |
| **2** | `/api/alerts/rules` | `dashboard/src/api/client.ts:87,91,95` | Missing Backend Router | `GET/POST/DELETE /alerts/rules` | Endpoint does not exist in FastAPI backend | **HIGH** |
| **3** | `/api/recordings/*` | `dashboard/src/api/client.ts:100,104,108` | Missing Route / Domain Shift | `GET/POST /recordings/*` | Handled via `/api/evidence/*` | **HIGH** |
| **4** | `/api/ptz/*` | `dashboard/src/api/client.ts:112-145` | Unmounted PTZ Endpoints | `POST /ptz/cameras/${cameraId}/*` | Root PTZ service not exposed in FastAPI routers | **HIGH** |
| **5** | `/api/analytics/face/watchlist` | `dashboard/src/api/client.ts:150-158` | Path Prefix Mismatch | `/analytics/face/watchlist` | `/api/faces/watchlist` | **MEDIUM** |
| **6** | `/api/alerts/recent` | `frontend/src/services/api.ts:37` | Path Discrepancy | `GET /alerts/recent` | `GET /api/dashboard/recent-alerts` | **MEDIUM** |
| **7** | `/api/events/recent` | `frontend/src/services/api.ts:38` | Path Discrepancy | `GET /events/recent` | `GET /api/dashboard/recent-events` | **MEDIUM** |
| **8** | `/api/auth/login` | `frontend/src/services/api.ts:26-33` | Hardcoded Client Mock Bypass | Mock Promise resolving fake JWT | Real OAuth2 password flow `POST /api/auth/login` | **CRITICAL** |
| **9** | `/ws/events` | `frontend/src/hooks/useWebSocket.ts:12` | Hardcoded Port & Host | `ws://localhost:8000/ws/events` | Fails in Docker/production without dynamic origin | **HIGH** |
| **10** | `/api/zones/{id}/toggle` | `frontend/src/pages/VirtualFences.tsx:217` | HTTP Method Mismatch | `PUT /api/zones/${id}/toggle` | `POST /api/zones/{id}/toggle` | **HIGH** |
| **11** | `/api/ai-models/test/{id}` | `frontend/src/pages/AIModelCenter.tsx:200` | Missing Request Body | `POST /api/ai-models/test/${id}` with empty body | Server expects JSON payload `payload: dict` | **MEDIUM** |
| **12** | `/api/stream/zone` | `backend/app/main.py:295` | HTTP 200 on Error Condition | Expects standard HTTP 400/422 on invalid polygon | Server returns HTTP 200 with `{"status": "error"}` | **MEDIUM** |
| **13** | Documentation Port | `frontend/src/components/security/ApiKeySection.tsx:483-484` | Hardcoded Port Discrepancy | Shows `http://localhost:8001/api/...` | Application runs on port 8000 by default | **LOW** |

---

## 5. Field-Level Discrepancy Registry

### Discrepancy 1: Camera Update Method
- **Endpoint**: `/api/cameras/{id}`
- **Issue**: Client calls `PATCH`, backend defines `PUT`.
- **Expected by client**: `this.patch('/cameras/' + id, updates)` returning `{ message: string }`.
- **Returned by server**: HTTP 405 Method Not Allowed.
- **Evidence**:
  - Client: `dashboard/src/api/client.ts:70`
  - Server: `backend/app/api/cameras.py:65` (`@router.put("/{camera_id}", response_model=CameraResponse)`)
- **Impact**: Camera settings and RTSP URLs cannot be updated from the dashboard settings UI.
- **Recommended Fix**: Add `@router.patch("/{camera_id}")` alias in `cameras.py` or update client to use `PUT`.

### Discrepancy 2: Missing Alert Rules Endpoint
- **Endpoint**: `/api/alerts/rules`
- **Issue**: Dashboard attempts to manage alert rules, but router is omitted.
- **Expected by client**: List of rules, rule creation, rule deletion.
- **Returned by server**: HTTP 404 Not Found.
- **Evidence**:
  - Client: `dashboard/src/api/client.ts:87-95`
  - Server: `backend/app/api/alerts.py` (only implements alerts listing, stats, acknowledge, escalate, resolve).
- **Impact**: Rules configuration UI in dashboard throws unhandled 404 errors.
- **Recommended Fix**: Implement `alerts_rules.py` router or map to alert policy settings.

### Discrepancy 3: Recordings vs Evidence Vault Shift
- **Endpoint**: `/api/recordings/*`
- **Issue**: Legacy dashboard references `/recordings/storage` and `/recordings/cameras/{id}/clips`, whereas backend consolidated all video clips and forensics into `/api/evidence/*`.
- **Expected by client**: `GET /recordings/storage`, `GET /recordings/cameras/${cameraId}/clips`.
- **Returned by server**: HTTP 404 Not Found.
- **Evidence**:
  - Client: `dashboard/src/api/client.ts:100-108`
  - Server: `backend/app/api/evidence.py` (routes: `/api/evidence`, `/api/evidence/search`, `/api/evidence/stats`).
- **Impact**: Dashboard recordings tab fails to load clips.
- **Recommended Fix**: Add compatibility redirect or alias router `/api/recordings` forwarding to `/api/evidence`.

### Discrepancy 4: PTZ ONVIF Endpoints Unmounted
- **Endpoint**: `/api/ptz/cameras/{cameraId}/*`
- **Issue**: Client issues PTZ steering commands, but backend FastAPI app never included the PTZ service router.
- **Expected by client**: Absolute, relative, continuous movement, and presets.
- **Returned by server**: HTTP 404 Not Found.
- **Evidence**:
  - Client: `dashboard/src/api/client.ts:112-145`
  - Server Service: `services/ptz_control/service.py` (implemented in service layer, but absent from `backend/app/main.py`).
- **Impact**: PTZ steering joystick in dashboard produces 404 errors.
- **Recommended Fix**: Create `backend/app/api/ptz.py` exposing `PTZControlService` and include in `main.py`.

### Discrepancy 5: Virtual Fence Toggle HTTP Method
- **Endpoint**: `/api/zones/{id}/toggle`
- **Issue**: Client sends `PUT`, backend expects `POST`.
- **Expected by client**: `axios.put('/api/zones/' + id + '/toggle')`.
- **Returned by server**: HTTP 405 Method Not Allowed.
- **Evidence**:
  - Client: `frontend/src/pages/VirtualFences.tsx:217`
  - Server: `backend/app/api/zones.py:84` (`@router.post("/{id}/toggle")`)
- **Impact**: Operators cannot enable/disable virtual fences from the fence management table.
- **Recommended Fix**: Add `@router.put("/{id}/toggle")` to `zones.py` or switch client to `axios.post`.

### Discrepancy 6: Frontend Mock Authentication Bypass
- **Endpoint**: `/api/auth/login`
- **Issue**: `frontend/src/services/api.ts` implements a client-side mock login promise returning `{ token: 'mock-token' }` instead of calling `POST /api/auth/login`.
- **Expected by client**: Instant mock login without backend interaction.
- **Returned by server**: Server never receives authentication requests from this client.
- **Evidence**:
  - Client: `frontend/src/services/api.ts:26-33`
  - Server: `backend/app/api/auth.py:27`
- **Impact**: Client stores invalid mock JWT token; any secured backend endpoint returning 401 triggers an immediate redirect loop to `/login`.
- **Recommended Fix**: Update `frontend/src/services/api.ts` to execute `api.post('/auth/login', { username, password })`.

---

## 6. Remediation Roadmap

1. **Short-Term (Client Fixes)**:
   - Update `dashboard/src/api/client.ts` to call `PUT /api/cameras/${id}` instead of `PATCH`.
   - Update `frontend/src/pages/VirtualFences.tsx` to call `POST /api/zones/${id}/toggle`.
   - Update `frontend/src/services/api.ts` to call `/api/dashboard/recent-alerts` and `/api/dashboard/recent-events`.
   - Replace mock login in `frontend/src/services/api.ts` with real `POST /api/auth/login`.

2. **Medium-Term (Backend Aliasing & Gateway)**:
   - Mount PTZ control router in `backend/app/api/ptz.py`.
   - Add alias routes for `/api/alerts/recent` and `/api/events/recent` forwarding to dashboard controllers.
   - Add camelCase response alias generator via Pydantic `alias_generator` to ensure dual frontend compatibility.

3. **Long-Term (Protocol Harmonization)**:
   - Normalize all timestamp outputs to RFC 3339 / ISO 8601 UTC across WebSockets and REST APIs.
   - Enforce standard response pagination envelopes `{"items": [...], "total": int, "skip": int, "limit": int}`.
