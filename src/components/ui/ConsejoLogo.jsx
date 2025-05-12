import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import DarkModeContext from '../../contexts/DarkModeContext';
import { THEME } from '../../config/theme';

// Componente que renderiza el logo usando imágenes desde assets
const ConsejoLogo = ({ variant = 'default', size = 'md', showText = true, className = '' }) => {
    const { darkMode } = useContext(DarkModeContext);

    // Determinamos tamaños según el prop size
    const sizes = {
        xs: { height: '24px' },
        sm: { height: '32px' },
        md: { height: '40px' },
        lg: { height: '48px' },
        xl: { height: '64px' },
    };

    // Seleccionar la imagen correcta según el modo y variante
    const getLogoSrc = () => {
        // Logos según variante y modo claro/oscuro
        if (variant === 'icon') {
            return darkMode ? '../../assets/icon-consejo.png' : '/src/assets/icon-consejo.png';
        } else if (variant === 'mini') {
            return darkMode ? '../../assets/icon-consejo.png' : '/src/assets/icon-consejo.png';
        } else {
            // Variante por defecto (logo completo)
            return darkMode ? '../../assets/icon-consejo.png' : '/src/assets/icon-consejo.png';
        }
    };

    // Animación para el logo
    const logoAnimation = {
        initial: { opacity: 0, y: -5 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3, ease: "easeOut" }
    };

    return (
        <motion.div
            initial={logoAnimation.initial}
            animate={logoAnimation.animate}
            transition={logoAnimation.transition}
            className={`flex items-center ${className}`}
        >
            <img
                src={getLogoSrc()}
                alt="Consejo Médico de la Provincia de Córdoba"
                style={{ height: sizes[size].height }}
                className="max-w-full object-contain"
            />

            {/* Texto adicional opcional */}
            {showText && variant !== 'icon' && variant !== 'mini' && (
                <div className="hidden md:block ml-3 text-sm text-gray-600 dark:text-gray-300">
                    <span className="block font-medium">Consejo de Médicos</span>
                    <span className="block text-xs">de la Provincia de Córdoba</span>
                </div>
            )}
        </motion.div>
    );
};

export default ConsejoLogo;