import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { roomsAPI } from "../services/api";
import { roomCommonData } from "../assets/assets";
import RoomCard from "../components/RoomCard";
import FeaturedDestinations from "../components/FeaturedDestinations";
import ExclusiveOffers from "../components/ExclusiveOffers";
import Testimonials from "../components/Testimonials";
import BookingModal from "../components/BookingModal";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const HomePage = ({ onOpenAuth }) => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);
  const [activeRoomTypeFilter, setActiveRoomTypeFilter] = useState("All");

  const [searchCity, setSearchCity] = useState("");
  const [searchCheckIn, setSearchCheckIn] = useState("");
  const [searchCheckOut, setSearchCheckOut] = useState("");
  const [searchGuests, setSearchGuests] = useState("1");

  useEffect(() => {
    const fetchFeaturedRooms = async () => {
      try {
        setLoading(true);
        const data = await roomsAPI.getAll({ sort: "rating" });
        setRooms(data);
      } catch (err) {
        console.error("Error fetching rooms:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedRooms();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchCity && searchCity !== "All") params.append("city", searchCity);
    if (searchCheckIn) params.append("checkIn", searchCheckIn);
    if (searchCheckOut) params.append("checkOut", searchCheckOut);
    if (searchGuests) params.append("guests", searchGuests);
    navigate(`/rooms?${params.toString()}`);
  };

  const filteredRooms =
    activeRoomTypeFilter === "All"
      ? rooms
      : rooms.filter((r) => r.roomType === activeRoomTypeFilter);

  return (
    <div className="min-h-screen bg-white">
      <section className="relative min-h-[620px] flex items-center justify-center bg-gray-950 text-white overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1920"
            alt="Luxury Resort"
            className="w-full h-full object-cover opacity-35 scale-105 transform animate-in fade-in duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-gray-950/40" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-semibold mb-6">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>
              Pakistan's Premier Hospitality & Mountain Sanctuaries • منزل
            </span>
          </div>

          <h1 className="font-playfair text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight text-white mb-6">
            Where Elegance Meets <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-300">
              Pakistani Hospitality
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-300 mb-10 leading-relaxed font-light">
            Indulge in handpicked luxury suites in Islamabad, heritage palaces
            in Lahore, seaside retreats in Karachi, and breathtaking mountain
            lodges in Murree, Swat, and Hunza.
          </p>

          <div className="bg-white/95 backdrop-blur-xl p-3 sm:p-4 rounded-3xl shadow-2xl max-w-4xl mx-auto border border-white/30 text-gray-800">
            <form
              onSubmit={handleHeroSearch}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
            >
              <div className="text-left px-3.5 py-2.5 bg-gray-50/80 rounded-2xl border border-gray-100 focus-within:border-amber-500 transition">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  Destination
                </label>
                <select
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full text-xs font-semibold text-gray-900 bg-transparent focus:outline-none"
                >
                  <option value="">All Destinations in Pakistan</option>
                  <option value="Islamabad">Islamabad (Federal Capital)</option>
                  <option value="Lahore">Lahore (Cultural Hub)</option>
                  <option value="Karachi">Karachi (City of Lights)</option>
                  <option value="Murree">Murree (Hill Station)</option>
                  <option value="Swat">Swat (Valley of Emeralds)</option>
                  <option value="Hunza">Hunza (Karakoram Peaks)</option>
                </select>
              </div>

              <div className="text-left px-3.5 py-2.5 bg-gray-50/80 rounded-2xl border border-gray-100 focus-within:border-amber-500 transition">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  Check-In
                </label>
                <input
                  type="date"
                  value={searchCheckIn}
                  onChange={(e) => setSearchCheckIn(e.target.value)}
                  className="w-full text-xs font-semibold text-gray-900 bg-transparent focus:outline-none font-sans"
                />
              </div>

              <div className="text-left px-3.5 py-2.5 bg-gray-50/80 rounded-2xl border border-gray-100 focus-within:border-amber-500 transition">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  Check-Out
                </label>
                <input
                  type="date"
                  value={searchCheckOut}
                  onChange={(e) => setSearchCheckOut(e.target.value)}
                  className="w-full text-xs font-semibold text-gray-900 bg-transparent focus:outline-none font-sans"
                />
              </div>

              <div className="flex gap-2">
                <div className="text-left px-3.5 py-2.5 bg-gray-50/80 rounded-2xl border border-gray-100 flex-1 focus-within:border-amber-500 transition">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-amber-600" />
                    Guests
                  </label>
                  <select
                    value={searchGuests}
                    onChange={(e) => setSearchGuests(e.target.value)}
                    className="w-full text-xs font-semibold text-gray-900 bg-transparent focus:outline-none"
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4+ Guests</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="px-5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold flex items-center justify-center transition shadow-lg shadow-amber-600/30 cursor-pointer active:scale-95"
                  title="Search Rooms"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="bg-gray-900 text-white py-8 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="font-playfair text-2xl sm:text-3xl font-bold text-amber-400">
                120+
              </div>
              <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider">
                Luxury Properties
              </div>
            </div>
            <div>
              <div className="font-playfair text-2xl sm:text-3xl font-bold text-amber-400">
                99.8%
              </div>
              <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider">
                Guest Satisfaction
              </div>
            </div>
            <div>
              <div className="font-playfair text-2xl sm:text-3xl font-bold text-amber-400">
                Zero
              </div>
              <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider">
                Double-Booking Rate
              </div>
            </div>
            <div>
              <div className="font-playfair text-2xl sm:text-3xl font-bold text-amber-400">
                24/7
              </div>
              <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider">
                Dedicated Butler Service
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeaturedDestinations />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold tracking-widest text-amber-600 uppercase">
                Featured Accommodations
              </span>
              <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-gray-900 mt-1">
                Handpicked Signature Suites
              </h2>
            </div>

            <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
              {["All", "Luxury Suite", "Double Bed", "Single Bed"].map(
                (type) => (
                  <button
                    key={type}
                    onClick={() => setActiveRoomTypeFilter(type)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                      activeRoomTypeFilter === type
                        ? "bg-gray-900 text-white shadow-xs"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {type}
                  </button>
                ),
              )}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-96 rounded-3xl bg-gray-100 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRooms.slice(0, 6).map((room) => (
                <RoomCard
                  key={room._id}
                  room={room}
                  onQuickBook={(selected) =>
                    setSelectedRoomForBooking(selected)
                  }
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <button
              onClick={() => navigate("/rooms")}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gray-900 hover:bg-amber-600 text-white font-semibold text-xs transition-all shadow-md group cursor-pointer"
            >
              <span>Explore Complete Suite Catalog</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      <ExclusiveOffers />

      <section className="py-20 bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">
              The Manzil Guarantee • منزل
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold mt-2">
              Uncompromising Standards of Hospitality
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {roomCommonData.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 text-left space-y-3 hover:border-amber-500/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center p-2.5">
                  <img
                    src={item.icon}
                    alt={item.title}
                    className="w-full h-full object-contain filter invert sepia saturate-200 hue-rotate-10"
                  />
                </div>
                <h4 className="font-playfair font-bold text-lg text-white">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />

      <BookingModal
        isOpen={!!selectedRoomForBooking}
        room={selectedRoomForBooking}
        onClose={() => setSelectedRoomForBooking(null)}
        onOpenAuth={onOpenAuth}
      />
    </div>
  );
};

export default HomePage;
