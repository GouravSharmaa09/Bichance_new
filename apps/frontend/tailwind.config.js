/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{html,js}",
    "./node_modules/tw-elements/dist/js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          400: '#F28C28',
          500: '#e07b1f',
          50: '#fff7ed',
          100: '#fed7aa',
        },
        gray: {
          900: '#2c3e50',
          800: '#374151',
          700: '#4b5563',
          600: '#6b7280',
          500: '#9ca3af',
          400: '#d1d5db',
          300: '#e5e7eb',
          200: '#f3f4f6',
          100: '#f9fafb',
          50: '#FEFEFE',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderWidth: {
        '3': '3px',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
};