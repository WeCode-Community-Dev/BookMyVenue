# BookMyVenue Phase 1 MVP Plan

## MVP Goal

Build a working MVP focused on nearby venue discovery.

The user should be able to:
- Use current location or manually select district and town/locality
- View nearby venue listings
- Filter venues by type, price range, capacity, etc..
- Open venue details
- Send a booking inquiry

The owner should be able to:
- Register/login
- Submit a venue 
- View booking inquiries
- Accept or reject inquiries

The admin should be able to:
- Login using seeded admin account
- Approve or reject venue listings

## Included in Phase 1

- Nearby venue listings
- Current location support
- Manual district/town fallback
- Venue listing page
- Venue detail page
- Booking inquiry form
- Owner dashboard
- Admin approval flow
- Basic role-based auth
- Deployment
- README and demo credentials

## Excluded from Phase 1

- Payment
- Refund
- Google Maps UI
- Reviews
- Chat
- Advanced analytics
- Complex availability calendar
- Email verification
- Forgot password

## Team Roles

### Backend Lead 
Owner: Jibin

Responsibilities:
- Backend setup
- API contract
- Auth and role middleware
- Nearby venue API
- PR review
- Deployment coordination

### Backend Feature Developer
Owner: Anirudh

Responsibilities:
- Venue model
- Seed venue data
- Venue APIs
- Booking inquiry APIs
- API testing

### Frontend Discovery Developer
Owner: Amal

Responsibilities:
- Home page
- Location search UI
- Venue listing page
- Venue card
- Venue detail page

### Frontend Dashboard Developer
Owner: Theresrose

Responsibilities:
- Login/register pages
- Booking form
- Owner dashboard
- Admin dashboard

## Week 1 Goal

Foundation + nearby venue listing.

By the end of Week 1:
- Repo workflow should be stable
- Backend server should be running
- Venue model and seed data should be ready
- Venue listing UI should be ready
- Auth UI should be ready
- GET venues API should work
- Frontend should show venue data using dummy data or backend API

## Week 2 Goal

Complete the platform loop.

By the end of Week 2:
- Owner can submit venue
- Admin can approve/reject venue
- User can see approved venues
- User can send booking inquiry
- Owner can accept/reject inquiry

## Week 3 Goal

Integration, polish, and deployment.

By the end of Week 3:
- Frontend and backend integrated
- Core bugs fixed
- App deployed
- README completed
- Demo credentials ready
- Full MVP flow tested

## Final Submission Checklist

- Deployed frontend link
- Deployed backend link
- GitHub repo link
- Demo credentials
- README setup instructions
- Screenshots or demo video
- Team contribution table
- Working MVP flow