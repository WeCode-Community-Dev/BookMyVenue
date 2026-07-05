const Amenities = require("../../models/amenity");

const PUBLIC_FIELDS = "identifier name";

// multiselect dropdown and for resolving amenity labels
async function listAmenities(req, res) {
   try {
      const amenities = await Amenities.find({ isActive: true, deletedAt: null })
         .select(PUBLIC_FIELDS)
         .sort({ name: 1 })
         .lean();

      return res.status(200).json({ data: amenities });
   } catch (err) {
      return res
         .status(500)
         .json({ error: err.message, message: "Failed to fetch amenities" });
   }
}

module.exports = listAmenities;
