import { Router } from 'express';
import notificationController from '../controllers/notificationController.js';
import { catchErrors } from '../handlers/error_handlers.js';
import { isAuthenticated } from '../middlewares/authentication.js';

const router = Router();
console.log('Routes file loaded');

router.get('/notifications/stream',isAuthenticated, catchErrors(notificationController.setStream))
router.patch('/notifications/read-all', isAuthenticated, catchErrors(notificationController.markAllRead))

export default router;
