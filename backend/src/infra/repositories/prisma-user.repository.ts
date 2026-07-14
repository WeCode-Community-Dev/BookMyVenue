import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { User, type UserRole, type UserStatus } from '../../core/domain/users/entities/user.entity';
import type { IUserRepository } from '../../core/domain/users/repositories/user-repository.interface';
import { role as PrismaRole, user_status as PrismaStatus } from '../database/prisma/generated/prisma/client';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) { }

  private mapToDomain(dbUser: any): User {
    return User.restore(dbUser.id, {
      email: dbUser.email,
      password: dbUser.password,
      firstName: dbUser.first_name,
      lastName: dbUser.last_name,
      phone: dbUser.phone,
      googleId: dbUser.google_id,
      role: dbUser.role as UserRole,
      status: dbUser.status as UserStatus,
      createdAt: dbUser.created_at,
      updatedAt: dbUser.updated_at,
    });
  }

  async findAll(query?: { search?: string, offset: number, limit: number }): Promise<User[]> {
    const dbUsers = await this.prisma.users.findMany({
      where: query?.search ? {
        OR: [
          { email: { contains: query.search, mode: 'insensitive' } },
          { first_name: { contains: query.search, mode: 'insensitive' } },
          { last_name: { contains: query.search, mode: 'insensitive' } },
          { phone: { contains: query.search, mode: 'insensitive' } },
        ],
      } : undefined,
      skip: query?.offset,
      take: query?.limit,
      orderBy: { created_at: 'desc' },
    });

    return dbUsers.map(this.mapToDomain);
  }

  async findById(id: string): Promise<User | null> {
    const dbUser = await this.prisma.users.findUnique({
      where: { id },
    });
    if (!dbUser) return null;
    return this.mapToDomain(dbUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    const dbUser = await this.prisma.users.findUnique({
      where: { email },
    });
    if (!dbUser) return null;
    return this.mapToDomain(dbUser);
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    const dbUser = await this.prisma.users.findUnique({
      where: { google_id: googleId },
    });
    if (!dbUser) return null;
    return this.mapToDomain(dbUser);
  }

  async save(user: User): Promise<void> {
    const data = {
      email: user.email,
      password: user.password,
      first_name: user.firstName,
      last_name: user.lastName,
      phone: user.phone,
      google_id: user.googleId,
      role: user.role as PrismaRole,
      status: user.status as PrismaStatus,
      updated_at: user.updatedAt,
    };

    await this.prisma.users.upsert({
      where: { id: user.id },
      update: data,
      create: {
        id: user.id,
        ...data,
        created_at: user.createdAt,
      },
    });
  }
}
