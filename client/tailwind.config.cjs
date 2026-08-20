const path = require("path");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    path.join(__dirname, "index.html"),
    path.join(__dirname, "src/**/*.{js,ts,jsx,tsx}"),
  ],
  theme: {
    extend: {
      colors: {
        j: {
          black: "#000000",
          offwhite: "#F2F2F2",
          sky: "#BBD9EA",
          muted: "#8A9399",
          slate: "#4A5560",
          charcoal: "#1A1F24",
          footer: "#E8EAEC",
        },
        jamila: {
          blue: "#1A4284",
          lemon: "#DDFF00",
          teal: "#0889A7",
          coral: "#FF3C26",
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', "Georgia", "Times New Roman", "serif"],
        sans: ['"Montserrat"', "system-ui", "Segoe UI", "sans-serif"],
      },
      fontSize: {
        "display-xl": [
          "clamp(3.25rem,11vw,13rem)",
          { lineHeight: "0.92", letterSpacing: "0.06em" },
        ],
        "display-lg": [
          "clamp(2.25rem,6vw,4.5rem)",
          { lineHeight: "1.05", letterSpacing: "0.02em" },
        ],
        hero: ["clamp(1.05rem,1.35vw,1.35rem)", { lineHeight: "1.85", letterSpacing: "0.06em" }],
        banner: ["clamp(1.5rem,4.5vw,3.75rem)", { lineHeight: "1.1", letterSpacing: "0.22em" }],
      },
      maxWidth: {
        content: "80rem",
        measure: "28rem",
      },
      spacing: {
        none: "0px",
      },
      transitionDuration: {
        grow: "900ms",
      },
    },
  },
  plugins: [],
};
