const Categories = require("../../models/category");

const PUBLIC_FIELDS = "identifier name";

// filter dropdown and for resolving category labels
async function listCategories(req, res) {
   try {
      const categories = await Categories.find({ isActive: true, deletedAt: null })
         .select(PUBLIC_FIELDS)
         .sort({ name: 1 })
         .lean();

      return res.status(200).json({ data: categories });
   } catch (err) {
      return res
         .status(500)
         .json({ error: err.message, message: "Failed to fetch categories" });
   }
}

module.exports = listCategories;
