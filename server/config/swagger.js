export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Manzil Pakistani Hospitality REST API",
    version: "1.0.0",
    description:
      "Production-grade MERN reservation engine featuring atomic double-booking concurrency locks, role-based authorization (Guest / Host / Admin), dynamic rate calculations, and live MongoDB persistence.",
    contact: {
      name: "Manzil Engineering Team",
      url: "https://manzil-liart.vercel.app",
    },
  },
  servers: [
    {
      url: "https://manzil-liart.vercel.app/api",
      description: "Local API Gateway",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description:
          "Enter your JWT token obtained from /auth/login or /auth/register",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          _id: { type: "string", example: "67f76393197ac559e4089b72" },
          name: { type: "string", example: "Sophia Laurent" },
          email: { type: "string", example: "sophia@example.com" },
          role: {
            type: "string",
            enum: ["guest", "hotelOwner", "admin"],
            example: "guest",
          },
          phone: { type: "string", example: "+1 (555) 234-5678" },
          avatar: {
            type: "string",
            example:
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
          },
        },
      },
      Hotel: {
        type: "object",
        properties: {
          _id: { type: "string", example: "67f76393197ac559e4089b72" },
          name: { type: "string", example: "Margalla Heights Grand Hotel" },
          description: {
            type: "string",
            example: "A benchmark of luxury nestled in Margalla Hills.",
          },
          address: {
            type: "string",
            example: "Club Road, Near Serena Hotel, F-6/2",
          },
          city: { type: "string", example: "Islamabad" },
          contact: { type: "string", example: "+92 51 2871234" },
          rating: { type: "number", example: 5.0 },
          featuredImage: {
            type: "string",
            example:
              "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
          },
          amenities: {
            type: "array",
            items: { type: "string" },
            example: ["Free WiFi", "Pool Access"],
          },
        },
      },
      Room: {
        type: "object",
        properties: {
          _id: { type: "string", example: "67f7647c197ac559e4089b96" },
          title: { type: "string", example: "Royal Palm Beachfront Penthouse" },
          roomType: { type: "string", example: "Presidential Penthouse" },
          pricePerNight: { type: "number", example: 850 },
          capacity: { type: "number", example: 4 },
          bedCount: { type: "number", example: 2 },
          bathCount: { type: "number", example: 3 },
          roomSizeSqFt: { type: "number", example: 1400 },
          isAvailable: { type: "boolean", example: true },
          rating: { type: "number", example: 5.0 },
          reviewsCount: { type: "number", example: 52 },
          amenities: {
            type: "array",
            items: { type: "string" },
            example: ["Free WiFi", "Room Service"],
          },
          images: { type: "array", items: { type: "string" } },
        },
      },
      Booking: {
        type: "object",
        properties: {
          _id: { type: "string", example: "67f76839994a731e97d3b8ce" },
          bookingReference: { type: "string", example: "QS-A8B9C1" },
          checkInDate: {
            type: "string",
            format: "date",
            example: "2026-10-01",
          },
          checkOutDate: {
            type: "string",
            format: "date",
            example: "2026-10-04",
          },
          nights: { type: "number", example: 3 },
          guests: { type: "number", example: 2 },
          totalPrice: { type: "number", example: 2856 },
          paymentMethod: { type: "string", example: "Credit Card" },
          isPaid: { type: "boolean", example: true },
          status: {
            type: "string",
            enum: ["confirmed", "completed", "cancelled"],
            example: "confirmed",
          },
        },
      },
    },
  },
  paths: {
    "/health": {
      get: {
        summary: "System healthcheck and database connectivity",
        tags: ["System"],
        responses: {
          200: {
            description: "API is healthy and operational",
          },
        },
      },
    },
    "/auth/register": {
      post: {
        summary: "Register a new user (Guest or Host)",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: { type: "string", example: "Julian Hayes" },
                  email: { type: "string", example: "julian@example.com" },
                  password: { type: "string", example: "password123" },
                  phone: { type: "string", example: "+1 (555) 019-2834" },
                  role: {
                    type: "string",
                    enum: ["guest", "hotelOwner"],
                    example: "guest",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "User registered successfully and JWT returned" },
          400: { description: "Validation failure or email already taken" },
        },
      },
    },
    "/auth/login": {
      post: {
        summary: "Login and receive JWT Bearer token",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", example: "guest@demo.com" },
                  password: { type: "string", example: "password123" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Login successful" },
          401: { description: "Invalid email or password" },
        },
      },
    },
    "/auth/me": {
      get: {
        summary: "Get current authenticated user profile",
        tags: ["Authentication"],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: "Current user profile data" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/auth/profile": {
      put: {
        summary: "Update user profile & upgrade to Host role",
        tags: ["Authentication"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  phone: { type: "string" },
                  role: { type: "string", enum: ["guest", "hotelOwner"] },
                  avatar: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Profile updated" },
        },
      },
    },
    "/rooms": {
      get: {
        summary: "Search and filter suites with live date availability",
        tags: ["Rooms"],
        parameters: [
          {
            name: "city",
            in: "query",
            schema: { type: "string" },
            description:
              "Filter by city (e.g. Islamabad, Lahore, Karachi, Murree)",
          },
          {
            name: "roomType",
            in: "query",
            schema: { type: "string" },
            description: "Filter by type (e.g. Luxury Suite, Double Bed)",
          },
          { name: "minPrice", in: "query", schema: { type: "number" } },
          { name: "maxPrice", in: "query", schema: { type: "number" } },
          { name: "guests", in: "query", schema: { type: "number" } },
          {
            name: "checkIn",
            in: "query",
            schema: { type: "string", format: "date" },
            description: "Exclude rooms with conflicting reservations",
          },
          {
            name: "checkOut",
            in: "query",
            schema: { type: "string", format: "date" },
          },
          {
            name: "sort",
            in: "query",
            schema: {
              type: "string",
              enum: ["rating", "price_asc", "price_desc", "newest"],
            },
          },
        ],
        responses: {
          200: { description: "List of matching available rooms" },
        },
      },
      post: {
        summary: "Publish a new luxury suite (Host only)",
        tags: ["Rooms"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["hotelId", "title", "pricePerNight"],
                properties: {
                  hotelId: { type: "string" },
                  roomType: { type: "string", example: "Luxury Suite" },
                  title: { type: "string", example: "Sapphire Ocean Suite" },
                  description: { type: "string" },
                  pricePerNight: { type: "number", example: 450 },
                  capacity: { type: "number", example: 2 },
                  bedCount: { type: "number", example: 1 },
                  bathCount: { type: "number", example: 1 },
                  roomSizeSqFt: { type: "number", example: 600 },
                  images: { type: "array", items: { type: "string" } },
                  amenities: { type: "array", items: { type: "string" } },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Room created and listed" },
          403: { description: "Forbidden - only hosts can publish rooms" },
        },
      },
    },
    "/rooms/{id}": {
      get: {
        summary: "Get suite specifications and verified reviews by ID",
        tags: ["Rooms"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Suite details and reviews" },
          404: { description: "Room not found" },
        },
      },
      put: {
        summary: "Update suite details or toggle availability (Host only)",
        tags: ["Rooms"],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Room updated" },
        },
      },
      delete: {
        summary: "Delete suite listing (Host only)",
        tags: ["Rooms"],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Room removed" },
        },
      },
    },
    "/rooms/{id}/availability": {
      post: {
        summary: "Validate room availability for date range",
        tags: ["Rooms"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["checkInDate", "checkOutDate"],
                properties: {
                  checkInDate: {
                    type: "string",
                    format: "date",
                    example: "2026-10-01",
                  },
                  checkOutDate: {
                    type: "string",
                    format: "date",
                    example: "2026-10-04",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Availability check result" },
        },
      },
    },
    "/hotels": {
      get: {
        summary: "List hotel properties",
        tags: ["Hotels"],
        parameters: [{ name: "city", in: "query", schema: { type: "string" } }],
        responses: {
          200: { description: "List of hotels" },
        },
      },
      post: {
        summary: "Register a new hotel property (Host only)",
        tags: ["Hotels"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "city", "address", "contact"],
                properties: {
                  name: {
                    type: "string",
                    example: "Pearl Continental Luxury Suites",
                  },
                  city: { type: "string", example: "Lahore" },
                  address: {
                    type: "string",
                    example: "Shahrah-e-Quaid-e-Azam, The Mall",
                  },
                  contact: { type: "string", example: "+92 42 36362222" },
                  description: { type: "string" },
                  featuredImage: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Hotel registered" },
        },
      },
    },
    "/hotels/my": {
      get: {
        summary: "Get properties owned by the authenticated Host",
        tags: ["Hotels"],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: "List of host properties" },
        },
      },
    },
    "/hotels/{id}": {
      get: {
        summary: "Get hotel property by ID with affiliated rooms",
        tags: ["Hotels"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Hotel details and rooms" },
        },
      },
    },
    "/bookings": {
      post: {
        summary: "Create a reservation with double-booking concurrency lock",
        tags: ["Bookings"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["roomId", "checkInDate", "checkOutDate"],
                properties: {
                  roomId: {
                    type: "string",
                    example: "67f7647c197ac559e4089b96",
                  },
                  checkInDate: {
                    type: "string",
                    format: "date",
                    example: "2026-10-10",
                  },
                  checkOutDate: {
                    type: "string",
                    format: "date",
                    example: "2026-10-13",
                  },
                  guests: { type: "number", example: 2 },
                  paymentMethod: {
                    type: "string",
                    enum: ["Credit Card", "Pay At Hotel"],
                    example: "Credit Card",
                  },
                  guestDetails: {
                    type: "object",
                    properties: {
                      fullName: { type: "string", example: "Marcus Vance" },
                      email: { type: "string", example: "marcus@example.com" },
                      phone: { type: "string", example: "+1 555-432-1098" },
                      specialRequests: {
                        type: "string",
                        example: "High floor preferred",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Reservation confirmed" },
          409: {
            description: "Conflict - room already reserved for selected dates",
          },
        },
      },
    },
    "/bookings/my": {
      get: {
        summary: "Retrieve authenticated user reservations & vouchers",
        tags: ["Bookings"],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: "List of user reservations" },
        },
      },
    },
    "/bookings/owner": {
      get: {
        summary: "Retrieve host properties reservations and revenue metrics",
        tags: ["Bookings"],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: "Host bookings and total gross revenue stats" },
        },
      },
    },
    "/bookings/{id}/cancel": {
      put: {
        summary: "Cancel reservation and release date interval",
        tags: ["Bookings"],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Reservation cancelled" },
        },
      },
    },
    "/bookings/{id}/status": {
      put: {
        summary: "Update reservation status (Host / Admin)",
        tags: ["Bookings"],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    enum: ["confirmed", "completed", "cancelled"],
                  },
                  isPaid: { type: "boolean" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Status updated" },
        },
      },
    },
    "/reviews/room/{roomId}": {
      get: {
        summary: "Get verified guest reviews for a room",
        tags: ["Reviews"],
        parameters: [
          {
            name: "roomId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "List of verified reviews" },
        },
      },
      post: {
        summary: "Submit rating (1-5) and review comment for a room",
        tags: ["Reviews"],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "roomId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["rating", "comment"],
                properties: {
                  rating: {
                    type: "number",
                    minimum: 1,
                    maximum: 5,
                    example: 5,
                  },
                  comment: {
                    type: "string",
                    example: "Outstanding stay, breathtaking views!",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Review posted and room average recalculated" },
        },
      },
    },
    "/admin/stats": {
      get: {
        summary: "Get platform-wide statistics (Admin only)",
        tags: ["Admin"],
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description:
              "Aggregated platform stats (users, hotels, bookings, revenue)",
          },
          403: { description: "Forbidden - admin access required" },
        },
      },
    },
    "/admin/users": {
      get: {
        summary: "List all registered users (Admin only)",
        tags: ["Admin"],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: "List of all users" },
          403: { description: "Forbidden - admin access required" },
        },
      },
    },
    "/admin/users/{id}": {
      put: {
        summary: "Update a user's details or role (Admin only)",
        tags: ["Admin"],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  email: { type: "string" },
                  role: {
                    type: "string",
                    enum: ["guest", "hotelOwner", "admin"],
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "User updated" },
          403: { description: "Forbidden - admin access required" },
          404: { description: "User not found" },
        },
      },
      delete: {
        summary: "Delete a user (Admin only)",
        tags: ["Admin"],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "User deleted" },
          403: { description: "Forbidden - admin access required" },
          404: { description: "User not found" },
        },
      },
    },
    "/admin/hotels": {
      get: {
        summary: "List all hotel properties (Admin only)",
        tags: ["Admin"],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: "List of all hotels across the platform" },
          403: { description: "Forbidden - admin access required" },
        },
      },
    },
    "/admin/hotels/{id}": {
      delete: {
        summary: "Delete a hotel property (Admin only)",
        tags: ["Admin"],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Hotel deleted" },
          403: { description: "Forbidden - admin access required" },
          404: { description: "Hotel not found" },
        },
      },
    },
    "/admin/bookings": {
      get: {
        summary: "List all reservations across the platform (Admin only)",
        tags: ["Admin"],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: "List of all bookings" },
          403: { description: "Forbidden - admin access required" },
        },
      },
    },
    "/admin/bookings/{id}": {
      put: {
        summary: "Update any reservation's status or payment (Admin only)",
        tags: ["Admin"],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    enum: ["confirmed", "completed", "cancelled"],
                  },
                  isPaid: { type: "boolean" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Booking updated" },
          403: { description: "Forbidden - admin access required" },
          404: { description: "Booking not found" },
        },
      },
    },
    "/admin/reviews": {
      get: {
        summary: "List all reviews across the platform (Admin only)",
        tags: ["Admin"],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: "List of all reviews" },
          403: { description: "Forbidden - admin access required" },
        },
      },
    },
    "/admin/reviews/{id}": {
      delete: {
        summary: "Delete a review (Admin only)",
        tags: ["Admin"],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Review deleted" },
          403: { description: "Forbidden - admin access required" },
          404: { description: "Review not found" },
        },
      },
    },
  },
};
