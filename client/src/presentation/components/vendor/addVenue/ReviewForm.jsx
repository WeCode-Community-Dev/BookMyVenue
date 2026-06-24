import React from "react";
import { Button } from "@/components/ui/button";

const ReviewForm = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">

      <h2 className="text-xl font-semibold mb-6">
        Review Venue Details
      </h2>

      <div className="space-y-4">

        <div>
          <h3 className="font-medium">
            Venue Name
          </h3>

          <p className="text-gray-500">
            Grand Ballroom
          </p>
        </div>

        <div>
          <h3 className="font-medium">
            Location
          </h3>

          <p className="text-gray-500">
            Kochi, Kerala
          </p>
        </div>

        <div>
          <h3 className="font-medium">
            Capacity
          </h3>

          <p className="text-gray-500">
            500 Guests
          </p>
        </div>

        <div>
          <h3 className="font-medium">
            Price
          </h3>

          <p className="text-gray-500">
            ₹50,000 / day
          </p>
        </div>

        <div>
          <h3 className="font-medium">
            Amenities
          </h3>

          <p className="text-gray-500">
            Parking, WiFi, Catering, AC
          </p>
        </div>

      </div>

      <div className="mt-8 flex justify-end">
        <Button className="bg-green-600 hover:bg-green-700">
          Publish Venue
        </Button>
      </div>

    </div>
  );
};

export default ReviewForm;