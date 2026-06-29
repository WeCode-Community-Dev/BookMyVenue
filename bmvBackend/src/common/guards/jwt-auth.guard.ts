import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Validates the JWT Bearer token from the Authorization header.
 * On success, attaches { sub, role } to req.user.
 * On failure, throws 401 Unauthorized.
 *
 * Usage: @UseGuards(JwtAuthGuard)
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<T>(err: Error, user: T): T {
    if (err || !user) {
      throw new UnauthorizedException(
        'Access denied. Please log in to continue.',
      );
    }
    return user;
  }

  // Make context available for logging / testing
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
