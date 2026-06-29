import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venue } from '../../venues/entities/venue.entity';
import { CurrentUserPayload } from '../decorators/current-user.decorator';
import { UserRole } from '../enums/user-role.enum';

/**
 * Verifies that the authenticated user owns the venue identified by :venueId
 * in the route params.
 *
 * Must be applied after JwtAuthGuard.
 * Attaches the loaded venue to req.venue for downstream use in the controller.
 */
@Injectable()
export class VenueOwnerGuard implements CanActivate {
  constructor(
    @InjectRepository(Venue)
    private readonly venueRepo: Repository<Venue>,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as CurrentUserPayload;
    console.log("venueOwner", user.sub);
    const venueId: string = request.params.venueId;

    if (!venueId) {
      throw new ForbiddenException('Venue ID is required.');
    }

    const venue = await this.venueRepo.findOne({ where: { id: venueId } });

    if (!venue) {
      throw new NotFoundException(`Venue with id ${venueId} not found.`);
    }
    // if (user.role === UserRole.ADMIN) {
    //   request.venue = venue;
    //   return true;
    // }
    if (venue.ownerId !== user.sub) {
      console.log(venue.ownerId);
      console.log(user.sub);


      throw new ForbiddenException(
        'You do not have permission to access this venue.',
      );
    }

    // Attach to request so controllers can access it without re-fetching
    request.venue = venue;

    return true;
  }
}
