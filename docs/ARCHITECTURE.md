# IBVAP architecture

This guide describes the active application and the rules for extending it. The supported web runtime is the React app in `frontend/`, served locally by Vite and in production by the FastAPI app in `backend/app/`.

## Repository map

| Directory | Owns |
| --- | --- |
| `frontend/src/config/` | Validated public build-time configuration. |
| `frontend/src/api/client.ts` | Shared HTTP clients, authentication headers, timeout, network status, and normalized errors. |
| `frontend/src/api/services/` | Endpoint operations grouped by domain (`auth`, `cameras`, `alerts`, `zones`, `anpr`, and others). |
| `frontend/src/components/ui/` | Reusable primitive controls and display components. |
| `frontend/src/components/<area>/` | Reusable features shared by multiple pages. |
| `frontend/src/features/<area>/` | Non-visual domain rules and feature workflows. |
| `frontend/src/layouts/` | Shared route chrome and navigation. |
| `frontend/src/pages/` | Route entry points and page composition. |
| `frontend/src/stores/` | Shared client state in Zustand. Keep page-only form and modal state local. |
| `frontend/src/lib/` | Small cross-cutting utilities such as browser-safe token storage. |
| `frontend/src/types/` | Shared frontend contracts. |
| `backend/app/api/` | HTTP resource routers and request/response mapping. |
| `backend/app/api/v1/` | Versioned API route registry. |
| `backend/app/core/` | Settings, database, cache, middleware, security, and exception handling. |
| `backend/app/models/` | Database persistence models. |
| `backend/app/schemas/` | Pydantic API contracts. |
| `backend/app/services/` | Business workflows independent of HTTP. |
| `backend/app/ai/` | Detection, analytics, and stream processing. |
| `services/`, `shared/`, `api/` | Supporting workers and shared infrastructure used by the wider platform. |
| `docs/` | Architecture, operation, and design references. |

## Frontend boundaries

Use this direction of dependencies:

```text
route page → reusable components and domain operations
           → api/services/<domain>.ts → api/client.ts → FastAPI /api/v1
page/component → Zustand store for state shared across routes
```

- Keep markup and interaction composition in components. Put endpoint paths only in domain API services.
- Put reusable non-visual workflows in `frontend/src/lib/` or a named feature module; do not import UI components into those modules.
- Keep modal/form state local unless another route needs it. Shared authentication, network status, and surveillance/video state already use Zustand.
- Group API operations by resource, not by the screen that happens to call them. The stream-zone endpoint belongs to `streamService`; zone CRUD belongs to `zoneService`.
- Use the shared `ApiError` shape for failures. Show a user-safe message at the interaction that can recover; never silently discard a rejected request.
- Components that own browser resources (media streams, timers, object URLs, event listeners) must release them when replaced or unmounted.
- Use `PascalCase` for React components and types, `camelCase` for TypeScript values/functions, and `snake_case` for Python modules and functions.

## API and backend boundaries

The API request flow is:

```text
React view → domain API service → shared HTTP client → versioned FastAPI router
           → resource router → Pydantic schema → domain service → model/worker
```

- The canonical route prefix is `/api/v1`. Register resource routers in `backend/app/api/v1/`; keep compatibility aliases explicit and temporary.
- Validate input and response contracts with Pydantic schemas. Keep workflow rules out of route functions and persistence details out of the frontend.
- Return expected failures as HTTP errors. Shared exception handlers should preserve the stable error envelope and request ID without exposing secrets or submitted credentials.
- Use domain service functions from both HTTP and background workers when workflows are shared.
- Add a frontend endpoint in `frontend/src/api/services/<domain>.ts`, export it from `frontend/src/api/index.ts`, then consume it from a page or feature component. The shared client owns auth headers, timeout, network status, and error normalization.

## State and error handling

Zustand owns state that is shared across routes or components. Component state owns transient input and presentation state. Avoid storing the same server resource in more than one store; after a mutation, update the owning store or reload through its domain service.

`ApiError` exposes `status`, `code`, `requestId`, and safe `details`. Handle expected errors close to the action (for example, invalid input or a failed save); use the app-level React error boundary for render failures. Abort and timeout errors should not mark the browser offline. Do not use empty `.catch(() => {})` handlers.

## Environment configuration

Backend settings are defined in `backend/app/core/config.py` and read from environment variables/root `.env`. Copy `.env.example` to `.env` for local backend use; `.env` is ignored and must not be committed.

Frontend public settings are validated in `frontend/src/config/env.ts`. Copy `frontend/.env.example` to `.env.local` for local overrides. Supported variables:

| Variable | Purpose | Default |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Frontend API base path or absolute HTTP(S) URL | `/api/v1` |
| `VITE_API_TIMEOUT_MS` | Request timeout from 1000 to 120000 ms | `20000` |
| `VITE_DEMO_MODE` | Allow the auth demo fallback | `false` |
| `VITE_DEV_API_TARGET` | Vite development proxy target | `http://127.0.0.1:8001` |

Only public values belong in Vite configuration because `VITE_*` values are embedded in the browser bundle. Never put passwords, signing keys, or private service credentials there. Set production secrets in the server environment.

## Runtime and generated files

`run.py` starts `backend/app/main.py` through Uvicorn. The root `main.py` and `simple_dashboard.py` are historical entry points; they are not used by the supported launcher. `frontend/dist/` and `backend/static/` are generated frontend output, not source-of-truth code. Treat the Python workers under `services/` and contracts under `shared/` as active platform source unless their deployment manifests are retired.

## Local workflow

1. Copy `.env.example` to `.env` and configure the backend.
2. Start the backend with `python run.py` (default port `8001`).
3. In `frontend/`, install dependencies with `npm ci`, then run `npm run dev`.
4. For a production frontend build, run `npm run build` in `frontend/`.
5. The Vite proxy uses `VITE_DEV_API_TARGET`; override it in `frontend/.env.local` when needed.

Container builds use `Dockerfile.prod` and `docker-compose.prod.yml`.
