import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from './auth.store';

export const authGuard: CanActivateFn = async (_route, state) => {
  const auth = inject(AuthStore);
  const router = inject(Router);
  await auth.ready;
  return auth.isAuthenticated() || router.createUrlTree(['/login'], { queryParams: { redirect: state.url } });
};

export const guestGuard: CanActivateFn = async (route) => {
  const auth = inject(AuthStore);
  const router = inject(Router);
  await auth.ready;
  // The password recovery link signs the user in, but they still need the login page.
  if (route.queryParamMap.get('mode') === 'reset') return true;
  return !auth.isAuthenticated() || router.createUrlTree(['/']);
};

// UX only: RLS is what actually protects the admin data.
export const adminGuard: CanActivateFn = async () => {
  const auth = inject(AuthStore);
  const router = inject(Router);
  await auth.ready;
  return auth.isAdmin() || router.createUrlTree(['/']);
};
