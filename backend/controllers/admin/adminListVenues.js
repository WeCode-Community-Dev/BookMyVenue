const Venues = require("../../models/venue");
const { REVIEW_STATUSES } = require("../../constants/venue");
const {
   DEFAULT_PAGE,
   DEFAULT_LIMIT,
   CATEGORY_POPULATE,
   parsePageParam,
} = require("../venue/shared");

// Owner fields surfaced to the admin queue — enough to identify/contact the owner.
const OWNER_POPULATE = { path: "venueOwner", select: "name email" };

// Lean projection for the review table. Full venue data comes from the detail
// endpoint; the queue only needs what the table renders.
const LIST_FIELDS = "name city district venueCategory venueOwner status createdAt updatedAt";

// The queue is always sorted by submission time (updatedAt); only the direction
// is client-controlled. Map the two allowed sortOrder values to Mongo sort ints.
const SORT_DIRECTIONS = { asc: 1, desc: -1 };
const DEFAULT_SORT_ORDER = "desc";

// GET /admin/venues?status=<PENDING|CHANGES_PENDING>&sortOrder=<asc|desc>
// Paginated admin review queue. `status` is required and must be exactly one
// review status (the UI's two tabs each fetch one). PENDING = new venues awaiting
// first approval; CHANGES_PENDING = submitted edit copies awaiting re-approval.
// Results are sorted by submission time (updatedAt); sortOrder defaults to desc.
//   countOnly "true" — returns { data: { total } } with no venue docs (used to
//                       populate both tab count badges without fetching rows).
async function adminListVenues(req, res) {
   try {
      const { status } = req.query;
      if (!status) {
         return res.status(400).json({ message: "status query parameter is required" });
      }
      if (!REVIEW_STATUSES.includes(status)) {
         return res.status(400).json({
            message: `status must be one of: ${REVIEW_STATUSES.join(", ")}`,
         });
      }

      const filter = { status, deletedAt: null };

      if (req.query.countOnly === "true") {
         const total = await Venues.countDocuments(filter);
         return res.status(200).json({ data: { total } });
      }

      const sortOrder = req.query.sortOrder || DEFAULT_SORT_ORDER;
      if (!Object.hasOwn(SORT_DIRECTIONS, sortOrder)) {
         return res.status(400).json({
            message: `sortOrder must be one of: ${Object.keys(SORT_DIRECTIONS).join(", ")}`,
         });
      }

      const page = parsePageParam(req.query.page, DEFAULT_PAGE);
      const limit = parsePageParam(req.query.limit, DEFAULT_LIMIT);
      const skip = (page - 1) * limit;

      const [venues, total] = await Promise.all([
         Venues.find(filter)
            .select(LIST_FIELDS)
            .populate(CATEGORY_POPULATE)
            .populate(OWNER_POPULATE)
            .sort({ updatedAt: SORT_DIRECTIONS[sortOrder] })
            .skip(skip)
            .limit(limit)
            .lean(),
         Venues.countDocuments(filter),
      ]);

      return res.status(200).json({
         data: venues,
         pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
   } catch (err) {
      return res.status(500).json({ error: err.message, message: "Failed to fetch venues" });
   }
}

module.exports = adminListVenues;
