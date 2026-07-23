import express from "express";
import cors from "cors";
import connection from "./config/db.js";
import { connectRedis } from "./config/redis.js";
import dotenv from "dotenv";
import authRouter from "./routes/authRoutes.js";
import venueRouter from "./routes/venueRoutes.js";
import cookieParser from "cookie-parser";
import venueAvailabilityRoutes from './routes/venueAvailabilityRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import adminRouter from "./routes/adminRoutes.js"
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";


dotenv.config();
const app = express();

//middleware
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

//db
connection();

//redis
connectRedis();

app.use("/api/auth", authRouter);
app.use("/api/venues", venueRouter);
app.use('/api/availability', venueAvailabilityRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRouter);

if (process.env.ENABLE_SWAGGER === "true") {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.status(200).json({
      success: true,
      message: "BookMyVenue API is running",
      environment: process.env.NODE_ENV
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});