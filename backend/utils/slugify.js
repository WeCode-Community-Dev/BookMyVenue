// Turns a human-readable name into a URL/identifier-safe slug.
// "Swimming Pool!" -> "swimming-pool"
function slugify(input) {
   return String(input)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
}

module.exports = slugify;
