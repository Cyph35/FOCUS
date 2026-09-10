# Implementation Plan

## Overview

Remove the `Grade 11 STEM Adviser` and `Grade 12 STEM Adviser` choices from Part I: Demographic Profile (leaving only `11 Academic-Engineering` and `11 Academic-Medical`), and update the API validation plus the Supabase schema so those removed values are rejected for all new submissions while legacy rows are preserved.

Scope is the demographic selector, backend validation, smoke tests, and the Supabase `submissions.grade_level` CHECK constraint (canonical schema + a new migration). No data migration: existing `Grade 11`/`Grade 12` rows stay readable; only new inserts/updates with those values are blocked.

## Types

- `api/_validation.ts` — `GRADE_LEVELS` narrows to `['11 Academic-Engineering', '11 Academic-Medical']`. `SubmitPayload['grade_level']` derives from `(typeof GRADE_LEVELS)[number]`, narrowing automatically.
- `src/types/supabase.ts` (`grade_level: string`, lines 19/53) — unchanged.
- `api/_lib.ts` records — unchanged (`string`).
- `supabase-schema.sql` — canonical CHECK narrows to the 2 strand values.

## Files

### New files

- `/Users/klintvincentlloren/Documents/WOW/focus-study-fatigue-indicator (1)/supabase/migrations/20260913_remove_adviser_grades.sql`
  - Drops the existing `submissions_grade_level_values` constraint if present, re-adds it with only the two strand values, marked `NOT VALID` (legacy rows stay readable and are applied only to new inserts/updates). Idempotent; mirrors `20260909_add_grade_levels.sql` pattern.
- `/Users/klintvincentlloren/Documents/WOW/focus-study-fatigue-indicator (1)/implementation_plan.md`
  - This plan document.

### Modified files

- `/Users/klintvincentlloren/Documents/WOW/focus-study-fatigue-indicator (1)/src/App.tsx`
  - Lines 867–871: remove the `Grade 11 STEM Adviser` and `Grade 12 STEM Adviser` entries. `grid-cols-2` keeps working; no CSS change.
  - Line 1909 admin "Grade Level" breakdown intentionally unchanged (zero-count grades already `return null`, preserving legacy visibility).
- `/Users/klintvincentlloren/Documents/WOW/focus-study-fatigue-indicator (1)/api/_validation.ts`
  - Line 3: trim `GRADE_LEVELS`.
- `/Users/klintvincentlloren/Documents/WOW/focus-study-fatigue-indicator (1)/scripts/verify-hardening.ts`
  - Line 51: baseline `validSubmit.grade_level` → `'11 Academic-Engineering'`.
  - Lines after 78: keep strand assertions; add rejects for `Grade 11` / `Grade 12`.
- `/Users/klintvincentlloren/Documents/WOW/focus-study-fatigue-indicator (1)/supabase-schema.sql`
  - Line 56: CHECK → `('11 Academic-Engineering', '11 Academic-Medical')`.

### Unchanged (intentional)

- `api/_lib.ts`, `api/submit.ts`, `api/evaluate.ts`, `api/admin/*` — CSV uses dynamic headers; admin reads unaffected.
- `src/types/supabase.ts` — `grade_level` stays `string`.
## Functions

### Modified

- `parseSubmitPayload(body)` in `api/_validation.ts:86` — no signature change. The existing `isOneOf(input.grade_level, GRADE_LEVELS)` check now rejects `Grade 11` / `Grade 12` with `Invalid grade_level.`, which `api/submit.ts` surfaces as HTTP 400. No business-logic change required.

### New

- None (the migration is declarative SQL, not a function).

### Removed

- None. Legacy `Grade 11` / `Grade 12` values are intentionally not rewritten; they remain valid historical data.

## Classes

No class-level changes. This is a React functional-component app; the Grade Level selector is inline JSX in `App.tsx`.

## Dependencies

None. No new packages, no version changes.

## Testing

- `npm run verify:api` — `tsx scripts/verify-hardening.ts` must pass:
  - valid submit uses `grade_level: '11 Academic-Engineering'`;
  - both strand values parse;
  - `'11 Academic'` (unlisted), `'Grade 11'`, and `'Grade 12'` all fail;
  - all existing assertions (name normalization, NULL eval scores, tokens, auth) remain green.
- `npm run lint` — `tsc --noEmit` over `src` and `api`.
- Manual UI check: Part I shows exactly 2 Grade Level buttons; CONTINUE still requires age/sex/grade selection.
- Manual API check: `POST /api/submit` with `grade_level: 'Grade 12'` returns 400; with a strand value returns 200.
- Manual DB check (after applying migration): inserting a strand succeeds; inserting `Grade 11` fails the CHECK. Existing `Grade 11` rows still read back in admin Live Results / Reports.
- Edge case: an `UPDATE` rewriting a legacy row's `grade_level` back to `Grade 11` now fails the CHECK — intended.

## Implementation Order

1. Update `api/_validation.ts` — trim `GRADE_LEVELS` to the 2 strand values.
2. Update `src/App.tsx` — remove the two adviser grade buttons from Part I.
3. Update `scripts/verify-hardening.ts` — swap the baseline value and add negative assertions for `Grade 11` / `Grade 12`.
4. Create migration `supabase/migrations/20260913_remove_adviser_grades.sql` and sync the canonical `supabase-schema.sql`.
5. Run `npm run verify:api` and `npm run lint`; fix any failures.
6. Manual UI/API verification; apply the migration to Supabase (dashboard SQL editor or `supabase db push`).