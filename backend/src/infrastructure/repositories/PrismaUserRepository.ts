import type { User } from "../../domain/entities/User";
import type { UserRepository } from "../../domain/repositories/UserRepository";
import type { PrismaClient } from "@prisma/client";

export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async save(user: User): Promise<User> {
    return this.prisma.user.create({ data: user });
  }
}
