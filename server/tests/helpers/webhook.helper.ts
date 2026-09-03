import crypto from 'crypto';

export const TEST_WEBHOOK_SECRET = 'test_webhook_secret_1234567890';

export function generateRazorpaySignature(
  rawBody: string,
  secret = TEST_WEBHOOK_SECRET
): string {
  return crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
}

export function createMockRazorpayPaymentCapturedPayload(options: {
  paymentId?: string;
  orderId?: string;
  amount?: number;
  notes?: Record<string, unknown>;
  event?: string;
} = {}): object {
  const paymentId = options.paymentId ?? `pay_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const orderId = options.orderId ?? `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const amount = options.amount ?? 50000;

  return {
    entity: 'event',
    account_id: 'acc_test123',
    event: options.event ?? 'payment.captured',
    contains: ['payment'],
    payload: {
      payment: {
        entity: {
          id: paymentId,
          entity: 'payment',
          amount,
          currency: 'INR',
          status: 'captured',
          order_id: orderId,
          invoice_id: null,
          international: false,
          method: 'card',
          amount_refunded: 0,
          refund_status: null,
          captured: true,
          description: 'Booking Payment',
          card_id: 'card_test123',
          bank: null,
          wallet: null,
          vpa: null,
          email: 'testuser@example.com',
          contact: '+919999999999',
          notes: options.notes ?? {
            holdId: 'hold_test_123',
            venueId: '60d5ecb8b392d40015f8a001',
            date: '2026-08-01',
            slotId: '09:00-11:00',
            userId: '60d5ecb8b392d40015f8a002',
          },
          fee: 1000,
          tax: 180,
          error_code: null,
          error_description: null,
          created_at: Math.floor(Date.now() / 1000),
        },
      },
    },
    created_at: Math.floor(Date.now() / 1000),
  };
}
