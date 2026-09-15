import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // During SSR, allow navigation to prevent login page flash on refresh
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  if (authService.isLoggedIn) {
    return true;
  }

  // Not logged in, redirect to login page with the return url
  return router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } });
};
