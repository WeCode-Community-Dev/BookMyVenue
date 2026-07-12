const Categories = require("../../models/category");

// DELETE /admin/categories/:id
// Soft delete: marks deletedAt + isActive false rather than removing the doc,
// so venues that already reference this category (by _id) don't end up with a
// dangling ref.
async function deleteCategory(req, res) {
   try {
      const { id } = req.params;

      const category = await Categories.findOneAndUpdate(
         { _id: id, deletedAt: null },
         { deletedAt: new Date(), isActive: false },
         { new: true }
      );

      if (!category) {
         return res.status(404).json({ message: "Category not found" });
      }

      return res.status(200).json({ data: category });
   } catch (err) {
      return res
         .status(500)
         .json({ error: err.message, message: "Failed to delete category" });
   }
}

module.exports = deleteCategory;
