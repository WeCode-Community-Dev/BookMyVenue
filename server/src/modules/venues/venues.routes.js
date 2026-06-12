
import { Router } from "express";

import { registerVenueSchema } from "./venues.validation.js";
import { deleteVenue, getVenueById, getVenues, registerVenue, updateVenue } from "./venues.controller.js";
import { authenticate } from './../../shared/middlewares/auth.middleware.js';

const Venuerouter = Router();


Venuerouter.post("/register" ,registerVenue);


Venuerouter.get("/", getVenues);

Venuerouter.get("/:id", getVenueById);
Venuerouter.put("/:id", updateVenue);
Venuerouter.delete("/:id", deleteVenue);



export default Venuerouter;


