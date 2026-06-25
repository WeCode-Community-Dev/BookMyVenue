import VenueModel from "../models/venue.model";
import { CreateVenueInput } from "../validator/venue.validator";

// Validated venue fields (from the zod schema) plus the owner, which is set
// from the authenticated user in the controller rather than the request body.
type CreateVenueParams = CreateVenueInput & {
  owner: string;
};

export const createVenueService = async (data: CreateVenueParams) => {
  const venue = await VenueModel.create(data);
  return venue;
};
