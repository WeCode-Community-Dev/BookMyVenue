import { Module } from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { InfraModule } from '../../../infra/infra.module';
import { PaymentController } from './payment.controller';
import { InitiatePaymentCommandHandler } from 'src/core/application/payment/commands/initiate-payment.command';
import { VerifyPaymentCommandHandler } from 'src/core/application/payment/commands/verify-payment.command';

@Module({
    imports: [InfraModule],
    controllers: [PaymentController],
    providers: [InitiatePaymentCommandHandler, VerifyPaymentCommandHandler, JwtAuthGuard],
})
export class PaymentModule { }
