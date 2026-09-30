-- Run after 0002_basic_workout_api.sql as a database owner.
-- get_my_routines and create_routine are removed by 0009 and checked there.

do $$
declare
  expected_function text;
  expected_functions constant text[] := array[
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

  if not has_function_privilege('authenticated', 'public.update_workout_set(uuid,numeric,integer,boolean)', 'execute') then
    raise exception 'Authenticated users must execute update_workout_set';
  end if;
end;
$$;
