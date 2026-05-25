import { Router } from "express";
import { z } from "zod";
import { VenueRepository } from "../../../domain/repositories/VenueRepository.js";
import { CacheService } from "../../../application/ports/CacheService.js";
import { TokenService } from "../../../application/ports/TokenService.js";
import { CreateVenue } from "../../../application/use-cases/venue/CreateVenue.js";
import { GetVenues } from "../../../application/use-cases/venue/GetVenues.js";
import { GetVenueById } from "../../../application/use-cases/venue/GetVenueById.js";
import { createAuthMiddleware } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const createVenueSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  pricePerHour: z.number().min(0, "Price must be non-negative"),
  amenities: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
});

interface VenueRouterDependencies {
  venueRepository: VenueRepository;
  cacheService: CacheService;
  tokenService: TokenService;
}

export function createVenueRouter({
  venueRepository,
  cacheService,
  tokenService,
}: VenueRouterDependencies): Router {
  const router = Router();
  const authMiddleware = createAuthMiddleware(tokenService);

  router.get("/", async (req, res, next) => {
    try {
      const filters = {
        city: req.query.city as string | undefined,
        minCapacity: req.query.minCapacity ? Number(req.query.minCapacity) : undefined,
        maxCapacity: req.query.maxCapacity ? Number(req.query.maxCapacity) : undefined,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        isActive: true,
      };

      const getVenues = new GetVenues(venueRepository, cacheService);
      const venues = await getVenues.execute(filters);
      res.json({ success: true, data: venues });
    } catch (error) {
      next(error);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      const getVenueById = new GetVenueById(venueRepository, cacheService);
      const venue = await getVenueById.execute(req.params.id);

      if (!venue) {
        res.status(404).json({ success: false, error: "Venue not found" });
        return;
      }

      res.json({ success: true, data: venue });
    } catch (error) {
      next(error);
    }
  });

  router.post("/", authMiddleware, validateRequest(createVenueSchema), async (req, res, next) => {
    try {
      const createVenue = new CreateVenue(venueRepository, cacheService);
      const venue = await createVenue.execute({
        ...req.body,
        ownerId: req.user!.userId,
      });
      res.status(201).json({ success: true, data: venue });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
