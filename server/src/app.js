import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './modules/auth/auth.routes.js';
import venueRoutes from './modules/venues/venues.routes.js';
import userRoutes from "./modules/users/users.routes.js";
import bookingRoutes from "./modules/bookings/bookings.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";

import { errorHandler } from './shared/middlewares/error.middleware.js';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);

export default app;