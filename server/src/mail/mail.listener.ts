import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailService } from './mail.service';
import { User } from '../users/entities/user.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Venue } from '../venues/entities/venue.entity';

@Injectable()
export class MailListener {
  private readonly logger = new Logger(MailListener.name);

  constructor(
    private readonly mailService: MailService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Booking)
    private readonly bookingsRepository: Repository<Booking>,
    @InjectRepository(Venue)
    private readonly venuesRepository: Repository<Venue>,
  ) {}

  /**
   * Listens to 'user.registered' event.
   * Sends a beautiful welcome email to the newly registered customer/owner.
   */
  @OnEvent('user.registered')
  async handleUserRegistered(payload: { user: User; otp?: string }) {
    const { user, otp } = payload;
    this.logger.log(`Handling user.registered event for: ${user.email}`);

    const isOwner = user.role === 'venue_owner';
    const portalRoleText = isOwner ? 'Host Dashboard' : 'Guest Discover Portal';
    
    const html = this.wrapTemplate(`
      <h2 style="color: #1e293b; font-size: 24px; font-weight: 800; margin-bottom: 16px;">Welcome to BookMyVenue, ${user.name}! 👋</h2>
      
      ${otp ? `
        <div style="background-color: #f8fafc; border-left: 4px solid #6366f1; padding: 20px; border-radius: 0 12px 12px 0; margin-bottom: 24px; text-align: center;">
          <h4 style="margin: 0 0 8px 0; color: #1e293b; font-size: 16px; font-weight: 700;">Account Verification Code 🔒</h4>
          <p style="margin: 0 0 12px 0; color: #475569; font-size: 14px; line-height: 20px;">
            Please enter the following 6-digit One-Time Password (OTP) to verify your account and access your dashboard. This code is valid for 5 minutes.
          </p>
          <div style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #6366f1; font-family: monospace; display: inline-block; background-color: #e0e7ff; padding: 8px 24px; border-radius: 8px;">
            ${otp}
          </div>
        </div>
      ` : ''}

      <p style="color: #475569; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
        We are thrilled to have you join our premium venue booking platform. Whether you are seeking the ultimate spot for a corporate retreat, an elegant wedding hall, or a cozy cafe slot, BookMyVenue makes it seamless, secure, and stress-free.
      </p>
      
      ${isOwner ? `
        <div style="background-color: #f8fafc; border-left: 4px solid #6366f1; padding: 16px; border-radius: 0 12px 12px 0; margin-bottom: 24px;">
          <h4 style="margin: 0 0 8px 0; color: #1e293b; font-size: 16px; font-weight: 700;">Host Account Ready! 🏢</h4>
          <p style="margin: 0; color: #475569; font-size: 14px; line-height: 20px;">
            As a registered venue partner, you can list your properties, configure working days, set exact operating hours, manage calendars, block maintenance dates, and receive automated payments directly through your workspace.
          </p>
        </div>
      ` : `
        <div style="background-color: #f8fafc; border-left: 4px solid #6366f1; padding: 16px; border-radius: 0 12px 12px 0; margin-bottom: 24px;">
          <h4 style="margin: 0 0 8px 0; color: #1e293b; font-size: 16px; font-weight: 700;">Start Discovering Today! 🗺️</h4>
          <p style="margin: 0; color: #475569; font-size: 14px; line-height: 20px;">
            Browse verified listings near your device location, view dynamic pricing breakdowns, check verified guest ratings, and lock in your reservation hours instantly with a few clicks!
          </p>
        </div>
      `}

      <div style="text-align: center; margin: 32px 0 24px 0;">
        <a href="http://localhost:5173" style="background-color: #6366f1; color: #ffffff; padding: 14px 28px; font-size: 15px; font-weight: 700; text-decoration: none; border-radius: 10px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.2);">
          Access Your ${portalRoleText}
        </a>
      </div>
    `);

    await this.mailService.sendMail(
      user.email,
      otp ? 'Verify your BookMyVenue Account 🔒' : 'Welcome to BookMyVenue! 🏢✨',
      html,
    );
  }

  @OnEvent('user.otpResent')
  async handleOtpResent(payload: { user: User; otp: string }) {
    const { user, otp } = payload;
    this.logger.log(`Handling user.otpResent event for: ${user.email}`);

    const html = this.wrapTemplate(`
      <h2 style="color: #1e293b; font-size: 24px; font-weight: 800; margin-bottom: 16px;">Verify Your Account 🔒</h2>
      <p style="color: #475569; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
        Hello <strong>${user.name}</strong>, here is your new One-Time Password (OTP) to verify your BookMyVenue account. This code is valid for 5 minutes.
      </p>
      
      <div style="background-color: #f8fafc; border-left: 4px solid #6366f1; padding: 24px; border-radius: 12px; margin-bottom: 24px; text-align: center;">
        <span style="display: block; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; tracking-wider; margin-bottom: 8px;">YOUR VERIFICATION CODE</span>
        <div style="font-size: 36px; font-weight: 800; letter-spacing: 6px; color: #6366f1; font-family: monospace; display: inline-block; background-color: #e0e7ff; padding: 8px 24px; border-radius: 8px;">
          ${otp}
        </div>
      </div>

      <p style="color: #64748b; font-size: 13px; line-height: 20px;">
        If you did not request this verification code, please ignore this email.
      </p>
    `);

    await this.mailService.sendMail(
      user.email,
      'Your BookMyVenue Verification Code 🔒',
      html,
    );
  }

  /**
   * Listens to 'booking.created' event.
   * Sends booking confirmation to the Guest and a booking alert to the Host.
   */
  @OnEvent('booking.created')
  async handleBookingCreated(payload: { bookingId: string }) {
    this.logger.log(`Handling booking.created event for bookingId: ${payload.bookingId}`);

    const booking = await this.bookingsRepository.findOne({
      where: { id: payload.bookingId },
      relations: {
        user: true,
        venue: {
          owner: true,
        },
      },
    });

    if (!booking) {
      this.logger.error(`Booking with ID ${payload.bookingId} not found in database. Aborting email send.`);
      return;
    }

    const guest = booking.user;
    const venue = booking.venue;
    const host = venue.owner;

    const formattedDate = this.formatDate(booking.bookingDate);
    const formattedStart = this.formatTime12Hour(booking.startTime);
    const formattedEnd = this.formatTime12Hour(booking.endTime);
    const formattedAmount = this.formatCurrency(booking.totalAmount);

    // --- 1. SEND GUEST CONFIRMATION EMAIL ---
    const guestHtml = this.wrapTemplate(`
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 40px;">🎉</span>
        <h2 style="color: #1e293b; font-size: 24px; font-weight: 800; margin: 8px 0 4px 0;">Booking Confirmed!</h2>
        <p style="color: #64748b; font-size: 14px; margin: 0;">Code: <strong style="color: #6366f1;">${booking.bookingCode}</strong></p>
      </div>

      <p style="color: #475569; font-size: 15px; line-height: 22px;">
        Hello <strong>${guest.name}</strong>, your reservation at <strong>${venue.venueName}</strong> has been successfully booked and confirmed. Please find your reservation summary below.
      </p>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #475569;">
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #1e293b; width: 130px;">Venue</td>
            <td style="padding: 8px 0;">${venue.venueName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #1e293b;">Address</td>
            <td style="padding: 8px 0;">📍 ${venue.address}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #1e293b;">Date</td>
            <td style="padding: 8px 0;">📅 ${formattedDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #1e293b;">Time Slot</td>
            <td style="padding: 8px 0;">⏰ ${formattedStart} - ${formattedEnd}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #1e293b;">Guest Count</td>
            <td style="padding: 8px 0;">👥 ${booking.guestCount} pax</td>
          </tr>
          <tr style="border-top: 1px solid #e2e8f0;">
            <td style="padding: 12px 0 0 0; font-weight: 800; color: #1e293b; font-size: 16px;">Amount Paid</td>
            <td style="padding: 12px 0 0 0; font-weight: 800; color: #6366f1; font-size: 16px;">${formattedAmount}</td>
          </tr>
        </table>
      </div>

      <div style="margin: 24px 0; padding: 16px; background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; font-size: 13px; color: #b45309; line-height: 18px;">
        <strong>Cancellation Policy:</strong> Bookings can be cancelled up to 24 hours prior to the scheduled slot start time. Cancellations inside 24 hours are non-refundable.
      </div>

      <div style="text-align: center; margin: 32px 0 16px 0;">
        <a href="https://www.google.com/maps/search/?api=1&query=${venue.latitude},${venue.longitude}" style="background-color: #ffffff; color: #475569; border: 1px solid #cbd5e1; padding: 12px 24px; font-size: 14px; font-weight: 700; text-decoration: none; border-radius: 8px; display: inline-block; margin-right: 12px;">
          📍 Get Directions
        </a>
        <a href="http://localhost:5173/bookings" style="background-color: #6366f1; color: #ffffff; padding: 12px 24px; font-size: 14px; font-weight: 700; text-decoration: none; border-radius: 8px; display: inline-block;">
          💻 View Bookings
        </a>
      </div>
    `);

    await this.mailService.sendMail(
      guest.email,
      `Booking Confirmed! ${venue.venueName} (${booking.bookingCode}) 🏢`,
      guestHtml,
    );

    // --- 2. SEND HOST RESERVATION ALERT EMAIL ---
    if (host) {
      const hostHtml = this.wrapTemplate(`
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="font-size: 40px;">📅</span>
          <h2 style="color: #1e293b; font-size: 24px; font-weight: 800; margin: 8px 0 4px 0;">New Reservation Received!</h2>
          <p style="color: #64748b; font-size: 14px; margin: 0;">Venue: <strong>${venue.venueName}</strong></p>
        </div>

        <p style="color: #475569; font-size: 15px; line-height: 22px;">
          Hello <strong>${host.name}</strong>, a guest has confirmed a new reservation at your property. Please prepare the venue accordingly.
        </p>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #475569;">
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #1e293b; width: 130px;">Guest Name</td>
              <td style="padding: 8px 0;">${guest.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #1e293b;">Contact Email</td>
              <td style="padding: 8px 0;">✉️ ${guest.email}</td>
            </tr>
            ${guest.phone ? `
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #1e293b;">Contact Phone</td>
              <td style="padding: 8px 0;">📞 ${guest.phone}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #1e293b;">Date</td>
              <td style="padding: 8px 0;">📅 ${formattedDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #1e293b;">Time Slot</td>
              <td style="padding: 8px 0;">⏰ ${formattedStart} - ${formattedEnd}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #1e293b;">Guest Count</td>
              <td style="padding: 8px 0;">👥 ${booking.guestCount} pax</td>
            </tr>
            <tr style="border-top: 1px solid #e2e8f0;">
              <td style="padding: 12px 0 0 0; font-weight: 800; color: #1e293b; font-size: 16px;">Payout Earned</td>
              <td style="padding: 12px 0 0 0; font-weight: 800; color: #10b981; font-size: 16px;">${formattedAmount}</td>
            </tr>
          </table>
        </div>

        <div style="text-align: center; margin: 32px 0 16px 0;">
          <a href="http://localhost:5173/owner/dashboard?tab=scheduler" style="background-color: #6366f1; color: #ffffff; padding: 14px 28px; font-size: 15px; font-weight: 700; text-decoration: none; border-radius: 10px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.2);">
            📅 Open Booking Calendar
          </a>
        </div>
      `);

      await this.mailService.sendMail(
        host.email,
        `New Booking Alert: ${guest.name} - ${formattedDate} at ${venue.venueName} 📅`,
        hostHtml,
      );
    }
  }

  /**
   * Listens to 'venue.created' event.
   * Sends confirmation to Host that their venue is live.
   */
  @OnEvent('venue.created')
  async handleVenueCreated(payload: { venueId: string }) {
    this.logger.log(`Handling venue.created event for venueId: ${payload.venueId}`);

    const venue = await this.venuesRepository.findOne({
      where: { id: payload.venueId },
      relations: { owner: true },
    });

    if (!venue) {
      this.logger.error(`Venue with ID ${payload.venueId} not found. Aborting email send.`);
      return;
    }

    const host = venue.owner;
    if (!host) return;

    const html = this.wrapTemplate(`
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 40px;">🏢✨</span>
        <h2 style="color: #1e293b; font-size: 24px; font-weight: 800; margin: 8px 0 4px 0;">Venue Listed Successfully!</h2>
        <p style="color: #64748b; font-size: 14px; margin: 0;">Your space is now active and ready for bookings.</p>
      </div>

      <p style="color: #475569; font-size: 15px; line-height: 22px;">
        Hello <strong>${host.name}</strong>, congratulations! Your property, <strong>${venue.venueName}</strong>, is now approved and live on the BookMyVenue Guest Discover portal.
      </p>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #475569;">
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #1e293b; width: 130px;">Venue Type</td>
            <td style="padding: 8px 0; text-transform: capitalize;">${venue.venueType?.replace('_', ' ')}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #1e293b;">Address</td>
            <td style="padding: 8px 0;">📍 ${venue.address}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #1e293b;">Capacity</td>
            <td style="padding: 8px 0;">👥 ${venue.capacity} guests max</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #1e293b;">Price / Hour</td>
            <td style="padding: 8px 0; font-weight: 700; color: #6366f1;">${this.formatCurrency(venue.pricePerHour)}</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin: 32px 0 16px 0;">
        <a href="http://localhost:5173/owner/dashboard?tab=venues" style="background-color: #6366f1; color: #ffffff; padding: 14px 28px; font-size: 15px; font-weight: 700; text-decoration: none; border-radius: 10px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.2);">
          🏢 Manage Listings
        </a>
      </div>
    `);

    await this.mailService.sendMail(
      host.email,
      `Your Venue "${venue.venueName}" is Live on BookMyVenue! 🏢✨`,
      html,
    );
  }

  /**
   * Listens to 'venue.updated' event.
   * Sends confirmation to Host that their updates are live.
   */
  @OnEvent('venue.updated')
  async handleVenueUpdated(payload: { venueId: string }) {
    this.logger.log(`Handling venue.updated event for venueId: ${payload.venueId}`);

    const venue = await this.venuesRepository.findOne({
      where: { id: payload.venueId },
      relations: { owner: true },
    });

    if (!venue) {
      this.logger.error(`Venue with ID ${payload.venueId} not found. Aborting email send.`);
      return;
    }

    const host = venue.owner;
    if (!host) return;

    const html = this.wrapTemplate(`
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 40px;">✏️</span>
        <h2 style="color: #1e293b; font-size: 24px; font-weight: 800; margin: 8px 0 4px 0;">Venue Profile Updated</h2>
        <p style="color: #64748b; font-size: 14px; margin: 0;">Your modifications are now active.</p>
      </div>

      <p style="color: #475569; font-size: 15px; line-height: 22px;">
        Hello <strong>${host.name}</strong>, the profile details and pricing structure of your venue, <strong>${venue.venueName}</strong>, have been successfully updated. All guest listings and calendars have been updated accordingly.
      </p>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #475569;">
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #1e293b; width: 130px;">Venue</td>
            <td style="padding: 8px 0;">${venue.venueName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #1e293b;">Price / Hour</td>
            <td style="padding: 8px 0; font-weight: 700; color: #6366f1;">${this.formatCurrency(venue.pricePerHour)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #1e293b;">Capacity</td>
            <td style="padding: 8px 0;">👥 ${venue.capacity} guests max</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin: 32px 0 16px 0;">
        <a href="http://localhost:5173/owner/dashboard?tab=venues" style="background-color: #6366f1; color: #ffffff; padding: 14px 28px; font-size: 15px; font-weight: 700; text-decoration: none; border-radius: 10px; display: inline-block;">
          💻 Open Host Dashboard
        </a>
      </div>
    `);

    await this.mailService.sendMail(
      host.email,
      `Updates Saved: ${venue.venueName} Profile Modified Successfully ✏️`,
      html,
    );
  }

  /**
   * Listens to 'venue.suspended' event.
   * Sends listing suspension warning with reason to Host.
   */
  @OnEvent('venue.suspended')
  async handleVenueSuspended(payload: { venueId: string }) {
    this.logger.log(`Handling venue.suspended event for venueId: ${payload.venueId}`);

    const venue = await this.venuesRepository.findOne({
      where: { id: payload.venueId },
      relations: { owner: true },
    });

    if (!venue) {
      this.logger.error(`Venue with ID ${payload.venueId} not found. Aborting email send.`);
      return;
    }

    const host = venue.owner;
    if (!host) return;

    const html = this.wrapTemplate(`
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 40px;">⚠️</span>
        <h2 style="color: #e11d48; font-size: 24px; font-weight: 800; margin: 8px 0 4px 0;">Venue Listing Suspended</h2>
        <p style="color: #64748b; font-size: 14px; margin: 0;">Your listing has been temporarily suspended by platform administration.</p>
      </div>

      <p style="color: #475569; font-size: 15px; line-height: 22px;">
        Hello <strong>${host.name}</strong>, we are writing to inform you that your listing, <strong>${venue.venueName}</strong>, has been suspended and hidden from search results.
      </p>

      <div style="background-color: #fff1f2; border: 1px solid #fecdd3; border-radius: 12px; padding: 20px; margin: 24px 0;">
        <h4 style="margin: 0 0 8px 0; color: #9f1239; font-size: 14px; font-weight: 700;">Reason for Suspension:</h4>
        <p style="margin: 0; color: #be123c; font-size: 14px; line-height: 20px; font-style: italic;">
          "${venue.suspensionReason || 'No specific reason was provided by the administrator.'}"
        </p>
      </div>

      <p style="color: #475569; font-size: 14px; line-height: 20px;">
        <strong>Next Steps:</strong> Please log in to your host workspace to review the details. You can make adjustments and request a re-review once the issues highlighted above have been resolved.
      </p>

      <div style="text-align: center; margin: 32px 0 16px 0;">
        <a href="http://localhost:5173/owner/dashboard?tab=venues" style="background-color: #e11d48; color: #ffffff; padding: 14px 28px; font-size: 15px; font-weight: 700; text-decoration: none; border-radius: 10px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(225, 29, 72, 0.2);">
          💻 Open Host Dashboard
        </a>
      </div>
    `);

    await this.mailService.sendMail(
      host.email,
      `Action Required: Suspension of listing "${venue.venueName}" ⚠️`,
      html,
    );
  }

  /**
   * Listens to 'venue.activated' event.
   * Sends listing activation confirmation to Host.
   */
  @OnEvent('venue.activated')
  async handleVenueActivated(payload: { venueId: string }) {
    this.logger.log(`Handling venue.activated event for venueId: ${payload.venueId}`);

    const venue = await this.venuesRepository.findOne({
      where: { id: payload.venueId },
      relations: { owner: true },
    });

    if (!venue) {
      this.logger.error(`Venue with ID ${payload.venueId} not found. Aborting email send.`);
      return;
    }

    const host = venue.owner;
    if (!host) return;

    const html = this.wrapTemplate(`
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 40px;">✅✨</span>
        <h2 style="color: #10b981; font-size: 24px; font-weight: 800; margin: 8px 0 4px 0;">Listing Restored!</h2>
        <p style="color: #64748b; font-size: 14px; margin: 0;">Your space is once again approved and visible to guests.</p>
      </div>

      <p style="color: #475569; font-size: 15px; line-height: 22px;">
        Hello <strong>${host.name}</strong>, we are pleased to inform you that your listing, <strong>${venue.venueName}</strong>, has been successfully approved and restored by our platform administration.
      </p>

      <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 20px; margin: 24px 0;">
        <p style="margin: 0; color: #065f46; font-size: 14px; line-height: 20px;">
          🎉 <strong>Your venue is once again open for bookings!</strong> Guests can now search, view, and reserve slots at your property in real-time.
        </p>
      </div>

      <div style="text-align: center; margin: 32px 0 16px 0;">
        <a href="http://localhost:5173/owner/dashboard?tab=venues" style="background-color: #10b981; color: #ffffff; padding: 14px 28px; font-size: 15px; font-weight: 700; text-decoration: none; border-radius: 10px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2);">
          🏢 Manage Listings
        </a>
      </div>
    `);

    await this.mailService.sendMail(
      host.email,
      `Good news: Listing restored "${venue.venueName}" 🎉`,
      html,
    );
  }

  // --- HELPER FORMATTING METHODS ---

  private formatDate(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  }

  private formatTime12Hour(timeStr: string): string {
    if (!timeStr) return '';
    try {
      const parts = timeStr.split(':');
      const hour = parseInt(parts[0], 10);
      const minute = parts[1] || '00';
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      return `${displayHour}:${minute} ${ampm}`;
    } catch {
      return timeStr;
    }
  }

  private formatCurrency(amount: any): string {
    const val = typeof amount === 'number' ? amount : parseFloat(amount || '0');
    return `₹${val.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  /**
   * Premium responsive wrapper layout for all transactional emails.
   */
  private wrapTemplate(content: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BookMyVenue Notifications</title>
</head>
<body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f1f5f9; margin: 0; padding: 40px 0; -webkit-font-smoothing: antialiased;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);">
    <!-- Header Accent Bar -->
    <tr>
      <td style="background-color: #6366f1; height: 8px;"></td>
    </tr>
    <!-- Brand Banner -->
    <tr>
      <td style="background-color: #1e293b; padding: 32px 40px; text-align: center;">
        <span style="color: #6366f1; font-size: 26px; font-weight: 900; letter-spacing: -0.5px; font-family: 'Inter', sans-serif;">
          📍 BookMy<span style="color: #ffffff;">Venue</span>
        </span>
      </td>
    </tr>
    <!-- Main Content Area -->
    <tr>
      <td style="padding: 40px; background-color: #ffffff;">
        ${content}
      </td>
    </tr>
    <!-- Premium Brand Footer -->
    <tr>
      <td style="background-color: #f8fafc; padding: 32px 40px; border-top: 1px solid #f1f5f9; text-align: center;">
        <p style="color: #64748b; font-size: 13px; line-height: 20px; margin: 0 0 12px 0;">
          This is an automated transactional notification sent by BookMyVenue.
        </p>
        <p style="color: #94a3b8; font-size: 11px; margin: 0;">
          © ${new Date().getFullYear()} BookMyVenue Inc. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  }
}
