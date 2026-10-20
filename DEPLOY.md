# Production deployment preparation

## Hosting boundary

Supabase hosts the managed PostgreSQL database used by this application. The existing backend is a Python/FastAPI service with SQLAlchemy, WebSockets, streaming endpoints, and optional camera/AI workers. Supabase Edge Functions run TypeScript/Deno and are not a drop-in host for this runtime. Deploy the API container to a long-running container service and point Vercel at its HTTPS API URL. Do not put the Supabase database password or service role key in Vercel/browser variables.

The Vite frontend is configured for Vercel in `frontend/vercel.json`. Deep links are rewritten to `index.html`; browser requests to the backend use `VITE_API_BASE_URL`.

## 1. Create the Supabase database

1. Create a Supabase project and save its database password securely.
2. From **Connect**, copy the **Transaction pooler** connection string for the API service. It uses port `6543`; the SQLAlchemy client disables asyncpg's prepared statement cache for this pooler.
3. Apply the initial schema with the Supabase CLI from the repository root:

   ```sh
   supabase login
   supabase link --project-ref YOUR_PROJECT_REF
   supabase db push
   ```

   The initial migration creates the SQLAlchemy tables and enables Row Level Security without policies. This intentionally denies direct `anon` and `authenticated` Data API access; the app uses its FastAPI API and a server-side database connection. Keep application data access behind that API.
4. Save the transaction pooler URL as `DATABASE_URL` in the API host and set `DB_SSL=true`.

The production API does not run `metadata.create_all()` at startup. Apply migrations before deploying a new API version. Review future SQL migrations before applying them to production.

## 2. Deploy the FastAPI API container

Build from the repository root with `Dockerfile.prod` and deploy it to a container host that supports long-lived HTTP/WebSocket connections. Configure these environment variables in that host's secret/settings UI:

| Name | Production value |
| --- | --- |
| `ENVIRONMENT` | `production` |
| `DATABASE_URL` | Supabase transaction pooler URL (secret) |
| `DB_SSL` | `true` |
| `SECRET_KEY` | Unique random secret, at least 32 characters |
| `WEBHOOK_SECRET` | Separate unique random secret, at least 32 characters |
| `DEMO_MODE` | `false` |
| `ENABLE_BACKGROUND_WORKERS` | `false` on the web API instance |
| `CORS_ORIGINS` | JSON array of exact Vercel HTTPS origins, e.g. `["https://your-app.vercel.app"]` |
| `ENABLE_KEY_HEALTH_CHECK` | `false` unless restricted diagnostics are explicitly needed |
| `REDIS_URL` | Shared Redis URL if using distributed caching/rate limiting |

Production startup fails if demo mode, wildcard/non-HTTPS CORS, insecure database transport, default secrets, or in-process workers are enabled. Camera ingestion and AI processing should run as separate worker services with their own network and compute access. The bundled model/streaming worker must not be assumed to run on Vercel or Supabase Edge Functions.

Use `/health` as a liveness check and `/api/v1/health` as the database readiness check. Configure the API host to allow the Vercel origin in `CORS_ORIGINS` before switching traffic.

## 3. Connect GitHub to Vercel

1. Push the reviewed repository to GitHub.
2. Import it into Vercel and set **Root Directory** to `frontend`.
3. Use `npm ci` for install, `npm run build` for build, and `dist` as output.
4. Set these Vercel environment variables for Preview and Production:

   ```text
   VITE_API_BASE_URL=https://YOUR_API_HOST/api/v1
   VITE_API_TIMEOUT_MS=20000
   VITE_DEMO_MODE=false
   ```

   `VITE_*` variables are public and compiled into the browser bundle. Never put database URLs, JWT signing secrets, Supabase service-role keys, or webhook secrets in them.
5. Add the Vercel production domain and any intended preview domains to the API's `CORS_ORIGINS`. Use exact HTTPS origins; don't use `*`.
6. Confirm both the Vercel production URL and direct API URL, including `/api/v1/health`, before enabling automatic production deploys.

Vercel's GitHub integration handles frontend preview and production builds. `.github/workflows/ci-cd.yml` validates backend tests and the Vercel frontend build; it does not publish secrets or trigger a separate provider deployment.

## 4. Verify before release

- Apply the Supabase migration to a clean staging project and verify all 14 expected tables exist.
- Run `python -m pytest backend/tests tests -v` with a disposable test database.
- Run `npm ci && npm run build` from `frontend/`.
- Test authentication, expired/invalid tokens, role-protected endpoints, camera/stream access, incident actions, evidence operations, API validation errors, and WebSocket reconnects against staging.
- Confirm request logs carry request IDs and never contain passwords, token values, database URLs, or uploaded evidence contents.
- Redact the `token` query parameter in API host, proxy, and observability logs. Native browser media elements cannot attach bearer headers, so the live MJPEG/snapshot URLs use the session token as a query parameter; keep access logs disabled or redact that parameter at every layer.
- Confirm demo seeding, demo login bypasses, and generated telemetry are disabled in production.
- Rotate all example/development credentials before connecting real data.

## Local development

Copy `.env.example` to `.env`, install Python dependencies, and run `python run.py`. For the UI, copy `frontend/.env.example` to `frontend/.env.local`, run `npm ci`, then `npm run dev`. Vite proxies API and WebSocket traffic to `VITE_DEV_API_TARGET` (default `http://127.0.0.1:8001`).
