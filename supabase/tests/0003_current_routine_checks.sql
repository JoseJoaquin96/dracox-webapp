-- Run after 0003_current_routine_exercises.sql.

do $$
begin
  if (
    select count(*)
    from public.exercises
    where id between
      '90000000-0000-4000-8000-000000000001'::uuid and
      '90000000-0000-4000-8000-000000000025'::uuid
  ) <> 25 then
    raise exception 'Current routine exercise catalog is incomplete';
  end if;

  if exists (
    select 1
    from public.exercises
    where id between
      '90000000-0000-4000-8000-000000000001'::uuid and
      '90000000-0000-4000-8000-000000000025'::uuid
      and owner_id is not null
  ) then
    raise exception 'Current routine exercise catalog must be global';
  end if;
end;
$$;
