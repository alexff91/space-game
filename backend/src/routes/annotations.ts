import express from 'express';
import {
  createAnnotation,
  getImageAnnotations,
  getUserAnnotations,
  validateAnnotation,
  getConsensusAnnotations,
} from '../controllers/annotationController';
import { protect, authorize } from '../middleware/auth';
import { validate, annotationSchema } from '../middleware/validation';

const router = express.Router();

router.post('/', protect, validate(annotationSchema), createAnnotation);
router.get('/user', protect, getUserAnnotations);
router.get('/image/:imageId', getImageAnnotations);
router.get('/consensus/:imageId', getConsensusAnnotations);
router.put(
  '/:id/validate',
  protect,
  authorize('admin', 'researcher'),
  validateAnnotation
);

export default router;
