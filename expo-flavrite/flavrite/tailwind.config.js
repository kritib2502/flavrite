/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.js', './App.js'],
  theme: {
    extend: {
      colors: {
      'flavrite-color':'#E76E50',
    }},
  },
  plugins: [],
  displayName: 'flavrite',
}

