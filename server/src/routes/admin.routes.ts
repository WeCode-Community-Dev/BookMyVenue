import { Router } from 'express';
import * as categoryController from '@/controllers/category.controller';
import * as userController from '@/controllers/user.controller';
import * as adminVenueController from '@/controllers/admin-venue.controller';
import * as settlementController from '@/controllers/settlement.controller';
import * as dashboardController from '@/controllers/dashboard.controller';
import { upload } from '@/middlewares/upload.middleware';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { authorizeRoles } from '@/middlewares/role.middleware';
import { validateInputs, validateObjectId, validateQuery } from '@/middlewares/validate.middleware';
import { getAdminVenuesQuerySchema } from '@/dto/admin/get-venues.dto';
import { rejectVenueSchema } from '@/dto/admin/reject-venue.dto';
import * as ownerController from '@/controllers/owner.controller';

const router = Router();

// Protect all admin routes
router.use(authMiddleware, authorizeRoles('admin'));

// Dashboard
router.route('/dashboard').get(dashboardController.adminDashboardController);

// Categories
router
  .route('/categories')
  .get(categoryController.getCategories)
  .post(upload.single('image'), categoryController.createCategory);

router
  .route('/categories/:id')
  .get(categoryController.getCategory)
  .patch(upload.single('image'), categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

router.route('/categories/:id/restore').patch(categoryController.restoreCategory);

// Users
router.route('/users').get(userController.getUsers);
router.route('/users/:id').get(userController.getUser);
router.route('/users/:id/block').patch(userController.blockUser);
router.route('/users/:id/unblock').patch(userController.unblockUser);

router.route('/owners/:id/approve').patch(ownerController.approveOwner);
router.route('/owners/:id/reject').patch(ownerController.rejectOwner);

// Venues
router
  .route('/venues')
  .get(validateQuery(getAdminVenuesQuerySchema), adminVenueController.getAdminVenues);

router.route('/venues/:id').all(validateObjectId('id')).get(adminVenueController.getAdminVenueById);

router
  .route('/venues/:id/approve')
  .all(validateObjectId('id'))
  .patch(adminVenueController.approveVenue);

router
  .route('/venues/:id/reject')
  .all(validateObjectId('id'))
  .patch(validateInputs(rejectVenueSchema), adminVenueController.rejectVenue);

import * as transactionController from '@/controllers/transaction.controller';

// Transactions
router.get('/transactions', transactionController.getAdminTransactions);
router.get('/transactions/stats', transactionController.getAdminTransactionStats);

// Settlements
router.get('/settlements', settlementController.getPendingSettlements);
router.post(
  '/settlements/:bookingId/release',
  validateObjectId('bookingId'),
  settlementController.releaseSettlement
);

export default router;
