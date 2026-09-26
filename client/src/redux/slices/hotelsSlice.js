import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { hotelsAPI } from "../../services/api";

const initialState = {
  hotels: [],
  myHotels: [],
  selectedHotel: null,
  loading: false,
  error: null,
};

export const fetchHotels = createAsyncThunk(
  "hotels/fetchHotels",
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await hotelsAPI.getAll(params);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch hotels",
      );
    }
  },
);

export const fetchMyHotels = createAsyncThunk(
  "hotels/fetchMyHotels",
  async (_, { rejectWithValue }) => {
    try {
      const data = await hotelsAPI.getMyHotels();
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch host hotels",
      );
    }
  },
);

export const hotelsSlice = createSlice({
  name: "hotels",
  initialState,
  reducers: {
    clearHotelsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotels.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.loading = false;
        state.hotels = action.payload;
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyHotels.fulfilled, (state, action) => {
        state.myHotels = action.payload;
      });
  },
});

export const { clearHotelsError } = hotelsSlice.actions;

export const selectHotels = (state) => state.hotels.hotels;
export const selectMyHotels = (state) => state.hotels.myHotels;
export const selectHotelsLoading = (state) => state.hotels.loading;

export default hotelsSlice.reducer;
