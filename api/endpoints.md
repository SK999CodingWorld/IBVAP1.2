# IBVAP 1.2 — Comprehensive API Endpoint Reference

> **Platform**: Intelligent Border Video Analytics Platform (IBVAP 1.2)
> **Base URL**: `http://localhost:8000` (Production: `https://<railway-domain>`)
> **Specification Standard**: OpenAPI 3.1 / FastAPI REST + RFC 6455 WebSockets

---

## Table of Contents
- [Untagged Endpoints](#untagged-endpoints)
- [Ai-Models Endpoints](#ai-models-endpoints)
- [Alerts Endpoints](#alerts-endpoints)
- [Analytics Endpoints](#analytics-endpoints)
- [Anpr Endpoints](#anpr-endpoints)
- [Audit Endpoints](#audit-endpoints)
- [Auth Endpoints](#auth-endpoints)
- [Cameras Endpoints](#cameras-endpoints)
- [Dashboard Endpoints](#dashboard-endpoints)
- [Edge Endpoints](#edge-endpoints)
- [Evidence Endpoints](#evidence-endpoints)
- [Faces Endpoints](#faces-endpoints)
- [Health Endpoints](#health-endpoints)
- [Incidents Endpoints](#incidents-endpoints)
- [Map Endpoints](#map-endpoints)
- [Notifications Endpoints](#notifications-endpoints)
- [Search Endpoints](#search-endpoints)
- [Security Endpoints](#security-endpoints)
- [Settings Endpoints](#settings-endpoints)
- [Stream Endpoints](#stream-endpoints)
- [System Endpoints](#system-endpoints)
- [Tracking Endpoints](#tracking-endpoints)
- [Users Endpoints](#users-endpoints)
- [Video-Intelligence Endpoints](#video-intelligence-endpoints)
- [Zones Endpoints](#zones-endpoints)
- [WebSocket Real-Time Protocols](#websocket-real-time-protocols)
- [Server-Sent Events (SSE) Stream](#server-sent-events-sse-stream)

---

## Untagged Endpoints

### `GET /api/detections`

- **Purpose**: List Detections
- **Source Reference**: `app/api/detections.py:7`
- **Authentication / Authorization**: Public (No Auth Required)

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `camera_id` | query | `string` | No | Camera Id |
| `object_type` | query | `string` | No | Object Type |
| `min_confidence` | query | `string` | No | Min Confidence |
| `date_from` | query | `string` | No | Date From |
| `date_to` | query | `string` | No | Date To |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/detections/stats`

- **Purpose**: Detection Stats
- **Source Reference**: `app/api/detections.py:11`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/detections/{id}`

- **Purpose**: Get Detection
- **Source Reference**: `app/api/detections.py:15`
- **Authentication / Authorization**: Public (No Auth Required)

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `id` | path | `string` | Yes | Id |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `404 Not Found` | Requested entity identifier does not exist | `{"detail": "Entity not found"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /`

- **Purpose**: Root
- **Source Reference**: `app/main.py:373`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /{full_path}`

- **Purpose**: Serve Spa
- **Source Reference**: `app/main.py:373`
- **Authentication / Authorization**: Public (No Auth Required)

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `full_path` | path | `string` | Yes | Full Path |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

## Ai-Models Endpoints

### `GET /api/ai-models/list`

- **Purpose**: Get Ai Models
- **Description**: List of all registered AI pipelines and active inference status.
- **Source Reference**: `app/api/ai_models.py:140`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/ai-models/`

- **Purpose**: Get Ai Models
- **Description**: List of all registered AI pipelines and active inference status.
- **Source Reference**: `app/api/ai_models.py:140`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/ai-models`

- **Purpose**: Get Ai Models
- **Description**: List of all registered AI pipelines and active inference status.
- **Source Reference**: `app/api/ai_models.py:140`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/ai-models/capability-matrix`

- **Purpose**: Get Capability Matrix
- **Description**: Complete capability grid reflecting live enabled states.
- **Source Reference**: `app/api/ai_models.py:145`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `POST /api/ai-models/test/{model_id}`

- **Purpose**: Test Model
- **Description**: Runs a simulated live inference pass through the designated neural network pipeline.
- **Source Reference**: `app/api/ai_models.py:166`
- **Authentication / Authorization**: Public (No Auth Required)

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `model_id` | path | `string` | Yes | Model Id |

**Request Body**:
- **Content-Type**: `application/json`
- **Schema**: Generic JSON payload

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

## Alerts Endpoints

### `GET /api/alerts`

- **Purpose**: List Alerts
- **Source Reference**: `app/api/alerts.py:9`
- **Authentication / Authorization**: JWT Bearer Token Required

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `severity` | query | `string` | No | Severity |
| `status` | query | `string` | No | Status |
| `camera_id` | query | `string` | No | Camera Id |
| `type` | query | `string` | No | Type |
| `date_from` | query | `string` | No | Date From |
| `date_to` | query | `string` | No | Date To |
| `skip` | query | `integer` | No | Skip |
| `limit` | query | `integer` | No | Limit |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/alerts/stats/summary`

- **Purpose**: Get Alert Stats
- **Source Reference**: `app/api/alerts.py:55`
- **Authentication / Authorization**: JWT Bearer Token Required
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/alerts/{alert_id}`

- **Purpose**: Get Alert
- **Source Reference**: `app/api/alerts.py:67`
- **Authentication / Authorization**: JWT Bearer Token Required

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `alert_id` | path | `string` | Yes | Alert Id |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `404 Not Found` | Requested entity identifier does not exist | `{"detail": "Entity not found"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `POST /api/alerts/{alert_id}/acknowledge`

- **Purpose**: Acknowledge Alert
- **Source Reference**: `app/api/alerts.py:89`
- **Authentication / Authorization**: JWT Bearer Token Required

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `alert_id` | path | `string` | Yes | Alert Id |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `404 Not Found` | Requested entity identifier does not exist | `{"detail": "Entity not found"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `POST /api/alerts/{alert_id}/escalate`

- **Purpose**: Escalate Alert
- **Source Reference**: `app/api/alerts.py:93`
- **Authentication / Authorization**: JWT Bearer Token Required

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `alert_id` | path | `string` | Yes | Alert Id |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `404 Not Found` | Requested entity identifier does not exist | `{"detail": "Entity not found"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `POST /api/alerts/{alert_id}/resolve`

- **Purpose**: Resolve Alert
- **Source Reference**: `app/api/alerts.py:97`
- **Authentication / Authorization**: JWT Bearer Token Required

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `alert_id` | path | `string` | Yes | Alert Id |

**Request Body**:
- **Content-Type**: `application/json`
- **Schema**: Generic JSON payload

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `404 Not Found` | Requested entity identifier does not exist | `{"detail": "Entity not found"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `POST /api/alerts/{alert_id}/false-positive`

- **Purpose**: Mark False Positive
- **Source Reference**: `app/api/alerts.py:101`
- **Authentication / Authorization**: JWT Bearer Token Required

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `alert_id` | path | `string` | Yes | Alert Id |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `404 Not Found` | Requested entity identifier does not exist | `{"detail": "Entity not found"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `POST /api/alerts/{alert_id}/incident`

- **Purpose**: Create Incident From Alert
- **Source Reference**: `app/api/alerts.py:105`
- **Authentication / Authorization**: JWT Bearer Token Required

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `alert_id` | path | `string` | Yes | Alert Id |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `404 Not Found` | Requested entity identifier does not exist | `{"detail": "Entity not found"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

## Analytics Endpoints

### `GET /api/analytics/surveillance`

- **Purpose**: Get Surveillance Analytics
- **Source Reference**: `app/api/analytics.py:10`
- **Authentication / Authorization**: JWT Bearer Token Required
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/analytics/security`

- **Purpose**: Get Security Analytics
- **Source Reference**: `app/api/analytics.py:27`
- **Authentication / Authorization**: JWT Bearer Token Required
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/analytics/anpr`

- **Purpose**: Get Anpr Analytics
- **Source Reference**: `app/api/analytics.py:43`
- **Authentication / Authorization**: JWT Bearer Token Required
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/analytics/cameras`

- **Purpose**: Get Camera Analytics
- **Source Reference**: `app/api/analytics.py:65`
- **Authentication / Authorization**: JWT Bearer Token Required
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/analytics/ai`

- **Purpose**: Get Ai Analytics
- **Source Reference**: `app/api/analytics.py:85`
- **Authentication / Authorization**: JWT Bearer Token Required
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/analytics/overview`

- **Purpose**: Get Analytics Overview
- **Source Reference**: `app/api/analytics.py:101`
- **Authentication / Authorization**: JWT Bearer Token Required
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/analytics/heatmap`

- **Purpose**: Get Heatmap Analytics
- **Description**: Returns geospatial activity density clusters, sector hot spots, and 24h timeline
- **Source Reference**: `app/api/analytics.py:112`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

## Anpr Endpoints

### `GET /api/anpr/reads`

- **Purpose**: List Anpr Reads
- **Description**: Returns persistent ANPR vehicle plate read history with Doppler radar speeds and hotlist tags
- **Source Reference**: `app/api/anpr.py:9`
- **Authentication / Authorization**: Public (No Auth Required)

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `plate` | query | `string` | No | Plate |
| `camera` | query | `string` | No | Camera |
| `type` | query | `string` | No | Type |
| `flagged_only` | query | `boolean` | No | Flagged Only |
| `limit` | query | `integer` | No | Limit |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/anpr/search/{plate}`

- **Purpose**: Search Plate
- **Description**: Searches vehicle plate history by exact or partial plate number
- **Source Reference**: `app/api/anpr.py:26`
- **Authentication / Authorization**: Public (No Auth Required)

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `plate` | path | `string` | Yes | Plate |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/anpr/stats`

- **Purpose**: Anpr Stats
- **Description**: Returns total ANPR vehicle reads, unique plates, vehicle distribution, and hotlist count
- **Source Reference**: `app/api/anpr.py:32`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/anpr/hotlist`

- **Purpose**: Get Hotlist
- **Description**: Returns list of active vehicles on the BOLO / Hotlist watchlist
- **Source Reference**: `app/api/anpr.py:38`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `POST /api/anpr/hotlist`

- **Purpose**: Add To Hotlist
- **Description**: Flags a vehicle plate onto the BOLO hotlist
- **Source Reference**: `app/api/anpr.py:44`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)

**Request Body**:
- **Content-Type**: `application/json`
- **Schema**: Generic JSON payload

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `DELETE /api/anpr/hotlist/{plate}`

- **Purpose**: Remove From Hotlist
- **Description**: Removes a vehicle plate from the active hotlist
- **Source Reference**: `app/api/anpr.py:57`
- **Authentication / Authorization**: Public (No Auth Required)

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `plate` | path | `string` | Yes | Plate |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/anpr/vahan/{plate}`

- **Purpose**: Verify Vahan Registry
- **Description**: Queries Indian Ministry of Road Transport (MoRTH) VAHAN database for vehicle ownership & legal status
- **Source Reference**: `app/api/anpr.py:63`
- **Authentication / Authorization**: Public (No Auth Required)

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `plate` | path | `string` | Yes | Plate |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `POST /api/anpr/simulate-scan`

- **Purpose**: Simulate Scan
- **Description**: Triggers an on-demand OCR plate recognition scan at a border checkpoint
- **Source Reference**: `app/api/anpr.py:69`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)

**Request Body**:
- **Content-Type**: `application/json`
- **Schema**: Generic JSON payload

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

## Audit Endpoints

### `GET /api/audit/`

- **Purpose**: List Audit Logs
- **Source Reference**: `app/api/audit.py:10`
- **Authentication / Authorization**: JWT Bearer Token Required

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `user` | query | `string` | No | User |
| `action` | query | `string` | No | Action |
| `resource_type` | query | `string` | No | Resource Type |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/audit`

- **Purpose**: List Audit Logs
- **Source Reference**: `app/api/audit.py:10`
- **Authentication / Authorization**: JWT Bearer Token Required

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `user` | query | `string` | No | User |
| `action` | query | `string` | No | Action |
| `resource_type` | query | `string` | No | Resource Type |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/audit/stats`

- **Purpose**: Get Audit Stats
- **Source Reference**: `app/api/audit.py:14`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

## Auth Endpoints

### `POST /api/auth/login`

- **Purpose**: Login
- **Source Reference**: `app/api/auth.py:17`
- **Authentication / Authorization**: Public (No Auth Required) (Requires Role: `operator` or `admin`)
- **Request Parameters**: None (No path or query parameters)

**Request Body**:
- **Content-Type**: `application/json`
- **Schema Model**: `LoginRequest`

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `TokenResponse` |
| `422` | Validation Error | `HTTPValidationError` |
| `403 Forbidden` | Insufficient role permissions | `{"detail": "Operation not permitted for current role"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Database write (commit)

---

### `POST /api/auth/refresh`

- **Purpose**: Refresh Token
- **Source Reference**: `app/api/auth.py:46`
- **Authentication / Authorization**: JWT Bearer Token Required
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `TokenResponse` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/auth/me`

- **Purpose**: Get Me
- **Source Reference**: `app/api/auth.py:51`
- **Authentication / Authorization**: JWT Bearer Token Required
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `UserResponse` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

## Cameras Endpoints

### `GET /api/cameras`

- **Purpose**: List Cameras
- **Source Reference**: `app/api/cameras.py:43`
- **Authentication / Authorization**: JWT Bearer Token Required

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `status` | query | `string` | No | Status |
| `zone` | query | `string` | No | Zone |
| `skip` | query | `integer` | No | Skip |
| `limit` | query | `integer` | No | Limit |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `POST /api/cameras`

- **Purpose**: Create Camera
- **Source Reference**: `app/api/cameras.py:104`
- **Authentication / Authorization**: JWT Bearer Token Required
- **Request Parameters**: None (No path or query parameters)

**Request Body**:
- **Content-Type**: `application/json`
- **Schema Model**: `CameraCreate`

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/cameras/health/summary`

- **Purpose**: Get Health Summary
- **Source Reference**: `app/api/cameras.py:66`
- **Authentication / Authorization**: JWT Bearer Token Required
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/cameras/{camera_id}`

- **Purpose**: Get Camera
- **Source Reference**: `app/api/cameras.py:94`
- **Authentication / Authorization**: JWT Bearer Token Required

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `camera_id` | path | `string` | Yes | Camera Id |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `404 Not Found` | Requested entity identifier does not exist | `{"detail": "Entity not found"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `PUT /api/cameras/{camera_id}`

- **Purpose**: Update Camera
- **Source Reference**: `app/api/cameras.py:110`
- **Authentication / Authorization**: JWT Bearer Token Required

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `camera_id` | path | `string` | Yes | Camera Id |

**Request Body**:
- **Content-Type**: `application/json`
- **Schema Model**: `CameraBase`

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `404 Not Found` | Requested entity identifier does not exist | `{"detail": "Entity not found"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `DELETE /api/cameras/{camera_id}`

- **Purpose**: Delete Camera
- **Source Reference**: `app/api/cameras.py:120`
- **Authentication / Authorization**: JWT Bearer Token Required

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `camera_id` | path | `string` | Yes | Camera Id |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `404 Not Found` | Requested entity identifier does not exist | `{"detail": "Entity not found"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `POST /api/cameras/{camera_id}/test`

- **Purpose**: Test Camera
- **Source Reference**: `app/api/cameras.py:127`
- **Authentication / Authorization**: JWT Bearer Token Required

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `camera_id` | path | `string` | Yes | Camera Id |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `404 Not Found` | Requested entity identifier does not exist | `{"detail": "Entity not found"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `POST /api/cameras/{camera_id}/restart`

- **Purpose**: Restart Camera
- **Source Reference**: `app/api/cameras.py:133`
- **Authentication / Authorization**: JWT Bearer Token Required

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `camera_id` | path | `string` | Yes | Camera Id |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `404 Not Found` | Requested entity identifier does not exist | `{"detail": "Entity not found"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/cameras/{camera_id}/health`

- **Purpose**: Camera Health
- **Source Reference**: `app/api/cameras.py:139`
- **Authentication / Authorization**: JWT Bearer Token Required

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `camera_id` | path | `string` | Yes | Camera Id |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `404 Not Found` | Requested entity identifier does not exist | `{"detail": "Entity not found"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/cameras/{camera_id}/stream`

- **Purpose**: Camera Stream
- **Description**: Returns the live MJPEG stream for this camera
- **Source Reference**: `app/api/cameras.py:145`
- **Authentication / Authorization**: Public (No Auth Required)

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `camera_id` | path | `string` | Yes | Camera Id |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `404 Not Found` | Requested entity identifier does not exist | `{"detail": "Entity not found"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

## Dashboard Endpoints

### `GET /api/dashboard/kpis`

- **Purpose**: Get Kpis
- **Source Reference**: `app/api/dashboard.py:21`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `DashboardKPIs` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/dashboard/recent-alerts`

- **Purpose**: Get Recent Alerts
- **Source Reference**: `app/api/dashboard.py:58`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/dashboard/recent-events`

- **Purpose**: Get Recent Events
- **Source Reference**: `app/api/dashboard.py:65`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

## Edge Endpoints

### `GET /api/edge/status`

- **Purpose**: Get Edge Status
- **Source Reference**: `app/api/edge.py:9`
- **Authentication / Authorization**: JWT Bearer Token Required
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/edge/nodes`

- **Purpose**: Get Edge Nodes
- **Source Reference**: `app/api/edge.py:13`
- **Authentication / Authorization**: JWT Bearer Token Required
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/edge/nodes/{node_id}`

- **Purpose**: Get Edge Node
- **Source Reference**: `app/api/edge.py:23`
- **Authentication / Authorization**: JWT Bearer Token Required

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `node_id` | path | `string` | Yes | Node Id |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `POST /api/edge/network/{status}`

- **Purpose**: Set Network Status
- **Source Reference**: `app/api/edge.py:30`
- **Authentication / Authorization**: JWT Bearer Token Required

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `status` | path | `string` | Yes | Status |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `POST /api/edge/sync/{node_id}`

- **Purpose**: Sync Node
- **Source Reference**: `app/api/edge.py:37`
- **Authentication / Authorization**: JWT Bearer Token Required

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `node_id` | path | `string` | Yes | Node Id |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `POST /api/edge/sync/all`

- **Purpose**: Sync All Nodes
- **Source Reference**: `app/api/edge.py:44`
- **Authentication / Authorization**: JWT Bearer Token Required
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/edge/bandwidth`

- **Purpose**: Get Bandwidth Savings
- **Source Reference**: `app/api/edge.py:51`
- **Authentication / Authorization**: JWT Bearer Token Required
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

## Evidence Endpoints

### `GET /api/evidence/search`

- **Purpose**: Search Evidence
- **Description**: Search and filter forensic evidence cases by object type, alert type,
severity level, camera, or text keywords.
- **Source Reference**: `app/api/evidence.py:12`
- **Authentication / Authorization**: Public (No Auth Required)

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `q` | query | `string` | No | Q |
| `object_type` | query | `string` | No | Object Type |
| `alert_type` | query | `string` | No | Alert Type |
| `severity` | query | `string` | No | Severity |
| `camera_id` | query | `string` | No | Camera Id |
| `limit` | query | `integer` | No | Limit |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/evidence/`

- **Purpose**: Search Evidence
- **Description**: Search and filter forensic evidence cases by object type, alert type,
severity level, camera, or text keywords.
- **Source Reference**: `app/api/evidence.py:12`
- **Authentication / Authorization**: Public (No Auth Required)

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `q` | query | `string` | No | Q |
| `object_type` | query | `string` | No | Object Type |
| `alert_type` | query | `string` | No | Alert Type |
| `severity` | query | `string` | No | Severity |
| `camera_id` | query | `string` | No | Camera Id |
| `limit` | query | `integer` | No | Limit |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/evidence`

- **Purpose**: Search Evidence
- **Description**: Search and filter forensic evidence cases by object type, alert type,
severity level, camera, or text keywords.
- **Source Reference**: `app/api/evidence.py:12`
- **Authentication / Authorization**: Public (No Auth Required)

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `q` | query | `string` | No | Q |
| `object_type` | query | `string` | No | Object Type |
| `alert_type` | query | `string` | No | Alert Type |
| `severity` | query | `string` | No | Severity |
| `camera_id` | query | `string` | No | Camera Id |
| `limit` | query | `integer` | No | Limit |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/evidence/stats`

- **Purpose**: Get Evidence Stats
- **Description**: Returns total cases, severity distribution, and vault status
- **Source Reference**: `app/api/evidence.py:35`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/evidence/snapshot/{filename}`

- **Purpose**: Get Evidence Snapshot
- **Description**: Serves the high-resolution cropped forensic snapshot image
- **Source Reference**: `app/api/evidence.py:41`
- **Authentication / Authorization**: Public (No Auth Required)

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `filename` | path | `string` | Yes | Filename |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/evidence/{case_id}/manifest`

- **Purpose**: Get Case Manifest
- **Description**: Generates an evidentiary tamper-evident manifest with SHA-256 cryptographic signature
- **Source Reference**: `app/api/evidence.py:60`
- **Authentication / Authorization**: Public (No Auth Required)

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `case_id` | path | `string` | Yes | Case Id |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `POST /api/evidence/{case_id}/resolve`

- **Purpose**: Resolve Case
- **Description**: Marks an evidence case as RESOLVED in the database
- **Source Reference**: `app/api/evidence.py:87`
- **Authentication / Authorization**: Public (No Auth Required)

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `case_id` | path | `string` | Yes | Case Id |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `POST /api/evidence/{case_id}/status`

- **Purpose**: Set Case Status
- **Description**: Sets a custom status for an evidence case
- **Source Reference**: `app/api/evidence.py:101`
- **Authentication / Authorization**: Public (No Auth Required)

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `case_id` | path | `string` | Yes | Case Id |

**Request Body**:
- **Content-Type**: `application/json`
- **Schema**: Generic JSON payload

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/evidence/{case_id}`

- **Purpose**: Get Case Details
- **Description**: Returns details for a single forensic evidence case
- **Source Reference**: `app/api/evidence.py:110`
- **Authentication / Authorization**: Public (No Auth Required)

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `case_id` | path | `string` | Yes | Case Id |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

## Faces Endpoints

### `GET /api/faces/watchlist`

- **Purpose**: Get Face Watchlist
- **Description**: Returns loaded known faces and blacklist status
- **Source Reference**: `app/main.py:312`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `POST /api/faces/watchlist`

- **Purpose**: Add To Watchlist
- **Description**: Uploads a new face image and registers it into the face recognition watchlist
- **Source Reference**: `app/api/faces.py:58`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)

**Request Body**:
- **Content-Type**: `multipart/form-data`
- **Schema Model**: `Body_add_to_watchlist_api_faces_watchlist_post`

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/faces/detections`

- **Purpose**: List Face Detections
- **Description**: Returns recognized watchlist faces and identification events
- **Source Reference**: `app/api/faces.py:18`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/faces/config`

- **Purpose**: Get Face Config
- **Description**: Returns face recognition engine configuration & threshold
- **Source Reference**: `app/api/faces.py:29`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `PUT /api/faces/config`

- **Purpose**: Update Face Config
- **Description**: Updates face recognition engine configuration and similarity threshold
- **Source Reference**: `app/api/faces.py:44`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)

**Request Body**:
- **Content-Type**: `application/json`
- **Schema**: Generic JSON payload

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `DELETE /api/faces/watchlist/{name}`

- **Purpose**: Delete From Watchlist
- **Description**: Removes a face profile from the watchlist database
- **Source Reference**: `app/api/faces.py:88`
- **Authentication / Authorization**: Public (No Auth Required)

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `name` | path | `string` | Yes | Name |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `POST /api/faces/reload`

- **Purpose**: Reload Face Watchlist
- **Description**: Reloads known faces database from directory
- **Source Reference**: `app/main.py:318`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

## Health Endpoints

### `GET /health`

- **Purpose**: Public Health
- **Description**: Lightweight 200 OK healthcheck for container orchestrators and load balancers.
- **Source Reference**: `app/main.py:150`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/health`

- **Purpose**: Health Check
- **Source Reference**: `app/main.py:155`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/health/keys`

- **Purpose**: Key Health Check
- **Description**: Masked diagnostics of configured credentials, database, and cache without exposing secrets.
- **Source Reference**: `app/main.py:168`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Cache interaction (Redis)

---

### `GET /health/keys`

- **Purpose**: Key Health Check
- **Description**: Masked diagnostics of configured credentials, database, and cache without exposing secrets.
- **Source Reference**: `app/main.py:168`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Cache interaction (Redis)

---

## Incidents Endpoints

### `GET /api/incidents`

- **Purpose**: List Incidents
- **Source Reference**: `app/api/incidents.py:9`
- **Authentication / Authorization**: JWT Bearer Token Required

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `skip` | query | `integer` | No | Skip |
| `limit` | query | `integer` | No | Limit |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `POST /api/incidents`

- **Purpose**: Create Incident
- **Source Reference**: `app/api/incidents.py:73`
- **Authentication / Authorization**: JWT Bearer Token Required
- **Request Parameters**: None (No path or query parameters)

**Request Body**:
- **Content-Type**: `application/json`
- **Schema**: Generic JSON payload

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/incidents/stats/summary`

- **Purpose**: Get Incident Stats
- **Source Reference**: `app/api/incidents.py:40`
- **Authentication / Authorization**: JWT Bearer Token Required
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/incidents/{incident_id}`

- **Purpose**: Get Incident
- **Source Reference**: `app/api/incidents.py:49`
- **Authentication / Authorization**: JWT Bearer Token Required

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `incident_id` | path | `string` | Yes | Incident Id |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `404 Not Found` | Requested entity identifier does not exist | `{"detail": "Entity not found"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `PUT /api/incidents/{incident_id}`

- **Purpose**: Update Incident
- **Source Reference**: `app/api/incidents.py:77`
- **Authentication / Authorization**: JWT Bearer Token Required

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `incident_id` | path | `string` | Yes | Incident Id |

**Request Body**:
- **Content-Type**: `application/json`
- **Schema**: Generic JSON payload

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `404 Not Found` | Requested entity identifier does not exist | `{"detail": "Entity not found"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `POST /api/incidents/{incident_id}/assign`

- **Purpose**: Assign Incident
- **Source Reference**: `app/api/incidents.py:81`
- **Authentication / Authorization**: JWT Bearer Token Required

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `incident_id` | path | `string` | Yes | Incident Id |

**Request Body**:
- **Content-Type**: `application/json`
- **Schema**: Generic JSON payload

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `404 Not Found` | Requested entity identifier does not exist | `{"detail": "Entity not found"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `POST /api/incidents/{incident_id}/note`

- **Purpose**: Add Note
- **Source Reference**: `app/api/incidents.py:85`
- **Authentication / Authorization**: JWT Bearer Token Required

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `incident_id` | path | `string` | Yes | Incident Id |

**Request Body**:
- **Content-Type**: `application/json`
- **Schema**: Generic JSON payload

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `404 Not Found` | Requested entity identifier does not exist | `{"detail": "Entity not found"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `POST /api/incidents/{incident_id}/status`

- **Purpose**: Update Status
- **Source Reference**: `app/api/incidents.py:89`
- **Authentication / Authorization**: JWT Bearer Token Required

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `incident_id` | path | `string` | Yes | Incident Id |

**Request Body**:
- **Content-Type**: `application/json`
- **Schema**: Generic JSON payload

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `404 Not Found` | Requested entity identifier does not exist | `{"detail": "Entity not found"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `POST /api/incidents/{incident_id}/evidence`

- **Purpose**: Link Evidence
- **Source Reference**: `app/api/incidents.py:93`
- **Authentication / Authorization**: JWT Bearer Token Required

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `incident_id` | path | `string` | Yes | Incident Id |

**Request Body**:
- **Content-Type**: `application/json`
- **Schema**: Generic JSON payload

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `404 Not Found` | Requested entity identifier does not exist | `{"detail": "Entity not found"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

## Map Endpoints

### `GET /api/map/cameras`

- **Purpose**: Get Map Cameras
- **Source Reference**: `app/api/map.py:7`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/map/incidents`

- **Purpose**: Get Map Incidents
- **Source Reference**: `app/api/map.py:20`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/map/zones`

- **Purpose**: Get Map Zones
- **Source Reference**: `app/api/map.py:26`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/map/tracks`

- **Purpose**: Get Map Tracks
- **Source Reference**: `app/api/map.py:32`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/map/alerts`

- **Purpose**: Get Map Alerts
- **Source Reference**: `app/api/map.py:38`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

## Notifications Endpoints

### `GET /api/notifications`

- **Purpose**: Get Notifications
- **Source Reference**: `app/api/notifications.py:54`
- **Authentication / Authorization**: JWT Bearer Token Required

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `unread_only` | query | `boolean` | No | Unread Only |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `POST /api/notifications/{notification_id}/read`

- **Purpose**: Mark As Read
- **Source Reference**: `app/api/notifications.py:60`
- **Authentication / Authorization**: JWT Bearer Token Required

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `notification_id` | path | `string` | Yes | Notification Id |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `POST /api/notifications/read-all`

- **Purpose**: Mark All As Read
- **Source Reference**: `app/api/notifications.py:68`
- **Authentication / Authorization**: JWT Bearer Token Required
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/notifications/unread-count`

- **Purpose**: Get Unread Count
- **Source Reference**: `app/api/notifications.py:74`
- **Authentication / Authorization**: JWT Bearer Token Required
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

## Search Endpoints

### `GET /api/search`

- **Purpose**: Global Search
- **Source Reference**: `app/api/search.py:10`
- **Authentication / Authorization**: JWT Bearer Token Required

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `q` | query | `string` | Yes | Q |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

## Security Endpoints

### `GET /api/security/overview`

- **Purpose**: Get Security Overview
- **Source Reference**: `app/api/security.py:231`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/security/api-keys`

- **Purpose**: List Api Keys
- **Description**: Returns all issued API keys and metadata
- **Source Reference**: `app/api/security.py:248`
- **Authentication / Authorization**: Public (No Auth Required) (Requires Role: `admin`)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `403 Forbidden` | Insufficient role permissions | `{"detail": "Operation not permitted for current role"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `POST /api/security/api-keys`

- **Purpose**: Create Api Key
- **Description**: Generates a new military-grade API key token
- **Source Reference**: `app/api/security.py:258`
- **Authentication / Authorization**: Public (No Auth Required) (Requires Role: `admin`)
- **Request Parameters**: None (No path or query parameters)

**Request Body**:
- **Content-Type**: `application/json`
- **Schema Model**: `CreateApiKeyRequest`

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `403 Forbidden` | Insufficient role permissions | `{"detail": "Operation not permitted for current role"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `DELETE /api/security/api-keys/{key_id}`

- **Purpose**: Revoke Api Key
- **Description**: Revokes an API key
- **Source Reference**: `app/api/security.py:291`
- **Authentication / Authorization**: Public (No Auth Required) (Requires Role: `admin`)

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `key_id` | path | `string` | Yes | Key Id |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `403 Forbidden` | Insufficient role permissions | `{"detail": "Operation not permitted for current role"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `POST /api/security/api-keys/{key_id}/regenerate`

- **Purpose**: Regenerate Api Key
- **Description**: Regenerates a revoked or active API key token
- **Source Reference**: `app/api/security.py:300`
- **Authentication / Authorization**: Public (No Auth Required) (Requires Role: `admin`)

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `key_id` | path | `string` | Yes | Key Id |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `403 Forbidden` | Insufficient role permissions | `{"detail": "Operation not permitted for current role"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `POST /api/security/api-keys/test`

- **Purpose**: Test Api Key Endpoint
- **Description**: Simulates an interactive test request from the API Keys console sandbox
- **Source Reference**: `app/api/security.py:321`
- **Authentication / Authorization**: Public (No Auth Required) (Requires Role: `admin`)
- **Request Parameters**: None (No path or query parameters)

**Request Body**:
- **Content-Type**: `application/json`
- **Schema Model**: `TestApiKeyRequest`

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `403 Forbidden` | Insufficient role permissions | `{"detail": "Operation not permitted for current role"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/security/integrations`

- **Purpose**: List Integrations
- **Description**: Lists all configured external C4ISR networks, webhooks, and device bridges
- **Source Reference**: `app/api/security.py:392`
- **Authentication / Authorization**: Public (No Auth Required) (Requires Role: `admin`)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `403 Forbidden` | Insufficient role permissions | `{"detail": "Operation not permitted for current role"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `POST /api/security/integrations`

- **Purpose**: Create Integration
- **Description**: Registers a new external tactical integration or webhook
- **Source Reference**: `app/api/security.py:402`
- **Authentication / Authorization**: Public (No Auth Required) (Requires Role: `admin`)
- **Request Parameters**: None (No path or query parameters)

**Request Body**:
- **Content-Type**: `application/json`
- **Schema Model**: `CreateIntegrationRequest`

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `403 Forbidden` | Insufficient role permissions | `{"detail": "Operation not permitted for current role"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `POST /api/security/integrations/{int_id}/test`

- **Purpose**: Test Integration Connection
- **Description**: Sends a live ping handshake packet to the designated external integration
- **Source Reference**: `app/api/security.py:428`
- **Authentication / Authorization**: Public (No Auth Required) (Requires Role: `admin`)

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `int_id` | path | `string` | Yes | Int Id |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `403 Forbidden` | Insufficient role permissions | `{"detail": "Operation not permitted for current role"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `PUT /api/security/integrations/{int_id}/toggle`

- **Purpose**: Toggle Integration
- **Description**: Toggles an integration between active and paused states
- **Source Reference**: `app/api/security.py:451`
- **Authentication / Authorization**: Public (No Auth Required) (Requires Role: `admin`)

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `int_id` | path | `string` | Yes | Int Id |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `403 Forbidden` | Insufficient role permissions | `{"detail": "Operation not permitted for current role"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `DELETE /api/security/integrations/{int_id}`

- **Purpose**: Delete Integration
- **Description**: Removes an integration from the platform
- **Source Reference**: `app/api/security.py:465`
- **Authentication / Authorization**: Public (No Auth Required) (Requires Role: `admin`)

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `int_id` | path | `string` | Yes | Int Id |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `403 Forbidden` | Insufficient role permissions | `{"detail": "Operation not permitted for current role"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/security/active-sessions`

- **Purpose**: Get Active Sessions
- **Source Reference**: `app/api/security.py:477`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `DELETE /api/security/active-sessions/{session_id}`

- **Purpose**: Terminate Session
- **Description**: Terminates an active operator session immediately
- **Source Reference**: `app/api/security.py:481`
- **Authentication / Authorization**: Public (No Auth Required)

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `session_id` | path | `string` | Yes | Session Id |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `POST /api/security/kms/rotate`

- **Purpose**: Rotate Kms Key
- **Description**: Performs cryptographic re-keying and key-wrap rotation on hardware HSM
- **Source Reference**: `app/api/security.py:499`
- **Authentication / Authorization**: Public (No Auth Required) (Requires Role: `admin`)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `403 Forbidden` | Insufficient role permissions | `{"detail": "Operation not permitted for current role"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/security/auth-events`

- **Purpose**: Get Auth Events
- **Source Reference**: `app/api/security.py:517`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/security/failed-logins`

- **Purpose**: Get Failed Logins
- **Source Reference**: `app/api/security.py:526`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/security/encryption-status`

- **Purpose**: Get Encryption Status
- **Source Reference**: `app/api/security.py:533`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

## Settings Endpoints

### `GET /api/settings`

- **Purpose**: Get All Settings
- **Source Reference**: `app/api/settings.py:37`
- **Authentication / Authorization**: JWT Bearer Token Required
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `PUT /api/settings`

- **Purpose**: Update Settings
- **Source Reference**: `app/api/settings.py:41`
- **Authentication / Authorization**: JWT Bearer Token Required
- **Request Parameters**: None (No path or query parameters)

**Request Body**:
- **Content-Type**: `application/json`
- **Schema**: Generic JSON payload

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/settings/ai`

- **Purpose**: Get Ai Settings
- **Source Reference**: `app/api/settings.py:48`
- **Authentication / Authorization**: JWT Bearer Token Required
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `PUT /api/settings/ai`

- **Purpose**: Update Ai Settings
- **Source Reference**: `app/api/settings.py:52`
- **Authentication / Authorization**: JWT Bearer Token Required
- **Request Parameters**: None (No path or query parameters)

**Request Body**:
- **Content-Type**: `application/json`
- **Schema**: Generic JSON payload

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/settings/notifications`

- **Purpose**: Get Notification Settings
- **Source Reference**: `app/api/settings.py:57`
- **Authentication / Authorization**: JWT Bearer Token Required
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `PUT /api/settings/notifications`

- **Purpose**: Update Notification Settings
- **Source Reference**: `app/api/settings.py:61`
- **Authentication / Authorization**: JWT Bearer Token Required
- **Request Parameters**: None (No path or query parameters)

**Request Body**:
- **Content-Type**: `application/json`
- **Schema**: Generic JSON payload

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/settings/thresholds`

- **Purpose**: Get Thresholds
- **Source Reference**: `app/api/settings.py:66`
- **Authentication / Authorization**: JWT Bearer Token Required
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `PUT /api/settings/thresholds`

- **Purpose**: Update Thresholds
- **Source Reference**: `app/api/settings.py:70`
- **Authentication / Authorization**: JWT Bearer Token Required
- **Request Parameters**: None (No path or query parameters)

**Request Body**:
- **Content-Type**: `application/json`
- **Schema**: Generic JSON payload

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

## Stream Endpoints

### `GET /api/stream/feed/{camera_id}`

- **Purpose**: Video Feed
- **Description**: Real-time MJPEG live stream with annotated YOLO & ByteTrack overlays
- **Source Reference**: `app/main.py:205`
- **Authentication / Authorization**: Public (No Auth Required)

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `camera_id` | path | `string` | Yes | Camera Id |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `404 Not Found` | Requested entity identifier does not exist | `{"detail": "Entity not found"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/stream/feed`

- **Purpose**: Video Feed
- **Description**: Real-time MJPEG live stream with annotated YOLO & ByteTrack overlays
- **Source Reference**: `app/main.py:205`
- **Authentication / Authorization**: Public (No Auth Required)

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `camera_id` | query | `string` | No | Camera Id |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /video_feed/{camera_id}`

- **Purpose**: Video Feed
- **Description**: Real-time MJPEG live stream with annotated YOLO & ByteTrack overlays
- **Source Reference**: `app/main.py:205`
- **Authentication / Authorization**: Public (No Auth Required)

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `camera_id` | path | `string` | Yes | Camera Id |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `404 Not Found` | Requested entity identifier does not exist | `{"detail": "Entity not found"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /video_feed`

- **Purpose**: Video Feed
- **Description**: Real-time MJPEG live stream with annotated YOLO & ByteTrack overlays
- **Source Reference**: `app/main.py:205`
- **Authentication / Authorization**: Public (No Auth Required)

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `camera_id` | query | `string` | No | Camera Id |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/stream/heatmap/{camera_id}`

- **Purpose**: Heatmap Feed
- **Description**: Cumulative foot-traffic motion heatmap MJPEG stream
- **Source Reference**: `app/main.py:215`
- **Authentication / Authorization**: Public (No Auth Required)

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `camera_id` | path | `string` | Yes | Camera Id |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `404 Not Found` | Requested entity identifier does not exist | `{"detail": "Entity not found"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/stream/heatmap`

- **Purpose**: Heatmap Feed
- **Description**: Cumulative foot-traffic motion heatmap MJPEG stream
- **Source Reference**: `app/main.py:215`
- **Authentication / Authorization**: Public (No Auth Required)

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `camera_id` | query | `string` | No | Camera Id |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/stream/density`

- **Purpose**: Get Crowd Density
- **Description**: Returns zone crowd count, total persons, and overcrowding status
- **Source Reference**: `app/main.py:223`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `POST /api/density/threshold`

- **Purpose**: Set Crowd Threshold
- **Description**: Configures the overcrowding threshold limit
- **Source Reference**: `app/main.py:228`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)

**Request Body**:
- **Content-Type**: `application/json`
- **Schema**: Generic JSON payload

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `POST /api/heatmap/reset`

- **Purpose**: Reset Heatmap
- **Description**: Resets the accumulated movement heatmap
- **Source Reference**: `app/main.py:234`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/stream/enhancer`

- **Purpose**: Get Enhancer Status
- **Description**: Returns low-light preprocessor status, current brightness, latency, and FPS
- **Source Reference**: `app/main.py:240`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `POST /api/stream/enhancer`

- **Purpose**: Configure Enhancer
- **Description**: Toggles or configures low-light CLAHE enhancement preprocessor
- **Source Reference**: `app/main.py:248`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)

**Request Body**:
- **Content-Type**: `application/json`
- **Schema**: Generic JSON payload

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/stream/performance`

- **Purpose**: Get Performance Stats
- **Description**: Returns frame-skip, inference resolution, and active FPS telemetry
- **Source Reference**: `app/main.py:258`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `POST /api/stream/performance`

- **Purpose**: Configure Performance
- **Description**: Configures edge frame-skip (N) and downscaled inference resolution
- **Source Reference**: `app/main.py:263`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)

**Request Body**:
- **Content-Type**: `application/json`
- **Schema**: Generic JSON payload

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/stream/alerts`

- **Purpose**: Stream Alerts
- **Source Reference**: `app/main.py:273`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/stream/snapshot`

- **Purpose**: Get Stream Snapshot
- **Description**: Returns a single clean JPEG frame for 4-point zone polygon calibration
- **Source Reference**: `app/main.py:277`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/stream/zone`

- **Purpose**: Get Zone Polygon
- **Description**: Returns the active 4-point restricted zone polygon coordinates
- **Source Reference**: `app/main.py:286`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `POST /api/stream/zone`

- **Purpose**: Update Zone Polygon
- **Description**: Updates the restricted zone polygon from the interactive UI setup mode
- **Source Reference**: `app/main.py:291`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)

**Request Body**:
- **Content-Type**: `application/json`
- **Schema**: Generic JSON payload

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/stream/source`

- **Purpose**: Get Stream Source
- **Description**: Returns the current streaming video or webcam source
- **Source Reference**: `app/main.py:300`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `POST /api/stream/source`

- **Purpose**: Set Stream Source
- **Description**: Switches stream source to webcam (0), video file, or IP stream
- **Source Reference**: `app/main.py:305`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)

**Request Body**:
- **Content-Type**: `application/json`
- **Schema**: Generic JSON payload

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/alerts/stream`

- **Purpose**: Sse Alerts Stream
- **Description**: Server-Sent Events stream for live alerts sidebar
- **Source Reference**: `app/main.py:326`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

## System Endpoints

### `GET /api/system/health`

- **Purpose**: Get System Health
- **Source Reference**: `app/api/system.py:9`
- **Authentication / Authorization**: JWT Bearer Token Required
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/system/metrics`

- **Purpose**: Get System Metrics
- **Source Reference**: `app/api/system.py:17`
- **Authentication / Authorization**: JWT Bearer Token Required
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/system/ai-models`

- **Purpose**: Get Ai Models Status
- **Source Reference**: `app/api/system.py:48`
- **Authentication / Authorization**: JWT Bearer Token Required
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/system/services`

- **Purpose**: Get Services Status
- **Source Reference**: `app/api/system.py:82`
- **Authentication / Authorization**: JWT Bearer Token Required
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `401 Unauthorized` | Missing, malformed, or expired JWT Bearer token | `{"detail": "Could not validate credentials"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/system/performance-metrics`

- **Purpose**: Get Performance Metrics
- **Description**: Real-time latency (p50, p95, p99) and request metrics.
- **Source Reference**: `app/main.py:196`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

## Tracking Endpoints

### `GET /api/tracks`

- **Purpose**: List Tracks
- **Description**: Returns active global Re-ID tracks and identities
- **Source Reference**: `app/api/tracking.py:8`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/tracks/cross-camera`

- **Purpose**: Get Cross Camera Tracks
- **Description**: Returns all cross-camera transition events and global trajectories
- **Source Reference**: `app/api/tracking.py:14`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/tracks/{tracking_id}`

- **Purpose**: Get Track
- **Description**: Returns camera history and details for a specific global ID
- **Source Reference**: `app/api/tracking.py:20`
- **Authentication / Authorization**: Public (No Auth Required)

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `tracking_id` | path | `string` | Yes | Tracking Id |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/tracks/{tracking_id}/path`

- **Purpose**: Get Track Path
- **Description**: Returns the multi-camera journey path for a subject
- **Source Reference**: `app/api/tracking.py:30`
- **Authentication / Authorization**: Public (No Auth Required)

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `tracking_id` | path | `string` | Yes | Tracking Id |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

## Users Endpoints

### `GET /api/users`

- **Purpose**: List Users
- **Source Reference**: `app/api/users.py:28`
- **Authentication / Authorization**: Public (No Auth Required) (Requires Role: `operator` or `admin`)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `403 Forbidden` | Insufficient role permissions | `{"detail": "Operation not permitted for current role"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `POST /api/users`

- **Purpose**: Create User
- **Source Reference**: `app/api/users.py:36`
- **Authentication / Authorization**: Public (No Auth Required) (Requires Role: `operator` or `admin`)
- **Request Parameters**: None (No path or query parameters)

**Request Body**:
- **Content-Type**: `application/json`
- **Schema Model**: `UserCreate`

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `201` | Successful Response | `UserResponse` |
| `422` | Validation Error | `HTTPValidationError` |
| `403 Forbidden` | Insufficient role permissions | `{"detail": "Operation not permitted for current role"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Database write (commit)

---

### `PUT /api/users/{user_id}`

- **Purpose**: Update User
- **Source Reference**: `app/api/users.py:61`
- **Authentication / Authorization**: Public (No Auth Required) (Requires Role: `operator` or `admin`)

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `user_id` | path | `integer` | Yes | User Id |

**Request Body**:
- **Content-Type**: `application/json`
- **Schema Model**: `UserUpdate`

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `UserResponse` |
| `422` | Validation Error | `HTTPValidationError` |
| `403 Forbidden` | Insufficient role permissions | `{"detail": "Operation not permitted for current role"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Database write (commit)

---

### `DELETE /api/users/{user_id}`

- **Purpose**: Delete User
- **Source Reference**: `app/api/users.py:81`
- **Authentication / Authorization**: Public (No Auth Required) (Requires Role: `operator` or `admin`)

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `user_id` | path | `integer` | Yes | User Id |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `204` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `403 Forbidden` | Insufficient role permissions | `{"detail": "Operation not permitted for current role"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Database write (commit)

---

## Video-Intelligence Endpoints

### `GET /api/video-intelligence/capabilities`

- **Purpose**: Get Capabilities
- **Description**: Returns the full AI Model capability taxonomy, enabled classes, and models.
- **Source Reference**: `app/api/video_intelligence.py:23`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/video-intelligence/camera/{camera_id}/telemetry`

- **Purpose**: Get Camera Telemetry
- **Description**: Returns active detections, attributes, motion vectors, and trajectories for a camera.
- **Source Reference**: `app/api/video_intelligence.py:28`
- **Authentication / Authorization**: Public (No Auth Required)

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `camera_id` | path | `string` | Yes | Camera Id |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `404 Not Found` | Requested entity identifier does not exist | `{"detail": "Entity not found"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/video-intelligence/camera/{camera_id}/quality`

- **Purpose**: Get Camera Quality
- **Description**: Assesses stream quality, blur, lighting, fog/haze, and camera tampering state.
- **Source Reference**: `app/api/video_intelligence.py:38`
- **Authentication / Authorization**: Public (No Auth Required)

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `camera_id` | path | `string` | Yes | Camera Id |
| `is_night` | query | `boolean` | No | Is Night |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `404 Not Found` | Requested entity identifier does not exist | `{"detail": "Entity not found"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/video-intelligence/camera/{camera_id}/crowd`

- **Purpose**: Get Crowd Metrics
- **Description**: Returns crowd density, growth rate, and dominant movement direction.
- **Source Reference**: `app/api/video_intelligence.py:44`
- **Authentication / Authorization**: Public (No Auth Required)

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `camera_id` | path | `string` | Yes | Camera Id |
| `people_count` | query | `integer` | No | People Count |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `404 Not Found` | Requested entity identifier does not exist | `{"detail": "Entity not found"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/video-intelligence/heatmap-data`

- **Purpose**: Get Surveillance Heatmap
- **Description**: Returns border sector coordinates, human activity density, vehicle corridors, and intrusion hotspots.
- **Source Reference**: `app/api/video_intelligence.py:49`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `POST /api/video-intelligence/analyze-video`

- **Purpose**: Analyze Uploaded Video
- **Description**: Simulates/Executes comprehensive frame-by-frame analysis of an uploaded video stream.
- **Source Reference**: `app/api/video_intelligence.py:70`
- **Authentication / Authorization**: Public (No Auth Required)

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `filename` | query | `string` | No | Filename |
| `duration_seconds` | query | `number` | No | Duration Seconds |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `AnalyzeVideoResponse` |
| `422` | Validation Error | `HTTPValidationError` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

## Zones Endpoints

### `GET /api/zones`

- **Purpose**: List Zones
- **Description**: Returns all active virtual fence zones and restricted polygons
- **Source Reference**: `app/api/zones.py:33`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `POST /api/zones`

- **Purpose**: Create Zone
- **Description**: Creates a new virtual perimeter zone / polygon fence
- **Source Reference**: `app/api/zones.py:50`
- **Authentication / Authorization**: Public (No Auth Required)
- **Request Parameters**: None (No path or query parameters)

**Request Body**:
- **Content-Type**: `application/json`
- **Schema**: Generic JSON payload

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/zones/{id}`

- **Purpose**: Get Zone
- **Description**: Returns specific virtual zone by ID
- **Source Reference**: `app/api/zones.py:40`
- **Authentication / Authorization**: Public (No Auth Required)

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `id` | path | `string` | Yes | Id |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `404 Not Found` | Requested entity identifier does not exist | `{"detail": "Entity not found"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `PUT /api/zones/{id}`

- **Purpose**: Update Zone
- **Description**: Updates an existing virtual fence polygon or coordinates
- **Source Reference**: `app/api/zones.py:74`
- **Authentication / Authorization**: Public (No Auth Required)

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `id` | path | `string` | Yes | Id |

**Request Body**:
- **Content-Type**: `application/json`
- **Schema**: Generic JSON payload

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `404 Not Found` | Requested entity identifier does not exist | `{"detail": "Entity not found"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `DELETE /api/zones/{id}`

- **Purpose**: Delete Zone
- **Description**: Deletes a virtual fence zone
- **Source Reference**: `app/api/zones.py:92`
- **Authentication / Authorization**: Public (No Auth Required)

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `id` | path | `string` | Yes | Id |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `404 Not Found` | Requested entity identifier does not exist | `{"detail": "Entity not found"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `POST /api/zones/{id}/toggle`

- **Purpose**: Toggle Zone
- **Description**: Toggles active state of a virtual fence zone
- **Source Reference**: `app/api/zones.py:103`
- **Authentication / Authorization**: Public (No Auth Required)

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `id` | path | `string` | Yes | Id |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `404 Not Found` | Requested entity identifier does not exist | `{"detail": "Entity not found"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

### `GET /api/zones/{id}/events`

- **Purpose**: Get Zone Events
- **Description**: Returns recent intrusion violations for a given zone
- **Source Reference**: `app/api/zones.py:119`
- **Authentication / Authorization**: Public (No Auth Required)

**Request Parameters**:

| Parameter | In | Type | Required | Description |
|:---|:---|:---|:---|:---|
| `id` | path | `string` | Yes | Id |
- **Request Body**: None

**Responses & Error Status Codes**:

| HTTP Status | Condition / Scenario | Payload Schema |
|:---|:---|:---|
| `200` | Successful Response | `JSON object / array` |
| `422` | Validation Error | `HTTPValidationError` |
| `404 Not Found` | Requested entity identifier does not exist | `{"detail": "Entity not found"}` |
| `413 Payload Too Large` | Request body exceeds 10MB limit | `{"detail": "Payload too large..."}` |
| `429 Too Many Requests` | Exceeded rate limit (120 req/min default, 30 for login) | `{"detail": "Too many requests. Please slow down."}` |
| `500 Internal Error` | Unhandled runtime exception | `{"detail": "Internal server error"}` |

- **Side Effects**: Read-only idempotent query (No database mutations or cache invalidation)

---

## WebSocket Real-Time Protocols

IBVAP implements dual high-concurrency WebSocket channels managed by Starlette/FastAPI's WebSocket manager in `backend/app/core/websocket.py`.

### 1. Unified Event Stream (`/ws/events`)
- **URL**: `ws://localhost:8000/ws/events`
- **Protocol**: RFC 6455 duplex WebSocket over HTTP upgrade
- **Handshake / Auth**: Currently open connection. Accepts client connect and registers socket into in-memory `ConnectionManager`.
- **Server-to-Client Messages**: Dispatches asynchronous JSON events broadcast by AI workers, telemetry loops, and alert engines:
```json
{
  "type": "heartbeat",
  "data": {
    "timestamp": 1727951234.5,
    "fps": 29.8,
    "cpu": 42.1,
    "gpu": 66.4,
    "active_targets": 14,
    "density": {
      "status": "normal",
      "person_count": 4,
      "density_level": "moderate"
    }
  }
}
```
Event types emitted:
- `heartbeat`: System performance, resource utilization, and FPS telemetry every 2.5s.
- `detection`: Real-time object detection events (`camera_id`, `label`, `confidence`, `timestamp`).
- `anpr`: License plate OCR reads (`camera_id`, `plate`, `confidence`, `speed_kmh`, `timestamp`).
- `zone_intrusion`: Virtual tripwire intrusion triggers.
- `face_match`: Blacklisted or watchlist face recognition hits.

- **Client-to-Server Messages**:
  - `{"action": "ping"}` -> Server responds with `{"action": "pong", "timestamp": ...}`
  - Keep-alive text frames.
- **Close Codes**:
  - `1000 Normal Closure`: Client or server initiated clean disconnection.
  - `1006 Abnormal Closure`: Connection dropped or network socket terminated.

### 2. Dedicated Alert Stream (`/ws/alerts`)
- **URL**: `ws://localhost:8000/ws/alerts`
- **Handshake / Auth**: Same as `/ws/events`.
- **Server-to-Client Messages**: High-priority real-time security alerts:
```json
{
  "type": "alert",
  "data": {
    "id": 142,
    "camera_id": "BOP-01",
    "rule_name": "Restricted Zone Intrusion",
    "severity": "critical",
    "status": "active",
    "timestamp": "2026-10-03T15:30:00Z",
    "snapshot_url": "/api/evidence/snapshot/ev_142.jpg"
  }
}
```

---

## Server-Sent Events (SSE) Stream

### `GET /api/alerts/stream`
- **Header**: `Accept: text/event-stream`
- **Content-Type**: `text/event-stream`
- **Purpose**: Fallback streaming channel for live alerts sidebar when WebSockets are blocked by enterprise firewalls or proxies.
- **Payload Format**:
```
data: {"id": "alt_991", "type": "intrusion", "severity": "high", "camera_id": "CAM-01", "timestamp": "15:42:01"}

```
