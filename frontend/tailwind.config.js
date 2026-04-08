/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sunset: {
          50: '#fef7ee',
          100: '#fdedd3',
          200: '#fad7a5',
          300: '#f6ba6d',
          400: '#f19333',
          500: '#ee7711',
          600: '#df5d07',
          700: '#b94509',
          800: '#93370e',
          900: '#77300f',
        },
        sand: {
          50: '#faf8f5',
          100: '#f3efe8',
          200: '#e8e0d0',
          300: '#d8cab0',
          400: '#c5ae8e',
          500: '#b79975',
          600: '#aa8764',
          700: '#8e6f54',
          800: '#745b47',
          900: '#604c3d',
        },
        earth: {
          50: '#f3f7f2',
          100: '#e3ede0',
          200: '#c8dbc3',
          300: '#a0c197',
          400: '#74a268',
          500: '#548548',
          600: '#416a37',
          700: '#34542d',
          800: '#2c4426',
          900: '#243821',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
