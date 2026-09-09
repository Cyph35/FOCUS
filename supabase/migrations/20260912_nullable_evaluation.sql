-- Makes the evaluation scores nullable so skipped evaluations stay NULL
-- instead of being stored as phantom perfect 5s. Safe to re-run.
-- NOTE: rows saved before this migration keep their old 5,5,5,5,5,5 values
-- (historical data is intentionally left as-is).

alter table public.submissions alter column f1 drop not null;
alter table public.submissions alter column f2 drop not null;
alter table public.submissions alter column u1 drop not null;
alter table public.submissions alter column u2 drop not null;
alter table public.submissions alter column r1 drop not null;
alter table public.submissions alter column r2 drop not null;

do $$
begin
  -- Replace the old "between 1 and 5" checks with NULL-tolerant versions.
  if exists (select 1 from pg_constraint where conname = 'submissions_f1_range') then
    alter table public.submissions drop constraint submissions_f1_range;
  end if;
  if exists (select 1 from pg_constraint where conname = 'submissions_f2_range') then
    alter table public.submissions drop constraint submissions_f2_range;
  end if;
  if exists (select 1 from pg_constraint where conname = 'submissions_u1_range') then
    alter table public.submissions drop constraint submissions_u1_range;
  end if;
  if exists (select 1 from pg_constraint where conname = 'submissions_u2_range') then
    alter table public.submissions drop constraint submissions_u2_range;
  end if;
  if exists (select 1 from pg_constraint where conname = 'submissions_r1_range') then
    alter table public.submissions drop constraint submissions_r1_range;
  end if;
  if exists (select 1 from pg_constraint where conname = 'submissions_r2_range') then
    alter table public.submissions drop constraint submissions_r2_range;
  end if;

  alter table public.submissions add constraint submissions_f1_range check (f1 is null or f1 between 1 and 5);
  alter table public.submissions add constraint submissions_f2_range check (f2 is null or f2 between 1 and 5);
  alter table public.submissions add constraint submissions_u1_range check (u1 is null or u1 between 1 and 5);
  alter table public.submissions add constraint submissions_u2_range check (u2 is null or u2 between 1 and 5);
  alter table public.submissions add constraint submissions_r1_range check (r1 is null or r1 between 1 and 5);
  alter table public.submissions add constraint submissions_r2_range check (r2 is null or r2 between 1 and 5);
end $$;
