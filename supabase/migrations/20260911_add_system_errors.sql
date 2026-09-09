-- Adds a system_errors table to capture server-side errors (Supabase/API failures)
-- surfaced on the admin Reports page. Service-role access only, same model as submissions.

create table if not exists public.system_errors (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  severity text not null default 'error',
  source text not null,
  message text not null,
  details text not null default '',
  resolved boolean not null default false
);

alter table public.system_errors enable row level security;

revoke all on table public.system_errors from anon, authenticated;
grant select, insert, update, delete on table public.system_errors to service_role;

drop policy if exists "Allow anonymous inserts" on public.system_errors;
drop policy if exists "Allow authenticated read access" on public.system_errors;

comment on table public.system_errors is 'Server-side errors logged by the FOCUS API for review on the admin Reports page.';