# Implementation Plan

## Overview

Remove the "Only 11 Academic-Engineering/Medical responses are shown to this account." announcements from the Engineering/Medical login modals, and clear all admin credentials (stored session + modal input fields) on Sign Out so reopening the login modal shows empty username/password fields.

## Types

No type changes. `AdminRole`, `ADMIN_LOGIN_META` shape (`{ title, subtitle, badge, badgeTitle }`) and all state variables are unchanged.

## Files

### Modified
- `/Users/klintvincentlloren/Documents/WOW/focus-study-fatigue-indicator (1)/src/App.tsx`
  1. `ADMIN_LOGIN_META` (~lines 148-152): `engineering` and `medical` `subtitle` set to the generic "Please enter your credentials to access the admin dashboard." (identical to `main`). Modals titles ("Engineering Admin Access" / "Medical Admin Access") and navbar role badges are intentionally kept.
  2. Mobile Sign Out handler (~line 1825): additionally `setAdminUsername('')`, `setAdminPassword('')`, `setAdminInputUsername('')`, `setAdminInputPassword('')`, `setAdminLoginError('')` before returning to landing.
  3. Desktop Sign Out handler (~line 1856): same additions.

## Functions

No new/removed functions. Both Sign Out `onClick` handlers are extended to clear all four credential state setters plus the login error.

## Classes

None.

## Dependencies

None.

## Testing

- `tsc --noEmit` (clean), `npm run verify:api` (regression), `npm run build` (success) — all verified.
- Manual: Engineering/Medical modals show generic subtitle; log in → Sign Out (both breakpoints) → reopen modal → fields empty; re-login + refresh/CSV export still work (they guard on empty stored creds and re-store fresh ones on next login).

## Implementation Order

1. Normalize the two adviser subtitles.
2. Extend both Sign Out handlers to clear credentials.
3. Run lint + smoke tests + build (all green).
4. Manual checks pending user browser verification.