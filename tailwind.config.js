/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        harness: {
          blue: '#00ADE4',
          'blue-hover': '#0095C8',
          'blue-light': '#E6F7FD',
          navy: '#0B1120',
          'navy-mid': '#131D2E',
          sidebar: '#060C18',
        },
      },
    },
  },
  plugins: [],
}

