import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import venueRoutes from "./routes/venueRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import path from "path";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req, res) => {
  res.send("BookMyVenue API is running");
});

app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "Database connected successfully",
      time: result.rows[0],
    });
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

app.use("/auth", authRoutes);
app.use("/venues", venueRoutes);
app.use("/bookings", bookingRoutes);
app.use("/payments", paymentRoutes);
app.use("/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 5000;

console.log("Starting server...");

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});