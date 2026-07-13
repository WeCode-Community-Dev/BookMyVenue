import { Routes } from '@angular/router';
import { ROUTE_PATHS } from '../../shared/constants/route-paths.constant';
import { adminAuthGuard } from '../guards/admin-auth.guard';
import { guestGuard } from '../../shared/guards/guest.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: ROUTE_PATHS.ADMIN.LOGIN,
    canActivate: [guestGuard],
    loadComponent: () => import('../features/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: ROUTE_PATHS.ADMIN.FORGOT_PASSWORD,
    canActivate: [guestGuard],
    loadComponent: () => import('../features/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
  },
  {
    path: '',
    loadComponent: () => import('../layouts/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [adminAuthGuard],
    children: [
      { path: ROUTE_PATHS.ADMIN.DASHBOARD, loadComponent: () => import('../features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: ROUTE_PATHS.ADMIN.USERS, loadComponent: () => import('../features/users/users.component').then(m => m.UsersComponent) },
      { path: ROUTE_PATHS.ADMIN.VENDORS, loadComponent: () => import('../features/vendors/vendors.component').then(m => m.VendorsComponent) },
      { path: ROUTE_PATHS.ADMIN.VENUES, loadComponent: () => import('../features/venues/venues.component').then(m => m.VenuesComponent) },
      { path: ROUTE_PATHS.ADMIN.BOOKINGS, loadComponent: () => import('../features/bookings/bookings.component').then(m => m.BookingsComponent) },
      { path: ROUTE_PATHS.ADMIN.ANALYTICS, loadComponent: () => import('../features/analytics/analytics.component').then(m => m.AnalyticsComponent) },
      { path: ROUTE_PATHS.ADMIN.SETTINGS, loadComponent: () => import('../features/settings/settings.component').then(m => m.SettingsComponent) },
      { path: '', redirectTo: ROUTE_PATHS.ADMIN.DASHBOARD, pathMatch: 'full' },
    ],
  },
];
