import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { bookingsAPI, roomsAPI, hotelsAPI } from "../services/api";
import {
  LayoutDashboard,
  DollarSign,
  CalendarCheck,
  BedDouble,
  PlusCircle,
  TrendingUp,
  CheckCircle2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Building,
  MapPin,
  Phone,
  LogIn,
} from "lucide-react";
import toast from "react-hot-toast";

const DashboardPage = ({ onOpenAuth }) => {
  const { user, isOwner, becomeHost, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("bookings");
  const [dashboardData, setDashboardData] = useState({
    stats: { totalBookings: 0, totalRevenue: 0, activeBookingsCount: 0 },
    bookings: [],
  });
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newRoom, setNewRoom] = useState({
    hotelId: "",
    roomType: "Luxury Suite",
    title: "",
    description: "",
    pricePerNight: 350,
    capacity: 2,
    bedCount: 1,
    bathCount: 1,
    roomSizeSqFt: 500,
    amenities: ["Free WiFi", "Room Service"],
    imageUrl:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200",
  });

  const [newHotel, setNewHotel] = useState({
    name: "",
    city: "New York",
    address: "",
    contact: "",
    description: "",
    featuredImage:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200",
  });

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const [bData, rData, hData] = await Promise.all([
        bookingsAPI.getOwnerBookings(),
        roomsAPI.getAll(),
        hotelsAPI.getMyHotels(),
      ]);

      setDashboardData({
        stats: bData.stats || {
          totalBookings: bData.data?.length || 0,
          totalRevenue: 0,
          activeBookingsCount: 0,
        },
        bookings: bData.data || [],
      });
      setRooms(rData || []);
      setHotels(hData || []);

      if (hData && hData.length > 0 && !newRoom.hotelId) {
        setNewRoom((prev) => ({ ...prev, hotelId: hData[0]._id }));
      }
    } catch (err) {
      console.error("Error fetching host operations data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOwner) {
      fetchDashboard();
    } else {
      setLoading(false);
    }
  }, [isOwner]);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await bookingsAPI.updateStatus(bookingId, newStatus);
      toast.success(`Booking status updated to ${newStatus}`);
      fetchDashboard();
    } catch {
      toast.error("Failed to update booking status.");
    }
  };

  const handleToggleRoomAvailability = async (roomId, currentAvailability) => {
    try {
      await roomsAPI.update(roomId, { isAvailable: !currentAvailability });
      toast.success(
        `Suite is now ${!currentAvailability ? "Active in Catalog" : "Paused"}`,
      );
      fetchDashboard();
    } catch {
      toast.error("Failed to update suite availability.");
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently remove this suite from your catalog?",
      )
    )
      return;
    try {
      await roomsAPI.delete(roomId);
      toast.success("Suite removed successfully.");
      fetchDashboard();
    } catch {
      toast.error("Failed to remove suite.");
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!newRoom.hotelId) {
      toast.error("Please select or register a hotel property first.");
      return;
    }

    try {
      await roomsAPI.create({
        ...newRoom,
        images: [newRoom.imageUrl],
      });
      toast.success("New luxury suite created and published to inventory!");
      setActiveTab("rooms");
      fetchDashboard();
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Could not create suite.");
    }
  };

  const handleCreateHotel = async (e) => {
    e.preventDefault();
    try {
      const res = await hotelsAPI.create(newHotel);
      toast.success("Hotel property registered successfully!");
      setNewRoom((prev) => ({ ...prev, hotelId: res.data._id }));
      setActiveTab("addRoom");
      fetchDashboard();
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Could not register hotel.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-gray-50/50">
        <div className="bg-white p-8 rounded-3xl border border-gray-200 text-center max-w-md shadow-xl space-y-4">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <LayoutDashboard className="w-7 h-7" />
          </div>
          <h2 className="font-playfair text-2xl font-bold text-gray-900">
            Host Management Console
          </h2>
          <p className="text-xs text-gray-500">
            Please sign in with a Host account to access property listings,
            occupancy tracking, and reservations.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onOpenAuth && onOpenAuth("login")}
              className="w-full py-3 px-4 rounded-xl bg-gray-900 hover:bg-amber-600 text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In as Host</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-gray-50/50">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 text-center max-w-lg shadow-xl space-y-5">
          <div className="w-16 h-16 bg-gradient-to-tr from-amber-600 to-amber-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Building className="w-8 h-8" />
          </div>
          <div>
            <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-gray-900">
              Host With Manzil • منزل
            </h2>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              List your boutique hotel, guest house, or mountain resort. Reach
              travelers seeking authentic Pakistani hospitality with zero
              double-booking guarantees, verified guest profiles, and
              comprehensive operations analytics.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-left py-2">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span className="block text-xs font-bold text-gray-900 mb-0.5">
                Automated Booking
              </span>
              <p className="text-[11px] text-gray-500">
                Atomic concurrency prevention and instant voucher generation.
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span className="block text-xs font-bold text-gray-900 mb-0.5">
                Real-time Revenue
              </span>
              <p className="text-[11px] text-gray-500">
                Transparent earnings calculation and occupancy dashboards.
              </p>
            </div>
          </div>

          <button
            onClick={becomeHost}
            className="w-full py-3.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition shadow-md cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Activate Host Account Now</span>
          </button>
        </div>
      </div>
    );
  }

  const { stats, bookings } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50/40 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-gray-200 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Host Management Console</span>
            </div>
            <h1 className="font-playfair text-3xl font-bold text-gray-900">
              Operations & Revenue Dashboard
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Logged in as Host:{" "}
              <strong className="text-gray-800">{user?.name}</strong> (
              {user?.email})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("addHotel")}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 font-semibold text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Building className="w-4 h-4 text-amber-600" />
              <span>+ Register Property</span>
            </button>
            <button
              onClick={() => setActiveTab("addRoom")}
              className="px-4 py-2.5 rounded-xl bg-amber-600 text-white font-semibold text-xs hover:bg-amber-700 transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ List New Suite</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-8 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">
                Total Gross Revenue
              </span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 font-sans">
              PKR {stats.totalRevenue?.toLocaleString()}
            </div>
            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Real-time settled revenue</span>
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">
                Total Reservations
              </span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <CalendarCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 font-sans">
              {stats.totalBookings || bookings.length}
            </div>
            <span className="text-[11px] text-gray-400 mt-1 block">
              Across your hotel properties
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">
                Active Inventory
              </span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <BedDouble className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 font-sans">
              {rooms.length} Suites
            </div>
            <span className="text-[11px] text-amber-600 font-medium mt-1 block">
              Live in marketplace
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">
                Managed Properties
              </span>
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <Building className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 font-sans">
              {hotels.length} Properties
            </div>
            <span className="text-[11px] text-purple-600 font-medium mt-1 block">
              Verified host status
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden mb-12">
          <div className="flex flex-wrap border-b border-gray-100 bg-gray-50/60 px-6 pt-3">
            <button
              onClick={() => setActiveTab("bookings")}
              className={`pb-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer ${
                activeTab === "bookings"
                  ? "border-amber-600 text-amber-600"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              Guest Reservations ({bookings.length})
            </button>
            <button
              onClick={() => setActiveTab("rooms")}
              className={`pb-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer ${
                activeTab === "rooms"
                  ? "border-amber-600 text-amber-600"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              Suite Inventory ({rooms.length})
            </button>
            <button
              onClick={() => setActiveTab("addRoom")}
              className={`pb-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer ${
                activeTab === "addRoom"
                  ? "border-amber-600 text-amber-600"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              + List New Suite
            </button>
            <button
              onClick={() => setActiveTab("addHotel")}
              className={`pb-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer ${
                activeTab === "addHotel"
                  ? "border-amber-600 text-amber-600"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              + Register Hotel Property
            </button>
          </div>

          <div className="p-6">
            {activeTab === "bookings" && (
              <div className="overflow-x-auto">
                {bookings.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-8">
                    No guest reservations recorded yet for your hotel
                    properties.
                  </p>
                ) : (
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider font-semibold">
                        <th className="pb-3 px-2">Ref Code</th>
                        <th className="pb-3 px-2">Guest Info</th>
                        <th className="pb-3 px-2">Suite & Hotel</th>
                        <th className="pb-3 px-2">Dates</th>
                        <th className="pb-3 px-2">Total</th>
                        <th className="pb-3 px-2">Status</th>
                        <th className="pb-3 px-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {bookings.map((b) => (
                        <tr
                          key={b._id}
                          className="hover:bg-gray-50/60 transition"
                        >
                          <td className="py-3 px-2 font-mono font-bold text-gray-900">
                            {b.bookingReference}
                          </td>
                          <td className="py-3 px-2">
                            <span className="font-semibold text-gray-900 block">
                              {b.guestDetails?.fullName ||
                                b.user?.name ||
                                "Guest"}
                            </span>
                            <span className="text-gray-400 text-[11px] block">
                              {b.guestDetails?.email || b.user?.email}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <span className="font-medium text-gray-800 block">
                              {b.room?.title || b.room?.roomType}
                            </span>
                            <span className="text-gray-400 text-[11px] block">
                              {b.hotel?.name || "Grand Resort"}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-gray-600">
                            <div>
                              {new Date(b.checkInDate).toLocaleDateString()}
                            </div>
                            <div className="text-[11px] text-gray-400">
                              to {new Date(b.checkOutDate).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="py-3 px-2 font-bold font-sans text-gray-900">
                            PKR {b.totalPrice?.toLocaleString()}
                          </td>
                          <td className="py-3 px-2">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                b.status === "confirmed"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : b.status === "completed"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-red-100 text-red-700"
                              }`}
                            >
                              {b.status}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-right space-x-1">
                            {b.status === "confirmed" && (
                              <button
                                onClick={() =>
                                  handleUpdateStatus(b._id, "completed")
                                }
                                className="px-2.5 py-1 bg-gray-900 hover:bg-emerald-600 text-white rounded-lg text-[11px] font-semibold transition cursor-pointer"
                              >
                                Mark Completed
                              </button>
                            )}
                            {b.status !== "cancelled" && (
                              <button
                                onClick={() =>
                                  handleUpdateStatus(b._id, "cancelled")
                                }
                                className="px-2.5 py-1 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                              >
                                Cancel
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === "rooms" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                  <div
                    key={room._id}
                    className="p-4 rounded-2xl border border-gray-200 bg-white flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <img
                        src={
                          room.images?.[0] ||
                          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600"
                        }
                        alt={room.title}
                        className="w-full h-36 rounded-xl object-cover"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                          {room.roomType}
                        </span>
                        <span className="text-xs font-bold text-gray-900 font-sans">
                          PKR {room.pricePerNight?.toLocaleString()} / night
                        </span>
                      </div>
                      <h4 className="font-playfair font-bold text-sm text-gray-900 line-clamp-1">
                        {room.title || `${room.roomType} Suite`}
                      </h4>
                      <p className="text-[11px] text-gray-500 line-clamp-2">
                        {room.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <button
                        onClick={() =>
                          handleToggleRoomAvailability(
                            room._id,
                            room.isAvailable,
                          )
                        }
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg transition cursor-pointer ${
                          room.isAvailable !== false
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {room.isAvailable !== false ? (
                          <>
                            <ToggleRight className="w-4 h-4 text-emerald-600" />
                            <span>Active in Catalog</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-4 h-4 text-gray-400" />
                            <span>Paused</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleDeleteRoom(room._id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                        title="Delete Room"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "addRoom" && (
              <form
                onSubmit={handleCreateRoom}
                className="max-w-2xl mx-auto space-y-4"
              >
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 mb-4">
                  <strong>Create New Suite Listing:</strong> Configure
                  specifications, pricing, amenities, and imagery to publish in
                  real time across the marketplace.
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Assign to Property
                    </label>
                    {hotels.length === 0 ? (
                      <div className="text-xs text-red-600 p-2 border border-red-200 rounded-xl bg-red-50">
                        No properties found.{" "}
                        <button
                          type="button"
                          onClick={() => setActiveTab("addHotel")}
                          className="font-bold underline cursor-pointer"
                        >
                          Register a property first.
                        </button>
                      </div>
                    ) : (
                      <select
                        value={newRoom.hotelId}
                        onChange={(e) =>
                          setNewRoom({ ...newRoom, hotelId: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-amber-600 bg-white"
                      >
                        {hotels.map((h) => (
                          <option key={h._id} value={h._id}>
                            {h.name} ({h.city})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Suite Title
                    </label>
                    <input
                      type="text"
                      required
                      value={newRoom.title}
                      onChange={(e) =>
                        setNewRoom({ ...newRoom, title: e.target.value })
                      }
                      placeholder="e.g. Royal Sapphire Oceanfront Penthouse"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-amber-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Room Category
                    </label>
                    <select
                      value={newRoom.roomType}
                      onChange={(e) =>
                        setNewRoom({ ...newRoom, roomType: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-amber-600 bg-white"
                    >
                      <option value="Luxury Suite">Luxury Suite</option>
                      <option value="Double Bed">Double Bed</option>
                      <option value="Single Bed">Single Bed</option>
                      <option value="Family Suite">Family Suite</option>
                      <option value="Presidential Penthouse">
                        Presidential Penthouse
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Price / Night (PKR)
                    </label>
                    <input
                      type="number"
                      required
                      min="50"
                      value={newRoom.pricePerNight}
                      onChange={(e) =>
                        setNewRoom({
                          ...newRoom,
                          pricePerNight: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-amber-600 font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Guests Capacity
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newRoom.capacity}
                      onChange={(e) =>
                        setNewRoom({
                          ...newRoom,
                          capacity: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-amber-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newRoom.bedCount}
                      onChange={(e) =>
                        setNewRoom({
                          ...newRoom,
                          bedCount: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-amber-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Square Footage
                    </label>
                    <input
                      type="number"
                      min="100"
                      value={newRoom.roomSizeSqFt}
                      onChange={(e) =>
                        setNewRoom({
                          ...newRoom,
                          roomSizeSqFt: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-amber-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    required
                    value={newRoom.imageUrl}
                    onChange={(e) =>
                      setNewRoom({ ...newRoom, imageUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Description & Features
                  </label>
                  <textarea
                    rows="3"
                    required
                    value={newRoom.description}
                    onChange={(e) =>
                      setNewRoom({ ...newRoom, description: e.target.value })
                    }
                    placeholder="Describe views, marble finishes, designer linens, and bespoke amenities..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab("rooms")}
                    className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-semibold hover:bg-gray-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    Publish Suite to Catalog
                  </button>
                </div>
              </form>
            )}

            {activeTab === "addHotel" && (
              <form
                onSubmit={handleCreateHotel}
                className="max-w-2xl mx-auto space-y-4"
              >
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 mb-4">
                  <strong>Register a New Hotel Property:</strong> Set up your
                  property profile to list suites and accept reservations.
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Hotel / Resort Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newHotel.name}
                      onChange={(e) =>
                        setNewHotel({ ...newHotel, name: e.target.value })
                      }
                      placeholder="e.g. Luminary Azure Bay Resort"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-amber-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Destination City
                    </label>
                    <input
                      type="text"
                      required
                      value={newHotel.city}
                      onChange={(e) =>
                        setNewHotel({ ...newHotel, city: e.target.value })
                      }
                      placeholder="e.g. Islamabad, Lahore, Karachi, Hunza..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-amber-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Full Address
                    </label>
                    <input
                      type="text"
                      required
                      value={newHotel.address}
                      onChange={(e) =>
                        setNewHotel({ ...newHotel, address: e.target.value })
                      }
                      placeholder="e.g. 10 Marina Boulevard"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-amber-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Front Desk Contact Phone
                    </label>
                    <input
                      type="tel"
                      required
                      value={newHotel.contact}
                      onChange={(e) =>
                        setNewHotel({ ...newHotel, contact: e.target.value })
                      }
                      placeholder="+1 (555) 019-2834"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-amber-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Featured Exterior Image URL
                  </label>
                  <input
                    type="url"
                    required
                    value={newHotel.featuredImage}
                    onChange={(e) =>
                      setNewHotel({
                        ...newHotel,
                        featuredImage: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Property Description
                  </label>
                  <textarea
                    rows="3"
                    required
                    value={newHotel.description}
                    onChange={(e) =>
                      setNewHotel({ ...newHotel, description: e.target.value })
                    }
                    placeholder="Describe the architectural design, concierge service, and dining highlights..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab("bookings")}
                    className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-semibold hover:bg-gray-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-gray-900 hover:bg-amber-600 text-white text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    Register Property
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
