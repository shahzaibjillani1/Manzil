import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { adminAPI, roomsAPI } from "../services/api";
import toast from "react-hot-toast";
import {
  BarChart3,
  Users,
  Building2,
  CalendarCheck,
  BedDouble,
  Star,
  Trash2,
  Shield,
  ShieldAlert,
  Search,
  RefreshCw,
  TrendingUp,
  DollarSign,
  UserCheck,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Filter,
} from "lucide-react";

const AdminDashboardPage = ({ onOpenAuth }) => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [hotelsList, setHotelsList] = useState([]);
  const [bookingsList, setBookingsList] = useState([]);
  const [roomsList, setRoomsList] = useState([]);
  const [reviewsList, setReviewsList] = useState([]);

  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("");
  const [hotelSearch, setHotelSearch] = useState("");
  const [bookingStatusFilter, setBookingStatusFilter] = useState("");
  const [reviewSearch, setReviewSearch] = useState("");

  const fetchStats = useCallback(async () => {
    try {
      const data = await adminAPI.getStats();
      setStats(data);
    } catch (err) {
      toast.error("Failed to load platform stats");
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await adminAPI.getUsers({
        search: userSearch || undefined,
        role: userRoleFilter || undefined,
        limit: 50,
      });
      setUsersList(res.data || []);
    } catch (err) {
      toast.error("Failed to load users");
    }
  }, [userSearch, userRoleFilter]);

  const fetchHotels = useCallback(async () => {
    try {
      const res = await adminAPI.getHotels({
        search: hotelSearch || undefined,
        limit: 50,
      });
      setHotelsList(res.data || []);
    } catch (err) {
      toast.error("Failed to load hotels");
    }
  }, [hotelSearch]);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await adminAPI.getBookings({
        status: bookingStatusFilter || undefined,
        limit: 50,
      });
      setBookingsList(res.data || []);
    } catch (err) {
      toast.error("Failed to load bookings");
    }
  }, [bookingStatusFilter]);

  const fetchRooms = useCallback(async () => {
    try {
      const data = await roomsAPI.getAll({ limit: 50 });
      setRoomsList(data || []);
    } catch (err) {
      toast.error("Failed to load rooms");
    }
  }, []);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await adminAPI.getReviews({ limit: 50 });
      setReviewsList(res.data || []);
    } catch (err) {
      toast.error("Failed to load reviews");
    }
  }, []);

  const refreshCurrentTab = useCallback(async () => {
    setLoading(true);
    if (activeTab === "overview") await fetchStats();
    else if (activeTab === "users") await fetchUsers();
    else if (activeTab === "hotels") await fetchHotels();
    else if (activeTab === "bookings") await fetchBookings();
    else if (activeTab === "rooms") await fetchRooms();
    else if (activeTab === "reviews") await fetchReviews();
    setLoading(false);
  }, [
    activeTab,
    fetchStats,
    fetchUsers,
    fetchHotels,
    fetchBookings,
    fetchRooms,
    fetchReviews,
  ]);

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      refreshCurrentTab();
    }
  }, [isAuthenticated, isAdmin, activeTab, refreshCurrentTab]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminAPI.updateUser(userId, { role: newRole });
      toast.success(`Role updated to ${newRole}`);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update role");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone.",
      )
    )
      return;
    try {
      await adminAPI.deleteUser(userId);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleDeleteHotel = async (hotelId) => {
    if (
      !window.confirm(
        "Delete this hotel and all its associated rooms and bookings?",
      )
    )
      return;
    try {
      await adminAPI.deleteHotel(hotelId);
      toast.success("Hotel removed successfully");
      fetchHotels();
    } catch (err) {
      toast.error("Failed to delete hotel");
    }
  };

  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      await adminAPI.updateBooking(bookingId, { status });
      toast.success(`Booking status set to ${status}`);
      fetchBookings();
    } catch (err) {
      toast.error("Failed to update booking status");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (
      !window.confirm(
        "Are you sure you want to moderate and delete this review?",
      )
    )
      return;
    try {
      await adminAPI.deleteReview(reviewId);
      toast.success("Review deleted");
      fetchReviews();
    } catch (err) {
      toast.error("Failed to delete review");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 shadow-sm">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-playfair text-gray-900 mb-2">
          Admin Authentication Required
        </h2>
        <p className="text-gray-600 max-w-md mb-6 text-sm">
          You must be logged in with administrative privileges to access this
          control portal.
        </p>
        <button
          onClick={() => onOpenAuth && onOpenAuth("login")}
          className="px-6 py-2.5 rounded-xl bg-gray-900 text-white font-semibold text-sm hover:bg-gray-800 transition"
        >
          Sign In as Administrator
        </button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4 shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-playfair text-gray-900 mb-2">
          Access Restricted
        </h2>
        <p className="text-gray-600 max-w-md mb-6 text-sm">
          Your current account does not have platform administrator credentials.
        </p>
        <Link
          to="/"
          className="px-6 py-2.5 rounded-xl bg-amber-600 text-white font-semibold text-sm hover:bg-amber-700 transition"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/60 pb-16">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-600 text-white shadow-md shadow-red-500/20">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-playfair text-gray-900 flex items-center gap-2">
                  Platform Admin Portal
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 uppercase tracking-wider">
                    SuperAdmin
                  </span>
                </h1>
                <p className="text-xs text-gray-500">
                  Manage platform users, property listings, bookings,
                  transactions, and reviews.
                </p>
              </div>
            </div>

            <button
              onClick={refreshCurrentTab}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 text-xs font-semibold hover:bg-gray-50 transition shadow-xs self-start md:self-auto"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
              />
              Refresh Data
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto mt-6 pt-2 border-t border-gray-100">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "users", label: "Users", icon: Users },
              { id: "hotels", label: "Hotels", icon: Building2 },
              { id: "bookings", label: "Bookings", icon: CalendarCheck },
              { id: "rooms", label: "Rooms", icon: BedDouble },
              { id: "reviews", label: "Reviews", icon: Star },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                    isActive
                      ? "bg-gray-900 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {loading && !stats && !usersList.length ? (
          <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
            <RefreshCw className="w-5 h-5 animate-spin mr-2" />
            Loading administrative data...
          </div>
        ) : null}

        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    Total Registered Users
                  </p>
                  <h3 className="text-2xl font-bold font-playfair text-gray-900 mt-1">
                    {stats?.totalUsers || 0}
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-1">
                    {stats?.usersByRole?.guest || 0} guests •{" "}
                    {stats?.usersByRole?.hotelOwner || 0} hosts
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    Active Hotel Properties
                  </p>
                  <h3 className="text-2xl font-bold font-playfair text-gray-900 mt-1">
                    {stats?.totalHotels || 0}
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-1">
                    {stats?.totalRooms || 0} total rooms listed
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    Completed & Active Bookings
                  </p>
                  <h3 className="text-2xl font-bold font-playfair text-gray-900 mt-1">
                    {stats?.totalBookings || 0}
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Across all properties
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <CalendarCheck className="w-6 h-6" />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    Gross Platform Revenue
                  </p>
                  <h3 className="text-2xl font-bold font-playfair text-emerald-600 mt-1">
                    PKR {(stats?.totalRevenue || 0).toLocaleString()}
                  </h3>
                  <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-medium">
                    <TrendingUp className="w-3 h-3" /> Live Gross Volume
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 p-6 rounded-2xl bg-white border border-gray-100 shadow-xs">
                <h3 className="text-base font-bold text-gray-900 mb-1">
                  Monthly Revenue Trend
                </h3>
                <p className="text-xs text-gray-400 mb-6">
                  Revenue breakdown for the last 6 months
                </p>

                {stats?.monthlyRevenue && stats.monthlyRevenue.length > 0 ? (
                  <div className="space-y-4">
                    {stats.monthlyRevenue.map((m) => {
                      const maxRev = Math.max(
                        ...stats.monthlyRevenue.map(
                          (item) => item.revenue || 1,
                        ),
                      );
                      const pct = Math.max(
                        8,
                        Math.round((m.revenue / maxRev) * 100),
                      );
                      return (
                        <div key={m.month}>
                          <div className="flex justify-between text-xs font-semibold mb-1">
                            <span className="text-gray-600">{m.month}</span>
                            <span className="text-gray-900">
                              PKR {m.revenue.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                            <div
                              className="bg-amber-600 h-full rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 py-8 text-center">
                    No historical revenue data recorded yet.
                  </p>
                )}
              </div>

              <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-gray-100 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      Recent Platform Bookings
                    </h3>
                    <p className="text-xs text-gray-400">
                      Latest transactions processed
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("bookings")}
                    className="text-xs text-amber-600 font-semibold hover:underline"
                  >
                    View All Bookings &rarr;
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 uppercase font-semibold">
                        <th className="pb-3">Reference</th>
                        <th className="pb-3">Guest</th>
                        <th className="pb-3">Property</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {stats?.recentBookings &&
                      stats.recentBookings.length > 0 ? (
                        stats.recentBookings.map((b) => (
                          <tr key={b._id} className="hover:bg-gray-50/50">
                            <td className="py-3 font-mono font-medium text-gray-800">
                              {b.bookingReference}
                            </td>
                            <td className="py-3">
                              <p className="font-semibold text-gray-800">
                                {b.guestDetails?.fullName ||
                                  b.user?.name ||
                                  "Guest"}
                              </p>
                              <p className="text-[10px] text-gray-400">
                                {b.guestDetails?.email || b.user?.email}
                              </p>
                            </td>
                            <td className="py-3 text-gray-600">
                              {b.hotel?.name || "Hotel Property"}
                            </td>
                            <td className="py-3 font-semibold text-gray-900">
                              PKR {b.totalPrice?.toLocaleString()}
                            </td>
                            <td className="py-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                  b.status === "confirmed"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : b.status === "completed"
                                      ? "bg-blue-50 text-blue-700"
                                      : b.status === "cancelled"
                                        ? "bg-red-50 text-red-700"
                                        : "bg-amber-50 text-amber-700"
                                }`}
                              >
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="5"
                            className="py-6 text-center text-gray-400"
                          >
                            No recent bookings found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  User Account Management
                </h3>
                <p className="text-xs text-gray-500">
                  Manage user accounts, privileges, and platform roles.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="pl-9 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs w-56 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="">All Roles</option>
                  <option value="guest">Guest</option>
                  <option value="hotelOwner">Host</option>
                  <option value="admin">Admin</option>
                </select>

                <button
                  onClick={fetchUsers}
                  className="px-3 py-1.5 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 transition"
                >
                  Apply
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 uppercase font-semibold">
                    <th className="pb-3">User</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Current Role</th>
                    <th className="pb-3">Change Role</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {usersList.length > 0 ? (
                    usersList.map((u) => (
                      <tr key={u._id} className="hover:bg-gray-50/50">
                        <td className="py-3.5 flex items-center gap-2.5">
                          <img
                            src={
                              u.avatar ||
                              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name)}`
                            }
                            alt=""
                            className="w-7 h-7 rounded-full object-cover border border-gray-200"
                          />
                          <span className="font-semibold text-gray-900">
                            {u.name}
                          </span>
                        </td>
                        <td className="py-3.5 text-gray-600">{u.email}</td>
                        <td className="py-3.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                              u.role === "admin"
                                ? "bg-red-50 text-red-700"
                                : u.role === "hotelOwner"
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {u.role === "admin"
                              ? "Admin"
                              : u.role === "hotelOwner"
                                ? "Hotel Host"
                                : "Guest"}
                          </span>
                        </td>
                        <td className="py-3.5">
                          <select
                            value={u.role}
                            disabled={u._id === user?._id}
                            onChange={(e) =>
                              handleRoleChange(u._id, e.target.value)
                            }
                            className="px-2 py-1 rounded-lg border border-gray-200 text-[11px] bg-white disabled:opacity-50"
                          >
                            <option value="guest">Guest</option>
                            <option value="hotelOwner">Host</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="py-3.5 text-right">
                          <button
                            disabled={u._id === user?._id}
                            onClick={() => handleDeleteUser(u._id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition disabled:opacity-20 cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-8 text-center text-gray-400"
                      >
                        No users found matching current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "hotels" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Hotel Properties Directory
                </h3>
                <p className="text-xs text-gray-500">
                  Overview of all listed hotels across regions.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by hotel or city..."
                    value={hotelSearch}
                    onChange={(e) => setHotelSearch(e.target.value)}
                    className="pl-9 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs w-56 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <button
                  onClick={fetchHotels}
                  className="px-3 py-1.5 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 transition"
                >
                  Filter
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 uppercase font-semibold">
                    <th className="pb-3">Property</th>
                    <th className="pb-3">Location</th>
                    <th className="pb-3">Registered Owner</th>
                    <th className="pb-3">Rooms Count</th>
                    <th className="pb-3">Rating</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {hotelsList.length > 0 ? (
                    hotelsList.map((h) => (
                      <tr key={h._id} className="hover:bg-gray-50/50">
                        <td className="py-3.5">
                          <p className="font-bold text-gray-900">{h.name}</p>
                          <p className="text-[11px] text-gray-400">
                            {h.address}
                          </p>
                        </td>
                        <td className="py-3.5 text-gray-600">
                          {h.city}, {h.country}
                        </td>
                        <td className="py-3.5">
                          <p className="font-medium text-gray-800">
                            {h.owner?.name || "System Admin"}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {h.owner?.email}
                          </p>
                        </td>
                        <td className="py-3.5 font-semibold text-gray-800">
                          {h.roomsCount || 0} rooms
                        </td>
                        <td className="py-3.5">
                          <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            {h.rating || 5.0} ({h.reviewsCount || 0})
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <button
                            onClick={() => handleDeleteHotel(h._id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                            title="Delete Hotel"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-8 text-center text-gray-400"
                      >
                        No hotels registered yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  All Reservations
                </h3>
                <p className="text-xs text-gray-500">
                  Live booking records across the platform.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={bookingStatusFilter}
                  onChange={(e) => setBookingStatusFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button
                  onClick={fetchBookings}
                  className="px-3 py-1.5 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 transition"
                >
                  Filter
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 uppercase font-semibold">
                    <th className="pb-3">Reference</th>
                    <th className="pb-3">Guest</th>
                    <th className="pb-3">Room / Hotel</th>
                    <th className="pb-3">Dates</th>
                    <th className="pb-3">Total</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bookingsList.length > 0 ? (
                    bookingsList.map((b) => (
                      <tr key={b._id} className="hover:bg-gray-50/50">
                        <td className="py-3.5 font-mono font-medium text-gray-800">
                          {b.bookingReference}
                        </td>
                        <td className="py-3.5">
                          <p className="font-semibold text-gray-900">
                            {b.guestDetails?.fullName || b.user?.name}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {b.guestDetails?.email || b.user?.email}
                          </p>
                        </td>
                        <td className="py-3.5">
                          <p className="font-semibold text-gray-800">
                            {b.room?.title || "Room"}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {b.hotel?.name}
                          </p>
                        </td>
                        <td className="py-3.5 text-gray-600">
                          {new Date(b.checkInDate).toLocaleDateString()} &rarr;{" "}
                          {new Date(b.checkOutDate).toLocaleDateString()}
                          <span className="block text-[10px] text-gray-400">
                            ({b.nights} nights)
                          </span>
                        </td>
                        <td className="py-3.5 font-bold text-gray-900">
                          PKR {b.totalPrice?.toLocaleString()}
                        </td>
                        <td className="py-3.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                              b.status === "confirmed"
                                ? "bg-emerald-50 text-emerald-700"
                                : b.status === "completed"
                                  ? "bg-blue-50 text-blue-700"
                                  : b.status === "cancelled"
                                    ? "bg-red-50 text-red-700"
                                    : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3.5">
                          <select
                            value={b.status}
                            onChange={(e) =>
                              handleUpdateBookingStatus(b._id, e.target.value)
                            }
                            className="px-2 py-1 rounded-lg border border-gray-200 text-[11px] bg-white"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="py-8 text-center text-gray-400"
                      >
                        No bookings found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "rooms" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Rooms & Suites Inventory
              </h3>
              <p className="text-xs text-gray-500">
                Live room inventory across all host properties.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 uppercase font-semibold">
                    <th className="pb-3">Suite Name</th>
                    <th className="pb-3">Hotel Property</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Capacity</th>
                    <th className="pb-3">Price / Night</th>
                    <th className="pb-3">Rating</th>
                    <th className="pb-3 text-right">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {roomsList.length > 0 ? (
                    roomsList.map((r) => (
                      <tr key={r._id} className="hover:bg-gray-50/50">
                        <td className="py-3.5 font-bold text-gray-900">
                          {r.title}
                        </td>
                        <td className="py-3.5 text-gray-600">
                          {r.hotel?.name || "Hotel"}
                        </td>
                        <td className="py-3.5 capitalize font-medium text-gray-700">
                          {r.roomType}
                        </td>
                        <td className="py-3.5 text-gray-600">
                          {r.capacity} Guests
                        </td>
                        <td className="py-3.5 font-bold text-amber-600">
                          PKR {r.pricePerNight?.toLocaleString()}
                        </td>
                        <td className="py-3.5">
                          <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            {r.rating || 5.0} ({r.reviewsCount || 0})
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <Link
                            to={`/rooms/${r._id}`}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition inline-block"
                            title="Inspect Room Listing"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="py-8 text-center text-gray-400"
                      >
                        No rooms listed yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Reviews & Moderation
              </h3>
              <p className="text-xs text-gray-500">
                Monitor guest feedback and remove inappropriate reviews.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 uppercase font-semibold">
                    <th className="pb-3">Author</th>
                    <th className="pb-3">Room</th>
                    <th className="pb-3">Rating</th>
                    <th className="pb-3">Comment</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {reviewsList.length > 0 ? (
                    reviewsList.map((rev) => (
                      <tr key={rev._id} className="hover:bg-gray-50/50">
                        <td className="py-3.5">
                          <p className="font-semibold text-gray-900">
                            {rev.user?.name || "Guest"}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {rev.user?.email}
                          </p>
                        </td>
                        <td className="py-3.5 text-gray-800 font-medium">
                          {rev.room?.title || "Room Listing"}
                        </td>
                        <td className="py-3.5">
                          <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            {rev.rating} / 5
                          </span>
                        </td>
                        <td className="py-3.5 text-gray-600 max-w-md truncate">
                          {rev.comment}
                        </td>
                        <td className="py-3.5 text-right">
                          <button
                            onClick={() => handleDeleteReview(rev._id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                            title="Delete / Moderate Review"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-8 text-center text-gray-400"
                      >
                        No reviews found to moderate.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
