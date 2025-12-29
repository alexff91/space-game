import express from 'express';
import {
  getUserStreak,
  checkAndUpdateStreak,
  freezeStreak,
} from '../controllers/streakController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/', protect, getUserStreak);
router.post('/check', protect, checkAndUpdateStreak);
router.post('/freeze', protect, freezeStreak);

export default router;
