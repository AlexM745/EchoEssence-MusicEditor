/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{html,js,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "black",
        secondary: "#b6dffe",
        tertiary: "#655CF0",
      },
    },
    screens: {
      xs: "450px",
    }
  },
  plugins: [],
}

