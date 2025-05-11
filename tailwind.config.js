/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',  // Color principal, celeste institucional
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        secondary: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843', // Rojo/bordó institucional
          950: '#500724',
        },
        medico: {
          dark: '#2A2F35',  // Color oscuro del navbar
          light: '#f5f5f5', // Color claro de fondo
          red: '#bb1e3b',   // Color rojo del logo
          teal: '#18a2b8',  // Color celeste del logo
        }
      },
      fontFamily: {
        sans: ['Roboto', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'neumorph': '20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff',
        'neumorph-dark': '20px 20px 60px #1a1a1a, -20px -20px 60px #262626',
      },
    },
  },
  plugins: [],
}