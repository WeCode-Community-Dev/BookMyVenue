import venueModel from "../models/venueModel.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";
import { resolveVenueCategory } from "../utils/venueCategory.js";
import { getCache, setCache, getActiveVenueCacheKey, invalidateActiveVenuesCache, invalidateActiveVenueCache, ACTIVE_VENUES_CACHE_KEY, ACTIVE_VENUES_CACHE_TTL, } from "../utils/cache.js";
import mongoose from "mongoose";


const parseJsonArrayField = (value, fieldName) => {
    if (!value) {
        return { data: [] };
    }

    try {
        const parsed = JSON.parse(value);

        if (!Array.isArray(parsed)) {
            return {
                error: `Invalid ${fieldName}. Expected a JSON array.`,
            };
        }

        return { data: parsed };
    } catch {
        return {
            error: `Invalid ${fieldName}. Please provide valid JSON.`,
        };
    }
};

//provider creates venue
const createVenue = async (req, res) => {
    const uploadedImages = [];

    try {
        const {
            title,
            description,
            category,
            venueType,
            indoorOutdoor,
            price,
            pricingUnit,
            capacity,
            amenities,
            rules,
            address,
            city,
            state,
            pincode,
            latitude,
            longitude,
        } = req.body;

        if (
            !title ||
            !description ||
            !category ||
            !price ||
            !capacity ||
            !address
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields.",
            });
        }

        // Validate numeric fields
        const parsedPrice = Number(price);
        const parsedCapacity = Number(capacity);

        if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid price.",
            });
        }

        if (Number.isNaN(parsedCapacity) || parsedCapacity <= 0 || !Number.isInteger(parsedCapacity)) {
            return res.status(400).json({
                success: false,
                message: "Invalid capacity.",
            });
        }

        let parsedLatitude;
        let parsedLongitude;

        if (latitude !== undefined && latitude !== "") {
            parsedLatitude = Number(latitude);

            if (
                Number.isNaN(parsedLatitude) ||
                parsedLatitude < -90 ||
                parsedLatitude > 90
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid latitude.",
                });
            }
        }

        if (longitude !== undefined && longitude !== "") {
            parsedLongitude = Number(longitude);

            if (
                Number.isNaN(parsedLongitude) ||
                parsedLongitude < -180 ||
                parsedLongitude > 180
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid longitude.",
                });
            }
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please upload at least one image.",
            });
        }

        // Upload images
        for (const file of req.files) {
            const result = await uploadToCloudinary(file.buffer);

            uploadedImages.push({
                url: result.secure_url,
                public_id: result.public_id,
            });
        }

        const parsedAmenities = parseJsonArrayField(
            amenities,
            "amenities"
        );

        if (parsedAmenities.error) {
            return res.status(400).json({
                success: false,
                message: parsedAmenities.error,
            });
        }

        const parsedRules = parseJsonArrayField(
            rules,
            "rules"
        );

        if (parsedRules.error) {
            return res.status(400).json({
                success: false,
                message: parsedRules.error,
            });
        }

        const normalizedCategory = resolveVenueCategory(category);

        if (!normalizedCategory) {
            return res.status(400).json({
                success: false,
                message: "Invalid venue category.",
            });
        }

        const venuePayload = {
            ownerId: req.user._id,
            title,
            description,
            category: normalizedCategory,
            venueType,
            indoorOutdoor,
            price: parsedPrice,
            capacity: parsedCapacity,
            amenities: parsedAmenities.data,
            rules: parsedRules.data,
            address,
            city,
            state,
            pincode,
            location: {
                latitude: parsedLatitude,
                longitude: parsedLongitude,
            },
            images: uploadedImages,
            coverImage: uploadedImages[0],
        };

        if (pricingUnit !== undefined && pricingUnit !== "") {
            venuePayload.pricingUnit = pricingUnit;
        }

        const venue = await venueModel.create(venuePayload);

        await invalidateActiveVenuesCache();

        return res.status(201).json({
            success: true,
            message: "Venue created successfully.",
            data: venue,
        });
    } catch (error) {
        console.error("Create venue error:", error);

        // delete uploaded images from cloudinary if error occurs
        for (const image of uploadedImages) {
            try {
                await deleteFromCloudinary(image.public_id);
            } catch (cleanupError) {
                console.error(
                    "Cloudinary cleanup failed:",
                    cleanupError
                );
            }
        }

        return res.status(500).json({
            success: false,
            message: "Failed to create venue. Please try again.",
        });
    }
};

//fetch owners all venues

const getMyVenues = async (req, res) => {
    try {
        const venues = await venueModel.find({ ownerId: req.user._id })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: venues,
            count: venues.length,
        });
    } catch (error) {
        console.error("Error fetching my venues:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

//show details of a venue for provider

const getVenueById = async (req, res) => {
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
                message: "Venue not found.",
            });
        }

        if (venue.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Access denied.",
            });
        }

        return res.status(200).json({
            success: true,
            data: venue,
        });
    } catch (error) {
        console.error("Error fetching venue details:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later.",
        });
    }
};

//update my-venue

const updateVenue = async (req, res) => {
    const newlyUploadedImages = [];

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

        if (venue.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }

        const {
            title,
            description,
            category,
            venueType,
            indoorOutdoor,
            price,
            pricingUnit,
            capacity,
            amenities,
            rules,
            address,
            city,
            state,
            pincode,
            latitude,
            longitude,
        } = req.body;

        if (title !== undefined) venue.title = title;
        if (description !== undefined) venue.description = description;

        if (category !== undefined) {
            const normalizedCategory = resolveVenueCategory(category);

            if (!normalizedCategory) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid venue category.",
                });
            }

            venue.category = normalizedCategory;
        }
        if (venueType !== undefined) venue.venueType = venueType;
        if (indoorOutdoor !== undefined) venue.indoorOutdoor = indoorOutdoor;
        if (address !== undefined) venue.address = address;
        if (city !== undefined) venue.city = city;
        if (state !== undefined) venue.state = state;
        if (pincode !== undefined) venue.pincode = pincode;

        // Price validation
        if (price !== undefined) {
            const parsedPrice = Number(price);

            if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid price.",
                });
            }

            venue.price = parsedPrice;
        }

        // Capacity validation
        if (capacity !== undefined) {
            const parsedCapacity = Number(capacity);

            if (
                Number.isNaN(parsedCapacity) ||
                parsedCapacity <= 0 ||
                !Number.isInteger(parsedCapacity)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid capacity.",
                });
            }

            venue.capacity = parsedCapacity;
        }

        // Amenities
        if (amenities !== undefined) {
            const parsedAmenities = parseJsonArrayField(
                amenities,
                "amenities"
            );

            if (parsedAmenities.error) {
                return res.status(400).json({
                    success: false,
                    message: parsedAmenities.error,
                });
            }

            venue.amenities = parsedAmenities.data;
        }

        // Rules
        if (rules !== undefined) {
            const parsedRules = parseJsonArrayField(
                rules,
                "rules"
            );

            if (parsedRules.error) {
                return res.status(400).json({
                    success: false,
                    message: parsedRules.error,
                });
            }

            venue.rules = parsedRules.data;
        }

        // Location validation
        if (latitude !== undefined && latitude !== "") {
            const parsedLatitude = Number(latitude);

            if (
                Number.isNaN(parsedLatitude) ||
                parsedLatitude < -90 ||
                parsedLatitude > 90
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid latitude.",
                });
            }

            venue.location.latitude = parsedLatitude;
        }

        if (longitude !== undefined && longitude !== "") {
            const parsedLongitude = Number(longitude);

            if (
                Number.isNaN(parsedLongitude) ||
                parsedLongitude < -180 ||
                parsedLongitude > 180
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid longitude.",
                });
            }

            venue.location.longitude = parsedLongitude;
        }

        // Upload new images FIRST
        if (req.files && req.files.length > 0) {

            for (const file of req.files) {
                const result = await uploadToCloudinary(file.buffer);

                newlyUploadedImages.push({
                    url: result.secure_url,
                    public_id: result.public_id,
                });
            }

            // Delete old images only after successful upload
            for (const image of venue.images) {
                await deleteFromCloudinary(image.public_id);
            }

            venue.images = newlyUploadedImages;
            venue.coverImage = newlyUploadedImages[0];
        }

        await venue.save();

        await invalidateActiveVenuesCache();
        await invalidateActiveVenueCache(id);

        return res.status(200).json({
            success: true,
            message: "Venue updated successfully",
            data: venue,
        });

    } catch (error) {

        // Cleanup newly uploaded images if save fails
        for (const image of newlyUploadedImages) {
            try {
                await deleteFromCloudinary(image.public_id);
            } catch (cleanupError) {
                console.error(
                    "Cloudinary cleanup failed:",
                    cleanupError
                );
            }
        }

        console.error("Update venue error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later.",
        });
    }
};

//deactivate venue already listed

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
                message: "Venue not found"
            });
        }

        if (venue.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Access denied",
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
        console.error("Deactivate venue error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later.",
        });
    }
};

//acivate owner venue which listed

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

        if (venue.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Access denied",
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
        console.error("Activate venue error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later.",
        });
    }
};

//get venues for users/public

const getAllVenues = async (req, res) => {
    try {
        const cached = await getCache(ACTIVE_VENUES_CACHE_KEY);
        if (cached) {
            return res.status(200).json(cached);
        }
        console.log("❌ Redis MISS");

        const venues = await venueModel.find({
            isActive: true,
        }).select("-__v").sort({ createdAt: -1 });

        const payload = {
            success: true,
            count: venues.length,
            data: venues,
        };

        await setCache(ACTIVE_VENUES_CACHE_KEY, payload, ACTIVE_VENUES_CACHE_TTL);
        console.log("Saved data to Redis");
        return res.status(200).json(payload);

    } catch (error) {
        console.error("Get venues error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later.",
        });
    }
}

//get venue details for public/users

const getPublicVenueById = async (req, res) => {
    try {
        const { venueId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(venueId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid venue ID",
            });
        }

        const cacheKey = getActiveVenueCacheKey(venueId);
        const cached = await getCache(cacheKey);
        if (cached) {
            return res.status(200).json(cached);
        }

        const venue = await venueModel.findOne({
            _id: venueId,
            isActive: true,
        });

        if (!venue) {
            return res.status(404).json({
                success: false,
                message: "Venue not found",
            });
        }

        const payload = {
            success: true,
            data: venue,
        };

        await setCache(cacheKey, payload, ACTIVE_VENUES_CACHE_TTL);

        return res.status(200).json(payload);
    } catch (error) {
        console.error("Get venue error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later.",
        });
    }
}
export {
    createVenue, getMyVenues, getVenueById, updateVenue, deactivateVenue, activateVenue,
    getAllVenues, getPublicVenueById
};