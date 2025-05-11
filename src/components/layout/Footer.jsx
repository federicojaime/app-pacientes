import React from 'react';
import { FaHeart, FaUserMd, FaInfoCircle, FaShieldAlt } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-medico-dark text-white shadow-inner py-6 transition-colors duration-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="flex items-center">
              <span className="text-medico-red font-bold text-2xl mr-1">+</span>
              <div className="h-7 w-7 relative">
                <span className="absolute inset-0 bg-medico-teal rounded-full opacity-80"></span>
                <FaUserMd className="text-white text-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
            <span className="font-bold text-white ml-2">MediApp</span>
          </div>
          
          <div className="text-center text-sm text-gray-300 mb-4 md:mb-0">
            <p className="flex items-center justify-center gap-1">
              Desarrollado con <FaHeart className="text-medico-red" /> para nuestros pacientes
            </p>
            <p className="mt-1">© {currentYear} Consejo de Médicos. Todos los derechos reservados.</p>
          </div>
          
          <div className="flex gap-4 text-sm">
            <a href="#" className="text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors">
              <FaInfoCircle className="text-xs" />
              Ayuda
            </a>
            <a href="#" className="text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors">
              <FaShieldAlt className="text-xs" />
              Privacidad
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;