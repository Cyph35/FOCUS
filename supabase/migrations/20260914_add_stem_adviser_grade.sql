-- Adds the '12 Academic-STEM' strand back to the allowed grade levels on
-- public.submissions and re-enables the Grade 12 STEM adviser option in Part 1.
--
-- The constraint is re-created with NOT VALID so pre-existing legacy rows
-- (Grades 7-12, College, old strands, etc.) remain readable and are not
-- retroactively validated; the allow-list applies to all new inserts/updates
-- from this point forward. Safe to re-run.

do $$
begin
  if exists (select 1 from pg_constraint where conname = 'submissions_grade_level_values') then
    alter table public.submissions drop constraint submissions_grade_level_values;
  end if;

  alter table public.submissions
    add constraint submissions_grade_level_values
    check (grade_level in (
      '11 Academic-Engineering',
      '11 Academic-Medical',
      '12 Academic-STEM'
    ))
    not valid;
end $$;