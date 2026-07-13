import { Routes } from '@angular/router';
import { ROUTE_PATHS } from '../../shared/constants/route-paths.constant';
import { userAuthGuard } from '../guards/user-auth.guard';

export const USER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../layouts/user-layout/user-layout.component').then(m => m.UserLayoutComponent),
    children: [
      {
        path: ROUTE_PATHS.USER.VENUES,
        loadComponent: () =>
          import('../features/venue-list/venue-list.component').then(m => m.VenueListComponent),
      },
      {
        path: ROUTE_PATHS.USER.VENUE_DETAILS,
        loadComponent: () =>
          import('../features/venue-details/venue-details.component').then(m => m.VenueDetailsComponent),
      },
      {
        path: ROUTE_PATHS.USER.CHECKOUT,
        canActivate: [userAuthGuard],
        loadComponent: () =>
          import('../features/checkout/checkout.component').then(m => m.CheckoutComponent),
      },
      {
        path: ROUTE_PATHS.USER.MY_BOOKINGS,
        canActivate: [userAuthGuard],
        loadComponent: () =>
          import('../features/my-bookings/my-bookings.component').then(m => m.MyBookingsComponent),
      },
      {
        path: ROUTE_PATHS.USER.MY_BOOKING_DETAIL,
        canActivate: [userAuthGuard],
        loadComponent: () =>
          import('../features/booking-detail/booking-detail.component').then(m => m.BookingDetailComponent),
      },
      {
        path: ROUTE_PATHS.USER.PROFILE,
        canActivate: [userAuthGuard],
        loadComponent: () =>
          import('../features/profile/profile.component').then(m => m.ProfileComponent),
      },
      {
        path: '',
        redirectTo: ROUTE_PATHS.USER.VENUES,
        pathMatch: 'full',
      },
    ],
  },
];
