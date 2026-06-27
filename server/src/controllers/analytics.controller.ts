import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTP_STATUS } from "../config/http.config";
import { getRevenueSummaryService } from "../services/analytics.service";

export const getRevenueSummaryController = asyncHandler(async (_req: Request, res: Response) => {
  const summary = await getRevenueSummaryService();

  return res.status(HTTP_STATUS.OK).json({
    message: "Revenue summary fetched successfully",
    summary,
  });
});
