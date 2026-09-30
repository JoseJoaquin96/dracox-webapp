begin;

-- Progress statistics over the whole history, so they don't depend on how many
-- history pages the app has loaded. Days and weeks use the caller's time zone.
create or replace function public.get_my_progress_summary(p_timezone text default 'UTC')
returns jsonb
language sql
stable
security invoker
set search_path = public, pg_temp
as $$
  with zone as (
    select coalesce((select name from pg_timezone_names where name = p_timezone), 'UTC') as name
  ),
  sessions as (
    select s.id, coalesce(s.finished_at, s.started_at) as done_at
    from public.workout_sessions s
    where s.user_id = (select auth.uid())
      and s.status = 'completed'
  ),
  done_sets as (
    select se.exercise_id, ws.weight, ws.reps, ss.done_at
    from sessions ss
    join public.session_exercises se on se.session_id = ss.id
    join public.workout_sets ws on ws.session_exercise_id = se.id
    where ws.completed
  ),
  best as (
    select distinct on (exercise_id) exercise_id, weight, reps, done_at
    from done_sets
    where weight is not null and reps is not null
    order by exercise_id, weight desc, reps desc, done_at
  ),
  weekly as (
    select date_trunc('week', ds.done_at at time zone zone.name)::date as week_start, sum(ds.weight * ds.reps) as volume
    from done_sets ds, zone
    where ds.weight is not null
      and ds.reps is not null
      and ds.done_at >= now() - interval '8 weeks'
    group by 1
  )
  select jsonb_build_object(
    'sessions', (select count(*) from sessions),
    'completed_sets', (select count(*) from done_sets),
    'volume', (select coalesce(sum(weight * reps), 0) from done_sets where weight is not null and reps is not null),
    'records', coalesce(
      (select jsonb_agg(jsonb_build_object('exercise_id', exercise_id, 'weight', weight, 'reps', reps, 'date', done_at) order by weight desc) from best),
      '[]'::jsonb
    ),
    'training_days', coalesce(
      (select jsonb_agg(distinct to_char(ss.done_at at time zone zone.name, 'YYYY-MM-DD')) from sessions ss, zone),
      '[]'::jsonb
    ),
    'weekly_volume', coalesce(
      (select jsonb_agg(jsonb_build_object('week_start', week_start, 'volume', volume) order by week_start) from weekly),
      '[]'::jsonb
    )
  );
$$;

-- Best set (by estimated 1RM) of each of the last sessions that included the exercise.
create or replace function public.get_my_exercise_progress(p_exercise_id uuid, p_limit integer default 12)
returns table (performed_at timestamptz, weight numeric, reps integer)
language sql
stable
security invoker
set search_path = public, pg_temp
as $$
  select best.performed_at, best.weight, best.reps
  from (
    select distinct on (s.id)
      coalesce(s.finished_at, s.started_at) as performed_at,
      ws.weight,
      ws.reps
    from public.workout_sessions s
    join public.session_exercises se on se.session_id = s.id
    join public.workout_sets ws on ws.session_exercise_id = se.id
    where s.user_id = (select auth.uid())
      and s.status = 'completed'
      and se.exercise_id = p_exercise_id
      and ws.completed
      and ws.weight is not null
      and ws.reps is not null
    order by s.id, ws.weight * (1 + ws.reps / 30.0) desc
  ) best
  order by best.performed_at desc
  limit least(greatest(coalesce(p_limit, 12), 1), 52);
$$;

revoke execute on function public.get_my_progress_summary(text) from public, anon;
revoke execute on function public.get_my_exercise_progress(uuid, integer) from public, anon;
grant execute on function public.get_my_progress_summary(text) to authenticated;
grant execute on function public.get_my_exercise_progress(uuid, integer) to authenticated;

commit;
