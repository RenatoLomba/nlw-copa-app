/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.tsx', './components/**/*.tsx'],
  theme: {
    extend: {
      backgroundImage: {
        app: 'url(/app-bg.png)',
      },
      colors: {
        gray: {
          100: '#e1e1e6',
          300: '#8d8d99',
          600: '#323238',
          800: '#202024',
          900: '#121214',
          950: '#09090a',
        },

        ignite: {
          500: '#129e57',
        },

        copa: {
          500: '#f7dd43',
          700: '#e5cd3d',
        },
      },
    },
  },
  plugins: [],
}
