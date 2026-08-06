const Venues = require("../../models/venue");
const { VENUE_STATUS_VALUES, VENUE_STATUSES } = require("../../constants/venue");
const {
   DEFAULT_PAGE,
   DEFAULT_LIMIT,
   CATEGORY_POPULATE,
   OWNER_HIDDEN_FIELDS,
   parsePageParam,
} = require("./shared");

// Statuses an edit copy (editOf set) can hold. Used two ways:
//   1. The list filter: when any of these is requested we must NOT force
//      editOf:null, or edit copies (incl. rejected edits) get filtered out.
//   2. attachEditStatus: labels an APPROVED venue's Edit button with its copy's
//      status. An original has at most one copy at a time (getVenueForEdit is
//      idempotent and 409s while a REJECTED copy exists; re-editing flips that
//      copy in place rather than spawning a second), so a single status per
//      original is well-defined.
// REJECTED also occurs on standalone originals, but attachEditStatus's query is
// scoped by editOf, so it only ever matches copies here.
const EDIT_COPY_STATUSES = [
   VENUE_STATUSES.EDIT_DRAFT,
   VENUE_STATUSES.CHANGES_PENDING,
   VENUE_STATUSES.REJECTED,
];

// Marks each APPROVED venue in the list with `editStatus`: the status of its
// edit copy ("EDIT_DRAFT" = venue owner is editing, "CHANGES_PENDING" = edits
// submitted and awaiting admin, "REJECTED" = last edit was rejected), or null
// when no copy exists. Lets the venue owner UI relabel/guard the Edit button
// without a per-row request. One extra query for the whole page. Non-APPROVED
// venues are left untouched (editStatus only ever applies to a live original).
async function attachEditStatus(venues, ownerId) {
   const approvedIds = venues
      .filter((v) => v.status === VENUE_STATUSES.APPROVED)
      .map((v) => v._id);

   if (approvedIds.length === 0) return venues;

   const copiesOfApprovedVenues = await Venues.find({
      venueOwner: ownerId,
      editOf: { $in: approvedIds },
      status: { $in: EDIT_COPY_STATUSES },
      deletedAt: null,
   })
      .select("editOf status")
      .lean();

   // original id -> copy status. At most one copy per original exists at a time
   // (getVenueForEdit is idempotent), so this mapping is unambiguous.
   const statusByOriginal = new Map(copiesOfApprovedVenues.map((c) => [String(c.editOf), c.status]));

   for (const venue of venues) {
      if (venue.status === VENUE_STATUSES.APPROVED) {
         venue.editStatus = statusByOriginal.get(String(venue._id)) ?? null;
      }
   }
   return venues;
}

// GET /venueOwner/venues — paginated venue owner venue list based on statuses passed.
// Query params:
//   status  comma-separated status values (e.g. "APPROVED" or "DRAFT,EDIT_DRAFT")
//   page    integer ≥1 (default 1)
//   limit   integer ≥1 (default 20)
//   countOnly "true" — returns { data: { total } } with no venue docs
async function venueOwnerListVenues(req, res) {
   try {
      const page = parsePageParam(req.query.page, DEFAULT_PAGE);
      const limit = parsePageParam(req.query.limit, DEFAULT_LIMIT);
      const skip = (page - 1) * limit;

      const filter = { venueOwner: req.user._id, deletedAt: null };

      if (req.query.status) {
         const requested = req.query.status.split(",").map(s => s.trim()).filter(s => VENUE_STATUS_VALUES.includes(s));
         if (requested.length === 0) return res.status(400).json({ message: "Invalid status value(s)" });
         filter.status = { $in: requested };
         // Only exclude edit copies when none of the requested statuses can appear
         // on a copy (else rejected/in-review edit copies would be filtered out).
         const hasCopyStatus = requested.some(s => EDIT_COPY_STATUSES.includes(s));
         if (!hasCopyStatus) filter.editOf = null;
      } else {
         // No status filter — exclude copies so venue owner doesn't see duplicates
         filter.editOf = null;
      }

      if (req.query.countOnly === 'true') {
         const total = await Venues.countDocuments(filter);
         return res.status(200).json({ data: { total } });
      }

      const [venues, total] = await Promise.all([
         Venues.find(filter)
            .select(OWNER_HIDDEN_FIELDS)
            .populate(CATEGORY_POPULATE)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
         Venues.countDocuments(filter),
      ]);

      await attachEditStatus(venues, req.user._id);

      return res.status(200).json({
         data: venues,
         pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
   } catch (err) {
      return res.status(500).json({ error: err.message, message: "Failed to fetch venues" });
   }
}

module.exports = venueOwnerListVenues;
