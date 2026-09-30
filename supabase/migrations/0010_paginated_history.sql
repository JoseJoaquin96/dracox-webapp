begin;

-- History is now paginated (newest first) instead of returning every session at once.
-- The unused per-exercise catalogue object is also dropped to shrink the payload.
drop function if exists public.get_my_workout_history(uuid);

create or replace function public.get_my_workout_history(
  p_limit integer default 50,
  p_before timestamptz default null
)
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
        where se.session_id = s.id
      ),
      '[]'::jsonb
    )
  from public.workout_sessions s
  left join public.routines r on r.id = s.routine_id
  where s.user_id = (select auth.uid())
    and s.status = 'completed'
    and (p_before is null or s.started_at < p_before)
  order by s.started_at desc
  limit least(greatest(coalesce(p_limit, 50), 1), 200);
$$;

revoke execute on function public.get_my_workout_history(integer, timestamptz) from public, anon;
grant execute on function public.get_my_workout_history(integer, timestamptz) to authenticated;

commit;
