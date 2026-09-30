begin;

-- RPCs no longer used by the app. The app now reads routines with a nested select
-- and always starts workouts with an explicit routine day.
drop function if exists public.get_my_routines();
drop function if exists public.create_routine(text, text, text, integer, text, jsonb);
drop function if exists public.get_my_routine_days(uuid);
drop function if exists public.start_workout(uuid);

commit;
