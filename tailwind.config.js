/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./navigation/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        headerColor: "#163020",
        bgColor: "#304D30",
        btnColor: "#B6C4B6",
        textColor: "#EEF0E5",
      },
    },
  },
  plugins: [],
};
