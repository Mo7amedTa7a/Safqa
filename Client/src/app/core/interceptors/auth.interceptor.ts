import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { EMPTY } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);
  const token = authService.getToken();

  // If we are on the server (SSR) and this is an API call that likely requires auth
  // (excluding login/register), we intercept and return EMPTY.
  // This prevents the server from making a request without a token, getting a 401,
  // and rendering an error message (like "Authentication required") that flashes 
  // before the browser hydrates.
  if (!isBrowser && req.url.includes('/api/') && !req.url.includes('/auth/login') && !req.url.includes('/auth/register')) {
    return EMPTY;
  }

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  return next(req);
};
