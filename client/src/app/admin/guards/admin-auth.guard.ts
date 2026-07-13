import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { UserRole } from '../../shared/enums/user-role.enum';

export const adminAuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isPortalAuthenticated(UserRole.Admin)) {
    return true;
  }
  router.navigate(['/admin/login']);
  return false;
};
