import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    const sanitizedEmail = email.toLowerCase().trim();
    return this.prisma.user.findUnique({
      where: { email: sanitizedEmail },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async createUser(
    email: string,
    passwordHash: string,
    fullName: string,
    roles?: string[],
  ) {
    const sanitizedEmail = email.toLowerCase().trim();
    const sanitizedRoles = roles && roles.length > 0 ? roles : ['USER'];

    // Check if user already exists
    const existingUser = await this.findByEmail(sanitizedEmail);
    if (existingUser) {
      throw new ConflictException('User with this email already exists.');
    }

    return this.prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email: sanitizedEmail,
          passwordHash,
          fullName,
        },
      });

      // Ensure roles exist and assign them to the user
      for (const roleName of sanitizedRoles) {
        const upperRoleName = roleName.toUpperCase().trim();

        // Upsert the role to ensure it exists in the database
        const role = await tx.role.upsert({
          where: { name: upperRoleName },
          update: {},
          create: {
            name: upperRoleName,
            description: `${upperRoleName} role`,
          },
        });

        // Link user to role
        await tx.userRole.create({
          data: {
            userId: user.id,
            roleId: role.id,
          },
        });
      }

      return {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        roles: sanitizedRoles.map((r) => r.toUpperCase().trim()),
      };
    });
  }
}
