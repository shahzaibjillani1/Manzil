import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
    }
    return Promise.reject(error);
  },
);

export const authAPI = {
  login: async (credentials) => {
    try {
      const { data } = await api.post("/auth/login", credentials);
      return data;
    } catch (err) {
      throw (
        err.response?.data?.message ||
        "Login failed. Please check your credentials."
      );
    }
  },
  register: async (userData) => {
    try {
      const { data } = await api.post("/auth/register", userData);
      return data;
    } catch (err) {
      throw err.response?.data?.message || "Registration failed.";
    }
  },
  getMe: async () => {
    const { data } = await api.get("/auth/me");
    return data;
  },
  updateProfile: async (profileData) => {
    try {
      const { data } = await api.put("/auth/profile", profileData);
      return data;
    } catch (err) {
      throw err.response?.data?.message || "Could not update profile.";
    }
  },
};

export const roomsAPI = {
  getAll: async (params = {}) => {
    const { data } = await api.get("/rooms", { params });
    return data.data;
  },
  getById: async (id) => {
    const { data } = await api.get(`/rooms/${id}`);
    return data.data;
  },
  checkAvailability: async (id, checkInDate, checkOutDate) => {
    const { data } = await api.post(`/rooms/${id}/availability`, {
      checkInDate,
      checkOutDate,
    });
    return data;
  },
  create: async (roomData) => {
    const { data } = await api.post("/rooms", roomData);
    return data;
  },
  update: async (id, roomData) => {
    const { data } = await api.put(`/rooms/${id}`, roomData);
    return data;
  },
  delete: async (id) => {
    const { data } = await api.delete(`/rooms/${id}`);
    return data;
  },
};

export const hotelsAPI = {
  getAll: async (params = {}) => {
    const { data } = await api.get("/hotels", { params });
    return data.data;
  },
  getMyHotels: async () => {
    const { data } = await api.get("/hotels/my");
    return data.data;
  },
  getById: async (id) => {
    const { data } = await api.get(`/hotels/${id}`);
    return data.data;
  },
  create: async (hotelData) => {
    const { data } = await api.post("/hotels", hotelData);
    return data;
  },
  update: async (id, hotelData) => {
    const { data } = await api.put(`/hotels/${id}`, hotelData);
    return data;
  },
  delete: async (id) => {
    const { data } = await api.delete(`/hotels/${id}`);
    return data;
  },
};

export const bookingsAPI = {
  create: async (bookingData) => {
    try {
      const { data } = await api.post("/bookings", bookingData);
      return data;
    } catch (err) {
      throw err.response?.data?.message || "Could not complete booking.";
    }
  },
  getMyBookings: async () => {
    const { data } = await api.get("/bookings/my");
    return data.data;
  },
  getOwnerBookings: async () => {
    const { data } = await api.get("/bookings/owner");
    return data;
  },
  cancel: async (id) => {
    const { data } = await api.put(`/bookings/${id}/cancel`);
    return data;
  },
  updateStatus: async (id, status, isPaid) => {
    const { data } = await api.put(`/bookings/${id}/status`, {
      status,
      isPaid,
    });
    return data;
  },
};

export const adminAPI = {
  getStats: async () => {
    const { data } = await api.get("/admin/stats");
    return data.data;
  },
  getUsers: async (params = {}) => {
    const { data } = await api.get("/admin/users", { params });
    return data;
  },
  updateUser: async (id, userData) => {
    const { data } = await api.put(`/admin/users/${id}`, userData);
    return data;
  },
  deleteUser: async (id) => {
    const { data } = await api.delete(`/admin/users/${id}`);
    return data;
  },
  getHotels: async (params = {}) => {
    const { data } = await api.get("/admin/hotels", { params });
    return data;
  },
  deleteHotel: async (id) => {
    const { data } = await api.delete(`/admin/hotels/${id}`);
    return data;
  },
  getBookings: async (params = {}) => {
    const { data } = await api.get("/admin/bookings", { params });
    return data;
  },
  updateBooking: async (id, bookingData) => {
    const { data } = await api.put(`/admin/bookings/${id}`, bookingData);
    return data;
  },
  getReviews: async (params = {}) => {
    const { data } = await api.get("/admin/reviews", { params });
    return data;
  },
  deleteReview: async (id) => {
    const { data } = await api.delete(`/admin/reviews/${id}`);
    return data;
  },
};
export const reviewsAPI = {
  getRoomReviews: async (roomId) => {
    const { data } = await api.get(`/reviews/room/${roomId}`);
    return data.data;
  },
  addReview: async (roomId, reviewData) => {
    const { data } = await api.post(`/reviews/room/${roomId}`, reviewData);
    return data;
  },
};

export const checkHealth = async () => {
  const { data } = await api.get("/health");
  return data;
};

export default api;
