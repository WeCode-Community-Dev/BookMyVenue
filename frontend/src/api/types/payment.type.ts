export enum PaymentStatus {
    PENDING = 'PENDING',
    INITIATED = 'INITIATED',
    PAID = 'PAID',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED',
}

export interface InitiatePaymentRequest {
    bookingId: string;
    customerPhone: string;
}

export interface RazorpayCheckoutData {
    key: string;
    orderId: string;
    amount: number;
    currency: string;
}

export interface InitiatePaymentResponse {
    paymentId: string;
    providerOrderId: string;
    checkoutData: RazorpayCheckoutData;
}

export interface VerifyPaymentRequest {
    providerOrderId: string;
    providerPaymentId: string;
    signature: string;
}

export interface VerifyPaymentResponse {
    paymentId: string;
    bookingId: string;
    status: PaymentStatus | string;
    paidAt: string;
}
