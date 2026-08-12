/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Dark theme
        ink: '#0A0F1D',          // app background, dark
        inkraised: '#141B2E',    // cards/surfaces, dark
        inkalt: '#0F1526',       // alternating section background, dark

        // Light theme — deliberately NOT white. A soft cool slate-lavender
        // so panels/cards (paperraised) read as distinct from the page bg.
        paper: '#E7E9F5',        // app background, light
        paperraised: '#FBFBFE',  // cards/surfaces, light
        paperalt: '#DEE1F2',     // alternating section background, light

        brand: {
          50: '#EEF0FF',
          100: '#E0E3FF',
          200: '#C3C7FB',
          400: '#7B7FF5',
          500: '#5D5FEF',
          600: '#4A4CD6',
          700: '#3A3BB0',
          900: '#282A6E',
        },
        spark: {
          300: '#F8CD7E',
          400: '#F5B94D',
          500: '#EFA92E',
          600: '#D3891A',
        },
        ok: {
          100: '#D8F3E4',
          500: '#1E9E64',
          600: '#167A4D',
        },
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(20, 24, 48, 0.04), 0 12px 28px -14px rgba(20, 24, 48, 0.16)',
        cardhover: '0 4px 10px rgba(20, 24, 48, 0.06), 0 20px 40px -16px rgba(20, 24, 48, 0.22)',
        popover: '0 8px 24px -6px rgba(20, 24, 48, 0.35)',
      },
      backgroundImage: {
        'dot-grid': 'radial-gradient(currentColor 1px, transparent 1px)',
      },
      backgroundSize: {
        'dot-grid': '22px 22px',
      },
    },
  },
  plugins: [],
};
