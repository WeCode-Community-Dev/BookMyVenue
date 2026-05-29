import { Router } from "express";
import { z } from "zod";

import { CancelBooking } from "../../../application/use-cases/booking/CancelBooking.js";
import { CreateBooking } from "../../../application/use-cases/booking/CreateBooking.js";
import { GetUserBookings } from "../../../application/use-cases/booking/GetUserBookings.js";
import { createAuthMiddleware } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

import type { CacheService } from "../../../application/ports/CacheService.js";
import type { TokenService } from "../../../application/ports/TokenService.js";
import type { BookingRepository } from "../../../domain/repositories/BookingRepository.js";
import type { VenueRepository } from "../../../domain/repositories/VenueRepository.js";

const createBookingSchema = z.object({
  venueId: z.string().uuid("Invalid venue ID"),
  startTime: z.string().datetime("Invalid start time"),
  endTime: z.string().datetime("Invalid end time"),
  notes: z.string().optional(),
});

interface BookingRouterDependencies {
  bookingRepository: BookingRepository;
  venueRepository: VenueRepository;
  cacheService: CacheService;
  tokenService: TokenService;
}

export function createBookingRouter({
  bookingRepository,
  venueRepository,
  cacheService,
  tokenService,
}: BookingRouterDependencies): Router {
  const router = Router();
  const authMiddleware = createAuthMiddleware(tokenService);

  router.use(authMiddleware);

  router.get("/", async (req, res, next) => {
    try {
      const getUserBookings = new GetUserBookings(bookingRepository, cacheService);
      const bookings = await getUserBookings.execute(req.user!.userId);
      res.json({ success: true, data: bookings });
    } catch (error) {
      next(error);
    }
  });

  router.post("/", validateRequest(createBookingSchema), async (req, res, next) => {
    try {
      const createBooking = new CreateBooking(bookingRepository, venueRepository, cacheService);
      const booking = await createBooking.execute({
        venueId: req.body.venueId,
        userId: req.user!.userId,
        startTime: new Date(req.body.startTime),
        endTime: new Date(req.body.endTime),
        notes: req.body.notes,
      });
      res.status(201).json({ success: true, data: booking });
    } catch (error) {
      next(error);
    }
  });

  router.post("/:id/cancel", async (req, res, next) => {
    try {
      const cancelBooking = new CancelBooking(bookingRepository, cacheService);
      const booking = await cancelBooking.execute(req.params.id, req.user!.userId);
      res.json({ success: true, data: booking });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
