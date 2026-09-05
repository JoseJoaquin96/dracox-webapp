begin;

-- Minimal workout operations. They run as the authenticated user so the
-- existing RLS policies remain the final authorization boundary.

create or replace function public.get_my_routines()
returns table (
  id uuid,
  name text,
  focus text,
  days text,
  duration integer,
  color text,
  exercises jsonb
)
language sql
stable
security invoker
set search_path = public, pg_temp
as $$
  select
    r.id,
    r.name,
    r.focus,
    r.days,
    r.duration,
    r.color,
    coalesce(
      jsonb_agg(
        jsonb_build_object(
          'id', re.id,
          'exercise_id', re.exercise_id,
          'position', re.position,
          'sets', re.sets,
          'rep_range', re.rep_range,
          'rest_seconds', re.rest_seconds,
          'note', re.note,
          'exercise', jsonb_build_object(
            'id', e.id,
            'name', e.name,
            'muscle', e.muscle,
            'secondary', e.secondary,
            'equipment', e.equipment,
            'kind', e.kind,
            'initials', e.initials,
            'color', e.color
          )
        ) order by re.position
      ) filter (where re.id is not null),
      '[]'::jsonb
    ) as exercises
  from public.routines r
  left join public.routine_exercises re on re.routine_id = r.id
  left join public.exercises e on e.id = re.exercise_id
  where r.user_id = (select auth.uid())
  group by r.id, r.name, r.focus, r.days, r.duration, r.color, r.created_at
  order by r.created_at desc;
$$;

create or replace function public.create_routine(
  p_name text,
  p_focus text default '',
  p_days text default 'Sin programar',
  p_duration integer default 0,
  p_color text default '#d8f36a',
  p_exercises jsonb default '[]'::jsonb
)
returns uuid
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  v_routine_id uuid;
  v_exercises jsonb := coalesce(p_exercises, '[]'::jsonb);
begin
  if (select auth.uid()) is null then
    raise exception using errcode = '42501', message = 'Authentication required';
  end if;

  if nullif(trim(p_name), '') is null then
    raise exception using errcode = '22023', message = 'Routine name is required';
  end if;

  if coalesce(p_duration, 0) < 0 then
    raise exception using errcode = '22023', message = 'Duration cannot be negative';
  end if;

  if jsonb_typeof(v_exercises) <> 'array' then
    raise exception using errcode = '22023', message = 'Exercises must be a JSON array';
  end if;

  if exists (
    select 1
    from jsonb_to_recordset(v_exercises) as item(
      exercise_id uuid,
      sets integer,
      rep_range text,
      rest_seconds integer,
      note text
    )
    where item.exercise_id is null
       or item.sets is null
       or item.sets <= 0
       or coalesce(item.rest_seconds, 0) < 0
       or not exists (
         select 1
         from public.exercises e
         where e.id = item.exercise_id
           and (e.owner_id is null or e.owner_id = (select auth.uid()))
       )
  ) then
    raise exception using errcode = '22023', message = 'Invalid routine exercise';
  end if;

  insert into public.routines (user_id, name, focus, days, duration, color)
  values (
    (select auth.uid()),
    trim(p_name),
    coalesce(nullif(trim(p_focus), ''), ''),
    coalesce(nullif(trim(p_days), ''), 'Sin programar'),
    coalesce(p_duration, 0),
    coalesce(nullif(trim(p_color), ''), '#d8f36a')
  )
  returning id into v_routine_id;

  insert into public.routine_exercises (
    routine_id,
    exercise_id,
    position,
    sets,
    rep_range,
    rest_seconds,
    note
  )
  select
    v_routine_id,
    item.exercise_id,
    (items.ordinality - 1)::integer,
    item.sets,
    coalesce(item.rep_range, ''),
    coalesce(item.rest_seconds, 0),
    item.note
  from jsonb_array_elements(v_exercises) with ordinality as items(value, ordinality)
  cross join lateral jsonb_to_record(items.value) as item(
    exercise_id uuid,
    sets integer,
    rep_range text,
    rest_seconds integer,
    note text
  );

  return v_routine_id;
end;
$$;

create or replace function public.start_workout(p_routine_id uuid)
returns uuid
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  v_session_id uuid;
  v_routine_name text;
begin
  if (select auth.uid()) is null then
    raise exception using errcode = '42501', message = 'Authentication required';
  end if;

  select s.id
  into v_session_id
  from public.workout_sessions s
  where s.user_id = (select auth.uid())
    and s.status = 'active';

  if v_session_id is not null then
    if exists (
      select 1
      from public.workout_sessions s
      where s.id = v_session_id
        and s.routine_id = p_routine_id
    ) then
      return v_session_id;
    end if;

    raise exception using errcode = '23505', message = 'An active workout already exists';
  end if;

  select r.name
  into v_routine_name
  from public.routines r
  where r.id = p_routine_id
    and r.user_id = (select auth.uid());

  if v_routine_name is null then
    raise exception using errcode = '42501', message = 'Routine not found';
  end if;

  insert into public.workout_sessions (user_id, routine_id, name, status)
  values ((select auth.uid()), p_routine_id, v_routine_name, 'active')
  returning id into v_session_id;

  insert into public.session_exercises (session_id, exercise_id, position, note)
  select v_session_id, re.exercise_id, re.position, re.note
  from public.routine_exercises re
  where re.routine_id = p_routine_id
  order by re.position;

  insert into public.workout_sets (
    session_exercise_id,
    position,
    target,
    completed
  )
  select
    se.id,
    series.position,
    re.rep_range,
    false
  from public.session_exercises se
  join public.routine_exercises re
    on re.routine_id = p_routine_id
   and re.position = se.position
  cross join lateral generate_series(0, re.sets - 1) as series(position)
  where se.session_id = v_session_id;

  return v_session_id;
end;
$$;

create or replace function public.update_workout_set(
  p_set_id uuid,
  p_weight numeric,
  p_reps integer,
  p_completed boolean
)
returns public.workout_sets
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  v_set public.workout_sets;
begin
  if (select auth.uid()) is null then
    raise exception using errcode = '42501', message = 'Authentication required';
  end if;

  if p_weight is not null and p_weight < 0 then
    raise exception using errcode = '22023', message = 'Weight cannot be negative';
  end if;

  if p_reps is not null and p_reps < 0 then
    raise exception using errcode = '22023', message = 'Repetitions cannot be negative';
  end if;

  update public.workout_sets ws
  set weight = p_weight,
      reps = p_reps,
      completed = p_completed
  where ws.id = p_set_id
    and exists (
      select 1
      from public.session_exercises se
      join public.workout_sessions s on s.id = se.session_id
      where se.id = ws.session_exercise_id
        and s.user_id = (select auth.uid())
        and s.status = 'active'
    )
  returning ws.* into v_set;

  if not found then
    raise exception using errcode = '42501', message = 'Workout set not found or inactive';
  end if;

  return v_set;
end;
$$;

create or replace function public.finish_workout(p_session_id uuid)
returns public.workout_sessions
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  v_session public.workout_sessions;
begin
  update public.workout_sessions s
  set status = 'completed',
      finished_at = now(),
      duration_minutes = greatest(1, round(extract(epoch from (now() - s.started_at)) / 60.0)::integer)
  where s.id = p_session_id
    and s.user_id = (select auth.uid())
    and s.status = 'active'
  returning s.* into v_session;

  if not found then
    raise exception using errcode = '42501', message = 'Active workout not found';
  end if;

  return v_session;
end;
$$;

revoke execute on function public.get_my_routines() from public, anon;
revoke execute on function public.create_routine(text, text, text, integer, text, jsonb) from public, anon;
revoke execute on function public.start_workout(uuid) from public, anon;
revoke execute on function public.update_workout_set(uuid, numeric, integer, boolean) from public, anon;
revoke execute on function public.finish_workout(uuid) from public, anon;

grant execute on function public.get_my_routines() to authenticated;
grant execute on function public.create_routine(text, text, text, integer, text, jsonb) to authenticated;
grant execute on function public.start_workout(uuid) to authenticated;
grant execute on function public.update_workout_set(uuid, numeric, integer, boolean) to authenticated;
grant execute on function public.finish_workout(uuid) to authenticated;

commit;
