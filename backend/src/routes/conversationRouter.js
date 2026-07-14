import express from 'express';
import conversationController from '../controllers/conversationController.js';
import {isAuthenticated} from '../middlewares/authentication.js';

const router = express.Router();

router.post('/conversations/find-or-create', isAuthenticated, conversationController.findOrCreate);
router.get('/conversations/:id/messages', isAuthenticated, conversationController.getMessages);
router.get('/conversations', isAuthenticated, conversationController.getConversations);

export default router;