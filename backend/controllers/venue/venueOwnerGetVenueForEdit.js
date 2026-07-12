const mongoose = require("mongoose");
const Venues = require("../../models/venue");
const { VENUE_STATUSES } = require("../../constants/venue");
const { buildEditDraftSeed, VENUE_POPULATE, OWNER_HIDDEN_FIELDS } = require("./shared");

// POST /venueOwner/getVenueForEdit/:id
// Starts (or resumes) editing of a live APPROVED venue. Editing an APPROVED
// venue never mutates it in place; instead an EDIT_DRAFT copy (editOf -> original)
// is worked on, then submitted as CHANGES_PENDING for admin re-approval.
//
// :id is the APPROVED original. This endpoint is idempotent on the open edit copy:
//   - existing EDIT_DRAFT copy  -> return it (resume the in-progress edit)
//   - existing CHANGES_PENDING  -> 409 (edits already submitted, awaiting admin)
//   - existing REJECTED copy    -> 409 (re-editing a rejection is a separate API)
//   - no copy yet               -> create a fresh EDIT_DRAFT seeded from the original
async function venueOwnerGetVenueForEdit(req, res) {
   try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
         return res.status(400).json({ message: "Invalid venue id" });
      }

      const original = await Venues.findOne({
         _id: id,
         venueOwner: req.user._id,
         deletedAt: null,
      });

      if (!original) {
         return res.status(404).json({ message: "Venue not found" });
      }

      if (original.status !== VENUE_STATUSES.APPROVED) {
         return res.status(400).json({
            message: 'Only venues with "APPROVED" status can be taken under edit',
         });
      }

      // An edit copy already in admin review blocks starting a new one. The owner
      // must wait for the admin decision before editing again.
      const pendingCopy = await Venues.findOne({
         editOf: original._id,
         status: VENUE_STATUSES.CHANGES_PENDING,
         deletedAt: null,
      }).select("_id").lean();

      if (pendingCopy) {
         return res.status(409).json({
            message: "Edits for this venue have already been submitted for approval",
         });
      }

      // A rejected edit copy is not resumable through this endpoint. Re-editing a
      // rejection is a distinct flow (the owner reviews the rejection reason first,
      // and the copy-vs-new-venue branching differs), handled by a dedicated API.
      const rejectedCopy = await Venues.findOne({
         editOf: original._id,
         status: VENUE_STATUSES.REJECTED,
         deletedAt: null,
      }).select("_id").lean();

      if (rejectedCopy) {
         return res.status(409).json({
            message:
               "This venue's edit was rejected by an admin. Use POST /venueOwner/reEditRejectedVenue/:id to review the rejection and edit it again.",
         });
      }

      // Resume an in-progress edit copy if one exists (idempotent — never spawn a
      // second EDIT_DRAFT for the same original).
      const existingDraft = await Venues.findOne({
         editOf: original._id,
         status: VENUE_STATUSES.EDIT_DRAFT,
         deletedAt: null,
      })
         .select(OWNER_HIDDEN_FIELDS)
         .populate(VENUE_POPULATE)
         .lean();

      if (existingDraft) {
         return res.status(200).json({ data: existingDraft });
      }

      const created = await Venues.create(buildEditDraftSeed(original));
      const editDraft = await Venues.findById(created._id)
         .select(OWNER_HIDDEN_FIELDS)
         .populate(VENUE_POPULATE)
         .lean();

      return res.status(200).json({ data: editDraft });
   } catch (err) {
      return res.status(500).json({ error: err.message, message: "Failed to start venue edit" });
   }
}

module.exports = venueOwnerGetVenueForEdit;
