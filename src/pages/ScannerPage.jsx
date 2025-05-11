import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaIdCard, FaUserPlus, FaSpinner, FaInfoCircle, FaSearch } from 'react-icons/fa';
import DniScanner from '../components/scanner/DniScanner';
import patientService from '../services/patientService';
import PatientContext from '../contexts/PatientContext';
import ErrorHandler from '../components/ui/ErrorHandler';

const ScannerPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setPatient } = useContext(PatientContext);
  const navigate = useNavigate();

  const handleDniScanned = async (dni) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await patientService.checkPatientByDni(dni);
      
      if (result.exists && result.patient) {
        // Si el paciente existe, guardamos sus datos y redirigimos al perfil
        setPatient(result.patient);
        navigate('/profile');
      } else {
        // Si el paciente no existe, redirigimos al registro
        navigate('/register', { state: { dni } });
      }
    } catch (error) {
      console.error('Error al verificar el DNI:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRetry = () => {
    setError(null);
  };

  return (
    <div className="container mx-auto max-w-lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-medico-teal/20 rounded-full text-medico-teal mb-4">
          <FaIdCard className="text-3xl" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Verificación de identidad
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Escanea el código de barras PDF417 en la parte trasera de tu DNI para acceder a tus datos médicos
        </p>
      </motion.div>

      {/* Instrucciones de escaneo */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl"
      >
        <div className="flex items-start gap-3">
          <FaInfoCircle className="text-blue-500 dark:text-blue-400 text-lg mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-blue-700 dark:text-blue-300 mb-1">Cómo escanear tu DNI</h3>
            <ul className="text-sm text-blue-600 dark:text-blue-300 space-y-1 list-disc list-inside">
              <li>Utiliza la parte trasera de tu DNI</li>
              <li>Asegúrate de que el código PDF417 quede dentro del recuadro</li>
              <li>Mantén el DNI a unos 15-20 cm de la cámara</li>
              <li>Asegúrate de tener buena iluminación</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center p-8 bg-white dark:bg-medico-dark rounded-xl shadow-md"
        >
          <FaSpinner className="text-4xl text-medico-teal animate-spin mb-4" />
          <p className="text-gray-600 dark:text-gray-300 font-medium">Verificando tu identidad...</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Estamos consultando tus datos en el sistema</p>
        </motion.div>
      ) : (
        <>
          {error && (
            <div className="mb-6">
              <ErrorHandler 
                error={error} 
                onRetry={handleRetry}
                message="Hubo un problema al verificar el DNI. Por favor, inténtalo de nuevo."
              />
            </div>
          )}
          
          <DniScanner onDniScanned={handleDniScanned} />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="p-4 bg-white dark:bg-medico-dark shadow rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 bg-medico-red/20 rounded-full flex items-center justify-center text-medico-red flex-shrink-0">
                <FaSearch className="text-lg" />
              </div>
              <div className="text-sm">
                <h3 className="font-medium text-gray-900 dark:text-white">Buscar por DNI</h3>
                <p className="text-gray-500 dark:text-gray-400">Ingresa el número de DNI manualmente</p>
              </div>
            </div>
            
            <div className="p-4 bg-white dark:bg-medico-dark shadow rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 flex-shrink-0">
                <FaUserPlus className="text-lg" />
              </div>
              <div className="text-sm">
                <h3 className="font-medium text-gray-900 dark:text-white">Nuevo registro</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  <button
                    onClick={() => navigate('/register')}
                    className="text-medico-teal hover:underline"
                  >
                    Registrarse manualmente
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default ScannerPage;