import { z } from 'zod';

export const syncWishlistBodySchema = z.object({
  venueIds: z.array(z.string().trim().min(1)).max(200),
});
