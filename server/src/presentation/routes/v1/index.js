import { Router } from "express";
import AdminRoutes from './adminRoutes.js'
import VendorRoutes from './vendorRoutes.js'
import UserRoutes from './userRoutes.js'
import AuthRoutes from './authRoutes.js'
const router = Router();

router.use('/auth', AuthRoutes)
router.use('/admin', AdminRoutes)
router.use('/vendor', VendorRoutes)
router.use('/user', UserRoutes)


export default router;