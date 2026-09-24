import Room from '../models/Room.js';
import Hotel from '../models/Hotel.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';

// @desc    Get all rooms with multi-criteria filtering, date availability, and sorting
// @route   GET /api/rooms
// @access  Public
export const getRooms = async (req, res, next) => {
  try {
    const {
      city,
      roomType,
      minPrice,
      maxPrice,
      guests,
      amenities,
      checkIn,
      checkOut,
      sort,
      search,
    } = req.query;

    let roomQuery = {};

    // Filter by availability flag
    roomQuery.isAvailable = true;

    // Filter by Room Type
    if (roomType && roomType !== 'All') {
      roomQuery.roomType = roomType;
    }

    // Filter by Price range
    if (minPrice || maxPrice) {
      roomQuery.pricePerNight = {};
      if (minPrice) roomQuery.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) roomQuery.pricePerNight.$lte = Number(maxPrice);
    }

    // Filter by Capacity / Guests
    if (guests) {
      roomQuery.capacity = { $gte: Number(guests) };
    }

    // Filter by Amenities
    if (amenities) {
      const amenitiesList = Array.isArray(amenities)
        ? amenities
        : amenities.split(',').map((a) => a.trim());
      roomQuery.amenities = { $all: amenitiesList };
    }

    // Find hotels in specified city or matching text search
    if (city && city !== 'All') {
      const hotels = await Hotel.find({ city: { $regex: city, $options: 'i' } }).select('_id');
      const matchingHotelIds = hotels.map((h) => h._id);
      roomQuery.hotel = { $in: matchingHotelIds };
    }

    if (search) {
      const matchingHotels = await Hotel.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { city: { $regex: search, $options: 'i' } },
          { address: { $regex: search, $options: 'i' } },
        ],
      }).select('_id');

      const ids = matchingHotels.map((h) => h._id);
      roomQuery.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { hotel: { $in: ids } },
      ];
    }

    // Concurrency date overlap check: Exclude rooms booked for the requested dates
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);

      if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && start < end) {
        const conflictingBookings = await Booking.find({
          status: { $in: ['confirmed', 'pending'] },
          checkInDate: { $lt: end },
          checkOutDate: { $gt: start },
        }).select('room');

        const bookedRoomIds = conflictingBookings.map((b) => b.room);
        if (bookedRoomIds.length > 0) {
          roomQuery._id = { $nin: bookedRoomIds };
        }
      }
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { pricePerNight: 1 };
    if (sort === 'price_desc') sortOption = { pricePerNight: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };

    const rooms = await Room.find(roomQuery)
      .populate('hotel', 'name city address rating featuredImage contact')
      .sort(sortOption);

    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single room by ID
// @route   GET /api/rooms/:id
// @access  Public
export const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate({
      path: 'hotel',
      populate: {
        path: 'owner',
        select: 'name email avatar phone',
      },
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room listing not found.',
      });
    }

    const reviews = await Review.find({ room: room._id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        room,
        reviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check room availability for date range
// @route   POST /api/rooms/:id/availability
// @access  Public
export const checkRoomAvailability = async (req, res, next) => {
  try {
    const { checkInDate, checkOutDate } = req.body;
    const roomId = req.params.id;

    if (!checkInDate || !checkOutDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both check-in and check-out dates.',
      });
    }

    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);

    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date.',
      });
    }

    const conflict = await Booking.findOne({
      room: roomId,
      status: { $in: ['confirmed', 'pending'] },
      checkInDate: { $lt: end },
      checkOutDate: { $gt: start },
    });

    res.status(200).json({
      success: true,
      isAvailable: !conflict,
      message: conflict
        ? 'Room is already booked for these selected dates.'
        : 'Room is fully available for your selected dates!',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a room
// @route   POST /api/rooms
// @access  Private (Host)
export const createRoom = async (req, res, next) => {
  try {
    const { hotelId, ...roomDetails } = req.body;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Associated hotel property not found.',
      });
    }

    if (hotel.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to add rooms to this hotel property.',
      });
    }

    const room = await Room.create({
      ...roomDetails,
      hotel: hotelId,
      isAvailable: true,
    });

    const populated = await Room.findById(room._id).populate('hotel', 'name city');

    res.status(201).json({
      success: true,
      message: 'Luxury suite created and published to inventory!',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a room
// @route   PUT /api/rooms/:id
// @access  Private (Host / Admin)
export const updateRoom = async (req, res, next) => {
  try {
    let room = await Room.findById(req.params.id).populate('hotel');
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found.',
      });
    }

    if (room.hotel.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit this room.',
      });
    }

    room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Room updated successfully.',
      data: room,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
// @access  Private (Host / Admin)
export const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate('hotel');
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found.',
      });
    }

    if (room.hotel.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this room.',
      });
    }

    await room.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Room removed from inventory successfully.',
    });
  } catch (error) {
    next(error);
  }
};
