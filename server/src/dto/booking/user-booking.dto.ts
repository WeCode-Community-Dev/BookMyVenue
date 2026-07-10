import { IBooking } from '@/types/booking.types';
import { BookingStatus, BookingScenario, PaymentStatus } from '@/constants/booking';

export interface UserBookingDTO {
  id: string;
  bookingStatus: string;
  paymentStatus: string;
  bookingScenario: string;
  startDateTime: string;
  endDateTime: string;
  guests: number;
  paymentMethod: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  totalAmount: number;
  amountPaid: number;
  remainingPaymentDueDate: string | null;
  autoCancellationDate: string | null;
  isImmediatePaymentRequired: boolean;
  cancellationReason: string;
  createdAt: string;
  venue: {
    id: string;
    name: string;
    imageUrl: string | null;
    location: string;
  };
  isCancellable: boolean;
}

// /**
//  * Maps a raw Booking Mongoose document + computed isCancellable flag
//  * into a lean DTO that only exposes the fields the user-facing UI needs.
//  *
//  * Sensitive / internal fields excluded:
//  *   user, reservationDeposit, remainingBalance, cancelledAt, updatedAt
//  */
// export const toUserBookingDTO = (
//   doc: Record<string, any>,
//   isCancellable: boolean
// ): UserBookingDTO => {
//   const venue = doc.venue ?? {};
//   const venueImages: string[] = venue.images ?? [];

//   // Normalise statuses to lowercase strings the frontend uses
//   const rawPaymentStatus: string = doc.paymentStatus ?? '';
//   const paymentStatus =
//     rawPaymentStatus.toUpperCase() === PaymentStatus.DEPOSIT_PAID
//       ? 'partial'
//       : rawPaymentStatus.toLowerCase();

//   const bookingStatus = (doc.bookingStatus ?? '').toLowerCase();

//   return {
//     id: String(doc._id ?? doc.id),
//     bookingStatus,
//     paymentStatus,
//     bookingScenario: doc.bookingScenario ?? '',
//     startDateTime: doc.startDateTime ? new Date(doc.startDateTime).toISOString() : '',
//     endDateTime: doc.endDateTime ? new Date(doc.endDateTime).toISOString() : '',
//     guests: doc.guests ?? 0,
//     paymentMethod: doc.paymentMethod ?? '',
//     contactName: doc.contactName ?? '',
//     contactEmail: doc.contactEmail ?? '',
//     contactPhone: doc.contactPhone ?? '',
//     totalAmount: doc.totalAmount ?? 0,
//     amountPaid: doc.amountPaid ?? 0,
//     remainingPaymentDueDate: doc.remainingPaymentDueDate
//       ? new Date(doc.remainingPaymentDueDate).toISOString()
//       : null,
//     autoCancellationDate: doc.autoCancellationDate
//       ? new Date(doc.autoCancellationDate).toISOString()
//       : null,
//     isImmediatePaymentRequired: !!doc.isImmediatePaymentRequired,
//     cancellationReason: doc.cancellationReason ?? '',
//     createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : '',
//     venue: {
//       id: String(venue._id ?? venue.id ?? ''),
//       name: venue.name ?? '',
//       imageUrl: venueImages[0] ?? null,
//       location: venue.address
//         ? [venue.address.city, venue.address.state].filter(Boolean).join(', ')
//         : '',
//     },
//     isCancellable,
//   };
// };
