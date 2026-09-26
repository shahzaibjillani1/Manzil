import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

export const getHotels = async (req, res, next) => {
  try {
    const { city, search } = req.query;
    let query = {};

    if (city && city !== "All") {
      query.city = { $regex: city, $options: "i" };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
      ];
    }

    const hotels = await Hotel.find(query)
      .populate("owner", "name email avatar phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: hotels.length,
      data: hotels,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyHotels = async (req, res, next) => {
  try {
    const hotels = await Hotel.find({ owner: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({
      success: true,
      count: hotels.length,
      data: hotels,
    });
  } catch (error) {
    next(error);
  }
};

export const getHotelById = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id).populate(
      "owner",
      "name email phone avatar",
    );

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel property not found.",
      });
    }

    const rooms = await Room.find({ hotel: hotel._id, isAvailable: true });

    res.status(200).json({
      success: true,
      data: {
        hotel,
        rooms,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createHotel = async (req, res, next) => {
  try {
    const {
      name,
      city,
      address,
      contact,
      description,
      featuredImage,
      amenities,
    } = req.body;

    if (!name || !city || !address || !contact) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide hotel name, city, address, and contact number.",
      });
    }

    const hotel = await Hotel.create({
      name,
      city,
      address,
      contact,
      description:
        description ||
        "Luxury hotel offering exceptional hospitality and comfort.",
      featuredImage:
        featuredImage ||
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200",
      amenities: amenities || ["Free WiFi", "Room Service"],
      owner: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Hotel property registered successfully!",
      data: hotel,
    });
  } catch (error) {
    next(error);
  }
};

export const updateHotel = async (req, res, next) => {
  try {
    let hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel property not found.",
      });
    }

    if (hotel.owner.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this hotel property.",
      });
    }

    hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Hotel updated successfully.",
      data: hotel,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel property not found.",
      });
    }

    if (hotel.owner.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this hotel property.",
      });
    }

    await Room.deleteMany({ hotel: hotel._id });
    await hotel.deleteOne();

    res.status(200).json({
      success: true,
      message: "Hotel and associated room listings removed successfully.",
    });
  } catch (error) {
    next(error);
  }
};
