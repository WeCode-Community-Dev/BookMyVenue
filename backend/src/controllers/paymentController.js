import venueModel from '../models/venueModel.js';
import venueAvailabilityModel from '../models/venueAvailabilityModel.js';
import bookingModel from '../models/bookingModel.js';
import paymentOrderModel from '../models/paymentOrderModel.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const isSlotExpired = (slot) => {
    const now = new Date();

    const slotDate = new Date(slot.date);

    const [time, period] = slot.endTime.split(" ");

    let [hours, minutes] = time.split(":").map(Number);

    if (period === "PM" && hours !== 12) {
        hours += 12;
    }

    if (period === "AM" && hours === 12) {
        hours = 0;
    }

    slotDate.setHours(hours, minutes, 0, 0);

    return slotDate < now;
};

const createOrder = async (req, res) => {
    try {
        const { venueId, availabilityId } = req.body;
        if (!venueId || !availabilityId) {
            return res.status(400).json({
                success: false,
                message: "Venue ID and Availability ID are required",
            });
        }

        const venue = await venueModel.findById(venueId);

        if (!venue) {
            return res.status(404).json({
                success: false,
                message: "Venue no found",
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
                message: "you cannot book your own venue",
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
        if (isSlotExpired(slot)) {
            return res.status(400).json({
                success: false,
                message: "This slot has already expired",
            });
        }

        if (slot.venueId.toString() !== venue._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "Selected slot does not belong to this venue",
            });
        }

        const amountInPaise = venue.price * 100;

        const options = {
            amount: amountInPaise,
            currency: "INR",
            receipt: `BMV_${Date.now()}`
        };

        const order = await razorpayInstance.orders.create(options);

        await paymentOrderModel.create({
            userId: req.user._id,
            venueId: venue._id,
            availabilityId: slot._id,
            razorpayOrderId: order.id,
            amountInPaise,
        });

        return res.status(200).json({
            success: true,
            message: "Order created successfully",
            order,
        });
    } catch (error) {
        console.error("Create order error:", error);

        return res.status(500).json({
            success: false,
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

        const paymentOrder = await paymentOrderModel.findOne({
            razorpayOrderId: razorpay_order_id,
        });

        if (!paymentOrder) {
            return res.status(400).json({
                success: false,
                message: "Invalid or unknown payment order",
            });
        }

        const existingByPaymentId = await bookingModel.findOne({
            paymentId: razorpay_payment_id,
            paymentStatus: "paid",
        });

        if (existingByPaymentId) {
            if (existingByPaymentId.razorpayOrderId === razorpay_order_id) {
                return res.status(200).json({
                    success: true,
                    message: "Payment already verified",
                    data: existingByPaymentId,
                });
            }

            return res.status(400).json({
                success: false,
                message: "This payment has already been used for another booking",
            });
        }

        if (paymentOrder.status === "completed") {
            const existingBooking = await bookingModel.findOne({
                razorpayOrderId: razorpay_order_id,
                paymentStatus: "paid",
            });

            if (existingBooking) {
                return res.status(200).json({
                    success: true,
                    message: "Payment already verified",
                    data: existingBooking,
                });
            }
        }

        if (paymentOrder.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "This payment order does not belong to you",
            });
        }

        if (paymentOrder.venueId.toString() !== venueId.toString()) {
            return res.status(400).json({
                success: false,
                message: "Payment order does not match the selected venue",
            });
        }

        if (paymentOrder.availabilityId.toString() !== availabilityId.toString()) {
            return res.status(400).json({
                success: false,
                message: "Payment order does not match the selected slot",
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

        let razorpayOrder;
        try {
            razorpayOrder = await razorpayInstance.orders.fetch(razorpay_order_id);
        } catch {
            return res.status(400).json({
                success: false,
                message: "Unable to verify payment order with Razorpay",
            });
        }

        if (razorpayOrder.amount !== paymentOrder.amountInPaise) {
            return res.status(400).json({
                success: false,
                message: "Payment amount does not match the expected order amount",
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

        const bookingAmount = paymentOrder.amountInPaise / 100;

        const bookingReference =
            "BMV-" + Date.now().toString().slice(-6);

        const booking = await bookingModel.create({
            bookingReference,
            userId: req.user._id,
            venueId,
            availabilityId,
            amount: bookingAmount,
            contactPhone: req.user.phone,
            bookingStatus: "confirmed",
            paymentStatus: "paid",
            paymentMethod: "razorpay",
            razorpayOrderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
        });

        const updatedSlot =
            await venueAvailabilityModel.findOneAndUpdate(
                {
                    _id: availabilityId,
                    isBooked: false,
                    isActive: true,
                },
                {
                    $set: {
                        isBooked: true,
                        bookingId: booking._id,
                    },
                },
                {
                    new: true,
                }
            );

        if (!updatedSlot) {
            await bookingModel.findByIdAndDelete(booking._id);

            return res.status(400).json({
                success: false,
                message: "This slot was already booked by another user",
            });
        }

        paymentOrder.status = "completed";
        await paymentOrder.save();

        return res.status(201).json({
            success: true,
            message: "Payment verified and venue booked successfully",
            data: booking,
        });

    } catch (error) {
        console.error("Verify payment error:", error);

        if (error.code === 11000 && error.keyPattern?.paymentId) {
            const existingBooking = await bookingModel.findOne({
                paymentId: req.body.razorpay_payment_id,
                paymentStatus: "paid",
            });

            if (existingBooking) {
                return res.status(200).json({
                    success: true,
                    message: "Payment already verified",
                    data: existingBooking,
                });
            }

            return res.status(400).json({
                success: false,
                message: "This payment has already been used for another booking",
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export { createOrder, verifyPayment }
