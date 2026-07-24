import userModel from "../models/userModel.js";
import venueModel from "../models/venueModel.js";
import bookingModel from "../models/bookingModel.js";
import sanitizeUser from "../utils/sanitizeUser.js";
import { MARKETPLACE_USER_FILTER, withMarketplaceUserFilter } from "../utils/marketplaceUserFilter.js";

const RECENT_LIMIT = 5;

const getDashboardStats = async (req, res) => {
    try {
        const [
            totalUsers,
            totalProviders,
            totalVenues,
            activeVenues,
            confirmedPaidBookings,
            revenueResult,
        ] = await Promise.all([
            userModel.countDocuments(MARKETPLACE_USER_FILTER),
            userModel.countDocuments(withMarketplaceUserFilter({ roles: "provider" })),
            venueModel.countDocuments(),
            venueModel.countDocuments({ isActive: true }),
            bookingModel.countDocuments({
                bookingStatus: "confirmed",
                paymentStatus: "paid",
            }),
            bookingModel.aggregate([
                {
                    $match: {
                        bookingStatus: "confirmed",
                        paymentStatus: "paid",
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: "$amount" },
                    },
                },
            ]),
        ]);

        const totalRevenue = revenueResult[0]?.totalRevenue ?? 0;

        return res.status(200).json({
            success: true,
            message: "Dashboard stats fetched successfully",
            data: {
                totalUsers,
                totalProviders,
                totalVenues,
                activeVenues,
                confirmedPaidBookings,
                totalRevenue,
            },
        });
    } catch (error) {
        console.error("Admin dashboard stats error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later.",
        });
    }
};

const getRecentActivity = async (req, res) => {
    try {
        const [users, venues, bookings] = await Promise.all([
            userModel
                .find(MARKETPLACE_USER_FILTER)
                .select("-password -otp -otpExpiresAt")
                .sort({ createdAt: -1 })
                .limit(RECENT_LIMIT),
            venueModel
                .find()
                .populate("ownerId", "name email profileImage")
                .sort({ createdAt: -1 })
                .limit(RECENT_LIMIT),
            bookingModel
                .find()
                .populate("userId", "name email")
                .populate("venueId", "title city")
                .sort({ createdAt: -1 })
                .limit(RECENT_LIMIT),
        ]);

        return res.status(200).json({
            success: true,
            message: "Recent activity fetched successfully",
            data: {
                users: users.map(sanitizeUser),
                venues,
                bookings,
            },
        });
    } catch (error) {
        console.error("Admin recent activity error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later.",
        });
    }
};

export { getDashboardStats, getRecentActivity };
