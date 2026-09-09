-- Adds an optional student_name column to public.submissions.
-- Nullable by design: the questionnaire Name field is optional.

alter table public.submissions add column if not exists student_name text;