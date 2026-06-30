const { palette, radius } = require("@repo/ui-tokens");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        surface: palette.surface,
        background: palette.background,
        lead: palette.lead,
        foreground: palette.foreground,
        brand: palette.brand,
        "brand-foreground": palette.brandForeground,
        card: palette.card,
        muted: palette.muted,
        "muted-foreground": palette.mutedForeground,
        border: palette.border,
        destructive: palette.destructive,
      },
      borderRadius: {
        sm: radius.sm,
        md: radius.md,
        lg: radius.lg,
        xl: radius.xl,
        "2xl": radius["2xl"],
      },
      fontFamily: {
        serif: ["Instrument Serif", "Georgia", "serif"],
        sans: ["Instrument Sans", "System"],
      },
    },
  },
};
