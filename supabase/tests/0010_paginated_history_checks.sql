-- Run after migrations 0001-0010 in the Supabase SQL editor.

do $$
begin
  if to_regprocedure('public.get_my_workout_history(integer,timestamptz)') is null then
    raise exception 'Paginated get_my_workout_history is missing; apply migration 0010';
  end if;

  if to_regprocedure('public.get_my_workout_history(uuid)') is not null then
    raise exception 'The old get_my_workout_history(uuid) still exists';
  end if;

  if has_function_privilege('anon', 'public.get_my_workout_history(integer,timestamptz)', 'execute') then
    raise exception 'Anonymous users must not execute get_my_workout_history';
  end if;

  if not has_function_privilege('authenticated', 'public.get_my_workout_history(integer,timestamptz)', 'execute') then
    raise exception 'Authenticated users must execute get_my_workout_history';
  end if;
end;
$$;
