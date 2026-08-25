-- Align existing submissions tables with the canonical schema.
-- Safe to run after 20260825_create_submissions.sql.
-- If response_id is still uuid, convert it before applying the format check.

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'submissions'
      and column_name = 'response_id'
      and data_type = 'uuid'
  ) then
    alter table public.submissions
      alter column response_id type text using ('RSP-' || upper(substr(replace(response_id::text, '-', ''), 1, 8)));
  end if;
end $$;

alter table public.submissions add column if not exists suggestion text not null default '';

create index if not exists submissions_submitted_at_idx
  on public.submissions (submitted_at desc);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'submissions_response_id_format') then
    alter table public.submissions
      add constraint submissions_response_id_format check (response_id ~ '^RSP-[A-Z0-9]{8}$');
  end if;
  if not exists (select 1 from pg_constraint where conname = 'submissions_pf1_range') then
    alter table public.submissions add constraint submissions_pf1_range check (pf1 between 1 and 4);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'submissions_pf2_range') then
    alter table public.submissions add constraint submissions_pf2_range check (pf2 between 1 and 4);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'submissions_pf3_range') then
    alter table public.submissions add constraint submissions_pf3_range check (pf3 between 1 and 4);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'submissions_pf4_range') then
    alter table public.submissions add constraint submissions_pf4_range check (pf4 between 1 and 4);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'submissions_pf5_range') then
    alter table public.submissions add constraint submissions_pf5_range check (pf5 between 1 and 4);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'submissions_cf1_range') then
    alter table public.submissions add constraint submissions_cf1_range check (cf1 between 1 and 4);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'submissions_cf2_range') then
    alter table public.submissions add constraint submissions_cf2_range check (cf2 between 1 and 4);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'submissions_cf3_range') then
    alter table public.submissions add constraint submissions_cf3_range check (cf3 between 1 and 4);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'submissions_cf4_range') then
    alter table public.submissions add constraint submissions_cf4_range check (cf4 between 1 and 4);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'submissions_cf5_range') then
    alter table public.submissions add constraint submissions_cf5_range check (cf5 between 1 and 4);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'submissions_f1_range') then
    alter table public.submissions add constraint submissions_f1_range check (f1 between 1 and 5);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'submissions_f2_range') then
    alter table public.submissions add constraint submissions_f2_range check (f2 between 1 and 5);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'submissions_u1_range') then
    alter table public.submissions add constraint submissions_u1_range check (u1 between 1 and 5);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'submissions_u2_range') then
    alter table public.submissions add constraint submissions_u2_range check (u2 between 1 and 5);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'submissions_r1_range') then
    alter table public.submissions add constraint submissions_r1_range check (r1 between 1 and 5);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'submissions_r2_range') then
    alter table public.submissions add constraint submissions_r2_range check (r2 between 1 and 5);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'submissions_result_percent_range') then
    alter table public.submissions add constraint submissions_result_percent_range check (result_percent between 0 and 100);
  end if;
end $$;

alter table public.submissions enable row level security;

revoke all on table public.submissions from anon, authenticated;
grant select, insert, update, delete on table public.submissions to service_role;

drop policy if exists "Allow anonymous inserts" on public.submissions;
drop policy if exists "Allow authenticated read access" on public.submissions;
