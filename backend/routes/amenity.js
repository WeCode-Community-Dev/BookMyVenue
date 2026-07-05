const express = require("express");
const listAmenities = require("../controllers/amenity/listAmenities");

const router = express.Router();

router.get("/", listAmenities);

module.exports = router;
