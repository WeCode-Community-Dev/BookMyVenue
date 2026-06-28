import venueModel from "../models/venueModel.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import deleteFromCloudinary from "../utils/deleteFromCloudinary.js";

const parseJsonArrayField = (value, fieldName) => {
    if (!value) {
        return [];
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
    try {
        const {
            title, description, category, venueType, indoorOutdoor, price, pricingUnit,
            capacity, amenities, rules, address, city, state, pincode,
            latitude, longitude,
        } = req.body;

        if (!title || !description || !category || !price || !pricingUnit || !capacity || !address) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields.",
            });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please upload at least one image.",
            });
        }

        const uploadedImages = [];

        for (const file of req.files) {
            const result = await uploadToCloudinary(file.buffer);
            uploadedImages.push({ url: result.secure_url, public_id: result.public_id });
        }

        const parsedAmenities = parseJsonArrayField(amenities, "amenities");
        if (parsedAmenities.error) {
            return res.status(400).json({
                success: false,
                message: parsedAmenities.error,
            });
        }

        const parsedRules = parseJsonArrayField(rules, "rules");
        if (parsedRules.error) {
            return res.status(400).json({
                success: false,
                message: parsedRules.error,
            });
        }

        const venue = await venueModel.create({
            ownerId: req.user._id,
            title,
            description,
            category,
            venueType,
            indoorOutdoor,

            price,
            pricingUnit,
            capacity,
            amenities: parsedAmenities.data,
            rules: parsedRules.data,
            address,
            city,
            state,
            pincode,
            location: {
                latitude,
                longitude,
            },
            images: uploadedImages,
            coverImage: uploadedImages[0],
        });

        return res.status(201).json({
            success: true,
            message: "Venue created successfully.",
            data: venue,
        });
    } catch (error) {
        console.error("Error creating venue:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
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
            message: error.message,
        });
    }
};

//update my-venue

const updateVenue = async (req, res) => {
    try {

        const { id } = req.params;

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
            title, description, category, venueType, indoorOutdoor, price,
            pricingUnit, capacity, amenities, rules, address, city, state,
            pincode, latitude, longitude,
        } = req.body;

        venue.title = title || venue.title;
        venue.description = description || venue.description;
        venue.category = category || venue.category;
        venue.venueType = venueType || venue.venueType;
        venue.indoorOutdoor = indoorOutdoor || venue.indoorOutdoor;
        venue.price = price || venue.price;
        venue.pricingUnit = pricingUnit || venue.pricingUnit;
        venue.capacity = capacity || venue.capacity;
        venue.address = address || venue.address;
        venue.city = city || venue.city;
        venue.state = state || venue.state;
        venue.pincode = pincode || venue.pincode;

        if (amenities) {
            const parsedAmenities = parseJsonArrayField(amenities, "amenities");
            if (parsedAmenities.error) {
                return res.status(400).json({
                    success: false,
                    message: parsedAmenities.error,
                });
            }
            venue.amenities = parsedAmenities.data;
        }

        if (rules) {
            const parsedRules = parseJsonArrayField(rules, "rules");
            if (parsedRules.error) {
                return res.status(400).json({
                    success: false,
                    message: parsedRules.error,
                });
            }
            venue.rules = parsedRules.data;
        }

        // location
        venue.location = {
            latitude:
                latitude || venue.location.latitude,
            longitude:
                longitude || venue.location.longitude,
        };



        // Replace images if new uploaded
        if (req.files && req.files.length > 0) {

            // delete old cloudinary images
            for (const image of venue.images) {
                await deleteFromCloudinary(
                    image.public_id
                );
            }

            const uploadedImages = [];

            for (const file of req.files) {
                const result = await uploadToCloudinary(
                    file.buffer
                );

                uploadedImages.push({
                    url: result.secure_url,
                    public_id: result.public_id,
                });
            }

            venue.images = uploadedImages;
            venue.coverImage = uploadedImages[0];
        }

        await venue.save();

        return res.status(200).json({
            success: true,
            message: "Venue updated successfully",
            data: venue,
        });
    } catch (error) {
        console.error("Update venue error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

//deactivate venue already listed

const deactivateVenue = async (req, res) => {
    try {
        const { id } = req.params;
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

        return res.status(200).json({
            success: true,
            message: "Venue deactivated successfully",
            data: venue,
        });


    } catch (error) {
        console.error("Deactivate venue error:", error);

        return res.status(500).json({
            success: false, message: error.message,
        });
    }
};

//acivate owner venue which listed

const activateVenue = async (req, res) => {
    try {
        const { id } = req.params;

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

        return res.status(200).json({
            success: true,
            message: "Venue activated successfully",
            data: venue,
        });

    } catch (error) {
        console.error("Activate venue error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

//get venues for users/public

const getAllVenues = async (req, res) => {
    try {


        const venues = await venueModel.find({
            isActive: true,
        }).select("-__v").sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: venues.length,
            data: venues,
        })

    } catch (error) {
        console.error("Get venues error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

//get venue details for public/users

const getPublicVenueById = async (req, res) => {
    try {
        const { venueId } = req.params;

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

        return res.status(200).json({
            success: true,
            data: venue,
        })
    } catch (error) {
        console.error("Get venue error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
export { createVenue, getMyVenues, getVenueById, updateVenue, deactivateVenue, activateVenue,
     getAllVenues, getPublicVenueById };