import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingsAPI, roomsAPI } from '../services/api';
import {
  X,
  Calendar,
  Users,
  CreditCard,
  Building,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Printer,
  ChevronRight,
  LogIn,
} from 'lucide-react';
import toast from 'react-hot-toast';

const BookingModal = ({ isOpen, onClose, room, onBookingSuccess, onOpenAuth }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Date defaults: tomorrow to +2 days
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultCheckOut = new Date(tomorrow);
  defaultCheckOut.setDate(defaultCheckOut.getDate() + 2);

  const formatDate = (date) => date.toISOString().split('T')[0];

  const [checkInDate, setCheckInDate] = useState(formatDate(tomorrow));
  const [checkOutDate, setCheckOutDate] = useState(formatDate(defaultCheckOut));
  const [guests, setGuests] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(null);

  // Credit Card state
  const [cardData, setCardData] = useState({
    cardholderName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  if (!isOpen || !room) return null;

  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);
  const diffTime = end - start;
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const pricePerNight = room.pricePerNight || 250;
  const subtotal = nights * pricePerNight;
  const taxAndFees = Math.round(subtotal * 0.12);
  const totalPrice = subtotal + taxAndFees;

  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 16);
    val = val.replace(/(\d{4})/g, '$1 ').trim();
    setCardData({ ...cardData, cardNumber: val });
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setCardData({ ...cardData, expiry: val });
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please sign in to confirm your reservation.');
      if (onOpenAuth) onOpenAuth('login');
      return;
    }

    if (start >= end) {
      toast.error('Check-out date must be strictly after check-in date.');
      return;
    }

    if (paymentMethod === 'Credit Card') {
      if (!cardData.cardholderName.trim()) {
        toast.error('Please enter the cardholder name.');
        return;
      }
      if (cardData.cardNumber.replace(/\s/g, '').length !== 16) {
        toast.error('Please enter a valid 16-digit credit card number.');
        return;
      }
      if (!cardData.expiry || cardData.expiry.length !== 5) {
        toast.error('Please enter a valid expiry date (MM/YY).');
        return;
      }
      if (cardData.cvv.length < 3) {
        toast.error('Please enter a valid 3-digit CVC code.');
        return;
      }
    }

    setLoading(true);
    try {
      // 1. Check availability
      const availCheck = await roomsAPI.checkAvailability(room._id, checkInDate, checkOutDate);
      if (!availCheck.isAvailable) {
        toast.error(availCheck.message || 'Room is unavailable for these dates');
        setLoading(false);
        return;
      }

      // 2. Submit booking to MongoDB
      const res = await bookingsAPI.create({
        roomId: room._id,
        checkInDate,
        checkOutDate,
        guests: Number(guests),
        paymentMethod,
        guestDetails: {
          fullName: user.name,
          email: user.email,
          phone: user.phone || '',
          specialRequests,
        },
      });

      setBookingConfirmed(res.data);
      toast.success('Reservation confirmed! Confirmation email sent to your inbox.');
      if (onBookingSuccess) onBookingSuccess(res.data);
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Booking could not be completed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-gray-100">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-900 to-gray-800 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-playfair font-bold text-lg">
                {bookingConfirmed ? 'Reservation Confirmed' : 'Reserve Luxury Suite'}
              </h3>
              <p className="text-xs text-gray-300">
                {room.hotel?.name || 'Exclusive Resort'} • {room.title || room.roomType}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {bookingConfirmed ? (
            /* Confirmation Voucher View */
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold text-amber-600 tracking-wider uppercase">
                  Official Guest Reservation Voucher
                </span>
                <h4 className="font-playfair text-2xl font-bold text-gray-900 mt-1">
                  You are all set for an exceptional stay!
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  Reservation Reference Code:{' '}
                  <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
                    {bookingConfirmed.bookingReference}
                  </span>
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-medium border border-emerald-200 mt-2">
                  <i className="fa-regular fa-envelope text-emerald-600"></i>
                  <span>A detailed confirmation receipt was sent to <strong>{user?.email}</strong></span>
                </div>
              </div>

              {/* Voucher Details */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 text-left space-y-3">
                <div className="flex justify-between items-start pb-3 border-b border-gray-200">
                  <div>
                    <h5 className="font-bold text-gray-900 text-sm">{room.title || room.roomType}</h5>
                    <p className="text-xs text-gray-500">{room.hotel?.name}, {room.hotel?.city}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                    {bookingConfirmed.isPaid ? 'Settled (Paid)' : 'Pay at Hotel'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400 block">Check-in</span>
                    <span className="font-semibold text-gray-800">
                      {new Date(checkInDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Check-out</span>
                    <span className="font-semibold text-gray-800">
                      {new Date(checkOutDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Duration</span>
                    <span className="font-semibold text-gray-800">{nights} Nights</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Total Rate</span>
                    <span className="font-bold text-emerald-600 font-sans">${bookingConfirmed.totalPrice}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    navigate('/my-bookings');
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-gray-900 text-white font-semibold text-xs hover:bg-gray-800 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>View in My Reservations</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => window.print()}
                  className="py-3 px-4 rounded-xl border border-gray-200 text-gray-700 font-semibold text-xs hover:bg-gray-50 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Voucher</span>
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form View */
            <form onSubmit={handleCreateBooking} className="space-y-5">
              
              {/* Not Authenticated Warning */}
              {!isAuthenticated && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                  <div className="text-xs text-amber-900">
                    <p className="font-semibold">Sign In Required</p>
                    <p className="text-[11px] text-amber-700">Please sign in or create an account to finalize your reservation.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenAuth && onOpenAuth('login')}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer flex items-center gap-1.5"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>
                </div>
              )}

              {/* Date Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    required
                    min={formatDate(today)}
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-amber-600 font-sans"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    required
                    min={checkInDate}
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-amber-600 font-sans"
                  />
                </div>
              </div>

              {/* Guests Count */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-amber-600" />
                  Guests (Suite maximum: {room.capacity || 2})
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-amber-600 bg-white"
                >
                  {[...Array(room.capacity || 2)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} Guest{i > 0 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Select Payment Option
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition ${
                      paymentMethod === 'Credit Card'
                        ? 'border-amber-600 bg-amber-50/50 text-amber-900 font-semibold'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Credit Card"
                      checked={paymentMethod === 'Credit Card'}
                      onChange={() => setPaymentMethod('Credit Card')}
                      className="text-amber-600"
                    />
                    <CreditCard className="w-4 h-4 text-amber-600" />
                    <span className="text-xs">Credit Card (Stripe)</span>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition ${
                      paymentMethod === 'Pay At Hotel'
                        ? 'border-amber-600 bg-amber-50/50 text-amber-900 font-semibold'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Pay At Hotel"
                      checked={paymentMethod === 'Pay At Hotel'}
                      onChange={() => setPaymentMethod('Pay At Hotel')}
                      className="text-amber-600"
                    />
                    <Building className="w-4 h-4 text-amber-600" />
                    <span className="text-xs">Pay Upon Arrival</span>
                  </label>
                </div>
              </div>

              {/* Credit Card Input Fields if Credit Card selected */}
              {paymentMethod === 'Credit Card' && (
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs text-gray-700 font-semibold pb-1">
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      Encrypted Card Payment
                    </span>
                    <span className="text-[10px] text-gray-400">256-bit SSL</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-gray-600 mb-1">
                      Cardholder Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={cardData.cardholderName}
                      onChange={(e) => setCardData({ ...cardData, cardholderName: e.target.value })}
                      placeholder="e.g. Julian Hayes"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-amber-600 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-gray-600 mb-1">
                      16-Digit Card Number
                    </label>
                    <input
                      type="text"
                      required
                      value={cardData.cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="4000 1234 5678 9010"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-amber-600 bg-white font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-gray-600 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        required
                        value={cardData.expiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-amber-600 bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-600 mb-1">
                        CVC / CVV
                      </label>
                      <input
                        type="text"
                        required
                        maxLength="4"
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '') })}
                        placeholder="123"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-amber-600 bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Special Requests */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Special Requests (Optional)
                </label>
                <input
                  type="text"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. High floor, feather-free pillows, late check-in"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-amber-600"
                />
              </div>

              {/* Rate Breakdown */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>${pricePerNight} × {nights} nights</span>
                  <span className="font-sans font-medium">${subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Hospitality tax & resort service fee (12%)</span>
                  <span className="font-sans font-medium">${taxAndFees}</span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-gray-900 text-sm">
                  <span>Total Amount Due</span>
                  <span className="text-amber-600 font-sans">${totalPrice}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !isAuthenticated}
                className="w-full py-3.5 px-4 rounded-xl bg-gray-900 hover:bg-amber-600 text-white font-bold text-xs transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span>Securing Reservation...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirm Reservation (${totalPrice})</span>
                  </>
                )}
              </button>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default BookingModal;
