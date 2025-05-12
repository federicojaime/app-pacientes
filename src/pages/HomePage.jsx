import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaIdCard, FaUserMd, FaFileMedical, FaClipboardCheck, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';
import PatientContext from '../contexts/PatientContext';

const HomePage = () => {
    const { patient } = useContext(PatientContext);

    // Animación para los elementos que aparecen en cascada
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    // Animación para cada elemento hijo
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.4, ease: "easeOut" }
        }
    };

    // Características/servicios de la aplicación
    const features = [
        {
            icon: <FaIdCard />,
            title: 'Registro de Pacientes',
            description: 'Verificá tus datos personales escaneando tu DNI',
            color: 'bg-blue-500'
        },
        {
            icon: <FaFileMedical />,
            title: 'Recetas Online',
            description: 'Accedé a tus recetas médicas digitales de forma segura',
            soon: true,
            color: 'bg-emerald-500'
        },
        {
            icon: <FaClipboardCheck />,
            title: 'Estudios Médicos',
            description: 'Consultá los resultados de tus estudios en cualquier momento',
            soon: true,
            color: 'bg-violet-500'
        },
        {
            icon: <FaCalendarAlt />,
            title: 'Certificados Médicos',
            description: 'Gestioná tus certificados de manera sencilla y rápida',
            soon: true,
            color: 'bg-amber-500'
        }
    ];

    return (
        <div className="container mx-auto max-w-5xl">
            {/* Hero section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-6"
            >
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Tu salud, al alcance de tu mano
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
                    Accedé a tus datos médicos, recetas y resultados de estudios de forma rápida y segura.
                </p>
            </motion.div>

            {/* Main card */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-12"
            >
                <div className="bg-gradient-to-br from-primary-main to-primary-dark rounded-2xl overflow-hidden shadow-md">
                    <div className="px-6 py-10 md:px-12 md:py-16 flex flex-col md:flex-row items-center">
                        <div className="md:w-2/3 mb-8 md:mb-0 md:pr-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                {patient
                                    ? `¡Bienvenido de nuevo, ${patient.nombre}!`
                                    : 'Comenzá verificando tu identidad'}
                            </h2>
                            <p className="text-white/90 mb-6">
                                {patient
                                    ? 'Accedé a toda tu información médica de manera rápida y segura.'
                                    : 'Escaneá tu DNI para verificar tus datos y acceder a tus servicios médicos.'}
                            </p>
                            <Link
                                to={patient ? '/profile' : '/scan'}
                                className="inline-flex items-center px-6 py-3.5 bg-white text-primary-dark font-semibold rounded-xl shadow-md hover:bg-primary-50 transition-colors duration-200 group"
                            >
                                {patient ? 'Ver mi perfil' : 'Escanear DNI'}
                                <motion.span 
                                    className="ml-2"
                                    initial={{ x: 0 }}
                                    whileHover={{ x: 3 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <FaArrowRight />
                                </motion.span>
                            </Link>
                        </div>
                        <div className="md:w-1/3 flex justify-center">
                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0.5 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ 
                                    duration: 0.6,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    repeatDelay: 2
                                }}
                                className="w-32 h-32 md:w-48 md:h-48 bg-white/20 rounded-full flex items-center justify-center"
                            >
                                <FaUserMd className="text-6xl md:text-8xl text-white/80" />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Features grid */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="mb-12"
            >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
                    Nuestros servicios
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all duration-200 relative overflow-hidden"
                        >
                            {feature.soon && (
                                <div className="absolute top-3 right-3 bg-secondary-main text-white text-xs font-bold px-2 py-1 rounded-full">
                                    Próximamente
                                </div>
                            )}
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`w-12 h-12 rounded-xl ${feature.color} bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center text-xl ${feature.color.replace('bg-', 'text-')}`}>
                                    {feature.icon}
                                </div>
                                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                                    {feature.title}
                                </h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 ml-16">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Additional information section */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 md:p-8"
            >
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="md:w-1/4">
                        <div className="w-20 h-20 mx-auto bg-primary-main/10 dark:bg-primary-dark/20 rounded-2xl flex items-center justify-center">
                            <FaUserMd className="text-3xl text-primary-main dark:text-primary-light" />
                        </div>
                    </div>
                    <div className="md:w-3/4 text-center md:text-left">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Consejo de Médicos de la Provincia de Córdoba
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            El Consejo de Médicos trabaja para asegurar el correcto y regular ejercicio de la profesión médica, 
                            garantizando la salud de todos los ciudadanos de la Provincia de Córdoba.
                        </p>
                        <a 
                            href="https://www.cmpc.org.ar/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-primary-main dark:text-primary-light hover:underline"
                        >
                            Visitar sitio web oficial
                            <FaArrowRight className="ml-2" />
                        </a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default HomePage;