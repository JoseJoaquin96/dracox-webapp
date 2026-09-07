# Supabase setup

This directory contains the versioned database schema for Forge. The Angular
prototype uses Supabase for routines, sessions and workout records; it does not
persist workout data in browser storage.

## Basic workout scope

The first Supabase slice is deliberately limited to the workout loop:

1. Read the authenticated user's routines, including their exercises.
2. Create one routine program with any number of selectable routine days.
3. Start one workout from a selected routine day, creating a snapshot of its exercises and sets.
4. Record weight, repetitions and completion for each active set.
5. Finish the workout and store its duration.
6. Archive old routine programs without deleting their definition or history.

The nutrition tables already present in the initial schema are left untouched
but are out of scope for this slice.

Migrations `0002_basic_workout_api.sql`, `0004_flexible_routines.sql` and
`0005_remote_routine_crud_and_workouts.sql` expose
these operations as authenticated RPCs. The functions use the caller's JWT and
keep the existing RLS policies as the authorization boundary.

### Data model

- `routines` is one complete program, such as "Mi rutina 4 días".
- `routine_days` contains the selectable blocks, such as Upper A or Lower B.
- `routine_exercises` belongs to one routine day and stores its planned work.
- `workout_sessions` is one real training day. It snapshots the selected day.
- `session_exercises` and `workout_sets` preserve the weights and repetitions
  even if the routine is edited later.
- `routines.archived_at` hides an old program from the active view without
  deleting it or its history.

There is intentionally no required weekday. The user chooses the next routine
day whenever they train.

### RPC contract

- `get_my_routines()` returns the current user's routines with nested exercises.
- `create_routine(p_name, p_focus, p_days, p_duration, p_color, p_exercises)`
  remains as a backwards-compatible single-day creator.
- `create_routine_program(p_name, p_focus, p_duration, p_color, p_days)` returns
  one routine UUID. `p_days` is an ordered JSON array of day blocks, for example:

  ```json
  [
    {
      "name": "Upper A",
      "exercises": [
        {"exercise_id": "11111111-1111-4111-8111-111111111111", "sets": 4, "rep_range": "6-8", "rest_seconds": 120}
      ]
    }
  ]
  ```

- `get_my_routine_days(p_routine_id)` returns the selectable days and their exercises.
- `start_workout(p_routine_id, p_routine_day_id)` returns the active session UUID
  and is idempotent when the same routine day is already active.
- `archive_routine(p_routine_id)` and `unarchive_routine(p_routine_id)` change
  visibility without deleting the routine or its history.
- `update_routine_program(p_routine_id, p_name, p_focus, p_duration, p_color, p_days)`
  replaces the editable definition of an active routine while leaving old
  workout snapshots untouched.
- `get_my_active_workout(p_session_id)` reads the authenticated user's active
  session, including its sets.
- `add_workout_set(p_session_exercise_id)` adds one set to the active session.
- `update_workout_set(p_set_id, p_weight, p_reps, p_completed)` updates a set
  belonging to the authenticated user's active session.
- `finish_workout(p_session_id)` closes the active session and returns it.
- `get_my_workout_history(p_routine_id)` returns completed sessions with their
  exercises and recorded sets. Pass `null` to read all routines.

The Angular app uses these RPCs directly. RLS and the authenticated RPC checks
keep every routine and workout session scoped to its owner.

## One-time project setup

1. Create a Supabase project in a nearby European region.
2. In Authentication > Providers, enable Email.
3. Enable email confirmations and password recovery.
4. Add these allowed URLs in Authentication > URL Configuration:
   - `http://localhost:4200`
   - `https://josejoaquin96.github.io/dracox-webapp/`
   - The production Vercel URL when one exists.
5. Apply `migrations/0001_initial_schema.sql` in the Supabase SQL Editor.
6. Apply `migrations/0002_basic_workout_api.sql` in the Supabase SQL Editor.
7. Apply `migrations/0003_current_routine_exercises.sql` in the Supabase SQL Editor.
8. Apply `migrations/0004_flexible_routines.sql` in the Supabase SQL Editor.
9. Apply `migrations/0005_remote_routine_crud_and_workouts.sql` in the Supabase SQL Editor.
10. Replace `REEMPLAZA_CON_TU_EMAIL` in `seeds/001_current_routine.sql` and run it once in the SQL Editor. It creates one four-day routine and archives the old four-routine version if present.
11. Run `tests/0001_schema_checks.sql`, `tests/0002_basic_workout_checks.sql`, `tests/0003_current_routine_checks.sql`, `tests/0004_flexible_routines_checks.sql` and `tests/0005_remote_routine_crud_and_workouts_checks.sql` in the SQL Editor as verification steps.

The public/publishable key may be used by the browser only together with the
RLS policies in the migration. Never expose the `service_role` key.

## RLS acceptance checks

After creating two test accounts, verify that each account can read its own
profile, routines and sessions, but cannot read or write the other account's
rows. Both accounts should be able to read the seeded global exercises, while
only their owner can modify a custom exercise.
