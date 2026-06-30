import { Controller ,Get ,Req,UseGuards ,Patch , Body } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UpdateProfileDto } from './dto/profile.dto';


@ApiTags('profile') // Groups the endpoints under "Profile" in Swagger
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
@Get('me')
@ApiBearerAuth()
@ApiOperation({ summary: 'Get current authenticated user profile' })
@ApiResponse({ status: 200, description: 'Authenticated user profile returned successfully.' })
@ApiResponse({ status: 401, description: 'Unauthorized.' })
@UseGuards(JwtAuthGuard)
getMe(@Req() req) {
  return this.profileService.getProfile(
    req.user.userId,
  );
}

@Patch()
@ApiBearerAuth()
@ApiOperation({ summary: 'Update current authenticated user profile' })
@ApiResponse({ status: 200, description: 'User profile updated successfully.' })
@ApiResponse({ status: 401, description: 'Unauthorized.' })
@UseGuards(JwtAuthGuard)
updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
  return this.profileService.updateProfile(
    req.user.userId,
    updateProfileDto
  );
}
}