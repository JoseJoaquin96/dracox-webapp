-- Run after migrations 0001-0008 in the Supabase SQL editor.

do $$
begin
  if pg_get_functiondef('public.update_routine_program(uuid,text,text,integer,text,jsonb)'::regprocedure) not like '%->> ''id''%' then
    raise exception 'update_routine_program does not preserve routine day ids; apply migration 0008';
  end if;

  if pg_get_functiondef('public.add_workout_set(uuid)'::regprocedure) not like '%pg_advisory_xact_lock%' then
    raise exception 'add_workout_set is not serialized; apply migration 0008';
  end if;

  if has_function_privilege('anon', 'public.update_routine_program(uuid,text,text,integer,text,jsonb)', 'execute') then
    raise exception 'anon can execute update_routine_program';
  end if;

  if has_function_privilege('anon', 'public.add_workout_set(uuid)', 'execute') then
    raise exception 'anon can execute add_workout_set';
  end if;
end;
$$;
