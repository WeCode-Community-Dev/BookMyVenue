import express from "express";
import { activateVenue, createVenue, deactivateVenue, getAllVenues, getMyVenues, getPublicVenueById,
  getVenueById, updateVenue} from "../controllers/venueController.js";
import userAuthMiddleware from "../middleware/userAuthMiddleware.js";
import authorizeRoles from "../middleware/authorizeRoles.js";
import upload from "../middleware/upload.js";

const router = express.Router();


router.post("/create", userAuthMiddleware,authorizeRoles("provider"),upload.array("images", 5), createVenue);

router.get("/my-venues",userAuthMiddleware,authorizeRoles("provider"),getMyVenues);

router.get("/provider/:id",userAuthMiddleware,authorizeRoles("provider"),getVenueById);

router.put("/update/:id",userAuthMiddleware,authorizeRoles("provider"),upload.array("images",5),updateVenue);

router.patch("/deactivate/:id",userAuthMiddleware,authorizeRoles("provider"),deactivateVenue);

router.patch("/activate/:id",userAuthMiddleware,authorizeRoles("provider"),activateVenue);

//public apis for veune and details
router.get("/",getAllVenues)
router.get('/:venueId', getPublicVenueById)


export default router;