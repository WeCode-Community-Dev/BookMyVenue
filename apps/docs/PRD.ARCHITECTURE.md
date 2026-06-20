# 🏛️ Venue Booking Platform

### Product Requirements & System Design Document

| | |
|---|---|
| **Phase** | Phase 1 — MVP |
| **Market** | Kerala, India |
| **Version** | 2.0 |
| **Roles** | User · Venue Owner · Admin |
| **Tech Layers** | Next.js · NestJS · PostgreSQL |
| **Core Flow** | Search → Book → Pay → Confirm |

---

## 📑 Table of Contents

1. [App Overview](#1-app-overview)
2. [Users & Roles](#2-users--roles)
3. [Technology Stack](#3-technology-stack)
4. [System Architecture](#4-system-architecture)
5. [Core Booking Flow](#5-core-booking-flow)
6. [Phase 1 — MVP Features](#6-phase-1--mvp-features)
7. [Phase 2 — Growth Features](#7-phase-2--growth-features)
8. [Caching Layer — Upstash Redis](#8-caching-layer--upstash-redis)

---

## 1. App Overview

| | |
|---|---|
| **Name** | Venue Booking Platform |
| **Concept** | A two-sided marketplace connecting venue owners with people who need to book venues for functions and events — similar in spirit to Airbnb, but for event spaces. |
| **Target Market** | Kerala, India (Phase 1). Designed to expand state by state in future phases. |
| **Goal** | Launch a Minimum Viable Product (MVP) to validate and showcase the idea. |
| **Core Insight** | More venue owners → more venue variety → more users attracted → more venue owners join. The platform also turns idle spaces (land, rooftops) into income-generating assets for property owners. |

---

## 2. Users & Roles

> The platform uses a single unified login for both regular users and venue owners. A user's role automatically upgrades the moment they list their first property — there is no separate signup flow for venue owners.

| Role | Responsibilities |
|---|---|
| 👤 **User** | Searches and filters venues, views venues on map, books venues, makes payment, manages wishlist and booking history. |
| 🏛 **Venue Owner** | Same account as User. Role auto-upgrades when a property is added. Lists venues, uploads images, pins exact location on map, sets availability, manages bookings received. |
| 🛡 **Admin** | Single admin account. Approves or rejects newly added venue listings. Monitors all venues and users on the platform. |

---

## 3. Technology Stack

| Layer | Technology | Reasoning |
|---|---|---|
| **Frontend** | Next.js | SEO for venue pages, server-side rendering, fast load on mobile networks |
| **State Management** | Redux Toolkit + RTK Query | Built-in caching, less boilerplate, automatic loading/error states |
| **Theme** | next-themes | Dark / Light mode toggle |
| **Language** | next-intl | English & Hindi language support |
| **Backend** | NestJS | Structured, modular, scalable, microservices-ready for future growth |
| **Database** | PostgreSQL | Highly relational data — Users, Venues, Bookings are naturally connected |
| **ORM** | Prisma | Clean schema definitions, type-safe queries, pairs well with NestJS |
| **Authentication** | Google OAuth + Email OTP + JWT | Low-friction login plus secure session management |
| **Payment Gateway** | Razorpay | India-focused, supports UPI / cards / net banking |
| **Maps** | OpenStreetMap + OpenLayers | Completely free alternative to Google Maps |
| **Image Storage** | Cloudinary | Free tier, easy venue image management |
| **Email Service** | Nodemailer | Email OTP delivery and booking confirmation emails |
| **Caching / OTP Store** | Upstash Redis | Serverless, pay-per-request — no server to host or maintain. Used specifically for OTP storage with auto-expiry, rate limiting (login/OTP requests), and booking slot locks. General-purpose caching and session blacklisting remain deferred to Phase 2 |

---

## 4. System Architecture

> Request flow travels through five layers, from the client down to the database, with third-party services attached at the appropriate layer.

| Layer | Components |
|---|---|
| ① **Client / Frontend** | Next.js, Redux Toolkit, RTK Query, OpenLayers + OpenStreetMap, next-themes, next-intl |
| ② **Auth Layer** | Google OAuth 2.0, Email OTP (Nodemailer), JWT tokens, Role guards (NestJS) |
| ③ **Backend API** | NestJS REST API — Auth, Venue, Booking, User, Admin modules. Guards, interceptors, Prisma ORM |
| ④ **Cache / Lock Store** | Upstash Redis — OTP storage with auto-expiry, rate limiting, booking slot locks during checkout |
| ⑤ **Database** | PostgreSQL — Users, Venues, Bookings, Wishlist, Availability tables |
| ⑥ **Third-Party Services** | Razorpay (payments), Cloudinary (images), Nodemailer (email), OpenStreetMap (maps) |

```
┌─────────────────────┐
│  Client / Frontend  │  Next.js · RTK Query · OpenLayers
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│      Auth Layer      │  Google OAuth · Email OTP · JWT
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│     Backend API      │  NestJS · Guards · Prisma ORM
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│  Cache / Lock Store   │  Upstash Redis
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│      Database         │  PostgreSQL
└─────────────────────┘
           │
           ▼
   Razorpay · Cloudinary · Nodemailer · OpenStreetMap
```

---

## 5. Core Booking Flow

| Step | Description |
|---|---|
| **1 · Login** | User logs in via Google OAuth or Email OTP. JWT is issued and role is assigned. |
| **2 · Search** | User searches and filters venues by category, location, price, and date. Results shown on map view. |
| **3 · View Venue** | User opens venue detail page — images, location, description, availability calendar. |
| **4 · Book** | User selects a date/slot and confirms booking details. |
| **5 · Pay** | Payment is processed through Razorpay and verified. |
| **6 · Confirm** | Booking is confirmed and a confirmation email is sent via Nodemailer. |

```
Login → Search → View Venue → Book → Pay → Confirm
```

---

## 6. Phase 1 — MVP Features

> ✅ **SCOPE — PHASE 1**
> All features listed in this section are scoped and committed for the initial MVP release.

### 🔐 Authentication
- ✅ Google OAuth 2.0 login
- ✅ Email OTP login
- ✅ JWT session management
- ✅ Automatic role upgrade — User becomes Venue Owner upon adding a property
- ✅ OTP storage with auto-expiry via Upstash Redis
- ✅ Rate limiting on login and OTP requests via Upstash Redis

### 🔍 Venue Discovery
- ✅ Search venues by keyword
- ✅ Filter by category, location, price, and date
- ✅ Map view with venue pins (OpenLayers + OpenStreetMap)
- ✅ Venue detail page with images, description, and location

### 🏛️ Venue Owner Features
- ✅ Add new venue listing
- ✅ Upload venue images (Cloudinary)
- ✅ Pin exact venue location on the map
- ✅ Set venue availability calendar
- ✅ View bookings received for owned venues

### 📅 Booking Features
- ✅ Book a venue for a selected date / slot
- ✅ Temporary slot lock during checkout via Upstash Redis (prevents double-booking the same date/slot while payment is in progress)
- ✅ Razorpay payment integration
- ✅ Booking confirmation email (Nodemailer)
- ✅ View booking history

### ❤️ User Features
- ✅ Wishlist — save favourite venues
- ✅ View all personal bookings
- ✅ Manage profile

### 🛡️ Admin Features
- ✅ Approve or reject new venue listings
- ✅ Monitor all venues on the platform
- ✅ Monitor all users on the platform

### 🎨 UI / UX Features
- ✅ Dark / Light theme toggle
- ✅ English & Hindi language support
- ✅ Fully responsive, mobile-friendly web design

---

## 7. Phase 2 — Growth Features

> 🕒 **DEFERRED — PHASE 2**
> These features are intentionally deferred until after MVP validation, to keep the initial build lean and fast to ship.

| Feature | Description |
|---|---|
| **Reviews & Ratings** | Users can rate and review venues after a completed booking |
| **Push Notifications** | In-app booking alerts and reminders |
| **WhatsApp Notifications** | Booking confirmations delivered via WhatsApp |
| **Phone OTP** | SMS-based login via MSG91 or Fast2SMS |
| **Cancellation & Refund** | Booking cancellation flow with Razorpay refund integration, including refund policy logic and slot release |
| **Mobile App** | React Native app for Android and iOS |
| **Expanded Redis Usage** | General-purpose server-side caching and JWT/session blacklist, once traffic/load justifies it |
| **Microservices Migration** | Split NestJS modules into independent services (Auth, Venue, Booking) |
| **Geographic Expansion** | Expand beyond Kerala to other Indian states |

---

## 8. Caching Layer — Upstash Redis

Redis is included in Phase 1, specifically via **Upstash** — a serverless, pay-per-request Redis service. This avoids the usual objection to adding Redis early (hosting, monitoring, maintaining a server), since there is no server to manage.

### ✅ Phase 1 Use Cases

- **OTP storage with automatic expiry** — replaces manual `expires_at` columns and cleanup jobs in PostgreSQL
- **Rate limiting on login and OTP requests** — prevents abuse with minimal added complexity
- **Booking slot locks** — when a user proceeds to payment for a date/slot, that slot is briefly locked (e.g. 5–10 minutes) so no other user can book it during checkout. Lock releases on payment success (booking confirmed in PostgreSQL) or on timeout (slot becomes available again)

### ⏸️ Still Deferred to Phase 2

- General-purpose server-side caching of venue listings — RTK Query already covers this on the client side
- JWT / session blacklist for forced logout — no such flow is planned in Phase 1

> ⚡ **TRIGGER FOR EXPANSION**
> Redis usage will expand in Phase 2 if: database performance degrades under real load, concurrent users grow into the thousands, or JWT blacklisting becomes a requirement.

---


**Venue Booking Platform** · Product Requirements Document · v2.0
