# Implementation Plan

## Overview

Add an expandable **ADVISER** entry to the hamburger side menu that drops down to **Engineering Admin** and **Medical Admin**, each opening the username/password modal for a separate strand-scoped login, while keeping the existing shared **Admin Login** (which sees everything).

Scope covers the side-menu dropdown UI, a role-aware login flow, three server-side credential pairs, server-enforced strand filtering across all admin data endpoints, and docs/tests. High-level approach: credentials stay server-only in new env vars; the server derives the caller's role from whichever credential pair matched (timing-safe, same as today) and filters `submissions`/`evaluations` queries by `grade_level` before data ever leaves the server — so an adviser physically cannot receive the other strand's rows. The frontend stores the server-returned role, scopes nothing itself (defense-in-depth badge only), and all existing UI (Dashboard charts, Respondents table + refresh, Reports, CSV) adapts automatically because it is data-driven.

Delivered credentials (set server-side as env vars, never committed to git): Engineering and Medical adviser usernames/passwords were provided separately and are stored only in the gitignored local `.env` and the Vercel environment variables.

## Types

- `api/_lib.ts` — new `export type AdminRole = 'main' | 'engineering' | 'medical';` plus `export const ADVISER_GRADE: Record<Exclude<AdminRole,'main'>, (typeof GRADE_LEVELS)[number]>` mapping exactly `{ engineering: '11 Academic-Engineering', medical: '11 Academic-Medical' }` (typed to match `GRADE_LEVELS` in `api/_validation.ts` and the `submissions_grade_level_values` CHECK).
- `api/_lib.ts` — new `export interface AdminRoleResult { role: AdminRole; grade: string | null }`.
- `api/admin/verify.ts` — 200 response widens from `{ ok: true }` to `{ ok: true, role: AdminRole }`; 403/503 shapes unchanged.
- `src/App.tsx` — new module-level `type AdminRole = 'main' | 'engineering' | 'medical';` + `ADMIN_LOGIN_META: Record<AdminRole, { title, subtitle, badge, badgeTitle }>`; new state `isAdviserMenuOpen`, `loginTarget`, `adminRole`.

## Files

**Backend (modified):**
- `api/_lib.ts` — `AdminRole`, `ADVISER_GRADE`, `AdminRoleResult`, `resolveAdminRole(username, password)` (timing-safe compare against all three pairs; main → `grade: null`); `isAdminAuthorized` now delegates to `resolveAdminRole` (any valid pair authorized); `getAllSubmissions(gradeFilter?)` and `getEvaluations(gradeFilter?)` apply `.eq('grade_level', ...)` when a filter is provided.
- `api/admin/verify.ts` — returns caller's `role` on 200.
- `api/admin/submissions.ts`, `api/admin/reports.ts`, `api/admin/export-csv.ts` — resolve role from request headers and pass the strand grade filter into the query helpers (CSV export auto-scoped).
- `.env.example` — documents `ENGINEERING_ADMIN_USERNAME`, `ENGINEERING_ADMIN_PASSWORD`, `MEDICAL_ADMIN_USERNAME`, `MEDICAL_ADMIN_PASSWORD` (placeholders only — real values are server env vars / local `.env`, gitignored).
- `README.md` — env table extended with the four adviser variables and their strand scopes.
**Frontend (modified):**
- `src/App.tsx`
  1. lucide-react import gains `ChevronDown, ChevronUp`.
  2. Hamburger menu: `Admin Login` now sets `loginTarget('main')` and clears login error; new `Adviser` parent row (Users icon + chevron, `aria-expanded`) with an `AnimatePresence` expand revealing `Engineering Admin` and `Medical Admin` sub-buttons (each sets `loginTarget`, clears error, closes menu, opens modal).
  3. Admin modal: dynamic title/subtitle from `ADMIN_LOGIN_META[loginTarget]`; submit flow verifies role via `verifyAdminRole` → `setAdminRole` → existing `fetchAdminData` (server already filters) → navigates.
  4. Admin navbar: role badge chip next to FOCUS title when `adminRole !== 'main'`.
  5. Both Sign Out buttons reset `adminRole('main')`.
  6. Overlay + X close also reset `isAdviserMenuOpen`.

**Tests (modified):**
- `scripts/verify-hardening.ts` — adds the four test env vars, asserts verify returns `main`/`engineering`/`medical` per credential pair, 403 on wrong, and that `ADVISER_GRADE` aligns with `GRADE_LEVELS`.

## Functions

- **New** `resolveAdminRole(rawUsername, rawPassword): AdminRoleResult | null` in `api/_lib.ts` — single timing-safe comparison point for all three pairs; unconfigured pairs never match (fail closed).
- **New** `verifyAdminRole(username, password): Promise<{ ok, role? }>` in `src/App.tsx` — `POST /api/admin/verify`, normalizes role to the union, silent failure.
- **Modified** `isAdminAuthorized(req)` — delegates to `resolveAdminRole`; behavior superset of before.
- **Modified** `getAllSubmissions(gradeFilter?)`, `getEvaluations(gradeFilter?)` — optional strand `.eq`; default preserves current behavior.
- **Modified** modal `onSubmit` in `src/App.tsx` — verify-before-fetch flow with `isAdminLoading` guard.
- **Removed:** none.

## Classes

None — functional-component frontend; no backend classes.

## Dependencies

None. `ChevronDown`/`ChevronUp` come from the already-installed `lucide-react` (used in `PercentageBreakdownCard.tsx`).

## Testing

- `npm run verify:api` — existing suite plus new role assertions must pass.
- `npm run lint` (`tsc --noEmit`) and `npm run build` — must pass.
- Manual matrix (requires the four env vars set): hamburger → Adviser expands/collapses; Engineering login shows badge + only `11 Academic-Engineering` rows across Dashboard/Respondents/Reports/CSV + refresh stays scoped; Medical likewise; shared Admin Login shows no badge and sees all; wrong password shows existing error; Sign Out clears badge; mobile viewport behaves the same.
- Edge cases: only main pair configured → adviser logins fail closed with "Incorrect username or password."; legacy `Grade 11`/`Grade 12` rows visible only to main (server filter excludes them for advisers); role cannot be forged client-side (comes only from `/api/admin/verify`).

## Implementation Order

1. `api/_lib.ts` — role type, grade map, `resolveAdminRole`, `isAdminAuthorized` delegation, filtered queries.
2. `api/admin/verify.ts` → role; `submissions.ts`/`reports.ts`/`export-csv.ts` → role + grade filter.
3. `.env.example` + `README.md`.
4. `scripts/verify-hardening.ts` — env + role assertions; run `verify:api`.
5. `src/App.tsx` — icons, menu dropdown, modal role context, verify-before-fetch, navbar badge, sign-out reset.
6. `lint` + `build` + manual login/filter matrix.