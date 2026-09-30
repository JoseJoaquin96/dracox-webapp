begin;

-- Editing a routine now keeps the ids of existing days, so active sessions and
-- per-day history stay linked. Days sent without "id" are created; days left
-- out of the payload are deleted.
create or replace function public.update_routine_program(
  p_routine_id uuid,
  p_name text,
  p_focus text default '',
  p_duration integer default 0,
  p_color text default '#d8f36a',
  p_days jsonb default '[]'::jsonb
)
returns uuid
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  v_day jsonb;
  v_day_id uuid;
  v_position integer;
  v_days jsonb := coalesce(p_days, '[]'::jsonb);
begin
  if (select auth.uid()) is null then
    raise exception using errcode = '42501', message = 'Authentication required';
  end if;

  if not exists (
    select 1
    from public.routines r
    where r.id = p_routine_id
      and r.user_id = (select auth.uid())
      and r.archived_at is null
  ) then
    raise exception using errcode = '42501', message = 'Routine not found';
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
         nullif(day.value ->> 'id', '') is not null
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
    where nullif(day.value ->> 'id', '') is not null
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
           and (e.owner_id is null or e.owner_id = (select auth.uid()))
       )
  ) then
    raise exception using errcode = '22023', message = 'Invalid routine exercise';
  end if;

  update public.routines
  set name = trim(p_name),
      focus = coalesce(nullif(trim(p_focus), ''), ''),
      days = case
        when jsonb_array_length(v_days) = 1 then trim(v_days -> 0 ->> 'name')
        else format('%s días', jsonb_array_length(v_days))
      end,
      duration = coalesce(p_duration, 0),
      color = coalesce(nullif(trim(p_color), ''), '#d8f36a')
  where id = p_routine_id
    and user_id = (select auth.uid());

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

  for v_day, v_position in
    select value, (ordinality - 1)::integer
    from jsonb_array_elements(v_days) with ordinality
  loop
    v_day_id := nullif(v_day ->> 'id', '')::uuid;

    if v_day_id is null then
      insert into public.routine_days (routine_id, name, position)
      values (p_routine_id, trim(v_day ->> 'name'), v_position)
      returning id into v_day_id;
    else
      update public.routine_days
      set name = trim(v_day ->> 'name'),
          position = v_position
      where id = v_day_id
        and routine_id = p_routine_id;
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
      p_routine_id,
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

  return p_routine_id;
end;
$$;

create or replace function public.add_workout_set(p_session_exercise_id uuid)
returns public.workout_sets
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  v_session_id uuid;
  v_set public.workout_sets;
begin
  if (select auth.uid()) is null then
    raise exception using errcode = '42501', message = 'Authentication required';
  end if;

  select s.id
  into v_session_id
  from public.session_exercises se
  join public.workout_sessions s on s.id = se.session_id
  where se.id = p_session_exercise_id
    and s.user_id = (select auth.uid())
    and s.status = 'active';

  if v_session_id is null then
    raise exception using errcode = '42501', message = 'Active workout not found';
  end if;

  -- Serializes concurrent calls (e.g. double click) so max(position) + 1 stays unique.
  perform pg_advisory_xact_lock(hashtextextended(p_session_exercise_id::text, 0));

  insert into public.workout_sets (session_exercise_id, position, target, completed)
  select
    p_session_exercise_id,
    coalesce(max(ws.position) + 1, 0),
    coalesce(max(ws.target), ''),
    false
  from public.workout_sets ws
  where ws.session_exercise_id = p_session_exercise_id
  returning * into v_set;

  return v_set;
end;
$$;

commit;
