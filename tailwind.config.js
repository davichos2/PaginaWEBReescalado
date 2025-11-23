/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  //Declaramos nuestro propio color
  colors: {
    primary: '#2F4550',
    secondary: '##586F7C',
    danger: '#B8DBD9',
    white: '#ffffff',
    black: '#000000',
  },
}