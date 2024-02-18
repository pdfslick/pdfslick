/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,css,md,mdx,html,json,scss}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        contentShow: {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        contentHide: {
          '0%': { opacity: 1, transform: 'scale(1)' },
          '100%': { opacity: 0, transform: 'scale(0.95)' },
        }
      },
      animation: {
        'content-show': 'contentShow 100ms ease-out',
        'content-hide': 'contentHide 75ms ease-in forwards'
      }
    },
  },
  plugins: [
    require("@kobalte/tailwindcss"),
  ],
}
