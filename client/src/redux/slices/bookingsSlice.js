import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { bookingsAPI } from "../../services/api";
import toast from "react-hot-toast";

const initialState = {
  myBookings: [],
  ownerBookings: null,
  loading: false,
  error: null,
};

export const fetchMyBookings = createAsyncThunk(
  "bookings/fetchMyBookings",
  async (_, { rejectWithValue }) => {
    try {
      const data = await bookingsAPI.getMyBookings();
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch bookings",
      );
    }
  },
);

export const fetchOwnerBookings = createAsyncThunk(
  "bookings/fetchOwnerBookings",
  async (_, { rejectWithValue }) => {
    try {
      const data = await bookingsAPI.getOwnerBookings();
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch host bookings",
      );
    }
  },
);

export const createNewBooking = createAsyncThunk(
  "bookings/createNewBooking",
  async (bookingData, { rejectWithValue }) => {
    try {
      const data = await bookingsAPI.create(bookingData);
      toast.success(
        "Reservation confirmed! Confirmation email sent to your inbox.",
      );
      return data;
    } catch (err) {
      const msg =
        typeof err === "string"
          ? err
          : err.response?.data?.message || "Booking failed";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);

export const cancelBooking = createAsyncThunk(
  "bookings/cancelBooking",
  async (bookingId, { rejectWithValue }) => {
    try {
      const data = await bookingsAPI.cancel(bookingId);
      toast.success("Reservation cancelled");
      return data.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Could not cancel booking";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);

export const bookingsSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    clearBookingsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.myBookings = action.payload;
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOwnerBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOwnerBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.ownerBookings = action.payload;
      })
      .addCase(fetchOwnerBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.myBookings = state.myBookings.map((b) =>
          b._id === action.payload._id ? action.payload : b,
        );
      });
  },
});

export const { clearBookingsError } = bookingsSlice.actions;

export const selectMyBookings = (state) => state.bookings.myBookings;
export const selectOwnerBookings = (state) => state.bookings.ownerBookings;
export const selectBookingsLoading = (state) => state.bookings.loading;

export default bookingsSlice.reducer;
