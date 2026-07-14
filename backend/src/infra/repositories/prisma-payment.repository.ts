import { Injectable } from "@nestjs/common";
import type { IPaymentRepository, UpdatePaymentDto } from "src/core/domain/payment/repositories/payment-repository.interface";
import { PrismaService } from "../database/prisma/prisma.service";
import { Payment } from "src/core/domain/payment/entities/payment.entity";
import type { PaymentStatus } from "src/core/domain/_shared/enum/PaymentStatus.enum";


@Injectable()
export class PrismaPaymentRepository implements IPaymentRepository {

    constructor(private readonly prisma: PrismaService) { }

    async create(payment: Payment): Promise<void> {
        await this.prisma.payments.create({
            data: {
                id: payment.id,
                amount: payment.amount,
                provider: payment.provider,
                booking_id: payment.bookingId,
                provider_order_id: payment.providerOrderId,
                status: payment.status,
                currency: payment.currency,
            }
        })
    }

    async findById(id: string): Promise<Payment | null> {

        const payment = await this.prisma.payments.findUnique({ where: { id } })

        if (!payment) return null

        return Payment.restore(payment.id, {
            amount: payment.amount.toNumber(),
            bookingId: payment.booking_id,
            paidAt: payment.paid_at,
            provider: payment.provider,
            providerPaymentId: payment.provider_payment_id,
            status: payment.status as PaymentStatus,
            currency: payment.currency,
            providerOrderId: payment.provider_order_id,
            failureReason: payment.failure_reason,
            createdAt: payment.created_at,
            updatedAt: payment.updated_at
        })

    }

    async findAllByBookingId(bookingId: string): Promise<Payment[]> {
        const payments = await this.prisma.payments.findMany({
            where: { booking_id: bookingId }
        })

        return payments.map(payment => (
            Payment.restore(payment.id, {
                amount: payment.amount.toNumber(),
                bookingId: payment.booking_id,
                paidAt: payment.paid_at,
                provider: payment.provider,
                providerPaymentId: payment.provider_payment_id,
                status: payment.status as PaymentStatus,
                currency: payment.currency,
                providerOrderId: payment.provider_order_id,
                failureReason: payment.failure_reason,
                createdAt: payment.created_at,
                updatedAt: payment.updated_at
            })
        ))
    }

    async findByBookingId(bookingId: string): Promise<Payment | null> {
        const payment = await this.prisma.payments.findFirst({
            where: { booking_id: bookingId },
            orderBy: { created_at: 'desc' }
        })

        if (!payment) return null

        return Payment.restore(payment.id, {
            amount: payment.amount.toNumber(),
            bookingId: payment.booking_id,
            paidAt: payment.paid_at,
            provider: payment.provider,
            providerPaymentId: payment.provider_payment_id,
            status: payment.status as PaymentStatus,
            currency: payment.currency,
            providerOrderId: payment.provider_order_id,
            failureReason: payment.failure_reason,
            createdAt: payment.created_at,
            updatedAt: payment.updated_at
        })

    }

    async findByProviderOrderId(orderId: string): Promise<Payment | null> {
        const payment = await this.prisma.payments.findFirst({
            where: { provider_order_id: orderId },
            orderBy: { created_at: 'desc' }
        })

        if (!payment) return null

        return Payment.restore(payment.id, {
            amount: payment.amount.toNumber(),
            bookingId: payment.booking_id,
            paidAt: payment.paid_at,
            provider: payment.provider,
            providerPaymentId: payment.provider_payment_id,
            status: payment.status as PaymentStatus,
            currency: payment.currency,
            providerOrderId: payment.provider_order_id,
            failureReason: payment.failure_reason,
            createdAt: payment.created_at,
            updatedAt: payment.updated_at
        })

    }

    async update(id: string, data: UpdatePaymentDto): Promise<Payment> {

        const payment = await this.prisma.payments.update({
            where: { id },
            data: {
                status: data.status,
                provider_payment_id: data.providerPaymentId,
                paid_at: data.paidAt,
                failure_reason: data.failureReason
            }
        })

        return Payment.restore(id, {
            amount: payment.amount.toNumber(),
            bookingId: payment.booking_id,
            paidAt: payment.paid_at,
            provider: payment.provider,
            providerPaymentId: payment.provider_payment_id,
            status: payment.status as PaymentStatus,
            currency: payment.currency,
            providerOrderId: payment.provider_order_id,
            failureReason: payment.failure_reason,
            createdAt: payment.created_at,
            updatedAt: payment.updated_at
        })
    }

}
