import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth.service';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  if (authService.isLoggedIn || !!authService.currentUserValue) {
    return router.createUrlTree(['/dashboard']);
  }

  return true;
};
