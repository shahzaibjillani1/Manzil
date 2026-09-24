import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';

// Initial state loaded from localStorage if present
const storedUser = localStorage.getItem('user');
const storedToken = localStorage.getItem('token');

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  isAuthenticated: !!storedToken,
  loading: false,
  error: null,
};

// Async Thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await authAPI.login({ email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success(`Welcome back, ${data.user.name}!`);
      return data;
    } catch (err) {
      const msg = typeof err === 'string' ? err : err.response?.data?.message || 'Login failed';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authAPI.register(userData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success(`Welcome to QuickStay, ${data.user.name}!`);
      return data;
    } catch (err) {
      const msg = typeof err === 'string' ? err : err.response?.data?.message || 'Registration failed';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const loadCurrentUser = createAsyncThunk(
  'auth/loadCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const data = await authAPI.getMe();
      localStorage.setItem('user', JSON.stringify(data.user));
      return data.user;
    } catch (err) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return rejectWithValue('Session expired');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const data = await authAPI.updateProfile(profileData);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Profile updated successfully');
      return data.user;
    } catch (err) {
      const msg = typeof err === 'string' ? err : 'Update profile failed';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const upgradeToHost = createAsyncThunk(
  'auth/upgradeToHost',
  async (_, { rejectWithValue }) => {
    try {
      const data = await authAPI.updateProfile({ role: 'hotelOwner' });
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Upgraded to Verified Host! You can now list properties.');
      return data.user;
    } catch (err) {
      const msg = typeof err === 'string' ? err : 'Failed to upgrade to host';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.success('Signed out successfully');
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Load current user
      .addCase(loadCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loadCurrentUser.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      // Update profile
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      // Upgrade to host
      .addCase(upgradeToHost.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logoutUser, clearAuthError } = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsAdmin = (state) => state.auth.user?.role === 'admin';
export const selectIsOwner = (state) =>
  state.auth.user?.role === 'hotelOwner' || state.auth.user?.role === 'admin';

export default authSlice.reducer;
