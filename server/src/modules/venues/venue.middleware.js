import { registerVenueService } from "./venues.service";

const ownerId = req.user.id;

const venue = await registerVenueService(
  req.body,
  ownerId
);