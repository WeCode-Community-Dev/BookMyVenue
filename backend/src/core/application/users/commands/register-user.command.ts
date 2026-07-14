import { Injectable, Inject } from '@nestjs/common';
import { User } from '../../../domain/users/entities/user.entity';
import { type IUserRepository } from '../../../domain/users/repositories/user-repository.interface';
import { type IPasswordHasher } from '../services/password-hasher.interface';
import { BusinessRuleException } from '../../../domain/_shared/exception/business-rule.exception';
import * as crypto from 'crypto';
import type { UserRole } from 'src/core/domain/_shared/enum/UserRole';

export interface RegisterUserDto {
  email: string;
  password?: string;
  firstName: string;
  lastName?: string;
  phone?: string;
}

@Injectable()
export class RegisterUserCommand {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IPasswordHasher')
    private readonly passwordHasher: IPasswordHasher,
  ) { }

  async execute(dto: RegisterUserDto): Promise<{ userId: string }> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new BusinessRuleException('Email is already registered');
    }

    let hashedPassword: string | undefined = undefined;
    if (dto.password) {
      hashedPassword = await this.passwordHasher.hash(dto.password);
    }

    const userId = crypto.randomUUID();
    const user = User.create(userId, {
      email: dto.email,
      password: hashedPassword,
      firstName: dto.firstName,
      lastName: dto.lastName || null,
      phone: dto.phone || null,
      role: 'USER',
      status: 'ACTIVE',
    });

    await this.userRepository.save(user);

    return { userId };
  }
}
