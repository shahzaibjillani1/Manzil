import express from 'express';
import { getRoomReviews, addReview } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/room/:roomId', getRoomReviews);
router.post('/room/:roomId', protect, addReview);

export default router;
