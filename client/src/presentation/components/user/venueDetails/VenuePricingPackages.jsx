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

  const activePackageId =
    selectedPackage?.id || selectedPackage || internalSelectedPackage;

  const handleSelect = (packageItem) => {
    setInternalSelectedPackage(packageItem.id);
    onPackageSelect?.(packageItem);
  };

  return (
    <section className="mt-6 rounded-2xl border bg-white p-6">
      <h2 className="mb-6 text-2xl font-bold">
        Pricing Packages
      </h2>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {packages.map((packageItem) => {
          const isSelected =
            activePackageId === packageItem.id;

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
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-black px-4 py-1.5 text-xs font-semibold text-white">
                  Most Popular
                </span>
              )}

              <h3 className="text-xl font-bold">
                {packageItem.name}
              </h3>

              <p className="mt-4 text-3xl font-bold">
                {packageItem.price}
              </p>

              <p className="mt-1 text-gray-500">
                {packageItem.duration}
              </p>

              <div className="my-5 border-t" />

              <ul className="space-y-3">
                {packageItem.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex gap-2 text-sm text-gray-600"
                  >
                    <span className="text-green-600">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  handleSelect(packageItem);
                }}
                className={`mt-6 w-full rounded-xl py-3 font-semibold ${
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