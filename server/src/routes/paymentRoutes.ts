import { Router } from "express";
import { dummyPaymentSuccess } from "../controllers/paymentContoller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router=Router();

router.post(
    "/dummy-success",
    authMiddleware,
    allowRoles("customer"),
    dummyPaymentSuccess
);

export default router;


