const express = require("express");
const authenticate = require("../middleware/authenticate");
const requireRole = require("../middleware/requireRole");
const { USER_ROLES } = require("../constants/user");
const adminListVenues = require("../controllers/admin/adminListVenues");
const adminGetVenueById = require("../controllers/admin/adminGetVenueById");

const adminListAmenities = require("../controllers/amenity/adminListAmenities");
const createAmenity = require("../controllers/amenity/createAmenity");
const updateAmenity = require("../controllers/amenity/updateAmenity");
const deleteAmenity = require("../controllers/amenity/deleteAmenity");

const adminListCategories = require("../controllers/category/adminListCategories");
const createCategory = require("../controllers/category/createCategory");
const updateCategory = require("../controllers/category/updateCategory");
const deleteCategory = require("../controllers/category/deleteCategory");

const router = express.Router();

// All routes in this file require a valid admin session.
router.use(authenticate, requireRole(USER_ROLES.ADMIN));

router.get("/venues", adminListVenues);
router.get("/venues/:id", adminGetVenueById);

// Amenities management (Venue Options page)
router.get("/amenities", adminListAmenities);
router.post("/amenities", createAmenity);
router.patch("/amenities/:id", updateAmenity);
router.delete("/amenities/:id", deleteAmenity);

// Categories management (Venue Options page)
router.get("/categories", adminListCategories);
router.post("/categories", createCategory);
router.patch("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

module.exports = router;
