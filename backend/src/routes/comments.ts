import express from 'express';
import {
  getImageComments,
  createComment,
  likeComment,
  deleteComment,
} from '../controllers/commentController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/image/:imageId', getImageComments);
router.post('/', protect, createComment);
router.post('/:id/like', protect, likeComment);
router.delete('/:id', protect, deleteComment);

export default router;
