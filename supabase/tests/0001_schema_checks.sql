-- Run this file as a database owner against the target project after applying
-- the migration. It intentionally performs structural checks only; the RLS
-- matrix must be verified with two authenticated users in the Supabase client.

do $$
declare
  expected_table text;
  expected_tables constant text[] := array[
    'profiles',
    'exercises',
    'routines',
    'routine_exercises',
    'workout_sessions',
    'session_exercises',
    'workout_sets',
    'diets',
    'diet_entries'
  ];
begin
  foreach expected_table in array expected_tables loop
    if not exists (
      select 1
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public'
        and c.relname = expected_table
        and c.relkind = 'r'
    ) then
      raise exception 'Missing public table: %', expected_table;
    end if;
  end loop;

  if exists (
    select 1
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname = any(expected_tables)
      and not c.relrowsecurity
  ) then
    raise exception 'At least one public application table has RLS disabled';
  end if;

  if not exists (
    select 1
    from pg_indexes
    where schemaname = 'public'
      and indexname = 'workout_sessions_one_active_per_user_idx'
  ) then
    raise exception 'Missing one-active-session unique index';
  end if;

  if not exists (
    select 1
    from pg_trigger t
    join pg_class c on c.oid = t.tgrelid
    join pg_namespace n on n.oid = c.relnamespace
    where t.tgname = 'on_auth_user_created'
      and n.nspname = 'auth'
      and c.relname = 'users'
      and not t.tgisinternal
  ) then
    raise exception 'Missing auth user profile trigger';
  end if;

  if (select count(*) from public.exercises where owner_id is null) < 8 then
    raise exception 'Global exercise catalog is incomplete';
  end if;
end;
$$;
