const Amenities = require("../../models/amenity");

// PATCH /admin/amenities/:id   body: { name?, isActive? }
// identifier is intentionally immutable after creation (venues store the
// identifier, not the id/name, so changing it would silently break them).
async function updateAmenity(req, res) {
   try {
      const { id } = req.params;
      const { name, isActive } = req.body;

      const update = {};
      if (name !== undefined) {
         if (!name.trim()) {
            return res.status(400).json({ message: "name cannot be empty" });
         }
         update.name = name.trim();
      }
      if (isActive !== undefined) {
         update.isActive = Boolean(isActive);
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
      return res
         .status(500)
         .json({ error: err.message, message: "Failed to update amenity" });
   }
}

module.exports = updateAmenity;
