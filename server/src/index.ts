import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { errorHandler } from "./middlewares/errorHandler.middleware";
import { Env } from "./config/env.config";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";
import { HTTP_STATUS } from "./config/http.config";
import connectDatabase from "./config/database";
import authRoute from "./routes/auth.routes";
import venueRoute from "./routes/venue.routes";
import reviewRoute from "./routes/review.route";
import reservationRoute from "./routes/reservation.route";

const app = express();

const BASE_PATH = Env.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: Env.FRONTEND_ORIGIN,
    credentials: true,
  }),
);

app.get(
  `/`,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.status(HTTP_STATUS.OK).json({
      message: "Hello",
    });
  }),
);

app.use(`${BASE_PATH}/auth`, authRoute);
app.use(`${BASE_PATH}/venue`, venueRoute);
app.use(`${BASE_PATH}/review`, reviewRoute);
app.use(`${BASE_PATH}/reservation`, reservationRoute);

app.use(errorHandler);

app.listen(Env.PORT, async () => {
  await connectDatabase();
  console.log(`Server is running on port ${Env.PORT} in ${Env.NODE_ENV} mode`);
});
