const express = require("express");
const authenticate = require("../middleware/authenticate");
const requireRole = require("../middleware/requireRole");
const { USER_ROLES } = require("../constants/user");
const venueOwnerListVenues  = require("../controllers/venue/venueOwnerListVenues");
const venueOwnerGetVenueById = require("../controllers/venue/venueOwnerGetVenueById");
const venueOwnerCreateVenue = require("../controllers/venue/venueOwnerCreateVenue");
const venueOwnerSubmitVenue = require("../controllers/venue/venueOwnerSubmitVenue");
const venueOwnerUpdateVenue = require("../controllers/venue/venueOwnerUpdateVenue");
const venueOwnerGetVenueForEdit = require("../controllers/venue/venueOwnerGetVenueForEdit");
const venueOwnerReEditRejectedVenue = require("../controllers/venue/venueOwnerReEditRejectedVenue");
const setVenueVisibility    = require("../controllers/venue/setVenueVisibility");
const venueOwnerDeleteVenue = require("../controllers/venue/venueOwnerDeleteVenue");

const router = express.Router();

// All routes in this file require a valid venueOwner session.
router.use(authenticate, requireRole(USER_ROLES.VENUE_OWNER));

router.get("/venues",                    venueOwnerListVenues);
router.get("/venues/:id",                venueOwnerGetVenueById);
router.post("/venues",                   venueOwnerCreateVenue);
router.post("/venues/submit/:id",        venueOwnerSubmitVenue);
router.post("/getVenueForEdit/:id",      venueOwnerGetVenueForEdit);
router.post("/reEditRejectedVenue/:id",  venueOwnerReEditRejectedVenue);
router.patch("/venues/update/:id",       venueOwnerUpdateVenue);
router.patch("/venues/visibility/:id",   setVenueVisibility);
router.delete("/venues/delete/:id",      venueOwnerDeleteVenue);

module.exports = router;
