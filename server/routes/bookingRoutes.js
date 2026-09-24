import express from 'express';
import {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  cancelBooking,
  updateBookingStatus,
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All booking routes require authentication

router.route('/')
  .post(createBooking);

router.get('/my', getMyBookings);
router.get('/owner', authorize('hotelOwner', 'admin'), getOwnerBookings);

router.put('/:id/cancel', cancelBooking);
router.put('/:id/status', authorize('hotelOwner', 'admin'), updateBookingStatus);

export default router;
