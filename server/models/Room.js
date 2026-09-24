import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
      index: true,
    },
    roomType: {
      type: String,
      required: [true, 'Please provide room type (e.g. Single Bed, Double Bed, Luxury Suite, Penthouse)'],
      enum: ['Single Bed', 'Double Bed', 'Luxury Suite', 'Family Suite', 'Presidential Penthouse'],
      default: 'Double Bed',
    },
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      default: 'Immaculately styled with premium designer bedding, marble en-suite bathroom, smart room controls, and sweeping panoramic views.',
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Please provide room price per night'],
      min: [1, 'Price must be greater than 0'],
    },
    capacity: {
      type: Number,
      default: 2,
      min: [1, 'Capacity must be at least 1 guest'],
    },
    amenities: [
      {
        type: String,
      },
    ],
    images: [
      {
        type: String,
      },
    ],
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
    rating: {
      type: Number,
      default: 4.9,
    },
    reviewsCount: {
      type: Number,
      default: 8,
    },
    bedCount: {
      type: Number,
      default: 1,
    },
    bathCount: {
      type: Number,
      default: 1,
    },
    roomSizeSqFt: {
      type: Number,
      default: 450,
    },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model('Room', roomSchema);
export default Room;
