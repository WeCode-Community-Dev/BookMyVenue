const Amenities = require("../../models/amenity");

// DELETE /admin/amenities/:id
// Soft delete: marks deletedAt + isActive false rather than removing the doc,
// so venues that already reference this amenity (by _id) don't end up with a
// dangling ref.
async function deleteAmenity(req, res) {
   try {
      const { id } = req.params;

      const amenity = await Amenities.findOneAndUpdate(
         { _id: id, deletedAt: null },
         { deletedAt: new Date(), isActive: false },
         { new: true }
      );

      if (!amenity) {
         return res.status(404).json({ message: "Amenity not found" });
      }

      return res.status(200).json({ data: amenity });
   } catch (err) {
      return res
         .status(500)
         .json({ error: err.message, message: "Failed to delete amenity" });
   }
}

module.exports = deleteAmenity;
