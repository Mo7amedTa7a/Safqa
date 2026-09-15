import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export const supplierGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // During SSR, allow navigation to prevent page flash on refresh
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const currentUser = authService.currentUserValue;

  if (!currentUser) {
    return router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } });
  }

  if (currentUser.role !== UserRole.SUPPLIER) {
    return router.createUrlTree(['/unauthorized']);
  }

  // Allow navigation for valid active supplier
  return true;
};
