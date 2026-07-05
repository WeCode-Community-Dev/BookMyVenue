import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VenueStatus } from '@prisma/client/edge';
import { MailService } from 'src/mail/mail.service';
import { RejectVenueDto } from './dto/reject-venue.dto';


@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService, private readonly mailService: MailService) {}

  async getPendingVenues() {
    // Fetch all venues with status PENDING
    return this.prisma.venue.findMany({
      where: { status: 'PENDING' },
    });
  }  
  
 async approveVenue(venueId: string) {
    const venue = await this.prisma.venue.findUnique({
      where: {
        id: venueId,
      },
      include: {
        owner: true,
      },
    });

    if (!venue) {
      throw new NotFoundException(
        'Venue not found.',
      );
    }

    if (venue.status === VenueStatus.APPROVED) {
      throw new BadRequestException(
        'Venue is already approved.',
      );
    }

    const approvedVenue = await this.prisma.venue.update({
      where: {
        id: venueId,
      },
      data: {
        status: VenueStatus.APPROVED,
        rejectionReason: null,
      },
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
  async rejectVenue(
  venueId: string,
  rejectVenueDto: RejectVenueDto,
) {
  const venue = await this.prisma.venue.findUnique({
    where: {
      id: venueId,
    },
    include: {
      owner: true,
    },
  });

  if (!venue) {
    throw new NotFoundException(
      'Venue not found.',
    );
  }

  if (venue.status === VenueStatus.REJECTED) {
    throw new BadRequestException(
      'Venue is already rejected.',
    );
  }

  const rejectedVenue =
    await this.prisma.venue.update({
      where: {
        id: venueId,
      },
      data: {
        status: VenueStatus.REJECTED,
        rejectionReason:
          rejectVenueDto.reason,
      },
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
