import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  MapPin,
  Printer,
  Building,
  X,
  FileText,
  LogIn,
} from 'lucide-react';
import toast from 'react-hot-toast';

const MyBookingsPage = ({ onOpenAuth }) => {
  const { isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingsAPI.getMyBookings();
      setBookings(data || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this reservation? The reserved dates will be immediately released.')) {
      return;
    }

    try {
      await bookingsAPI.cancel(bookingId);
      toast.success('Reservation cancelled successfully.');
      fetchBookings();
    } catch {
      toast.error('Could not cancel booking.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-gray-50/50">
        <div className="bg-white p-8 rounded-3xl border border-gray-200 text-center max-w-md shadow-lg space-y-4">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <Calendar className="w-7 h-7" />
          </div>
          <h2 className="font-playfair text-2xl font-bold text-gray-900">Sign in to View Reservations</h2>
          <p className="text-xs text-gray-500">
            Please sign in to your Manzil account to view your confirmed stays, digital vouchers, and reservation receipts.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onOpenAuth && onOpenAuth('login')}
              className="w-full py-3 px-4 rounded-xl bg-gray-900 hover:bg-amber-600 text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Account</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'confirmed') return b.status === 'confirmed';
    if (filter === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50/40 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-gray-200 gap-4">
          <div>
            <h1 className="font-playfair text-3xl font-bold text-gray-900">
              My Hotel Reservations
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Manage your confirmed upcoming stays, digital vouchers, and reservation history.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2">
            {['all', 'confirmed', 'cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition cursor-pointer ${
                  filter === tab
                    ? 'bg-gray-900 text-white shadow-xs'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="pt-8">
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-44 bg-white rounded-3xl border border-gray-200 animate-pulse" />
              ))}
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center max-w-lg mx-auto space-y-4">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="font-playfair text-xl font-bold text-gray-800">
                No Reservations Found
              </h3>
              <p className="text-xs text-gray-500">
                You haven't reserved any accommodations yet or no bookings match the selected status.
              </p>
              <Link
                to="/rooms"
                className="inline-block py-2.5 px-6 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-amber-600 transition"
              >
                Discover Available Suites
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredBookings.map((b) => {
                const roomImg =
                  b.room?.images?.[0] ||
                  b.hotel?.featuredImage ||
                  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600';

                const isCancelled = b.status === 'cancelled';

                return (
                  <div
                    key={b._id}
                    className="bg-white rounded-3xl border border-gray-200/80 p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"
                  >
                    {/* Left: Thumbnail & Details */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
                      <img
                        src={roomImg}
                        alt="Room"
                        className="w-full sm:w-32 h-24 rounded-2xl object-cover"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-800">
                            {b.bookingReference}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${
                              isCancelled
                                ? 'bg-red-100 text-red-700'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {b.status}
                          </span>
                          <span className="text-[11px] text-gray-400">
                            {b.paymentMethod} • {b.isPaid ? 'Paid' : 'Unpaid'}
                          </span>
                        </div>

                        <h3 className="font-playfair text-lg font-bold text-gray-900">
                          {b.room?.title || b.room?.roomType || 'Deluxe Luxury Room'}
                        </h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-600" />
                          <span>{b.hotel?.name}, {b.hotel?.city}</span>
                        </p>

                        <div className="flex items-center gap-4 text-xs text-gray-600 pt-1">
                          <span>
                            <strong>Check-in:</strong> {new Date(b.checkInDate).toLocaleDateString()}
                          </span>
                          <span>
                            <strong>Check-out:</strong> {new Date(b.checkOutDate).toLocaleDateString()}
                          </span>
                          <span>
                            <strong>Nights:</strong> {b.nights || 1}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Price & Actions */}
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                      <div className="text-left md:text-right">
                        <span className="text-[11px] text-gray-400 block">Total Rate</span>
                        <span className="text-xl font-bold text-gray-900 font-sans">
                          PKR {b.totalPrice?.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedVoucher(b)}
                          className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Voucher</span>
                        </button>

                        {!isCancelled && (
                          <button
                            onClick={() => handleCancelBooking(b._id)}
                            className="px-3.5 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Voucher Detail Modal */}
      {selectedVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-amber-600" />
                <h3 className="font-playfair text-lg font-bold text-gray-900">
                  Official Guest Voucher
                </h3>
              </div>
              <button
                onClick={() => setSelectedVoucher(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 text-center space-y-1">
              <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">
                Booking Reference Identifier
              </span>
              <p className="font-mono text-2xl font-bold text-gray-900 tracking-wider">
                {selectedVoucher.bookingReference}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Property</span>
                <span className="font-semibold text-gray-900">{selectedVoucher.hotel?.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Suite Type</span>
                <span className="font-semibold text-gray-900">{selectedVoucher.room?.title || selectedVoucher.room?.roomType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Guest Name</span>
                <span className="font-semibold text-gray-900">{selectedVoucher.guestDetails?.fullName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Check-in</span>
                <span className="font-semibold text-gray-900">{new Date(selectedVoucher.checkInDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Check-out</span>
                <span className="font-semibold text-gray-900">{new Date(selectedVoucher.checkOutDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Total Price</span>
                <span className="font-bold text-emerald-600 font-sans">PKR {selectedVoucher.totalPrice?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Payment Status</span>
                <span className="font-semibold text-gray-900">{selectedVoucher.isPaid ? 'Settled (Paid in Full)' : 'Due at Check-in'}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-gray-900 text-white font-semibold text-xs hover:bg-gray-800 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Voucher</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
