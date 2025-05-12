import React from 'react';
import { FaHeart, FaUserMd, FaInfoCircle, FaShieldAlt, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import ConsejoLogo from '../ui/ConsejoLogo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    info: [
      { name: 'Sobre nosotros', href: '#' },
      { name: 'Nuestra historia', href: '#' },
      { name: 'Misión y visión', href: '#' },
      { name: 'Autoridades', href: '#' }
    ],
    legal: [
      { name: 'Términos y condiciones', href: '#' },
      { name: 'Política de privacidad', href: '#' },
      { name: 'Política de cookies', href: '#' }
    ],
    contacto: [
      { icon: <FaPhone />, info: '0800-888-CONSEJO (2667356)' },
      { icon: <FaEnvelope />, info: 'info@cmpc.org.ar' },
      { icon: <FaMapMarkerAlt />, info: 'Av. Colón 612, Córdoba, Argentina' }
    ]
  };

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Columna 1: Logo e información */}
          <div className="col-span-1 lg:col-span-1">
            <div className="mb-6">
              <ConsejoLogo variant="default" size="lg" showText={false} />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              El Consejo de Médicos trabaja para asegurar el correcto y regular ejercicio de la profesión médica, 
              garantizando la salud de todos los ciudadanos de la Provincia de Córdoba.
            </p>
            <div className="flex items-center text-sm text-primary-main dark:text-primary-light">
              <FaHeart className="mr-2" />
              <span>Al servicio de la salud pública desde 1961</span>
            </div>
          </div>

          {/* Columna 2: Enlaces informativos */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Información</h3>
            <ul className="space-y-2">
              {links.info.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-main dark:hover:text-primary-light transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Enlaces legales */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              {links.legal.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-main dark:hover:text-primary-light transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contacto</h3>
            <ul className="space-y-3">
              {links.contacto.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary-main dark:text-primary-light mt-1 mr-3">
                    {item.icon}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {item.info}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                © {currentYear} Consejo de Médicos de la Provincia de Córdoba. Todos los derechos reservados.
              </p>
            </div>
            
            <div className="flex gap-4">
              <a href="#" className="text-gray-500 hover:text-primary-main dark:text-gray-400 dark:hover:text-primary-light transition-colors">
                <FaInfoCircle />
                <span className="sr-only">Ayuda</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-main dark:text-gray-400 dark:hover:text-primary-light transition-colors">
                <FaShieldAlt />
                <span className="sr-only">Privacidad</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-main dark:text-gray-400 dark:hover:text-primary-light transition-colors">
                <FaUserMd />
                <span className="sr-only">Portal Médico</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;