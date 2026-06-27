import { z } from "zod";
import { isValidObjectId } from "mongoose";

export const createOrderSchema = z.object({
  reservationId: z.string().refine((value) => isValidObjectId(value), {
    message: "Invalid reservation id",
  }),
});

export const verifyPaymentSchema = z.object({
  orderId: z.string().trim().min(1, "orderId is required"),
  // dummy gateway: the client tells us whether the (fake) payment succeeded
  success: z.boolean({ message: "success must be a boolean" }),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
