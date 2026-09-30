-- Run after migrations 0001-0009 in the Supabase SQL editor.

do $$
begin
  if to_regprocedure('public.get_my_routines()') is not null
     or to_regprocedure('public.create_routine(text,text,text,integer,text,jsonb)') is not null
     or to_regprocedure('public.get_my_routine_days(uuid)') is not null
     or to_regprocedure('public.start_workout(uuid)') is not null then
    raise exception 'Legacy RPCs still exist; apply migration 0009';
  end if;

  if to_regprocedure('public.start_workout(uuid,uuid)') is null then
    raise exception 'start_workout(uuid,uuid) is missing';
  end if;
end;
$$;
