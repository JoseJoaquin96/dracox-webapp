import { Routes } from '@angular/router';
import { adminGuard, authGuard, guestGuard } from './auth.guard';

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
    path: 'workout/:routineId/:routineDayId',
    loadComponent: () => import('./pages/workout.component').then((module) => module.WorkoutComponent)
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
  {
    canActivate: [authGuard, adminGuard],
    path: 'admin/errors',
    loadComponent: () => import('./pages/admin-errors.component').then((module) => module.AdminErrorsComponent)
  },
  { path: '**', redirectTo: '' }
];
