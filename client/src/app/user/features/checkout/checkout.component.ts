import { Component, inject, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { VenueService } from '../../services/venue.service';
import { BookingService } from '../../services/booking.service';
import { PaymentRepository } from '../../repositories/payment.repository';
import { Venue } from '../../../shared/models/venue.model';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { AppValidators } from '../../../shared/utils/validators';
import { SlotService } from '../../services/slot.services';
import { TimeSlot } from '../../../shared/models/slot.model';
import { CreateBookingRequest, VerifyPaymentRequest } from '../../../shared/models/booking.model';
import { NotificationService } from '../../../shared/services/notification.service';
import { environment } from '../../../core/config/environment';

declare var Razorpay: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, InputComponent, CurrencyFormatPipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly venueService = inject(VenueService);
  private readonly bookingService = inject(BookingService);
  private readonly paymentRepository = inject(PaymentRepository);
  private readonly slotService = inject(SlotService);
  private readonly notification = inject(NotificationService);

  readonly venue = signal<Venue | null>(null);
  readonly loading = signal(true);
  readonly submitting = signal(false);
  readonly selectedSlotId = signal<number | null>(null);
  readonly slots = signal<TimeSlot[]>([]);

  readonly form = this.fb.nonNullable.group({
    eventDate:  ['', [Validators.required, AppValidators.futureDate]],
    guestCount: ['', [Validators.required, Validators.min(1)]],
    notes:      [''],
  });

  readonly selectedSlot = computed(() => this.slots().find(s => s.id === this.selectedSlotId()) ?? null);
  readonly slotTotal = computed(() => { const v = this.venue(); const slot = this.selectedSlot(); if (!v || !slot) return 0; return v.pricePerSlot + slot.surcharge; });
  readonly grandTotal = computed(() => this.slotTotal());

  ngOnInit(): void {
    const venueId = this.route.snapshot.paramMap.get('venueId') ?? '';

    this.form.controls.eventDate.valueChanges.subscribe(date => {
      this.selectedSlotId.set(null);
      if (!date || this.form.controls.eventDate.invalid) { this.slots.set([]); return; }
      this.slotService.loadSlotsForVenue(venueId, date).subscribe({
        next: (slots) => this.slots.set(slots),
        error: () => this.slots.set([]),
      });
    });

    if (venueId) {
      this.venueService.loadVenueById(venueId).subscribe({
        next: (venue) => { this.venue.set(venue); this.loading.set(false); },
        error: () => this.loading.set(false),
      });
    }
  }

  selectSlot(slot: TimeSlot): void { if (!slot.available) return; this.selectedSlotId.set(slot.id); }

  onSubmit(): void {
    const selectedSlot = this.selectedSlot();
    if (!this.form.valid || !this.venue() || !selectedSlot) return;

    this.submitting.set(true);

    const payload: CreateBookingRequest = {
      venueId: this.venue()!.id,
      slotTemplateId: selectedSlot.id,
      bookingDate: this.form.value.eventDate!,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      guestCount: Number(this.form.value.guestCount),
      notes: this.form.value.notes,
    };

    this.bookingService.createBooking(payload).subscribe({
      next: (booking) => this.initiatePayment(booking.id, booking.totalAmount),
      error: () => { this.notification.error('Failed to create booking'); this.submitting.set(false); },
    });
  }

  private initiatePayment(bookingId: number, amount: number): void {
    this.paymentRepository.createPaymentOrder(bookingId).subscribe({
      next: (order) => {
        const options = {
          key: environment.razorpayKeyId,
          amount: order.amount * 100,
          currency: 'INR',
          order_id: order.razorpayOrderId,
          name: 'BookMyVenue',
          description: 'Venue Booking Payment',
          handler: (response: any) => this.verifyPayment(response),
          modal: { ondismiss: () => this.submitting.set(false) },
        };
        const rzp = new Razorpay(options);
        rzp.open();
      },
      error: () => { this.notification.error('Failed to initiate payment'); this.submitting.set(false); },
    });
  }

  private verifyPayment(response: any): void {
    const request: VerifyPaymentRequest = {
      razorpayOrderId:   response.razorpay_order_id,
      razorpayPaymentId: response.razorpay_payment_id,
      razorpaySignature: response.razorpay_signature,
    };
    this.paymentRepository.verifyPayment(request).subscribe({
      next: () => { this.notification.success('Payment successful! Booking confirmed.'); this.router.navigate(['/user/my-bookings']); },
      error: () => { this.notification.error('Payment verification failed'); this.submitting.set(false); },
    });
  }
}
