-- Run after 0004_flexible_routines.sql.

do $$
declare
  expected_function text;
  expected_functions constant text[] := array[
    'create_routine_program',
    'get_my_routine_days',
    'archive_routine',
    'unarchive_routine',
    'get_my_workout_history'
  ];
begin
  if to_regclass('public.routine_days') is null then
    raise exception 'Missing public.routine_days table';
  end if;

  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'routines'
      and column_name = 'archived_at'
  ) then
    raise exception 'Missing routines.archived_at';
  end if;

  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'routine_exercises'
      and column_name = 'routine_day_id'
  ) then
    raise exception 'Missing routine_exercises.routine_day_id';
  end if;

  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'workout_sessions'
      and column_name = 'routine_day_id'
  ) then
    raise exception 'Missing workout_sessions.routine_day_id';
  end if;

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

  if not has_function_privilege(
    'authenticated',
    'public.create_routine_program(text,text,integer,text,jsonb)',
    'execute'
  ) then
    raise exception 'Authenticated users must execute create_routine_program';
  end if;

  if not has_function_privilege(
    'authenticated',
    'public.start_workout(uuid,uuid)',
    'execute'
  ) then
    raise exception 'Authenticated users must execute start_workout(uuid,uuid)';
  end if;

  if exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'routines'
      and cmd = 'DELETE'
  ) then
    raise exception 'Routines must not expose a DELETE policy';
  end if;

  if has_function_privilege(
    'anon',
    'public.get_my_workout_history(uuid)',
    'execute'
  ) then
    raise exception 'Anonymous users must not execute get_my_workout_history';
  end if;
end;
$$;
