/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        '17': '17rem',
      },
      left:{
        30: '30rem',
      }
      
    },
  },
  plugins: [],
}
