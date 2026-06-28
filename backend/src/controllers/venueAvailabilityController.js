import venueAvailabilityModel from "../models/venueAvailabilityModel.js";
import venueModel from "../models/venueModel.js";

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
        const today = new Date();

        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            return res.status(400).json({
                success: false,
                message: "Cannot create availability for past dates",
            });
        }
        if (startTime >= endTime) {
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

        return res.status(201).json({
            success: true,
            message: "Availability created successfully",
            data: availability,
        });

    } catch (error) {
        console.error("Create availability error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


const getVenueAvailability = async (req, res) => {
    try {

        const { venueId } = req.params;

        const availability = await venueAvailabilityModel.find({ venueId, }).sort({
            date: 1,
            startTime: 1,
        });

        return res.status(200).json({
            success: true,
            count: availability.length,
            data: availability,
        });




    } catch (error) {
        console.error("Get availability error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

//deactivate venue slotes of if not available by provider

const deactivateAvailability = async (req, res) => {
    try {


        const { slotId } = req.params;

        const slot = await venueAvailabilityModel.findById(slotId);

        if (!slot) {
            return res.status(404).json({
                success: false,
                message: "Slot not found",
            });
        }

        const venue = await venueModel.findById(slot.venueId);

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

        return res.status(200).json({
            success: true,
            message: "Slot deactivated successfully",
            data: slot,
        });

    } catch (error) {
        console.error("Deactivated slot error", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

//acivate that

const activateAvailability = async (req, res) => {
    try {
        const { slotId } = req.params;

        const slot = await venueAvailabilityModel.findById(slotId);

        if (!slot) {
            return res.status(404).json({
                success: false,
                message: "slot not found",
            });
        }

        const venue = await venueModel.findById(slot.venueId);

        if (venue.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        slot.isActive = true;
        await slot.save();

        return res.status(200).json({
            success: true,
            message: "Slot activated successfully",
            data: slot,
        });
    } catch (error) {
        console.error("Activate slot error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



export { createAvailability, getVenueAvailability, deactivateAvailability, activateAvailability };