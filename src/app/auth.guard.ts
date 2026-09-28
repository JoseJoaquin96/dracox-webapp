import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { getSupabase } from './supabase.client';

async function hasAuthenticatedUser(): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  const { data: sessionData } = await client.auth.getSession();
  if (sessionData.session) return true;
  const { data } = await client.auth.getUser();
  return data.user !== null;
}

export const authGuard: CanActivateFn = async (_route, state) => {
  const router = inject(Router);
  return await hasAuthenticatedUser()
    ? true
    : router.createUrlTree(['/login'], { queryParams: { redirect: state.url } });
};

export const guestGuard: CanActivateFn = async (route) => {
  const router = inject(Router);
  if (route.queryParamMap.get('mode') === 'reset') return true;
  return await hasAuthenticatedUser() ? router.createUrlTree(['/']) : true;
};
