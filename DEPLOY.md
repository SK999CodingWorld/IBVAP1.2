# Deploy IBVAP with Vercel, Render, and Supabase

This repository is arranged as a small monorepo with three deployment targets:

- `frontend/` is the Vite single-page app deployed to Vercel.
- `backend/` is the FastAPI application packaged by the root `Dockerfile.prod` and deployed as a Render Web Service.
- Supabase provides PostgreSQL. Its database password and connection string stay on the server side.

The Vercel SPA rewrite lives in `frontend/vercel.json`. Render's service definition is the root `render.yaml`; it checks `/health`, runs with production-safe flags, and generates signing secrets. The database URL and allowed frontend origins are set privately in Render.

## 1. Push the deployment branch to GitHub

Push or merge the desired deployment commit to the Git branch that Vercel and Render should watch. For a normal production setup, make `main` the production branch in both dashboards. Commits to other branches can be used for previews.

## 2. Create or confirm the Supabase database

1. Open the Supabase project and choose **Connect**.
2. Copy the PostgreSQL **Transaction pooler** connection string for a server-side application (the shared pooler normally uses port `6543`). The backend normalizes the standard `postgresql://` URL for SQLAlchemy and disables asyncpg's statement cache for this pooler. Do not put this string in Vercel or in any `VITE_*` variable.
3. From the repository root, apply the checked-in migration from a trusted local terminal:

   ```sh
   supabase login
   supabase link --project-ref YOUR_PROJECT_REF
   supabase db push
   ```

   Review the pending migration shown by the CLI before confirming the production change.
4. Keep the database password private. If it has been shared in chat or committed anywhere, rotate it before using this deployment.

## 3. Deploy the API on Render

The root `render.yaml` is configured for a Docker Web Service using `Dockerfile.prod`.

1. If you already have the `ibvap-api` service, open it and confirm its repository is `SK999CodingWorld/IBVAP1.2` and its deploy branch is the branch you intend to use. The root `render.yaml` is intended to manage this service. Avoid creating another service with the same API just to apply the file.
2. If you do not have an API service yet, choose **New → Blueprint**, connect `SK999CodingWorld/IBVAP1.2`, select the deploy branch, and apply the repository-root `render.yaml`.
3. For `DATABASE_URL`, paste the Supabase transaction-pooler connection string. If the dashboard is creating a new Blueprint, provide this when prompted; for an already-created service, set it in **Environment**.
4. For `CORS_ORIGINS`, enter a JSON array containing the exact Vercel origin, for example `["https://your-project.vercel.app"]`. The API also accepts comma-separated origins, but JSON is preferred. Do not include a trailing slash or use `*`. Add any custom production hostname as another array entry.
5. The Blueprint generates `SECRET_KEY` and `WEBHOOK_SECRET` for a new service. For an existing service, replace any missing/default values with two independent random values of at least 32 characters. You can generate one at a time with `python -c "import secrets; print(secrets.token_urlsafe(48))"`. Store them only in Render's Environment settings; never commit or put them in Vercel.
6. Confirm these production values in Render: `ENVIRONMENT=production`, `DEMO_MODE=false`, `DB_SSL=true`, and `ENABLE_BACKGROUND_WORKERS=false`. Keep camera/AI workers off this web instance.
7. Save the environment changes and deploy. Wait for Render's health check to pass at `/health`.
8. Copy the public Render URL, such as `https://ibvap-api.onrender.com`. Verify `https://YOUR-RENDER-HOST/health` returns HTTP 200 before continuing.

Render Free services sleep after 15 minutes without inbound traffic and may take about a minute to wake. Their filesystem is ephemeral, so the app must use Supabase for durable database data and should not store uploads on the local container filesystem. Free instances are suitable for demos and evaluation, not a latency-sensitive production service.

## 4. Deploy the frontend on Vercel

1. In Vercel, choose **Add New → Project**, import `SK999CodingWorld/IBVAP1.2`, and select the same production branch.
2. Set **Root Directory** to `frontend`. Use the **Vite** preset.
3. Use these build settings (Vercel normally detects them):
   - Install command: `npm ci`
   - Build command: `npm run build`
   - Output directory: `dist`
4. Add the following environment variables to **Production** and **Preview** as needed:

   | Name | Value |
   | --- | --- |
   | `VITE_API_BASE_URL` | `https://YOUR-RENDER-HOST/api/v1` |
   | `VITE_API_TIMEOUT_MS` | `20000` |
   | `VITE_DEMO_MODE` | `false` |

   `VITE_*` values are included in the browser build. Only put public settings here; never put database URLs, database passwords, signing secrets, or Supabase service-role keys in Vercel frontend variables.

5. Deploy. Copy the final Vercel Production Domain and add its exact `https://...` origin to Render's `CORS_ORIGINS` JSON array. Save and redeploy the API if you changed its environment.
6. If you change Vercel environment variables, trigger a new deployment; existing deployments do not receive updated build-time values.

## 5. Verify the deployed app

1. Open `https://YOUR-RENDER-HOST/health` and confirm it returns HTTP 200.
2. Open `https://YOUR-RENDER-HOST/api/v1/health` and confirm the API/database readiness response is healthy.
3. Open the Vercel Production URL and confirm a nested route such as `/login` loads directly and after refresh.
4. Sign in and exercise API-backed screens. Check browser Network/Console and Render logs for CORS errors, failed requests, or startup errors.
5. If the frontend loads but API calls fail, confirm the Vercel `VITE_API_BASE_URL` has `/api/v1`, and Render `CORS_ORIGINS` exactly matches the browser's origin.

The live media endpoints can carry a session token in a query parameter because browser media elements cannot attach bearer headers. Ensure any proxy/access-log configuration redacts `token` query values; never paste full tokenized media URLs into support messages.

## Local frontend environment

Copy `frontend/.env.example` to `frontend/.env.local` for local Vite development. It uses the `/api` proxy to reach `http://127.0.0.1:8001`. Keep local secrets in ignored `.env` files; commit only the example templates.
