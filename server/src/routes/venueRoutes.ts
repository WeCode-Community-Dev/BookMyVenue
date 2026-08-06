import express from "express";
import {
  createVenue,
  getMyVenues,
  getPendingVenues,
  getVenueDetailsForAdmin,
  viewVenueDocumentForAdmin,
  approveVenue,
  rejectVenue,
  getApprovedVenues,
  getPublicVenueDetails,
  getOwnerVenueDetails,
  updateVenue,
  deleteVenue,
} from "../controllers/venueController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { uploadVenueDocuments } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, allowRoles("owner"), uploadVenueDocuments, createVenue);

router.get("/my-venues", authMiddleware, allowRoles("owner"), getMyVenues);

router.get("/owner/:id", authMiddleware, allowRoles("owner"), getOwnerVenueDetails);

router.put("/owner/:id", authMiddleware, allowRoles("owner"), uploadVenueDocuments, updateVenue);

router.delete("/owner/:id",authMiddleware,allowRoles("owner"),deleteVenue);

router.get("/", getApprovedVenues);

router.get("/:id", getPublicVenueDetails);

router.get( "/admin/pending", authMiddleware, allowRoles("root_admin"), getPendingVenues);

router.get( "/admin/:id", authMiddleware, allowRoles("root_admin"), getVenueDetailsForAdmin);

router.get("/admin/documents/:documentId/view", authMiddleware, allowRoles("root_admin"),  viewVenueDocumentForAdmin);

router.patch("/admin/:id/approve", authMiddleware,  allowRoles("root_admin"), approveVenue );

router.patch("/admin/:id/reject", authMiddleware,  allowRoles("root_admin"), rejectVenue);


export default router;