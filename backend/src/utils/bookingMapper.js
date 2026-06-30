function toNumber(value) {
  return value != null ? Number(value) : null;
}

function toBookingVenue(venue) {
  return venue
    ? {
        id: venue.id,
        name: venue.name,
        city: venue.city,
      }
    : undefined;
}

function toBookingCustomer(user) {
  return user
    ? {
        id: user.id,
        username: user.username,
        email: user.email,
        mobileNumber: user.mobileNumber,
      }
    : undefined;
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
    venue: toBookingVenue(booking.venue),
  };
}

export function toPublicOwnerBooking(booking) {
  return {
    ...toPublicBooking(booking),
    customer: toBookingCustomer(booking.user),
  };
}
