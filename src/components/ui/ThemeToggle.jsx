import React, { useContext } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { motion } from 'framer-motion';
import DarkModeContext from '../../contexts/DarkModeContext';

const ThemeToggle = () => {
    const { darkMode, toggleDarkMode } = useContext(DarkModeContext);

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className={`
        flex items-center justify-center gap-2 px-4 py-2 rounded-full
        transition-all duration-300
        ${darkMode
                    ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                    : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}
      `}
            aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
            {darkMode ? (
                <>
                    <FaSun className="text-lg" />
                    <span className="text-sm font-medium">Modo claro</span>
                </>
            ) : (
                <>
                    <FaMoon className="text-lg" />
                    <span className="text-sm font-medium">Modo oscuro</span>
                </>
            )}
        </motion.button>
    );
};

export default ThemeToggle;