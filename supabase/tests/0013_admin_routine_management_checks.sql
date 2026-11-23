-- Run after migrations 0001-0013. All fixture data is rolled back.

begin;

do $$
declare
  v_admin uuid := gen_random_uuid();
  v_athlete uuid := gen_random_uuid();
  v_admin_exercise uuid := gen_random_uuid();
  v_athlete_exercise uuid := gen_random_uuid();
  v_admin_routine uuid;
  v_athlete_routine uuid;
  v_day uuid;
  v_days jsonb := '[{"name":"Día A"}]';
  v_athlete_days jsonb;
  v_duplicate_days jsonb;
begin
  insert into auth.users (id) values (v_admin), (v_athlete);
  update public.profiles set is_admin = true where id = v_admin;
  insert into public.exercises (id, owner_id, name, muscle, equipment, kind)
  values (v_admin_exercise, v_admin, 'Admin custom', 'General', 'Libre', 'strength'),
         (v_athlete_exercise, v_athlete, 'Athlete custom', 'General', 'Libre', 'strength');

  if has_function_privilege('authenticated',
    'public.write_routine_program(uuid,uuid,boolean,text,text,integer,text,jsonb)', 'execute') then
    raise exception 'Authenticated clients can call the internal routine writer';
  end if;

  set local role authenticated;
  perform set_config('request.jwt.claim.sub', v_athlete::text, true);
  begin
    perform public.admin_create_routine_program(v_admin, 'Denied', p_days => v_days);
    raise exception 'A regular athlete can call the admin create RPC';
  exception when insufficient_privilege then null;
  end;

  perform set_config('request.jwt.claim.sub', v_admin::text, true);
  v_admin_routine := public.create_routine_program('Personal', p_days => v_days);
  begin
    perform public.admin_create_routine_program(v_athlete, 'Wrong exercise', p_days => jsonb_build_array(
      jsonb_build_object('name', 'A', 'exercises', jsonb_build_array(jsonb_build_object('exercise_id', v_admin_exercise, 'sets', 3)))
    ));
    raise exception 'Admin assigned an exercise the athlete cannot use';
  exception when invalid_parameter_value then null;
  end;

  v_athlete_days := jsonb_build_array(jsonb_build_object(
    'name', 'A', 'exercises', jsonb_build_array(jsonb_build_object('exercise_id', v_athlete_exercise, 'sets', 3))
  ));
  v_athlete_routine := public.admin_create_routine_program(v_athlete, 'Athlete', p_days => v_athlete_days);
  select id into strict v_day from public.routine_days where routine_id = v_athlete_routine;
  v_athlete_days := jsonb_set(v_athlete_days, '{0,id}', to_jsonb(v_day), true);
  v_duplicate_days := v_athlete_days || v_athlete_days;

  begin
    perform public.admin_update_routine_program(v_athlete_routine, v_athlete, 'Duplicate days', p_days => v_duplicate_days);
    raise exception 'Admin update accepted duplicate days';
  exception when invalid_parameter_value then
    if sqlerrm <> 'Duplicated routine day' then raise; end if;
  end;

  perform public.admin_update_routine_program(v_athlete_routine, v_athlete, 'Revised', p_days => v_athlete_days);
  if not exists (select 1 from public.routine_days where routine_id = v_athlete_routine and id = v_day) then
    raise exception 'Admin update replaced an existing day ID';
  end if;

  if (public.admin_set_routine_archived(v_athlete_routine, v_athlete, true)).archived_at is null then
    raise exception 'Admin could not archive the routine';
  end if;

  begin
    perform public.admin_update_routine_program(v_athlete_routine, v_athlete, 'Archived edit', p_days => v_athlete_days);
    raise exception 'Admin could edit an archived routine';
  exception when insufficient_privilege then null;
  end;

  if (public.admin_set_routine_archived(v_athlete_routine, v_athlete, false)).archived_at is not null then
    raise exception 'Admin could not restore the routine';
  end if;

  perform set_config('request.jwt.claim.sub', v_athlete::text, true);
  if exists (select 1 from public.routines where id = v_admin_routine) then
    raise exception 'A regular athlete can read another user''s routine';
  end if;

  begin
    perform public.update_routine_program(v_athlete_routine, 'Duplicate days', p_days => v_duplicate_days);
    raise exception 'Personal update accepted duplicate days';
  exception when invalid_parameter_value then
    if sqlerrm <> 'Duplicated routine day' then raise; end if;
  end;

  perform public.update_routine_program(v_athlete_routine, 'Personal edit', p_days => v_athlete_days);
  if not exists (select 1 from public.routines where id = v_athlete_routine and name = 'Personal edit') then
    raise exception 'Athlete could not edit their routine';
  end if;
end;
$$;

rollback;
