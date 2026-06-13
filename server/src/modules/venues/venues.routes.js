
import { Router } from "express";
import { deleteVenue, getVenueById, getVenues, createVenue, updateVenue } from "./venues.controller.js";
import { authenticate }  from './../../shared/middlewares/auth.middleware.js';
import { authorize }  from './../../shared/middlewares/authorize.middleware.js';
import { validate }  from '../../shared/middlewares/validate.middleware.js';
import { createVenueSchema, updateVenueSchema } from "./venues.validation.js";
import upload from "../../shared/middlewares/upload.middleware.js";

const venueRoutes = Router();


venueRoutes.post(
    "/" ,
    authenticate, 
    authorize("OWNER"), 
    validate(createVenueSchema),
    createVenue
);

venueRoutes.get(
    "/",
    getVenues
);

venueRoutes.get(
    "/:id", 
    getVenueById

);


venueRoutes.patch(
    "/:id",
    authenticate,
    authorize("OWNER"),
    upload.array("images", 5),
    validate(updateVenueSchema),
    updateVenue
 );

venueRoutes.delete(
    "/:id", 
    authenticate, 
    authorize("OWNER"), 
    deleteVenue
);


export default venueRoutes;


