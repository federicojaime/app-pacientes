import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaIdCard, FaUserPlus, FaSpinner, FaInfoCircle, FaSearch, FaBug, FaExclamationTriangle } from 'react-icons/fa';
import DniScanner from '../components/scanner/DniScanner';
import patientService from '../services/patientService';
import PatientContext from '../contexts/PatientContext';
import ErrorHandler from '../components/ui/ErrorHandler';

const ScannerPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debug, setDebug] = useState({
    dniScanned: null,
    apiCallTime: null,
    apiResponse: null,
    errorDetails: null
  });
  const { setPatient } = useContext(PatientContext);
  const navigate = useNavigate();

  const handleDniScanned = async (dni) => {
    setLoading(true);
    setError(null);
    setDebug({
      dniScanned: dni,
      apiCallTime: new Date().toLocaleTimeString(),
      apiResponse: null,
      errorDetails: null
    });
    
    try {
      // Mostrar alerta con el DNI escaneado
      const debugAlert = document.createElement('div');
      debugAlert.className = 'fixed top-0 left-0 right-0 p-4 m-4 z-50 bg-blue-500 text-white rounded-lg shadow-lg';
      debugAlert.innerHTML = `<strong>DNI escaneado:</strong> ${dni}`;
      document.body.appendChild(debugAlert);
      setTimeout(() => document.body.removeChild(debugAlert), 5000);
      
      console.log('Verificando DNI:', dni);
      const result = await patientService.checkPatientByDni(dni);
      
      // Actualizar información de depuración
      setDebug(prev => ({
        ...prev,
        apiResponse: {
          success: true,
          exists: result.exists,
          time: new Date().toLocaleTimeString(),
          data: result
        }
      }));
      
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
      
      // Capturar detalles del error para depuración
      setDebug(prev => ({
        ...prev,
        apiResponse: {
          success: false,
          time: new Date().toLocaleTimeString()
        },
        errorDetails: {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url,
          method: error.config?.method
        }
      }));
      
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
          Escanea el código PDF417 del reverso de tu DNI para acceder a tus datos médicos
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
          
          {/* Mostrar el DNI que se está verificando */}
          {debug.dniScanned && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-700 dark:text-blue-300">
              <strong>DNI consultado:</strong> {debug.dniScanned}
              <br />
              <span className="text-xs text-blue-500">Consulta iniciada a las {debug.apiCallTime}</span>
            </div>
          )}
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
              
              {/* Información de depuración del error */}
              {debug.errorDetails && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center mb-2 text-red-600 dark:text-red-400">
                    <FaBug className="mr-2" />
                    <h3 className="font-bold">Detalles del error (depuración)</h3>
                  </div>
                  <div className="text-xs text-red-700 dark:text-red-300 space-y-1">
                    <p><strong>DNI consultado:</strong> {debug.dniScanned}</p>
                    <p><strong>Hora de consulta:</strong> {debug.apiCallTime}</p>
                    <p><strong>Endpoint:</strong> {debug.errorDetails.method?.toUpperCase()} {debug.errorDetails.url}</p>
                    <p><strong>Status:</strong> {debug.errorDetails.status} {debug.errorDetails.statusText}</p>
                    <p><strong>Mensaje:</strong> {debug.errorDetails.message}</p>
                    {debug.errorDetails.data && (
                      <div>
                        <strong>Respuesta del servidor:</strong>
                        <pre className="mt-1 p-2 bg-red-100 dark:bg-red-900/40 rounded overflow-x-auto">
                          {JSON.stringify(debug.errorDetails.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
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
          
          {/* Estado de depuración API */}
          {debug.dniScanned && !loading && (
            <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center mb-2">
                <FaBug className="mr-2 text-gray-500" />
                <h3 className="font-medium text-gray-700 dark:text-gray-300">Última consulta</h3>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                <p><strong>DNI consultado:</strong> {debug.dniScanned}</p>
                <p><strong>Hora de consulta:</strong> {debug.apiCallTime}</p>
                {debug.apiResponse && (
                  <div className={`mt-1 p-2 rounded ${debug.apiResponse.success ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    <p><strong>Estado:</strong> {debug.apiResponse.success ? 'Éxito' : 'Error'}</p>
                    {debug.apiResponse.exists !== undefined && (
                      <p><strong>Paciente encontrado:</strong> {debug.apiResponse.exists ? 'Sí' : 'No'}</p>
                    )}
                    <p><strong>Hora de respuesta:</strong> {debug.apiResponse.time}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ScannerPage;