import User from '../models/User.js';
import Hotel from '../models/Hotel.js';
import Room from '../models/Room.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';

// GET /api/admin/stats — Platform-wide dashboard statistics
export const getAdminStats = async (req, res, next) => {
  try {
    const [totalUsers, totalHotels, totalRooms, totalBookings, totalReviews] =
      await Promise.all([
        User.countDocuments(),
        Hotel.countDocuments(),
        Room.countDocuments(),
        Booking.countDocuments(),
        Review.countDocuments(),
      ]);

    // Total revenue from non-cancelled bookings
    const revenueAgg = await Booking.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    // Monthly revenue for last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyRevenue = await Booking.aggregate([
      {
        $match: {
          status: { $ne: 'cancelled' },
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          revenue: { $sum: '$totalPrice' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const formattedMonthlyRevenue = monthlyRevenue.map((m) => ({
      month: `${m._id.year}-${String(m._id.month).padStart(2, '0')}`,
      revenue: m.revenue,
      bookings: m.count,
    }));

    // Recent 5 bookings
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .populate('hotel', 'name city')
      .populate('room', 'title roomType pricePerNight');

    // User counts by role
    const usersByRoleAgg = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);
    const usersByRole = { guest: 0, hotelOwner: 0, admin: 0 };
    usersByRoleAgg.forEach((r) => {
      usersByRole[r._id] = r.count;
    });

    // Booking counts by status
    const bookingsByStatusAgg = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const bookingsByStatus = { pending: 0, confirmed: 0, cancelled: 0, completed: 0 };
    bookingsByStatusAgg.forEach((b) => {
      bookingsByStatus[b._id] = b.count;
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalHotels,
        totalRooms,
        totalBookings,
        totalReviews,
        totalRevenue,
        monthlyRevenue: formattedMonthlyRevenue,
        recentBookings,
        usersByRole,
        bookingsByStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/users — List all users with search/filter/pagination
export const getAdminUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.role) {
      filter.role = req.query.role;
    }
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [{ name: searchRegex }, { email: searchRegex }];
    }

    const [users, total] = await Promise.all([
      User.find(filter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/users/:id — Update user role
export const updateAdminUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot modify your own admin account from this panel.',
      });
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (req.body.role) {
      user.role = req.body.role;
    }
    if (req.body.name) {
      user.name = req.body.name;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: `User "${user.name}" updated successfully.`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/users/:id — Delete user and related data
export const deleteAdminUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own admin account.',
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Clean up user's related data
    await Promise.all([
      Booking.deleteMany({ user: user._id }),
      Review.deleteMany({ user: user._id }),
    ]);

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: `User "${user.name}" and all related data deleted.`,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/hotels — All hotels with owner info and room count
export const getAdminHotels = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [{ name: searchRegex }, { city: searchRegex }];
    }

    const [hotels, total] = await Promise.all([
      Hotel.find(filter)
        .populate('owner', 'name email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Hotel.countDocuments(filter),
    ]);

    // Attach room count for each hotel
    const hotelsWithRoomCount = await Promise.all(
      hotels.map(async (hotel) => {
        const roomCount = await Room.countDocuments({ hotel: hotel._id });
        return { ...hotel.toObject(), roomCount };
      })
    );

    res.status(200).json({
      success: true,
      data: hotelsWithRoomCount,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/hotels/:id — Delete hotel, its rooms, and related bookings
export const deleteAdminHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found.' });
    }

    const rooms = await Room.find({ hotel: hotel._id }).select('_id');
    const roomIds = rooms.map((r) => r._id);

    await Promise.all([
      Booking.deleteMany({ hotel: hotel._id }),
      Review.deleteMany({ room: { $in: roomIds } }),
      Room.deleteMany({ hotel: hotel._id }),
    ]);

    await Hotel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: `Hotel "${hotel.name}" and all associated rooms, bookings, and reviews deleted.`,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/bookings — All bookings with filters and pagination
export const getAdminBookings = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate('user', 'name email')
        .populate('hotel', 'name city')
        .populate('room', 'title roomType pricePerNight')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Booking.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/bookings/:id — Update booking status
export const updateAdminBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (req.body.status) {
      booking.status = req.body.status;
    }
    if (typeof req.body.isPaid === 'boolean') {
      booking.isPaid = req.body.isPaid;
    }

    await booking.save();

    res.status(200).json({
      success: true,
      message: `Booking ${booking.bookingReference} updated to "${booking.status}".`,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/reviews — All reviews with pagination
export const getAdminReviews = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find()
        .populate('user', 'name email avatar')
        .populate('room', 'title roomType')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Review.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      data: reviews,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/reviews/:id — Delete review and recalculate room rating
export const deleteAdminReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    const roomId = review.room;
    await Review.findByIdAndDelete(req.params.id);

    // Recalculate room rating
    const remaining = await Review.find({ room: roomId });
    const room = await Room.findById(roomId);
    if (room) {
      if (remaining.length === 0) {
        room.rating = 0;
        room.reviewsCount = 0;
      } else {
        const avgRating =
          remaining.reduce((sum, r) => sum + r.rating, 0) / remaining.length;
        room.rating = Math.round(avgRating * 10) / 10;
        room.reviewsCount = remaining.length;
      }
      await room.save();
    }

    res.status(200).json({
      success: true,
      message: 'Review deleted and room rating recalculated.',
    });
  } catch (error) {
    next(error);
  }
};
