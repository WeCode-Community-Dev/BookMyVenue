import{ApiProperty} from '@nestjs/swagger';
import{IsString,IsNotEmpty,IsEmail,MinLength} from 'class-validator';   

export class LoginDto{
    @ApiProperty({example:'user1@example.com'})
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @ApiProperty({example:'password123'})
    @IsString()
    @IsNotEmpty()
    password!: string;
}