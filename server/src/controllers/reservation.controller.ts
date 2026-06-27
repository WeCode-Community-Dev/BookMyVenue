import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTP_STATUS } from "../config/http.config";
import { UnauthorizedException } from "../utils/appError";
import { createReservationService } from "../services/reservation.service";
import { createReservationSchema } from "../validator/reservation.validator";

export const createReservationController = asyncHandler(async (req: Request, res: Response) => {
  const customer = req.user?.userId;
  if (!customer) {
    throw new UnauthorizedException("Unauthorized. Please log in");
  }

  const data = createReservationSchema.parse(req.body);

  const reservation = await createReservationService({ ...data, customer });

  return res.status(HTTP_STATUS.CREATED).json({
    message: "Reservation created. Please complete payment within 10 minutes.",
    reservation,
  });
});
