
# 📄 Product Requirement Document (PRD)

## Project: BookMyVenue (MVP)

## 1. Purpose

BookMyVenue is a simple platform where users can:

* Find venues
* View details
* Book them online 

It also allows venue owners to:

* List their spaces
* Manage bookings

And a super admin to:

* Control and approve everything 
* Manage the venues if needed block them 


## 2. 👥 Users (Roles)

### 1. Normal User

* Can register and login
* Can browse venues
* Can book a venue
* Provide the Rating 
* Raise issues 

### 2. Venue Owner

* Can add and manage venues
* Can see bookings for their venues
* get the user feedbacks 

### 3. Super Admin

* Can approve or reject venues
* Can manage users and owners 
* Has full control over the platform

## 3. Core Features (MVP Only)

### Authentication

* User can register
* User can login
* Role-based access (user / owner / admin)

### Venue Management 

* Owner can:

  * Add a venue
  * Edit venue details
  * Delete venue
  * Get user feedback

* Venue includes:

  * Name
  * Location
  * Price
  * Description
  * Amenities
  * Images
  * Rating 


### Venue Browsing

* Users can:

  * View all venues
  * View venue details
  * Search/filter (basic: location, price)
  * Send Feedback



### Booking System

* User can:

  * Book a venue for a date
* System stores:

  * User
  * Venue
  * Date
  * Status (booked/cancelled)


### Admin Control

* Admin can:

  * Approve or reject venues before they go live
  * View all users
  * Remove bad listings


## 4. Out of Scope (NOT in MVP)

Do NOT build these now:

* Online payments
* Reviews and ratings
* Chat system
* Notifications
* AI recommendations
* Advanced search


## 5. ⚙️ Basic Flow

### User Flow:

1. User signs up / logs in
2. User browses venues
3. User selects a venue
4. User books a date


### Owner Flow:

1. Owner logs in
2. Owner adds venue
3. Waits for admin approval
4. Manages bookings


### Admin Flow:

1. Admin logs in
2. Reviews new venues
3. Approves or rejects them


## 6. 📦 Data (Simple Overview)

### User

* id
* name
* email
* password
* role

### Venue

* id
* owner_id
* name
* location
* price
* description
* approved (true/false)

### Booking

* id
* user_id
* venue_id
* date
* status

---

## 7. Goal of MVP

* Build a working backend API
* Keep it simple and clean
* Make it easy for contributors to understand
* No overengineering

---

## 8. Key Rules

* Keep logic simple
* Write clean APIs
* Avoid unnecessary features
* Focus on functionality, not perfection

