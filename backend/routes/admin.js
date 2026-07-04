const express = require("express");
const authenticate = require("../middleware/authenticate");
const requireRole = require("../middleware/requireRole");
const { USER_ROLES } = require("../constants/user");
const adminListVenues = require("../controllers/admin/adminListVenues");

const router = express.Router();

// All routes in this file require a valid admin session.
router.use(authenticate, requireRole(USER_ROLES.ADMIN));

router.get("/venues", adminListVenues);

module.exports = router;
