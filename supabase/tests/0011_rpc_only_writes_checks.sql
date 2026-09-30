-- Run after migrations 0001-0011 in the Supabase SQL editor.

do $$
declare
  v_function text;
  v_table text;
begin
  foreach v_function in array array[
    'public.create_routine_program(text,text,integer,text,jsonb)',
    'public.update_routine_program(uuid,text,text,integer,text,jsonb)',
    'public.archive_routine(uuid)',
    'public.unarchive_routine(uuid)',
    'public.start_workout(uuid,uuid)',
    'public.add_workout_set(uuid)',
    'public.update_workout_set(uuid,numeric,integer,boolean)',
    'public.finish_workout(uuid)'
  ] loop
    if not (select prosecdef from pg_proc where oid = v_function::regprocedure) then
      raise exception '% must be security definer; apply migration 0011', v_function;
    end if;
  end loop;

  foreach v_table in array array[
    'public.routines',
    'public.routine_days',
    'public.routine_exercises',
    'public.workout_sessions',
    'public.session_exercises',
    'public.workout_sets'
  ] loop
    if has_table_privilege('authenticated', v_table, 'INSERT')
       or has_table_privilege('authenticated', v_table, 'UPDATE')
       or has_table_privilege('authenticated', v_table, 'DELETE') then
      raise exception 'authenticated can still write % directly', v_table;
    end if;

    if not has_table_privilege('authenticated', v_table, 'SELECT') then
      raise exception 'authenticated must still read %', v_table;
    end if;
  end loop;
end;
$$;
