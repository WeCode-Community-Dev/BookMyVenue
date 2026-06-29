import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRole } from '../enums/user-role.enum';

export interface CurrentUserPayload {
  sub: string;    // user UUID
  role: UserRole;
}

/**
 * Extracts the authenticated user payload from the JWT token.
 * Requires JwtAuthGuard to be applied first.
 *
 * @example
 * @Get('/me')
 * @UseGuards(JwtAuthGuard)
 * getProfile(@CurrentUser() user: CurrentUserPayload) {
 *   return user.sub;
 * }
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentUserPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as CurrentUserPayload;
  },
);
