export interface CreatePaymentRequest {
    paymentId: string;
    amount: number;
    currency: string;

    customerName: string;
    customerEmail: string;
    customerPhone: string;

    description: string;

    metadata?: Record<string, string>;
}

export interface CreatePaymentResponse {
    providerOrderId: string;
    checkoutUrl?: string;
    providerData?: unknown;
}

export interface VerifyPaymentRequest {
    providerOrderId: string;
    providerPaymentId: string;
    signature?: string;
}

export interface VerifyPaymentResponse {
    success: boolean;
    providerPaymentId: string;
    paidAt?: Date;
    raw?: unknown;
}

export interface RefundPaymentRequest {
    providerPaymentId: string;
    amount: number;
    reason?: string;
}

export interface RefundPaymentResponse {
    refundId: string;
    success: boolean;
    refundedAt?: Date;
    raw?: unknown;
}

export interface IPaymentProvider {

    /**
     * Creates a payment order with the gateway.
     */
    createPayment(
        request: CreatePaymentRequest,
    ): Promise<CreatePaymentResponse>;

    /**
     * Verifies payment authenticity.
     */
    verifyPayment(
        request: VerifyPaymentRequest,
    ): Promise<VerifyPaymentResponse>;

    /**
     * Refunds a completed payment.
     */
    refundPayment(
        request: RefundPaymentRequest,
    ): Promise<RefundPaymentResponse>;
}

export const PaymentProvider = Symbol('PaymentProvider');