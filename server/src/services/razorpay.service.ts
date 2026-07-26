/**
 * razorpay.service.ts
 *
 * Thin, strongly-typed wrapper around the Razorpay Node SDK.
 * Exposes three domain functions:
 *   - createOrder   — Standard Orders API (used in checkout init)
 *   - verifyWebhookSignature — HMAC-SHA256 verification for incoming webhooks
 *   - issueRefund   — Full refund for a captured payment
 *
 * The Razorpay client is a lazy singleton: instantiated on first call after
 * env-vars are validated, never re-created on subsequent calls.
 */

import Razorpay from 'razorpay';
import crypto from 'crypto';
import { razorpayConfig } from '../constants/env';
import { logError, logInfo } from '../utils/logger';

// ---------------------------------------------------------------------------
// Client singleton
// ---------------------------------------------------------------------------

let _razorpayClient: Razorpay | null = null;

function getRazorpayClient(): Razorpay {
  if (_razorpayClient) return _razorpayClient;

  const { keyId, keySecret } = razorpayConfig;

  if (!keyId || !keySecret) {
    throw new Error(
      'Razorpay credentials are not configured. ' +
        'Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your environment.'
    );
  }

  _razorpayClient = new Razorpay({ key_id: keyId, key_secret: keySecret });
  return _razorpayClient;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CreateOrderParams {
  /** Amount in smallest currency unit (paise for INR) */
  amountPaise: number;
  currency?: string;
  /** Metadata forwarded to webhook notes */
  notes: {
    lockId: string;
    venueId: string;
    userId: string;
  };
}

export interface CreateOrderResult {
  orderId: string;
  amount: number;
  currency: string;
}

export interface IssueRefundResult {
  refundId: string;
}

// ---------------------------------------------------------------------------
// createOrder
// ---------------------------------------------------------------------------

/**
 * Creates a Razorpay Standard Order.
 * Passes lockId, venueId, userId in the `notes` object so they are
 * available in the webhook payload without any additional DB lookup.
 */
export async function createOrder(params: CreateOrderParams): Promise<CreateOrderResult> {
  const client = getRazorpayClient();
  const currency = params.currency ?? 'INR';

  try {
    const order = await client.orders.create({
      amount: params.amountPaise,
      currency,
      notes: {
        lockId: params.notes.lockId,
        venueId: params.notes.venueId,
        userId: params.notes.userId,
      },
    });

    logInfo('Razorpay order created', {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });

    return {
      orderId: order.id,
      amount: typeof order.amount === 'string' ? parseInt(order.amount, 10) : order.amount,
      currency: order.currency,
    };
  } catch (err) {
    const error = err as Error;
    logError('Razorpay order creation failed', {
      module: 'razorpay.service.ts/createOrder',
      error: error.message,
    });
    throw error;
  }
}

// ---------------------------------------------------------------------------
// verifyWebhookSignature
// ---------------------------------------------------------------------------

/**
 * Validates the Razorpay webhook HMAC-SHA256 signature.
 *
 * IMPORTANT: `rawBody` must be the raw Buffer from `express.raw()`.
 * If the body has been parsed by express.json() the bytes will differ
 * from what Razorpay signed and every request will be rejected.
 *
 * Uses `timingSafeEqual` to prevent timing-oracle attacks.
 *
 * @returns true if the signature is valid, false otherwise.
 */
export function verifyWebhookSignature(rawBody: Buffer, signature: string): boolean {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET ?? razorpayConfig.webhookSecret;

  if (!webhookSecret) {
    logError('RAZORPAY_WEBHOOK_SECRET is not configured', {
      module: 'razorpay.service.ts/verifyWebhookSignature',
    });
    return false;
  }

  try {
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
    const receivedBuffer = Buffer.from(signature, 'utf8');

    // Buffers must be the same length for timingSafeEqual
    if (expectedBuffer.length !== receivedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
  } catch (err) {
    logError('Webhook signature verification threw an error', {
      module: 'razorpay.service.ts/verifyWebhookSignature',
      error: (err as Error).message,
    });
    return false;
  }
}

export interface VerifyPaymentParams {
  orderId: string;
  paymentId: string;
  signature: string;
}

export function verifyPaymentSignature(params: VerifyPaymentParams): boolean {
  const { keySecret } = razorpayConfig;

  if (!keySecret) {
    logError('RAZORPAY_KEY_SECRET is not configured', {
      module: 'razorpay.service.ts/verifyPaymentSignature',
    });
    return false;
  }

  try {
    const payload = `${params.orderId}|${params.paymentId}`;
    const expectedSignature = crypto.createHmac('sha256', keySecret).update(payload).digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
    const receivedBuffer = Buffer.from(params.signature, 'utf8');

    if (expectedBuffer.length !== receivedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
  } catch (err) {
    logError('Payment signature verification threw an error', {
      module: 'razorpay.service.ts/verifyPaymentSignature',
      error: (err as Error).message,
    });
    return false;
  }
}

// ---------------------------------------------------------------------------
// issueRefund
// ---------------------------------------------------------------------------

/**
 * Issues a full refund for a captured Razorpay payment.
 *
 * @param paymentId - The Razorpay payment_id from the webhook payload
 * @param amountPaise - The exact amount to refund (paise); must equal the captured amount for full refund
 */
export async function issueRefund(
  paymentId: string,
  amountPaise: number
): Promise<IssueRefundResult> {
  const client = getRazorpayClient();

  try {
    const refund = await client.payments.refund(paymentId, {
      amount: amountPaise,
      speed: 'normal',
      notes: { reason: 'TTL_EXPIRED_COLLISION — slot unavailable at payment time' },
    });

    logInfo('Razorpay refund issued', {
      refundId: refund.id,
      paymentId,
      amount: refund.amount,
    });

    return { refundId: refund.id };
  } catch (err) {
    const error = err as Error;
    logError('Razorpay refund failed', {
      module: 'razorpay.service.ts/issueRefund',
      paymentId,
      error: error.message,
    });
    throw error;
  }
}
