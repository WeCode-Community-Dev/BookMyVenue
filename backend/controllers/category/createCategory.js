const Categories = require("../../models/category");
const slugify = require("../../utils/slugify");

// POST /admin/categories   body: { name }
// identifier is derived from name and never exposed for manual editing —
// venues reference categories by identifier, so keeping it machine-generated
// avoids typo'd/duplicate slugs.
async function createCategory(req, res) {
   try {
      const { name } = req.body;
      if (!name || !name.trim()) {
         return res.status(400).json({ message: "name is required" });
      }

      const identifier = slugify(name);
      if (!identifier) {
         return res.status(400).json({ message: "name must contain at least one letter or number" });
      }

      const existing = await Categories.findOne({ identifier });
      if (existing) {
         return res.status(409).json({ message: "A category with this name already exists" });
      }

      const category = await Categories.create({ identifier, name: name.trim() });
      return res.status(201).json({ data: category });
   } catch (err) {
      if (err.code === 11000) {
         return res.status(409).json({ message: "A category with this name already exists" });
      }
      return res
         .status(500)
         .json({ error: err.message, message: "Failed to create category" });
   }
}

module.exports = createCategory;
