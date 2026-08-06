import type { Response } from "express";
import {pool} from "../config/db.js";
import type { AuthRequest } from "../middleware/authMiddleware.js";

export const getAdminDashboardSummary = async (
    req : AuthRequest,
    res : Response
): Promise<void> => {
    try{

        //Count users by role
        const userResult = await pool.query(
            `
            SELECT
            COUNT(*) FILTER (WHERE role ='customer')::int AS total_customers,
            COUNT(*) FILTER (WHERE role ='owner')::int AS total_owners,
            COUNT(*) FILTER (WHERE role ='root_admin')::int AS total_root_admins
            FROM users
            `
        );

        //Count venues by approval status
        const venueResult = await pool.query(
            `
            SELECT
                COUNT(*)::int AS total_venues,
                COUNT(*) FILTER(WHERE approval_status = 'pending')::int AS pending_venues,
                COUNT(*) FILTER(WHERE approval_status = 'approved')::int AS approved_venues,
                COUNT(*) FILTER(WHERE approval_status = 'rejected')::int AS rejected_venues,
                COUNT(*) FILTER(WHERE is_active =true)::int AS active_venues
                FROM venues
            `
        );

          // Count bookings by booking status.
        const bookingsResult = await pool.query(
           `
            SELECT
                COUNT(*)::int AS total_bookings,
                COUNT(*) FILTER (WHERE booking_status = 'pending_payment')::int AS pending_payment_bookings,
                COUNT(*) FILTER (WHERE booking_status = 'confirmed')::int AS confirmed_bookings,
                COUNT(*) FILTER (WHERE booking_status = 'cancelled')::int AS cancelled_bookings,
                COUNT(*) FILTER (WHERE booking_status = 'failed')::int AS failed_bookings
            FROM bookings
        `
        );

        // Count payments and calculate successful revenue.
        const paymentsResult = await pool.query(
           `
            SELECT
                COUNT(*)::int AS total_payments,
                COUNT(*) FILTER (WHERE payment_status = 'pending')::int AS pending_payments,
                COUNT(*) FILTER (WHERE payment_status = 'success')::int AS successful_payments,
                COUNT(*) FILTER (WHERE payment_status = 'failed')::int AS failed_payments,
                COUNT(*) FILTER (WHERE payment_status = 'refunded')::int AS refunded_payments,
                COALESCE(SUM(amount) FILTER (WHERE payment_status = 'success'), 0)::numeric(10, 2) AS total_revenue
            FROM payments
           `
        );

            // Recent bookings for admin dashboard preview.
        const recentBookingsResult = await pool.query(
         `
            SELECT
                b.id AS booking_id,
                b.booking_date,
                b.start_time,
                b.end_time,
                b.total_amount,
                b.booking_status,

                v.name AS venue_name,
                v.city AS venue_city,

                customer.name AS customer_name,
                owner.name AS owner_name,

                p.payment_status
                FROM bookings b
                JOIN venues v ON v.id = b.venue_id
                JOIN users customer ON customer.id = b.customer_id
                JOIN users owner ON owner.id = v.owner_id
                LEFT JOIN payments p ON p.booking_id = b.id
                ORDER BY b.created_at DESC
                LIMIT 5
         `
        );

        res.status(200).json({
            message :"Admin dashboard fetched successfully",
            summary : {
                users : userResult.rows[0],
                venues : venueResult.rows[0],
                bookings : bookingsResult.rows[0],
                payments : paymentsResult.rows[0],
                recent_bookings : recentBookingsResult.rows,
            },
        });
    }catch(error){
        console.error("Get admin dashboard summary error",error);

        res.status(500).json({
            message : "Something went wrong while fetching admin dashboard summary",
        });
    }
};


export const getOwnerDashboardSummary = async (
    req : AuthRequest,
    res : Response
): Promise<void> => {

    const ownerId = req.user?.id;

    if(!ownerId){
        res.status(401).json({
            message:"unauthorized.please login",
        });
        return;
    }

    try{

        //Count this owner's venues.
        const venuesResult = await pool.query(
            `
            SELECT
                COUNT(*)::int AS total_venues,
                COUNT(*) FILTER (WHERE approval_status = 'pending')::int AS pending_venues,
                COUNT(*) FILTER (WHERE approval_status = 'approved')::int AS approved_venues,
                COUNT(*) FILTER (WHERE approval_status = 'rejected')::int AS rejected_venues,
                COUNT(*) FILTER (WHERE is_active = true)::int AS active_venues
            FROM venues
            WHERE owner_id = $1
            `,
        [ownerId]
        );

        // Count bookings for this owner's venues.
        const bookingsResult = await pool.query(
        `
        SELECT
            COUNT(*)::int AS total_bookings,
            COUNT(*) FILTER (WHERE b.booking_status = 'pending_payment')::int AS pending_payment_bookings,
            COUNT(*) FILTER (WHERE b.booking_status = 'confirmed')::int AS confirmed_bookings,
            COUNT(*) FILTER (WHERE b.booking_status = 'cancelled')::int AS cancelled_bookings,
            COUNT(*) FILTER (WHERE b.booking_status = 'failed')::int AS failed_bookings
        FROM bookings b
        JOIN venues v ON v.id = b.venue_id
        WHERE v.owner_id = $1
        `,
      [ownerId]
    );

    // Calculate revenue from successful payments for this owner's venues.
    const revenueResult = await pool.query(
      `
      SELECT
        COALESCE(SUM(p.amount) FILTER (WHERE p.payment_status = 'success'), 0)::numeric(10, 2) AS total_revenue,
        COUNT(*) FILTER (WHERE p.payment_status = 'success')::int AS successful_payments,
        COUNT(*) FILTER (WHERE p.payment_status = 'refunded')::int AS refunded_payments
      FROM payments p
      JOIN bookings b ON b.id = p.booking_id
      JOIN venues v ON v.id = b.venue_id
      WHERE v.owner_id = $1
      `,
      [ownerId]
    );

    // Recent bookings for this owner's venues.
    const recentBookingsResult = await pool.query(
      `
      SELECT
        b.id AS booking_id,
        b.booking_date,
        b.start_time,
        b.end_time,
        b.total_amount,
        b.booking_status,

        v.id AS venue_id,
        v.name AS venue_name,
        v.city AS venue_city,

        customer.name AS customer_name,
        customer.email AS customer_email,

        p.payment_status
      FROM bookings b
      JOIN venues v ON v.id = b.venue_id
      JOIN users customer ON customer.id = b.customer_id
      LEFT JOIN payments p ON p.booking_id = b.id
      WHERE v.owner_id = $1
      ORDER BY b.created_at DESC
      LIMIT 5
      `,
      [ownerId]
    );

    res.status(200).json({
      message: "Owner dashboard summary fetched successfully.",
      summary: {
        venues: venuesResult.rows[0],
        bookings: bookingsResult.rows[0],
        revenue: revenueResult.rows[0],
        recent_bookings: recentBookingsResult.rows,
      },
    });

    }catch(error){
         console.error("Get owner dashboard summary error:", error);

        res.status(500).json({
            message: "Something went wrong while fetching owner dashboard summary.",
        });
    }
};
