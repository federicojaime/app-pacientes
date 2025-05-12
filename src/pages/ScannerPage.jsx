import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaIdCard, FaQrcode, FaSpinner, FaInfoCircle, FaSearch, FaExclamationTriangle, FaNetworkWired, FaCamera, FaKeyboard } from 'react-icons/fa';
import DniScanner from '../components/scanner/DniScanner';
import patientService from '../services/patientService';
import PatientContext from '../contexts/PatientContext';
import ErrorHandler from '../components/ui/ErrorHandler';
// Importamos la imagen de muestra
import DniSampleImg from '../assets/images/dni.png';

const ScannerPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState({ checked: false, online: false });
  const { setPatient } = useContext(PatientContext);
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);

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
      setScanning(false);
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

  const enterDniManually = () => {
    const dni = prompt("Ingresa el número de DNI:");
    if (dni && /^\d{7,8}$/.test(dni)) {
      handleDniScanned(dni, {
        dni: dni,
        apellido: 'No disponible',
        nombre: 'No disponible',
        genero: 'No disponible',
        fechaNac: 'No disponible'
      });
    } else if (dni) {
      alert("El DNI debe tener entre 7 y 8 dígitos");
    }
  };

  // Estilos específicos para mejorar el aspecto en pantallas pequeñas
  const containerStyles = {
    maxWidth: '100%',
    padding: '0.5rem 1rem 5rem 1rem',  // Añadido padding inferior para evitar que los botones se oculten
    margin: '0 auto',
    boxSizing: 'border-box'
  };

  const cardStyles = {
    borderRadius: '0.75rem',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'white',
    marginBottom: '1.5rem'
  };

  const imageContainerStyles = {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#f3f4f6'
  };

  const imageStyles = {
    maxWidth: '100%',
    height: 'auto',
    maxHeight: '280px',
    objectFit: 'contain',
    borderRadius: '0.5rem'
  };

  const instructionStyles = {
    padding: '1rem',
    textAlign: 'center',
    color: '#6b7280'
  };

  const buttonContainerStyles = {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    backgroundColor: '#f9fafb',
    borderTop: '1px solid #e5e7eb'
  };

  const primaryButtonStyles = {
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: '600',
    fontSize: '0.9375rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    cursor: 'pointer'
  };

  const secondaryButtonStyles = {
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: 'white',
    color: '#2563eb',
    border: '1px solid #2563eb',
    borderRadius: '0.5rem',
    fontWeight: '500',
    fontSize: '0.9375rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    cursor: 'pointer'
  };

  // Estilos específicos para el contenedor de instrucciones
  const instructionsContainerStyles = {
    marginBottom: '1rem',
    padding: '1rem',
    backgroundColor: '#edf3ff',
    borderRadius: '0.75rem',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
  };

  const instructionTitleStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#2563eb',
    fontWeight: '600',
    marginBottom: '0.75rem',
    fontSize: '1.125rem'
  };

  const stepStyles = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    marginBottom: '0.75rem'
  };

  const stepNumberStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '1.75rem',
    height: '1.75rem',
    backgroundColor: 'white',
    color: '#2563eb',
    borderRadius: '50%',
    fontWeight: '600',
    fontSize: '0.875rem',
    flexShrink: 0
  };

  const stepTextStyles = {
    color: '#3b82f6',
    fontSize: '0.9375rem',
    lineHeight: '1.4'
  };

  return (
    <div style={containerStyles}>
      {/* Estado de conexión con la API */}
      {!apiStatus.online && apiStatus.checked && (
        <div style={{
          marginBottom: '1rem',
          padding: '1rem',
          backgroundColor: '#fee2e2',
          borderRadius: '0.75rem',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <div style={{ 
              backgroundColor: '#fecaca', 
              padding: '0.75rem', 
              borderRadius: '50%',
              flexShrink: 0 
            }}>
              <FaNetworkWired style={{ color: '#ef4444', fontSize: '1.25rem' }} />
            </div>
            <div>
              <h3 style={{ fontWeight: '600', color: '#b91c1c', marginBottom: '0.5rem', fontSize: '1rem' }}>
                Problema de conexión
              </h3>
              <p style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                No se pudo conectar con el servidor. Esto puede deberse a:
              </p>
              <ul style={{ fontSize: '0.875rem', color: '#ef4444', marginLeft: '1.25rem', marginBottom: '0.75rem', listStyleType: 'disc' }}>
                <li>Problemas de conexión a internet</li>
                <li>El servidor puede estar temporalmente inaccesible</li>
              </ul>
              <button
                onClick={retryApiConnection}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#fecaca',
                  color: '#b91c1c',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Reintentar conexión
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instrucciones de escaneo */}
      <div style={instructionsContainerStyles}>
        <div style={instructionTitleStyles}>
          <FaInfoCircle /> <span>Cómo escanear tu DNI</span>
        </div>
        <div>
          <div style={stepStyles}>
            <div style={stepNumberStyles}>1</div>
            <div style={stepTextStyles}>Utiliza la parte trasera de tu DNI</div>
          </div>
          <div style={stepStyles}>
            <div style={stepNumberStyles}>2</div>
            <div style={stepTextStyles}>Asegúrate de que el código PDF417 quede dentro del recuadro</div>
          </div>
          <div style={stepStyles}>
            <div style={stepNumberStyles}>3</div>
            <div style={stepTextStyles}>Mantén el DNI a unos 15-20 cm de la cámara</div>
          </div>
          <div style={stepStyles}>
            <div style={stepNumberStyles}>4</div>
            <div style={stepTextStyles}>Asegúrate de tener buena iluminación</div>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{
          ...cardStyles,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1rem'
        }}>
          <div style={{
            width: '4rem',
            height: '4rem',
            borderRadius: '50%',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <FaSpinner style={{
              fontSize: '2rem',
              color: '#2563eb',
              animation: 'spin 1s linear infinite'
            }} />
          </div>
          <p style={{ fontWeight: '500', fontSize: '1.125rem', color: '#1f2937', marginBottom: '0.5rem' }}>
            Verificando tu identidad...
          </p>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Estamos consultando tus datos en el sistema
          </p>
        </div>
      ) : (
        <>
          {error && (
            <div style={{ marginBottom: '1rem' }}>
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
            <>
              {scanning ? (
                <div style={{
                  ...cardStyles,
                  height: '350px',
                  position: 'relative',
                  marginBottom: '1rem'
                }}>
                  <DniScanner onDniScanned={handleDniScanned} />
                </div>
              ) : (
                <div style={cardStyles}>
                  <div style={imageContainerStyles}>
                    <img src={DniSampleImg} alt="Ejemplo de DNI" style={imageStyles} />
                  </div>
                  
                  <div style={instructionStyles}>
                    Presiona el botón para activar la cámara
                  </div>
                  
                  <div style={buttonContainerStyles}>
                    <button 
                      onClick={() => setScanning(true)} 
                      style={primaryButtonStyles}
                    >
                      <FaCamera style={{ fontSize: '1rem' }} /> Iniciar cámara
                    </button>
                    
                    <button 
                      onClick={enterDniManually} 
                      style={secondaryButtonStyles}
                    >
                      <FaKeyboard style={{ fontSize: '1rem' }} /> Ingresar DNI manualmente
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ScannerPage;