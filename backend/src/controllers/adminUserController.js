import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import venueModel from "../models/venueModel.js";
import bookingModel from "../models/bookingModel.js";
import parsePagination from "../utils/parsePagination.js";
import sanitizeUser from "../utils/sanitizeUser.js";
import {
    withMarketplaceUserFilter,
    isPlatformOperator,
    buildSearchRegex,
} from "../utils/marketplaceUserFilter.js";

const OPERATOR_ACCOUNT_MESSAGE =
    "Platform operator accounts cannot be managed here";

const buildUserFilter = (query) => {
    const filter = {};

    if (query.role) {
        filter.roles = query.role;
    }

    if (query.isActive !== undefined && query.isActive !== "") {
        if (query.isActive === "true") {
            filter.isActive = true;
        } else if (query.isActive === "false") {
            filter.isActive = false;
        }
    }

    if (query.search?.trim()) {
        const searchRegex = buildSearchRegex(query.search);
        filter.$or = [
            { name: searchRegex },
            { email: searchRegex },
            { phone: searchRegex },
        ];
    }

    return withMarketplaceUserFilter(filter);
};

const getUsers = async (req, res) => {
    try {
        const { page, limit, skip } = parsePagination(req.query);
        const filter = buildUserFilter(req.query);

        const [users, count] = await Promise.all([
            userModel
                .find(filter)
                .select("-password -otp -otpExpiresAt")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            userModel.countDocuments(filter),
        ]);

        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            count,
            page,
            limit,
            data: users.map(sanitizeUser),
        });
    } catch (error) {
        console.error("Admin get users error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later.",
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }

        const user = await userModel
            .findOne(withMarketplaceUserFilter({ _id: id }))
            .select("-password -otp -otpExpiresAt");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const [bookingCount, venueCount] = await Promise.all([
            bookingModel.countDocuments({ userId: user._id }),
            venueModel.countDocuments({ ownerId: user._id }),
        ]);

        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: {
                user: sanitizeUser(user),
                bookingCount,
                venueCount,
            },
        });
    } catch (error) {
        console.error("Admin get user by id error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later.",
        });
    }
};

const activateUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }
        const user = await userModel.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (isPlatformOperator(user)) {
            return res.status(400).json({
                success: false,
                message: OPERATOR_ACCOUNT_MESSAGE,
            });
        }

        user.isActive = true;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "User activated successfully",
            data: sanitizeUser(user),
        });
    } catch (error) {
        console.error("Admin activate user error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later.",
        });
    }
};

const deactivateUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }

        if (req.user._id.toString() === id) {
            return res.status(400).json({
                success: false,
                message: "You cannot deactivate your own account",
            });
        }

        const user = await userModel.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (isPlatformOperator(user)) {
            return res.status(400).json({
                success: false,
                message: OPERATOR_ACCOUNT_MESSAGE,
            });
        }

        user.isActive = false;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "User deactivated successfully",
            data: sanitizeUser(user),
        });
    } catch (error) {
        console.error("Admin deactivate user error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later.",
        });
    }
};

export { getUsers, getUserById, activateUser, deactivateUser };
