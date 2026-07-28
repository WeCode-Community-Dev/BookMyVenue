const express = require("express");
const authenticate = require("../middleware/authenticate");
const requireRole = require("../middleware/requireRole");
const { USER_ROLES } = require("../constants/user");
const createBooking = require("../controllers/booking/createBooking");

const router = express.Router();

router.use(authenticate, requireRole(USER_ROLES.CUSTOMER));

router.post("/", createBooking);

module.exports = router;
