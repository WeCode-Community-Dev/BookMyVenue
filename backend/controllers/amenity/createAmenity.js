const Amenities = require("../../models/amenity");
const slugify = require("../../utils/slugify");

// POST /admin/amenities   body: { name }
// identifier is derived from name (never accepted from the request) and acts as
// a normalized dedup key: it collapses casing/spacing/punctuation so "Free
// Parking" and "free parking" resolve to the same slug and can't both be created.
async function createAmenity(req, res) {
   try {
      const { name } = req.body;
      if (!name || !name.trim()) {
         return res.status(400).json({ message: "name is required" });
      }

      const identifier = slugify(name);
      if (!identifier) {
         return res.status(400).json({ message: "name must contain at least one letter or number" });
      }

      const existing = await Amenities.findOne({ identifier });
      if (existing) {
         return res.status(409).json({ message: "An amenity with this name already exists" });
      }

      const amenity = await Amenities.create({ identifier, name: name.trim() });
      return res.status(201).json({ data: amenity });
   } catch (err) {
      if (err.code === 11000) {
         return res.status(409).json({ message: "An amenity with this name already exists" });
      }
      return res
         .status(500)
         .json({ error: err.message, message: "Failed to create amenity" });
   }
}

module.exports = createAmenity;
