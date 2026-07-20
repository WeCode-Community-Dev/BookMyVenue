import { Controller, Get, Param, Post, Body, Patch, NotFoundException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { GetUser } from './decorators/get-user.decorator';
import type { JWTUserInterface } from '../interface/jwt-user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    const user = await this.usersService.updateStatus(id, status);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Patch('profile')
  @UseGuards(AuthGuard)
  async updateProfile(
    @GetUser() user: JWTUserInterface,
    @Body() dto: UpdateProfileDto,
  ) {
    const updatedUser = await this.usersService.updateProfile(
      user.id.toString(),
      dto.name,
      dto.phoneNumber,
    );
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${user.id.toString()} not found`);
    }
    return updatedUser;
  }
}
