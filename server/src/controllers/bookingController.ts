import type { Response } from "express";
import { pool } from "../config/db.js";
import type { AuthRequest } from "../middleware/authMiddleware.js";

export const createBooking = async (
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

  const { venue_id, booking_date, start_time, end_time } = req.body;

  if (!venue_id || !booking_date || !start_time || !end_time) {
    res.status(400).json({
      message: "venue_id, booking_date, start_time, and end_time are required.",
    });
    return;
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

  if (!dateRegex.test(booking_date)) {
    res.status(400).json({
      message: "booking_date must be in YYYY-MM-DD format.",
    });
    return;
  }

  if (!timeRegex.test(start_time) || !timeRegex.test(end_time)) {
    res.status(400).json({
      message: "start_time and end_time must be in HH:MM format.",
    });
    return;
  }

  if (start_time >= end_time) {
    res.status(400).json({
      message: "end_time must be after start_time.",
    });
    return;
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const venueResult = await client.query(
      `
      SELECT id, name, base_price, approval_status, is_active
      FROM venues
      WHERE id = $1
      `,
      [venue_id]
    );

    if (venueResult.rows.length === 0) {
      await client.query("ROLLBACK");

      res.status(404).json({
        message: "Venue not found.",
      });
      return;
    }

    const venue = venueResult.rows[0];

    if (venue.approval_status !== "approved") {
      await client.query("ROLLBACK");

      res.status(400).json({
        message: "This venue is not approved yet. You cannot book it.",
      });
      return;
    }

    if (!venue.is_active) {
      await client.query("ROLLBACK");

      res.status(400).json({
        message: "This venue is currently inactive. You cannot book it.",
      });
      return;
    }

    const conflictResult = await client.query(
      `
      SELECT id, start_time, end_time, booking_status
      FROM bookings
      WHERE venue_id = $1
        AND booking_date = $2
        AND booking_status IN ('pending_payment', 'confirmed')
        AND start_time < $4::time
        AND end_time > $3::time
      LIMIT 1
      `,
      [venue_id, booking_date, start_time, end_time]
    );

    if (conflictResult.rows.length > 0) {
      await client.query("ROLLBACK");

      res.status(409).json({
        message: "This venue is already booked for the selected date and time.",
        conflict: conflictResult.rows[0],
      });
      return;
    }

    const totalAmount = venue.base_price;

    const bookingResult = await client.query(
      `
      INSERT INTO bookings (
        customer_id,
        venue_id,
        booking_date,
        start_time,
        end_time,
        total_amount,
        booking_status
      )
      VALUES ($1, $2, $3, $4, $5, $6, 'pending_payment')
      RETURNING *
      `,
      [customerId, venue_id, booking_date, start_time, end_time, totalAmount]
    );

    const booking = bookingResult.rows[0];

    const paymentResult = await client.query(
      `
      INSERT INTO payments (
        booking_id,
        payment_provider,
        amount,
        payment_status
      )
      VALUES ($1, 'razorpay_dummy', $2, 'pending')
      RETURNING *
      `,
      [booking.id, totalAmount]
    );

    await client.query("COMMIT");

    res.status(201).json({
      message: "Booking created successfully. Payment is pending.",
      booking,
      payment: paymentResult.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Create booking error:", error);

    res.status(500).json({
      message: "Something went wrong while creating booking.",
    });
  } finally {
    client.release();
  }
};

export const getMyBookings = async (
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

  try {
    const result = await pool.query(
      `
      SELECT
        b.id AS booking_id,
        b.booking_date,
        b.start_time,
        b.end_time,
        b.total_amount,
        b.booking_status,
        b.created_at,

        v.id AS venue_id,
        v.name AS venue_name,
        v.category,
        v.address,
        v.city,

        p.id AS payment_id,
        p.payment_provider,
        p.amount AS payment_amount,
        p.payment_status,
        p.dummy_payment_id
      FROM bookings b
      JOIN venues v ON v.id = b.venue_id
      LEFT JOIN payments p ON p.booking_id = b.id
      WHERE b.customer_id = $1
      ORDER BY b.created_at DESC
      `,
      [customerId]
    );

    res.status(200).json({
      message: "My bookings fetched successfully.",
      bookings: result.rows,
    });
  } catch (error) {
    console.error("Get my bookings error:", error);

    res.status(500).json({
      message: "Something went wrong while fetching bookings.",
    });
  }
};


export const getOwnerVenueBookings = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {

    const ownerId = req.user?.id;

    if(!ownerId){
        res.status(401).json({
            message : "Unauthorized.Please login first",

        });
        return;
    }

    try{

        const result = await pool.query(
            `
            SELECT
            b.id AS booking_id,
            b.customer_id,
            b.booking_date,
            b.start_time,
            b.end_time,
            b.total_amount,
            b.booking_status,
            b.created_at,

            v.id AS venue_id,
            v.name AS venue_name,
            v.category,
            v.address,
            v.city,

            p.id AS payment_id,
            p.payment_provider,
            p.payment_status,
            p.dummy_payment_id,

            u.name AS customer_name,
            u.email AS customer_email

            FROM bookings b
            JOIN venues v ON v.id = b.venue_id
            JOIN users u ON u.id = b.customer_id
            LEFT JOIN payments p ON p.booking_id = b.id
            WHERE v.owner_id = $1
            ORDER BY b.booking_date DESC, b.start_time DESC            
            `,
            [ownerId]
        );
        res.status(200).json({
            message : "Owner venue booking fetched successfully",
            count : result.rows.length,
            bookings : result.rows,
        });
    }catch(error){
        console.error("GEt owner venue bookings error",error);

        res.status(500).json({
            message :"something went wrong while fetching owner venue bookings",
        });
    }
};

export const cancelMyBooking = async (
    req : AuthRequest,
    res : Response
):Promise<void> =>{
    const customerId = req.user?.id;

    if(!customerId){
        res.status(401).json({
            message : "Unauthorized. Please login first",
        });
        return;
    }

    const bookingId = Number(req.params.id);

    if(!bookingId || Number.isNaN(bookingId)){
        res.status(400).json({
            message: "Valid booking id required",
        });
        return;
    }

    const client = await pool.connect();

    try{
        await client.query("BEGIN");

        const bookingResult =await client.query(
            `
            SELECT 
            b.id AS booking_id,
            b.customer_id,
            b.booking_status,
            p.id AS payment_id,
            p.payment_status

            FROM bookings b
            LEFT JOIN payments p on p.booking_id=b.id
            WHERE b.id=$1
            AND b.customer_id =$2
            FOR UPDATE OF B
            `,
            [bookingId,customerId]
        );

        if (bookingResult.rows.length ===0 ){
            await client.query("ROLLBACK");

            res.status(404).json({
                message : "Booking not found for this customer",
            });
            return;
        }

        const booking = bookingResult.rows[0];

        if(booking.booking_status ==="cancelled"){
            await client.query("ROLLBACK");

            res.status(400).json({
                message : "This booking is already cancelled",
            });
            return;
        }

        if(booking.booking_status !== "pending_payment" 
            && booking.booking_status !== "confirmed"
        ){
            await client.query("ROLLBACK");

            res.status(400).json({
                message: "Only pending payment and confirmed payment can be cancelled",
            });
            return;
        }

        const updateBookingResult = await client.query(
            `
            UPDATE bookings
            SET
                booking_status ='cancelled',
                updated_at     =CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *
            `,
            [bookingId]
        );

        let updatedPayment = null;

        if(booking.payment_status ==="success"){
            const paymentResult = await client.query(
                `
                UPDATE payments
                SET 
                    payment_status = 'refunded',
                    updated_at     = CURRENT_TIMESTAMP
                WHERE id = $1
                RETURNING *
                `,
                [booking.payment_id]
            );

            updatedPayment = paymentResult.rows[0];
        }

        if (booking.payment_status === "pending"){
            const paymentResult = await client.query(
                `
                UPDATE payments
                SET
                    payment_status ='failed',
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = $1
                RETURNING *
                `,
                [booking.payment_id]
            );

            updatedPayment = paymentResult.rows[0];
        }

        await client.query("COMMIT");

        res.status(200).json({
            message : "Booking deleted successfully",
            booking : updateBookingResult.rows[0],
            payment : updatedPayment,
        });
    }catch(error){

        await client.query("ROLLBACK");

        console.error("Cancel booking error",error);

        res.status(500).json({
            message :"Something went wrong while cancelling booking",
        });
    }finally{
        client.release();
    }
}

export const getAllBookingsForAdmin = async (
    req : AuthRequest,
    res : Response
) : Promise<void> => {

    try{
        const result = await pool.query(
            `
            SELECT 
                b.id AS booking_id,
                b.booking_date,
                b.start_time,
                b.end_time,
                b.total_amount,
                b.booking_status,
                b.created_at,
                b.updated_at,

                customer.id AS customer_id,
                customer.name AS customer_name,
                customer.email As customer_email,

                v.id AS venue_id,
                v.name AS venue_name,
                v.category AS venue_category,
                v.address AS venue_address,
                v.city AS venue_city,

                owner.id AS owner_city,
                owner.name AS owner_name,
                owner.email AS owner_email,

                p.id AS payment_id,
                p.payment_provider,
                p.amount AS payment_amount,
                p.payment_status,
                p.dummy_payment_id

                FROM bookings b
                JOIN users customer ON customer.id = b.customer_id
                JOIN venues v on v.id = b.venue_id
                JOIN users owner ON owner.id = v.owner_id
                LEFT JOIN payments p ON p.booking_id = b.id
                ORDER BY b.created_at DESC
            `,
        );

        res.status(200).json({
            message: "All bookings fetched success",
            count : result.rows.length,
            bookings : result.rows,
        });
    }catch(error){
        console.error("Get all bookings for admin error");

        res.status(500).json({
            message : "something went wrong while fetching all bookings",
        });
    }
};

export const getBookingDetailsForAdmin = async (
    req : AuthRequest,
    res : Response
): Promise<void> => {

    const bookingId = Number(req.params.id);

    if(!bookingId || Number.isNaN(bookingId)){
        res.status(400).json({
            message : "Valid booking id is required",
        });
        return;
    }

    try{
        const result = await pool.query(
        `
        SELECT
        b.id AS booking_id,
        b.booking_date,
        b.start_time,
        b.end_time,
        b.total_amount,
        b.booking_status,
        b.created_at,
        b.updated_at,

        customer.id AS customer_id,
        customer.name AS customer_name,
        customer.email AS customer_email,
        customer.status AS customer_status,

        v.id AS venue_id,
        v.name AS venue_name,
        v.category AS venue_category,
        v.description AS venue_description,
        v.address AS venue_address,
        v.city AS venue_city,
        v.capacity AS venue_capacity,
        v.base_price AS venue_base_price,
        v.approval_status AS venue_approval_status,
        v.is_active AS venue_is_active,

        owner.id AS owner_id,
        owner.name AS owner_name,
        owner.email AS owner_email,
        owner.status AS owner_status,

        p.id AS payment_id,
        p.payment_provider,
        p.amount AS payment_amount,
        p.payment_status,
        p.dummy_payment_id,
        p.created_at AS payment_created_at,
        p.updated_at AS payment_updated_at
        FROM bookings b
        JOIN users customer ON customer.id = b.customer_id
        JOIN venues v ON v.id = b.venue_id
        JOIN users owner ON owner.id = v.owner_id
        LEFT JOIN payments p ON p.booking_id = b.id
        WHERE b.id = $1
        `,
        [bookingId]
        );

        if (result.rows.length === 0){
            res.status(404).json({
                message : "booking not found",
            });
            return;
        }

        res.status(200).json({
            message : "Booking details fetched successfully",
            booking : result.rows[0],
        }); 

    }catch (error){
        console.error("Get booking for admin error", error);

        res.status(500).json({
            message : "Something went wrong while fetching booking succesfully",
        });
    }
};

