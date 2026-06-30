import { Inject, Injectable } from '@nestjs/common';
import { PaymentStatus } from 'src/core/domain/_shared/enum/PaymentStatus.enum';
import { BusinessRuleException } from 'src/core/domain/_shared/exception/business-rule.exception';
import { BookingStatus } from 'src/core/domain/bookings/enum/booking-status.enum';
import type { IBookingRepository } from 'src/core/domain/bookings/repositories/booking-repository.interface';
import { Payment } from 'src/core/domain/payment/entities/payment.entity';
import type { IPaymentProvider } from 'src/core/domain/payment/payment-provider.interface';
import type { IPaymentRepository } from 'src/core/domain/payment/repositories/payment-repository.interface';


export interface InitiatePaymentCommand {
    bookingId: string;
    customerPhone: string
}
@Injectable()
export class InitiatePaymentCommandHandler {

    constructor(
        @Inject('IPaymentRepository')
        private readonly paymentRepository: IPaymentRepository,
        @Inject('IBookingRepository')
        private readonly bookingRepository: IBookingRepository,
        @Inject('IPaymentProvider')
        private readonly paymentProvider: IPaymentProvider,
    ) { }

    async execute(command: InitiatePaymentCommand, userId: string) {

        const booking = await this.bookingRepository.findById(command.bookingId);

        if (!booking) {
            throw new BusinessRuleException('Booking not found');
        }

        const existingPayment = await this.paymentRepository.findByBookingId(
            booking.id,
        );

        if (existingPayment) {
            throw new BusinessRuleException('Payment already exists');
        }

        const payment = Payment.create(
            crypto.randomUUID(),
            {
                bookingId: booking.id,
                provider: 'RAZORPAY',
                providerOrderId: null,
                providerPaymentId: null,
                amount: booking.totalAmount,
                currency: 'INR',
                status: PaymentStatus.INITIATED,
                paidAt: null,
                failureReason: null,
            },
        );

        const response = await this.paymentProvider.createPayment({
            paymentId: payment.id,
            amount: payment.amount,
            currency: payment.currency,
            customerName: booking.user!.firstName + ' ' + booking.user!.lastName,
            customerEmail: booking.user!.email,
            customerPhone: booking.user!.phone || command.customerPhone,
            description: `Booking #${booking.id}`,
        });

        payment.setProviderOrderId(
            response.providerOrderId,
        );

        await this.paymentRepository.create(payment);
        await this.bookingRepository.update(booking.id, {
            paymentStatus: PaymentStatus.INITIATED
        })

        return {
            paymentId: payment.id,
            providerOrderId: response.providerOrderId,
            checkoutData: response.providerData,
        };

    }

}