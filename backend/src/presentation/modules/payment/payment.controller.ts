import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { type TokenPayload } from '../../../core/application/users/services/token.interface';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { RolesGuard } from 'src/presentation/guards/roles.guard';
import { InitiatePaymentCommandHandler } from 'src/core/application/payment/commands/initiate-payment.command';
import { VerifyPaymentCommandHandler } from 'src/core/application/payment/commands/verify-payment.command';
import { InitiatePaymentDto, VerifyPaymentDto } from './dto/payment.dto';

@ApiTags('payment')
@Controller({
    version: '1',
    path: 'payment',
})
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class PaymentController {
    constructor(
        private readonly verifyPaymentCommand: VerifyPaymentCommandHandler,
        private readonly initiatePaymentCommand: InitiatePaymentCommandHandler,
    ) { }

    @Post('initiate')
    @ApiOperation({ summary: 'Initiate payment' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    adminDashboard(
        @CurrentUser() user: TokenPayload,
        @Body() data: InitiatePaymentDto
    ) {
        return this.initiatePaymentCommand.execute(data, user.userId);
    }

    @Post('verify')
    @ApiOperation({ summary: 'verify payment' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    ownerDashboard(
        @CurrentUser() user: TokenPayload,
        @Body() data: VerifyPaymentDto
    ) {
        return this.verifyPaymentCommand.execute(data, user.userId);
    }

}
