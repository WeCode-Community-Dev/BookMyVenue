import React from "react";
import { Input } from "@/components/ui/input";

const PricingForm = () => {
  return (
    <div className="grid grid-cols-3 gap-6">

      {/* Pricing Form */}
      <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm">

        <h2 className="text-xl font-semibold mb-6">
          Capacity & Pricing
        </h2>

        <div className="grid grid-cols-2 gap-6">

          <div>
            <label>Seating Capacity</label>
            <Input placeholder="500" />
          </div>

          <div>
            <label>Standing Capacity</label>
            <Input placeholder="700" />
          </div>

          <div>
            <label>Price Per Day (₹)</label>
            <Input placeholder="50000" />
          </div>

          <div>
            <label>Security Deposit (₹)</label>
            <Input placeholder="10000" />
          </div>

          <div>
            <label>Weekend Surcharge (%)</label>
            <Input placeholder="15" />
          </div>

          <div>
            <label>Minimum Booking Hours</label>
            <Input placeholder="4" />
          </div>

        </div>

      </div>

      {/* Tips Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 h-fit">

        <h3 className="font-semibold text-blue-700 mb-3">
          Pricing Tips
        </h3>

        <ul className="space-y-3 text-sm text-gray-600">
          <li>• Competitive pricing gets more bookings.</li>
          <li>• Weekend pricing can be 10-20% higher.</li>
          <li>• Include deposits for venue protection.</li>
          <li>• Keep cancellation policy clear.</li>
        </ul>

      </div>

    </div>
  );
};

export default PricingForm;