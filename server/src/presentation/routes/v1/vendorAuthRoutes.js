import Express from 'express';
import { iVendorAuthController } from '../../controllers/di.js';

const router = Express.Router();

router.post('/register', iVendorAuthController.register);
router.post('/login', iVendorAuthController.login);

export default router;
