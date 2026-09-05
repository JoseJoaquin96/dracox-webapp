import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { getSupabase } from './supabase.client';

async function hasAuthenticatedUser(): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  const { data } = await client.auth.getUser();
  return data.user !== null;
}

export const authGuard: CanActivateFn = async (_route, state) => {
  const router = inject(Router);
  return await hasAuthenticatedUser()
    ? true
    : router.createUrlTree(['/login'], { queryParams: { redirect: state.url } });
};

export const guestGuard: CanActivateFn = async () => {
  const router = inject(Router);
  return await hasAuthenticatedUser() ? router.createUrlTree(['/']) : true;
};
