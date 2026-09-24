import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  MapPin,
  Wifi,
  Coffee,
  Waves,
  Mountain,
  Heart,
  Users,
  ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

const amenityIcons = {
  'Free WiFi': Wifi,
  'Free Breakfast': Coffee,
  'Pool Access': Waves,
  'Mountain View': Mountain,
};

const RoomCard = ({ room, onQuickBook }) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'Removed from favorites' : 'Saved to wishlist!');
  };

  const displayImage =
    room.images && room.images.length > 0
      ? room.images[0]
      : 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800';

  const hotelName = room.hotel?.name || 'Exclusive Luxury Resort';
  const hotelCity = room.hotel?.city || 'International';

  return (
    <div className="group bg-white rounded-2xl border border-gray-100/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1">
      
      {/* Image container */}
      <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
        <img
          src={displayImage}
          alt={room.title || room.roomType}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

        {/* Wishlist Button */}
        <button
          onClick={handleLike}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-xs text-gray-700 hover:text-red-500 hover:bg-white shadow-md transition-all active:scale-90"
        >
          <Heart
            className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`}
          />
        </button>

        {/* Room Type Pill */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-gray-900/80 backdrop-blur-md text-white shadow-sm">
            {room.roomType}
          </span>
        </div>

        {/* Location & Rating tag at bottom of image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1 font-medium bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>{hotelCity}</span>
          </div>
          <div className="flex items-center gap-1 font-semibold bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full text-amber-300">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{room.rating || 4.9}</span>
            <span className="text-[10px] text-gray-300">({room.reviewsCount || 12})</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">
            {hotelName}
          </p>
          <Link to={`/rooms/${room._id}`}>
            <h3 className="font-playfair font-bold text-lg text-gray-900 group-hover:text-amber-700 transition line-clamp-1">
              {room.title || `${room.roomType} Suite`}
            </h3>
          </Link>
          <p className="text-xs text-gray-500 line-clamp-2 mt-1 mb-3">
            {room.description ||
              'Furnished with bespoke furniture, plush bedding, and serene views for an unforgettable stay.'}
          </p>

          {/* Amenities Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {room.amenities?.slice(0, 3).map((amenity, idx) => {
              const IconComp = amenityIcons[amenity];
              return (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-[11px] text-gray-600 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md"
                >
                  {IconComp && <IconComp className="w-3 h-3 text-amber-600" />}
                  <span>{amenity}</span>
                </span>
              );
            })}
            {room.capacity && (
              <span className="inline-flex items-center gap-1 text-[11px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md">
                <Users className="w-3 h-3" />
                <span>Up to {room.capacity}</span>
              </span>
            )}
          </div>
        </div>

        {/* Pricing and Action */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-600">Starting from</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-gray-900 font-sans">
                ${room.pricePerNight}
              </span>
              <span className="text-xs text-gray-600 font-normal">/ night</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/rooms/${room._id}`}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg text-xs font-semibold transition"
            >
              Details
            </Link>
            <button
              onClick={() => onQuickBook && onQuickBook(room)}
              className="px-3.5 py-2 rounded-xl bg-gray-900 hover:bg-amber-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm hover:shadow active:scale-95 cursor-pointer"
            >
              <span>Book</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RoomCard;
