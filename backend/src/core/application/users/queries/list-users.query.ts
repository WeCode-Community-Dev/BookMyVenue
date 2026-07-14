import { Injectable, Inject } from '@nestjs/common';
import { type IUserRepository } from '../../../domain/users/repositories/user-repository.interface';
import { Pagination } from '../../_shared/dto/pagination';

export interface UserListDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string | null | undefined;
    phone: string | null | undefined;
    role: string;
    status: string;
    createdAt: Date;
}

@Injectable()
export class ListUsersQuery {
    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
    ) { }

    async execute(): Promise<Pagination<UserListDto>> {
        const data = await this.userRepository.findAll();

        const users = data.map(user => ({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            role: user.role,
            status: user.status,
            createdAt: user.createdAt,
        }))

        return new Pagination({
            data: users,
            total: data.length,
            offset: 0,
            limit: data.length
        });

    }
}
