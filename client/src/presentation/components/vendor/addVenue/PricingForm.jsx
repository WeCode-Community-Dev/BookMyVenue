import { Input } from "@/components/ui/input";

const pricingFields = [
  ["seatingCapacity", "Seating Capacity", "500"],
  ["standingCapacity", "Standing Capacity", "700"],
  ["pricePerHour", "Price Per Hour (₹)", "2000"],
  ["pricePerDay", "Price Per Day (₹)", "50000"],
  ["securityDeposit", "Security Deposit (₹)", "10000"],
  ["weekendSurcharge", "Weekend Surcharge (%)", "15"],
  ["minimumBookingHours", "Minimum Booking Hours", "4"],
];

const PricingForm = ({
  pricing,
  setPricing,
  errors = {},
}) => {
  const handleChange = (field, value) => {
    setPricing({
      ...pricing,
      [field]: value,
    });
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold">
          Capacity & Pricing
        </h2>

        <div className="grid grid-cols-2 gap-6">
          {pricingFields.map(([field, label, placeholder]) => (
            <div key={field}>
              <label
                htmlFor={field}
                className="block text-sm font-medium"
              >
                {label}
              </label>

              <Input
                id={field}
                value={pricing[field]}
                onChange={(event) =>
                  handleChange(field, event.target.value)
                }
                placeholder={placeholder}
                aria-invalid={Boolean(errors[field])}
              />

              {errors[field] && (
                <p className="mt-2 text-sm text-red-600">
                  {errors[field]}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="h-fit rounded-2xl border border-blue-200 bg-blue-50 p-5">
        <h3 className="mb-3 font-semibold text-blue-700">
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