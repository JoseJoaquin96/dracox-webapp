begin;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and is_admin = true
  );
$$;

revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- Admins may discover profiles and inspect routines for another person.
drop policy if exists profiles_select_admin on public.profiles;
create policy profiles_select_admin
on public.profiles for select to authenticated
using ((select public.is_admin()));

drop policy if exists routines_select_admin on public.routines;
create policy routines_select_admin
on public.routines for select to authenticated
using ((select public.is_admin()));

drop policy if exists routine_days_select_admin on public.routine_days;
create policy routine_days_select_admin
on public.routine_days for select to authenticated
using ((select public.is_admin()));

drop policy if exists routine_exercises_select_admin on public.routine_exercises;
create policy routine_exercises_select_admin
on public.routine_exercises for select to authenticated
using ((select public.is_admin()));

drop policy if exists exercises_select_admin on public.exercises;
create policy exercises_select_admin
on public.exercises for select to authenticated
using ((select public.is_admin()));

-- Only the checked RPCs below may call this function.
create or replace function public.write_routine_program(
  p_user_id uuid,
  p_routine_id uuid,
  p_is_update boolean,
  p_name text,
  p_focus text,
  p_duration integer,
  p_color text,
  p_days jsonb
)
returns uuid
language plpgsql
set search_path = public, pg_temp
as $$
declare
  v_routine_id uuid := p_routine_id;
  v_day jsonb;
  v_day_id uuid;
  v_position integer;
  v_days jsonb := coalesce(p_days, '[]'::jsonb);
  v_days_label text;
begin
  if p_user_id is null then
    raise exception using errcode = '42501', message = 'Authentication required';
  end if;

  if p_is_update then
    perform 1
    from public.routines
    where id = p_routine_id and user_id = p_user_id and archived_at is null
    for update;

    if not found then
      raise exception using errcode = '42501', message = 'Routine not found';
    end if;
  end if;

  if nullif(trim(p_name), '') is null
     or coalesce(p_duration, 0) < 0
     or jsonb_typeof(v_days) <> 'array' then
    raise exception using errcode = '22023', message = 'Invalid routine program';
  end if;

  if jsonb_array_length(v_days) = 0 then
    raise exception using errcode = '22023', message = 'A routine program needs at least one day';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(v_days) as day(value)
    where nullif(trim(day.value ->> 'name'), '') is null
       or jsonb_typeof(coalesce(day.value -> 'exercises', '[]'::jsonb)) <> 'array'
       or (
         p_is_update
         and nullif(day.value ->> 'id', '') is not null
         and not exists (
           select 1
           from public.routine_days rd
           where rd.routine_id = p_routine_id
             and rd.id::text = day.value ->> 'id'
         )
       )
  ) then
    raise exception using errcode = '22023', message = 'Invalid routine day';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(v_days) as day(value)
    where p_is_update and nullif(day.value ->> 'id', '') is not null
    group by day.value ->> 'id'
    having count(*) > 1
  ) then
    raise exception using errcode = '22023', message = 'Duplicated routine day';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(v_days) as day(value)
    cross join lateral jsonb_to_recordset(
      coalesce(day.value -> 'exercises', '[]'::jsonb)
    ) as item(exercise_id uuid, sets integer, rep_range text, rest_seconds integer, note text)
    where item.exercise_id is null
       or item.sets is null
       or item.sets <= 0
       or coalesce(item.rest_seconds, 0) < 0
       or not exists (
         select 1
         from public.exercises e
         where e.id = item.exercise_id
           and (e.owner_id is null or e.owner_id = p_user_id)
       )
  ) then
    raise exception using errcode = '22023', message = 'Invalid routine exercise';
  end if;

  v_days_label := case
    when jsonb_array_length(v_days) = 1 then trim(v_days -> 0 ->> 'name')
    else format('%s días', jsonb_array_length(v_days))
  end;

  if p_is_update then
    update public.routines
    set name = trim(p_name),
        focus = coalesce(nullif(trim(p_focus), ''), ''),
        days = v_days_label,
        duration = coalesce(p_duration, 0),
        color = coalesce(nullif(trim(p_color), ''), '#d8f36a')
    where id = p_routine_id and user_id = p_user_id;

    delete from public.routine_days rd
    where rd.routine_id = p_routine_id
      and rd.id::text not in (
        select day.value ->> 'id'
        from jsonb_array_elements(v_days) as day(value)
        where nullif(day.value ->> 'id', '') is not null
      );

    delete from public.routine_exercises
    where routine_id = p_routine_id;

    -- Move kept days out of the way so unique (routine_id, position) never collides.
    update public.routine_days
    set position = position + 100000
    where routine_id = p_routine_id;
  else
    insert into public.routines (user_id, name, focus, days, duration, color)
    values (
      p_user_id, trim(p_name), coalesce(nullif(trim(p_focus), ''), ''),
      v_days_label, coalesce(p_duration, 0), coalesce(nullif(trim(p_color), ''), '#d8f36a')
    )
    returning id into v_routine_id;
  end if;

  for v_day, v_position in
    select value, (ordinality - 1)::integer
    from jsonb_array_elements(v_days) with ordinality
  loop
    v_day_id := case when p_is_update then nullif(v_day ->> 'id', '')::uuid end;

    if v_day_id is null then
      insert into public.routine_days (routine_id, name, position)
      values (v_routine_id, trim(v_day ->> 'name'), v_position)
      returning id into v_day_id;
    else
      update public.routine_days
      set name = trim(v_day ->> 'name'),
          position = v_position
      where id = v_day_id
        and routine_id = v_routine_id;
    end if;

    insert into public.routine_exercises (
      routine_id,
      routine_day_id,
      exercise_id,
      position,
      sets,
      rep_range,
      rest_seconds,
      note
    )
    select
      v_routine_id,
      v_day_id,
      item.exercise_id,
      (items.ordinality - 1)::integer,
      item.sets,
      coalesce(item.rep_range, ''),
      coalesce(item.rest_seconds, 0),
      item.note
    from jsonb_array_elements(coalesce(v_day -> 'exercises', '[]'::jsonb))
      with ordinality as items(value, ordinality)
    cross join lateral jsonb_to_record(items.value) as item(
      exercise_id uuid,
      sets integer,
      rep_range text,
      rest_seconds integer,
      note text
    );
  end loop;

  return v_routine_id;
end;
$$;

revoke execute on function public.write_routine_program(uuid, uuid, boolean, text, text, integer, text, jsonb)
from public, anon, authenticated, service_role;

create or replace function public.create_routine_program(
  p_name text,
  p_focus text default '',
  p_duration integer default 0,
  p_color text default '#d8f36a',
  p_days jsonb default '[]'::jsonb
)
returns uuid
language sql
security definer
set search_path = public, pg_temp
as $$
  select public.write_routine_program(auth.uid(), null, false, p_name, p_focus, p_duration, p_color, p_days);
$$;

create or replace function public.update_routine_program(
  p_routine_id uuid,
  p_name text,
  p_focus text default '',
  p_duration integer default 0,
  p_color text default '#d8f36a',
  p_days jsonb default '[]'::jsonb
)
returns uuid
language sql
security definer
set search_path = public, pg_temp
as $$
  select public.write_routine_program(auth.uid(), p_routine_id, true, p_name, p_focus, p_duration, p_color, p_days);
$$;

create or replace function public.admin_create_routine_program(
  p_user_id uuid,
  p_name text,
  p_focus text default '',
  p_duration integer default 0,
  p_color text default '#d8f36a',
  p_days jsonb default '[]'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.is_admin() then
    raise exception using errcode = '42501', message = 'Admin access required';
  end if;

  if p_user_id is null or not exists (select 1 from public.profiles where id = p_user_id) then
    raise exception using errcode = '22023', message = 'User not found';
  end if;

  return public.write_routine_program(p_user_id, null, false, p_name, p_focus, p_duration, p_color, p_days);
end;
$$;

create or replace function public.admin_update_routine_program(
  p_routine_id uuid,
  p_user_id uuid,
  p_name text,
  p_focus text default '',
  p_duration integer default 0,
  p_color text default '#d8f36a',
  p_days jsonb default '[]'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.is_admin() then
    raise exception using errcode = '42501', message = 'Admin access required';
  end if;

  if p_user_id is null then
    raise exception using errcode = '42501', message = 'Routine not found';
  end if;

  return public.write_routine_program(p_user_id, p_routine_id, true, p_name, p_focus, p_duration, p_color, p_days);
end;
$$;

create or replace function public.admin_set_routine_archived(
  p_routine_id uuid,
  p_user_id uuid,
  p_archived boolean
)
returns public.routines
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_routine public.routines;
begin
  if not public.is_admin() then
    raise exception using errcode = '42501', message = 'Admin access required';
  end if;

  update public.routines
  set archived_at = case when p_archived then coalesce(archived_at, now()) else null end
  where id = p_routine_id and user_id = p_user_id
  returning * into v_routine;

  if v_routine.id is null then
    raise exception using errcode = '42501', message = 'Routine not found';
  end if;

  return v_routine;
end;
$$;

revoke execute on function public.admin_create_routine_program(uuid, text, text, integer, text, jsonb) from public, anon;
revoke execute on function public.admin_update_routine_program(uuid, uuid, text, text, integer, text, jsonb) from public, anon;
revoke execute on function public.admin_set_routine_archived(uuid, uuid, boolean) from public, anon;

grant execute on function public.admin_create_routine_program(uuid, text, text, integer, text, jsonb) to authenticated;
grant execute on function public.admin_update_routine_program(uuid, uuid, text, text, integer, text, jsonb) to authenticated;
grant execute on function public.admin_set_routine_archived(uuid, uuid, boolean) to authenticated;

commit;
