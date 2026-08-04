import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/dashboard.component').then((module) => module.DashboardComponent)
  },
  {
    path: 'routines',
    loadComponent: () => import('./pages/routines.component').then((module) => module.RoutinesComponent)
  },
  {
    path: 'workout/:routineId',
    loadComponent: () => import('./pages/workout.component').then((module) => module.WorkoutComponent)
  },
  {
    path: 'progress',
    loadComponent: () => import('./pages/progress.component').then((module) => module.ProgressComponent)
  },
  {
    path: 'exercises',
    loadComponent: () => import('./pages/exercises.component').then((module) => module.ExercisesComponent)
  },
  { path: '**', redirectTo: '' }
];
