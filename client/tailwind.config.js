/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        babypink: {
          50: '#fff5f7',
          100: '#ffe4ec',
          200: '#ffc2d4',
          300: '#ff9fbb',
          400: '#ff7ba3',
          500: '#f7567f',
          600: '#e13f68',
        },
        butteryellow: {
          50: '#fffdf5',
          100: '#fff8dc',
          200: '#ffefad',
          300: '#ffe57e',
          400: '#ffd94f',
          500: '#f5c518',
          600: '#d4a90a',
        },
      },
    },
  },
  plugins: [],
}