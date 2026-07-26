import type { Request, Response } from 'express';
import { logError, logWarn } from '../../utils/logger';
import { verifyWebhookSignature } from '../../services/razorpay.service';
import { processCapturedPayment } from '../booking/booking.service';
import type { RazorpayWebhookPayload } from './webhook.types';

// Handles incoming Razorpay webhook events
export const handleRazorpayWebhook = async (req: Request, res: Response): Promise<void> => {
  const rawBody = req.body as Buffer;
  const signature = req.headers['x-razorpay-signature'];

  if (!signature || typeof signature !== 'string') {
    logWarn('Razorpay webhook received without signature header', {
      module: 'webhook.controller.ts/handleRazorpayWebhook',
    });
    res.status(200).json({ received: false, error: 'Missing x-razorpay-signature header' });
    return;
  }

  const isValid = verifyWebhookSignature(rawBody, signature);

  if (!isValid) {
    logWarn('Razorpay webhook signature verification failed — rejecting', {
      module: 'webhook.controller.ts/handleRazorpayWebhook',
    });
    res.status(200).json({ received: false, error: 'Invalid webhook signature' });
    return;
  }

  let webhookData: RazorpayWebhookPayload;

  try {
    webhookData = JSON.parse(rawBody.toString('utf8')) as RazorpayWebhookPayload;
  } catch (err) {
    logError('Failed to parse webhook body as JSON', {
      module: 'webhook.controller.ts/handleRazorpayWebhook',
      error: (err as Error).message,
    });
    res.status(400).json({ error: 'Invalid JSON payload' });
    return;
  }

  // Only process payment.captured events. Return 200 for other events to acknowledge.
  if (webhookData.event !== 'payment.captured') {
    res.status(200).json({ received: true });
    return;
  }

  const payment = webhookData.payload?.payment?.entity;

  if (!payment) {
    logWarn('Webhook payment.captured payload missing entity', {
      module: 'webhook.controller.ts/handleRazorpayWebhook',
    });
    res.status(200).json({ received: true });
    return;
  }

  // Process the captured payment in the booking service
  const result = await processCapturedPayment(
    payment.id,
    payment.amount,
    payment.notes,
    payment.method
  );

  if (!result.success) {
    res.status(200).json({ received: true, error: result.error });
    return;
  }

  res.status(200).json({ received: true, idempotent: result.isDuplicate });
};
