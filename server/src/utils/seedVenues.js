import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Venue from "../models/Venue.js";
import venues from "../data/venues.js";

dotenv.config();

const seedVenues = async () => {
  try {
    await connectDB();

    // Delete only old seed venues, not real owner-submitted venues
    await Venue.deleteMany({ isSeed: true });

    const insertedVenues = await Venue.insertMany(venues);

    console.log(`${insertedVenues.length} seed venues inserted successfully`);

    process.exit(0);
  } catch (error) {
    console.error("Venue seeding failed:", error.message);
    process.exit(1);
  }
};

seedVenues();