// Configuración centralizada del tema de la aplicación MediApp - 2025 Edition
// Colores del Consejo de Médicos de la Provincia de Córdoba (Modernizados)

export const THEME = {
    // Colores principales - Paleta 2025 actualizada 
    colors: {
        primary: {
            main: '#1E6091', // Azul más profundo y moderno
            light: '#3A87C4',
            dark: '#0A4B78',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#10B981', // Verde/Turquesa moderno 
            light: '#34D399',
            dark: '#059669',
            contrastText: '#ffffff',
        },
        accent: {
            main: '#8B5CF6', // Violeta como acento moderno de 2025
            light: '#A78BFA',
            dark: '#7C3AED',
            contrastText: '#ffffff',
        },
        error: {
            main: '#EF4444',
            light: '#F87171',
            dark: '#DC2626',
            contrastText: '#ffffff',
        },
        warning: {
            main: '#F59E0B',
            light: '#FBBF24',
            dark: '#D97706',
            contrastText: '#ffffff',
        },
        info: {
            main: '#3B82F6',
            light: '#60A5FA',
            dark: '#2563EB',
            contrastText: '#ffffff',
        },
        success: {
            main: '#10B981',
            light: '#34D399',
            dark: '#059669',
            contrastText: '#ffffff',
        },
        background: {
            default: '#ffffff',
            paper: '#f9fafb',
            subtle: '#f3f4f6',
            darkMode: '#111827',
        },
        text: {
            primary: '#1f2937',
            secondary: '#4b5563',
            disabled: '#9ca3af',
            hint: '#6b7280',
            darkModePrimary: '#f9fafb',
            darkModeSecondary: '#e5e7eb',
        },
        divider: '#e5e7eb',
        // Colores UI neutros
        gray: {
            50: '#f9fafb',
            100: '#f3f4f6',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827',
        }
    },

    // Tipografía
    typography: {
        fontFamily: "'Inter', 'Montserrat', 'Roboto', sans-serif",
        fontSize: {
            xs: '0.75rem',
            sm: '0.875rem',
            md: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem',
            '5xl': '3rem',
        },
        fontWeight: {
            light: 300,
            regular: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
        }
    },

    // Espaciado
    spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
    },

    // Bordes
    borderRadius: {
        none: '0',
        sm: '0.125rem',
        default: '0.375rem', // 2025: Bordes más suaves pero definidos
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        full: '9999px',
    },

    // Sombras - Más sutiles para 2025
    shadows: {
        none: 'none',
        sm: '0 1px 2px rgba(0, 0, 0, 0.04)',
        default: '0 2px 4px rgba(0, 0, 0, 0.05)',
        md: '0 4px 8px rgba(0, 0, 0, 0.05)',
        lg: '0 8px 16px rgba(0, 0, 0, 0.06)',
        xl: '0 12px 24px rgba(0, 0, 0, 0.05), 0 4px 8px rgba(0, 0, 0, 0.03)',
        inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.03)',
    },

    // Animaciones
    animations: {
        transitionDuration: {
            fast: '100ms',
            default: '200ms',
            slow: '400ms',
        },
        transitionEasing: {
            easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
            easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
            easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
            sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
        },
    },

    // Breakpoints para diseño responsive
    breakpoints: {
        xs: '0px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
    },

    // Z-index para capas
    zIndex: {
        tooltip: 1500,
        modal: 1400,
        drawer: 1300,
        dropdown: 1200,
        appBar: 1100,
        mobileStepper: 1000,
        fab: 950,
        speedDial: 900,
        subheader: 800,
    }
};

// Clases CSS personalizadas para aplicar el tema
export const cssClasses = {
    buttons: {
        primary: 'bg-primary-main hover:bg-primary-dark text-white font-medium rounded-lg transition-all duration-200 px-5 py-2.5 shadow-sm',
        secondary: 'bg-secondary-main hover:bg-secondary-dark text-white font-medium rounded-lg transition-all duration-200 px-5 py-2.5 shadow-sm',
        outlined: 'border border-primary-main text-primary-main hover:bg-primary-main/5 font-medium rounded-lg transition-all duration-200 px-5 py-2.5',
        text: 'text-primary-main hover:bg-primary-main/5 font-medium rounded-lg transition-all duration-200 px-4 py-2',
        icon: 'text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all duration-200',
    },
    cards: {
        default: 'bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all duration-200',
        hover: 'bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all duration-200 hover:shadow-md hover:translate-y-[-2px]',
        elevated: 'bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-200',
    },
    inputs: {
        default: 'w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-primary-main transition-all duration-200',
        error: 'w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-red-400 dark:border-red-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200',
    },
    text: {
        title: 'text-2xl font-semibold text-gray-800 dark:text-white',
        subtitle: 'text-xl font-medium text-gray-700 dark:text-gray-200',
        body: 'text-base text-gray-600 dark:text-gray-300',
        small: 'text-sm text-gray-500 dark:text-gray-400',
    },
    containers: {
        page: 'max-w-5xl mx-auto px-4 py-8',
        section: 'mb-10',
    },
};

// Convertir colores a variables CSS
export function getColorVariables() {
    const variables = {};

    // Procesar colores anidados
    const processColors = (obj, prefix = '') => {
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'object') {
                processColors(value, `${prefix}${key}-`);
            } else {
                variables[`--color-${prefix}${key}`] = value;
            }
        }
    };

    processColors(THEME.colors);
    return variables;
}

export default THEME;