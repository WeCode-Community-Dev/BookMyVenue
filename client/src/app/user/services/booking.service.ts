import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BookingRepository } from '../repositories/booking.repository';
import { Booking, CreateBookingRequest } from '../../shared/models/booking.model';
import { NotificationService } from '../../shared/services/notification.service';
import { Observable } from 'rxjs';
import { BookingStatus } from '../../shared/enums';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly bookingRepository = inject(BookingRepository);
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);

  readonly bookings = signal<Booking[]>([]);
  readonly loading = signal(false);

  loadUserBookings(): void {
    this.loading.set(true);
    this.bookingRepository.getUserBookings().subscribe({
      next: (response) => { this.bookings.set(response.data); this.loading.set(false); },
      error: () => { this.notification.error('Failed to load bookings'); this.loading.set(false); },
    });
  }

  createBooking(payload: CreateBookingRequest): Observable<Booking> {
    return this.bookingRepository.createBooking(payload);
  }

  cancelBooking(id: number): void {
    this.bookingRepository.cancelBooking(String(id)).subscribe({
      next: () => {
        this.bookings.update(list =>
          list.map(b => b.id === id ? { ...b, status: BookingStatus.CANCELLED } : b)
        );
        this.notification.success('Booking cancelled');
      },
      error: () => this.notification.error('Failed to cancel booking'),
    });
  }
}
