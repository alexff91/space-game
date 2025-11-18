import express from 'express';
import {
  getUserProfile,
  updateProfile,
  getLeaderboard,
  getUserStats,
} from '../controllers/userController';
import { protect } from '../middleware/auth';
import { validate, updateUserSchema } from '../middleware/validation';

const router = express.Router();

router.get('/leaderboard', getLeaderboard);
router.get('/stats', protect, getUserStats);
router.get('/:id', getUserProfile);
router.put('/profile', protect, validate(updateUserSchema), updateProfile);

export default router;
