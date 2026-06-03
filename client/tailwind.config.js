module.exports = {
  content: ['./src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", 'sans-serif'],
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up-0': 'fadeUp 0.7s ease both',
        'fade-up-1': 'fadeUp 0.7s ease 0.12s both',
        'fade-up-2': 'fadeUp 0.7s ease 0.22s both',
        'fade-up-3': 'fadeUp 0.7s ease 0.34s both',
      },
    },
  },
  plugins: [],
};