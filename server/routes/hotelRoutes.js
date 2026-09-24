import express from 'express';
import {
  getHotels,
  getMyHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
} from '../controllers/hotelController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getHotels)
  .post(protect, authorize('hotelOwner', 'admin'), createHotel);

router.get('/my', protect, authorize('hotelOwner', 'admin'), getMyHotels);

router.route('/:id')
  .get(getHotelById)
  .put(protect, authorize('hotelOwner', 'admin'), updateHotel)
  .delete(protect, authorize('hotelOwner', 'admin'), deleteHotel);

export default router;
