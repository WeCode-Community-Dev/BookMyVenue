import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Venue } from '../entities/venue.entity';
import { VenueType } from 'src/common/enums/venue-type.enum';
import { VenueStatus } from 'src/common/enums/venue-status.enum';
import { NotFoundException } from '@nestjs/common';
import { VenueVerificationRequest } from '../entities/venue-verification-request.entity';
import { VerificationStatus } from 'src/common/enums/verification-status.enum';
import { VenueNotificationsService } from './venue-notify.service';
import { User } from 'src/users/entities/user.entity';
import { UserRole } from 'src/common/enums/user-role.enum';
import { CustomerProfile } from 'src/users/entities/customer-profile.entity';
import { VenueImage } from '../entities/venue-image.entity';
import { VenueDocument } from '../entities/venue-document.entity';

@Injectable()
export class AdminVenueService {
   constructor(
      @InjectRepository(Venue)
      private readonly venueRepo: Repository<Venue>,
      @InjectRepository(VenueVerificationRequest)
      private readonly venueVerificationRepo: Repository<VenueVerificationRequest>,
      private readonly notificationsService: VenueNotificationsService,
      @InjectRepository(User)
      private readonly userRepo: Repository<User>,
      @InjectRepository(CustomerProfile)
      private readonly customerProfileRepo: Repository<CustomerProfile>,
   ) { }

   async PendingVenues(): Promise<Venue[]> {
      const pending = await this.venueRepo.find({
         where: {
            status: In([VenueStatus.PENDING_REVIEW, VenueStatus.RESUBMITTED])
         }
      })

      return pending;
   }

   async PendingVenueDetails(venueId: string): Promise<Venue> {
      const pendingDetails = await this.venueRepo.findOne({
         where: {
            id: venueId,
            status: In([VenueStatus.PENDING_REVIEW, VenueStatus.RESUBMITTED])
         },
         relations: [
            'images',
            'documents',
         ],
      })

      if (!pendingDetails) {
         throw new NotFoundException("Venue Details Not Found")
      }
      return pendingDetails;
   }

   async AcceptVerification(venueId: string, review_notes: string): Promise<{
      message: string, status: string, review_notes: string
   }> {

      const request = await this.venueVerificationRepo.findOne({
         where: {
            venueId: venueId,
            status: VerificationStatus.PENDING
         }
      })

      if (!request) {
         throw new NotFoundException("Request is not found");
      }
      request.status = VerificationStatus.APPROVED;
      request.reviewNotes = review_notes
      const venue = await this.venueRepo.findOne({
         where: {
            id: request.venueId
         }
      })
      if (!venue) {
         throw new NotFoundException('Venue not found');
      }
      venue.status = VenueStatus.APPROVED

      await this.venueVerificationRepo.save(request)
      await this.venueRepo.save(venue);
      this.notificationsService.emitStatusChange(venue.id, venue.status, request.reviewNotes);
      return {
         message: `Venue ${venue.venueName} has been verified successfully.`,
         status: venue.status,
         review_notes: request.reviewNotes
      }
   }

   async RejectVerification(venueId: string, review_notes: string): Promise<{
      message: string, status: string, review_notes: string
   }> {

      const request = await this.venueVerificationRepo.findOne({
         where: {
            venueId: venueId,
            status: VerificationStatus.PENDING
         }
      })

      if (!request) {
         throw new NotFoundException("Request is not found");
      }

      request.status = VerificationStatus.REJECTED;
      request.reviewNotes = review_notes
      const venue = await this.venueRepo.findOne({
         where: {
            id: request.venueId
         }
      })
      if (!venue) {
         throw new NotFoundException('Venue not found');
      }
      venue.status = VenueStatus.REJECTED

      await this.venueVerificationRepo.save(request)
      await this.venueRepo.save(venue);
      this.notificationsService.emitStatusChange(venue.id, venue.status, request.reviewNotes);
      return {
         message: `Venue ${venue.venueName} has been Rejected.`,
         status: venue.status,
         review_notes: request.reviewNotes
      }
   }

   async RequestChanges(venueId: string, review_notes: string): Promise<{
      message: string, status: string, review_notes: string
   }> {

      const request = await this.venueVerificationRepo.findOne({
         where: {
            venueId: venueId,
            status: VerificationStatus.PENDING
         }
      })

      if (!request) {
         throw new NotFoundException("Request is not found");
      }

      request.status = VerificationStatus.CHANGES_REQUESTED;
      request.reviewNotes = review_notes;
      const venue = await this.venueRepo.findOne({
         where: {
            id: request.venueId
         }
      })
      if (!venue) {
         throw new NotFoundException('Venue not found');
      }
      venue.status = VenueStatus.CHANGES_REQUESTED;

      await this.venueVerificationRepo.save(request)
      await this.venueRepo.save(venue);
      this.notificationsService.emitStatusChange(venue.id, venue.status, request.reviewNotes);
      return {
         message: `Changes requested for venue ${venue.venueName}.`,
         status: venue.status,
         review_notes: request.reviewNotes
      }
   }

   async VenueList(): Promise<{ venueName: string }> {
      const venue = await this.venueRepo.findOne({
         where: {
            status: VenueStatus.APPROVED
         }
      })

      if (!venue) {
         throw new NotFoundException('Venues not found');
      }

      return {
         venueName: venue.venueName
      }
   }

   async getVenues(status?: VenueStatus): Promise<Venue[]> {
      const whereClause: any = {};
      if (status) {
         whereClause.status = status;
      }
      return this.venueRepo.find({
         where: whereClause,
         order: { createdAt: 'DESC' },
      });
   }

   async getVenueDetails(venueId: string): Promise<Venue> {
      const venue = await this.venueRepo.findOne({
         where: { id: venueId },
      });
      if (!venue) {
         throw new NotFoundException('Venue not found');
      }
      return venue;
   }

   async getVenuePhotos(venueId: string): Promise<VenueImage[]> {
      const venue = await this.venueRepo.findOne({
         where: { id: venueId },
         relations: ['images'],
      });
      if (!venue) {
         throw new NotFoundException('Venue not found');
      }
      return venue.images || [];
   }

   async getVenueDocs(venueId: string): Promise<VenueDocument[]> {
      const venue = await this.venueRepo.findOne({
         where: { id: venueId },
         relations: ['documents'],
      });
      if (!venue) {
         throw new NotFoundException('Venue not found');
      }
      return venue.documents || [];
   }

   async getCustomers(): Promise<User[]> {
      return this.userRepo.find({
         where: { role: UserRole.CUSTOMER },
         select: ['id', 'name', 'email', 'phone']
      });
   }

   async getCustomerDetails(userId: string): Promise<any> {
      const customer = await this.userRepo.findOne({
         where: { id: userId, role: UserRole.CUSTOMER },
         select: ['id', 'name', 'email', 'phone']
      });
      if (!customer) {
         throw new NotFoundException('Customer not found');
      }

      const profile = await this.customerProfileRepo.findOne({
         where: { userId }
      });

      return {
         ...customer,
         profile: profile || null
      };
   }

   async getVenueOwners(): Promise<User[]> {
      return this.userRepo.find({
         where: { role: UserRole.VENUE_OWNER },
         select: ['id', 'name', 'email', 'phone']
      });
   }

   async getVenueOwnerDetails(userId: string): Promise<any> {
      const owner = await this.userRepo.findOne({
         where: { id: userId, role: UserRole.VENUE_OWNER },
         select: ['id', 'name', 'email', 'phone']
      });
      if (!owner) {
         throw new NotFoundException('Venue owner not found');
      }

      const venueDetail = await this.venueRepo.findOne({
         where: {
            ownerId: userId
         }
      })

      if (!venueDetail) {
         throw new NotFoundException('Venue Details not found');
      }
      return {
         ...owner,
         venueDetail: venueDetail || null
      }

   }

   async updateUser(userId: string, updateData: { name?: string; email?: string; phone?: string; isActive?: boolean }): Promise<User> {
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) {
         throw new NotFoundException('User not found');
      }

      if (updateData.name !== undefined) user.name = updateData.name;
      if (updateData.email !== undefined) user.email = updateData.email;
      if (updateData.phone !== undefined) user.phone = updateData.phone;
      if (updateData.isActive !== undefined) user.isActive = updateData.isActive;

      const savedUser = await this.userRepo.save(user);
      const { passwordHash, ...result } = savedUser;
      return result as User;
   }

   async deleteUser(userId: string): Promise<{ message: string }> {
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) {
         throw new NotFoundException('User not found');
      }
      user.isActive = false;
      await this.userRepo.save(user);
      return { message: 'User deactivated successfully' };
   }
}
