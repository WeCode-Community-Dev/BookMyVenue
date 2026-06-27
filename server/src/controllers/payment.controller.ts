import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTP_STATUS } from "../config/http.config";
import { UnauthorizedException } from "../utils/appError";
import { createOrderService, verifyPaymentService } from "../services/payment.service";
import { createOrderSchema, verifyPaymentSchema } from "../validator/payment.validator";

export const createOrderController = asyncHandler(async (req: Request, res: Response) => {
  const customer = req.user?.userId;
  if (!customer) {
    throw new UnauthorizedException("Unauthorized. Please log in");
  }

  const { reservationId } = createOrderSchema.parse(req.body);

  const order = await createOrderService({ reservationId, customer });

  return res.status(HTTP_STATUS.CREATED).json({
    message: "Payment order created",
    order,
  });
});

export const verifyPaymentController = asyncHandler(async (req: Request, res: Response) => {
  const customer = req.user?.userId;
  if (!customer) {
    throw new UnauthorizedException("Unauthorized. Please log in");
  }

  const { orderId, success } = verifyPaymentSchema.parse(req.body);

  const result = await verifyPaymentService({ orderId, success, customer });

  return res.status(HTTP_STATUS.CREATED).json({
    message: "Payment successful. Booking confirmed.",
    ...result,
  });
});
