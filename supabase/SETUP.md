# Supabase setup

This directory contains the versioned database schema for Forge. The frontend
and `localStorage` are intentionally unchanged until the database checks pass.

## Basic workout scope

The first Supabase slice is deliberately limited to the workout loop:

1. Read the authenticated user's routines, including their exercises.
2. Create a routine and its ordered exercises in one transaction.
3. Start one workout from a routine, creating a snapshot of its exercises and sets.
4. Record weight, repetitions and completion for each active set.
5. Finish the workout and store its duration.

The nutrition tables already present in the initial schema are left untouched
but are out of scope for this slice.

Migration `0002_basic_workout_api.sql` exposes these operations as authenticated
RPCs. The functions use the caller's JWT and keep the existing RLS policies as
the authorization boundary.

### RPC contract

- `get_my_routines()` returns the current user's routines with nested exercises.
- `create_routine(p_name, p_focus, p_days, p_duration, p_color, p_exercises)`
  returns the new routine UUID. `p_exercises` is an ordered JSON array, for example:

  ```json
  [
    {"exercise_id":"11111111-1111-4111-8111-111111111111","sets":4,"rep_range":"6–8","rest_seconds":120}
  ]
  ```

- `start_workout(p_routine_id)` returns the active session UUID and is idempotent
  when the same routine is already active.
- `update_workout_set(p_set_id, p_weight, p_reps, p_completed)` updates a set
  belonging to the authenticated user's active session.
- `finish_workout(p_session_id)` closes the active session and returns it.

Reads of active sessions and completed history can use the protected tables
`workout_sessions`, `session_exercises` and `workout_sets` directly through the
Supabase Data API. No Angular integration is included in this phase.

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
8. Replace `REEMPLAZA_CON_TU_EMAIL` in `seeds/001_current_routine.sql` and run it once in the SQL Editor to create the four personal routines.
9. Run `tests/0001_schema_checks.sql`, `tests/0002_basic_workout_checks.sql` and `tests/0003_current_routine_checks.sql` in the SQL Editor as verification steps.

The public/publishable key may be used by the browser only together with the
RLS policies in the migration. Never expose the `service_role` key.

## RLS acceptance checks

After creating two test accounts, verify that each account can read its own
profile, routines and sessions, but cannot read or write the other account's
rows. Both accounts should be able to read the seeded global exercises, while
only their owner can modify a custom exercise.
