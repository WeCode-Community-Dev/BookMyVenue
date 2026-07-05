import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

// Authentication Route mappings
router.post('/signup', registerUser); // Signup profile creation endpoint
router.post('/login', loginUser);   // Login authentication credential validation

export default router;
