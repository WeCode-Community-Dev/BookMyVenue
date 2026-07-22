import { useState } from "react";

const packages = [
  {
    id: "basic",
    name: "Basic Package",
    price: "₹80,000",
    duration: "8 hours",
    features: [
      "Venue rental",
      "Basic lighting",
      "Tables & chairs",
      "Parking",
    ],
  },
  {
    id: "premium",
    name: "Premium Package",
    price: "₹150,000",
    duration: "12 hours",
    popular: true,
    features: [
      "Venue rental",
      "Premium lighting & sound",
      "Furniture setup",
      "Parking",
      "Basic decoration",
      "Green rooms",
    ],
  },
  {
    id: "luxury",
    name: "Luxury Package",
    price: "₹250,000",
    duration: "Full day",
    features: [
      "Venue rental",
      "Complete A/V setup",
      "Custom furniture",
      "Parking",
      "Premium decoration",
      "Catering service",
      "Event coordinator",
    ],
  },
];

export default function VenuePricingPackages({
  selectedPackage,
  onPackageSelect,
}) {
  const [internalSelectedPackage, setInternalSelectedPackage] =
    useState("premium");

  const activePackage =
    selectedPackage || internalSelectedPackage;

  const handleSelect = (packageItem) => {
    setInternalSelectedPackage(packageItem.id);
    onPackageSelect?.(packageItem);
  };

  return (
    <section className="bg-white rounded-2xl p-6 mt-6 border">
      <h2 className="text-2xl font-bold mb-6">
        Pricing Packages
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {packages.map((packageItem) => {
          const isSelected =
            activePackage === packageItem.id;

          return (
            <div
              key={packageItem.id}
              onClick={() => handleSelect(packageItem)}
              className={`relative cursor-pointer rounded-2xl border-2 p-6 transition-all ${
                isSelected
                  ? "border-black shadow-lg"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              {packageItem.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-semibold px-4 py-1.5 rounded-full">
                  Most Popular
                </span>
              )}

              <h3 className="text-xl font-bold">
                {packageItem.name}
              </h3>

              <p className="text-3xl font-bold mt-4">
                {packageItem.price}
              </p>

              <p className="text-gray-500 mt-1">
                {packageItem.duration}
              </p>

              <div className="border-t my-5" />

              <ul className="space-y-3">
                {packageItem.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex gap-2 text-sm text-gray-600"
                  >
                    <span className="text-green-600">
                      ✓
                    </span>

                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className={`w-full mt-6 py-3 rounded-xl font-semibold ${
                  isSelected
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {isSelected ? "Selected" : "Select Package"}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}