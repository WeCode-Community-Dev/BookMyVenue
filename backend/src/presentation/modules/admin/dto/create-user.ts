import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/core/domain/_shared/enum/UserRole';

export class CreateUserDTO {
    @ApiProperty({ example: 'user@bmv.com' })
    email!: string;

    @ApiProperty({ example: 'password123' })
    password!: string;

    @ApiProperty({ example: 'John' })
    firstName!: string;

    @ApiProperty({ example: 'Doe', required: false })
    lastName?: string;

    @ApiProperty({ example: '+919876543210', required: false })
    phone?: string;

    @ApiProperty({ enum: [UserRole.USER, UserRole.VENUE_OWNER] })
    role!: UserRole.USER | UserRole.VENUE_OWNER
}
