import venueModel from '../models/venueModel.js';
import venueAvailabilityModel from '../models/venueAvailabilityModel.js';
import bookingModel from '../models/bookingModel.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req,res)=>{
    try {
        const {venueId, availabilityId} = req.body;
       if (!venueId || ! availabilityId){
        return res.status(400).json({
            success:false,
            message:"Venue ID and Availability ID are required",
        });
       }

       const venue = await venueModel.findById(venueId);

       if (!venue){
        return res.status(404).json({
            success:false,
            message:"Venue no found",
        });
       }

       if (!venue.isActive){
        return res.status(400).json({
            success:false,
            message:"Venue is inactive",
        });
       }
       if (venue.ownerId.toString()=== req.user._id.toString()){
        return res.status(400).json({
            success:false,
            message:"you cannot book your own venue",
        });
       }

       const slot = await venueAvailabilityModel.findById(availabilityId);

       if (!slot) {
            return res.status(404).json({
                success: false,
                message: "Availability slot not found",
            });
        }

        if (!slot.isActive) {
            return res.status(400).json({
                success: false,
                message: "This slot is inactive",
            });
        }

        if (slot.isBooked) {
            return res.status(400).json({
                success: false,
                message: "This slot is already booked",
            });
        }

        if (slot.venueId.toString() !== venue._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "Selected slot does not belong to this venue",
            });
        }

        const options = {
            amount :venue.price *100,
            currency: "INR",
            receipt: `BMV_${Date.now()}`
        };

        const order = await razorpayInstance.orders.create(options);

        return res.status(200).json({
            success:true,
            message:"Order created successfully",
            order,
        });
    } catch (error) {
        console.error("Create order error:",error);

        return res.status(500).json({
            success:false,
            message: error.error?.description || error.message,
        });
    }
};


const verifyPayment = async (req, res) => {
    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            venueId,
            availabilityId,
        } = req.body;

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature ||
            !venueId ||
            !availabilityId
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing required payment details",
            });
        }

        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed",
            });
        }

        const venue = await venueModel.findById(venueId);

        if (!venue) {
            return res.status(404).json({
                success: false,
                message: "Venue not found",
            });
        }

        if (!venue.isActive) {
            return res.status(400).json({
                success: false,
                message: "Venue is inactive",
            });
        }

        if (venue.ownerId.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot book your own venue",
            });
        }

        const slot = await venueAvailabilityModel.findById(availabilityId);

        if (!slot) {
            return res.status(404).json({
                success: false,
                message: "Availability slot not found",
            });
        }

        if (!slot.isActive) {
            return res.status(400).json({
                success: false,
                message: "This slot is inactive",
            });
        }

        if (slot.isBooked) {
            return res.status(400).json({
                success: false,
                message: "This slot is already booked",
            });
        }

        if (slot.venueId.toString() !== venue._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "Selected slot does not belong to this venue",
            });
        }

        const bookingReference =
            "BMV-" + Date.now().toString().slice(-6);

        const booking = await bookingModel.create({
            bookingReference,
            userId: req.user._id,
            venueId,
            availabilityId,
            amount: venue.price,
            contactPhone: req.user.phone,
            bookingStatus: "confirmed",
            paymentStatus: "paid",
            paymentMethod: "razorpay",
            paymentId: razorpay_payment_id,
        });

        slot.isBooked = true;
        slot.bookingId = booking._id;

        await slot.save();

        return res.status(201).json({
            success: true,
            message: "Payment verified and venue booked successfully",
            data: booking,
        });

    } catch (error) {
        console.error("Verify payment error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export {createOrder,verifyPayment}