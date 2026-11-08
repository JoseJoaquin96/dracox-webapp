---
version: 1
slug: "src-styles-css"
primary_target: "src/styles.css"
related_targets: ["src/app/layout/shell.component.html","src/app/features/dashboard/dashboard.component.html","src/app/features/routines/routines.component.html","src/app/features/routines/routine-editor.component.html","src/app/features/workout/workout.component.html","src/app/features/workout/rest-timer.component.html","src/app/features/progress/progress.component.html","src/app/features/exercises/exercises.component.html","src/app/features/login/login.component.html","src/app/features/profile/profile.component.html","src/app/features/admin-errors/admin-errors.component.html","src/app/shared/session-detail.component.ts","src/app/shared/modal.component.ts"]
---

# Scope

Whole logged-in Dracox web UI; visitor mode: Operate. Primary target: `src/styles.css`; related screens include the app shell, dashboard, routines, workout logging, progress, exercises, profile, sign-in, administrator log, and session details.

## Audience and task

A person training strength alone needs to choose a flexible routine day, record work between sets, and later understand how training is progressing. The UI must preserve all existing screens, actions, stored records, offline entry, and synchronization. Evidence comes from the user's own routine, target sets and reps, previous performance, completed work, and history. No fixed weekday schedule or unsupported product claim.

## Direction contract

THESIS: Treat the workout as an annotated movement sheet: make the next useful action and its training data easy to read, and refuse metric-card dashboards that compete with the session.

OWN-WORLD: Atlas de movimiento, translated as a contemporary strength-training reference sheet: cool mineral ground, deep green ink, quiet teal measures, restrained rust for a meaningful state, numbered movement rows, tabular figures, and clear rules. No anatomical illustration or decorative grid.

STORY: A lifter sees which flexible routine day is next, what it contains, and how current work compares with previous sessions; completing a set marks progress in place and confirms autosave.

FIRST VIEWPORT: At 1440px, a 78px dark-teal top bar holds Dracox, familiar route links, sync state, and profile. Below, a dated heading leads into one wide two-column workspace: the next session and its first movements occupy the left; a flat, annotated weekly muscle summary occupies the right. At 390px, the session leads in one column, the summary follows, and the four main routes remain in a bottom bar; Admin appears there for administrators.

FORM: Selected direction: Atlas de movimiento, the top grounded pick. It is a code-led Operate surface; the chosen sketch is the layout reference. Signature interaction: one set changes from open to complete in its own row, advances the progress count, starts the configured rest timer, and retains the row for correction. Carry movement numbering, muscle names, and measured values across routines, logging, exercise library, and progress.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved decisions

None. Keep the existing behavior and content model; present product capability suggestions separately from this implementation.
