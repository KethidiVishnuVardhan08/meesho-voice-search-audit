/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#F1ECDD',
        'paper-dark': '#E6E0CE',
        'paper-light': '#F8F5EC',
        ink: '#15130F',
        'ink-muted': '#5A564E',
        'stamp-red': '#C2321B',
        'pen-blue': '#1D3C8F',
        'highlighter-yellow': '#F4E04D',
      },
      fontFamily: {
        heading: ['"Barlow Condensed"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        serif: ['"Source Serif 4"', 'serif'],
        hand: ['"Caveat"', 'cursive'],
      },
      boxShadow: {
        'ink-3': '3px 3px 0px #15130F',
        'ink-4': '4px 4px 0px #15130F',
        'ink-6': '6px 6px 0px #15130F',
        'red-3': '3px 3px 0px #C2321B',
        'blue-3': '3px 3px 0px #1D3C8F',
      },
    },
  },
  plugins: [],
};
