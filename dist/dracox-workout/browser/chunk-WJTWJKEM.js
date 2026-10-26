// src/app/domain/stats.ts
var WEEKDAY_LABELS = ["Lun", "Mar", "Mi\xE9", "Jue", "Vie", "S\xE1b", "Dom"];
var SET_FIELDS = {
  strength: { weight: "Peso", reps: "Reps" },
  bodyweight: { weight: "Lastre", reps: "Reps" },
  timed: { weight: null, reps: "Seg" },
  distance: { weight: null, reps: "Metros" }
};
function routineExercises(routine) {
  return routine.days.flatMap((day) => day.exercises);
}
function plannedSets(routine) {
  return routineExercises(routine).reduce((sum, exercise) => sum + exercise.sets, 0);
}
function sessionTimestamp(session) {
  return session.finishedAt ?? session.startedAt;
}
function localDayKey(value) {
  const date = new Date(value);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}
function startOfWeek(now) {
  const monday = new Date(now);
  monday.setDate(now.getDate() - (now.getDay() + 6) % 7);
  monday.setHours(0, 0, 0, 0);
  return monday;
}
function sessionsSince(sessions, since) {
  return sessions.filter((session) => new Date(sessionTimestamp(session)) >= since);
}
function sessionVolume(session) {
  return session.exercises.flatMap((exercise) => exercise.sets).reduce((sum, set) => set.completed && set.weight !== null && set.reps !== null ? sum + set.weight * set.reps : sum, 0);
}
function completedSetCount(session) {
  return session.exercises.reduce((sum, exercise) => sum + exercise.sets.filter((set) => set.completed).length, 0);
}
function estimatedOneRepMax(weight, reps) {
  return reps <= 1 ? weight : Math.round(weight * (1 + reps / 30));
}
function nextRoutineDay(routine, sessions) {
  const last = sessions.find((session) => session.routineId === routine.id);
  const index = routine.days.findIndex((day) => day.id === last?.routineDayId);
  return routine.days[(index + 1) % routine.days.length] ?? null;
}
function weekActivity(sessions, now) {
  const monday = startOfWeek(now);
  const todayKey = localDayKey(now);
  return WEEKDAY_LABELS.map((label, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    const key = localDayKey(date);
    const daySessions = sessions.filter((session) => localDayKey(sessionTimestamp(session)) === key);
    return {
      key,
      label,
      date: date.getDate(),
      sessions: daySessions.length,
      volume: daySessions.reduce((sum, session) => sum + sessionVolume(session), 0),
      minutes: daySessions.reduce((sum, session) => sum + (session.durationMinutes ?? 0), 0),
      isToday: key === todayKey
    };
  });
}
function muscleDistribution(sessions, muscleOf) {
  const totals = /* @__PURE__ */ new Map();
  for (const session of sessions) {
    for (const exercise of session.exercises) {
      const completed = exercise.sets.filter((set) => set.completed).length;
      if (!completed)
        continue;
      const muscle = muscleOf(exercise.exerciseId) ?? "Otros";
      totals.set(muscle, (totals.get(muscle) ?? 0) + completed);
    }
  }
  return Array.from(totals, ([muscle, sets]) => ({ muscle, sets })).sort((a, b) => b.sets - a.sets);
}
function monthCalendar(trainingDays, now) {
  const year = now.getFullYear();
  const month = now.getMonth();
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const trained = new Set(trainingDays);
  return Array.from({ length: Math.ceil((offset + daysInMonth) / 7) * 7 }, (_, index) => {
    const date = new Date(year, month, index - offset + 1);
    const inMonth = date.getMonth() === month;
    const key = localDayKey(date);
    return { key, label: date.getDate(), inMonth, trained: inMonth && trained.has(key) };
  });
}
function lastWeeksVolume(weeklyVolume, now) {
  const byWeek = new Map(weeklyVolume.map((week) => [week.weekStart, week.volume]));
  const monday = startOfWeek(now);
  return Array.from({ length: 8 }, (_, index) => {
    const weekStart = new Date(monday);
    weekStart.setDate(monday.getDate() - (7 - index) * 7);
    const key = localDayKey(weekStart);
    return { label: `${weekStart.getDate()}/${weekStart.getMonth() + 1}`, volume: byWeek.get(key) ?? 0, isCurrent: index === 7 };
  });
}
function formatSetResult(set, kind = "strength") {
  if (kind === "timed")
    return `${set.reps ?? 0} s`;
  if (kind === "distance")
    return `${set.reps ?? 0} m`;
  if (kind === "bodyweight" && !set.weight)
    return `${set.reps ?? 0} reps`;
  return `${set.weight ?? 0} kg \xD7 ${set.reps ?? 0}`;
}
function lastPerformance(sessions, exerciseId, kind = "strength") {
  const ordered = sessions.filter((session) => session.status === "completed").sort((a, b) => sessionTimestamp(b).localeCompare(sessionTimestamp(a)));
  for (const session of ordered) {
    const sets = session.exercises.filter((exercise) => exercise.exerciseId === exerciseId).flatMap((exercise) => exercise.sets).filter((set) => set.completed && (set.weight !== null || set.reps !== null));
    if (sets.length)
      return sets.map((set) => formatSetResult(set, kind)).join(" \xB7 ");
  }
  return null;
}

export {
  SET_FIELDS,
  routineExercises,
  plannedSets,
  sessionTimestamp,
  localDayKey,
  startOfWeek,
  sessionsSince,
  sessionVolume,
  completedSetCount,
  estimatedOneRepMax,
  nextRoutineDay,
  weekActivity,
  muscleDistribution,
  monthCalendar,
  lastWeeksVolume,
  formatSetResult,
  lastPerformance
};
//# sourceMappingURL=chunk-WJTWJKEM.js.map
