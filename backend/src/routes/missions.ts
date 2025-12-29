import express from 'express';
import {
  getMissions,
  getDailyChallenge,
  getMissionProgress,
  completeDailyChallenge,
} from '../controllers/missionController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/', getMissions);
router.get('/daily', getDailyChallenge);
router.get('/:id/progress', protect, getMissionProgress);
router.post('/daily/complete', protect, completeDailyChallenge);

export default router;
