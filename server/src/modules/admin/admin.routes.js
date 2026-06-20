import { Router } from "express";
import { updateVenueStatusSchema } from "./admin.validation.js";
import { updateVenueStatusController } from "./admin.controller.js";
import { authenticate }  from './../../shared/middlewares/auth.middleware.js';
import { authorize }  from './../../shared/middlewares/authorize.middleware.js';
import { validate }  from '../../shared/middlewares/validate.middleware.js';


const adminRoutes = Router();

adminRoutes.patch(
    "/venues/:id/status",
    authenticate,
    authorize("ADMIN"),
    validate(updateVenueStatusSchema),
    updateVenueStatusController
  );

  export default adminRoutes;
