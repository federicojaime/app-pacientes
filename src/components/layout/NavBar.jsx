import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserMd, FaSun, FaMoon, FaUserCircle, FaHome, FaQrcode, FaClipboardList } from 'react-icons/fa';
import { MdClose, MdMenu } from 'react-icons/md';
import DarkModeContext from '../../contexts/DarkModeContext';
import PatientContext from '../../contexts/PatientContext';
import ThemeToggle from '../ui/ThemeToggle';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const { patient } = useContext(PatientContext);
  const location = useLocation();

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

  return (
    <header className="bg-medico-dark text-white shadow-md sticky top-0 z-10 transition-colors duration-200">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center">
              <span className="text-medico-red font-bold text-3xl mr-1">+</span>
              <div className="h-8 w-8 relative">
                <span className="absolute inset-0 bg-medico-teal rounded-full opacity-80"></span>
                <FaUserMd className="text-white text-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
            <span className="font-bold text-xl text-white ml-2">MediApp</span>
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
                        ? 'text-white bg-medico-teal/30' 
                        : 'text-gray-200 hover:text-white hover:bg-white/10'
                      }`}
                    onClick={(e) => item.soon && e.preventDefault()}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                    {item.soon && (
                      <span className="absolute -top-1 -right-1 bg-medico-red text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                        Pronto
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Botón visible de modo claro/oscuro */}
            <ThemeToggle />

            {/* User Profile (if logged in) */}
            {patient && (
              <div className="relative">
                <Link to="/profile" className="flex items-center gap-2 text-white">
                  <div className="w-8 h-8 rounded-full bg-medico-teal/20 flex items-center justify-center">
                    <span className="text-white font-medium">
                      {patient.nombre.charAt(0)}
                      {patient.apellido.charAt(0)}
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
              className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
              aria-label={darkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
            >
              {darkMode ? <FaSun className="text-yellow-300" /> : <FaMoon className="text-white" />}
            </button>
            
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg text-white hover:bg-white/10"
              aria-label="Abrir menú"
            >
              {isOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-3"
          >
            <ul className="flex flex-col space-y-1 pb-3">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.soon ? '#' : item.path}
                    className={`px-4 py-3 rounded-lg flex items-center gap-3 transition-colors
                      ${item.soon ? 'cursor-not-allowed opacity-70' : ''} 
                      ${location.pathname === item.path 
                        ? 'text-white bg-medico-teal/30' 
                        : 'text-gray-200 hover:text-white hover:bg-white/10'
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
                      <span className="ml-auto bg-medico-red text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                        Pronto
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;