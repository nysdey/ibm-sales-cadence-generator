/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ibm-blue': '#0f62fe',
        'ibm-blue-dark': '#0043ce',
        'ibm-gray': '#161616',
        'ibm-gray-light': '#f4f4f4',
      },
    },
  },
  plugins: [],
}

// Made with Bob
