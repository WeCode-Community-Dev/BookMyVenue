import express from "express";
import cors from "cors";
import cookieStore from "cookie-parser";
import connection from "./config/db.js";
import dotenv from "dotenv";
import authRouter from "./routes/authRoutes.js";
import venueRouter from "./routes/venueRoutes.js";
import cookieParser from "cookie-parser";
import venueAvailabilityRoutes from './routes/venueAvailabilityRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'


dotenv.config();
const app = express();

//middleware
app.use(express.json());
app.use(cors());
app.use(cookieStore());
app.use(cookieParser());

//db
connection();

app.use("/api/auth", authRouter);
app.use("/api/venues", venueRouter);
app.use('/api/availability',venueAvailabilityRoutes);
app.use("/api/bookings",bookingRoutes);
app.use("/api/payments",paymentRoutes);



const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});