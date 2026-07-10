# BookMyVenue

BookMyVenue is a venue booking platform that allows users to discover and book venues, venue owners to manage their venues, and administrators to review and approve venue listings before they become available to the public.

## Features

### User
- Register and login
- Browse approved venues
- View venue details
- Book available slots
- Cancel bookings
- JWT authentication

### Venue Owner
- Register and login
- Add new venues
- Upload venue images
- Add amenities
- View venue approval status
- View approved, pending, and rejected venues
- Manage venue bookings
- Configure cancellation

### Admin
- Approve pending venues
- Reject venues
- Re-approve rejected venues
- Manage venue listings

## Tech Stack

### Backend
- Go
- Gin
- PostgreSQL
- SQLC
- JWT Authentication
- Docker Compose

### Frontend
- HTML
- JavaScript

## Prerequisites

- Go 1.24+
- Docker & Docker Compose
- SQLC
- golang-migrate

## Installation

Clone the repository.

```bash
git clone https://github.com/WeCode-Community-Dev/BookMyVenue.git

cd BookMyVenue/backend
```

Install dependencies.

```bash
go mod download
```

## Environment Variables

Create a `.env` file.

```env
PORT=8080

DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=bookmyvenue

JWT_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret
```
## Run using Docker

```bash
docker compose up --build
```

## Database Migration

Run migrations.

```bash
make migrate-up
```

Rollback.

```bash
make migrate-down
```

## Generate SQLC

Whenever SQL queries are modified, regenerate the SQLC code:

```bash
sqlc generate
```

## Run Locally

```bash
go run cmd/server/main.go
```

## Authentication

The application uses JWT Authentication with role-based autherization.

Supported Roles:

- User
- Venue Owner
- Admin

Access tokens are used to authenticate API requests.

## API Modules

- Authentication
- User
- Venue
- Booking
- Admin
- Availability

## Booking Flow

```
User
   │
   ▼
Browse Venues
   │
   ▼
Select Slot
   │
   ▼
Book Venue
   │
   ▼
Payment
   │
   ▼
Booking Confirmed
```

## Venue Approval Flow

```
Venue Owner
      │
      ▼
Add Venue
      │
      ▼
Pending Review
      │
      ▼
Admin Review
      │
 ┌────┴────┐
 ▼         ▼
Approved  Rejected
```

## Future Improvements

- Online Payments
- Dynamic Refund Policy 
- Email Notifications
- Reviews & Ratings
- Wishlist
- Google Maps Integration
- Calendar View
- Availability Management
- Analytics Dashboard
- Image Storage using AWS S3
- Unit & Integration Tests

## Testing

Run tests.

```bash
go test ./...
```

## Contributing

1. Fork the repository.
2. Create a new feature branch.

```bash
git checkout -b feature/my-feature
```

3. Commit your changes.

```bash
git commit -m "Add new feature"
```

4. Push to GitHub.

```bash
git push origin feature/my-feature
```

5. Create a Pull Request.