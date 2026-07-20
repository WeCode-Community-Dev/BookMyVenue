import { Input } from "@/components/ui/input";

const PricingForm = ({ pricing, setPricing, errors = {} }) => {
  const handleChange = (field, value) => setPricing({ ...pricing, [field]: value });

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Capacity & Pricing</h2>
        <div className="grid grid-cols-2 gap-6">
          {[
            ["seatingCapacity","Seating Capacity","500"],
            ["standingCapacity","Standing Capacity","700"],
            ["pricePerDay","Price Per Day (₹)","50000"],
            ["securityDeposit","Security Deposit (₹)","10000"],
            ["weekendSurcharge","Weekend Surcharge (%)","15"],
            ["minimumBookingHours","Minimum Booking Hours","4"]
          ].map(([field,label,placeholder]) => (
            <div key={field}>
              <label>{label}</label>
              <Input
                value={pricing[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                placeholder={placeholder}
                aria-invalid={Boolean(errors[field])}
              />
              {errors[field] && <p className="mt-2 text-sm text-red-600">{errors[field]}</p>}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 h-fit">
        <h3 className="font-semibold text-blue-700 mb-3">Pricing Tips</h3>
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
