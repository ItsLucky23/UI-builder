// tailwind.config.js
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./container-safelist.txt", // Container query variants for dynamically compiled blueprints
  ],
  theme: {
    extend: {
      colors: {}
    },
  },
  plugins: [
    // @tailwindcss/container-queries not needed in v4 - built-in
    require("@tailwindcss/typography"),
  ],
};