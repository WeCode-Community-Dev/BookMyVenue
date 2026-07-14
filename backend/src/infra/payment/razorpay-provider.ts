import { Injectable } from '@nestjs/common';
import Razorpay from 'razorpay';
import * as crypto from 'node:crypto';


import { PAYMENT_CONFIG } from 'src/config/app.config';
import type { CreatePaymentRequest, CreatePaymentResponse, IPaymentProvider, RefundPaymentRequest, RefundPaymentResponse, VerifyPaymentRequest, VerifyPaymentResponse } from 'src/core/domain/payment/payment-provider.interface';

@Injectable()
export class RazorpayPaymentProvider implements IPaymentProvider {

    private readonly razorpay: Razorpay;

    constructor() {

        this.razorpay = new Razorpay({
            key_id: PAYMENT_CONFIG.RAZORPAY_KEY_ID,
            key_secret: PAYMENT_CONFIG.RAZORPAY_SECRET,
        });

    }

    async createPayment(request: CreatePaymentRequest,): Promise<CreatePaymentResponse> {

        const order = await this.razorpay.orders.create({
            amount: Math.round(request.amount * 100),
            currency: request.currency,
            receipt: request.paymentId,
            notes: {
                customerName: request.customerName,
                customerEmail: request.customerEmail,
                customerPhone: request.customerPhone,
                description: request.description,
                ...(request.metadata ?? {}),
            },
        });

        return {
            providerOrderId: order.id,
            providerData: {
                key: PAYMENT_CONFIG.RAZORPAY_KEY_ID,
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
            },
        };

    }

    async verifyPayment(request: VerifyPaymentRequest,): Promise<VerifyPaymentResponse> {

        const secret = PAYMENT_CONFIG.RAZORPAY_SECRET

        const generatedSignature = crypto
            .createHmac('sha256', secret)
            .update(
                `${request.providerOrderId}|${request.providerPaymentId}`,
            )
            .digest('hex');

        const verified =
            generatedSignature === request.signature;

        if (!verified) {

            return {
                success: false,
                providerPaymentId: request.providerPaymentId,
            };

        }

        const payment = await this.razorpay.payments.fetch(
            request.providerPaymentId,
        );

        return {
            success: payment.status === 'captured',
            providerPaymentId: payment.id,
            paidAt: new Date(payment.created_at * 1000),
            raw: payment,
        };

    }

    async refundPayment(request: RefundPaymentRequest,): Promise<RefundPaymentResponse> {

        const refund = await this.razorpay.payments.refund(
            request.providerPaymentId,
            {
                amount: Math.round(request.amount * 100),
                notes: {
                    reason: request.reason ?? '',
                },
            },
        );

        return {
            refundId: refund.id,
            success: refund.status === 'processed',
            refundedAt: new Date(),
            raw: refund,
        };

    }

}