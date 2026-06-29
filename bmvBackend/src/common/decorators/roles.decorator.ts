import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enums/user-role.enum';

export const ROLES_KEY = 'roles';

/**
 * Attach allowed roles to a route handler.
 * Used together with RolesGuard.
 *
 * @example
 * @Roles(UserRole.VENUE_OWNER)
 * @Post('/venues')
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
