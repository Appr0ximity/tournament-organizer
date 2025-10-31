/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: '#00ffff',
          pink: '#ff00ff',
          blue: '#0080ff',
          purple: '#8000ff',
        },
      },
      boxShadow: {
        'neon-cyan': '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff',
        'neon-pink': '0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff00ff',
        'neon-blue': '0 0 10px #0080ff, 0 0 20px #0080ff, 0 0 30px #0080ff',
        'neon-purple': '0 0 10px #8000ff, 0 0 20px #8000ff, 0 0 30px #8000ff',
      },
    },
  },
  plugins: [],
}

