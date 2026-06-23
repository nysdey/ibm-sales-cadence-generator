/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // IBM Blue palette
        'ibm-blue': '#4589FF',
        'ibm-blue-dark': '#0043ce',
        'ibm-blue-light': '#78A9FF',
        'ibm-blue-glow': '#4589FF',
        
        // Purple palette
        'ibm-purple': '#8A3FFC',
        'ibm-purple-light': '#A56EFF',
        
        // Gray palette (IBM Carbon)
        'gray-10': '#f4f4f4',
        'gray-20': '#e0e0e0',
        'gray-30': '#c6c6c6',
        'gray-40': '#a8a8a8',
        'gray-50': '#8d8d8d',
        'gray-60': '#6f6f6f',
        'gray-70': '#525252',
        'gray-80': '#393939',
        'gray-90': '#262626',
        'gray-100': '#161616',
        
        // Text colors
        'text-primary': '#f4f4f4',
        'text-secondary': '#c6c6c6',
        'text-tertiary': '#8d8d8d',
        
        // Background colors (IBM Carbon dark theme)
        'bg-base': '#161616',
        'bg-surface': '#262626',
        'bg-raised': '#393939',
        'bg-elevated': '#525252',
        
        // Border colors
        'border': 'rgba(255, 255, 255, 0.1)',
        'border-light': 'rgba(255, 255, 255, 0.15)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(69, 137, 255, 0.3)',
        'soft': '0 2px 8px rgba(0, 0, 0, 0.2)',
        'elevated': '0 4px 16px rgba(0, 0, 0, 0.3)',
      },
      backgroundImage: {
        'gradient-ombre': 'linear-gradient(180deg, #161616 0%, #0a0a0a 100%)',
      },
    },
  },
  plugins: [],
}

// Made with Bob
