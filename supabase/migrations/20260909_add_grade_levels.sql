-- Adds a CHECK constraint for allowed grade levels / strands on public.submissions.
-- Keeps submission values aligned with the questionnaire options and API validation.
-- Uses NOT VALID so pre-existing legacy rows (e.g. 'Grade 7'-'Grade 10', 'College')
-- are not blocked; the constraint applies to all new inserts/updates from this point forward.

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'submissions_grade_level_values') then
    alter table public.submissions
      add constraint submissions_grade_level_values
      check (grade_level in (
        'Grade 7',
        'Grade 8',
        'Grade 9',
        'Grade 10',
        'Grade 11',
        'Grade 12',
        'College',
        '11 Academic-Engineering',
        '11 Academic-Medical'
      ))
      not valid;
  end if;
end $$;