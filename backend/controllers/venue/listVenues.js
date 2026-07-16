const Venues = require("../../models/venue");
const {
   DEFAULT_PAGE,
   DEFAULT_LIMIT,
   PUBLIC_FIELDS,
   CATEGORY_POPULATE,
   parsePageParam,
   buildVenueFilter,
   parseSortParam,
} = require("./shared");

// GET /venues — public, paginated, filterable list of APPROVED venues.
//
// Query params:
//   page        integer  ≥1        (default 1)
//   limit       integer  ≥1        (default 20)
//   district    string             case-insensitive exact match
//   category    string             venue category identifier (e.g. "resort")
//   minPrice    number             basePrice ≥ minPrice
//   maxPrice    number             basePrice ≤ maxPrice
async function listVenues(req, res) {
   try {
      const page = parsePageParam(req.query.page, DEFAULT_PAGE);
      const limit = parsePageParam(req.query.limit, DEFAULT_LIMIT);
      const skip = (page - 1) * limit;

      const { district, category, minPrice, maxPrice, sort } = req.query;

      const filter = await buildVenueFilter({ district, category, minPrice, maxPrice });
      const sortSpec = parseSortParam(sort);

      const [venues, total] = await Promise.all([
         Venues.find(filter)
            .select(PUBLIC_FIELDS)
            .populate(CATEGORY_POPULATE)
            .sort(sortSpec)
            .skip(skip)
            .limit(limit)
            .lean(),
         Venues.countDocuments(filter),
      ]);

      return res.status(200).json({
         data: venues,
         pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
         },
      });
   } catch (err) {
      return res
         .status(500)
         .json({ error: err.message, message: "Failed to fetch venues" });
   }
}

module.exports = listVenues;