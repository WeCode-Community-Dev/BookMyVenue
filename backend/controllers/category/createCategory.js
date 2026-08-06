const Categories = require("../../models/category");
const slugify = require("../../utils/slugify");

// POST /admin/categories   body: { name }
// identifier is derived from name (never accepted from the request) and acts as
// a normalized dedup key: it collapses casing/spacing/punctuation so "Banquet
// Hall" and "banquet hall" resolve to the same slug and can't both be created.
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
