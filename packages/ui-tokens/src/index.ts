// Shared design tokens — single source of truth for web (Tailwind / CSS vars)
// and mobile (NativeWind / RN StyleSheet). When you change a color here, both
// platforms update on next build.
//
// Web side: `src/styles.css` declares the same hues as CSS custom properties.
// Mobile side: `apps/mobile/tailwind.config.js` maps these into NativeWind.

export const palette = {
  surface: "#fafaf9", // stone-50
  background: "#fafaf9",
  lead: "#1c1917", // stone-900
  foreground: "#1c1917",
  brand: "#9a3412", // terracotta-800
  brandForeground: "#fafaf9",
  card: "#ffffff",
  muted: "#f5f5f4", // stone-100
  mutedForeground: "#78716c", // stone-500
  border: "rgba(28,25,23,0.08)",
  destructive: "#dc2626",
} as const;

export const paletteDark = {
  surface: "#1c1917",
  background: "#1c1917",
  lead: "#fafaf9",
  foreground: "#fafaf9",
  brand: "#c2410c",
  brandForeground: "#1c1917",
  card: "#292524",
  muted: "#292524",
  mutedForeground: "#a8a29e",
  border: "rgba(255,255,255,0.10)",
  destructive: "#ef4444",
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 12,
  xl: 16,
  "2xl": 20,
  full: 9999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
  "3xl": 48,
} as const;

export const fontFamily = {
  serif: "Instrument Serif",
  sans: "Instrument Sans",
} as const;

export type Palette = typeof palette;
