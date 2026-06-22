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
        'bg-base': '#0a0a0a',
        'bg-surface': '#1a1a1a',
        'bg-raised': '#242424',
        'bg-elevated': '#2d2d2d',
        'border': '#404040',
        'border-light': '#525252',
        'text-primary': '#ffffff',
        'text-secondary': '#e0e0e0',
        'text-tertiary': '#a8a8a8',
        'text-muted': '#737373',
      },
      boxShadow: {
        'elevated': '0 8px 16px -4px rgba(0, 0, 0, 0.4), 0 4px 8px -2px rgba(0, 0, 0, 0.3)',
        'soft': '0 2px 8px rgba(0, 0, 0, 0.15)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}

// Made with Bob
