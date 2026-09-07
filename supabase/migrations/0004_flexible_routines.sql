begin;

-- A routine is the complete program. Each routine day is a selectable block;
-- the calendar is deliberately left out so the user can train any block next.

alter table public.routines
  add column archived_at timestamptz;

create table public.routine_days (
  id uuid primary key default gen_random_uuid(),
  routine_id uuid not null references public.routines(id) on delete cascade,
  name text not null,
  position integer not null check (position >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (routine_id, position),
  unique (id, routine_id)
);

create index routine_days_routine_id_position_idx
  on public.routine_days(routine_id, position);

create trigger routine_days_set_updated_at
before update on public.routine_days
for each row execute function public.set_updated_at();

alter table public.routine_days enable row level security;

create policy routine_days_select_own
on public.routine_days for select to authenticated
using (
  exists (
    select 1
    from public.routines r
    where r.id = routine_days.routine_id
      and r.user_id = (select auth.uid())
  )
);

create policy routine_days_insert_own
on public.routine_days for insert to authenticated
with check (
  exists (
    select 1
    from public.routines r
    where r.id = routine_days.routine_id
      and r.user_id = (select auth.uid())
  )
);

create policy routine_days_update_own
on public.routine_days for update to authenticated
using (
  exists (
    select 1
    from public.routines r
    where r.id = routine_days.routine_id
      and r.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.routines r
    where r.id = routine_days.routine_id
      and r.user_id = (select auth.uid())
  )
);

create policy routine_days_delete_own
on public.routine_days for delete to authenticated
using (
  exists (
    select 1
    from public.routines r
    where r.id = routine_days.routine_id
      and r.user_id = (select auth.uid())
  )
);

-- Existing routines become one-day routines, preserving all current data.
insert into public.routine_days (routine_id, name, position)
select r.id, coalesce(nullif(trim(r.name), ''), 'Día 1'), 0
from public.routines r;

alter table public.routine_exercises
  add column routine_day_id uuid;

update public.routine_exercises re
set routine_day_id = rd.id
from public.routine_days rd
where rd.routine_id = re.routine_id
  and rd.position = 0;

alter table public.routine_exercises
  alter column routine_day_id set not null;

alter table public.routine_exercises
  drop constraint routine_exercises_routine_id_position_key;

alter table public.routine_exercises
  add constraint routine_exercises_routine_day_id_position_key
  unique (routine_day_id, position);

alter table public.routine_exercises
  add constraint routine_exercises_day_routine_fkey
  foreign key (routine_day_id, routine_id)
  references public.routine_days(id, routine_id)
  on delete cascade;

alter table public.workout_sessions
  add column routine_day_id uuid references public.routine_days(id) on delete set null,
  add column day_name text not null default '';

update public.workout_sessions ws
set routine_day_id = rd.id,
    day_name = rd.name
from public.routine_days rd
where rd.routine_id = ws.routine_id
  and rd.position = 0;

alter table public.workout_sessions
  add constraint workout_sessions_day_routine_fkey
  foreign key (routine_day_id, routine_id)
  references public.routine_days(id, routine_id);

create index workout_sessions_routine_day_id_idx
  on public.workout_sessions(routine_day_id);

drop policy workout_sessions_insert_own on public.workout_sessions;
create policy workout_sessions_insert_own
on public.workout_sessions for insert to authenticated
with check (
  user_id = (select auth.uid())
  and (
    routine_id is null
    or exists (
      select 1
      from public.routines r
      where r.id = workout_sessions.routine_id
        and r.user_id = (select auth.uid())
    )
  )
  and (
    routine_day_id is null
    or exists (
      select 1
      from public.routine_days rd
      where rd.id = workout_sessions.routine_day_id
        and rd.routine_id = workout_sessions.routine_id
        and exists (
          select 1
          from public.routines r
          where r.id = rd.routine_id
            and r.user_id = (select auth.uid())
        )
    )
  )
);

drop policy workout_sessions_update_own on public.workout_sessions;
create policy workout_sessions_update_own
on public.workout_sessions for update to authenticated
using (user_id = (select auth.uid()))
with check (
  user_id = (select auth.uid())
  and (
    routine_id is null
    or exists (
      select 1
      from public.routines r
      where r.id = workout_sessions.routine_id
        and r.user_id = (select auth.uid())
    )
  )
  and (
    routine_day_id is null
    or exists (
      select 1
      from public.routine_days rd
      where rd.id = workout_sessions.routine_day_id
        and rd.routine_id = workout_sessions.routine_id
        and exists (
          select 1
          from public.routines r
          where r.id = rd.routine_id
            and r.user_id = (select auth.uid())
        )
    )
  )
);

-- Keep the old response shape for the prototype, but expose day metadata in
-- each nested exercise so the next UI can group it without another query.
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
          'routine_day_id', rd.id,
          'day_name', rd.name,
          'day_position', rd.position,
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
        ) order by rd.position, re.position
      ) filter (where re.id is not null),
      '[]'::jsonb
    ) as exercises
  from public.routines r
  left join public.routine_exercises re on re.routine_id = r.id
  left join public.routine_days rd on rd.id = re.routine_day_id
  left join public.exercises e on e.id = re.exercise_id
  where r.user_id = (select auth.uid())
  group by r.id, r.name, r.focus, r.days, r.duration, r.color, r.created_at
  order by r.created_at desc;
$$;

-- Keep the existing single-day RPC working for older clients.
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
  v_day_id uuid;
  v_exercises jsonb := coalesce(p_exercises, '[]'::jsonb);
begin
  if (select auth.uid()) is null then
    raise exception using errcode = '42501', message = 'Authentication required';
  end if;

  if nullif(trim(p_name), '') is null then
    raise exception using errcode = '22023', message = 'Routine name is required';
  end if;

  if coalesce(p_duration, 0) < 0 or jsonb_typeof(v_exercises) <> 'array' then
    raise exception using errcode = '22023', message = 'Invalid routine';
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

  insert into public.routine_days (routine_id, name, position)
  values (v_routine_id, coalesce(nullif(trim(p_days), ''), 'Día 1'), 0)
  returning id into v_day_id;

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

-- New routine creation contract: one routine with any number of selectable days.
-- p_days example: [{"name":"Upper A","exercises":[{"exercise_id":"...","sets":4}]}]
create or replace function public.create_routine_program(
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
  v_routine_id uuid;
  v_day_id uuid;
  v_day jsonb;
  v_position integer;
  v_days jsonb := coalesce(p_days, '[]'::jsonb);
begin
  if (select auth.uid()) is null then
    raise exception using errcode = '42501', message = 'Authentication required';
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
  ) then
    raise exception using errcode = '22023', message = 'Invalid routine day';
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

  insert into public.routines (user_id, name, focus, days, duration, color)
  values (
    (select auth.uid()),
    trim(p_name),
    coalesce(nullif(trim(p_focus), ''), ''),
    format('%s días', jsonb_array_length(v_days)),
    coalesce(p_duration, 0),
    coalesce(nullif(trim(p_color), ''), '#d8f36a')
  )
  returning id into v_routine_id;

  for v_day, v_position in
    select value, (ordinality - 1)::integer
    from jsonb_array_elements(v_days) with ordinality
  loop
    insert into public.routine_days (routine_id, name, position)
    values (v_routine_id, trim(v_day ->> 'name'), v_position)
    returning id into v_day_id;

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

create or replace function public.get_my_routine_days(p_routine_id uuid)
returns table (
  id uuid,
  routine_id uuid,
  name text,
  day_position integer,
  exercises jsonb
)
language sql
stable
security invoker
set search_path = public, pg_temp
as $$
  select
    rd.id,
    rd.routine_id,
    rd.name,
    rd.position as day_position,
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
    )
  from public.routine_days rd
  join public.routines r on r.id = rd.routine_id
  left join public.routine_exercises re on re.routine_day_id = rd.id
  left join public.exercises e on e.id = re.exercise_id
  where rd.routine_id = p_routine_id
    and r.user_id = (select auth.uid())
  group by rd.id, rd.routine_id, rd.name, rd.position
  order by rd.position;
$$;

create or replace function public.start_workout(
  p_routine_id uuid,
  p_routine_day_id uuid
)
returns uuid
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  v_session_id uuid;
  v_active_routine_id uuid;
  v_active_day_id uuid;
  v_routine_name text;
  v_day_name text;
begin
  if (select auth.uid()) is null then
    raise exception using errcode = '42501', message = 'Authentication required';
  end if;

  select s.id, s.routine_id, s.routine_day_id
  into v_session_id, v_active_routine_id, v_active_day_id
  from public.workout_sessions s
  where s.user_id = (select auth.uid())
    and s.status = 'active';

  if v_session_id is not null then
    if v_active_routine_id = p_routine_id and v_active_day_id = p_routine_day_id then
      return v_session_id;
    end if;
    raise exception using errcode = '23505', message = 'An active workout already exists';
  end if;

  select r.name, rd.name
  into v_routine_name, v_day_name
  from public.routines r
  join public.routine_days rd on rd.routine_id = r.id
  where r.id = p_routine_id
    and rd.id = p_routine_day_id
    and r.user_id = (select auth.uid())
    and r.archived_at is null;

  if v_routine_name is null then
    raise exception using errcode = '42501', message = 'Routine or routine day not found';
  end if;

  insert into public.workout_sessions (
    user_id,
    routine_id,
    routine_day_id,
    name,
    day_name,
    status
  )
  values (
    (select auth.uid()),
    p_routine_id,
    p_routine_day_id,
    v_routine_name,
    v_day_name,
    'active'
  )
  returning id into v_session_id;

  insert into public.session_exercises (session_id, exercise_id, position, note)
  select v_session_id, re.exercise_id, re.position, re.note
  from public.routine_exercises re
  where re.routine_id = p_routine_id
    and re.routine_day_id = p_routine_day_id
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
   and re.routine_day_id = p_routine_day_id
   and re.position = se.position
  cross join lateral generate_series(0, re.sets - 1) as series(position)
  where se.session_id = v_session_id;

  return v_session_id;
end;
$$;

-- Backwards-compatible shortcut for routines that contain one day.
create or replace function public.start_workout(p_routine_id uuid)
returns uuid
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  v_day_id uuid;
begin
  select rd.id
  into v_day_id
  from public.routine_days rd
  join public.routines r on r.id = rd.routine_id
  where rd.routine_id = p_routine_id
    and r.user_id = (select auth.uid())
    and r.archived_at is null
  order by rd.position
  limit 1;

  if v_day_id is null then
    raise exception using errcode = '42501', message = 'Routine not found';
  end if;

  return public.start_workout(p_routine_id, v_day_id);
end;
$$;

create or replace function public.archive_routine(p_routine_id uuid)
returns public.routines
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  v_routine public.routines;
begin
  update public.routines r
  set archived_at = coalesce(r.archived_at, timezone('utc', now()))
  where r.id = p_routine_id
    and r.user_id = (select auth.uid())
  returning r.* into v_routine;

  if not found then
    raise exception using errcode = '42501', message = 'Routine not found';
  end if;

  return v_routine;
end;
$$;

create or replace function public.unarchive_routine(p_routine_id uuid)
returns public.routines
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  v_routine public.routines;
begin
  update public.routines r
  set archived_at = null
  where r.id = p_routine_id
    and r.user_id = (select auth.uid())
  returning r.* into v_routine;

  if not found then
    raise exception using errcode = '42501', message = 'Routine not found';
  end if;

  return v_routine;
end;
$$;

create or replace function public.get_my_workout_history(p_routine_id uuid default null)
returns table (
  session_id uuid,
  routine_id uuid,
  routine_name text,
  routine_day_id uuid,
  day_name text,
  started_at timestamptz,
  finished_at timestamptz,
  duration_minutes integer,
  exercises jsonb
)
language sql
stable
security invoker
set search_path = public, pg_temp
as $$
  select
    s.id,
    s.routine_id,
    coalesce(r.name, s.name),
    s.routine_day_id,
    s.day_name,
    s.started_at,
    s.finished_at,
    s.duration_minutes,
    coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', se.id,
            'exercise_id', se.exercise_id,
            'position', se.position,
            'note', se.note,
            'exercise', jsonb_build_object(
              'id', e.id,
              'name', e.name,
              'muscle', e.muscle,
              'secondary', e.secondary,
              'equipment', e.equipment,
              'kind', e.kind,
              'initials', e.initials,
              'color', e.color
            ),
            'sets', coalesce(
              (
                select jsonb_agg(
                  jsonb_build_object(
                    'id', ws.id,
                    'position', ws.position,
                    'weight', ws.weight,
                    'reps', ws.reps,
                    'target', ws.target,
                    'completed', ws.completed
                  ) order by ws.position
                )
                from public.workout_sets ws
                where ws.session_exercise_id = se.id
              ),
              '[]'::jsonb
            )
          ) order by se.position
        )
        from public.session_exercises se
        join public.exercises e on e.id = se.exercise_id
        where se.session_id = s.id
      ),
      '[]'::jsonb
    )
  from public.workout_sessions s
  left join public.routines r on r.id = s.routine_id
  where s.user_id = (select auth.uid())
    and s.status = 'completed'
    and (p_routine_id is null or s.routine_id = p_routine_id)
  order by s.started_at desc;
$$;

-- Archiving is the safe removal operation: it hides a program from the active
-- list while keeping its definition and history available forever.
drop policy routines_delete_own on public.routines;

revoke execute on function public.create_routine_program(text, text, integer, text, jsonb) from public, anon;
revoke execute on function public.get_my_routine_days(uuid) from public, anon;
revoke execute on function public.start_workout(uuid, uuid) from public, anon;
revoke execute on function public.archive_routine(uuid) from public, anon;
revoke execute on function public.unarchive_routine(uuid) from public, anon;
revoke execute on function public.get_my_workout_history(uuid) from public, anon;

grant execute on function public.create_routine_program(text, text, integer, text, jsonb) to authenticated;
grant execute on function public.get_my_routine_days(uuid) to authenticated;
grant execute on function public.start_workout(uuid, uuid) to authenticated;
grant execute on function public.archive_routine(uuid) to authenticated;
grant execute on function public.unarchive_routine(uuid) to authenticated;
grant execute on function public.get_my_workout_history(uuid) to authenticated;

commit;
