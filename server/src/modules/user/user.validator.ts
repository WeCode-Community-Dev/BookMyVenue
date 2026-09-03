import { z } from 'zod';

export const updateProfileSchema = z
  .object({
    username: z.string().trim().min(3).max(30).optional(),
    profilePicturePublicId: z.string().trim().min(1).optional(),
  })
  .refine((data) => data.username ?? data.profilePicturePublicId, {
    message: 'Nothing to update',
  });
