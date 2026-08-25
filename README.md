# FOCUS Study Fatigue Indicator

Student fatigue assessment app with a React frontend, Node API routes, and a Supabase `submissions` table.

## Local development

**Prerequisites:** Node.js 20+

1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env.local` and fill in real values. Do not reuse placeholder strings.
3. Apply the canonical schema in the Supabase SQL editor (`supabase-schema.sql`) or run the files in `supabase/migrations/`.
4. Start the full app (Express API + Vite):
   `npm run dev`
5. Open `http://localhost:3000`

Scripts:

- `npm run dev` / `npm run dev:server` — API + frontend via `server.ts`
- `npm run dev:client` — Vite only (frontend without API routes)
- `npm run lint` — TypeScript check (`tsc --noEmit`)
- `npm run build` — production frontend bundle
- `npm run verify:api` — payload, token, and route smoke tests

## GitHub and Vercel production

1. Push this repo to GitHub.
2. Import the repo in Vercel. Use the project root (this folder). Leave the Vite base path at `/` so static assets load on a root-hosted deployment.
3. Set Preview and Production environment variables to the **same names**. Preview should use a separate Supabase project or a dedicated schema if you need isolation.
4. Apply `supabase-schema.sql` (or both migrations) on the target Supabase project **before** promoting traffic.
5. Deploy Preview, run the verification gate below, then promote to Production.

### Required environment variables

Set these in Vercel → Settings → Environment Variables for Production and Preview:

| Name | Where it is used | Notes |
| --- | --- | --- |
| `ADMIN_USERNAME` | Server admin auth | No default. App denies admin access if missing. |
| `ADMIN_PASSWORD` | Server admin auth | No default. Use a long unique password. |
| `EVALUATION_TOKEN_SECRET` | Signed evaluation writes | HMAC secret. Use 32+ random characters. |
| `SUPABASE_URL` | Server | Project URL. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Never expose in `VITE_*` or client code. |

Optional:

| Name | Where it is used | Notes |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Browser | Only if the client talks to Supabase. |
| `VITE_SUPABASE_ANON_KEY` | Browser | Publishable/anon key only. |
| `VITE_BASE_PATH` | Vite build | Leave unset for Vercel root hosting. |

## Database

`response_id` is `text` in the form `RSP-XXXXXXXX`, not UUID. The migration and `supabase-schema.sql` must match.

Access model: RLS enabled, `anon`/`authenticated` revoked, writes go through the API with the service role.

If an older environment still has UUID `response_id` or public insert policies, run `supabase/migrations/20260826_align_submissions_schema.sql`.

## Verification gate

Run locally or against a Preview URL:

1. `npm run lint`
2. `npm run build`
3. `npm run verify:api`
4. Smoke the Preview deployment:
   - `POST /api/submit` with a valid payload succeeds
   - `POST /api/evaluate` without `evaluation_token` returns 401
   - `GET /api/admin/submissions` without admin headers returns 401
   - Static JS/CSS load from `/assets/...` (not `/FOCUS/assets/...`)
5. Promote Preview to Production only after those checks pass.
