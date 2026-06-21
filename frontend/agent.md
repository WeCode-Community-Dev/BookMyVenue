# BookMyVenue Frontend Development Instructions

You are working on the BookMyVenue frontend application.

## Primary Goal

Build a premium, modern, mobile-first venue discovery and booking experience for end users.

The platform should feel closer to Airbnb, Booking.com, and Zomato rather than an admin dashboard.

Focus on:

* Venue discovery
* Venue browsing
* Venue booking
* User account management
* Mobile experience
* Conversion-focused UI

---

## Critical Rules

### Rule 1: Do NOT modify existing pages

Never update, refactor, rename, move, delete, or alter existing pages unless explicitly instructed.

Existing pages are considered stable.

You may:

* Read existing pages
* Reuse existing pages as reference
* Import existing components

You may NOT:

* Change layouts
* Change styles
* Change business logic
* Change routes
* Change API integrations

---

### Rule 2: Do NOT modify existing components

Never modify any existing component.

If an existing component is not suitable:

Create a new component instead.

Examples:

Good:

* Create VenueCardV2
* Create SearchHero
* Create VenueGallery

Bad:

* Edit existing Card component
* Modify existing Table component
* Update existing Layout component

---

### Rule 3: Reuse when possible

Before creating a new component:

Check whether an existing component can be reused without modification.

Reuse:

* Buttons
* Inputs
* Form controls
* Typography
* Dialogs
* Loading states
* Empty states

Only create new components when necessary.

---

### Rule 4: Create new pages in isolated folders

All newly created user-facing pages must be isolated.

Example:

src/sections/user/
src/pages/user/

or

src/features/user/

depending on existing architecture.

Do not place new user pages inside admin or owner modules.

---

### Rule 5: Preserve project architecture

Follow existing project conventions:

* Folder structure
* Naming conventions
* Import ordering
* API service usage
* React Query usage
* Form handling patterns
* MUI usage

Do not introduce a new architecture.

---

## UI Requirements

### Design Style

Premium Consumer Product

Avoid:

* Admin dashboard appearance
* Dense tables
* Large forms
* Enterprise styling

Prefer:

* Large images
* Spacious layouts
* Rounded cards
* Soft shadows
* Modern search experiences
* Mobile-first design

---

### Theme Usage

Use existing MUI theme.

Must use:

* Existing color palette
* Existing typography
* Existing spacing system
* Existing shadows

Do not introduce custom theme systems.

---

## Mobile First

Every page must work well on:

* Mobile
* Tablet
* Desktop

Design mobile first.

---

## User Pages To Build

Priority Order:

1. Landing Page
2. Search Page
3. Venue Details Page
4. Booking Flow
5. Booking Success Page
6. User Dashboard
7. My Bookings
8. Booking Details
9. Favorites
10. About Page
11. FAQ Page
12. Contact Page

---

## Landing Page Sections

* Hero Search Section
* Popular Categories
* Featured Venues
* How It Works
* Benefits
* Testimonials
* Become a Host CTA
* Footer

---

## Search Page

Features:

* Search Bar
* Location Search
* Date Filter
* Capacity Filter
* Price Filter
* Category Filter
* Sorting
* Grid View
* Empty State
* Loading State

---

## Venue Details Page

Sections:

* Image Gallery
* Venue Information
* Amenities
* Pricing
* Availability Calendar
* Reviews
* Similar Venues
* Sticky Booking Card

---

## Booking Flow

Multi-step flow:

1. Venue Selection
2. Date Selection
3. Guest Information
4. Booking Review
5. Payment
6. Confirmation

---

## Code Quality

Always:

* Use TypeScript
* Strong typing
* Functional components
* React Query for API calls
* Proper loading states
* Proper error states
* Skeleton loaders
* Responsive layouts

Avoid:

* any
* inline styles
* duplicated code
* hardcoded colors
* hardcoded spacing

---

## Output Expectations

When generating code:

1. First explain folder structure.
2. List all files to be created.
3. Generate complete code.
4. Do not generate partial implementations.
5. Do not modify existing files unless explicitly requested.
6. If an existing file would normally need modification, create an alternative implementation instead and explain why.
