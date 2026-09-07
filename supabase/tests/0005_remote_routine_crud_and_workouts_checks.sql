-- Run after migrations 0001-0005 in the Supabase SQL editor.

do $$
begin
  if to_regprocedure('public.update_routine_program(uuid,text,text,integer,text,jsonb)') is null then
    raise exception 'update_routine_program is missing';
  end if;

  if to_regprocedure('public.get_my_active_workout(uuid)') is null then
    raise exception 'get_my_active_workout is missing';
  end if;

  if to_regprocedure('public.add_workout_set(uuid)') is null then
    raise exception 'add_workout_set is missing';
  end if;

  if has_function_privilege('anon', 'public.update_routine_program(uuid,text,text,integer,text,jsonb)', 'execute') then
    raise exception 'anon can execute update_routine_program';
  end if;

  if has_function_privilege('anon', 'public.get_my_active_workout(uuid)', 'execute') then
    raise exception 'anon can execute get_my_active_workout';
  end if;

  if has_function_privilege('anon', 'public.add_workout_set(uuid)', 'execute') then
    raise exception 'anon can execute add_workout_set';
  end if;

  if not has_function_privilege('authenticated', 'public.update_routine_program(uuid,text,text,integer,text,jsonb)', 'execute') then
    raise exception 'authenticated cannot execute update_routine_program';
  end if;

  if not has_function_privilege('authenticated', 'public.get_my_active_workout(uuid)', 'execute') then
    raise exception 'authenticated cannot execute get_my_active_workout';
  end if;

  if not has_function_privilege('authenticated', 'public.add_workout_set(uuid)', 'execute') then
    raise exception 'authenticated cannot execute add_workout_set';
  end if;
end;
$$;
