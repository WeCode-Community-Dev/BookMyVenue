import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { BookingStatus } from '../../../shared/enums/booking-status.enum';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-booking-detail',
  standalone: true,
  imports: [DateFormatPipe, CurrencyFormatPipe, ButtonComponent],
  templateUrl: './booking-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly bookingService = inject(BookingService);

  readonly BookingStatus = BookingStatus;

  readonly booking = computed(() => {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    return this.bookingService.bookings().find(b => b.id === id) ?? null;
  });

  getStatusClass(status: string): string {
    switch (status) {
      case BookingStatus.CONFIRMED: return 'bg-green-100 text-green-700';
      case BookingStatus.PENDING:   return 'bg-yellow-100 text-yellow-700';
      case BookingStatus.CANCELLED: return 'bg-red-100 text-red-700';
      case BookingStatus.EXPIRED:   return 'bg-red-100 text-red-700';
      default:                      return 'bg-gray-100 text-gray-700';
    }
  }

  goBack(): void {
    this.router.navigate(['/user/my-bookings']);
  }

  onCancel(): void {
    const booking = this.booking();
    if (booking) {
      this.bookingService.cancelBooking(booking.id);
      this.router.navigate(['/user/my-bookings']);
    }
  }
}
