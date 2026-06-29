import { Router } from "express";
import { body, param } from "express-validator";
import { bookingController } from "../controllers/bookingController.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import { validate } from "../middleware/validate.js";
import { requireUtcIsoDatetime } from "../utils/utcDateValidation.js";

const router = Router();

const idParam = [param("id").isInt({ min: 1 }).withMessage("Valid booking id is required")];

// ISO 8601 = standard date/time string format (see utcDateValidation.js).
// isISO8601() accepts many shapes; isUTCDatetime() restricts to UTC (Z or +00:00).
const isUTCDatetime = (field) =>
  body(field)
    .isISO8601({ strict: true, strictSeparator: true })
    .withMessage(`${field} must be a valid ISO 8601 datetime`)
    .custom(requireUtcIsoDatetime(field));

const createValidation = [
  body("venueId").isInt({ min: 1 }).withMessage("Valid venue id is required"),
  isUTCDatetime("bookingFrom"),
  isUTCDatetime("bookingTo"),
];

router.post("/", authenticate, authorize("CUSTOMER"), createValidation, validate, bookingController.create);
router.get("/", authenticate, authorize("CUSTOMER"), bookingController.listMine);
router.patch("/:id/cancel", authenticate, authorize("CUSTOMER"), idParam, validate, bookingController.cancel);

export default router;
