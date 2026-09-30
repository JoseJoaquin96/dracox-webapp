begin;

-- Users may only edit their public profile fields; is_admin is managed from the SQL editor.
revoke insert, update on table public.profiles from anon, authenticated;
grant update (display_name, avatar_url) on table public.profiles to authenticated;

alter table public.app_error_logs
  drop constraint if exists app_error_logs_message_length,
  drop constraint if exists app_error_logs_source_length,
  drop constraint if exists app_error_logs_route_length,
  drop constraint if exists app_error_logs_details_size;

alter table public.app_error_logs
  add constraint app_error_logs_message_length check (char_length(message) <= 2000) not valid,
  add constraint app_error_logs_source_length check (char_length(source) <= 100) not valid,
  add constraint app_error_logs_route_length check (route is null or char_length(route) <= 500) not valid,
  add constraint app_error_logs_details_size check (details is null or pg_column_size(details) <= 16384) not valid;

create index if not exists app_error_logs_user_id_created_at_idx
  on public.app_error_logs (user_id, created_at desc);

-- Security definer because the select policy hides the caller's own rows.
create or replace function public.app_error_log_quota_available()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select count(*) < 30
  from public.app_error_logs
  where user_id = (select auth.uid())
    and created_at > timezone('utc', now()) - interval '10 minutes';
$$;

revoke execute on function public.app_error_log_quota_available() from public, anon;
grant execute on function public.app_error_log_quota_available() to authenticated;

drop policy if exists app_error_logs_insert_own on public.app_error_logs;

create policy app_error_logs_insert_own
on public.app_error_logs for insert to authenticated
with check (
  user_id = (select auth.uid())
  and public.app_error_log_quota_available()
);

commit;
