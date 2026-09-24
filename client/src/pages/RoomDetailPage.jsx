import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roomsAPI, reviewsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { roomCommonData } from '../assets/assets';
import BookingModal from '../components/BookingModal';
import {
  Star,
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  CheckCircle,
  Bed,
  Bath,
  Maximize2,
  Share2,
  Heart,
  Sparkles,
  Wifi,
  Coffee,
  Waves,
  Mountain,
} from 'lucide-react';
import toast from 'react-hot-toast';

const amenityIcons = {
  'Free WiFi': Wifi,
  'Free Breakfast': Coffee,
  'Pool Access': Waves,
  'Mountain View': Mountain,
};

const RoomDetailPage = ({ onOpenAuth }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [room, setRoom] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        const data = await roomsAPI.getById(id);
        setRoom(data.room);
        setReviews(data.reviews || []);
      } catch (err) {
        console.error('Error fetching room detail:', err);
        toast.error('Failed to load suite details.');
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please sign in to leave a review.');
      if (onOpenAuth) onOpenAuth('login');
      return;
    }
    if (!comment.trim()) {
      toast.error('Please write a review comment.');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await reviewsAPI.addReview(id, { rating, comment });
      // Update reviews list with the new or updated review
      const existingIdx = reviews.findIndex((r) => r.user?._id === user._id);
      if (existingIdx >= 0) {
        const updated = [...reviews];
        updated[existingIdx] = res.data;
        setReviews(updated);
      } else {
        setReviews([res.data, ...reviews]);
      }
      setComment('');
      toast.success(res.message || 'Review submitted successfully!');
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Could not submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-gray-500">Loading Suite Details...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-2">Suite Not Found</h2>
        <p className="text-xs text-gray-500 mb-4">The requested suite listing is unavailable or has been archived.</p>
        <button
          onClick={() => navigate('/rooms')}
          className="px-5 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-amber-600 transition"
        >
          Return to All Rooms
        </button>
      </div>
    );
  }

  const images = room.images && room.images.length > 0
    ? room.images
    : ['https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200'];

  return (
    <div className="min-h-screen bg-gray-50/40 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{room.hotel?.name || 'Exclusive Resort'}</span>
            </div>
            <h1 className="font-playfair text-2xl sm:text-4xl font-bold text-gray-900">
              {room.title || room.roomType}
            </h1>
            <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>{room.hotel?.address}, {room.hotel?.city}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1 text-amber-600 font-semibold">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{room.rating || 4.9}</span>
                <span className="text-gray-400 font-normal">({room.reviewsCount || reviews.length} verified reviews)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied to clipboard!');
              }}
              className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button
              onClick={() => toast.success('Saved to your luxury wishlist')}
              className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:text-red-500 hover:bg-gray-50 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Heart className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="space-y-3 mb-10">
          <div className="relative aspect-16/9 md:aspect-21/9 rounded-3xl overflow-hidden shadow-lg bg-gray-900">
            <img
              src={images[selectedImageIndex]}
              alt={room.title}
              className="w-full h-full object-cover transition-all duration-500"
            />
          </div>

          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition cursor-pointer ${
                    selectedImageIndex === idx
                      ? 'border-amber-600 ring-2 ring-amber-400/30'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Details + Sticky Booking Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column: Details & Reviews */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Key Specs Card */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-gray-50 rounded-2xl">
                <Users className="w-5 h-5 mx-auto text-amber-600 mb-1" />
                <span className="block text-xs font-bold text-gray-900">Capacity</span>
                <span className="text-[11px] text-gray-500">{room.capacity || 2} Guests</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-2xl">
                <Bed className="w-5 h-5 mx-auto text-amber-600 mb-1" />
                <span className="block text-xs font-bold text-gray-900">Bedrooms</span>
                <span className="text-[11px] text-gray-500">{room.bedCount || 1} King/Queen</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-2xl">
                <Bath className="w-5 h-5 mx-auto text-amber-600 mb-1" />
                <span className="block text-xs font-bold text-gray-900">Bathrooms</span>
                <span className="text-[11px] text-gray-500">{room.bathCount || 1} Marble Bath</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-2xl">
                <Maximize2 className="w-5 h-5 mx-auto text-amber-600 mb-1" />
                <span className="block text-xs font-bold text-gray-900">Suite Size</span>
                <span className="text-[11px] text-gray-500">{room.roomSizeSqFt || 550} Sq Ft</span>
              </div>
            </div>

            {/* Overview / Description */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200/80 space-y-4">
              <h2 className="font-playfair text-xl font-bold text-gray-900">
                Suite Overview & Features
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {room.description ||
                  'Step into an oasis of calm elegance. Featuring tailored European upholstery, high thread-count organic cotton bedding, a dedicated private workspace, and panoramic views.'}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200/80 space-y-4">
              <h2 className="font-playfair text-xl font-bold text-gray-900">
                Included Luxury Amenities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {room.amenities?.map((amenity, idx) => {
                  const IconComp = amenityIcons[amenity] || Sparkles;
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-3 rounded-2xl bg-gray-50 border border-gray-100 text-xs font-medium text-gray-800"
                    >
                      <IconComp className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quality Standards */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200/80 space-y-4">
              <h2 className="font-playfair text-xl font-bold text-gray-900">
                Hospitality Safety & Care Standards
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {roomCommonData.map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <img src={item.icon} alt={item.title} className="w-6 h-6 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{item.title}</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Reviews Section */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200/80 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h2 className="font-playfair text-xl font-bold text-gray-900">
                    Guest Reviews & Ratings
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Verified feedback from travelers who stayed in this suite
                  </p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 text-sm font-bold">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>{room.rating || 5.0} / 5.0</span>
                </div>
              </div>

              {/* Add a Review Form */}
              <form onSubmit={handleReviewSubmit} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                <span className="text-xs font-bold text-gray-900 block">
                  Leave a Verified Review
                </span>
                
                {/* Star rating selector */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 focus:outline-none cursor-pointer"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-semibold text-gray-600 ml-2">
                    {rating} Star{rating > 1 ? 's' : ''}
                  </span>
                </div>

                <textarea
                  rows="3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details of your stay, amenities, room comfort, and overall experience..."
                  className="w-full p-3 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-amber-600 bg-white"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-amber-600 transition disabled:opacity-50 cursor-pointer"
                  >
                    {submittingReview ? 'Submitting...' : 'Post Review'}
                  </button>
                </div>
              </form>

              {/* Existing Reviews List */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">Be the first guest to leave a review for this suite!</p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev._id || Math.random()} className="p-4 rounded-2xl bg-gray-50/60 border border-gray-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={rev.user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(rev.user?.name || 'Guest')}`}
                            alt={rev.user?.name || 'Guest'}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <span className="text-xs font-bold text-gray-900">
                            {rev.user?.name || 'Verified Traveler'}
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {[...Array(rev.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>

            </div>

          </div>

          {/* Right Column: Sticky Reservation Box */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xl sticky top-24 space-y-6">
              
              <div className="flex items-baseline justify-between pb-4 border-b border-gray-100">
                <div>
                  <span className="text-2xl font-bold font-sans text-gray-900">
                    ${room.pricePerNight}
                  </span>
                  <span className="text-xs text-gray-500 font-normal"> / night</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span>{room.rating || 4.9}</span>
                </div>
              </div>

              {/* Reserve Button */}
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="w-full py-3.5 px-4 rounded-2xl bg-gray-900 hover:bg-amber-600 text-white font-bold text-sm shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Reserve This Suite</span>
              </button>

              <div className="space-y-3 pt-2 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Guaranteed best rate & instant booking voucher</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Free cancellation up to 48 hours before check-in</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Real-time availability confirmed directly with host</span>
                </div>
              </div>

              {/* Host contact */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3">
                <img
                  src={room.hotel?.owner?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(room.hotel?.owner?.name || 'Host')}`}
                  alt="Host"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <span className="text-[11px] text-gray-400 block">Hosted by</span>
                  <span className="text-xs font-bold text-gray-900">
                    {room.hotel?.owner?.name || 'Hotel Property Host'}
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        room={room}
        onClose={() => setIsBookingModalOpen(false)}
        onOpenAuth={onOpenAuth}
      />
    </div>
  );
};

export default RoomDetailPage;
