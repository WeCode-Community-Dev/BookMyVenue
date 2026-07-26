/**
 * webhook.router.ts
 *
 * CRITICAL: This router applies `express.raw({ type: 'application/json' })`
 * as route-level middleware on the Razorpay webhook endpoint.
 *
 * This MUST be registered in server.ts BEFORE the global `express.json()`
 * middleware. Express matches routes in registration order — if express.json()
 * runs first, it consumes the stream and the raw Buffer is lost, breaking
 * the HMAC signature verification.
 *
 * The route has NO auth middleware. Razorpay sends webhooks from their servers;
 * the HMAC-SHA256 signature check in the controller IS the authentication.
 */

import express, { Router } from 'express';
import { handleRazorpayWebhook } from './webhook.controller';

const router: Router = Router();

/**
 * @openapi
 * /webhook/razorpay:
 *   post:
 *     tags: [Webhooks]
 *     summary: Receive a Razorpay payment event
 *     description: |
 *       Ingests Razorpay webhook payloads and verifies the HMAC-SHA256 signature.
 *       **No JWT auth** — Razorpay server-to-server calls are authenticated by the
 *       `x-razorpay-signature` header and the shared webhook secret.
 *       This route must receive the **raw request body** (not parsed JSON) so the
 *       HMAC can be computed correctly.
 *     parameters:
 *       - in: header
 *         name: x-razorpay-signature
 *         required: true
 *         schema:
 *           type: string
 *         description: HMAC-SHA256 signature computed by Razorpay over the raw payload
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Raw Razorpay webhook event payload
 *             properties:
 *               event:
 *                 type: string
 *                 example: payment.captured
 *               payload:
 *                 type: object
 *     responses:
 *       200:
 *         description: Webhook received and processed
 *       400:
 *         description: Invalid or missing HMAC signature
 *       500:
 *         description: Internal error while processing the event
 */
router.route('/razorpay').post(
  // Capture raw bytes BEFORE any JSON parsing
  express.raw({ type: 'application/json' }),
  handleRazorpayWebhook
);

export { router as webhookRouter };
