import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { roomsAPI } from "../../services/api";

const initialState = {
  rooms: [],
  selectedRoom: null,
  filters: {
    city: "All",
    roomType: "All",
    price: 1500,
    search: "",
  },
  loading: false,
  error: null,
  availability: null,
};

export const fetchRooms = createAsyncThunk(
  "rooms/fetchRooms",
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await roomsAPI.getAll(params);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch rooms",
      );
    }
  },
);

export const fetchRoomById = createAsyncThunk(
  "rooms/fetchRoomById",
  async (id, { rejectWithValue }) => {
    try {
      const data = await roomsAPI.getById(id);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch room",
      );
    }
  },
);

export const checkAvailability = createAsyncThunk(
  "rooms/checkAvailability",
  async ({ id, checkInDate, checkOutDate }, { rejectWithValue }) => {
    try {
      const data = await roomsAPI.checkAvailability(
        id,
        checkInDate,
        checkOutDate,
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Availability check failed",
      );
    }
  },
);

export const roomsSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearSelectedRoom: (state) => {
      state.selectedRoom = null;
      state.availability = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRoomById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoomById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRoom = action.payload;
      })
      .addCase(fetchRoomById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkAvailability.fulfilled, (state, action) => {
        state.availability = action.payload;
      });
  },
});

export const { setFilters, resetFilters, clearSelectedRoom } =
  roomsSlice.actions;

export const selectRooms = (state) => state.rooms.rooms;
export const selectSelectedRoom = (state) => state.rooms.selectedRoom;
export const selectRoomsLoading = (state) => state.rooms.loading;
export const selectRoomsFilters = (state) => state.rooms.filters;

export default roomsSlice.reducer;
