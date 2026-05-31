import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './modules/auth/auth.routes.js';
import { errorHandler } from './shared/middlewares/error.middleware.js';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(errorHandler);
app.use('/api/auth', authRoutes);

export default app;