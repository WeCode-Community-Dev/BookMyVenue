import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  // Injecting the ConfigService to access environment variables
  constructor(configService: ConfigService) {
    // Fetching the DATABASE_URL from environment variables or configuration
    const databaseUrl =
      configService?.get<string>('DATABASE_URL') || process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not configured.');
    }
    // Initialize the Prisma client with the PostgreSQL adapter
    super({
      adapter: new PrismaPg({ connectionString: databaseUrl }),
    });
  }
  // connects to the database when the module is initialized
  async onModuleInit() {
    await this.$connect();
  }
  // disconnects from the database when the module is destroyed
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
