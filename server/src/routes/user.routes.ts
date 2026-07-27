import { getHomeData } from '@/controllers/home.controller';
import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { authorizeRoles } from '@/middlewares/role.middleware';
import { validateRequest } from '@/middlewares/validateRequest';
import { withdrawSchema, updateProfileSchema } from '@/dto/user.dto';
import { getProfile, updateProfile, getUserBookings } from '@/controllers/user.controller';
import { getUserWallet, requestWithdrawal } from '@/controllers/wallet.controller';
import { getPaymentHistory } from '@/controllers/paymentHistory.controller';
import { upload } from '@/middlewares/upload.middleware';
import { getSuggestions } from '@/controllers/search.controller';
import { getWishlist, toggleWishlist } from '@/controllers/wishlist.controller';
import { requestPasswordChangeOtp, verifyAndChangePassword } from '@/controllers/password.controller';
import { resubmitOwner } from '@/controllers/owner.controller';

const router = Router();

router.get('/home', getHomeData);
router.get('/search', getSuggestions);

// Protected user routes — allow user/owner/admin to access their own profile/bookings
// (owner/admin roles are scoped to their own userId, not others')
router.use(authMiddleware);

router.get('/profile', getProfile);
router.put(
  '/profile',
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'profileImage', maxCount: 1 },
    { name: 'idProof', maxCount: 1 },
  ]),
  validateRequest(updateProfileSchema),
  updateProfile
);
// Only owners with role='owner' may re-apply (V-001: was accessible by all roles)
router.put('/owner/re-apply', authorizeRoles('owner'), resubmitOwner);
router.post('/profile/password/request-otp', requestPasswordChangeOtp);
router.patch('/profile/password/change', verifyAndChangePassword);

router.get('/bookings', getUserBookings);
router.get('/wallet', getUserWallet);
router.post('/wallet/withdraw', validateRequest(withdrawSchema), requestWithdrawal);
router.get('/payment-history', getPaymentHistory);

// Wishlist endpoints — venueId is always required in path to prevent silent no-op (V-008)
router.get('/wishlist', getWishlist);
router.post('/wishlist/toggle/:venueId', toggleWishlist);
router.delete('/wishlist/:venueId', toggleWishlist);
// Legacy: POST /wishlist (without venueId) removed — produced undefined venueId silently

export default router;
