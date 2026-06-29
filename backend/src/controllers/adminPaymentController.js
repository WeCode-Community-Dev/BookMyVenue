import paymentOrderModel from "../models/paymentOrderModel.js";
import bookingModel from "../models/bookingModel.js";
import parsePagination from "../utils/parsePagination.js";

const getPaymentOrders = async (req, res) => {
    try {
        const { page, limit, skip } = parsePagination(req.query);
        const filter = {};

        if (req.query.status) {
            filter.status = req.query.status;
        }

        const [orders, count] = await Promise.all([
            paymentOrderModel
                .find(filter)
                .populate("userId", "name email")
                .populate("venueId", "title city")
                .populate("availabilityId", "date slotLabel startTime endTime")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            paymentOrderModel.countDocuments(filter),
        ]);

        return res.status(200).json({
            success: true,
            message: "Payment orders fetched successfully",
            count,
            page,
            limit,
            data: orders,
        });
    } catch (error) {
        console.error("Admin get payment orders error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getPaymentHistory = async (req, res) => {
    try {
        const { page, limit, skip } = parsePagination(req.query);

        const filter = { paymentStatus: "paid" };

        const [bookings, count] = await Promise.all([
            bookingModel
                .find(filter)
                .select(
                    "paymentId razorpayOrderId amount paymentStatus bookingReference bookingStatus bookedAt createdAt userId venueId availabilityId"
                )
                .populate("userId", "name email phone")
                .populate("venueId", "title city")
                .populate("availabilityId", "date slotLabel startTime endTime")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            bookingModel.countDocuments(filter),
        ]);

        return res.status(200).json({
            success: true,
            message: "Payment history fetched successfully",
            count,
            page,
            limit,
            data: bookings,
        });
    } catch (error) {
        console.error("Admin get payment history error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getAbandonedPayments = async (req, res) => {
    try {
        const { page, limit, skip } = parsePagination(req.query);

        let hours = parseInt(req.query.hours, 10);
        if (Number.isNaN(hours) || hours < 1) {
            hours = 24;
        }

        const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);

        const filter = {
            status: "created",
            createdAt: { $lt: cutoff },
        };

        const [orders, count] = await Promise.all([
            paymentOrderModel
                .find(filter)
                .populate("userId", "name email")
                .populate("venueId", "title city")
                .populate("availabilityId", "date slotLabel startTime endTime")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            paymentOrderModel.countDocuments(filter),
        ]);

        return res.status(200).json({
            success: true,
            message: "Abandoned payment orders fetched successfully",
            count,
            page,
            limit,
            hours,
            data: orders,
        });
    } catch (error) {
        console.error("Admin get abandoned payments error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export { getPaymentOrders, getPaymentHistory, getAbandonedPayments };
