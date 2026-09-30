-- Run after migrations 0001-0007 in the Supabase SQL editor.

do $$
begin
  if has_column_privilege('authenticated', 'public.profiles', 'is_admin', 'UPDATE') then
    raise exception 'authenticated can still update profiles.is_admin';
  end if;

  if has_column_privilege('authenticated', 'public.profiles', 'is_admin', 'INSERT') then
    raise exception 'authenticated can still insert profiles.is_admin';
  end if;

  if not has_column_privilege('authenticated', 'public.profiles', 'display_name', 'UPDATE') then
    raise exception 'authenticated can no longer update profiles.display_name';
  end if;

  if (
    select count(*)
    from pg_constraint
    where conrelid = 'public.app_error_logs'::regclass
      and conname in (
        'app_error_logs_message_length',
        'app_error_logs_source_length',
        'app_error_logs_route_length',
        'app_error_logs_details_size'
      )
  ) <> 4 then
    raise exception 'app_error_logs size constraints are missing';
  end if;

  if to_regprocedure('public.app_error_log_quota_available()') is null then
    raise exception 'app_error_log_quota_available() is missing';
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'app_error_logs'
      and policyname = 'app_error_logs_insert_own'
      and with_check like '%app_error_log_quota_available%'
  ) then
    raise exception 'app_error_logs insert policy does not enforce the quota';
  end if;
end;
$$;
