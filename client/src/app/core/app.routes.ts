import { Routes } from '@angular/router';
import { ROUTE_PATHS } from '../shared/constants/route-paths.constant';
import { guestGuard } from '../shared/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../landing/landing.component').then(m => m.LandingComponent),
    pathMatch: 'full',
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('../user/features/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'signup',
    canActivate: [guestGuard],
    loadComponent: () => import('../user/features/signup/signup.component').then(m => m.SignupComponent),
  },
  {
    path: 'forgot-password',
    canActivate: [guestGuard],
    loadComponent: () => import('../user/features/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
  },
  {
    path: 'reset-password',
    canActivate: [guestGuard],
    loadComponent: () => import('../user/features/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
  },
  {
    path: 'verify-email',
    canActivate: [guestGuard],
    loadComponent: () => import('../shared/features/verify-email/verify-email.component').then(m => m.VerifyEmailComponent),
  },
  {
    path: ROUTE_PATHS.USER.BASE,
    loadChildren: () => import('../user/routes/user.routes').then(m => m.USER_ROUTES),
  },
  {
    path: ROUTE_PATHS.VENDOR.BASE,
    loadChildren: () => import('../vendor/routes/vendor.routes').then(m => m.VENDOR_ROUTES),
  },
  {
    path: ROUTE_PATHS.ADMIN.BASE,
    loadChildren: () => import('../admin/routes/admin.routes').then(m => m.ADMIN_ROUTES),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
