import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaIdCard, FaSpinner, FaInfoCircle, FaQrcode, FaExclamationTriangle, FaNetworkWired, FaSync } from 'react-icons/fa';
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

  // Función para mostrar notificaciones
  const showNotification = (message, type = 'success', details = null) => {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'warning' ? 'bg-yellow-500' : 'bg-red-500';
    const icon = type === 'success' ?
      '<svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>' :
      type === 'warning' ?
        '<svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>' :
        '<svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>';

    notification.className = `fixed top-4 right-4 p-4 ${bgColor} text-white rounded-lg shadow-lg z-50 max-w-xs animate-fadeIn`;
    notification.innerHTML = `
      <div class="flex items-start gap-2">
        <div class="mt-0.5">${icon}</div>
        <div>
          <p class="font-bold">${message}</p>
          ${details ? `<p class="text-sm mt-1">${details}</p>` : ''}
        </div>
      </div>
    `;
    document.body.appendChild(notification);

    // Remover la notificación después del tiempo especificado
    const duration = type === 'error' ? 5000 : 3000;
    setTimeout(() => {
      if (document.body.contains(notification)) {
        notification.classList.add('animate-fadeOut');
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 300);
      }
    }, duration);
  };

  // REEMPLAZAR esta función en src/pages/ScannerPage.jsx

  const handleDniScanned = async (dni, dniScanData) => {
    setLoading(true);
    setError(null);
    setScanData(dniScanData);
    console.log('🔍 DNI escaneado:', dni);
    console.log('📄 Datos del escaneo:', dniScanData);

    try {
      // Notificación inicial
      showNotification(`DNI escaneado: ${dni}`, 'success', 'Verificando en el sistema...');

      // Consultar la API con los datos del escaneo
      const result = await patientService.checkPatientByDni(dni, dniScanData);

      console.log('📊 Resultado de la verificación:', result);

      if (result.exists && result.patient) {
        // Verificar si se actualizaron los datos automáticamente
        if (result.updated) {
          showNotification(
            'Datos actualizados automáticamente',
            'warning',
            'Se actualizó tu información con los datos del DNI escaneado'
          );

          console.log('✅ Paciente actualizado automáticamente:', result.patient);

          // Pequeña pausa para mostrar el mensaje
          setTimeout(() => {
            showNotification(
              'Información sincronizada',
              'success',
              'Tu perfil ahora tiene los datos más recientes'
            );
          }, 2000);
        } else {
          showNotification(
            'Paciente encontrado',
            'success',
            'Accediendo a tu perfil...'
          );
        }

        // Guardar el paciente y redirigir al perfil
        setPatient(result.patient);

        // Pausa para que vea las notificaciones
        setTimeout(() => {
          navigate('/profile');
        }, result.updated ? 3000 : 1500);

      } else {
        // Si no existe, ir a registro
        const formattedData = {
          dni: dni,
          nombre: dniScanData?.nombre || '',
          apellido: dniScanData?.apellido || '',
          sexo: dniScanData?.genero || 'M',
          fecnac: formatDateToISO(dniScanData?.fechaNac || ''),
          fromDniScan: true
        };

        showNotification(
          'Paciente no registrado',
          'warning',
          'Redirigiendo al formulario de registro...'
        );

        setTimeout(() => {
          navigate('/register', { state: formattedData });
        }, 1500);
      }
    } catch (error) {
      console.error('❌ Error al verificar el DNI:', error);
      setError(error);

      showNotification(
        'Error de verificación',
        'error',
        error.message || 'No se pudo verificar el DNI. Intenta nuevamente.'
      );
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
        showNotification('Conexión restablecida', 'success', 'El servidor está disponible nuevamente');
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

        {/* Información sobre actualización automática */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/60 rounded-xl"
        >
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 dark:bg-blue-800/30 p-2 rounded-full flex-shrink-0">
              <FaSync className="text-blue-500 dark:text-blue-400 text-sm" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-blue-800 dark:text-blue-300 text-sm mb-1">
                Actualización automática
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-xs">
                Si ya estás registrado, tus datos se actualizarán automáticamente con la información del DNI escaneado.
              </p>
            </div>
          </div>
        </motion.div>
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