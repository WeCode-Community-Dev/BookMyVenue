const Categories = require("../../models/category");
const slugify = require("../../utils/slugify");

// PATCH /admin/categories/:id   body: { name?, isActive? }
// When name changes, the identifier is recomputed and the same duplicate
// check createCategory does is re-run (excluding this row), so a rename can't
// collide with an existing category the way a plain name update used to.
async function updateCategory(req, res) {
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

         const existing = await Categories.findOne({ identifier, _id: { $ne: id } });
         if (existing) {
            return res.status(409).json({ message: "A category with this name already exists" });
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

      const category = await Categories.findOneAndUpdate(
         { _id: id, deletedAt: null },
         update,
         { new: true, runValidators: true }
      );

      if (!category) {
         return res.status(404).json({ message: "Category not found" });
      }

      return res.status(200).json({ data: category });
   } catch (err) {
      if (err.code === 11000) {
         return res.status(409).json({ message: "A category with this name already exists" });
      }
      return res
         .status(500)
         .json({ error: err.message, message: "Failed to update category" });
   }
}

module.exports = updateCategory;