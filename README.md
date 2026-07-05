# 🏰 BookMyVenue

A premium, luxury-themed venue discovery, booking, and marketplace management system. Built using a sleek glassmorphic visual design, this full-stack application connects renters looking for exquisite event spaces with venue hosts, all supervised by a multi-role administrative platform.

---

[![Vite](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue?style=for-the-badge&logo=vite)](https://vite.dev)
[![Express](https://img.shields.io/badge/Backend-Express.js-black?style=for-the-badge&logo=express)](https://expressjs.com)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Animations-Framer%20Motion-F01F7A?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)
[![MapLibre GL](https://img.shields.io/badge/Maps-MapLibre%20GL-lightgrey?style=for-the-badge&logo=mapbox)](https://maplibre.org/)
[![License](https://img.shields.io/badge/License-Proprietary-gold?style=for-the-badge)](<!-- VERIFY -->)

---

## 📖 Table of Contents
1. [About & Overview](#-about--overview)
2. [Demo](#-demo)
3. [Key Features](#-key-features)
4. [System Architecture](#-system-architecture)
5. [Tech Stack](#-tech-stack)
6. [Database Schema](#-database-schema)
7. [Folder Structure](#-folder-structure)
8. [Getting Started](#-getting-started)
   - [Prerequisites](#prerequisites)
   - [Database Setup & Seeding](#1-database-setup--seeding)
   - [Backend Setup](#2-backend-setup)
   - [Frontend Setup](#3-frontend-setup)
9. [API Reference](#-api-reference)
10. [Usage Examples](#-usage-examples)
11. [Roadmap](#-roadmap)
12. [Contributing](#-contributing)
13. [License](#-license)
14. [Contact](#-contact)

---

## 🏰 About & Overview

**BookMyVenue** is a state-of-the-art marketplace for renting premium event locations, mansions, banquet halls, and creative spaces. Featuring distinct portal dashboards tailored to **Customers (Renters)**, **Venue Owners (Hosts)**, and **Platform Administrators**, the system ensures a unified, safe booking flow. By combining MapLibre GL geolocation markers with PostgreSQL GiST exclusion logic, BookMyVenue guarantees that venue searches and schedule bookings are completely conflict-free.

---

## 📸 Demo

<!-- ADD SCREENSHOT HERE -->
*Placeholder: Visual walkthrough of the glassmorphic desktop interface dashboard.*

---

## ✨ Key Features

### 👤 For Customers (Renters)
* **Venue Discovery**: Browse handpicked locations using live search filters matching guest capacity, location, keywords, and booking formats.
* **Interactive Geolocation Map**: Powered by MapLibre GL and OpenStreetMap, showing listings on dynamic maps.
* **Flexible Bookings**: Lock in reservations on an **hourly** basis (with operating hour buffers) or a **daily** (overnight) basis.
* **Renter Calendar**: View availability in real-time, compute totals instantly, and confirm upcoming blocks.
* **My Bookings Gateway**: Check check-in instructions, dynamic secure access door codes, active payment statuses, or cancel future visits.

### 🏡 For Venue Owners (Hosts)
* **Owner Dashboard**: Real-time stats on listing counts, rental reservation listings, active customer contact lines, and earnings.
* **Visual Reservation Timelines**: Track layered, chronologically ordered booking records in a visual dashboard schedule component.
* **Listing Submissions**: Fill details including size metrics, guest thresholds, parking conditions, custom regulations, custom event category tags, hourly operating windows, and a map location picker.
* **Offline Locks & Maintenance Mode**: Blocks dates or hours for private events or offline repairs directly from the calendar, avoiding double bookings.
* **Media Upload Manager**: Upload venue preview photos locally via the media manager (stored locally via Node Multer).

### 🛡️ For Platform Administrators
* **Admin Dashboard KPIs**: Monitor active customer accounts, host listings, total platform transaction volumes, platform commission (10%), and host payout allocations (90%).
* **Verification Workflow**: Review newly submitted venue listings in a pending status. Approve or decline listings (with specific rejection reasons shown to the host).
* **Global Booking Auditor**: Review and inspect payment statuses and date range records across the entire marketplace.
* **Access Control**: Live-search and update details for all registered accounts.

### ⚡ Resiliency & Fallback Mode
* **Hybrid Data Fallback**: The React client includes a failover fallback. If the PostgreSQL/Express server is unreachable, the client will **gracefully fall back to local browser storage** using pre-configured mock venue records ([venuesData.ts](file:///d:/1/BookMyVenue%20test2/src/data/venuesData.ts)) to allow demo presentations and offline testing.

---

## 🏗️ System Architecture

BookMyVenue runs on a decoupled client-server architecture. Client requests are securely authenticated using JWT Bearer tokens.

```mermaid
graph TD
    A[React Web Client<br/>Vite / Tailwind / MapLibre] <-->|HTTP JSON REST + JWT| B[Express.js Gateway<br/>server.js]
    B -->|Upload Requests| C[Multer Middleware]
    B -->|Auth & Role Verification| D[authMiddleware.js]
    C -->|Store Images| E[uploads/ Directory]
    B -->|Database Operations| F[node-postgres Client]
    F <-->|Queries & Exclusion Checks| G[(PostgreSQL DB)]
    G -.->|GiST Constraint EXCLUDE| H[Prevent Overlap at DB Level]
```

### 🔒 Double-Booking Protection Logic
The system enforces strict conflict guards during transaction attempts:
1. **Operating Hour Enforcement**: For hourly listings, reservations must fall strictly within the venue's set `opening_time` and `closing_time`.
2. **Buffer/Cleaning Gaps**: Hosts can configure a buffer (e.g. 2-hour cleaning gaps) for hourly venues. Bookings are automatically padded with this gap to prevent back-to-back overlaps.
3. **Database-Level Guard**: The PostgreSQL table utilizes `btree_gist` and a `tsrange` exclusion constraint to prevent overlapping active blocks at the database engine level, guaranteeing data integrity.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React (v18.3) | Reactive components and dashboard interfaces |
| **Routing** | React Router (v7.1) | Declarative single-page routing and role-based guards |
| **Styling** | Tailwind CSS (v3.4) + Radix UI | Sleek glassmorphic design variables and responsive styling |
| **Animations** | Framer Motion (v12.4) | Micro-interactions, hover effects, and slide-in transition animations |
| **Maps** | MapLibre GL (v5.24) | Geolocation searches and map picking using OpenStreetMap tiles |
| **Backend** | Node.js + Express.js | Core API router and business validation layer |
| **Database** | PostgreSQL (v8.11 client) | Relational storage utilizing GIST exclusion indexes |
| **Auth** | JSON Web Tokens (JWT) + bcryptjs | Token-based security and password hashing |
| **Uploads** | Multer | local disk-based image storage |

---

## 🗄️ Database Schema

The database relies on three core tables. Run the definitions below or execute the automated setup script described in the [Getting Started](#-getting-started) section:

```sql
-- Enable btree_gist extension for GiST exclusion constraints on scalar types
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- 1. Create Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'venue_owner', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Venues Table
CREATE TABLE venues (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    full_address TEXT NOT NULL,
    latitude NUMERIC(9, 6),
    longitude NUMERIC(9, 6),
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    square_feet INTEGER NOT NULL CHECK (square_feet > 0),
    price_per_night NUMERIC(10, 2) NOT NULL CHECK (price_per_night >= 0),
    host_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    host_type VARCHAR(100) DEFAULT 'Superhost',
    rating NUMERIC(3, 2) DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
    is_top_rated BOOLEAN DEFAULT FALSE,
    date_range VARCHAR(100) DEFAULT 'Available',
    parking TEXT,
    catering TEXT,
    images TEXT[] DEFAULT '{}',
    amenities TEXT[] DEFAULT '{}',
    rules TEXT[] DEFAULT '{}',
    event_types TEXT[] DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined')),
    rejection_reason TEXT,
    booking_type VARCHAR(50) DEFAULT 'days' CHECK (booking_type IN ('days', 'hours')),
    cleaning_gap INTEGER DEFAULT 0 CHECK (cleaning_gap >= 0),
    opening_time VARCHAR(5) DEFAULT '08:00',
    closing_time VARCHAR(5) DEFAULT '22:00',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for lookup speed optimization
CREATE INDEX idx_venues_status ON venues(status);
CREATE INDEX idx_venues_host_id ON venues(host_id);

-- 3. Create Bookings Table
CREATE TABLE bookings (
    id VARCHAR(50) PRIMARY KEY,
    venue_id INTEGER REFERENCES venues(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL, -- Null for host offline locks
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    blocked_end_date TIMESTAMP NOT NULL, -- end_date + cleaning_gap (or end_date if daily)
    cleaning_gap INTEGER DEFAULT 0 CHECK (cleaning_gap >= 0),
    guests INTEGER DEFAULT 0 CHECK (guests >= 0),
    total_price NUMERIC(10, 2) DEFAULT 0.00 CHECK (total_price >= 0),
    status VARCHAR(50) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'cancelled', 'offline')),
    payment_status VARCHAR(50) DEFAULT 'paid' CHECK (payment_status IN ('paid', 'refunded', 'offline')),
    booking_date DATE DEFAULT CURRENT_DATE,
    check_in_instructions TEXT,
    renter_name VARCHAR(255),
    renter_phone VARCHAR(50),
    renter_email VARCHAR(255),
    booking_type VARCHAR(50) DEFAULT 'days' CHECK (booking_type IN ('days', 'hours')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_booking_dates CHECK (end_date >= start_date),
    CONSTRAINT chk_blocked_end CHECK (blocked_end_date >= end_date),
    CONSTRAINT no_overlapping_bookings EXCLUDE USING gist (
        venue_id WITH =,
        tsrange(start_date, blocked_end_date, '[)') WITH &&
    ) WHERE (status != 'cancelled')
);

CREATE INDEX idx_bookings_venue_dates ON bookings(venue_id, start_date, end_date) WHERE status != 'cancelled';
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
```

---

## 📂 Folder Structure

```
├── backend/
│   ├── controllers/         # Express handler logic (auth, venues, bookings, admin)
│   ├── middleware/          # JWT authorization and validation middleware
│   ├── routes/              # Express API endpoints
│   ├── uploads/             # Locally uploaded files (gitignored)
│   ├── db.js                # pg Connection Pool initialization
│   ├── reset-db.js          # Database rebuild and seed utility
│   ├── schema.sql           # Database schema tables and constraints
│   ├── server.js            # Node backend entry point
│   ├── .env.example         # Template for environment variables
│   └── package.json         # Backend node packages and scripts
├── src/
│   ├── assets/              # Media and logo assets
│   ├── components/
│   │   ├── map/             # MapLibre wrapper components (LocationPicker, VenueMap, etc.)
│   │   ├── ui/              # Radix UI and visual design atoms (badge, button, cards)
│   │   └── Navbar.tsx       # Universal application navigation header
│   ├── data/
│   │   └── venuesData.ts    # Seed data fallback config
│   ├── page/                # React router screen pages
│   ├── index.css            # Stylesheets with Tailwind and design tokens
│   ├── App.tsx              # React router structure and authentication route wrappers
│   └── main.tsx             # Frontend bootstrap file
├── components.json          # Shadcn/ui CLI configuration
├── index.html               # Main entry HTML document
├── package.json             # Root workspace packages and build configurations
├── tailwind.config.js       # Custom design spacing configurations
├── vite.config.ts           # Vite application packaging setup
└── tsconfig.json            # Base typescript configurations
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18.x or newer)
* **PostgreSQL** database instance (v12+ recommended for GiST exclusion constraints)
* **NPM** (packaged with Node)

---

### 1. Database Setup & Seeding

1. Open your PostgreSQL query tool and create a new database:
   ```sql
   CREATE DATABASE bookmyvenue;
   ```
2. Navigate into the backend subdirectory:
   ```bash
   cd backend
   ```
3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Edit the new `.env` file with your PostgreSQL password and username:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://your_postgres_username:your_postgres_password@localhost:5432/bookmyvenue
   JWT_SECRET=your_super_secret_key_here
   NODE_ENV=development
   ```
5. Install backend dependencies:
   ```bash
   npm install
   ```
6. Run the reset and seeding script. This drops any conflicting tables, compiles the SQL schemas, and sets up test users:
   ```bash
   node reset-db.js
   ```

#### 🔑 Seeded Test Accounts
The seeding script generates three preconfigured accounts representing each system role:

| Role | Username / Email | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin@gmail.com` | `test123` |
| **Venue Host** | `owner@gmail.com` | `test123` |
| **Standard User (Renter)** | `user@gmail.com` | `test123` |

---

### 2. Running Backend Locally

Run the development server in watch mode:
```bash
npm run dev
```
The server will boot and listen at `http://localhost:5000`. You should see the following console confirmation:
```
BookMyVenue backend server listening on port 5000
API URL: http://localhost:5000/api
```

---

### 3. Running Frontend Locally

1. Open a new terminal session in the **root project directory**.
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Boot up the Vite developer build server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

> [!NOTE]
> The frontend is configured to call `http://localhost:5000/api` directly. If the backend is not running, the application will display fallback mock venue cards so you can test user flows offline.

---

## 🔌 API Reference

All requests must be prefixed with `/api`. Authenticated requests require the Header `Authorization: Bearer <your_jwt_token>`.

<details>
<summary>🔐 Click to Expand API Endpoints Reference</summary>

### Authentication (`/api/auth`)
* `POST /signup`
  * **Description**: Create a new account.
  * **Payload**: `{ "name": "...", "email": "...", "password": "...", "role": "user" \| "venue_owner" }`
  * **Auth Required**: None
* `POST /login`
  * **Description**: Authenticate credentials and get authorization token.
  * **Payload**: `{ "email": "...", "password": "..." }`
  * **Auth Required**: None

### Venue Operations (`/api/venues`)
* `GET /`
  * **Description**: Fetch all approved venues.
  * **Auth Required**: None
* `GET /my-venues`
  * **Description**: Fetch venues registered under the authenticated host account.
  * **Auth Required**: Yes (`venue_owner`)
* `GET /:id`
  * **Description**: Retrieve deep specifications for a specific venue listing.
  * **Auth Required**: None
* `GET /:id/bookings`
  * **Description**: Retrieve active bookings associated with a specific venue.
  * **Auth Required**: None
* `GET /:id/availability`
  * **Description**: Retrieve booked schedules (or timeline slots if hourly) for a venue. Optional query `?date=YYYY-MM-DD`.
  * **Auth Required**: None
* `POST /`
  * **Description**: Submit a new venue for administrator validation.
  * **Auth Required**: Yes (`venue_owner`)
* `PUT /:id`
  * **Description**: Update an owned venue's details (resets verification status to `pending`).
  * **Auth Required**: Yes (`venue_owner`)
* `DELETE /:id`
  * **Description**: Remove a venue registration.
  * **Auth Required**: Yes (`venue_owner`)

### Booking Operations (`/api/bookings`)
* `GET /`
  * **Description**: Fetch user reservations (renters see their bookings; hosts see their venues' reservations).
  * **Auth Required**: Yes
* `GET /:id`
  * **Description**: Get details for a specific booking transaction.
  * **Auth Required**: Yes (Renter, Venue Host, or Admin)
* `POST /`
  * **Description**: Create a new online reservation (validates overlaps and horizon limits).
  * **Auth Required**: Yes
* `POST /lock`
  * **Description**: Schedule an offline maintenance block or private reservation.
  * **Auth Required**: Yes (`venue_owner`)
* `PUT /:id/cancel`
  * **Description**: Mark a booking status as `cancelled` and issue payment refund logs.
  * **Auth Required**: Yes

### Media Upload (`/api/upload`)
* `POST /`
  * **Description**: Upload a single image file. Returns a public file access URL.
  * **Payload**: Multipart form data with key `image`.
  * **Auth Required**: None

### Admin Auditing (`/api/admin`)
* `GET /stats`
  * **Description**: Fetch platform KPI variables (transaction volumes, payouts, counts).
  * **Auth Required**: Yes (`admin`)
* `GET /venues`
  * **Description**: List all database venue listings regardless of validation state.
  * **Auth Required**: Yes (`admin`)
* `PUT /venues/:id/status`
  * **Description**: Approve or reject a listing request.
  * **Payload**: `{ "status": "approved" \| "declined", "rejectionReason": "..." }`
  * **Auth Required**: Yes (`admin`)
* `GET /bookings`
  * **Description**: Review all bookings recorded in the system.
  * **Auth Required**: Yes (`admin`)
* `GET /users`
  * **Description**: Retrieve a registry of all system users.
  * **Auth Required**: Yes (`admin`)

</details>

---

## 💡 Usage Examples

### 1. User Sign In
To fetch a bearer token for a user:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@gmail.com", "password": "test123"}'
```

### 2. Fetch Venues
Retrieve the catalog of approved event locations:
```bash
curl -X GET http://localhost:5000/api/venues
```

### 3. Create a Booking
Book a venue by passing dates, total price, guest count, and renter contact details (requires authentication token):
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer <your_jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "venueId": 1,
    "startDate": "2026-07-15T14:00:00",
    "endDate": "2026-07-16T11:00:00",
    "guests": 2,
    "totalPrice": 250.00,
    "renterName": "John Doe",
    "renterPhone": "+1234567890",
    "renterEmail": "user@gmail.com"
  }'
```

---

## 🗺️ Roadmap

- [x] Multi-role dashboard structures (User, Host, Admin)
- [x] Day-based (daily check-in/out) and Hour-based booking schedules
- [x] Cleaning buffers and customizable operating hours
- [x] MapLibre GL interactive maps and location selectors
- [x] Database-level double-booking protection using PostgreSQL GIST constraints
- [ ] Real-time Socket.io chat messaging between renters and venue owners
- [ ] Direct checkout payments via Stripe integration
- [ ] Venue rating feedback loops and user reviews

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This repository is proprietary. No formal license is included. All rights reserved.

---

## ✉️ Contact

* **Project Repository**: [BookMyVenue](https://github.com/karthikajay04/BookMyVenue) (<!-- VERIFY -->)
* **Demo Enquiries**: admin@gmail.com
