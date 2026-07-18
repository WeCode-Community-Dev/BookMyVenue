const Amenities = require("../../models/amenity");
const slugify = require("../../utils/slugify");

// PATCH /admin/amenities/:id   body: { name?, isActive? }
// When name changes, the identifier is recomputed and the same duplicate
// check createAmenity does is re-run (excluding this row), so a rename can't
// collide with an existing amenity the way a plain name update used to.
async function updateAmenity(req, res) {
   try {
      const { id } = req.params;
      const { name, isActive } = req.body;

      const update = {};
      if (name !== undefined) {
         if (!name.trim()) {
            return res.status(400).json({ message: "name cannot be empty" });
         }

         const identifier = slugify(name);
         if (!identifier) {
            return res.status(400).json({ message: "name must contain at least one letter or number" });
         }

         const existing = await Amenities.findOne({ identifier, _id: { $ne: id } });
         if (existing) {
            return res.status(409).json({ message: "An amenity with this name already exists" });
         }

         update.name = name.trim();
         update.identifier = identifier;
      }
      if (isActive !== undefined) {
         if (typeof isActive !== "boolean") {
            return res.status(400).json({ message: "isActive must be a boolean" });
         }
         update.isActive = isActive;
      }

      if (Object.keys(update).length === 0) {
         return res.status(400).json({ message: "Nothing to update" });
      }

      const amenity = await Amenities.findOneAndUpdate(
         { _id: id, deletedAt: null },
         update,
         { new: true, runValidators: true }
      );

      if (!amenity) {
         return res.status(404).json({ message: "Amenity not found" });
      }

      return res.status(200).json({ data: amenity });
   } catch (err) {
      if (err.code === 11000) {
         return res.status(409).json({ message: "An amenity with this name already exists" });
      }
      return res
         .status(500)
         .json({ error: err.message, message: "Failed to update amenity" });
   }
}

module.exports = updateAmenity;