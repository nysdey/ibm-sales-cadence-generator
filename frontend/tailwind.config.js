/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ibm-blue': '#4589FF',
        'ibm-blue-dark': '#0043ce',
        'ibm-blue-light': '#78A9FF',
        'ibm-blue-glow': '#4589FF',
        'text-primary': '#F4F4F4',
        'text-secondary': '#A8B3CF',
        'text-accent': '#78A9FF',
        'bg-base': '#0a0a0a',
        'bg-surface': 'rgba(26, 26, 26, 0.6)',
        'bg-raised': 'rgba(36, 36, 36, 0.8)',
        'bg-elevated': 'rgba(45, 45, 45, 0.9)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(69, 137, 255, 0.3)',
        'glow-lg': '0 0 40px rgba(69, 137, 255, 0.4)',
        'soft': '0 4px 20px rgba(0, 0, 0, 0.3)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle at top, rgba(69, 137, 255, 0.1) 0%, rgba(10, 10, 10, 1) 50%)',
        'gradient-ombre': 'linear-gradient(180deg, rgba(20, 30, 48, 0.4) 0%, rgba(10, 10, 10, 1) 100%)',
      },
    },
  },
  plugins: [],
}

// Made with Bob
