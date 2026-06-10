import { Router } from "express";
import authRouter from "./authRouter.js";
import venueRouter from "./venueRouter.js";


const router = Router();


console.log("Routes file loaded");


router.use('/auth',authRouter)
router.use(venueRouter)


export default router;

