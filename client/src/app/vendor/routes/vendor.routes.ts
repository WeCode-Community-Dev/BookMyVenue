import { Routes } from '@angular/router';
import { ROUTE_PATHS } from '../../shared/constants/route-paths.constant';
import { vendorAuthGuard } from '../guards/vendor-auth.guard';

export const VENDOR_ROUTES: Routes = [
  { path: ROUTE_PATHS.VENDOR.LOGIN, redirectTo: '/login', pathMatch: 'full' },
  { path: ROUTE_PATHS.VENDOR.SIGNUP, redirectTo: '/signup', pathMatch: 'full' },
  { path: ROUTE_PATHS.VENDOR.FORGOT_PASSWORD, redirectTo: '/forgot-password', pathMatch: 'full' },
  {
    path: '',
    loadComponent: () => import('../layouts/vendor-layout/vendor-layout.component').then(m => m.VendorLayoutComponent),
    canActivate: [vendorAuthGuard],
    children: [
      { path: ROUTE_PATHS.VENDOR.DASHBOARD, loadComponent: () => import('../features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: ROUTE_PATHS.VENDOR.VENUES, loadComponent: () => import('../features/venue-list/venue-list.component').then(m => m.VenueListComponent) },
      { path: ROUTE_PATHS.VENDOR.BOOKINGS, loadComponent: () => import('../features/bookings/bookings.component').then(m => m.BookingsComponent) },
      { path: ROUTE_PATHS.VENDOR.CREATE_VENUE, loadComponent: () => import('../features/create-venue/create-venue.component').then(m => m.CreateVenueComponent) },
      { path: ROUTE_PATHS.VENDOR.EDIT_VENUE, loadComponent: () => import('../features/edit-venue/edit-venue.component').then(m => m.EditVenueComponent) },
      { path: ROUTE_PATHS.VENDOR.SETTINGS, loadComponent: () => import('../features/settings/settings.component').then(m => m.SettingsComponent) },
      { path: ROUTE_PATHS.VENDOR.VENUE_SLOTS, loadComponent: () => import('../features/slot-management/slot-management.component').then(m => m.SlotManagementComponent) },
      { path: '', redirectTo: ROUTE_PATHS.VENDOR.DASHBOARD, pathMatch: 'full' },
    ],
  },
];
