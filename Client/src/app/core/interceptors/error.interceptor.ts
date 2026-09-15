import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Only handle redirects in the browser to avoid SSR flashing
      if (isBrowser) {
        if (error.status === 401) {
          // Unauthorized - Clear session and redirect to login
          authService.logout();
          router.navigate(['/auth/login'], { queryParams: { returnUrl: router.url } });
        } else if (error.status === 403) {
          // Forbidden - User doesn't have permission
          router.navigate(['/unauthorized']);
        }
      }
      
      // Allow components to handle the error as well if needed
      return throwError(() => error);
    })
  );
};
