import {
    Body,
    Controller,
    Param,
    ParseUUIDPipe,
    Post,
    Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../../shared/decorators/roles.decorator';
import { AuthenticatedRequest } from '../auth/types/authenticated-request.type';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { PaymentService } from './payment.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    @ApiBearerAuth()
    @Roles(Role.USER)
    @Post('bookings/:bookingId/order')
    @ApiOperation({ summary: 'Create Razorpay order for a booking' })
    async createOrder(
        @Param('bookingId', ParseUUIDPipe) bookingId: string,
        @Req() req: AuthenticatedRequest,
    ) {
        return {
            success: true,
            message: 'Payment order created successfully.',
            data: await this.paymentService.createOrder(bookingId, req.user.sub),
        };
    }

    @ApiBearerAuth()
    @Roles(Role.USER)
    @Post('verify')
    @ApiOperation({ summary: 'Verify Razorpay checkout success and confirm booking' })
    async verify(
        @Body() dto: VerifyPaymentDto,
        @Req() req: AuthenticatedRequest,
    ) {
        return {
            success: true,
            message: 'Payment verified successfully.',
            data: await this.paymentService.verifyPayment(dto, req.user.sub),
        };
    }
}