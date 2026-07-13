import { Injectable, inject, signal } from '@angular/core';
import { AdminVenueRepository, AdminVenue, DashboardStats } from '../repositories/venue.repository';
import { NotificationService } from '../../shared/services/notification.service';

@Injectable({ providedIn: 'root' })
export class AdminVenueService {
  private readonly venueRepository = inject(AdminVenueRepository);
  private readonly notification = inject(NotificationService);

  readonly dashboard = signal<DashboardStats | null>(null);
  readonly venues = signal<AdminVenue[]>([]);
  readonly pendingVenues = signal<AdminVenue[]>([]);
  readonly loading = signal(false);
  readonly totalPages = signal(1);

  loadDashboard(): void {
    this.venueRepository.getDashboard().subscribe({
      next: (stats) => this.dashboard.set(stats),
      error: () => this.notification.error('Failed to load dashboard'),
    });
  }

  loadAllVenues(page = 0): void {
    this.loading.set(true);
    this.venueRepository.getAllVenues(page).subscribe({
      next: (r) => { this.venues.set(r.content); this.totalPages.set(r.totalPages); this.loading.set(false); },
      error: () => { this.notification.error('Failed to load venues'); this.loading.set(false); },
    });
  }

  loadPendingVenues(page = 0): void {
    this.loading.set(true);
    this.venueRepository.getPendingVenues(page).subscribe({
      next: (r) => { this.pendingVenues.set(r.content); this.totalPages.set(r.totalPages); this.loading.set(false); },
      error: () => { this.notification.error('Failed to load pending venues'); this.loading.set(false); },
    });
  }

  approveVenue(id: number, onDone?: () => void): void {
    this.venueRepository.approveVenue(id).subscribe({
      next: () => { this.notification.success('Venue approved'); this.loadAllVenues(); onDone?.(); },
      error: () => { this.notification.error('Failed to approve venue'); onDone?.(); },
    });
  }

  rejectVenue(id: number, onDone?: () => void): void {
    this.venueRepository.rejectVenue(id).subscribe({
      next: () => { this.notification.success('Venue rejected'); this.loadAllVenues(); onDone?.(); },
      error: () => { this.notification.error('Failed to reject venue'); onDone?.(); },
    });
  }
}
