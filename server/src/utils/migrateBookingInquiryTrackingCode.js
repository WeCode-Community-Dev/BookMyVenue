import "dotenv/config";

import connectDB from "../config/db.js";
import BookingInquiry from "../models/BookingInquiry.js";

const generateTrackingCode = () => {
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `BMV-${randomPart}`;
};

const generateUniqueTrackingCode = async () => {
  let trackingCode;
  let exists = true;

  while (exists) {
    trackingCode = generateTrackingCode();

    const existingInquiry = await BookingInquiry.findOne({
      trackingCode,
    });

    if (!existingInquiry) {
      exists = false;
    }
  }

  return trackingCode;
};

const migrateBookingInquiryTrackingCode = async () => {
  try {
    await connectDB();

    const inquiriesWithoutTrackingCode = await BookingInquiry.find({
      $or: [
        { trackingCode: { $exists: false } },
        { trackingCode: null },
        { trackingCode: "" },
      ],
    });

    console.log(
      `Found ${inquiriesWithoutTrackingCode.length} inquiries without tracking code`
    );

    for (const inquiry of inquiriesWithoutTrackingCode) {
      inquiry.trackingCode = await generateUniqueTrackingCode();
      await inquiry.save();

      console.log(
        `Updated inquiry ${inquiry._id} with ${inquiry.trackingCode}`
      );
    }

    console.log("Booking inquiry tracking code migration completed");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

migrateBookingInquiryTrackingCode();