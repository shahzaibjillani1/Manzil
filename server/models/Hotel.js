import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add hotel name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      default: 'Luxury hotel offering world-class comfort, exquisite dining, and breathtaking views.',
    },
    address: {
      type: String,
      required: [true, 'Please add hotel address'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'Please add city'],
      index: true,
      trim: true,
    },
    country: {
      type: String,
      default: 'United States',
      trim: true,
    },
    contact: {
      type: String,
      required: [true, 'Please add contact number'],
    },
    email: {
      type: String,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      default: 4.8,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    reviewsCount: {
      type: Number,
      default: 12,
    },
    featuredImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200',
    },
    images: [
      {
        type: String,
      },
    ],
    amenities: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Hotel = mongoose.model('Hotel', hotelSchema);
export default Hotel;
