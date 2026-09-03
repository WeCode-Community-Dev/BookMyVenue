import { MongoMemoryReplSet } from 'mongodb-memory-server';

let replSet: MongoMemoryReplSet;

export async function setup() {
  process.env.NODE_ENV = 'test';
  process.env.JWT_ACCESS_SECRET = 'test_jwt_access_secret_key_1234567890';
  process.env.JWT_REFRESH_SECRET = 'test_jwt_refresh_secret_key_1234567890';
  process.env.ACCESS_TOKEN_EXPIRY = '30m';
  process.env.REFRESH_TOKEN_EXPIRY = '7d';
  process.env.RAZORPAY_WEBHOOK_SECRET = 'test_webhook_secret_1234567890';

  replSet = await MongoMemoryReplSet.create({
    replSet: {
      count: 1,
      dbName: 'test',
      storageEngine: 'wiredTiger',
    },
    binary: {
      version: '6.0.14',
    },
  });

  const uri = replSet.getUri();
  process.env.MONGODB_URI = uri;

  return async () => {
    if (replSet) {
      await replSet.stop();
    }
  };
}

export async function teardown() {
  if (replSet) {
    await replSet.stop();
  }
}
