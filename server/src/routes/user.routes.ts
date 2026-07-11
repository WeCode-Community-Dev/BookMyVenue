import { getHomeData } from '@/controllers/home.controller';
import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { authorizeRoles } from '@/middlewares/role.middleware';
import { getProfile, updateProfile, getUserBookings } from '@/controllers/user.controller';
import { getUserWallet } from '@/controllers/wallet.controller';
import { getPaymentHistory } from '@/controllers/paymentHistory.controller';
import { upload } from '@/middlewares/upload.middleware';
import { getSuggestions } from '@/controllers/search.controller';
import { getWishlist, toggleWishlist } from '@/controllers/wishlist.controller';
import { requestPasswordChangeOtp, verifyAndChangePassword } from '@/controllers/password.controller';

const router = Router();

router.get('/home', getHomeData);
router.get('/search', getSuggestions);

// Protected user routes
router.use(authMiddleware);

router.get('/profile', getProfile);
router.put(
  '/profile',
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'profileImage', maxCount: 1 },
    { name: 'idProof', maxCount: 1 },
  ]),
  updateProfile
);
router.post('/profile/password/request-otp', requestPasswordChangeOtp);
router.patch('/profile/password/change', verifyAndChangePassword);
router.get('/bookings', getUserBookings);
router.get('/wallet', getUserWallet);
router.get('/payment-history', getPaymentHistory);

router.get('/wishlist', getWishlist);
router.post('/wishlist/toggle/:venueId', toggleWishlist);

// Public routes

router.use(authorizeRoles('user'));

export default router;
