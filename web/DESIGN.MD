---
name: BookMyVenue Design System
colors:
  surface: '#fbf8ff'
  surface-dim: '#dbd8e5'
  surface-bright: '#fbf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f2ff'
  surface-container: '#efecf9'
  surface-container-high: '#e9e7f3'
  surface-container-highest: '#e3e1ed'
  on-surface: '#1b1b24'
  on-surface-variant: '#454655'
  inverse-surface: '#303039'
  inverse-on-surface: '#f2effc'
  outline: '#757686'
  outline-variant: '#c5c5d7'
  surface-tint: '#3c4cdc'
  primary: '#1023be'
  on-primary: '#ffffff'
  primary-container: '#3343d4'
  on-primary-container: '#c5c9ff'
  inverse-primary: '#bdc2ff'
  secondary: '#535996'
  on-secondary: '#ffffff'
  secondary-container: '#b6bcff'
  on-secondary-container: '#444a85'
  tertiary: '#752300'
  on-tertiary: '#ffffff'
  tertiary-container: '#9d3200'
  on-tertiary-container: '#ffbea8'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dfe0ff'
  primary-fixed-dim: '#bdc2ff'
  on-primary-fixed: '#000865'
  on-primary-fixed-variant: '#1d2ec4'
  secondary-fixed: '#e0e0ff'
  secondary-fixed-dim: '#bdc2ff'
  on-secondary-fixed: '#0d134f'
  on-secondary-fixed-variant: '#3b417c'
  tertiary-fixed: '#ffdbcf'
  tertiary-fixed-dim: '#ffb59c'
  on-tertiary-fixed: '#380c00'
  on-tertiary-fixed-variant: '#822800'
  background: '#fbf8ff'
  on-background: '#1b1b24'
  surface-variant: '#e3e1ed'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  container-padding: 32px
  gutter: 20px
---

## Brand & Style
The design system is engineered for efficiency, clarity, and trust, targeting professional venue owners who manage complex booking schedules. The aesthetic is **Corporate / Modern**, drawing inspiration from high-fidelity utility tools. It prioritizes functional density without sacrificing breathing room, ensuring users feel in control of their data.

The visual narrative is built on "Invisible UI"—where the interface recedes to let the content (bookings, revenue, and availability) take center stage. Key characteristics include:
- **Precision:** Perfect alignment and consistent mathematical scaling.
- **Clarity:** High legibility and distinct states for interactive elements.
- **Sophistication:** A restrained use of color and depth to signal premium quality.

## Colors
The palette is rooted in a "Crisp Professional" spectrum, now optimized for a **Light Mode** environment to provide a clean, paper-like clarity for administrative tasks. The primary color is a **Vibrant Periwinkle Blue**, offering a modern and energetic anchor for the interface.

- **Primary (#5767F6):** Used for primary actions, active states, and critical brand touchpoints.
- **Secondary (#6C72B0):** A muted slate blue used for informational accents and secondary data visualizations.
- **Tertiary (#9D3200):** A deep burnt orange reserved strictly for warnings, pending statuses, or "action required" indicators.
- **Neutrals:** A sophisticated range of cool grays. Backgrounds utilize clean, high-brightness surfaces to maintain a fresh feel, while borders use soft grays to define structure.
- **Success/Error:** Semantic green and red are used sparingly for status badges and validation, adjusted for high legibility against light backgrounds.

## Typography
This design system uses **Inter** exclusively to achieve a systematic, utilitarian look that remains highly readable at small sizes (essential for data tables). 

- **Weight Strategy:** Use `600` (SemiBold) for section headers and `500` (Medium) for interactive labels. `400` (Regular) is reserved for long-form reading and secondary descriptions.
- **Scalability:** Large headlines use negative letter-spacing (`-0.02em`) to maintain a tight, editorial feel, while small labels use increased letter-spacing for legibility.
- **Hierarchy:** In light mode, use typographic scale and color weight (Primary Black vs Slate Gray) to distinguish between primary and secondary information.

## Layout & Spacing
The layout follows a **8px linear grid system** for vertical rhythm and a **12-column fluid grid** for horizontal structure.

- **Desktop:** 12 columns, 20px gutters, 32px side margins. Sidebar is fixed at 280px.
- **Tablet:** 8 columns, 16px gutters, 24px side margins. Sidebar collapses to icons or a hamburger menu.
- **Mobile:** 4 columns, 12px gutters, 16px side margins. Content stacks vertically.
- **Philosophy:** Use `lg` (24px) spacing for padding inside cards and `xl` (32px) for gaps between major sections to maintain the promised "generous whitespace."

## Elevation & Depth
In light mode, depth is signaled through **Ambient Shadows** and subtle tonal shifts. Surfaces are lifted to create clear hierarchy against the bright background.

- **Level 0 (Background):** The base surface, typically a very light gray or off-white.
- **Level 1 (Cards/Surface):** Pure white containers with a subtle, soft shadow to distinguish them from the base background.
- **Level 2 (Dropdowns/Modals):** More pronounced shadows with a larger blur radius to simulate greater elevation.
- **Outlines:** Subtle 1px borders using `outline-variant` are used to define boundaries in high-density areas where shadows might feel cluttered.

## Shapes
The shape language is "Soft Professional." A standard radius of **8px** (0.5rem) is used for most UI components (buttons, inputs, cards) to provide a modern, approachable feel that isn't overly "bubbly."

- **Small elements (Checkboxes):** 4px.
- **Standard elements (Buttons/Inputs):** 8px.
- **Large elements (Cards/Containers):** 16px (`rounded-lg`).
- **Full rounding:** Reserved strictly for status badges and user avatars.

## Components
- **Buttons:** Primary buttons use a solid Periwinkle background with white text. Secondary buttons use a transparent background with a 1px border and a subtle hover highlight.
- **Inputs:** Focus states are signaled by a 2px ring of the primary color. Labels are always positioned above the field in `label-md`.
- **Cards:** Use a 16px corner radius. Headlines inside cards should use `headline-md`. In light mode, cards utilize soft drop shadows for separation.
- **Tables:** Rows must have a minimum height of 52px. Use a subtle background change on hover to assist with row tracking.
- **Status Badges:** Use a "Pill" shape with light, low-saturation backgrounds and high-saturation text to ensure accessibility in the light theme.
- **Empty States:** Use centered layouts with "ghost" icons in medium-neutral tones to guide the user without visual clutter.