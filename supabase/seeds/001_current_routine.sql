-- One-time personal seed for the complete four-day program.
-- Replace the email before running this script.
-- It creates one routine with four selectable days and archives the old
-- four-routine version if it was already seeded.

do $$
declare
  v_user_id uuid;
  v_routine_id uuid;
  v_upper_a uuid;
  v_lower_a uuid;
  v_upper_b uuid;
  v_lower_b uuid;
begin
  select id into v_user_id
  from auth.users
  where email = 'tu email aquí';

  if v_user_id is null then
    raise exception 'User not found. Replace the email in supabase/seeds/001_current_routine.sql';
  end if;

  select id into v_routine_id
  from public.routines
  where user_id = v_user_id
    and name = 'Mi rutina 4 días';

  if v_routine_id is null then
    insert into public.routines (user_id, name, focus, days, duration, color)
    values (
      v_user_id,
      'Mi rutina 4 días',
      'Upper / Lower · pecho, espalda, hombros y pierna',
      '4 días flexibles',
      55,
      '#d8f36a'
    )
    returning id into v_routine_id;

    insert into public.routine_days (routine_id, name, position)
    values (v_routine_id, 'Upper A', 0)
    returning id into v_upper_a;

    insert into public.routine_days (routine_id, name, position)
    values (v_routine_id, 'Lower A', 1)
    returning id into v_lower_a;

    insert into public.routine_days (routine_id, name, position)
    values (v_routine_id, 'Upper B', 2)
    returning id into v_upper_b;

    insert into public.routine_days (routine_id, name, position)
    values (v_routine_id, 'Lower B', 3)
    returning id into v_lower_b;

    insert into public.routine_exercises (
      routine_id, routine_day_id, exercise_id, position, sets, rep_range, rest_seconds
    )
    values
      (v_routine_id, v_upper_a, '90000000-0000-4000-8000-000000000001', 0, 4, '6–10', 150),
      (v_routine_id, v_upper_a, '90000000-0000-4000-8000-000000000002', 1, 3, '8–12', 120),
      (v_routine_id, v_upper_a, '90000000-0000-4000-8000-000000000003', 2, 4, '8–12', 120),
      (v_routine_id, v_upper_a, '90000000-0000-4000-8000-000000000004', 3, 3, '8–12', 120),
      (v_routine_id, v_upper_a, '90000000-0000-4000-8000-000000000005', 4, 2, '12–15', 75),
      (v_routine_id, v_upper_a, '90000000-0000-4000-8000-000000000006', 5, 3, '12–20', 75),
      (v_routine_id, v_upper_a, '90000000-0000-4000-8000-000000000007', 6, 2, '8–12', 90),
      (v_routine_id, v_upper_a, '90000000-0000-4000-8000-000000000008', 7, 2, '10–15', 90),

      (v_routine_id, v_lower_a, '90000000-0000-4000-8000-000000000009', 0, 4, '8–12', 150),
      (v_routine_id, v_lower_a, '90000000-0000-4000-8000-000000000010', 1, 3, '10–15', 90),
      (v_routine_id, v_lower_a, '90000000-0000-4000-8000-000000000011', 2, 4, '8–12', 120),
      (v_routine_id, v_lower_a, '90000000-0000-4000-8000-000000000012', 3, 3, '8–12', 120),
      (v_routine_id, v_lower_a, '90000000-0000-4000-8000-000000000013', 4, 4, '10–15', 90),
      (v_routine_id, v_lower_a, '90000000-0000-4000-8000-000000000014', 5, 3, '10–15', 60),

      (v_routine_id, v_upper_b, '90000000-0000-4000-8000-000000000002', 0, 4, '6–10', 150),
      (v_routine_id, v_upper_b, '90000000-0000-4000-8000-000000000015', 1, 3, '8–12', 120),
      (v_routine_id, v_upper_b, '90000000-0000-4000-8000-000000000016', 2, 3, '8–12', 105),
      (v_routine_id, v_upper_b, '90000000-0000-4000-8000-000000000017', 3, 3, '10–12', 105),
      (v_routine_id, v_upper_b, '90000000-0000-4000-8000-000000000018', 4, 4, '12–20', 75),
      (v_routine_id, v_upper_b, '90000000-0000-4000-8000-000000000019', 5, 3, '12–20', 75),
      (v_routine_id, v_upper_b, '90000000-0000-4000-8000-000000000020', 6, 2, '8–12', 90),
      (v_routine_id, v_upper_b, '90000000-0000-4000-8000-000000000021', 7, 2, '10–15', 90),

      (v_routine_id, v_lower_b, '90000000-0000-4000-8000-000000000022', 0, 3, '10–12', 120),
      (v_routine_id, v_lower_b, '90000000-0000-4000-8000-000000000023', 1, 3, '10–15', 90),
      (v_routine_id, v_lower_b, '90000000-0000-4000-8000-000000000010', 2, 3, '12–15', 90),
      (v_routine_id, v_lower_b, '90000000-0000-4000-8000-000000000012', 3, 3, '10–15', 120),
      (v_routine_id, v_lower_b, '90000000-0000-4000-8000-000000000024', 4, 4, '8–15', 90),
      (v_routine_id, v_lower_b, '90000000-0000-4000-8000-000000000025', 5, 3, '10–15', 90),
      (v_routine_id, v_lower_b, '90000000-0000-4000-8000-000000000008', 6, 3, '10–15', 90);
  end if;

  update public.routines
  set archived_at = coalesce(archived_at, timezone('utc', now()))
  where user_id = v_user_id
    and name in ('Upper A', 'Lower A', 'Upper B', 'Lower B')
    and id <> v_routine_id;
end;
$$;
