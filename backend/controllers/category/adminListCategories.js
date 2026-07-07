const Categories = require("../../models/category");

// GET /admin/categories
// Full management list for the admin UI: includes inactive rows (deletedAt:
// null) so admins can see and reactivate a retired category, not just the
// ones live on the public site.
async function adminListCategories(req, res) {
   try {
      const categories = await Categories.find({ deletedAt: null })
         .select("name isActive")
         .sort({ name: 1 })
         .lean();

      return res.status(200).json({ data: categories });
   } catch (err) {
      return res
         .status(500)
         .json({ error: err.message, message: "Failed to fetch categories" });
   }
}

module.exports = adminListCategories;