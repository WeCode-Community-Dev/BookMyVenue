import { Injectable, Inject } from '@nestjs/common';
import { User, } from '../../../domain/users/entities/user.entity';
import { type IUserRepository } from '../../../domain/users/repositories/user-repository.interface';
import { type IPasswordHasher } from '../../users/services/password-hasher.interface';
import { BusinessRuleException } from '../../../domain/_shared/exception/business-rule.exception';
import * as crypto from 'crypto';
import type { UserRole } from 'src/core/domain/_shared/enum/UserRole';
import type { INotificationService } from 'src/core/domain/notification/notification.service.interface';

export interface CreateUserDto {
  email: string;
  password?: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  role: UserRole.USER | UserRole.VENUE_OWNER;
}

@Injectable()
export class CreateUserCommand {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IPasswordHasher')
    private readonly passwordHasher: IPasswordHasher,
    @Inject('INotificationService')
    private readonly notificationService: INotificationService
  ) { }

  async execute(dto: CreateUserDto): Promise<{ userId: string }> {
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
      role: dto.role,
      status: 'ACTIVE',
    });

    await this.userRepository.save(user);

    await this.notificationService.createSubscriber({
      email: user.email,
      subscriberId: user.id,
      firstName: user.firstName,
      lastName: user.lastName || '',
      phone: user.phone || ''
    })

    await this.notificationService.trigger({
      subscriberId: user.id,
      payload: {
        title: 'Welcome to bmv',
        message: `Hi ${user.firstName}, welcome to BMV. we are happy to see here`
      }
    })

    return { userId };
  }
}
