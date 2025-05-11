import React from 'react';
import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaRedo } from 'react-icons/fa';

const ErrorHandler = ({ error, onRetry, message }) => {
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
      
      {onRetry && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={onRetry}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-red-100 dark:bg-red-800/30 hover:bg-red-200 dark:hover:bg-red-800/50 text-red-700 dark:text-red-300 rounded-lg transition-colors"
          >
            <FaRedo className="text-xs" />
            Reintentar
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default ErrorHandler;