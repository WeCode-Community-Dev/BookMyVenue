import React from "react";

const amenities = [
  "Parking",
  "WiFi",
  "Air Conditioning",
  "Catering",
  "Decoration",
  "Sound System",
  "Stage",
  "Projector",
  "Power Backup",
  "Security",
  "Valet Parking",
  "DJ Setup",
];

const AmenitiesForm = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">

      <h2 className="text-xl font-semibold mb-6">
        Venue Amenities
      </h2>

      <div className="grid grid-cols-3 gap-4">

        {amenities.map((item) => (
          <label
            key={item}
            className="border rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:border-blue-500 hover:bg-blue-50"
          >
            <input type="checkbox" />

            <span>{item}</span>
          </label>
        ))}

      </div>

    </div>
  );
};

export default AmenitiesForm;