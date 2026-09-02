# Server Module Reference

A catalog of all 14 feature modules in `server/src/modules/`.

---

**Module: auth** (5 files)
*Files: auth.controller.ts, auth.repository.ts, auth.router.ts, auth.service.ts, auth.validator.ts*
Handles user authentication and session management:
- Register with username/email/password
- Login with email or username (rate-limited: 10/15min)
- JWT access + refresh token flow
- Token refresh using HTTP-only cookie
- Logout with session revocation
- Forgot/reset password flow (rate-limited: 5/15min)
- Change password (authenticated)
- Session listing and management (revoke single, revoke others)

---

**Module: availability** (5 files)
*Files: availability.controller.ts, availability.repository.ts, availability.router.ts, availability.validator.ts, availability.workflow.ts*
Manages venue availability schedules:
- Recurring weekly availability windows
- Date-specific overrides
- Blocked dates for maintenance/events

---

**Module: booking** (8 files)
*Files: booking.controller.ts, booking.repository.ts, booking.router.ts, booking.service.ts, booking.types.ts, booking.validator.ts, booking.workflow.ts, lock.types.ts*
Complete booking lifecycle:
- Create, list, view, cancel bookings
- Razorpay payment integration
- Booking lock mechanism to prevent double-booking
- Availability validation during booking
- Offline booking creation (owner feature)

---

**Module: geo** (3 files)
*Files: geo.router.ts, geo.service.ts, geo.types.ts*
Geocoding and location search:
- Search places using OpenStreetMap Nominatim
- Returns coordinates, city, district, postcode
- Restricted to Indian locations

---

**Module: moderation** (13 files across 2 sub-routers)
*Files: bannedUser.controller.ts, bannedUser.model.ts, bannedUser.repository.ts, bannedUser.router.ts, bannedUser.service.ts, bannedUser.types.ts, bannedUser.validator.ts, moderation.repository.ts, moderation.router.ts, moderation.service.ts, moderation.types.ts, moderationActivity.model.ts, moderationActivity.service.ts*
Content moderation system:
- Dashboard summary (pending reviews, suspended venues, banned users)
- Ban/unban users with scope (global/venue) and optional expiry
- Moderation activity log (superAdmin only)
- Ban management: list user bans, lift individual bans, lift all bans

---

**Module: owner** (6 files)
*Files: owner.controller.ts, owner.repository.ts, owner.router.ts, owner.service.ts, owner.validator.ts, owner.workflow.ts*
Owner/venue-tenant specific operations:
- Venue analytics dashboard
- Block/unblock dates
- Venue booking management
- Availability calendar
- Offline booking creation
- Review management (reply, report)
- Venue settings management
- Venue state management (activate, request inactivity, block/unblock bookings)
- Delete venue request flow
- Owner tenant verification middleware

---

**Module: rbac** (3 files)
*Files: rbac.controller.ts, rbac.router.ts, rbac.service.ts*
Role-based access control:
- List admins (superAdmin)
- Promote user to admin
- Demote admin to user
- RBAC seeding for new databases

---

**Module: review** (7 files)
*Files: review.controller.ts, review.model.ts, review.ownership.ts, review.repository.ts, review.router.ts, review.service.ts, review.types.ts*
Venue review and rating system:
- Submit, update, delete reviews
- Get venue reviews (public, paginated)
- Get user's own rating for a venue
- Review ownership verification
- Flagged review management (admin)
- Review moderation (admin: flag, remove, restore, approve/reject hide requests) via POST /reviews/:id/moderate

---

**Module: role** (5 files)
*Files: role.controller.ts, role.repository.ts, role.router.ts, role.service.ts, role.validator.ts*
Role and permission management:
- CRUD for roles
- Assign permissions to roles
- Role hierarchy management

---

**Module: swagger** (2 files)
*Files: swagger.config.ts, swagger.router.ts*
OpenAPI/Swagger documentation:
- Generates API docs from JSDoc annotations
- Serves Swagger UI at `/api/v1/swagger`
- Protected by basic authentication

---

**Module: user** (8 files)
*Files: user.controller.ts, user.models.ts, user.repository.ts, user.router.ts, user.service.ts, user.types.ts, user.validator.ts, user.workflow.ts*
User profile and account management:
- View and update profile
- Admin user listing (paginated)
- Toggle user active/ban status
- Admin management (list owners)
- Account deletion workflow

---

**Module: venue** (10 files)
*Files: venue.controller.ts, venue.model.ts, venue.ownership.ts, venue.repository.ts, venue.router.ts, venue.service.ts, venue.types.ts, venue.validator.ts, venue.workflow.ts, venueDraft.model.ts*
Complete venue management:
- CRUD operations for venues
- Draft/submit workflow (incremental draft saves → full submission)
- Venue search and listing with filters
- Featured venue management
- Venue approval/rejection (admin)
- Venue activation/deactivation
- Venue ownership verification
- Image upload signature generation (Cloudinary)

---

**Module: webhook** (3 files)
*Files: webhook.controller.ts, webhook.router.ts, webhook.types.ts*
External webhook handling:
- Razorpay payment webhook with HMAC-SHA256 verification
- Raw body required — mounted before `express.json()` in app.ts

---

**Module: wishlist** (7 files)
*Files: wishlist.controller.ts, wishlist.model.ts, wishlist.repository.ts, wishlist.router.ts, wishlist.service.ts, wishlist.types.ts, wishlist.validator.ts*
User wishlist functionality:
- Toggle venue in wishlist
- Get user's wishlist (paginated)
- Check wishlist status for multiple venues
- Sync guest's local wishlist to account after login
