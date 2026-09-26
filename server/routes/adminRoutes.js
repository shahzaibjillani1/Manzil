import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  getAdminStats,
  getAdminUsers,
  updateAdminUser,
  deleteAdminUser,
  getAdminHotels,
  deleteAdminHotel,
  getAdminBookings,
  updateAdminBooking,
  getAdminReviews,
  deleteAdminReview,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/stats", getAdminStats);

router.route("/users").get(getAdminUsers);
router.route("/users/:id").put(updateAdminUser).delete(deleteAdminUser);

router.route("/hotels").get(getAdminHotels);
router.route("/hotels/:id").delete(deleteAdminHotel);

router.route("/bookings").get(getAdminBookings);
router.route("/bookings/:id").put(updateAdminBooking);

router.route("/reviews").get(getAdminReviews);
router.route("/reviews/:id").delete(deleteAdminReview);

export default router;
