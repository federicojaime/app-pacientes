// Configuración centralizada del tema de la aplicación MediApp
// Colores del Consejo de Médicos de la Provincia de Córdoba

export const THEME = {
    // Colores principales
    colors: {
        primary: {
            main: '#006699', // Azul principal del Consejo Médico
            light: '#0088cc',
            dark: '#004466',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#009966', // Verde/Turquesa del Consejo Médico
            light: '#00cc88',
            dark: '#006644',
            contrastText: '#ffffff',
        },
        accent: {
            main: '#6699cc', // Azul claro complementario
            light: '#88bbee',
            dark: '#4477aa',
            contrastText: '#ffffff',
        },
        error: {
            main: '#d32f2f',
            light: '#ef5350',
            dark: '#c62828',
            contrastText: '#ffffff',
        },
        warning: {
            main: '#f57c00',
            light: '#ff9800',
            dark: '#e65100',
            contrastText: '#ffffff',
        },
        info: {
            main: '#0288d1',
            light: '#03a9f4',
            dark: '#01579b',
            contrastText: '#ffffff',
        },
        success: {
            main: '#2e7d32',
            light: '#4caf50',
            dark: '#1b5e20',
            contrastText: '#ffffff',
        },
        background: {
            default: '#ffffff',
            paper: '#f9f9f9',
            subtle: '#f5f7fa',
            darkMode: '#121212',
        },
        text: {
            primary: '#333333',
            secondary: '#555555',
            disabled: '#888888',
            hint: '#777777',
            darkModePrimary: '#f5f5f5',
            darkModeSecondary: '#cccccc',
        },
        divider: '#e0e0e0',
    },

    // Rutas de los logos
    logos: {
        main: '/assets/logo-consejo-medicos.png',
        icon: '/assets/icon-consejo-medicos.png',
        miniLogo: '/assets/mini-logo-consejo-medicos.png',
        lightMode: '/assets/logo-light-mode.png',
        darkMode: '/assets/logo-dark-mode.png',
    },

    // Tipografía
    typography: {
        fontFamily: "'Montserrat', 'Roboto', 'Arial', sans-serif",
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
        default: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px',
    },

    // Sombras
    shadows: {
        none: 'none',
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        default: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    },

    // Animaciones
    animations: {
        transitionDuration: {
            short: '150ms',
            default: '300ms',
            long: '500ms',
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
        sm: '600px',
        md: '960px',
        lg: '1280px',
        xl: '1920px',
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
        primary: 'bg-primary-main hover:bg-primary-dark text-white font-medium rounded-lg transition-all duration-300 px-6 py-2.5 shadow-sm',
        secondary: 'bg-secondary-main hover:bg-secondary-dark text-white font-medium rounded-lg transition-all duration-300 px-6 py-2.5 shadow-sm',
        outlined: 'border border-primary-main text-primary-main hover:bg-primary-main/10 font-medium rounded-lg transition-all duration-300 px-6 py-2.5',
        text: 'text-primary-main hover:bg-primary-main/10 font-medium rounded-lg transition-all duration-300 px-4 py-2',
        icon: 'text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all duration-300',
    },
    cards: {
        default: 'bg-white rounded-xl shadow-md p-6 transition-all duration-300',
        hover: 'bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]',
        elevated: 'bg-white rounded-xl shadow-lg p-6 transition-all duration-300',
    },
    inputs: {
        default: 'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-primary-main transition-all duration-300',
        error: 'w-full px-4 py-2.5 border border-red-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300',
    },
    text: {
        title: 'text-2xl font-semibold text-gray-800',
        subtitle: 'text-xl font-medium text-gray-700',
        body: 'text-base text-gray-600',
        small: 'text-sm text-gray-500',
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