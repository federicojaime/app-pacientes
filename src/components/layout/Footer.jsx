import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaUserMd, FaInfoCircle, FaShieldAlt, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import ConsejoLogo from '../../assets/images/logo2.png'; // Ajusta la ruta según la ubicación real del logo

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
      { name: 'Términos y condiciones', href: 'https://codeo.site/terminos.pdf' },
      { name: 'Página principal', href: 'https://cmpc.org.ar/' },
    ],
    contacto: [
      { icon: <FaPhone />, info: '+54 351 4225004' },
      { icon: <FaEnvelope />, info: 'consejomedico@cmpc.org.ar' },
      { icon: <FaMapMarkerAlt />, info: 'Mendoza 251, Barrio Alberdi, Córdoba, Argentina' }
    ]
  };

  // Animación para contenedor
  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  // Animación para elementos individuales
  const itemAnimation = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerAnimation}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {/* Columna 1: Logo e información */}
          <motion.div
            variants={itemAnimation}
            className="col-span-1 lg:col-span-1"
          >
            <div className="mb-6">
              <img
                src={ConsejoLogo}
                alt="Consejo de Médicos de la Provincia de Córdoba"
                className="h-20 w-auto"
              />            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              El Consejo de Médicos trabaja para asegurar el correcto y regular ejercicio de la profesión médica,
              garantizando la salud de todos los ciudadanos de la Provincia de Córdoba.
            </p>

          </motion.div>

          {/* Columna 2: Enlaces informativos 
          <motion.div variants={itemAnimation}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Información</h3>
            <ul className="space-y-2">
              {links.info.map((link, index) => (
                <motion.li
                  key={index}
                  variants={itemAnimation}
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  <a
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-main dark:hover:text-primary-light transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Columna 3: Enlaces legales */}
          <motion.div variants={itemAnimation}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              {links.legal.map((link, index) => (
                <motion.li
                  key={index}
                  variants={itemAnimation}
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  <a
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-main dark:hover:text-primary-light transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Columna 4: Contacto */}
          <motion.div variants={itemAnimation}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contacto</h3>
            <ul className="space-y-3">
              {links.contacto.map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-start"
                  variants={itemAnimation}
                >
                  <span className="text-primary-main dark:text-primary-light mt-1 mr-3">
                    {item.icon}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {item.info}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-100 dark:border-gray-800 mt-10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                © {currentYear} Consejo de Médicos de la Provincia de Córdoba. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;