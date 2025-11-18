import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
} from '../controllers/authController';
import { protect } from '../middleware/auth';
import { validate, registerSchema, loginSchema } from '../middleware/validation';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

export default router;
