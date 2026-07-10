import mongoose from 'mongoose';
import logger from '@/libs/logger';
import env from './env.config';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(error, 'MongoDB connection failed');
    process.exit(1); // stop server if DB fails
  }
};
