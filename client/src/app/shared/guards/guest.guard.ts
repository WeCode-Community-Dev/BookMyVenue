import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../enums/user-role.enum';

export const guestGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const url = route.pathFromRoot.map(r => r.url.map(s => s.path).join('/')).join('/');

  if (url.includes('admin')) {
    if (authService.isPortalAuthenticated(UserRole.Admin)) {
      router.navigate(['/admin/dashboard']);
      return false;
    }
  } else if (url.includes('vendor')) {
    if (authService.isPortalAuthenticated(UserRole.Vendor)) {
      router.navigate(['/vendor/dashboard']);
      return false;
    }
  } else {
    if (authService.isPortalAuthenticated(UserRole.Admin)) {
      router.navigate(['/admin/dashboard']);
      return false;
    }
    if (authService.isPortalAuthenticated(UserRole.Vendor)) {
      router.navigate(['/vendor/dashboard']);
      return false;
    }
    if (authService.isPortalAuthenticated(UserRole.User)) {
      router.navigate(['/user/venues']);
      return false;
    }
  }

  return true;
};
