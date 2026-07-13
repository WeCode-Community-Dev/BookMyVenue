import { Injectable, inject, signal } from '@angular/core';
import { AdminBookingRepository } from '../repositories/booking.repository';
import { Booking } from '../../shared/models/booking.model';
import { NotificationService } from '../../shared/services/notification.service';

@Injectable({ providedIn: 'root' })
export class AdminBookingService {
  private readonly bookingRepository = inject(AdminBookingRepository);
  private readonly notification = inject(NotificationService);

  readonly bookings = signal<Booking[]>([]);
  readonly loading = signal(false);
  readonly totalPages = signal(1);

  loadBookings(page = 1): void {
    this.loading.set(true);
    this.bookingRepository.getBookings(page).subscribe({
      next: (r) => { this.bookings.set(r.data); this.totalPages.set(r.totalPages); this.loading.set(false); },
      error: () => { this.notification.error('Failed to load bookings'); this.loading.set(false); },
    });
  }
}
