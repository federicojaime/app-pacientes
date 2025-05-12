import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaIdCard, FaSpinner, FaInfoCircle, FaQrcode, FaExclamationTriangle, FaNetworkWired } from 'react-icons/fa';
import DniScanner from '../components/scanner/DniScanner';
import patientService from '../services/patientService';
import PatientContext from '../contexts/PatientContext';
import ErrorHandler from '../components/ui/ErrorHandler';
import '../utils/responsive.css';

const ScannerPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState({ checked: false, online: false });
  const { setPatient } = useContext(PatientContext);
  const navigate = useNavigate();
  const [scanData, setScanData] = useState(null);

  // Verificar si la API está en línea cuando la página se carga
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        // Hacemos una petición simple para verificar la conexión con el servidor
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'https://app-pacientes-server-production.up.railway.app/api'}/patients/check/00000000`,
          { signal: controller.signal }
        );

        clearTimeout(timeoutId);
        setApiStatus({ checked: true, online: response.ok || response.status === 404 });
      } catch (err) {
        console.error('Error al verificar estado de la API:', err);
        setApiStatus({ checked: true, online: false });
      }
    };

    checkApiStatus();
  }, []);

  // Función para formatear la fecha del DNI (DD/MM/YYYY) a formato ISO (YYYY-MM-DD)
  const formatDateToISO = (dateString) => {
    if (!dateString || dateString === 'No disponible') return '';

    const parts = dateString.split('/');
    if (parts.length !== 3) return '';

    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const handleDniScanned = async (dni, dniScanData) => {
    setLoading(true);
    setError(null);
    setScanData(dniScanData);

    try {
      // Notificación simple sin detalles técnicos
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 p-4 bg-green-500 text-white rounded-lg shadow-lg z-50 max-w-xs animate-fadeIn';
      notification.innerHTML = `
        <div class="flex items-start gap-2">
          <div class="mt-0.5"><svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg></div>
          <div>
            <p class="font-bold">DNI escaneado: ${dni}</p>
            <p class="text-sm mt-1">Verificando en el sistema...</p>
          </div>
        </div>
      `;
      document.body.appendChild(notification);

      // Remover la notificación después de 3 segundos
      setTimeout(() => {
        if (document.body.contains(notification)) {
          notification.classList.add('animate-fadeOut');
          setTimeout(() => {
            if (document.body.contains(notification)) {
              document.body.removeChild(notification);
            }
          }, 300);
        }
      }, 3000);

      // Consultar la API
      const result = await patientService.checkPatientByDni(dni);

      if (result.exists && result.patient) {
        // Si el paciente existe, guardamos sus datos y redirigimos al perfil
        setPatient(result.patient);
        navigate('/profile');
      } else {
        // Si el paciente no existe, redirigimos al registro con todos los datos escaneados
        const formattedData = {
          dni: dniScanData.dni,
          nombre: dniScanData.nombre,
          apellido: dniScanData.apellido,
          sexo: dniScanData.genero,
          fecnac: formatDateToISO(dniScanData.fechaNac),
          // Los campos a continuación quedarán vacíos para que el usuario los complete
          fromDniScan: true // Marcamos que los datos vienen del escaneo
        };

        navigate('/register', { state: formattedData });
      }
    } catch (error) {
      console.error('Error al verificar el DNI:', error);
      setError(error);

      // Mostrar una notificación de error
      const errorNotification = document.createElement('div');
      errorNotification.className = 'fixed top-4 right-4 p-4 bg-red-500 text-white rounded-lg shadow-lg z-50 max-w-xs animate-fadeIn';
      errorNotification.innerHTML = `
        <div class="flex items-start gap-2">
          <div class="mt-0.5"><svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg></div>
          <div>
            <p class="font-bold">Error de verificación</p>
            <p class="text-sm mt-1">${error.message || 'No se pudo verificar el DNI. Intenta nuevamente.'}</p>
          </div>
        </div>
      `;
      document.body.appendChild(errorNotification);

      // Remover la notificación de error después de 5 segundos
      setTimeout(() => {
        if (document.body.contains(errorNotification)) {
          errorNotification.classList.add('animate-fadeOut');
          setTimeout(() => {
            if (document.body.contains(errorNotification)) {
              document.body.removeChild(errorNotification);
            }
          }, 300);
        }
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  const retryApiConnection = async () => {
    setApiStatus({ checked: false, online: false });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'https://app-pacientes-server-production.up.railway.app/api'}/patients/check/00000000`,
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);
      setApiStatus({ checked: true, online: response.ok || response.status === 404 });

      if (response.ok || response.status === 404) {
        // Si la API está en línea nuevamente, eliminamos cualquier error previo
        setError(null);
      }
    } catch (err) {
      console.error('Error al reintentar conexión con la API:', err);
      setApiStatus({ checked: true, online: false });

      // Establecer un mensaje de error específico para problemas de conexión
      setError(new Error('No se pudo conectar con el servidor. Verifica tu conexión a internet.'));
    }
  };

  const handleRetry = () => {
    if (!apiStatus.online) {
      retryApiConnection();
    } else {
      setError(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-md w-full">
      {/* Cabecera mejorada */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        {/* Ícono del DNI en círculo con sombra */}
        <div className="relative inline-block mb-4">
          <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-full shadow-lg transform -translate-y-1 scale-105 z-0"></div>
          <div className="relative z-10 w-20 h-20 bg-white dark:bg-gray-800 rounded-full border border-gray-100 dark:border-gray-700 flex items-center justify-center shadow-inner">
            <FaIdCard className="text-3xl text-primary-600 dark:text-primary-400" />
          </div>
        </div>

        {/* Título responsive */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Verificación de identidad
        </h1>

        {/* Subtítulo responsive 
        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-md mx-auto">
          Escanea el código PDF417 del reverso de tu DNI para acceder a tus datos médicos
        </p>*/}
      </motion.div>

      {/* Estado de conexión con la API */}
      {!apiStatus.online && apiStatus.checked && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800/60 rounded-xl shadow-lg shadow-red-500/5 dark:shadow-red-800/5"
        >
          <div className="flex items-start gap-3">
            <div className="bg-red-100 dark:bg-red-800/30 p-2 rounded-full flex-shrink-0 shadow-sm">
              <FaNetworkWired className="text-red-500 dark:text-red-400 text-lg" />
            </div>
            <div>
              <h3 className="font-semibold text-red-700 dark:text-red-300 mb-2 text-base">Problema de conexión</h3>
              <p className="text-red-600 dark:text-red-300 text-xs sm:text-sm mb-2">
                No se pudo conectar con el servidor. Esto puede deberse a:
              </p>
              <ul className="text-xs sm:text-sm text-red-600 dark:text-red-300 space-y-1 list-disc list-inside mb-3">
                <li>Problemas de conexión a internet</li>
                <li>El servidor puede estar temporalmente inaccesible</li>
              </ul>
              <button
                onClick={retryApiConnection}
                className="px-4 py-2 bg-red-100 dark:bg-red-800/50 text-red-700 dark:text-red-300 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-800/70 transition-colors shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:ring-opacity-50"
              >
                Reintentar conexión
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Instrucciones de escaneo mejoradas para móvil 
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/60 rounded-xl shadow-md"
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:gap-3 gap-4">
          <div>
            <h3 className="font-semibold text-blue-800 dark:text-blue-300 text-lg mb-2 text-center sm:text-center">
              Cómo escanear tu DNI
            </h3>
            <ol className="space-y-4">
              <li className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-200 dark:bg-blue-700 flex items-center justify-center text-blue-800 dark:text-blue-200 font-semibold text-xs">
                  1
                </div>
                <span className="text-blue-800 dark:text-blue-300 text-sm text-center sm:text-left">
                  Utiliza la parte trasera de tu DNI
                </span>
              </li>
              <li className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-200 dark:bg-blue-700 flex items-center justify-center text-blue-800 dark:text-blue-200 font-semibold text-xs">
                  2
                </div>
                <span className="text-blue-800 dark:text-blue-300 text-sm text-center sm:text-left">
                  Asegúrate de que el código quede dentro del recuadro
                </span>
              </li>
              <li className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-200 dark:bg-blue-700 flex items-center justify-center text-blue-800 dark:text-blue-200 font-semibold text-xs">
                  3
                </div>
                <span className="text-blue-800 dark:text-blue-300 text-sm text-center sm:text-left">
                  Mantén el DNI a unos 15–20 cm de la cámara
                </span>
              </li>
              <li className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-200 dark:bg-blue-700 flex items-center justify-center text-blue-800 dark:text-blue-200 font-semibold text-xs">
                  4
                </div>
                <span className="text-blue-800 dark:text-blue-300 text-sm text-center sm:text-left">
                  Asegúrate de tener buena iluminación
                </span>
              </li>
            </ol>
          </div>
        </div>
      </motion.div>
*/}
      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl border-2 border-gray-100 dark:border-gray-800"
        >
          <div className="w-14 h-14 bg-primary-500/10 rounded-full flex items-center justify-center shadow-md mb-4">
            <FaSpinner className="text-3xl text-primary-500 animate-spin" />
          </div>
          <p className="text-gray-800 dark:text-gray-200 font-medium text-base">Verificando tu identidad...</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Estamos consultando tus datos en el sistema</p>
        </motion.div>
      ) : (
        <>
          {error && (
            <div className="mb-6">
              <ErrorHandler
                error={error}
                onRetry={handleRetry}
                message={
                  !apiStatus.online
                    ? "No hay conexión con el servidor. Por favor, verifica tu conexión a internet e intenta nuevamente."
                    : "Hubo un problema al verificar el DNI. Por favor, inténtalo de nuevo."
                }
              />
            </div>
          )}
          {(apiStatus.online || !apiStatus.checked) && (
            <div className="mb-6 border-2 border-blue-300 dark:border-blue-700 rounded-xl overflow-hidden shadow-xl">
              <DniScanner onDniScanned={handleDniScanned} />
            </div>
          )}
        </>
      )}

      {/* Agregamos CSS para animaciones de fade */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-10px); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-fadeOut {
          animation: fadeOut 0.3s ease-in forwards;
        }
        
        /* Estilos responsivos adicionales */
        @media (max-width: 640px) {
          .container {
            padding-left: 12px;
            padding-right: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default ScannerPage;