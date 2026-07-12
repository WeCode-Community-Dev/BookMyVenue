import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import venueRoutes from "./routes/venueRoutes.js"
import authRoutes from "./routes/authRoutes.js";
import bookingInquiryRoutes from "./routes/bookingInquiryRoutes.js"
import ownerVenueRoutes from "./routes/ownerVenueRoutes.js";
import adminVenueRoutes from "./routes/adminVenueRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("trust proxy", 1);

const allowedOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .map((origin) => origin.replace(/\/$/, ""))
  .filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
    optionsSuccessStatus: 204
}));

app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "BookMyVenue backend is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/booking-inquiries", bookingInquiryRoutes);
app.use("/api/owner/venues", ownerVenueRoutes);
app.use("/api/admin/venues", adminVenueRoutes);
app.use("/api/uploads", uploadRoutes);

if (process.env.NODE_ENV === "production") {
  const clientDistPath = path.resolve(__dirname, "../../client/dist");

  app.use(express.static(clientDistPath));

  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

export default app;
