import mongoose from "mongoose";
import venueAvailabilityModel from "../models/venueAvailabilityModel.js";
import venueModel from "../models/venueModel.js";
import { isValidSlotTime, parseSlotTimeToMinutes, } from "../utils/parseSlotTime.js";
import { getCache, setCache, getVenueAvailabilityCacheKey, invalidateVenueAvailabilityCache, VENUE_AVAILABILITY_CACHE_TTL, } from "../utils/cache.js";

const createAvailability = async (req, res) => {
    try {
        const {
            venueId, date, slotLabel, startTime, endTime, } = req.body;

        if (!venueId || !date || !slotLabel || !startTime || !endTime) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(venueId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid venue ID",
            });
        }

        const venue = await venueModel.findById(venueId);

        if (!venue) {
            return res.status(404).json({
                success: false,
                message: "Venue not found",
            });
        }

        // Ownership check
        if (venue.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only manage your own venue",
            });
        }
        const selectedDate = new Date(date);

        if (Number.isNaN(selectedDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid date",
            });
        }

        const today = new Date();

        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            return res.status(400).json({
                success: false,
                message: "Cannot create availability for past dates",
            });
        }
        const startMinutes = parseSlotTimeToMinutes(startTime);
        const endMinutes = parseSlotTimeToMinutes(endTime);

        if (!isValidSlotTime(startTime) || !isValidSlotTime(endTime)) {
            return res.status(400).json({
                success: false,
                message: "Invalid time format",
            });
        }

        if (startMinutes >= endMinutes) {
            return res.status(400).json({
                success: false,
                message: "End time must be after start time",
            });
        }

        const existingSlot = await venueAvailabilityModel.findOne({
            venueId, date, slotLabel,
        });

        if (existingSlot) {
            return res.status(400).json({
                success: false,
                message: "Slot already exists for this date",
            });
        }



        const availability =
            await venueAvailabilityModel.create({
                venueId, date, slotLabel, startTime, endTime,
            });

        await invalidateVenueAvailabilityCache(venueId);

        return res.status(201).json({
            success: true,
            message: "Availability created successfully",
            data: availability,
        });

    } catch (error) {
        console.error("Create availability error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later."
        });
    }
};


const getVenueAvailability = async (req, res) => {
    try {

        const { venueId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(venueId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid venue ID",
            });
        }

        const cacheKey = getVenueAvailabilityCacheKey(venueId);
        const cached = await getCache(cacheKey);
        if (cached) {
            return res.status(200).json(cached);
        }

        const availability = await venueAvailabilityModel.find({ venueId, }).sort({
            date: 1,
            startTime: 1,
        });

        const payload = {
            success: true,
            count: availability.length,
            data: availability,
        };

        await setCache(cacheKey, payload, VENUE_AVAILABILITY_CACHE_TTL);

        return res.status(200).json(payload);

    } catch (error) {
        console.error("Get availability error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later."
        });
    }
};

//deactivate venue slotes of if not available by provider

const deactivateAvailability = async (req, res) => {
    try {


        const { slotId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(slotId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid slot ID",
            });
        }
        const slot = await venueAvailabilityModel.findById(slotId);

        if (!slot) {
            return res.status(404).json({
                success: false,
                message: "Slot not found",
            });
        }

        const venue = await venueModel.findById(slot.venueId);

        if (!venue) {
            return res.status(404).json({
                success: false,
                message: "Venue not found",
            });
        }

        if (venue.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",

            })
        }


        if (slot.isBooked) {
            return res.status(400).json({
                success: false,
                message: "Booked slots cannot be deactivated",
            });
        }
        slot.isActive = false;
        await slot.save();

        await invalidateVenueAvailabilityCache(slot.venueId);

        return res.status(200).json({
            success: true,
            message: "Slot deactivated successfully",
            data: slot,
        });

    } catch (error) {
        console.error("Deactivated slot error", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later."
        });
    }
};

//acivate that

const activateAvailability = async (req, res) => {
    try {
        const { slotId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(slotId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid slot ID",
            });
        }

        const slot = await venueAvailabilityModel.findById(slotId);

        if (!slot) {
            return res.status(404).json({
                success: false,
                message: "Slot not found",
            });
        }

        const venue = await venueModel.findById(slot.venueId);

        if (!venue) {
            return res.status(404).json({
                success: false,
                message: "Venue not found",
            });
        }

        if (venue.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        slot.isActive = true;
        await slot.save();

        await invalidateVenueAvailabilityCache(slot.venueId);

        return res.status(200).json({
            success: true,
            message: "Slot activated successfully",
            data: slot,
        });
    } catch (error) {
        console.error("Activate slot error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later."
        });
    }
};



export { createAvailability, getVenueAvailability, deactivateAvailability, activateAvailability };