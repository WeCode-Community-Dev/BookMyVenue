import venueAvailabilityModel from "../models/venueAvailabilityModel.js";
import venueModel from "../models/venueModel.js";
import bookingModel from "../models/bookingModel.js";



//get users all bookings for normal users profile

const getMyBookings = async (req, res) => {
    try {

        const bookings = await bookingModel.find({
            userId: req.user._id
        })
        .populate("venueId")
        .populate("availabilityId")
        .sort({ createdAt: -1 })

        return res.status(200).json({
            success: true,
            message:"Fetched all bookings",
            count: bookings.length,
            data: bookings,
        });

    } catch (error) {
        console.error("Error fetching bookings:",error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};


//bookings for provider venues(fetch for provider)

const getProviderBookings = async (req,res)=>{
    try {
        const venues = await venueModel.find({
            ownerId: req.user._id,
        });

        const venueIds = venues.map((venue)=> venue._id);

        const bookings = await bookingModel.find({
            venueId:{$in: venueIds},
        })
        .populate("userId", "name email phone")
            .populate("venueId")
            .populate("availabilityId")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings,
        });
    } catch (error) {
        console.error("Error fetching provider bookings:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
export { getMyBookings, getProviderBookings }