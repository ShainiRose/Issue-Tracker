/** @type {import('tailwindcss').Config} */
export default {
  content: {
    relative: true,
    files: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  },
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
};
