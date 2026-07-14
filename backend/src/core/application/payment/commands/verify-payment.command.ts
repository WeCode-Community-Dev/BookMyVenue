import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PaymentStatus } from 'src/core/domain/_shared/enum/PaymentStatus.enum';
import { BusinessRuleException } from 'src/core/domain/_shared/exception/business-rule.exception';
import type { IBookingRepository } from 'src/core/domain/bookings/repositories/booking-repository.interface';
import type { INotificationService } from 'src/core/domain/notification/notification.service.interface';
import type { IPaymentProvider } from 'src/core/domain/payment/payment-provider.interface';
import type { IPaymentRepository } from 'src/core/domain/payment/repositories/payment-repository.interface';


export interface VerifyPaymentCommand {
    providerOrderId: string;
    providerPaymentId: string;
    signature: string;
}

@Injectable()
export class VerifyPaymentCommandHandler {

    constructor(

        @Inject('IPaymentRepository')
        private readonly paymentRepository: IPaymentRepository,
        @Inject('IBookingRepository')
        private readonly bookingRepository: IBookingRepository,
        @Inject('IPaymentProvider')
        private readonly paymentProvider: IPaymentProvider,
        @Inject('INotificationService')
        private readonly notificationService: INotificationService
    ) { }

    async execute(command: VerifyPaymentCommand, userId) {

        const payment = await this.paymentRepository.findByProviderOrderId(
            command.providerOrderId,
        );

        if (!payment) {
            throw new BusinessRuleException('Payment not found');
        }

        const verification = await this.paymentProvider.verifyPayment({
            providerOrderId: command.providerOrderId,
            providerPaymentId: command.providerPaymentId,
            signature: command.signature,
        });

        if (!verification.success) {

            payment.markFailed('Payment verification failed');

            await this.paymentRepository.update(payment.id, {
                providerPaymentId: command.providerPaymentId,
                status: PaymentStatus.FAILED,
                failureReason: 'payment failed'
            });

            throw new InternalServerErrorException('Payment verification failed');

        }

        payment.markPaid(
            command.providerPaymentId,
            verification.paidAt ?? new Date(),
        );

        await this.paymentRepository.update(payment.id, {
            paidAt: new Date(),// todo need to update this date with real date from provider 
            providerPaymentId: command.providerPaymentId,
            status: PaymentStatus.PAID
        });

        await this.bookingRepository.update(payment.bookingId, {
            paymentStatus: PaymentStatus.PAID
        })

        await this.notificationService.trigger({
            subscriberId: userId,
            payload: {
                title: "Payment success",
                message: `Your recent payment is success`
            }
        })

        return {
            paymentId: payment.id,
            bookingId: payment.bookingId,
            status: payment.status,
            paidAt: payment.paidAt,
        };

    }

}