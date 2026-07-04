import React from "react";
import { Button } from "@/components/ui/button";

const ReviewForm = ({ venueName, category, description, addressLine1, city, state, country, pricing, amenities, onPublish, submitLabel = "Publish Venue" }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Review Venue Details</h2>

      <div className="space-y-4">
        <div>
          <h3 className="font-medium">Venue Name</h3>
          <p className="text-gray-500">{venueName || "Not provided"}</p>
        </div>

        <div>
          <h3 className="font-medium">Category</h3>
          <p className="text-gray-500">{category || "Not provided"}</p>
        </div>

        <div>
          <h3 className="font-medium">Address</h3>
          <p className="text-gray-500">
            {addressLine1 || ""}{addressLine1 && city ? ", " : ""}{city || ""}{city && state ? ", " : ""}{state || ""}{(city || state) && country ? ", " : ""}{country || ""}
          </p>
        </div>

        <div>
          <h3 className="font-medium">Capacity</h3>
          <p className="text-gray-500">
            {pricing.seatingCapacity || "0"} seated / {pricing.standingCapacity || "0"} standing
          </p>
        </div>

        <div>
          <h3 className="font-medium">Price</h3>
          <p className="text-gray-500">
            ₹{pricing.pricePerDay || "0"} / day
          </p>
        </div>

        <div>
          <h3 className="font-medium">Amenities</h3>
          <p className="text-gray-500">
            {amenities.length > 0 ? amenities.join(", ") : "No amenities selected"}
          </p>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button onClick={onPublish} className="bg-green-600 hover:bg-green-700">
          {submitLabel}
        </Button>
      </div>
    </div>
  );
};

export default ReviewForm;
