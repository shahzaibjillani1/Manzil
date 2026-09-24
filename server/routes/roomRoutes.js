import express from 'express';
import {
  getRooms,
  getRoomById,
  checkRoomAvailability,
  createRoom,
  updateRoom,
  deleteRoom,
} from '../controllers/roomController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getRooms)
  .post(protect, authorize('hotelOwner', 'admin'), createRoom);

router.post('/:id/availability', checkRoomAvailability);

router.route('/:id')
  .get(getRoomById)
  .put(protect, authorize('hotelOwner', 'admin'), updateRoom)
  .delete(protect, authorize('hotelOwner', 'admin'), deleteRoom);

export default router;
