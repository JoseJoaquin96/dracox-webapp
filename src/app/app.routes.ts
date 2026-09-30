import { Routes } from '@angular/router';
import { adminGuard, authGuard, guestGuard } from './core/auth/auth.guards';
import { ShellComponent } from './layout/shell.component';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent) },
      { path: 'routines', loadComponent: () => import('./features/routines/routines.component').then((m) => m.RoutinesComponent) },
      { path: 'workout/:routineId/:routineDayId', loadComponent: () => import('./features/workout/workout.component').then((m) => m.WorkoutComponent) },
      { path: 'workout/:routineId', loadComponent: () => import('./features/workout/workout.component').then((m) => m.WorkoutComponent) },
      { path: 'progress', loadComponent: () => import('./features/progress/progress.component').then((m) => m.ProgressComponent) },
      { path: 'exercises', loadComponent: () => import('./features/exercises/exercises.component').then((m) => m.ExercisesComponent) },
      {
        path: 'admin/errors',
        canActivate: [adminGuard],
        loadComponent: () => import('./features/admin-errors/admin-errors.component').then((m) => m.AdminErrorsComponent)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
