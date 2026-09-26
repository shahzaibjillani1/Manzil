import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Menu,
  X,
  User,
  LogOut,
  Calendar,
  LayoutDashboard,
  Building2,
  ChevronDown,
  PlusCircle,
  Sparkles,
  Shield,
} from "lucide-react";

const Navbar = ({ onOpenAuth }) => {
  const { user, isAuthenticated, isOwner, logout, becomeHost } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleBecomeHost = async () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    if (!isAuthenticated) {
      onOpenAuth("register");
      return;
    }
    const success = await becomeHost();
    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-playfair text-2xl font-bold tracking-tight text-gray-900 group-hover:text-amber-600 transition-colors">
                  Manzil<span className="text-amber-600">.</span>
                </span>
                <span className="text-sm font-semibold text-amber-600 tracking-normal font-sans">
                  منزل
                </span>
              </div>
              <span className="block text-[10px] uppercase tracking-widest text-gray-600 -mt-0.5 font-semibold">
                Pakistani Luxury Hospitality
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-1 lg:space-x-5 text-sm font-medium">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive("/")
                  ? "text-amber-600 bg-amber-50/60 font-semibold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Home
            </Link>
            <Link
              to="/rooms"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive("/rooms")
                  ? "text-amber-600 bg-amber-50/60 font-semibold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Explore Rooms
            </Link>
            <a
              href="/#destinations"
              className="px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              Destinations
            </a>
            <a
              href="/#offers"
              className="px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              Exclusive Offers
            </a>

            {isAuthenticated && (
              <Link
                to="/my-bookings"
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  isActive("/my-bookings")
                    ? "text-amber-600 bg-amber-50/60 font-semibold"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>My Bookings</span>
              </Link>
            )}
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="px-3.5 py-2 rounded-xl bg-red-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm hover:bg-red-700 transition"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </Link>
            )}
            {isOwner ? (
              <Link
                to="/dashboard"
                className="px-3.5 py-2 rounded-xl bg-amber-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm hover:bg-amber-700 transition"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Host Dashboard</span>
              </Link>
            ) : (
              <button
                onClick={handleBecomeHost}
                className="px-3.5 py-2 rounded-xl border border-gray-200 text-gray-700 hover:text-amber-700 hover:border-amber-300 hover:bg-amber-50/50 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Become a Host</span>
              </button>
            )}

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 rounded-full hover:ring-2 hover:ring-amber-200 transition cursor-pointer"
                >
                  <img
                    src={
                      user.avatar ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`
                    }
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover border border-amber-300 shadow-sm"
                  />
                  <div className="text-left hidden lg:block pr-1">
                    <p className="text-xs font-semibold text-gray-800 leading-tight truncate max-w-[120px]">
                      {user.name.split(" ")[0]}
                    </p>
                    <p className="text-[10px] text-gray-600 capitalize">
                      {user.role === "hotelOwner" ? "Hotel Host" : user.role}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl ring-1 ring-black/5 p-2 z-50 animate-in fade-in">
                    <div className="px-3 py-2.5 border-b border-gray-100">
                      <p className="text-xs font-bold text-gray-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-gray-600 truncate">
                        {user.email}
                      </p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800">
                        {user.role === "admin"
                          ? "Platform Admin"
                          : user.role === "hotelOwner"
                            ? "Verified Host"
                            : "Guest Traveler"}
                      </span>
                    </div>

                    <div className="py-1">
                      {user.role === "admin" && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs text-red-700 hover:bg-red-50 rounded-xl font-medium"
                        >
                          <Shield className="w-4 h-4 text-red-600" />
                          Admin Control Panel
                        </Link>
                      )}
                      <Link
                        to="/my-bookings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 rounded-xl"
                      >
                        <Calendar className="w-4 h-4 text-gray-600" />
                        My Reservations
                      </Link>

                      {isOwner ? (
                        <Link
                          to="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs text-amber-700 hover:bg-amber-50 rounded-xl font-medium"
                        >
                          <LayoutDashboard className="w-4 h-4 text-amber-600" />
                          Host Operations Portal
                        </Link>
                      ) : (
                        <button
                          onClick={handleBecomeHost}
                          className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-amber-700 hover:bg-amber-50 rounded-xl font-medium cursor-pointer"
                        >
                          <PlusCircle className="w-4 h-4 text-amber-600" />
                          Upgrade to Host Account
                        </button>
                      )}
                    </div>

                    <div className="border-t border-gray-100 pt-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onOpenAuth("login")}
                  className="px-4 py-2 text-xs font-semibold text-gray-700 hover:text-gray-900 transition cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth("register")}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition shadow-sm cursor-pointer"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-gray-800 hover:bg-gray-50"
            >
              Home
            </Link>
            <Link
              to="/rooms"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-gray-800 hover:bg-gray-50"
            >
              Explore Rooms
            </Link>
            {isAuthenticated && (
              <Link
                to="/my-bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-gray-800 hover:bg-gray-50"
              >
                My Reservations
              </Link>
            )}
            {isOwner && (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-amber-700 bg-amber-50"
              >
                Host Dashboard
              </Link>
            )}
            {user?.role === "admin" && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-red-700 bg-red-50"
              >
                Admin Panel
              </Link>
            )}
          </div>

          <div className="pt-3 border-t border-gray-100">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={
                        user.avatar ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`
                      }
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm font-semibold text-gray-800">
                      {user.name}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs text-red-600 font-semibold"
                  >
                    Logout
                  </button>
                </div>

                {!isOwner && (
                  <button
                    onClick={handleBecomeHost}
                    className="w-full py-2.5 px-3 rounded-xl bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200"
                  >
                    Become a Host / List Property
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 px-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth("login");
                  }}
                  className="w-full py-2.5 text-center text-xs font-semibold border border-gray-300 rounded-xl text-gray-700"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth("register");
                  }}
                  className="w-full py-2.5 text-center text-xs font-semibold bg-gray-900 text-white rounded-xl"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
