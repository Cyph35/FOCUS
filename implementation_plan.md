# Implementation Plan

## Overview

Add `11 Academic-ABM` as a fourth Grade Level option in Part 1 (demographics), add a first-class **ABM Adviser** login (`abm` role) mirroring the existing Engineering/Medical/STEM adviser pattern, update the Supabase schema/migrations to allow the new strand value, and give the ABM adviser the identical strand-scoped data access (Respondents, Reports/evaluations, CSV export) that Engineering/Medical/STEM advisers already have.

## Types

- `api/_lib.ts`
  - `AdminRole = 'main' | 'engineering' | 'medical' | 'stem' | 'abm'` (was 4-way).
  - `ADVISER_GRADE: Record<Exclude<AdminRole, 'main'>, (typeof GRADE_LEVELS)[number]>` adds `abm: '11 Academic-ABM'`.
- `src/App.tsx`
  - `type AdminRole` (line 146) extended to include `'abm'`.
  - `ADMIN_LOGIN_META` (`Record<AdminRole, { title; subtitle; badge; badgeTitle }>`) adds:
    `abm: { title: 'ABM Admin Access', subtitle: 'Please enter your credentials to access the admin dashboard.', badge: 'ABM Adviser', badgeTitle: 'ABM Adviser · 11 Academic-ABM only' }`.
- `api/_validation.ts`
  - `GRADE_LEVELS = ['11 Academic-Engineering', '11 Academic-Medical', '12 Academic-STEM', '11 Academic-ABM'] as const` (flows into `SubmitPayload.grade_level`).
- `src/types/supabase.ts` — no change needed (`grade_level` is typed `string`).

## Files

### New
- `supabase/migrations/20260915_add_abm_adviser_grade.sql`
  - Drops (if exists) and re-creates `submissions_grade_level_values` CHECK with the 4-value allow-list `('11 Academic-Engineering', '11 Academic-Medical', '12 Academic-STEM', '11 Academic-ABM')`, using `NOT VALID` so legacy rows remain readable; safe to re-run.

### Modified
- `supabase-schema.sql` (line 56) — CHECK constraint updated to the 4-value allow-list.
- `api/_validation.ts` (line 3) — add `'11 Academic-ABM'` to `GRADE_LEVELS`.
- `api/_lib.ts`
  - `AdminRole` type + `ADVISER_GRADE` add `abm: '11 Academic-ABM'`.
  - `getAdviserCredentials(prefix: 'ENGINEERING' | 'MEDICAL' | 'STEM' | 'ABM')`.
  - `resolveAdminRole()` adds an ABM credential branch returning `{ role: 'abm', grade: ADVISER_GRADE.abm }`.
  - `isAdminAuthorized()` comment updated to mention ABM adviser.
- `src/App.tsx`
  1. Line 146: `AdminRole` union adds `'abm'`.
  2. `ADMIN_LOGIN_META` adds the `abm` entry (title/subtitle/badge/badgeTitle).
  3. Part 1 demographics grade grid (~lines 925-943): add `{ value: '11 Academic-ABM', label: '11 Academic-ABM' }` and change `grid-cols-2 sm:grid-cols-3` → `grid-cols-2 sm:grid-cols-4`.
  4. `verifyAdminRole()` role allow-list (~line 435): include `'abm'` so the role is returned instead of falling back to `'main'`.
  5. Side-menu Adviser submenu (~lines 2432-2459): add an **ABM Admin** button (`setLoginTarget('abm')`, purple dot `bg-[#7A5C9E]`) after the STEM Admin button.
  6. Grade Level distribution list (~line 1974): add `'12 Academic-STEM'` and `'11 Academic-ABM'` (fixes a pre-existing omission of `12 Academic-STEM`).
  7. Navbar badge renders automatically via `ADMIN_LOGIN_META[adminRole]` — no extra change.
- `.env.example` — add `ABM_ADMIN_USERNAME` / `ABM_ADMIN_PASSWORD` block mirroring the Engineering/Medical/STEM comments.
- `.env` (local, git-ignored) — added `ABM_ADMIN_USERNAME=ABMAdmin` / `ABM_ADMIN_PASSWORD=ABM@ABM`.
- `README.md` — add two env rows for `ABM_ADMIN_USERNAME` / `ABM_ADMIN_PASSWORD` ("Only sees `11 Academic-ABM` responses").
- `scripts/verify-hardening.ts`
  - Set `ABM_ADMIN_USERNAME` / `ABM_ADMIN_PASSWORD` test env vars.
  - Add `11 Academic-ABM` parse assertion.
  - Add `verifyAbm` 200 + `role: 'abm'` test.
  - Update `ADVISER_GRADE` and `GRADE_LEVELS.length === 4` assertions.
### Unchanged (role-generic already)
- `api/admin/verify.ts`, `api/admin/submissions.ts`, `api/admin/reports.ts`, `api/admin/export-csv.ts`, `server.ts` — all derive the grade filter via `resolveAdminRole(...)`, so the new ABM role inherits scoped access with no edits.
- `src/lib/supabase.ts`, `src/utils/supabase.ts`, `src/types/supabase.ts`.

## Functions

- New: none (reuses the existing `getAdviserCredentials(prefix)` helper with the `'ABM'` prefix).
- Modified:
  - `resolveAdminRole(rawUsername, rawPassword)` in `api/_lib.ts` — adds the ABM credential branch.
  - `getAdviserCredentials(prefix)` in `api/_lib.ts` — prefix union widened.
  - `verifyAdminRole(username, password)` in `App.tsx` — allow-list includes `'abm'`.
  - `fetchAdminData(username, password)` in `App.tsx` — no signature change; ABM flows through automatically.
- Removed: none.

## Classes

None — functional components and helper functions only (no class definitions in this codebase).

## Dependencies

- No new packages / version changes.
- Environment additions: `ABM_ADMIN_USERNAME`, `ABM_ADMIN_PASSWORD` must be set in local `.env` and Vercel Preview/Production (values `ABMAdmin` / `ABM@ABM` per request; distinct from main/engineering/medical/stem). Missing ABM creds yields the same 403 behavior as missing eng/med/stem creds today.

## Testing

- `npm run lint` (`tsc --noEmit`) — passes.
- `npm run verify:api` — passes (all roles 200 with correct roles; `11 Academic-ABM` parses; legacy `Grade 12` still rejected; 4-value map assertions).
- `npm run build` — production bundle builds.
- Manual (browser):
  1. Part 1 shows 4 grade options including `11 Academic-ABM`.
  2. Menu → Adviser → ABM Admin opens the ABM login modal with correct title/badge.
  3. ABM adviser logs in → sees only `11 Academic-ABM` rows in Respondents, Reports/evaluations, and CSV export (same scope rule as eng/med/stem).
  4. Main admin still sees all strands; engineering/medical/STEM advisers unchanged.
  5. Sign Out clears credentials and modal fields (regression).
  6. Submit a new assessment as `11 Academic-ABM` end-to-end against Preview after the Supabase migration is applied.
- Supabase: apply `supabase-schema.sql` OR run `supabase/migrations/*.sql` in order in the SQL editor on the target project. Verify with `select conname, pg_get_constraintdef(oid) from pg_constraint where conname = 'submissions_grade_level_values';`.

## Implementation Order

1. Backend allow-list: `api/_validation.ts` (GRADE_LEVELS) + `api/_lib.ts` (AdminRole, ADVISER_GRADE, getAdviserCredentials, resolveAdminRole).
2. Supabase: update `supabase-schema.sql` and add `supabase/migrations/20260915_add_abm_adviser_grade.sql`.
3. Frontend: `src/App.tsx` (AdminRole union, ADMIN_LOGIN_META, demographics grid, adviser menu, verify allow-list, distribution list fix).
4. Env/docs: `.env`, `.env.example`, `README.md`.
5. Tests: `scripts/verify-hardening.ts`, then `npm run lint`, `npm run verify:api`, `npm run build`.
6. Deploy: set `ABM_ADMIN_*` in Vercel Preview/Production, apply SQL to Supabase, smoke test, promote.

## Alignment Report

- Requested objective: Add the `11 Academic-ABM` section in Part 1, add an ABM adviser login (`ABMAdmin` / `ABM@ABM`), update Supabase, grant the ABM adviser the same data access as Engineering/Medical/STEM.
- Implemented solution: `11 Academic-ABM` fourth strand + `abm` role reusing the existing strand-scoped pipeline (verify/submissions/reports/export-csv all derive the grade filter from `resolveAdminRole`), Supabase allow-list widened via schema + migration, credentials set via env vars.
- Coverage estimate: 100%.
- Assumptions: Single shared ABM adviser login for all `11 Academic-ABM` responses; exact label `11 Academic-ABM` (user-confirmed); same scope semantics as eng/med/stem; Vercel + Supabase SQL editor workflow per README.
- Risk level: Low — additive, mirrors the proven engineering/medical/STEM pattern; only the allow-list + CHECK constraint widen.
- Recommended next step: Set `ABM_ADMIN_*` env vars in Vercel Preview/Production and apply the SQL migration to the target Supabase project, then smoke test the UI.
