import mongoose from 'mongoose';
import { logInfo, logError } from '../utils/logger';

export let dbSupportsTransactions = false;

export const connectDatabase = async (): Promise<typeof mongoose> => {
  const mongodburi = process.env.MONGODB_URI;

  if (!mongodburi) {
    logError('MONGODB_URI environment variable is not set', {
      module: 'database.config.ts/connectDatabase',
    });
    process.exit(1);
  }

  try {
    const connection = await mongoose.connect(mongodburi, {
      autoIndex: process.env.NODE_ENV !== 'production',
    });
    logInfo('DB connected');

    const client = mongoose.connection.getClient();
    const topologyType = (client as unknown as { topology?: { description?: { type?: string } } })
      .topology?.description?.type;
    dbSupportsTransactions =
      typeof topologyType === 'string' &&
      (topologyType.includes('ReplicaSet') || topologyType.includes('Sharded'));

    logInfo('DB topology details', {
      topology: topologyType ?? 'unknown',
      txSupported: dbSupportsTransactions,
    });

    return connection;
  } catch (error) {
    logError('Failed to connect to MongoDB', {
      module: 'database.config.ts/connectDatabase',
      error: (error as Error).message,
    });
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logInfo('Disconnected from MongoDB');
  } catch (error) {
    logError('Failed to disconnect from MongoDB', {
      module: 'database.config.ts/disconnectDatabase',
      error: (error as Error).message,
    });
    process.exit(1);
  }
};
