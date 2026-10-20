# IBVAP 1.2 — API Error Handling & Status Code Reference

> **Document Purpose**: Comprehensive audit and architectural specification of HTTP status codes, error response envelopes, middleware intercepts, validation behaviors, and non-standard error anomalies across the IBVAP platform.

---

## Table of Contents
1. [Standard Error Envelopes & Response Formats](#1-standard-error-envelopes--response-formats)
2. [HTTP Status Code Taxonomy](#2-http-status-code-taxonomy)
3. [Field-Level Validation Errors (Pydantic 422)](#3-field-level-validation-errors-pydantic-422)
4. [Authentication & Authorization Errors (401 / 403)](#4-authentication--authorization-errors-401--403)
5. [Middleware Intercepts: Rate Limiting & Payload Sizing](#5-middleware-intercepts-rate-limiting--payload-sizing)
6. [Error Handling Inconsistencies & Anti-Patterns](#6-error-handling-inconsistencies--anti-patterns)
7. [Architectural Recommendations for Error Normalization](#7-architectural-recommendations-for-error-normalization)

---

## 1. Standard Error Envelopes & Response Formats

IBVAP is built upon FastAPI (ASGI / Starlette) and Pydantic v2. Across 95% of endpoints, error responses conform to Starlette's `HTTPException` format:

### Standard HTTPException Format (HTTP 4xx / 5xx)
```json
{
  "detail": "Descriptive human-readable error explanation"
}
```

- **Content-Type**: `application/json`
- **Response Headers**:
  - `X-Request-ID`: Generated UUID for correlation (`ObservabilityMiddleware`).
  - `X-Process-Time`: Execution time in milliseconds (e.g., `4.12ms`).

---

## 2. HTTP Status Code Taxonomy

The table below catalogs every HTTP status code intentionally produced by the IBVAP backend controllers and middleware:

| Status Code | Reason Phrase | Module / Trigger | Example Payload / Message | Source File Reference |
|:---|:---|:---|:---|:---|
| **200** | OK (with Error Payload) | Zone configuration with invalid point count | `{"status": "error", "message": "At least 3 points required"}` | `backend/app/main.py:295` |
| **400** | Bad Request | Missing query parameter `plate_number` | `{"detail": "Missing plate_number"}` | `backend/app/api/anpr.py:48` |
| **400** | Bad Request | Invalid edge node status transition | `{"detail": "Invalid status"}` | `backend/app/api/edge.py:32` |
| **400** | Bad Request | Evidence filename path traversal attempt | `{"detail": "Invalid filename"}` | `backend/app/api/evidence.py:49` |
| **400** | Bad Request | Illegal face profile name / path characters | `{"detail": "Invalid face profile name"}` | `backend/app/api/faces.py:68` |
| **400** | Bad Request | Empty profile name submission | `{"detail": "Profile name cannot be empty"}` | `backend/app/api/faces.py:92` |
| **400** | Bad Request | Self-termination of commander session | `{"detail": "Cannot terminate current active commander session"}` | `backend/app/api/security.py:488` |
| **400** | Bad Request | Duplicate user registration (email/username) | `{"detail": "Username or email already registered"}` | `backend/app/api/users.py:45` |
| **400** | Bad Request | Attempted action by disabled / inactive user | `{"detail": "Inactive user"}` | `backend/app/core/security.py:71` |
| **401** | Unauthorized | Invalid login credentials (password mismatch) | `{"detail": "Incorrect username or password"}` | `backend/app/api/auth.py:30` |
| **401** | Unauthorized | Expired, invalid, or missing JWT Bearer token | `{"detail": "Could not validate credentials"}` | `backend/app/core/security.py:49` |
| **403** | Forbidden | User role lacks required authorization | `{"detail": "The user doesn't have enough privileges"}` | `backend/app/core/security.py:77` |
| **404** | Not Found | Requested AI model pipeline ID does not exist | `{"detail": "AI Model pipeline not found"}` | `backend/app/api/ai_models.py:170` |
| **404** | Not Found | Camera ID not found in database | `{"detail": "Camera not found"}` | `backend/app/api/cameras.py:96` |
| **404** | Not Found | Edge compute node ID does not exist | `{"detail": "Node not found"}` | `backend/app/api/edge.py:26` |
| **404** | Not Found | Forensic snapshot image file not found on disk | `{"detail": "Snapshot not found"}` | `backend/app/api/evidence.py:56` |
| **404** | Not Found | Evidence dossier case ID does not exist | `{"detail": "Case not found"}` | `backend/app/api/evidence.py:65` |
| **404** | Not Found | Face name absent from recognition watchlist | `{"detail": "Face profile not found in watchlist"}` | `backend/app/api/faces.py:110` |
| **404** | Not Found | Notification ID does not exist | `{"detail": "Notification not found"}` | `backend/app/api/notifications.py:65` |
| **404** | Not Found | Security API key ID not found | `{"detail": "API key not found"}` | `backend/app/api/security.py:297` |
| **404** | Not Found | SIEM/Webhook integration ID not found | `{"detail": "Integration not found"}` | `backend/app/api/security.py:432` |
| **404** | Not Found | User record ID does not exist | `{"detail": "User not found"}` | `backend/app/api/users.py:70` |
| **404** | Not Found | Virtual fence zone ID does not exist | `{"detail": "Zone {id} not found"}` | `backend/app/api/zones.py:46` |
| **404** | Not Found | SPA Fallback when API route does not exist | Raw HTML response `"Not Found"` | `backend/app/main.py:384` |
| **405** | Method Not Allowed | Client uses wrong HTTP verb (e.g. PATCH /camera) | `{"detail": "Method Not Allowed"}` | FastAPI Internal Router |
| **413** | Payload Too Large | Body size exceeds 10MB limit | `{"detail": "Payload too large. Maximum allowed size is 10MB."}` | `backend/app/core/middleware.py:76` |
| **422** | Unprocessable Entity | Pydantic validation failure on request payload | `{"detail": [{"loc": [...], "msg": "...", "type": "..."}]}` | FastAPI Internal Validation |
| **429** | Too Many Requests | Rate limit exceeded (120/min general, 30/min auth) | `{"detail": "Too many requests. Please slow down."}` | `backend/app/core/middleware.py:106` |
| **500** | Internal Server Error | Watchlist image file IO failure | `{"detail": "Failed to save face profile: ..."}` | `backend/app/api/faces.py:84` |
| **500** | Internal Server Error | Uncaught exception in ASGI dispatch pipeline | `{"detail": "Internal server error"}` | `backend/app/core/middleware.py:53` |

---

## 3. Field-Level Validation Errors (Pydantic 422)

When an incoming JSON body, query parameter, or path parameter fails validation constraints, FastAPI intercepts the request before reaching the route controller and returns HTTP 422.

### Structure of Validation Envelope
```json
{
  "detail": [
    {
      "type": "string_type",
      "loc": ["body", "name"],
      "msg": "Input should be a valid string",
      "input": 12345
    },
    {
      "type": "greater_than_equal",
      "loc": ["query", "limit"],
      "msg": "Input should be greater than or equal to 1",
      "input": 0,
      "ctx": {
        "ge": 1
      }
    }
  ]
}
```

### Common Validation Triggers in IBVAP
1. **Integer Parsing**: Passing non-integer strings into `skip`, `limit`, `alert_id`, or `case_id`.
2. **Missing Required Fields**: Sending a `POST /api/cameras` body without `name`, `rtsp_url`, or `zone`.
3. **Invalid Email Syntax**: Passing a malformed email into `POST /api/users`.
4. **Enum Constraint Violation**: Passing an invalid status string (e.g. `"status": "pending"`) where `AlertStatus` only accepts `active`, `acknowledged`, `investigating`, `resolved`, or `false_positive`.

---

## 4. Authentication & Authorization Errors (401 / 403)

### Authentication Failure (HTTP 401)
- **Header Required**: `WWW-Authenticate: Bearer`
- **Scenarios**:
  - Missing `Authorization` header:
    ```json
    {"detail": "Not authenticated"}
    ```
  - Expired, tampered, or invalid JWT signature:
    ```json
    {"detail": "Could not validate credentials"}
    ```
  - Invalid username/password at `/api/auth/login`:
    ```json
    {"detail": "Incorrect username or password"}
    ```

### Authorization / Role Failure (HTTP 403)
- **Mechanism**: Enforced by role dependencies (`app.core.security.require_role`) and inline permission checks.
- **Scenario**: An authenticated user with role `analyst` attempts to invoke an `admin`-restricted endpoint (e.g. `POST /api/security/kms/rotate` or `DELETE /api/cameras/{id}`):
  ```json
  {"detail": "The user doesn't have enough privileges"}
  ```

---

## 5. Middleware Intercepts: Rate Limiting & Payload Sizing

### 5.1 Rate Limiting (`RateLimitMiddleware`)
- **Location**: `backend/app/core/middleware.py:84-116`
- **Thresholds**:
  - General API Endpoints: Configurable via `settings.RATE_LIMIT_PER_MINUTE` (default: **120 requests/minute** per IP).
  - Authentication Endpoint (`/api/auth/login`): Fixed at **30 requests/minute** per IP to defend against credential brute-forcing.
- **Bypass Conditions**:
  - Automated tests (host header starting with `test`).
  - Benchmark runs (header `x-benchmark: 1`).
- **Response Format (HTTP 429)**:
  ```http
  HTTP/1.1 429 Too Many Requests
  Content-Type: application/json
  Retry-After: 60

  {
    "detail": "Too many requests. Please slow down."
  }
  ```

### 5.2 Payload Sizing (`RequestSizeLimitMiddleware`)
- **Location**: `backend/app/core/middleware.py:69-83`
- **Threshold**: `settings.MAX_REQUEST_SIZE_BYTES` (default: **10 MB / 10,485,760 bytes**).
- **Inspection**: Analyzes `Content-Length` header prior to body buffering.
- **Response Format (HTTP 413)**:
  ```http
  HTTP/1.1 413 Payload Too Large
  Content-Type: application/json

  {
    "detail": "Payload too large. Maximum allowed size is 10MB."
  }
  ```

---

## 6. Error Handling Inconsistencies & Anti-Patterns

A comprehensive audit of the backend reveals several error handling anomalies and anti-patterns:

### 6.1 Anti-Pattern: HTTP 200 Returned for Business Logic Errors
- **Affected Endpoint**: `POST /api/stream/zone` (`backend/app/main.py:291-298`)
- **Code**:
  ```python
  if len(polygon) < 3:
      return {"status": "error", "message": "At least 3 points required"}
  ```
- **Severity**: **HIGH**
- **Impact**: The server responds with `HTTP 200 OK`. Frontend HTTP clients (Axios/fetch) treat the request as successful. React UI components do not enter their `.catch()` or error handling branches, assuming the polygon was persisted.
- **Correct Pattern**: Raise `HTTPException(status_code=400, detail="At least 3 points required")`.

### 6.2 Envelope Key Inconsistencies (`detail` vs `message` vs `error`)
- Standard FastAPI: Uses `detail` (`{"detail": "..."}`).
- Stream Endpoints (`main.py`): Uses `message` (`{"status": "error", "message": "..."}`).
- Raw Services (`services/*`): Uses `error` (`{"status": "failed", "error": "..."}`).
- **Impact**: Frontend error interceptors cannot implement a unified toast/alert notification handler without checking multiple keys (`err.response.data.detail || err.response.data.message || err.response.data.error`).

### 6.3 Missing Error Handling / Silent Exception Swallowing
- **Location**: `backend/app/main.py:68` in `run_background_telemetry()`:
  ```python
  except Exception:
      await asyncio.sleep(4.0)
  ```
  - **Issue**: Any crash in the telemetry serialization loop (e.g. OpenCV memory corruption, NoneType attribute error) is completely swallowed without logging a stack trace. Telemetry silently freezes.
- **Location**: RTSP Stream Frame Capture (`backend/app/ai/realtime_stream.py`):
  - When an RTSP stream fails to read frames (`ret == False`), the processor injects a synthetic fallback canvas with `"RECONNECTING..."` overlay. While convenient for display, no structured alert event is emitted to notify operators that the hardware camera dropped off the network.

---

## 7. Architectural Recommendations for Error Normalization

1. **Global Exception Handler**:
   - Register a unified exception handler in `main.py` that formats all errors into an RFC 7807 Problem Details compliant structure:
   ```json
   {
     "type": "https://ibvap.internal/errors/validation-error",
     "title": "Invalid Request Parameter",
     "status": 400,
     "detail": "At least 3 points required",
     "instance": "/api/stream/zone",
     "request_id": "a1b2c3d4-..."
   }
   ```
2. **Eliminate HTTP 200 Error Payloads**:
   - Refactor `POST /api/stream/zone` and similar endpoints to raise standard `HTTPException(400, ...)` rather than returning dicts with status codes embedded in body.
3. **Structured Sentry / Logging Capture**:
   - Ensure all `except Exception` blocks in background tasks capture full traceback with `logger.exception("Telemetry loop failure")`.
