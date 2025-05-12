import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserMd, FaHome, FaQrcode, FaUserCircle, FaClipboardList, FaSun, FaMoon } from 'react-icons/fa';
import { MdClose, MdMenu } from 'react-icons/md';
import DarkModeContext from '../../contexts/DarkModeContext';
import PatientContext from '../../contexts/PatientContext';
import ConsejoLogo from '../ui/ConsejoLogo';
import { THEME } from '../../config/theme';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const { patient } = useContext(PatientContext);
  const location = useLocation();

  // Detectar scroll para cambiar apariencia del navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const navItems = [
    { name: 'Inicio', path: '/', icon: <FaHome /> },
    { name: 'Escanear DNI', path: '/scan', icon: <FaQrcode /> },
  ];

  // Agregar opción de perfil solo si hay un paciente autenticado
  if (patient) {
    navItems.push({ name: 'Mi Perfil', path: '/profile', icon: <FaUserCircle /> });
    
    // Agregar enlaces futuros para recetas, certificados, etc.
    navItems.push({ name: 'Mis Documentos', path: '/documents', icon: <FaClipboardList />, soon: true });
  }

  const toggleMenu = () => setIsOpen(!isOpen);

  // Animaciones con Framer Motion
  const mobileMenuVariants = {
    closed: { 
      opacity: 0,
      height: 0,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    open: { 
      opacity: 1, 
      height: "auto",
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-md' 
          : 'bg-white dark:bg-gray-900'
      }`}
    >
      <nav className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <ConsejoLogo variant="default" size="md" showText={true} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.soon ? '#' : item.path}
                    className={`relative px-3 py-2 rounded-lg flex items-center gap-2 transition-colors
                      ${item.soon ? 'cursor-not-allowed opacity-70' : ''} 
                      ${location.pathname === item.path 
                        ? 'text-white bg-primary-main dark:bg-primary-dark' 
                        : 'text-gray-700 dark:text-gray-200 hover:text-primary-main dark:hover:text-primary-light hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    onClick={(e) => item.soon && e.preventDefault()}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                    {item.soon && (
                      <span className="absolute -top-1 -right-1 bg-secondary-main text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                        Pronto
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Botón visible de modo claro/oscuro */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
              aria-label={darkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>

            {/* User Profile (if logged in) */}
            {patient && (
              <div className="relative">
                <Link 
                  to="/profile" 
                  className="flex items-center gap-2 text-gray-800 dark:text-white hover:opacity-80 transition-opacity"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-main/20 flex items-center justify-center">
                    <span className="text-primary-main dark:text-primary-light font-medium">
                      {patient.nombre.charAt(0)}
                      {patient.apellido.charAt(0)}
                    </span>
                  </div>
                  <div className="hidden lg:block">
                    <span className="block text-sm font-medium leading-tight text-gray-700 dark:text-gray-200">
                      {patient.nombre.split(' ')[0]} {patient.apellido.split(' ')[0]}
                    </span>
                    <span className="block text-xs text-gray-500 dark:text-gray-400">
                      DNI: {patient.dni}
                    </span>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            {/* Botón de tema en móvil siempre visible */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors ${
                darkMode 
                  ? 'bg-gray-700 text-yellow-300' 
                  : 'bg-gray-200 text-gray-800'
              }`}
              aria-label={darkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
            >
              {darkMode ? <FaSun className="text-sm" /> : <FaMoon className="text-sm" />}
            </button>
            
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Abrir menú"
            >
              {isOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
              className="md:hidden overflow-hidden"
            >
              <ul className="flex flex-col space-y-1 mt-3 pb-3">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.soon ? '#' : item.path}
                      className={`px-4 py-3 rounded-lg flex items-center gap-3 transition-colors
                        ${item.soon ? 'cursor-not-allowed opacity-70' : ''} 
                        ${location.pathname === item.path 
                          ? 'text-white bg-primary-main dark:bg-primary-dark' 
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      onClick={(e) => {
                        if (item.soon) {
                          e.preventDefault();
                        } else {
                          setIsOpen(false);
                        }
                      }}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.name}</span>
                      {item.soon && (
                        <span className="ml-auto bg-secondary-main text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                          Pronto
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
                
                {/* Perfil de usuario en menú móvil */}
                {patient && (
                  <li className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="px-4 py-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-main/20 flex items-center justify-center">
                          <span className="text-primary-main dark:text-primary-light font-medium">
                            {patient.nombre.charAt(0)}
                            {patient.apellido.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <span className="block font-medium text-gray-800 dark:text-white">
                            {patient.nombre} {patient.apellido}
                          </span>
                          <span className="block text-sm text-gray-500 dark:text-gray-400">
                            DNI: {patient.dni}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Navbar;