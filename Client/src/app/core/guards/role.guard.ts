import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // During SSR, allow navigation to prevent page flash on refresh
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const expectedRoles: UserRole[] = route.data['roles'] || [];

  if (authService.hasRole(expectedRoles)) {
    return true;
  }

  // User doesn't have the required role
  return router.createUrlTree(['/unauthorized']);
};
