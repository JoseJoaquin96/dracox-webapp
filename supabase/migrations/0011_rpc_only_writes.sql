begin;

-- Routine and workout data can only be written through the RPCs, which validate the
-- flow (e.g. sets can only change while their workout is active). The RPCs run as
-- their owner and every one of them filters by auth.uid() explicitly.
-- Note: a later `create or replace` of these functions resets them to security invoker.
alter function public.create_routine_program(text, text, integer, text, jsonb) security definer;
alter function public.update_routine_program(uuid, text, text, integer, text, jsonb) security definer;
alter function public.archive_routine(uuid) security definer;
alter function public.unarchive_routine(uuid) security definer;
alter function public.start_workout(uuid, uuid) security definer;
alter function public.add_workout_set(uuid) security definer;
alter function public.update_workout_set(uuid, numeric, integer, boolean) security definer;
alter function public.finish_workout(uuid) security definer;

revoke insert, update, delete on table
  public.routines,
  public.routine_days,
  public.routine_exercises,
  public.workout_sessions,
  public.session_exercises,
  public.workout_sets
from anon, authenticated;

commit;
