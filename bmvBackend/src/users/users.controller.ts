import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { OnboardCustomerDto } from './dto/onboard-customer.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { CurrentUser, CurrentUserPayload } from '../common/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  /**
   * POST /users/register
   * Step 3: Register a new user after OTP verification.
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() dto: RegisterUserDto) {
    return this.usersService.register(dto);
  }

  /**
   * POST /users/customer/onboard
   * Onboard a registered customer with location details.
   */
  @Post('customer/onboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  @HttpCode(HttpStatus.OK)
  onboardCustomer(
    @Body() dto: OnboardCustomerDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.usersService.onboardCustomer(user.sub, dto);
  }

  /**
   * GET /users/customer/profile
   * Get customer profile and user account details.
   */
  @Get('customer/profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  @HttpCode(HttpStatus.OK)
  getCustomerProfile(@CurrentUser() user: CurrentUserPayload) {
    return this.usersService.getCustomerProfile(user.sub);
  }
}
