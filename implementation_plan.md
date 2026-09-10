# Implementation Plan

## Overview

Add back the Grade 12 STEM adviser: reintroduce `12 Academic-STEM` as a third Grade Level option in Part 1 (demographics), add a first-class **STEM Adviser** login (`stem` role) mirroring the existing Engineering/Medical adviser pattern, update the Supabase schema/migrations to allow the new strand value, and give the STEM adviser the identical strand-scoped data access (Respondents, Reports/evaluations, CSV export) that Engineering and Medical advisers already have.

## Types

- `api/_lib.ts`
  - `AdminRole = 'main' | 'engineering' | 'medical' | 'stem'` (was 3-way).
  - `ADVISER_GRADE: Record<Exclude<AdminRole, 'main'>, (typeof GRADE_LEVELS)[number]>` adds `stem: '12 Academic-STEM'`.
- `src/App.tsx`
  - `type AdminRole` (line 146) extended to include `'stem'`.
  - `ADMIN_LOGIN_META` (`Record<AdminRole, { title; subtitle; badge; badgeTitle }>`) adds:
    `stem: { title: 'STEM Admin Access', subtitle: 'Please enter your credentials to access the admin dashboard.', badge: 'STEM Adviser', badgeTitle: 'STEM Adviser · 12 Academic-STEM only' }`.
- `api/_validation.ts`
  - `GRADE_LEVELS = ['11 Academic-Engineering', '11 Academic-Medical', '12 Academic-STEM'] as const` (flows into `SubmitPayload.grade_level`).
- `src/types/supabase.ts` — no change needed (`grade_level` is typed `string`).

## Files

### New
- `supabase/migrations/20260914_add_stem_adviser_grade.sql`
  - Drops (if exists) and re-creates `submissions_grade_level_values` CHECK with the 3-value allow-list `('11 Academic-Engineering', '11 Academic-Medical', '12 Academic-STEM')`, using `NOT VALID` so legacy rows remain readable; safe to re-run.

### Modified
- `supabase-schema.sql` (line 56) — CHECK constraint updated to the 3-value allow-list.
- `api/_validation.ts` (line 3) — add `'12 Academic-STEM'` to `GRADE_LEVELS`.
- `api/_lib.ts`
  - `AdminRole` type + `ADVISER_GRADE` add `stem: '12 Academic-STEM'`.
  - `getAdviserCredentials(prefix: 'ENGINEERING' | 'MEDICAL' | 'STEM')`.
  - `resolveAdminRole()` adds a STEM credential branch returning `{ role: 'stem', grade: ADVISER_GRADE.stem }`.
  - `isAdminAuthorized()` comment updated to mention STEM adviser.
- `src/App.tsx`
  1. Line 146: `AdminRole` union adds `'stem'`.
  2. `ADMIN_LOGIN_META` adds the `stem` entry (title/subtitle/badge/badgeTitle).
  3. Part 1 demographics grade grid (~lines 925-941): add `{ value: '12 Academic-STEM', label: '12 Academic-STEM' }` and change `grid-cols-2` → `grid-cols-2 sm:grid-cols-3`.
  4. `verifyAdminRole()` role allow-list (~line 433): include `'stem'` so the role is returned instead of falling back to `'main'`.
  5. Side-menu Adviser submenu (~lines 2417-2429): add a **STEM Admin** button (`setLoginTarget('stem')`, teal dot `bg-[#2FA98C]`) after the Medical Admin button.
  6. Navbar badge renders automatically via `ADMIN_LOGIN_META[adminRole]` — no extra change.
- `.env.example` — add `STEM_ADMIN_USERNAME` / `STEM_ADMIN_PASSWORD` block mirroring the Engineering/Medical comments.
- `README.md` — add two env rows for `STEM_ADMIN_USERNAME` / `STEM_ADMIN_PASSWORD` ("Only sees `12 Academic-STEM` responses").
- `scripts/verify-hardening.ts`
  - Set `STEM_ADMIN_USERNAME` / `STEM_ADMIN_PASSWORD` test env vars.
  - Add `12 Academic-STEM` parse assertion (and keep legacy `Grade 12` rejection).
  - Add `verifyStem` 200 + `role: 'stem'` test.
  - Update `ADVISER_GRADE` and `GRADE_LEVELS.length === 3` assertions.

### Unchanged (role-generic already)
- `api/admin/verify.ts`, `api/admin/submissions.ts`, `api/admin/reports.ts`, `api/admin/export-csv.ts`, `server.ts` — all derive the grade filter via `resolveAdminRole(...)`, so the new STEM role inherits scoped access with no edits.
- `src/lib/supabase.ts`, `src/utils/supabase.ts`, `src/types/supabase.ts`.

## Functions

- New: none (reuses the existing `getAdviserCredentials(prefix)` helper with the `'STEM'` prefix).
- Modified:
  - `resolveAdminRole(rawUsername, rawPassword)` in `api/_lib.ts` — adds the STEM credential branch.
  - `getAdviserCredentials(prefix)` in `api/_lib.ts` — prefix union widened.
  - `verifyAdminRole(username, password)` in `App.tsx` — allow-list includes `'stem'`.
  - `fetchAdminData(username, password)` in `App.tsx` — no signature change; STEM flows through automatically.
- Removed: none.

## Classes

None — functional components and helper functions only (no class definitions in this codebase).

## Dependencies

- No new packages / version changes.
- Environment additions: `STEM_ADMIN_USERNAME`, `STEM_ADMIN_PASSWORD` must be set in local `.env` and Vercel Preview/Production (long random, distinct from main/engineering/medical). Missing STEM creds yields the same 403 behavior as missing eng/med creds today.

## Testing

- `npm run lint` (`tsc --noEmit`) — must pass (type unions updated everywhere).
- `npm run verify:api` — extended smoke tests: admin/engineering/medical/stem verify 200 with correct roles; `12 Academic-STEM` parses; legacy `Grade 12` still rejected; `ADVISER_GRADE`/`GRADE_LEVELS` assertions updated to 3 values.
- `npm run build` — production bundle builds.
- Manual (browser):
  1. Part 1 shows 3 grade options including `12 Academic-STEM`.
  2. Menu → Adviser → STEM Admin opens the STEM login modal with correct title/badge.
  3. STEM adviser logs in → sees only `12 Academic-STEM` rows in Respondents, Reports/evaluations, and CSV export (same scope rule as eng/med).
  4. Main admin still sees all strands; engineering/medical advisers unchanged.
  5. Sign Out clears credentials and modal fields (regression).
  6. Submit a new assessment as `12 Academic-STEM` end-to-end against Preview after the Supabase migration is applied.
- Supabase: apply `supabase-schema.sql` OR run `supabase/migrations/*.sql` in order in the SQL editor on the target project. Verify with `select conname, pg_get_constraintdef(oid) from pg_constraint where conname = 'submissions_grade_level_values';`.

## Implementation Order

1. Backend allow-list: `api/_validation.ts` (GRADE_LEVELS) + `api/_lib.ts` (AdminRole, ADVISER_GRADE, getAdviserCredentials, resolveAdminRole).
2. Supabase: update `supabase-schema.sql` and add `supabase/migrations/20260914_add_stem_adviser_grade.sql`.
3. Frontend: `src/App.tsx` (AdminRole union, ADMIN_LOGIN_META, demographics grid, adviser menu, verify allow-list).
4. Env/docs: `.env.example`, `README.md`.
5. Tests: `scripts/verify-hardening.ts`, then `npm run lint`, `npm run verify:api`, `npm run build`.
6. Deploy: set `STEM_ADMIN_*` in Vercel Preview/Production, apply SQL to Supabase, smoke test, promote.

## Alignment Report

- Requested objective: Re-add the Grade 12 STEM adviser option in Part 1, add a STEM adviser login like Medical/Engineering, update Supabase, grant the STEM adviser the same data access as Medical/Engineering.
- Implemented solution: `12 Academic-STEM` third strand + `stem` role reusing the existing strand-scoped pipeline (verify/submissions/reports/export-csv all derive the grade filter from `resolveAdminRole`), Supabase allow-list widened via schema + migration.
- Coverage estimate: 100%.
- Assumptions: Single shared STEM adviser login for all `12 Academic-STEM` responses; exact label `12 Academic-STEM` (user-confirmed); same scope semantics as eng/med; Vercel + Supabase SQL editor workflow per README.
- Risk level: Low — additive, mirrors the proven engineering/medical pattern; only the allow-list + CHECK constraint widen.
- Recommended next step: Set `STEM_ADMIN_*` env vars and apply the SQL migration to the target Supabase project, then smoke test the UI.