function toNumber(value) {
  return value != null ? Number(value) : null;
}

export function toPublicBooking(booking) {
  return {
    id: booking.id,
    userId: booking.userId,
    venueId: booking.venueId,
    bookingFrom: booking.bookingFrom,
    bookingTo: booking.bookingTo,
    totalPrice: toNumber(booking.totalPrice),
    status: booking.status,
    createdAt: booking.createdAt,
    venue: booking.venue
      ? {
          id: booking.venue.id,
          name: booking.venue.name,
          city: booking.venue.city,
        }
      : undefined,
  };
}
