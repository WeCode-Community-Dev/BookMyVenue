import { z } from 'zod';

export const MODERATION_ACTIONS = [
  'flag',
  'remove',
  'restore',
  'approve_hide',
  'reject_hide',
] as const;

export const moderateReviewSchema = z
  .object({
    action: z.enum(MODERATION_ACTIONS),
    reason: z
      .string()
      .trim()
      .min(10, 'Reason must be at least 10 characters')
      .max(500, 'Reason must be at most 500 characters')
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (
      (data.action === 'flag' ||
        data.action === 'remove' ||
        data.action === 'approve_hide' ||
        data.action === 'reject_hide') &&
      !data.reason
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['reason'],
        message: 'Reason is required for flag/remove/approve actions',
      });
    }
  });

export const moderateReviewParamsSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid review ID'),
});

export type ModerateReviewDTO = z.infer<typeof moderateReviewSchema>;
export type ModerateReviewParamsDTO = z.infer<typeof moderateReviewParamsSchema>;
