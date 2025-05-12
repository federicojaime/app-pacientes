import { THEME } from './src/config/theme.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          main: THEME.colors.primary.main,
          light: THEME.colors.primary.light,
          dark: THEME.colors.primary.dark,
        },
        secondary: {
          main: THEME.colors.secondary.main,
          light: THEME.colors.secondary.light,
          dark: THEME.colors.secondary.dark,
        },
        accent: {
          main: THEME.colors.accent.main,
          light: THEME.colors.accent.light,
          dark: THEME.colors.accent.dark,
        },
        error: {
          main: THEME.colors.error.main,
          light: THEME.colors.error.light,
          dark: THEME.colors.error.dark,
        },
        warning: {
          main: THEME.colors.warning.main,
          light: THEME.colors.warning.light,
          dark: THEME.colors.warning.dark,
        },
        success: {
          main: THEME.colors.success.main,
          light: THEME.colors.success.light,
          dark: THEME.colors.success.dark,
        },
        info: {
          main: THEME.colors.info.main,
          light: THEME.colors.info.light,
          dark: THEME.colors.info.dark,
        },
        background: {
          default: THEME.colors.background.default,
          paper: THEME.colors.background.paper,
          subtle: THEME.colors.background.subtle,
          dark: THEME.colors.background.darkMode,
        },
        'consejo-medico': {
          blue: THEME.colors.primary.main,
          green: THEME.colors.secondary.main,
          cyan: THEME.colors.accent.main,
          white: THEME.colors.background.default,
          dark: '#2A2F35',
        }
      },
      fontFamily: {
        sans: ['Montserrat', 'Roboto', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'card': '0 2px 12px rgba(0, 0, 0, 0.08)',
        'elevated': '0 4px 20px rgba(0, 0, 0, 0.12)',
        'neumorph': '20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff',
        'neumorph-dark': '20px 20px 60px #1a1a1a, -20px -20px 60px #262626',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}