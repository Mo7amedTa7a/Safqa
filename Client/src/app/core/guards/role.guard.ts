import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRoles: UserRole[] = route.data['roles'] || [];

  if (authService.hasRole(expectedRoles)) {
    return true;
  }

  // User doesn't have the required role
  return router.createUrlTree(['/unauthorized']);
};
