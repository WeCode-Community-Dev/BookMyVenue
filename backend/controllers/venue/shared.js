const {
   VENUE_STATUSES,
   SUBMITTABLE_STATUSES,
   DELETABLE_STATUSES,
   IN_PLACE_EDIT_STATUSES,
   REEDITABLE_STATUSES,
} = require("../../constants/venue");
const Categories = require("../../models/category");

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

const PUBLIC_VENUE_FILTER = {
   status: VENUE_STATUSES.APPROVED,
   // isActive: true, keep commented for now
   deletedAt: null,
};

const PUBLIC_FIELDS = "name description venueCategory amenities capacity addressLine state district city pincode location basePrice images createdAt";

// Populate specs for a venue's referenced lookups. Every venue read that
// resolves the category label also resolves amenity labels, so callers spread
// VENUE_POPULATE rather than passing CATEGORY_POPULATE alone.
const CATEGORY_POPULATE = { path: "venueCategory", select: "identifier name" };
const AMENITIES_POPULATE = { path: "amenities", select: "identifier name" };
const VENUE_POPULATE = [CATEGORY_POPULATE, AMENITIES_POPULATE];

function parsePageParam(rawValue, fallback) {
   const parsed = Number.parseInt(rawValue, 10);
   if (Number.isNaN(parsed) || parsed < 1) return fallback;
   return parsed;
}

// Resolves a category identifier string (e.g. "resort") to its ObjectId.
// Returns null if the identifier doesn't match any active category — which
// will cause the query to return zero results (correct behaviour: unknown
// category = no matches, not an error).
async function resolveCategoryId(identifier) {
   if (!identifier) return undefined;
   const cat = await Categories.findOne({
      identifier: identifier.toLowerCase().trim(),
      isActive: true,
      deletedAt: null,
   }).select("_id").lean();
   return cat ? cat._id : null;
}

// Builds the MongoDB filter for the public venue listing.
// Always starts from PUBLIC_VENUE_FILTER (approved + not deleted) and
// optionally layers on district, category, and price constraints.
async function buildVenueFilter({ district, category, minPrice, maxPrice } = {}) {
   const filter = { ...PUBLIC_VENUE_FILTER };

   if (district) {
      // Case-insensitive exact match on district name.
      filter.district = { $regex: new RegExp(`^${district.trim()}$`, "i") };
   }

   if (category) {
      const categoryId = await resolveCategoryId(category);
      // null means the identifier was provided but matched nothing — force zero results.
      // undefined means it was not provided — skip the filter.
      if (categoryId !== undefined) {
         filter.venueCategory = categoryId;
      }
   }

   if (minPrice !== undefined || maxPrice !== undefined) {
      filter.basePrice = {};
      const min = Number(minPrice);
      const max = Number(maxPrice);
      if (!Number.isNaN(min)) filter.basePrice.$gte = min;
      if (!Number.isNaN(max)) filter.basePrice.$lte = max;
      // If both were provided and unparseable, drop the empty object.
      if (Object.keys(filter.basePrice).length === 0) delete filter.basePrice;
   }

   return filter;
}

// Status gate per venue owner action: the statuses that permit it, and the
// past-tense verb for the 400 message. Single source of truth so the guard and
// its error message can't drift apart.
const STATUS_GATE_BY_ACTION = {
   submit: { statuses: SUBMITTABLE_STATUSES, verb: "submitted" },
   delete: { statuses: DELETABLE_STATUSES, verb: "deleted" },
   edit:   { statuses: IN_PLACE_EDIT_STATUSES, verb: "edited" },
   reEdit: { statuses: REEDITABLE_STATUSES, verb: "re-edited" },
};

// Builds the 400 message for a status-gated venue owner action, looking the
// allowed list up by action so it never drifts from the guard. Quotes each
// status and joins grammatically:
//   ["DRAFT"]                         → Only venues with status "DRAFT" can be deleted
//   ["DRAFT","EDIT_DRAFT"]            → ... "DRAFT" or "EDIT_DRAFT" can be deleted
//   ["DRAFT","EDIT_DRAFT","REJECTED"] → ... "DRAFT", "EDIT_DRAFT" or "REJECTED" can be deleted
function statusNotAllowedMessage(action) {
   const { statuses, verb } = STATUS_GATE_BY_ACTION[action];
   const quoted = statuses.map((status) => `"${status}"`);
   const list = quoted.length === 1
      ? quoted.join("")
      : `${quoted.slice(0, -1).join(", ")} or ${quoted.at(-1)}`;
   return `Only venues with status ${list} can be ${verb}`;
}

// Venue owner-side projection
const OWNER_HIDDEN_FIELDS = "-deletedAt -__v";

// Fields a venue owner may set on a venue. Never spread req.body directly — pick from this list
// so venueOwner/status/editOf/isActive cannot be client-set.
const EDITABLE_VENUE_FIELDS = [
   "name", "description", "venueCategory", "amenities", "capacity",
   "addressLine", "city", "district", "state", "pincode",
   "location", "basePrice", "images",
];

// Fields that must be present before a draft can be submitted for review.
// Drafts persist incomplete (model fields default to "" / null), so completeness
// is enforced here at submit time. `location` and `images`
// are intentionally omitted — coordinates are optional and images are not yet
// part of the MVP upload pipeline.
const REQUIRED_VENUE_FIELDS = [
   "name", "description", "venueCategory", "amenities", "capacity",
   "addressLine", "city", "district", "state", "pincode", "basePrice",
];

// Returns the REQUIRED_VENUE_FIELDS that are missing/empty on a venue document.
// Empty string, null, undefined, NaN, and empty array all count as missing (the
// last so a venue must carry at least one amenity); a 0 capacity or price is
// allowed through here (the schema's min:0 governs range separately).
function missingRequiredVenueFields(venue) {
   return REQUIRED_VENUE_FIELDS.filter((field) => {
      const value = venue[field];
      if (value === null || value === undefined) return true;
      if (typeof value === "string" && value.trim() === "") return true;
      if (typeof value === "number" && Number.isNaN(value)) return true;
      if (Array.isArray(value) && value.length === 0) return true;
      return false;
   });
}

// Builds the seed for a new EDIT_DRAFT copy of an APPROVED venue: every editable
// content field copied from the original, plus the copy-identifying fields
// (status + editOf). venueOwner is carried from the original so ownership is
// preserved. Nothing else (isActive/rejectionReason/timestamps) is copied —
// those take their model defaults on the fresh document.
function buildEditDraftSeed(original) {
   const seed = {
      venueOwner: original.venueOwner,
      editOf: original._id,
      status: VENUE_STATUSES.EDIT_DRAFT,
   };
   for (const field of EDITABLE_VENUE_FIELDS) {
      seed[field] = original[field];
   }
   return seed;
}

module.exports = {
   DEFAULT_PAGE,
   DEFAULT_LIMIT,
   PUBLIC_VENUE_FILTER,
   PUBLIC_FIELDS,
   CATEGORY_POPULATE,
   AMENITIES_POPULATE,
   VENUE_POPULATE,
   OWNER_HIDDEN_FIELDS,
   EDITABLE_VENUE_FIELDS,
   REQUIRED_VENUE_FIELDS,
   missingRequiredVenueFields,
   buildEditDraftSeed,
   statusNotAllowedMessage,
   parsePageParam,
   buildVenueFilter,
};