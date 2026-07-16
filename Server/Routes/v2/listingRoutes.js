import express from "express";
import {
  bookVenue,
  getAll,
  getBookedDates,
  getBookedVenue,
  getOne,
  getVenueOrg,
  handleDelete,
  handleEdit,
  handleRegister,
  verifyVenue,
} from "../../Controllers/listControllers.js";
import upload from "../../Middlewares/multer.js";

const listingRoutes = express.Router();

listingRoutes.get("/getAll", getAll);
listingRoutes.get("/getOne/:id", getOne);
listingRoutes.post("/register", upload.single("image"), handleRegister);
listingRoutes.delete("/delete/:venueId", handleDelete);
listingRoutes.put("/edit/:venueId", upload.single("image"), handleEdit);
listingRoutes.put("/verify/:id", verifyVenue);

listingRoutes.get("/venueOrg/:id", getVenueOrg);
listingRoutes.get("/:id/booked-dates", getBookedDates);
listingRoutes.post("/:id/book", bookVenue); 

listingRoutes.get("/:id/venueBook", getBookedVenue);
export default listingRoutes;
