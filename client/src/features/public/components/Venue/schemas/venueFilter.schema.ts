import { z } from 'zod';

const positiveNumber = z
  .string()
  .refine(
    (value) =>
      value === '' ||
      (!isNaN(Number(value)) && Number(value) >= 0 && Number.isInteger(Number(value))),
    {
      message: 'Must be a positive integer',
    }
  );

export const venueFilterSchema = z
  .object({
    minPrice: positiveNumber,
    maxPrice: positiveNumber,
    minCapacity: positiveNumber,
    maxCapacity: positiveNumber,
  })
  .superRefine((data, ctx) => {
    const minPrice = Number(data.minPrice);
    const maxPrice = Number(data.maxPrice);

    const minCapacity = Number(data.minCapacity);
    const maxCapacity = Number(data.maxCapacity);

    if (data.minPrice && data.maxPrice && minPrice > maxPrice) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['maxPrice'],
        message: 'Max price must be greater than or equal to min price',
      });
    }

    if (data.minCapacity && data.maxCapacity && minCapacity > maxCapacity) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['maxCapacity'],
        message: 'Max capacity must be greater than or equal to min capacity',
      });
    }
  });
