/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          550: 'rgb(64,68,74)',
          600: 'rgb(54,57,62)',
          650: 'rgb(47,49,54)',
          700: 'rgb(32,34,37)',
        },
        midnight: {
          600: 'rgb(50,53,58)',
          650: 'rgb(46,49,54)',
          700: 'rgb(40,43,47)',
        },
      },
    },
  },
  plugins: [],
};
