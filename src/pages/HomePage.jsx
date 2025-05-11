import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaIdCard, FaUserMd, FaFileMedical, FaClipboardCheck, FaCalendarAlt } from 'react-icons/fa';
import PatientContext from '../contexts/PatientContext';

const HomePage = () => {
    const { patient } = useContext(PatientContext);

    const features = [
        {
            icon: <FaIdCard />,
            title: 'Registro de Pacientes',
            description: 'Verificá tus datos personales escaneando tu DNI'
        },
        {
            icon: <FaFileMedical />,
            title: 'Recetas Online',
            description: 'Accedé a tus recetas médicas digitales de forma segura',
            soon: true
        },
        {
            icon: <FaClipboardCheck />,
            title: 'Estudios Médicos',
            description: 'Consultá los resultados de tus estudios en cualquier momento',
            soon: true
        },
        {
            icon: <FaCalendarAlt />,
            title: 'Certificados Médicos',
            description: 'Gestioná tus certificados de manera sencilla y rápida',
            soon: true
        }
    ];

    return (
        <div className="container mx-auto max-w-4xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Tu salud, al alcance de tu mano
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
                    Accedé a tus datos médicos, recetas y resultados de estudios de forma rápida y segura.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-12"
            >
                <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl overflow-hidden shadow-xl">
                    <div className="px-6 py-10 md:px-12 md:py-16 flex flex-col md:flex-row items-center">
                        <div className="md:w-2/3 mb-8 md:mb-0 md:pr-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                {patient
                                    ? `¡Bienvenido de nuevo, ${patient.nombre}!`
                                    : 'Comienza verificando tu identidad'}
                            </h2>
                            <p className="text-primary-100 mb-6">
                                {patient
                                    ? 'Accedé a toda tu información médica de manera rápida y segura.'
                                    : 'Escanea tu DNI para verificar tus datos y acceder a tus servicios médicos.'}
                            </p>
                            <Link
                                to={patient ? '/profile' : '/scan'}
                                className="inline-flex items-center px-6 py-3 bg-white text-primary-700 font-semibold rounded-xl shadow-md hover:bg-primary-50 transition-colors duration-200"
                            >
                                {patient ? 'Ver mi perfil' : 'Escanear DNI'}
                                <FaIdCard className="ml-2" />
                            </Link>
                        </div>
                        <div className="md:w-1/3 flex justify-center">
                            <div className="w-32 h-32 md:w-48 md:h-48 bg-white/20 rounded-full flex items-center justify-center">
                                <FaUserMd className="text-6xl md:text-8xl text-white/70" />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
            >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
                    Nuestros servicios
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md p-6 transition-all duration-200 relative overflow-hidden"
                        >
                            {feature.soon && (
                                <div className="absolute top-3 right-3 bg-secondary-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                    Próximamente
                                </div>
                            )}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-xl text-primary-600 dark:text-primary-400">
                                    {feature.icon}
                                </div>
                                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                                    {feature.title}
                                </h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 ml-16">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default HomePage;