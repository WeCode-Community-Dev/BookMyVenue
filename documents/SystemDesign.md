# 📄 System Design / Architecture

## Project: BookMyVenue (MVP)

## 1. 🎯 Goal

Build a simple backend system where:

* Users can find and book venues
* Owners can list venues
* Admin can control everything

System should be:

* Easy to understand
* Easy to contribute
* Easy to scale later (not now)


## 2. 🧱 Tech Stack

* Backend: FastAPI ( why because in future implementing an ai will be easy to configure )
* Database: PostgreSQL ( structured way to store datas , in future nosql can be added)
* Authentication: JWT (token-based login)


### Flow:

```
Client (Frontend / Postman)
        ↓
   FastAPI Server
        ↓
   PostgreSQL Database
```

## 3. ⚙️ How It Works (Step by Step)

### Example: Booking a Venue

1. User sends request → `POST /bookings`
2. FastAPI:

   * Checks user login (JWT)
   * Validates data
3. Backend saves booking in database
4. Response sent back to user

---

## 4. 🧩 Main Components

### 1. API Layer (Routes)

* Handles incoming requests
* Example:

  * `/auth`
  * `/venues`
  * `/bookings`
  * `/admin`

---

### 2. Service Layer (Logic)

* Contains business logic
* Example:

  * Check venue availability
  * Validate booking
  * Handle permissions

---

### 3. Database Layer

* Stores all data
* Tables:

  * Users
  * Venues
  * Bookings

---

### 4. Authentication System

* Uses JWT tokens
* Flow:

  1. User logs in
  2. Server returns token
  3. User sends token in future requests

---

## 5. Role-Based Access

System checks user role before actions:

* User → can book
* Owner → can manage venues
* Admin → can approve/reject

---


## 6. Data Flow Example

### Add Venue (Owner)

1. Owner → sends `POST /venues`
2. API receives request
3. Service validates data
4. Save in DB (status = not approved)
5. Admin later approves

---

## 7. 🚫 What We Are NOT Doing Now

* Microservices
* Caching (Redis)
* Message queues
* Real-time systems
* Load balancing

You don’t need them. Adding them now = wasted time.

---

## 8. 🚀 Future Scalability (Later, Not Now)

When system grows:

* Add caching
* Split services
* Use cloud deployment


