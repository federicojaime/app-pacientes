import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaRedo, FaAngleDown, FaAngleUp, FaBug } from 'react-icons/fa';

const ErrorHandler = ({ error, onRetry, message }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  // Determinar mensaje de error apropiado
  const getErrorMessage = () => {
    if (message) return message;
    
    if (error?.response) {
      // Error de respuesta del servidor
      switch (error.response.status) {
        case 404:
          return 'No se encontró el recurso solicitado.';
        case 401:
          return 'No tienes autorización para acceder a este recurso.';
        case 403:
          return 'Acceso denegado.';
        case 500:
          return 'Error interno del servidor. Por favor, inténtalo más tarde.';
        default:
          return error.response.data?.error || 'Ocurrió un error en la solicitud.';
      }
    } else if (error?.request) {
      // No se recibió respuesta
      return 'No se pudo conectar con el servidor. Comprueba tu conexión a internet.';
    } else {
      // Error de configuración
      return 'Ocurrió un error al procesar la solicitud.';
    }
  };
  
  // Extraer información detallada del error para depuración
  const getDetailedErrorInfo = () => {
    const details = {
      mensaje: error?.message || 'Sin mensaje de error',
      tipo: error?.name || 'Error desconocido',
      tiempo: new Date().toLocaleTimeString(),
    };
    
    if (error?.config) {
      details.peticion = {
        url: error.config.url,
        metodo: error.config.method?.toUpperCase(),
        baseURL: error.config.baseURL,
        timeout: error.config.timeout
      };
    }
    
    if (error?.response) {
      details.respuesta = {
        estado: error.response.status,
        texto: error.response.statusText,
        datos: error.response.data,
        headers: error.response.headers
      };
    }
    
    return details;
  };
  
  // Obtener detalles del error para mostrar
  const errorDetails = getDetailedErrorInfo();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex-shrink-0">
          <FaExclamationTriangle className="text-xl" />
        </div>
        <div className="flex-1">
          <p className="font-medium">{getErrorMessage()}</p>
          {error?.response?.data?.details && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-300">
              {error.response.data.details}
            </p>
          )}
        </div>
      </div>
      
      <div className="mt-3 flex justify-between items-center">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-red-100 dark:bg-red-800/30 hover:bg-red-200 dark:hover:bg-red-800/50 text-red-700 dark:text-red-300 rounded-lg transition-colors"
          >
            <FaRedo className="text-xs" />
            Reintentar
          </button>
        )}
        
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800/20 rounded-lg transition-colors"
        >
          <FaBug className="text-xs" />
          {showDetails ? "Ocultar detalles" : "Ver detalles"}
          {showDetails ? <FaAngleUp className="text-xs" /> : <FaAngleDown className="text-xs" />}
        </button>
      </div>
      
      {/* Panel de depuración detallada */}
      {showDetails && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="mt-3 bg-white dark:bg-red-900/30 rounded-lg p-3 text-xs overflow-hidden"
        >
          <h4 className="font-bold text-red-700 dark:text-red-300 mb-2">Información detallada del error</h4>
          
          <div className="space-y-3">
            <div>
              <p className="font-semibold mb-1">Información básica:</p>
              <ul className="space-y-1 text-red-600 dark:text-red-400">
                <li><strong>Mensaje:</strong> {errorDetails.mensaje}</li>
                <li><strong>Tipo:</strong> {errorDetails.tipo}</li>
                <li><strong>Hora:</strong> {errorDetails.tiempo}</li>
              </ul>
            </div>
            
            {errorDetails.peticion && (
              <div>
                <p className="font-semibold mb-1">Detalles de la petición:</p>
                <ul className="space-y-1 text-red-600 dark:text-red-400">
                  <li><strong>URL:</strong> {errorDetails.peticion.baseURL}{errorDetails.peticion.url}</li>
                  <li><strong>Método:</strong> {errorDetails.peticion.metodo}</li>
                  <li><strong>Timeout:</strong> {errorDetails.peticion.timeout}ms</li>
                </ul>
              </div>
            )}
            
            {errorDetails.respuesta && (
              <div>
                <p className="font-semibold mb-1">Detalles de la respuesta:</p>
                <ul className="space-y-1 text-red-600 dark:text-red-400">
                  <li><strong>Código:</strong> {errorDetails.respuesta.estado} ({errorDetails.respuesta.texto})</li>
                  {errorDetails.respuesta.datos && (
                    <li>
                      <strong>Datos de respuesta:</strong>
                      <pre className="mt-1 p-2 bg-red-50 dark:bg-red-900/20 rounded overflow-x-auto whitespace-pre-wrap break-all">
                        {JSON.stringify(errorDetails.respuesta.datos, null, 2)}
                      </pre>
                    </li>
                  )}
                </ul>
              </div>
            )}
            
            {!errorDetails.respuesta && error?.request && (
              <div>
                <p className="font-semibold text-red-700 dark:text-red-300">No se recibió respuesta del servidor.</p>
                <p className="text-red-600 dark:text-red-400">
                  Esto generalmente indica un problema de conexión o que el servidor no está respondiendo.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ErrorHandler;