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
        'ibm-blue-light': '#4589ff',
        'ibm-gray': '#161616',
        'ibm-gray-light': '#f4f4f4',
        'bg-base': '#161616',
        'bg-surface': '#262626',
        'bg-raised': '#393939',
        'border': '#525252',
        'text-primary': '#f4f4f4',
        'text-secondary': '#c6c6c6',
        'text-tertiary': '#8d8d8d',
      },
      boxShadow: {
        'elevated': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
}

// Made with Bob
