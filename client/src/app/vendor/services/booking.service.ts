import { Injectable, inject, signal } from '@angular/core';
import { VendorBookingRepository } from '../repositories/booking.repository';
import { Booking } from '../../shared/models/booking.model';
import { NotificationService } from '../../shared/services/notification.service';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly bookingRepository = inject(VendorBookingRepository);
  private readonly notification = inject(NotificationService);

  readonly bookings = signal<Booking[]>([]);
  readonly loading = signal(false);

  loadVendorBookings(): void {
    this.loading.set(true);
    this.bookingRepository.getVendorBookings().subscribe({
      next: (response) => { this.bookings.set(response.data); this.loading.set(false); },
      error: () => { this.notification.error('Failed to load bookings'); this.loading.set(false); },
    });
  }

  updateBookingStatus(id: number, status: string): void {
    this.bookingRepository.updateBookingStatus(String(id), status).subscribe({
      next: (response) => {
        this.bookings.update(list => list.map(b => b.id === id ? response.data : b));
        this.notification.success(`Booking ${status}`);
      },
      error: () => this.notification.error('Failed to update booking'),
    });
  }
}