create table if not exists public.submissions (
  response_id text primary key,
  submitted_at timestamptz not null default now(),
  consent_given boolean not null,
  age_bracket text not null,
  sex text not null,
  grade_level text not null,
  pf1 smallint not null,
  pf2 smallint not null,
  pf3 smallint not null,
  pf4 smallint not null,
  pf5 smallint not null,
  cf1 smallint not null,
  cf2 smallint not null,
  cf3 smallint not null,
  cf4 smallint not null,
  cf5 smallint not null,
  sleep_duration text not null,
  study_break_frequency text not null,
  pre_bed_screen_time text not null,
  f1 smallint not null,
  f2 smallint not null,
  u1 smallint not null,
  u2 smallint not null,
  r1 smallint not null,
  r2 smallint not null,
  raw_physical_score smallint not null,
  raw_cognitive_score smallint not null,
  raw_total_score smallint not null,
  result_percent smallint not null,
  result_label text not null,
  suggestion text not null,
  constraint submissions_response_id_format check (response_id ~ '^RSP-[A-Z0-9]{8}$'),
  constraint submissions_pf1_range check (pf1 between 1 and 4),
  constraint submissions_pf2_range check (pf2 between 1 and 4),
  constraint submissions_pf3_range check (pf3 between 1 and 4),
  constraint submissions_pf4_range check (pf4 between 1 and 4),
  constraint submissions_pf5_range check (pf5 between 1 and 4),
  constraint submissions_cf1_range check (cf1 between 1 and 4),
  constraint submissions_cf2_range check (cf2 between 1 and 4),
  constraint submissions_cf3_range check (cf3 between 1 and 4),
  constraint submissions_cf4_range check (cf4 between 1 and 4),
  constraint submissions_cf5_range check (cf5 between 1 and 4),
  constraint submissions_f1_range check (f1 between 1 and 5),
  constraint submissions_f2_range check (f2 between 1 and 5),
  constraint submissions_u1_range check (u1 between 1 and 5),
  constraint submissions_u2_range check (u2 between 1 and 5),
  constraint submissions_r1_range check (r1 between 1 and 5),
  constraint submissions_r2_range check (r2 between 1 and 5),
  constraint submissions_result_percent_range check (result_percent between 0 and 100)
);

create index if not exists submissions_submitted_at_idx
  on public.submissions (submitted_at desc);

alter table public.submissions enable row level security;

revoke all on table public.submissions from anon, authenticated;
grant select, insert, update, delete on table public.submissions to service_role;

drop policy if exists "Allow anonymous inserts" on public.submissions;
drop policy if exists "Allow authenticated read access" on public.submissions;

comment on table public.submissions is 'Assessment results captured by the FOCUS fatigue indicator. Access is server-side via the service role only.';
