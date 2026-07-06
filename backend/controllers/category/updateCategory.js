const Categories = require("../../models/category");

// PATCH /admin/categories/:id   body: { name?, isActive? }
// identifier is intentionally immutable after creation (venues store the
// identifier, not the id/name, so changing it would silently break them).
async function updateCategory(req, res) {
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
      return res
         .status(500)
         .json({ error: err.message, message: "Failed to update category" });
   }
}

module.exports = updateCategory;
