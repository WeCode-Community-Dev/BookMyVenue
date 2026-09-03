import { beforeAll, beforeEach, afterAll, afterEach } from 'vitest';
import mongoose from 'mongoose';
import { RoleModel } from '../src/models/role.model';

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'test_jwt_access_secret_key_1234567890';
  process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test_jwt_refresh_secret_key_1234567890';
  process.env.ACCESS_TOKEN_EXPIRY = '30m';
  process.env.REFRESH_TOKEN_EXPIRY = '7d';
  process.env.RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || 'test_webhook_secret_1234567890';

  const baseUri = process.env.MONGODB_URI;
  if (!baseUri) {
    throw new Error('MONGODB_URI environment variable is not defined by global setup');
  }

  const workerId = process.env.VITEST_POOL_ID || '1';
  const url = new URL(baseUri);
  url.pathname = `/test_db_${workerId}`;
  url.searchParams.set('retryWrites', 'false');
  const uri = url.toString();

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  await mongoose.connect(uri, { retryWrites: false });
}, 60000);

beforeEach(async () => {
  if (mongoose.connection.readyState !== 0) {
    await RoleModel.updateOne(
      { name: 'user' },
      {
        $setOnInsert: {
          name: 'user',
          displayName: 'User',
          description: 'Standard registered user',
          isSystem: true,
          priority: 100,
          active: true,
          deleted: false,
        },
      },
      { upsert: true }
    );
  }
});

afterEach(async () => {
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}, 60000);

