import "dotenv/config";

import connectDB from "../config/db.js";
import Venue from "../models/Venue.js";

const migrateCapacityToNumber = async () => {
  try {
    await connectDB();

    const result = await Venue.collection.updateMany(
      {
        capacity: { $type: "object" },
        "capacity.max": { $exists: true },
      },
      [
        {
          $set: {
            capacity: "$capacity.max",
          },
        },
      ]
    );

    console.log("Capacity migration completed");
    console.log(`Matched documents: ${result.matchedCount}`);
    console.log(`Modified documents: ${result.modifiedCount}`);

    process.exit(0);
  } catch (error) {
    console.error("Capacity migration failed:", error);
    process.exit(1);
  }
};

migrateCapacityToNumber();