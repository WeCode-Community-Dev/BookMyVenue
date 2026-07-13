import { Component, inject, OnInit, ChangeDetectionStrategy, computed, signal } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { BookingStatus } from '../../../shared/enums/booking-status.enum';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';

type BookingTab = 'all' | BookingStatus.PENDING | BookingStatus.CONFIRMED | BookingStatus.CANCELLED | BookingStatus.EXPIRED;

interface BookingTabItem {
  key: BookingTab;
  label: string;
}

@Component({
  selector: 'app-vendor-bookings',
  standalone: true,
  imports: [LoaderComponent, EmptyStateComponent, DateFormatPipe, CurrencyFormatPipe],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingsComponent implements OnInit {
  private readonly bookingService = inject(BookingService);
  readonly bookings = this.bookingService.bookings;
  readonly loading = this.bookingService.loading;
  readonly BookingStatus = BookingStatus;
  readonly selectedTab = signal<BookingTab>('all');

  readonly tabs: BookingTabItem[] = [
    { key: 'all', label: 'All Bookings' },
    { key: BookingStatus.PENDING, label: 'Pending' },
    { key: BookingStatus.CONFIRMED, label: 'Confirmed' },
    { key: BookingStatus.CANCELLED, label: 'Cancelled' },
    { key: BookingStatus.EXPIRED, label: 'Expired' },
  ];

  readonly filteredBookings = computed(() => {
    const selectedTab = this.selectedTab();
    const bookings = this.bookings();

    return selectedTab === 'all' ? bookings : bookings.filter((booking) => booking.status === selectedTab);
  });

  readonly emptyStateTitle = computed(() => {
    const selectedTab = this.selectedTab();
    if (selectedTab === 'all') {
      return 'No bookings yet';
    }

    const label = this.tabs.find((tab) => tab.key === selectedTab)?.label ?? 'bookings';
    return `No ${label.toLowerCase()} bookings yet`;
  });

  readonly emptyStateMessage = computed(() =>
    this.selectedTab() === 'all'
      ? 'Bookings will appear here when customers book your venues.'
      : 'Try another tab or wait for new bookings to arrive.'
  );

  ngOnInit(): void { this.bookingService.loadVendorBookings(); }

  selectTab(tab: BookingTab): void {
    this.selectedTab.set(tab);
  }

  bookingCount(tab: BookingTab): number {
    if (tab === 'all') {
      return this.bookings().length;
    }

    return this.bookings().filter((booking) => booking.status === tab).length;
  }
}