import prisma from '../config/prisma.js';

const bookingInclude = {
  venue: {
    select: { id: true, name: true, city: true },
  },
};

export const bookingRepository = {
  findConflict(venueId, bookingFrom, bookingTo) {
    return prisma.booking.findFirst({
      where: {
        venueId,
        status: 'CONFIRMED',
        bookingFrom: { lt: bookingTo },
        bookingTo: { gt: bookingFrom },
      },
    });
  },

  findConfirmedInRange(venueId, from, to) {
    return prisma.booking.findMany({
      where: {
        venueId,
        status: 'CONFIRMED',
        bookingFrom: { lt: to },
        bookingTo: { gt: from },
      },
      orderBy: { bookingFrom: 'asc' },
    });
  },

  findByUserId(userId) {
    return prisma.booking.findMany({
      where: { userId },
      include: bookingInclude,
      orderBy: { bookingFrom: 'desc' },
    });
  },

  findById(id) {
    return prisma.booking.findUnique({
      where: { id },
      include: bookingInclude,
    });
  },

  createInTransaction(venueId, userId, bookingFrom, bookingTo, totalPrice) {
    return prisma.$transaction(async (tx) => {
      //making sure no overlapping bookings are allowed for the same venue.
      //suppose i book for 10:00 to 11:00, and another user already booked for 10:30 to 11:30, then i should not be allowed to book for that time slot.
      const conflict = await tx.booking.findFirst({
        where: {
          venueId,
          status: 'CONFIRMED',
          bookingFrom: { lt: bookingTo },
          bookingTo: { gt: bookingFrom },
        },
      });

      if (conflict) {
        return { conflict };
      }

      const booking = await tx.booking.create({
        data: {
          venueId,
          userId,
          bookingFrom,
          bookingTo,
          totalPrice,
          status: 'CONFIRMED',
        },
        include: bookingInclude,
      });

      return { booking };
    });
  },

  updateStatus(id, status) {
    return prisma.booking.update({
      where: { id },
      data: { status },
      include: bookingInclude,
    });
  },
};
