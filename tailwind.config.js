/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Noto Serif TC"', ...defaultTheme.fontFamily.serif],
      },
    },
  },
  plugins: [],
};
