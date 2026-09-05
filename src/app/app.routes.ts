import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login.component').then((module) => module.LoginComponent)
  },
  {
    canActivate: [authGuard],
    path: '',
    loadComponent: () => import('./pages/dashboard.component').then((module) => module.DashboardComponent)
  },
  {
    canActivate: [authGuard],
    path: 'routines',
    loadComponent: () => import('./pages/routines.component').then((module) => module.RoutinesComponent)
  },
  {
    canActivate: [authGuard],
    path: 'workout/:routineId',
    loadComponent: () => import('./pages/workout.component').then((module) => module.WorkoutComponent)
  },
  {
    canActivate: [authGuard],
    path: 'progress',
    loadComponent: () => import('./pages/progress.component').then((module) => module.ProgressComponent)
  },
  {
    canActivate: [authGuard],
    path: 'exercises',
    loadComponent: () => import('./pages/exercises.component').then((module) => module.ExercisesComponent)
  },
  { path: '**', redirectTo: '' }
];
