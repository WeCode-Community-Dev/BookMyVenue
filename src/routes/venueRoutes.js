import { Router } from "express";
import { body, param } from "express-validator";
import { venueController } from "../controllers/venueController.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import { validate } from "../middleware/validate.js";

const router = Router();

const idParam = [
  param("id").isInt({ min: 1 }).withMessage("Valid venue id is required"),
];

const createValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("pricePerHour")
    .isFloat({ min: 0 })
    .withMessage("Price per hour must be a positive number"),
  body("city").trim().notEmpty().withMessage("City is required"),
  body("district").trim().notEmpty().withMessage("District is required"),
  body("state").trim().notEmpty().withMessage("State is required"),
  body("latitude")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Valid latitude is required"),
  body("longitude")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Valid longitude is required"),
  body("country").trim().notEmpty().withMessage("Country is required"),
  body("capacity").isInt({ min: 1 }).withMessage("Capacity must be at least 1"),
  body("description").optional().isString(),
  body("amenities")
    .optional()
    .isObject()
    .withMessage("Amenities must be an object"),
];

const updateValidation = [
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
  body("pricePerHour")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price per hour must be a positive number"),
  body("city").optional().trim().notEmpty().withMessage("City cannot be empty"),
  body("district")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("District cannot be empty"),
  body("state")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("State cannot be empty"),
  body("latitude")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Valid latitude is required"),
  body("longitude")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Valid longitude is required"),
  body("country")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Country cannot be empty"),
  body("capacity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Capacity must be at least 1"),
  body("description").optional().isString(),
  body("amenities")
    .optional()
    .isObject()
    .withMessage("Amenities must be an object"),
];

router.get("/", venueController.list);
router.get("/:id", idParam, validate, venueController.getById);
router.post("/", authenticate, authorize("OWNER"), createValidation, validate, venueController.create);
router.put("/:id", authenticate, authorize("OWNER"), idParam, updateValidation, validate, venueController.update);
router.delete("/:id", authenticate, authorize("OWNER"), idParam, validate, venueController.remove);

export default router;
