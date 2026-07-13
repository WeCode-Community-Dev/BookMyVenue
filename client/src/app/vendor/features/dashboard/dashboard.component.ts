import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { AuthService } from '../../../shared/services/auth.service';
import { VendorService } from '../../services/vendor.service';

@Component({
  selector: 'app-vendor-dashboard',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private readonly vendorService = inject(VendorService);
  readonly authService = inject(AuthService);

  readonly stats = signal({
    totalVenues: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
  });
  readonly loading = signal(true);

  readonly quickActions = [
    {
      label: 'Add New Venue',
      desc: 'List a new venue for bookings',
      path: '/vendor/venues/create',
      icon: 'M12 4v16m8-8H4',
      color: 'text-accent-600',
      bg: 'bg-amber-50',
      border: 'hover:border-accent-400',
    },
    {
      label: 'Manage Bookings',
      desc: 'View, confirm & cancel bookings',
      path: '/vendor/bookings',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'hover:border-emerald-300',
    },
    {
      label: 'My Venues',
      desc: 'Edit listings & manage details',
      path: '/vendor/venues',
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      color: 'text-brand-500',
      bg: 'bg-blue-50',
      border: 'hover:border-brand-400',
    },
  ];

  ngOnInit(): void {
    this.vendorService.loadDashboardStats().subscribe({
      next: (data) => { this.stats.set(data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
