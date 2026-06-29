import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CurrentUser, CurrentUserPayload } from 'src/common/decorators/current-user.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { BookingService } from './booking.service';
import { CreateBookingDto, CancelBookingDto, VerifyPaymentDto, CancelPaymentDto, MockPayDto } from './dto/booking.dto';

@Controller('booking')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingController {
    constructor(private readonly bookingService: BookingService) { }

    // ─── Create Booking ────────────────────────────────────────────────────────

    /**
     * POST /booking
     * Customer creates a new booking for a venue on a specific date.
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Roles(UserRole.CUSTOMER)
    createBooking(
        @Body() dto: CreateBookingDto,
        @CurrentUser() user: CurrentUserPayload,
    ) {
        return this.bookingService.createBooking(dto, user.sub);
    }

    // ─── Verify Payment ────────────────────────────────────────────────────────

    /**
     * POST /booking/verify-payment
     * Verifies the Razorpay mock payment signature and confirms the booking.
     */
    @Post('verify-payment')
    @HttpCode(HttpStatus.OK)
    @Roles(UserRole.CUSTOMER)
    verifyPayment(
        @Body() dto: VerifyPaymentDto,
        @CurrentUser() user: CurrentUserPayload,
    ) {
        return this.bookingService.verifyPayment(dto, user.sub);
    }

    // ─── Cancel Payment ────────────────────────────────────────────────────────

    /**
     * POST /booking/cancel-payment
     * Cancels the payment session and releases the venue slot.
     */
    @Post('cancel-payment')
    @HttpCode(HttpStatus.OK)
    @Roles(UserRole.CUSTOMER)
    cancelPayment(
        @Body() dto: CancelPaymentDto,
        @CurrentUser() user: CurrentUserPayload,
    ) {
        return this.bookingService.cancelPayment(dto, user.sub);
    }

    // ─── Mock Payment Simulation ────────────────────────────────────────────────

    /**
     * POST /booking/mock-pay
     * Simulates Razorpay payment and returns secure credentials.
     */
    @Post('mock-pay')
    @HttpCode(HttpStatus.OK)
    @Roles(UserRole.CUSTOMER)
    mockPay(
        @Body() dto: MockPayDto,
        @CurrentUser() user: CurrentUserPayload,
    ) {
        return this.bookingService.simulateMockPay(dto, user.sub);
    }

    // ─── List My Bookings ──────────────────────────────────────────────────────

    /**
     * GET /booking/my
     * Customer retrieves their own booking history.
     */
    @Get('my')
    @HttpCode(HttpStatus.OK)
    @Roles(UserRole.CUSTOMER)
    getMyBookings(@CurrentUser() user: CurrentUserPayload) {
        return this.bookingService.getCustomerBookings(user.sub);
    }

    /**
     * GET /booking/venue/owner
     * Venue owner retrieves bookings for their venue.
     */
    @Get('venue/owner')
    @HttpCode(HttpStatus.OK)
    @Roles(UserRole.VENUE_OWNER)
    getVenueBookings(@CurrentUser() user: CurrentUserPayload) {
        return this.bookingService.getVenueBookings(user.sub);
    }

    // ─── Cancel Booking ────────────────────────────────────────────────────────

    /**
     * PATCH /booking/:bookingId/cancel
     * - Customer can only cancel their own booking.
     * - Venue owner can cancel bookings on their venue.
     * - Admin can cancel any booking.
     */
    @Patch(':bookingId/cancel')
    @HttpCode(HttpStatus.OK)
    @Roles(UserRole.CUSTOMER, UserRole.VENUE_OWNER, UserRole.ADMIN)
    cancelBooking(
        @Param('bookingId', ParseUUIDPipe) bookingId: string,
        @Body() dto: CancelBookingDto,
        @CurrentUser() user: CurrentUserPayload,
    ) {
        return this.bookingService.cancelBooking(dto, bookingId, user.sub, user.role);
    }
}
