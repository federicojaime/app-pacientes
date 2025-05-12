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
          main: 'var(--color-primary-main)',
          light: 'var(--color-primary-light)',
          dark: 'var(--color-primary-dark)',
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7bc6fc',
          400: '#47a9f5',
          500: '#1E6091', // Main primary color
          600: '#0b5089',
          700: '#0a4071',
          800: '#0c345d',
          900: '#0f2d4e',
        },
        secondary: {
          main: 'var(--color-secondary-main)',
          light: 'var(--color-secondary-light)',
          dark: 'var(--color-secondary-dark)',
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10B981', // Main secondary color
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        accent: {
          main: 'var(--color-accent-main)',
          light: 'var(--color-accent-light)',
          dark: 'var(--color-accent-dark)',
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8B5CF6', // Main accent color
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        success: {
          main: 'var(--color-success-main)',
          light: '#34d399',
          dark: '#059669',
        },
        error: {
          main: 'var(--color-error-main)',
          light: '#f87171',
          dark: '#dc2626',
        },
        warning: {
          main: 'var(--color-warning-main)',
          light: '#fbbf24',
          dark: '#d97706',
        },
        info: {
          main: 'var(--color-info-main)',
          light: '#60a5fa',
          dark: '#2563eb',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Montserrat', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'card': '0 2px 10px rgba(0, 0, 0, 0.05)',
        'elevated': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'neumorph': '10px 10px 20px #d9d9d9, -10px -10px 20px #ffffff',
        'neumorph-dark': '10px 10px 20px #1a1a1a, -10px -10px 20px #262626',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.06)',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
        'width': 'width',
        'backdrop': 'backdrop-filter',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'float': 'float 5s ease-in-out infinite',
        'subtle-pulse': 'subtlePulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        subtlePulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
    },
  },
  plugins: [],
}