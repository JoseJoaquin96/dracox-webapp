-- Run after 0002_basic_workout_api.sql as a database owner.

do $$
declare
  expected_function text;
  expected_functions constant text[] := array[
    'get_my_routines',
    'create_routine',
    'start_workout',
    'update_workout_set',
    'finish_workout'
  ];
begin
  foreach expected_function in array expected_functions loop
    if not exists (
      select 1
      from pg_proc p
      join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public'
        and p.proname = expected_function
    ) then
      raise exception 'Missing public function: %', expected_function;
    end if;
  end loop;

  if has_function_privilege('anon', 'public.create_routine(text,text,text,integer,text,jsonb)', 'execute') then
    raise exception 'Anonymous users must not execute create_routine';
  end if;

  if not has_function_privilege('authenticated', 'public.create_routine(text,text,text,integer,text,jsonb)', 'execute') then
    raise exception 'Authenticated users must execute create_routine';
  end if;

  if not has_function_privilege('authenticated', 'public.update_workout_set(uuid,numeric,integer,boolean)', 'execute') then
    raise exception 'Authenticated users must execute update_workout_set';
  end if;
end;
$$;
