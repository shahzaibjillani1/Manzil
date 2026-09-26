import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { roomsAPI } from '../services/api';
import RoomCard from '../components/RoomCard';
import BookingModal from '../components/BookingModal';
import {
  SlidersHorizontal,
  RotateCcw,
  Search,
  MapPin,
  Users,
  Sparkles,
  BedDouble,
  Check,
} from 'lucide-react';

const CITIES = ['All', 'Islamabad', 'Lahore', 'Karachi', 'Murree', 'Swat', 'Hunza'];
const ROOM_TYPES = [
  'All',
  'Luxury Suite',
  'Double Bed',
  'Single Bed',
  'Family Suite',
  'Presidential Penthouse',
];
const AMENITIES_LIST = [
  'Free WiFi',
  'Free Breakfast',
  'Pool Access',
  'Room Service',
  'Mountain View',
];

const RoomsPage = ({ onOpenAuth }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters State
  const [city, setCity] = useState(searchParams.get('city') || 'All');
  const [roomType, setRoomType] = useState(searchParams.get('roomType') || 'All');
  const [maxPrice, setMaxPrice] = useState(100000);
  const [guests, setGuests] = useState(searchParams.get('guests') || '1');
  const [search, setSearch] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sort, setSort] = useState('rating');

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const urlCity = searchParams.get('city');
    if (urlCity) setCity(urlCity);
  }, [searchParams]);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const params = {
          city,
          roomType,
          maxPrice,
          guests,
          sort,
        };
        if (search) params.search = search;
        if (selectedAmenities.length > 0) {
          params.amenities = selectedAmenities.join(',');
        }

        const data = await roomsAPI.getAll(params);
        setRooms(data || []);
      } catch (err) {
        console.error('Error fetching rooms:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [city, roomType, maxPrice, guests, search, selectedAmenities, sort]);

  const toggleAmenity = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleResetFilters = () => {
    setCity('All');
    setRoomType('All');
    setMaxPrice(1000);
    setGuests('1');
    setSearch('');
    setSelectedAmenities([]);
    setSort('rating');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-amber-600 font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Accommodations</span>
          </div>
          <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-gray-900">
            Explore Handcrafted Suites & Villas
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Discover tailored accommodations with guaranteed real-time availability and transparent pricing.
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4 flex items-center justify-between">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200 text-xs font-semibold text-gray-800 shadow-xs cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-600" />
            <span>Filter Criteria ({rooms.length} Suites)</span>
          </button>
        </div>

        {/* Content Layout: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters Sidebar */}
          <aside
            className={`lg:block ${
              mobileFilterOpen ? 'block' : 'hidden'
            } bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-6 h-fit sticky top-24`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-600" />
                <span>Filter Stays</span>
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-xs text-amber-600 hover:text-amber-800 flex items-center gap-1 font-medium transition cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Search by Name / Feature
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="e.g. Skyline, Penthouse..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            {/* Destination / City */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                Destination City
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-amber-600 bg-white"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c === 'All' ? 'All Global Destinations' : c}
                  </option>
                ))}
              </select>
            </div>

            {/* Room Type */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                <BedDouble className="w-3.5 h-3.5 text-amber-600" />
                Room Category
              </label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-amber-600 bg-white"
              >
                {ROOM_TYPES.map((rt) => (
                  <option key={rt} value={rt}>
                    {rt}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Filter Slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-700">
                  Max Nightly Rate
                </label>
                <span className="text-xs font-bold text-amber-600 font-sans">
                  PKR {maxPrice.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="10000"
                max="100000"
                step="5000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>10k</span>
                <span>50k</span>
                <span>100k+</span>
              </div>
            </div>

            {/* Capacity / Guests */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-amber-600" />
                Guests Capacity
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-amber-600 bg-white"
              >
                <option value="1">1+ Guest</option>
                <option value="2">2+ Guests</option>
                <option value="3">3+ Guests</option>
                <option value="4">4+ Guests</option>
              </select>
            </div>

            {/* Amenities Checkboxes */}
            <div className="pt-2 border-t border-gray-100">
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Amenities & Inclusions
              </label>
              <div className="space-y-2">
                {AMENITIES_LIST.map((amenity) => {
                  const checked = selectedAmenities.includes(amenity);
                  return (
                    <label
                      key={amenity}
                      onClick={() => toggleAmenity(amenity)}
                      className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none hover:text-gray-900"
                    >
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                          checked
                            ? 'bg-amber-600 border-amber-600 text-white'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        {checked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span>{amenity}</span>
                    </label>
                  );
                })}
              </div>
            </div>

          </aside>

          {/* Rooms Grid & Top Sort Bar */}
          <main className="lg:col-span-3 space-y-6">
            
            {/* Top Sort Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-xs text-gray-500">
                Displaying <span className="font-bold text-gray-900">{rooms.length}</span> luxury accommodations
                {city !== 'All' && <span> in <strong className="text-amber-600">{city}</strong></span>}
              </p>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Sort by:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="text-xs font-semibold text-gray-800 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl focus:outline-none focus:border-amber-600 cursor-pointer"
                >
                  <option value="rating">Top Rated First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Newly Listed</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-96 rounded-3xl bg-gray-200/60 animate-pulse" />
                ))}
              </div>
            ) : rooms.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="font-playfair text-xl font-bold text-gray-900">
                  No Suites Match Your Filters
                </h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Try broadening your price range, choosing "All" destinations, or resetting applied filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="py-2.5 px-6 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-amber-600 transition cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                  <RoomCard
                    key={room._id}
                    room={room}
                    onQuickBook={(selected) => setSelectedRoomForBooking(selected)}
                  />
                ))}
              </div>
            )}

          </main>

        </div>

      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={!!selectedRoomForBooking}
        room={selectedRoomForBooking}
        onClose={() => setSelectedRoomForBooking(null)}
        onOpenAuth={onOpenAuth}
      />
    </div>
  );
};

export default RoomsPage;
