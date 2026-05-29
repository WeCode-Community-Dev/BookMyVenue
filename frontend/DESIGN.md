---
name: Book My Venue
colors:
  surface: '#ffffff'
  surface-dim: '#edd5cb'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1eb'
  surface-container: '#ffeae0'
  surface-container-high: '#fce3d9'
  surface-container-highest: '#f6ded3'
  on-surface: '#251913'
  on-surface-variant: '#584237'
  inverse-surface: '#3c2d26'
  inverse-on-surface: '#ffede6'
  outline: '#8c7164'
  outline-variant: '#e0c0b1'
  surface-tint: '#9d4300'
  primary: '#9d4300'
  on-primary: '#ffffff'
  primary-container: '#f97316'
  on-primary-container: '#582200'
  inverse-primary: '#ffb690'
  secondary: '#944a00'
  on-secondary: '#ffffff'
  secondary-container: '#fd933d'
  on-secondary-container: '#693300'
  tertiary: '#006398'
  on-tertiary: '#ffffff'
  tertiary-container: '#00a2f4'
  on-tertiary-container: '#003554'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbca'
  primary-fixed-dim: '#ffb690'
  on-primary-fixed: '#341100'
  on-primary-fixed-variant: '#783200'
  secondary-fixed: '#ffdcc5'
  secondary-fixed-dim: '#ffb783'
  on-secondary-fixed: '#301400'
  on-secondary-fixed-variant: '#713700'
  tertiary-fixed: '#cde5ff'
  tertiary-fixed-dim: '#93ccff'
  on-tertiary-fixed: '#001d32'
  on-tertiary-fixed-variant: '#004b74'
  background: '#fafaf9'
  on-background: '#251913'
  surface-variant: '#f6ded3'
  text-primary: '#1c1917'
  text-muted: '#78716c'
  border-subtle: '#e7e5e4'
  status-success-bg: '#f0fdf4'
  status-success-text: '#166534'
  status-warning-bg: '#fefce8'
  status-warning-text: '#854d0e'
typography:
  display-lg:
    fontFamily: Syne
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Syne
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Syne
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Syne
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 1.5rem
  margin-mobile: 1rem
  margin-desktop: 2.5rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
---

# BookMyVenue - Master Design Specification
## 1. Overview
BookMyVenue is a premium marketplace for booking event venues (weddings, corporate, parties). The UI must feel comparable to modern platforms like Airbnb or Booking.com, but with a highly modern, light, and airy aesthetic that emphasizes high-quality photography and clean typography.
## 2. Global Design System & Theming
### 2.1 Color Palette
The application operates in a **Crisp Light Theme** to feel open and inviting.
*   **Background (Global):** Warm Off-White / Alabaster (`bg-stone-50` / `#fafaf9`)
*   **Surface/Card Background:** Pure White (`bg-white`)
*   **Primary Accent:** Sunset Orange (`bg-orange-500` / `#f97316`). Used for primary actions (Book Now, Search, Primary Buttons).
*   **Secondary/Hover Accent:** Vibrant Peach (`bg-orange-400`).
*   **Text (Primary):** Deep Charcoal / Near Black (`text-stone-900` / `#1c1917`).
*   **Text (Muted):** Medium Stone Gray (`text-stone-500`).
*   **Borders:** Subtle, clean lines (`border-stone-200`).
### 2.2 Shadows & Depth
Instead of dark glassmorphism, use clean surfaces with soft, diffused shadows to create a sense of elevation.
*   Tailwind Classes for Floating Elements: `bg-white/90 backdrop-blur-md shadow-xl shadow-stone-200/50 border border-stone-100`
*   Tailwind Classes for Cards: `bg-white border border-stone-100 shadow-sm hover:shadow-md transition-shadow`
### 2.3 Typography (Modern & Unique)
Avoid standard system fonts. Use this modern pairing via Google Fonts or local font files:
*   **Headings:** `Clash Display` (or `Syne` / `Playfair Display` as fallbacks). This gives a bold, premium, slightly architectural feel to venue titles and section headers. Use `tracking-tight` and bold weights.
*   **Body & UI Text:** `Plus Jakarta Sans` (or `Satoshi`). A geometric, highly legible, and exceptionally clean sans-serif for descriptions, buttons, and inputs.
---
## 3. Global Components
### 3.1 Floating Pill Navbar
*   **Position:** Fixed at the top, centered, with `mt-4` spacing from the top edge.
*   **Shape:** Fully rounded (`rounded-full`).
*   **Style:** Translucent white (`bg-white/80 backdrop-blur-md`) with a soft drop shadow.
*   **Contents:** 
    *   Left: Logo (Text: "BookMyVenue" with "Venue" in Sunset Orange, using the Heading font).
    *   Center: Desktop navigation links (Home, Venues, About) in `text-stone-600 hover:text-stone-900`.
    *   Right: User dropdown (Avatar) or "Sign In" button (Orange pill).
*   **Mobile:** Hamburger menu that opens a clean white sliding sheet (`shadcn/ui Sheet`).
### 3.2 Footer
*   **Style:** Simple, minimalist, `bg-white`, separated by a subtle top border (`border-stone-200`).
*   **Contents:** Copyright, Social icons, Legal links (text should be `text-stone-500`).
---
## 4. Core Page Layouts
### 4.1 Landing Page (`/`)
*   **Hero Section:** 
    *   Large, immersive background image of a bright, sunlit luxury venue.
    *   Overlay: A very subtle gradient or slight darkening just enough to make text readable, or place text in a floating white frosted-glass card.
    *   Headline: "Find the Perfect Space for Your Next Event" (Large, bold, `text-stone-900` or `text-white` depending on overlay, using Clash Display).
    *   **Search Bar Widget:** A thick, rounded white pill placed over the hero image. It contains three inputs separated by thin vertical dividers (`border-r border-stone-200`): *Location*, *Date*, *Guests*, and an Orange circular search button with a magnifying glass icon.
*   **Featured Venues Section:**
    *   Section Title: "Trending Venues" (Deep Charcoal, Heading font).
    *   Grid Layout: 3 or 4 columns (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4`).
    *   Uses the **Venue Card Component**.
*   **Browse by Category Section:**
    *   Horizontal scrollable row of light gray circular icons or cards with soft borders (Weddings, Corporate, Birthdays, Studios).
### 4.2 Discovery/Search Page (`/venues`)
*   **Layout:** Two-column split layout on `bg-stone-50`.
*   **Left Sidebar (Filters):** Sticky white card. Contains price sliders, checkboxes for amenities, and capacity inputs.
*   **Right Content (Results):** Grid of Venue Cards. Includes a sorting dropdown at the top ("Sort by: Price, Rating").
### 4.3 Venue Details Page (`/venues/[id]`)
*   **Top:** Image Gallery (1 large main image on the left, 4 smaller images in a 2x2 grid on the right). Images have slightly rounded corners (`rounded-xl`).
*   **Main Content Layout:** Two columns (70% / 30%).
    *   **Left Column (Details):** Venue Title (Clash Display, huge), Location (with Map snippet icon), Capacity, Host info. Rich text description in Plus Jakarta Sans. List of amenities using Lucide icons. Reviews section with soft gray dividers.
    *   **Right Column (Booking Widget):** Sticky white card with a soft drop shadow. Displays Base Price per day/hour. Contains a Date Picker (`shadcn/ui Calendar`), Guest counter, and a massive, full-width Orange "Reserve Now" button.
### 4.4 Dashboard Layout (`/(dashboard)/*`)
*   **Structure:** Sidebar Navigation + Main Content Area.
*   **Sidebar:** Fixed on the left, `bg-white`, border right.
*   **Main Area:** `bg-stone-50` background.
*   **Data Display:** 
    *   Use `shadcn/ui Card` with pure white backgrounds for high-level stats.
    *   Use `shadcn/ui Table` for listing bookings, with bright status badges (Soft Green bg/Dark Green text for Confirmed, Soft Yellow bg/Dark Yellow text for Pending).
### 4.5 Auth Pages (`/login`, `/register`)
*   **Layout:** Split screen.
*   **Left Side:** Beautiful, bright, high-quality image of an event space.
*   **Right Side:** Centered Login/Register form on a pure white background.
*   **Form Style:** Clean inputs with subtle borders (`border-stone-200 focus:border-orange-500`), labels on top. "Continue with Google" button utilizing a Google icon and a clean white button with a border.
---
## 5. UI Components Breakdown
### 5.1 Venue Card (`<VenueCard />`)
*   **Wrapper:** `bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden group cursor-pointer hover:shadow-md transition-all`.
*   **Image:** Aspect ratio 4:3. Image scales up slightly on hover (`hover:scale-105 transition-transform`).
*   **Overlay:** Heart icon (Favorite) in top right corner (white background blur pill).
*   **Content (Padded inner section):** 
    *   Title (Clash Display, `text-stone-900`, bold).
    *   Location (`text-stone-500`, small).
    *   Price (`text-stone-900` font-semibold) + "/day".
    *   Rating (Star icon + number in `text-stone-700`).
### 5.2 Loading States
*   Implement `shadcn/ui Skeleton` for all async data. 
*   **Skeleton Style:** Use soft, pulsing light gray (`bg-stone-200/60`).
*   **Venue Card Skeleton:** A gray pulsing rectangle for the image, and 3 thin pulsing rectangles for the text below it.
## 6. Interaction & Animations
*   **Hover states:** Buttons should slightly lift (`-translate-y-0.5`) and change shadow on hover.
*   **Transitions:** Use standard Tailwind duration (`duration-200 ease-in-out`).
*   **Focus Rings:** Use sunset orange focus rings (`focus:ring-orange-500/20`) for all accessibility outlines on inputs and buttons.