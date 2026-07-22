import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Role, VenueStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';
import { RejectVenueDto } from './dto/reject-venue.dto';

const adminVenueInclude = {
  images: true,
  documents: true,
  owner: {
    include: {
      profile: true,
    },
  },
} satisfies Prisma.VenueInclude;

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async getPendingVenues() {
    return this.prisma.venue.findMany({
      where: {
        status: {
          in: [VenueStatus.PENDING, VenueStatus.PENDING_DOCUMENTS],
        },
      },
      include: adminVenueInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async approveVenue(venueId: string) {
    const venue = await this.prisma.venue.findUnique({
      where: {
        id: venueId,
      },
      include: adminVenueInclude,
    });

    if (!venue) {
      throw new NotFoundException('Venue not found.');
    }

    if (venue.status === VenueStatus.APPROVED) {
      throw new BadRequestException('Venue is already approved.');
    }

    if (venue.status === VenueStatus.PENDING_DOCUMENTS) {
      throw new BadRequestException(
        'Venue documents are incomplete. Upload the required documents before approval.',
      );
    }

    if (venue.owner.role === Role.USER) {
      await this.prisma.user.update({
        where: { id: venue.ownerId },
        data: { role: Role.VENUE_OWNER },
      });
    }

    const approvedVenue = await this.prisma.venue.update({
      where: {
        id: venueId,
      },
      data: {
        status: VenueStatus.APPROVED,
        rejectionReason: null,
      },
      include: adminVenueInclude,
    });

    await this.mailService.sendVenueApprovedEmail(
      venue.owner.email,
      venue.name,
    );

    return {
      message: 'Venue approved successfully.',
      venue: approvedVenue,
    };
  }

  async rejectVenue(venueId: string, rejectVenueDto: RejectVenueDto) {
    const venue = await this.prisma.venue.findUnique({
      where: {
        id: venueId,
      },
      include: adminVenueInclude,
    });

    if (!venue) {
      throw new NotFoundException('Venue not found.');
    }

    if (venue.status === VenueStatus.REJECTED) {
      throw new BadRequestException('Venue is already rejected.');
    }

    const rejectedVenue = await this.prisma.venue.update({
      where: {
        id: venueId,
      },
      data: {
        status: VenueStatus.REJECTED,
        rejectionReason: rejectVenueDto.reason,
      },
      include: adminVenueInclude,
    });

    await this.mailService.sendVenueRejectedEmail(
      venue.owner.email,
      venue.name,
      rejectVenueDto.reason,
    );

    return {
      message: 'Venue rejected successfully.',
      venue: rejectedVenue,
    };
  }
}

