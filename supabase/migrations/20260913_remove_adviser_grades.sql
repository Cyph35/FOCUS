-- Removes the "Grade 11 STEM Adviser" / "Grade 12 STEM Adviser" option values
-- ('Grade 11' / 'Grade 12') from the allowed grade levels on public.submissions.
--
-- The constraint is re-created with NOT VALID so pre-existing legacy rows
-- (Grade 7-Grade 12, College, etc.) remain readable and are not retroactively
-- validated; the allow-list applies to all new inserts/updates from this point.
-- Safe to re-run.

do $$
begin
  if exists (select 1 from pg_constraint where conname = 'submissions_grade_level_values') then
    alter table public.submissions drop constraint submissions_grade_level_values;
  end if;

  alter table public.submissions
    add constraint submissions_grade_level_values
    check (grade_level in (
      '11 Academic-Engineering',
      '11 Academic-Medical'
    ))
    not valid;
end $$;