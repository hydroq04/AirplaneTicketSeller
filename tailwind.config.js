/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      keyframes: {
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        
      },
      animation: {
        'slide-in': 'slideInRight 0.3s ease-out forwards',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-out': 'slideOutRight 0.3s ease-in forwards',
        'fade-out': 'fadeOut 0.3s ease-in forwards',
      },
    },
  },
  plugins: [],
}