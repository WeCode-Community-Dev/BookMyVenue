import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { BookingService } from '../../../vendor/services/booking.service';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { Booking } from '../../../shared/models/booking.model';

@Component({
  selector: 'app-admin-bookings', standalone: true,
  imports: [LoaderComponent, EmptyStateComponent, DateFormatPipe, CurrencyFormatPipe],
  templateUrl: './bookings.component.html', styleUrl: './bookings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingsComponent implements OnInit {
  private readonly bookingService = inject(BookingService);

  readonly bookings = this.bookingService.bookings;
  readonly loading = this.bookingService.loading;
  readonly currentPage = signal(1);
  readonly totalPages = signal(1);

  ngOnInit(): void {
    this.bookingService.loadVendorBookings();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  onApprove(id: number): void {
    this.bookingService.updateBookingStatus(id, 'confirmed');
  }

  onReject(id: number): void {
    this.bookingService.updateBookingStatus(id, 'cancelled');
  }
}