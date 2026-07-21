import type { Response } from "express";
import { pool } from "../config/db.js";
import type { AuthRequest } from "../middleware/authMiddleware.js";

export const dummyPaymentSuccess = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const customerId = req.user?.id;

  if (!customerId) {
    res.status(401).json({
      message: "Unauthorized. Please login first.",
    });
    return;
  }

  const { booking_id } = req.body;

  if (!booking_id) {
    res.status(400).json({
      message: "booking_id is required.",
    });
    return;
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const bookingResult = await client.query(
      `
        SELECT
        b.id AS booking_id,
        b.customer_id,
        b.booking_status,
        b.total_amount,
        b.created_at,
        b.created_at < NOW() - INTERVAL '15 minutes' AS is_expired,

        p.id AS payment_id,
        p.payment_status
    FROM bookings b
    JOIN payments p ON p.booking_id = b.id
    WHERE b.id = $1
        AND b.customer_id = $2
    FOR UPDATE OF b, p
      `,
      [booking_id, customerId]
    );

    if (bookingResult.rows.length === 0) {
      await client.query("ROLLBACK");

      res.status(404).json({
        message: "Booking not found for this customer.",
      });
      return;
    }

    const booking = bookingResult.rows[0];

    if (booking.booking_status === "pending_payment" && booking.is_expired) {
      await client.query(
        `
        UPDATE bookings
        SET
          booking_status = 'failed',
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        `,
        [booking.booking_id]
      );

      await client.query(
        `
        UPDATE payments
        SET
          payment_status = 'failed',
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        `,
        [booking.payment_id]
      );

      await client.query("COMMIT");

      res.status(400).json({
        message: "Payment time expired. Please create a new booking.",
      });
      return;
    }

    if (booking.booking_status !== "pending_payment") {
      await client.query("ROLLBACK");

      res.status(400).json({
        message: "Only pending payment bookings can be paid.",
      });
      return;
    }

    if (booking.payment_status !== "pending") {
      await client.query("ROLLBACK");

      res.status(400).json({
        message: "Payment is not pending for this booking.",
      });
      return;
    }

    const dummyPaymentId = `dummy_razorpay_${Date.now()}`;

    const paymentResult = await client.query(
      `
      UPDATE payments
      SET
        payment_status = 'success',
        dummy_payment_id = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
      `,
      [dummyPaymentId, booking.payment_id]
    );

    const updatedBookingResult = await client.query(
      `
      UPDATE bookings
      SET
        booking_status = 'confirmed',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
      `,
      [booking.booking_id]
    );

    await client.query("COMMIT");

    res.status(200).json({
      message: "Dummy payment successful. Booking confirmed.",
      booking: updatedBookingResult.rows[0],
      payment: paymentResult.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Dummy payment success error:", error);

    res.status(500).json({
      message: "Something went wrong while completing payment.",
    });
  } finally {
    client.release();
  }
};