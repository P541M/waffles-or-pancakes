/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ["./src/**/*.{html,js,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        sage: "#DBCFB0",
        blue: "#24384C",
        green: "#618556",
        yellow: "#E5A251",
      },
    },
    fontFamily: {
      main: ["Bevan", "sans-serif"],
    },
  },
  plugins: [],
};
