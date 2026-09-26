import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { seedDatabase } from "./utils/seedRunner.js";

import authRoutes from "./routes/authRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./config/swagger.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || /^http:\/\/localhost:\d+$/.test(origin)) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  }),
);

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

const swaggerOptions = {
  customCssUrl: "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css",
  customJs: [
    "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js",
    "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-standalone-preset.js",
  ],
};

app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, swaggerOptions),
);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, swaggerOptions),
);

app.get(["/", "/api"], (req, res) => {
  res.status(200).json({
    message: "Welcome to Manzil Pakistani Hospitality Core REST API",
    version: "1.0.0",
    documentation: "http://localhost:5000/api/docs",
    swaggerUi: "http://localhost:5000/api-docs",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    endpoints: {
      swaggerDocs: "GET /api/docs",
      health: "GET /api/health",
      rooms: "GET /api/rooms",
      hotels: "GET /api/hotels",
      auth: {
        login: "POST /api/auth/login",
        register: "POST /api/auth/register",
        profile: "GET /api/auth/me",
      },
      bookings: {
        create: "POST /api/bookings",
        myBookings: "GET /api/bookings/my",
        hostBookings: "GET /api/bookings/owner",
      },
      reviews: "GET /api/reviews/room/:roomId",
    },
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "Hotel Booking Core API",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    environment: process.env.NODE_ENV || "development",
  });
});

app.post("/api/seed", async (req, res, next) => {
  try {
    await seedDatabase();
    res
      .status(200)
      .json({ success: true, message: "Database reset & seeded successfully" });
  } catch (error) {
    next(error);
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

let isDbConnected = false;
const ensureDbConnected = async () => {
  if (!isDbConnected) {
    await connectDB();
    isDbConnected = true;
  }
};

if (process.env.VERCEL) {
  ensureDbConnected().catch((error) => {
    console.error("Failed to connect to database on Vercel:", error);
  });
} else {
  const startServer = async () => {
    try {
      await connectDB();
      isDbConnected = true;
      app.listen(PORT, () => {
        console.log(
          `🚀 Hotel Booking Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`,
        );
        console.log(
          `📍 API Healthcheck available at: http://localhost:${PORT}/api/health`,
        );
      });
    } catch (error) {
      console.error("Failed to start server:", error);
      process.exit(1);
    }
  };

  startServer();
}

export default app;
