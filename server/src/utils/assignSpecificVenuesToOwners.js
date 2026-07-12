import "dotenv/config";

import connectDB from "../config/db.js";
import Venue from "../models/Venue.js";
import User from "../models/User.js";
import BookingInquiry from "../models/BookingInquiry.js";

const venueOwnerMap = [
  {
    ownerEmail: "owner1@example.com",
    venueNames: ["Kochi Grand Convention Hall","Kozhikode Marina Banquet Hall", "Kottayam Lakeview Resort Venue", "Kollam Sapphire Community Hall", "Kannur Coastal Rooftop Venue", "Kasaragod Pearl Conference Room"],
  },
  {
    ownerEmail: "owner2@example.com",
    venueNames: ["Trivandrum Royal Auditorium","Thrissur Heritage Wedding Hall", "Alappuzha Backwater Outdoor Venue", "Palakkad Greenfield Party Hall", "Malappuram Crescent Wedding Hall", "Wayanad Misty Outdoor Venue"],
  },
];

const assignSpecificVenuesToOwners = async () => {
  try {
    await connectDB();

    for (const mapping of venueOwnerMap) {
      const owner = await User.findOne({
        email: mapping.ownerEmail.toLowerCase(),
        role: "owner",
      });

      if (!owner) {
        console.log(`Owner not found: ${mapping.ownerEmail}`);
        continue;
      }

      const venues = await Venue.find({
        name: { $in: mapping.venueNames },
      });

      if (venues.length === 0) {
        console.log(`No venues found for owner: ${mapping.ownerEmail}`);
        continue;
      }

      const venueIds = venues.map((venue) => venue._id);

      const venueResult = await Venue.updateMany(
        {
          _id: { $in: venueIds },
        },
        {
          $set: {
            owner: owner._id,
          },
        }
      );

      const inquiryResult = await BookingInquiry.updateMany(
        {
          venue: { $in: venueIds },
          $or: [
            { owner: { $exists: false } },
            { owner: null },
          ],
        },
        {
          $set: {
            owner: owner._id,
          },
        }
      );

      console.log(`Assigned venues to ${mapping.ownerEmail}`);
      console.log(`Modified venues: ${venueResult.modifiedCount}`);
      console.log(`Modified inquiries: ${inquiryResult.modifiedCount}`);
    }

    console.log("Specific venue-owner assignment completed");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

assignSpecificVenuesToOwners();