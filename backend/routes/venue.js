const express = require("express");
const listVenues = require("../controllers/venue/listVenues");
const getVenueById = require("../controllers/venue/getVenueById");
const getVenueAvailability = require("../controllers/venue/getVenueAvailability");

const router = express.Router();

router.get("/", listVenues);
router.get("/:id", getVenueById);
router.get("/:id/availability", getVenueAvailability);

module.exports = router;
