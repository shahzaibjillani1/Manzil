import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import { sendBookingConfirmationEmail } from "../utils/emailService.js";

export const createBooking = async (req, res, next) => {
  try {
    const {
      roomId,
      checkInDate,
      checkOutDate,
      guests = 1,
      paymentMethod = "Credit Card",
      guestDetails,
    } = req.body;

    if (!roomId || !checkInDate || !checkOutDate) {
      return res.status(400).json({
        success: false,
        message: "Please provide roomId, checkInDate, and checkOutDate.",
      });
    }

    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);

    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: "Check-out date must be strictly after check-in date.",
      });
    }

    const room = await Room.findById(roomId).populate("hotel");
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room listing not found.",
      });
    }

    if (Number(guests) > room.capacity) {
      return res.status(400).json({
        success: false,
        message: `This suite can accommodate a maximum of ${room.capacity} guest(s).`,
      });
    }

    const conflictingBooking = await Booking.findOne({
      room: roomId,
      status: { $in: ["confirmed", "pending"] },
      checkInDate: { $lt: end },
      checkOutDate: { $gt: start },
    });

    if (conflictingBooking) {
      return res.status(409).json({
        success: false,
        message:
          "Room has already been reserved for these dates. Please choose alternative dates.",
      });
    }

    const diffTime = Math.abs(end - start);
    const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const subtotal = nights * room.pricePerNight;
    const taxesAndFees = Math.round(subtotal * 0.12);
    const totalPrice = subtotal + taxesAndFees;

    const isPaid = paymentMethod !== "Pay At Hotel";

    const booking = await Booking.create({
      user: req.user._id,
      hotel: room.hotel._id,
      room: room._id,
      checkInDate: start,
      checkOutDate: end,
      nights,
      guests: Number(guests),
      totalPrice,
      paymentMethod,
      isPaid,
      status: "confirmed",
      guestDetails: {
        fullName: guestDetails?.fullName || req.user.name,
        email: guestDetails?.email || req.user.email,
        phone: guestDetails?.phone || req.user.phone || "",
        specialRequests: guestDetails?.specialRequests || "",
      },
      stripePaymentIntentId: isPaid
        ? `pi_${Math.random().toString(36).substring(2, 14)}`
        : "",
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("room", "title roomType pricePerNight images amenities")
      .populate("hotel", "name address city featuredImage contact");

    const emailResult = await sendBookingConfirmationEmail(populatedBooking);

    res.status(201).json({
      success: true,
      message:
        "Reservation confirmed successfully! A confirmation email has been sent.",
      data: populatedBooking,
      emailSent: emailResult.success,
      emailPreviewUrl: emailResult.previewUrl || null,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("room", "title roomType pricePerNight images amenities")
      .populate("hotel", "name address city featuredImage contact")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

export const getOwnerBookings = async (req, res, next) => {
  try {
    let hotelIds;

    if (req.user.role === "admin") {
      const allHotels = await Hotel.find().select("_id");
      hotelIds = allHotels.map((h) => h._id);
    } else {
      const ownedHotels = await Hotel.find({ owner: req.user._id }).select(
        "_id",
      );
      hotelIds = ownedHotels.map((h) => h._id);
    }

    const bookings = await Booking.find({ hotel: { $in: hotelIds } })
      .populate("user", "name email avatar phone")
      .populate("room", "title roomType pricePerNight images")
      .populate("hotel", "name city")
      .sort({ createdAt: -1 });

    const totalRevenue = bookings
      .filter((b) => b.status !== "cancelled")
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    const activeBookingsCount = bookings.filter(
      (b) => b.status === "confirmed",
    ).length;

    res.status(200).json({
      success: true,
      stats: {
        totalBookings: bookings.length,
        totalRevenue,
        activeBookingsCount,
      },
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found.",
      });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      const hotel = await Hotel.findById(booking.hotel);
      if (!hotel || hotel.owner.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to cancel this reservation.",
        });
      }
    }

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({
      success: true,
      message:
        "Reservation cancelled successfully. Selected dates are now released.",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, isPaid } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found.",
      });
    }

    if (status) booking.status = status;
    if (typeof isPaid === "boolean") booking.isPaid = isPaid;

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully.",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};
