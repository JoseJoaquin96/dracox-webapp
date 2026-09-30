-- Run after migrations 0001-0012 in the Supabase SQL editor.

do $$
begin
  if to_regprocedure('public.get_my_progress_summary(text)') is null then
    raise exception 'get_my_progress_summary is missing; apply migration 0012';
  end if;

  if to_regprocedure('public.get_my_exercise_progress(uuid,integer)') is null then
    raise exception 'get_my_exercise_progress is missing; apply migration 0012';
  end if;

  if has_function_privilege('anon', 'public.get_my_progress_summary(text)', 'execute')
     or has_function_privilege('anon', 'public.get_my_exercise_progress(uuid,integer)', 'execute') then
    raise exception 'Anonymous users must not read progress statistics';
  end if;

  if not has_function_privilege('authenticated', 'public.get_my_progress_summary(text)', 'execute')
     or not has_function_privilege('authenticated', 'public.get_my_exercise_progress(uuid,integer)', 'execute') then
    raise exception 'Authenticated users must read their progress statistics';
  end if;
end;
$$;
