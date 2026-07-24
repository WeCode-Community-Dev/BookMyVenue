import bookingModel from "../models/bookingModel.js";
import parsePagination from "../utils/parsePagination.js";
import mongoose from "mongoose";

const buildBookingFilter = (query) => {
    const filter = {};

    if (query.bookingStatus) {
        filter.bookingStatus = query.bookingStatus;
    }

    if (query.paymentStatus) {
        filter.paymentStatus = query.paymentStatus;
    }

    if (query.venueId) {
        filter.venueId = query.venueId;
    }

    if (query.userId) {
        filter.userId = query.userId;
    }

    return filter;
};

const getBookings = async (req, res) => {
    try {
        const { page, limit, skip } = parsePagination(req.query);
        const filter = buildBookingFilter(req.query);

        const [bookings, count] = await Promise.all([
            bookingModel
                .find(filter)
                .populate("userId", "name email phone")
                .populate("venueId", "title city coverImage")
                .populate("availabilityId")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            bookingModel.countDocuments(filter),
        ]);

        return res.status(200).json({
            success: true,
            message: "Bookings fetched successfully",
            count,
            page,
            limit,
            data: bookings,
        });
    } catch (error) {
        console.error("Admin get bookings error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later.",
        });
    }
};

const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking ID",
            });
        }

        const booking = await bookingModel
            .findById(id)
            .populate("userId", "name email phone profileImage")
            .populate("venueId")
            .populate("availabilityId");

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Booking fetched successfully",
            data: booking,
        });
    } catch (error) {
        console.error("Admin get booking by id error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later.",
        });
    }
};

export { getBookings, getBookingById };
