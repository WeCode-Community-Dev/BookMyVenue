const Amenities = require("../../models/amenity");

// GET /admin/amenities
// Full management list for the admin UI: includes inactive/soft-deleted-excluded
// rows (deletedAt: null) regardless of isActive, so admins can see and
// reactivate a retired amenity, not just the ones live on the public site.
async function adminListAmenities(req, res) {
   try {
      const amenities = await Amenities.find({ deletedAt: null })
         .select("name isActive")
         .sort({ name: 1 })
         .lean();

      return res.status(200).json({ data: amenities });
   } catch (err) {
      return res
         .status(500)
         .json({ error: err.message, message: "Failed to fetch amenities" });
   }
}

module.exports = adminListAmenities;