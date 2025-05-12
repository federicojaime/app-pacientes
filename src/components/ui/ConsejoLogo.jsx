import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import DarkModeContext from '../../contexts/DarkModeContext';

const ConsejoLogo = ({ variant = 'default', size = 'md', showText = true, className = '' }) => {
  const { darkMode } = useContext(DarkModeContext);

  // Determinamos tamaños según el prop size
  const sizes = {
    xs: { height: 24 },
    sm: { height: 32 },
    md: { height: 40 },
    lg: { height: 48 },
    xl: { height: 64 },
  };

  // Colores basados en el modo
  const colors = {
    primary: darkMode ? '#0088cc' : '#006699',
    secondary: darkMode ? '#00cc88' : '#009966',
    text: darkMode ? '#f5f5f5' : '#333333',
    textSecondary: darkMode ? '#cccccc' : '#555555',
  };

  // Animación para el logo
  const logoAnimation = {
    initial: { opacity: 0, y: -5 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: "easeOut" }
  };

  // SVG del logo (versión simplificada para el Consejo de Médicos)
  const renderLogo = () => {
    if (variant === 'icon') {
      // Versión icono simplificado
      return (
        <svg 
          width={sizes[size].height} 
          height={sizes[size].height} 
          viewBox="0 0 40 40" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="40" height="40" rx="8" fill={colors.primary} />
          <path d="M20 10C14.477 10 10 14.477 10 20C10 25.523 14.477 30 20 30C25.523 30 30 25.523 30 20C30 14.477 25.523 10 20 10ZM24 22H22V24C22 25.105 21.105 26 20 26C18.895 26 18 25.105 18 24V22H16C14.895 22 14 21.105 14 20C14 18.895 14.895 18 16 18H18V16C18 14.895 18.895 14 20 14C21.105 14 22 14.895 22 16V18H24C25.105 18 26 18.895 26 20C26 21.105 25.105 22 24 22Z" fill="white" />
        </svg>
      );
    } else if (variant === 'mini') {
      // Versión mini con letras CM
      return (
        <svg 
          width={sizes[size].height * 1.5} 
          height={sizes[size].height} 
          viewBox="0 0 60 40" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="40" height="40" rx="8" fill={colors.primary} />
          <path d="M20 10C14.477 10 10 14.477 10 20C10 25.523 14.477 30 20 30C25.523 30 30 25.523 30 20C30 14.477 25.523 10 20 10ZM24 22H22V24C22 25.105 21.105 26 20 26C18.895 26 18 25.105 18 24V22H16C14.895 22 14 21.105 14 20C14 18.895 14.895 18 16 18H18V16C18 14.895 18.895 14 20 14C21.105 14 22 14.895 22 16V18H24C25.105 18 26 18.895 26 20C26 21.105 25.105 22 24 22Z" fill="white" />
          <text x="45" y="25" fontSize="14" fontWeight="bold" fill={colors.text} textAnchor="middle">CM</text>
        </svg>
      );
    } else {
      // Versión por defecto (logo completo)
      return (
        <svg 
          width={sizes[size].height * 2.5} 
          height={sizes[size].height} 
          viewBox="0 0 100 40" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="40" height="40" rx="8" fill={colors.primary} />
          <path d="M20 10C14.477 10 10 14.477 10 20C10 25.523 14.477 30 20 30C25.523 30 30 25.523 30 20C30 14.477 25.523 10 20 10ZM24 22H22V24C22 25.105 21.105 26 20 26C18.895 26 18 25.105 18 24V22H16C14.895 22 14 21.105 14 20C14 18.895 14.895 18 16 18H18V16C18 14.895 18.895 14 20 14C21.105 14 22 14.895 22 16V18H24C25.105 18 26 18.895 26 20C26 21.105 25.105 22 24 22Z" fill="white" />
          <text x="70" y="18" fontSize="11" fontWeight="bold" fill={colors.text}>Consejo de</text>
          <text x="70" y="30" fontSize="11" fontWeight="bold" fill={colors.text}>Médicos</text>
        </svg>
      );
    }
  };

  return (
    <motion.div
      initial={logoAnimation.initial}
      animate={logoAnimation.animate}
      transition={logoAnimation.transition}
      className={`flex items-center ${className}`}
    >
      {renderLogo()}
      
      {/* Texto adicional opcional (sólo visible en pantallas medianas o mayores) */}
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