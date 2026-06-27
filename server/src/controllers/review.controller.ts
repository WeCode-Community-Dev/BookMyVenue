import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTP_STATUS } from "../config/http.config";
import { UnauthorizedException } from "../utils/appError";
import { createReviewService } from "../services/review.service";
import { createReviewSchema } from "../validator/review.validator";

export const createReviewController = asyncHandler(async (req: Request, res: Response) => {

  const customer = req.user?.userId;
  if (!customer) {
    throw new UnauthorizedException("Unauthorized. Please log in");
  }

  const data = createReviewSchema.parse(req.body);

  const review = await createReviewService({ ...data, customer });

  return res.status(HTTP_STATUS.CREATED).json({
    message: "Review created successfully",
    review,
  });
});
