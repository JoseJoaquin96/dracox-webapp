begin;

create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  name text not null,
  muscle text not null,
  secondary text not null default '',
  equipment text not null,
  kind text not null check (kind in ('strength', 'bodyweight', 'timed', 'distance')),
  initials text not null default '',
  color text not null default '#d8f36a',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.routines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  focus text not null default '',
  days text not null default 'Sin programar',
  duration integer not null default 0 check (duration >= 0),
  color text not null default '#d8f36a',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.routine_exercises (
  id uuid primary key default gen_random_uuid(),
  routine_id uuid not null references public.routines(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  position integer not null check (position >= 0),
  sets integer not null check (sets > 0),
  rep_range text not null default '',
  rest_seconds integer not null default 0 check (rest_seconds >= 0),
  note text,
  created_at timestamptz not null default timezone('utc', now()),
  unique (routine_id, position)
);

create table public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  routine_id uuid references public.routines(id) on delete set null,
  name text not null,
  started_at timestamptz not null default timezone('utc', now()),
  finished_at timestamptz,
  duration_minutes integer check (duration_minutes is null or duration_minutes >= 0),
  status text not null default 'active' check (status in ('active', 'completed')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (
    (status = 'active' and finished_at is null)
    or (status = 'completed' and finished_at is not null)
  ),
  check (finished_at is null or finished_at >= started_at)
);

create table public.session_exercises (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.workout_sessions(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  position integer not null check (position >= 0),
  note text,
  created_at timestamptz not null default timezone('utc', now()),
  unique (session_id, position)
);

create table public.workout_sets (
  id uuid primary key default gen_random_uuid(),
  session_exercise_id uuid not null references public.session_exercises(id) on delete cascade,
  position integer not null check (position >= 0),
  weight numeric check (weight is null or weight >= 0),
  reps integer check (reps is null or reps >= 0),
  target text not null default '',
  completed boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  unique (session_exercise_id, position)
);

create table public.diets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  calories_target integer check (calories_target is null or calories_target >= 0),
  protein_target_g numeric check (protein_target_g is null or protein_target_g >= 0),
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.diet_entries (
  id uuid primary key default gen_random_uuid(),
  diet_id uuid not null references public.diets(id) on delete cascade,
  entry_date date not null,
  meal_type text not null default '',
  name text not null,
  calories numeric check (calories is null or calories >= 0),
  protein_g numeric check (protein_g is null or protein_g >= 0),
  carbs_g numeric check (carbs_g is null or carbs_g >= 0),
  fat_g numeric check (fat_g is null or fat_g >= 0),
  notes text,
  created_at timestamptz not null default timezone('utc', now())
);

create index exercises_owner_id_idx on public.exercises(owner_id);
create index routines_user_id_idx on public.routines(user_id);
create index routine_exercises_exercise_id_idx on public.routine_exercises(exercise_id);
create index workout_sessions_user_id_started_at_idx on public.workout_sessions(user_id, started_at desc);
create index workout_sessions_routine_id_idx on public.workout_sessions(routine_id);
create index session_exercises_exercise_id_idx on public.session_exercises(exercise_id);
create index workout_sets_session_exercise_id_idx on public.workout_sets(session_exercise_id);
create index diets_user_id_idx on public.diets(user_id);
create index diet_entries_diet_id_date_idx on public.diet_entries(diet_id, entry_date desc);
create unique index workout_sessions_one_active_per_user_idx
  on public.workout_sessions(user_id)
  where status = 'active';

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger exercises_set_updated_at
before update on public.exercises
for each row execute function public.set_updated_at();

create trigger routines_set_updated_at
before update on public.routines
for each row execute function public.set_updated_at();

create trigger workout_sessions_set_updated_at
before update on public.workout_sessions
for each row execute function public.set_updated_at();

create trigger diets_set_updated_at
before update on public.diets
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'display_name', '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.exercises enable row level security;
alter table public.routines enable row level security;
alter table public.routine_exercises enable row level security;
alter table public.workout_sessions enable row level security;
alter table public.session_exercises enable row level security;
alter table public.workout_sets enable row level security;
alter table public.diets enable row level security;
alter table public.diet_entries enable row level security;

create policy profiles_select_own
on public.profiles for select to authenticated
using (id = (select auth.uid()));

create policy profiles_update_own
on public.profiles for update to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

create policy exercises_select_visible
on public.exercises for select to authenticated
using (owner_id is null or owner_id = (select auth.uid()));

create policy exercises_insert_own
on public.exercises for insert to authenticated
with check (owner_id = (select auth.uid()));

create policy exercises_update_own
on public.exercises for update to authenticated
using (owner_id = (select auth.uid()))
with check (owner_id = (select auth.uid()));

create policy exercises_delete_own
on public.exercises for delete to authenticated
using (
  owner_id = (select auth.uid())
  and not exists (
    select 1
    from public.routine_exercises re
    where re.exercise_id = exercises.id
  )
  and not exists (
    select 1
    from public.session_exercises se
    where se.exercise_id = exercises.id
  )
);

create policy routines_select_own
on public.routines for select to authenticated
using (user_id = (select auth.uid()));

create policy routines_insert_own
on public.routines for insert to authenticated
with check (user_id = (select auth.uid()));

create policy routines_update_own
on public.routines for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy routines_delete_own
on public.routines for delete to authenticated
using (user_id = (select auth.uid()));

create policy routine_exercises_select_owned
on public.routine_exercises for select to authenticated
using (
  exists (
    select 1
    from public.routines r
    where r.id = routine_exercises.routine_id
      and r.user_id = (select auth.uid())
  )
);

create policy routine_exercises_insert_owned
on public.routine_exercises for insert to authenticated
with check (
  exists (
    select 1
    from public.routines r
    where r.id = routine_exercises.routine_id
      and r.user_id = (select auth.uid())
  )
  and exists (
    select 1
    from public.exercises e
    where e.id = routine_exercises.exercise_id
      and (e.owner_id is null or e.owner_id = (select auth.uid()))
  )
);

create policy routine_exercises_update_owned
on public.routine_exercises for update to authenticated
using (
  exists (
    select 1
    from public.routines r
    where r.id = routine_exercises.routine_id
      and r.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.routines r
    where r.id = routine_exercises.routine_id
      and r.user_id = (select auth.uid())
  )
  and exists (
    select 1
    from public.exercises e
    where e.id = routine_exercises.exercise_id
      and (e.owner_id is null or e.owner_id = (select auth.uid()))
  )
);

create policy routine_exercises_delete_owned
on public.routine_exercises for delete to authenticated
using (
  exists (
    select 1
    from public.routines r
    where r.id = routine_exercises.routine_id
      and r.user_id = (select auth.uid())
  )
);

create policy workout_sessions_select_own
on public.workout_sessions for select to authenticated
using (user_id = (select auth.uid()));

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
);

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
);

create policy workout_sessions_delete_own
on public.workout_sessions for delete to authenticated
using (user_id = (select auth.uid()));

create policy session_exercises_select_owned
on public.session_exercises for select to authenticated
using (
  exists (
    select 1
    from public.workout_sessions s
    where s.id = session_exercises.session_id
      and s.user_id = (select auth.uid())
  )
);

create policy session_exercises_insert_owned
on public.session_exercises for insert to authenticated
with check (
  exists (
    select 1
    from public.workout_sessions s
    where s.id = session_exercises.session_id
      and s.user_id = (select auth.uid())
  )
  and exists (
    select 1
    from public.exercises e
    where e.id = session_exercises.exercise_id
      and (e.owner_id is null or e.owner_id = (select auth.uid()))
  )
);

create policy session_exercises_update_owned
on public.session_exercises for update to authenticated
using (
  exists (
    select 1
    from public.workout_sessions s
    where s.id = session_exercises.session_id
      and s.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.workout_sessions s
    where s.id = session_exercises.session_id
      and s.user_id = (select auth.uid())
  )
  and exists (
    select 1
    from public.exercises e
    where e.id = session_exercises.exercise_id
      and (e.owner_id is null or e.owner_id = (select auth.uid()))
  )
);

create policy session_exercises_delete_owned
on public.session_exercises for delete to authenticated
using (
  exists (
    select 1
    from public.workout_sessions s
    where s.id = session_exercises.session_id
      and s.user_id = (select auth.uid())
  )
);

create policy workout_sets_select_owned
on public.workout_sets for select to authenticated
using (
  exists (
    select 1
    from public.session_exercises se
    join public.workout_sessions s on s.id = se.session_id
    where se.id = workout_sets.session_exercise_id
      and s.user_id = (select auth.uid())
  )
);

create policy workout_sets_insert_owned
on public.workout_sets for insert to authenticated
with check (
  exists (
    select 1
    from public.session_exercises se
    join public.workout_sessions s on s.id = se.session_id
    where se.id = workout_sets.session_exercise_id
      and s.user_id = (select auth.uid())
  )
);

create policy workout_sets_update_owned
on public.workout_sets for update to authenticated
using (
  exists (
    select 1
    from public.session_exercises se
    join public.workout_sessions s on s.id = se.session_id
    where se.id = workout_sets.session_exercise_id
      and s.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.session_exercises se
    join public.workout_sessions s on s.id = se.session_id
    where se.id = workout_sets.session_exercise_id
      and s.user_id = (select auth.uid())
  )
);

create policy workout_sets_delete_owned
on public.workout_sets for delete to authenticated
using (
  exists (
    select 1
    from public.session_exercises se
    join public.workout_sessions s on s.id = se.session_id
    where se.id = workout_sets.session_exercise_id
      and s.user_id = (select auth.uid())
  )
);

create policy diets_select_own
on public.diets for select to authenticated
using (user_id = (select auth.uid()));

create policy diets_insert_own
on public.diets for insert to authenticated
with check (user_id = (select auth.uid()));

create policy diets_update_own
on public.diets for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy diets_delete_own
on public.diets for delete to authenticated
using (user_id = (select auth.uid()));

create policy diet_entries_select_owned
on public.diet_entries for select to authenticated
using (
  exists (
    select 1
    from public.diets d
    where d.id = diet_entries.diet_id
      and d.user_id = (select auth.uid())
  )
);

create policy diet_entries_insert_owned
on public.diet_entries for insert to authenticated
with check (
  exists (
    select 1
    from public.diets d
    where d.id = diet_entries.diet_id
      and d.user_id = (select auth.uid())
  )
);

create policy diet_entries_update_owned
on public.diet_entries for update to authenticated
using (
  exists (
    select 1
    from public.diets d
    where d.id = diet_entries.diet_id
      and d.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.diets d
    where d.id = diet_entries.diet_id
      and d.user_id = (select auth.uid())
  )
);

create policy diet_entries_delete_owned
on public.diet_entries for delete to authenticated
using (
  exists (
    select 1
    from public.diets d
    where d.id = diet_entries.diet_id
      and d.user_id = (select auth.uid())
  )
);

insert into public.exercises (id, name, muscle, secondary, equipment, kind, initials, color)
values
  ('11111111-1111-4111-8111-111111111111', 'Press banca con barra', 'Pecho', 'Tríceps · Hombro', 'Barra', 'strength', 'PB', '#f1a65b'),
  ('22222222-2222-4222-8222-222222222222', 'Remo con barra', 'Espalda', 'Bíceps · Core', 'Barra', 'strength', 'RB', '#8c7bff'),
  ('33333333-3333-4333-8333-333333333333', 'Sentadilla trasera', 'Piernas', 'Glúteo · Core', 'Barra', 'strength', 'ST', '#b5e46c'),
  ('44444444-4444-4444-8444-444444444444', 'Jalón al pecho', 'Espalda', 'Bíceps', 'Polea', 'strength', 'JC', '#72b6ff'),
  ('55555555-5555-4555-8555-555555555555', 'Press militar sentado', 'Hombros', 'Tríceps', 'Mancuernas', 'strength', 'PM', '#e98caa'),
  ('66666666-6666-4666-8666-666666666666', 'Prensa inclinada', 'Piernas', 'Glúteo', 'Máquina', 'strength', 'PI', '#9bdcba'),
  ('77777777-7777-4777-8777-777777777777', 'Peso muerto rumano', 'Isquios', 'Glúteo · Espalda', 'Mancuernas', 'strength', 'PR', '#efa06f'),
  ('88888888-8888-4888-8888-888888888888', 'Plancha frontal', 'Core', 'Abdominales', 'Peso corporal', 'timed', 'PF', '#b4a0f5')
on conflict (id) do nothing;

commit;
