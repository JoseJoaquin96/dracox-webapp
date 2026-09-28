-- Run after migrations 0001-0006 in the Supabase SQL editor.

do $$
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'is_admin'
  ) then
    raise exception 'profiles.is_admin is missing; apply migration 0006 first';
  end if;

  if not exists (
    select 1
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname = 'app_error_logs'
      and c.relkind = 'r'
  ) then
    raise exception 'app_error_logs is missing; apply migration 0006 first';
  end if;

  if not exists (
    select 1
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname = 'app_error_logs'
      and c.relrowsecurity
  ) then
    raise exception 'RLS is disabled on app_error_logs';
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'app_error_logs'
      and policyname = 'app_error_logs_insert_own'
  ) then
    raise exception 'Missing own-user insert policy on app_error_logs';
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'app_error_logs'
      and policyname = 'app_error_logs_select_admin'
  ) then
    raise exception 'Missing admin select policy on app_error_logs';
  end if;
end;
$$;
