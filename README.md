# QuickStay — Luxury Hotel Reservation & Hospitality Management Platform

[![React](https://img.shields.io/badge/React-19.2-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![NodeJS](https://img.shields.io/badge/Node.js-v26-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_8-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![JWT](https://img.shields.io/badge/JWT-Stateless_Auth-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)](https://jwt.io/)

QuickStay is a production-grade full-stack hotel booking and property operations platform engineered with **React 19**, **Node.js**, **Express**, **MongoDB (Mongoose)**, and **Tailwind CSS v4**.

It delivers a consumer-facing luxury booking experience paired with a real-time Host Operations & Revenue Portal, protected by atomic double-booking concurrency locks and role-based access control (RBAC).

---

## 🚀 Quick Start

### 1. Installation
Install dependencies across both client and server:
```bash
# In the project root
npm run install:all
```

### 2. Running Frontend & Backend Concurrently
```bash
npm run dev
```

- **Frontend Application**: [http://localhost:5174](http://localhost:5174) (or [http://localhost:5173](http://localhost:5173))
- **Backend API Server**: [http://localhost:5000](http://localhost:5000)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🌟 Core Architecture & Capabilities

### 1. Concurrency & Overlap Prevention Engine
To prevent catastrophic race conditions where multiple guests reserve the same suite simultaneously, the reservation engine executes atomic date interval overlap checks directly in MongoDB:
$$\text{Conflict} \iff (\text{checkInDate} < \text{requestedCheckOut}) \land (\text{checkOutDate} > \text{requestedCheckIn})$$

```javascript
// Conflicting reservation detection
const conflictingBooking = await Booking.findOne({
  room: roomId,
  status: { $in: ['confirmed', 'pending'] },
  checkInDate: { $lt: reqCheckOut },
  checkOutDate: { $gt: reqCheckIn }
});

if (conflictingBooking) {
  return res.status(409).json({
    success: false,
    message: 'Room has already been reserved for these dates.'
  });
}
```

### 2. Multi-Role Hospitality Ecosystem
- **Traveler / Guest**:
  - Multi-criteria suite filtering (Destination city, room category, price slider, guest capacity, amenities).
  - Live availability validation for selected check-in and check-out dates.
  - Interactive reservation checkout with server-side price computation, hospitality taxes (12%), and payment methods (Credit Card / Stripe simulation, Pay at Hotel).
  - Official digital voucher generation with reference ID (`QS-XXXXXX`) and print receipt modal.
  - Verified ratings and reviews submission that recomputes average room ratings in MongoDB.
- **Hotel Owner / Host**:
  - Live operations console with real-time gross revenue KPI, reservation metrics, and managed properties count.
  - Property registration: Add new hotels/resorts with city, address, contact, and exterior imagery.
  - Suite inventory management: Add rooms with specifications (sq ft, bed/bath count, capacity, amenities, nightly rates), toggle active/paused status, or delete listings.
  - Booking lifecycle management: View guest details, update reservation status (`confirmed` -> `completed` / `cancelled`).

### 3. Authentication & Security
- **Bcrypt Password Hashing**: Passwords salted and hashed with 10 rounds using Mongoose pre-save hooks.
- **Stateless JWT Tokens**: Verification middleware attaches user context to protected endpoints.
- **Role-Based Authorization**: Route guards enforce role permissions (`guest`, `hotelOwner`, `admin`).
- **Compound Database Indices**: Unique compound index `{ user: 1, room: 1 }` prevents duplicate reviews.

---

## 📡 REST API Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Real-time system health, uptime, and database connection status |
| `POST` | `/api/auth/register` | Public | Register traveler or hotel owner account |
| `POST` | `/api/auth/login` | Public | Authenticate user and issue JWT bearer token |
| `GET` | `/api/auth/me` | Private | Retrieve authenticated profile |
| `PUT` | `/api/auth/profile` | Private | Update profile details and upgrade to host |
| `GET` | `/api/rooms` | Public | Search & filter rooms (city, type, price, guests, amenities, dates) |
| `GET` | `/api/rooms/:id` | Public | Retrieve suite details, specifications, and verified reviews |
| `POST` | `/api/rooms/:id/availability` | Public | Validate room availability for date range |
| `POST` | `/api/rooms` | Private (Host) | Publish a new luxury suite to inventory |
| `PUT` | `/api/rooms/:id` | Private (Host) | Update suite details or toggle availability |
| `DELETE`| `/api/rooms/:id` | Private (Host) | Remove suite listing from inventory |
| `GET` | `/api/hotels` | Public | List hotels with city search |
| `GET` | `/api/hotels/my` | Private (Host) | List hotels owned by current host |
| `POST` | `/api/hotels` | Private (Host) | Register a new hotel property |
| `POST` | `/api/bookings` | Private | Reserve suite with concurrency overlap lock |
| `GET` | `/api/bookings/my` | Private | Fetch authenticated user's reservations & vouchers |
| `GET` | `/api/bookings/owner` | Private (Host) | Fetch host properties bookings & gross revenue KPIs |
| `PUT` | `/api/bookings/:id/cancel` | Private | Cancel reservation and release date interval |
| `PUT` | `/api/bookings/:id/status` | Private (Host) | Update reservation status (`completed`, `cancelled`) |
| `POST` | `/api/reviews/room/:id` | Private | Post verified rating & review |

---

## 💻 Tech Stack

- **Frontend**: React 19, Vite 8, Tailwind CSS v4, Lucide React, React Hot Toast, React Router DOM 7, Axios
- **Backend**: Node.js, Express 4, Mongoose 8, MongoDB, JSON Web Token (JWT), bcryptjs, Morgan, CORS, Dotenv
- **Tooling**: Concurrently, ES Modules
