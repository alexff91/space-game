import express from 'express';
import {
  getImages,
  getImage,
  getRandomImage,
  fetchNASAImages,
  fetchESAImages,
} from '../controllers/imageController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/', getImages);
router.get('/random', protect, getRandomImage);
router.get('/:id', getImage);
router.post('/fetch/nasa', protect, authorize('admin', 'researcher'), fetchNASAImages);
router.post('/fetch/esa', protect, authorize('admin', 'researcher'), fetchESAImages);

export default router;
