import { Injectable, Inject } from '@nestjs/common';
import { type IUserRepository } from '../../../domain/users/repositories/user-repository.interface';
import { NotFoundException } from '../../../domain/_shared/exception/notfound.exception';

export interface UserProfileDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string | null;
  phone: string | null;
  role: string;
  status: string;
  createdAt: Date;
}

@Injectable()
export class GetUserProfileQuery {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) { }

  async execute(userId: string): Promise<UserProfileDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName || null,
      phone: user.phone || null,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
    };
  }
}
