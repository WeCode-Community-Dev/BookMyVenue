import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { Booking } from '../../../shared/models/booking.model';
import { BookingStatus } from '../../../shared/enums/booking-status.enum';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [LoaderComponent, EmptyStateComponent, DateFormatPipe, CurrencyFormatPipe],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyBookingsComponent implements OnInit {
  private readonly bookingService = inject(BookingService);
  private readonly router = inject(Router);

  readonly bookings = this.bookingService.bookings;
  readonly loading = this.bookingService.loading;

  // Expose enum to the template so we can compare booking.status against it
  readonly BookingStatus = BookingStatus;

  ngOnInit(): void {
    this.bookingService.loadUserBookings();
  }

  onView(booking: Booking): void {
    this.router.navigate(['/user/my-bookings', booking.id]);
  }

  onCancel(booking: Booking): void {
    this.bookingService.cancelBooking(booking.id);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case BookingStatus.CONFIRMED: return 'bg-green-100 text-green-700';
      case BookingStatus.PENDING: return 'bg-yellow-100 text-yellow-700';
      case BookingStatus.CANCELLED: return 'bg-red-100 text-red-700';
      case BookingStatus.EXPIRED: return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }
}