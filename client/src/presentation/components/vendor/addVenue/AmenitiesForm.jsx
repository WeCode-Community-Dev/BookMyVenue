const amenitiesList = [
  "Parking","WiFi","Air Conditioning","Catering","Decoration",
  "Sound System","Stage","Projector","Power Backup","Security",
  "Valet Parking","DJ Setup"
];

const AmenitiesForm = ({ amenities, setAmenities }) => {
  const toggleAmenity = (item) => {
    setAmenities(
      amenities.includes(item)
        ? amenities.filter((a) => a !== item)
        : [...amenities, item]
    );
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Venue Amenities</h2>
      <div className="grid grid-cols-3 gap-4">
        {amenitiesList.map((item) => (
          <label
            key={item}
            className={`border rounded-xl p-4 flex items-center gap-3 cursor-pointer 
              ${amenities.includes(item) ? "border-blue-500 bg-blue-50" : ""}`}
          >
            <input
              type="checkbox"
              checked={amenities.includes(item)}
              onChange={() => toggleAmenity(item)}
            />
            <span>{item}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default AmenitiesForm;
