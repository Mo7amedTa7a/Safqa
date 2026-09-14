import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Unauthorized - Clear session and redirect to login
        authService.logout();
        router.navigate(['/auth/login'], { queryParams: { returnUrl: router.url } });
      } else if (error.status === 403) {
        // Forbidden - User doesn't have permission
        router.navigate(['/unauthorized']);
      }
      
      // Allow components to handle the error as well if needed
      return throwError(() => error);
    })
  );
};
