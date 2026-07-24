import venueModel from "../models/venueModel.js";
import parsePagination from "../utils/parsePagination.js";
import { buildSearchRegex } from "../utils/marketplaceUserFilter.js";
import { invalidateActiveVenuesCache, invalidateActiveVenueCache, } from "../utils/cache.js";
import mongoose from "mongoose";

const buildVenueFilter = (query) => {
    const filter = {};

    if (query.isActive !== undefined && query.isActive !== "") {
        if (query.isActive === "true") {
            filter.isActive = true;
        } else if (query.isActive === "false") {
            filter.isActive = false;
        }
    }

    if (query.city?.trim()) {
        filter.city = buildSearchRegex(query.city);
    }

    if (query.ownerId) {
        filter.ownerId = query.ownerId;
    }

    if (query.search?.trim()) {
        const searchRegex = buildSearchRegex(query.search);
        filter.$or = [
            { title: searchRegex },
            { city: searchRegex },
            { address: searchRegex },
        ];
    }

    return filter;
};

const getVenues = async (req, res) => {
    try {
        const { page, limit, skip } = parsePagination(req.query);
        const filter = buildVenueFilter(req.query);

        const [venues, count] = await Promise.all([
            venueModel
                .find(filter)
                .populate("ownerId", "name email profileImage")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            venueModel.countDocuments(filter),
        ]);

        return res.status(200).json({
            success: true,
            message: "Venues fetched successfully",
            count,
            page,
            limit,
            data: venues,
        });
    } catch (error) {
        console.error("Admin get venues error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later.",
        });
    }
};

const getVenueById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid venue ID",
            });
        }

        const venue = await venueModel
            .findById(id)
            .populate("ownerId", "name email profileImage phone");

        if (!venue) {
            return res.status(404).json({
                success: false,
                message: "Venue not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Venue fetched successfully",
            data: venue,
        });
    } catch (error) {
        console.error("Admin get venue by id error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later.",
        });
    }
};

const activateVenue = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid venue ID",
            });
        }

        const venue = await venueModel.findById(id);

        if (!venue) {
            return res.status(404).json({
                success: false,
                message: "Venue not found",
            });
        }

        venue.isActive = true;
        await venue.save();

        await invalidateActiveVenuesCache();
        await invalidateActiveVenueCache(id);

        return res.status(200).json({
            success: true,
            message: "Venue activated successfully",
            data: venue,
        });
    } catch (error) {
        console.error("Admin activate venue error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later.",
        });
    }
};

const deactivateVenue = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid venue ID",
            });
        }

        const venue = await venueModel.findById(id);

        if (!venue) {
            return res.status(404).json({
                success: false,
                message: "Venue not found",
            });
        }

        venue.isActive = false;
        await venue.save();

        await invalidateActiveVenuesCache();
        await invalidateActiveVenueCache(id);

        return res.status(200).json({
            success: true,
            message: "Venue deactivated successfully",
            data: venue,
        });
    } catch (error) {
        console.error("Admin deactivate venue error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later.",
        });
    }
};

export { getVenues, getVenueById, activateVenue, deactivateVenue };
