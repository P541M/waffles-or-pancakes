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
        navy: "#182532",
      },
    },
    fontFamily: {
      main: ["Bevan", "sans-serif"],
      sub: ["Calistoga", "sans-serif"],
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".text-stroke-1": {
          "-webkit-text-stroke-width": "1px",
        },
        ".text-stroke-3": {
          "-webkit-text-stroke-width": "3px",
        },
        ".text-stroke-blue": {
          "-webkit-text-stroke-color": "#24384C",
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
};
