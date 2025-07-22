import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaSearch, FaPrescriptionBottle, FaQrcode, FaKeyboard,
  FaInfoCircle, FaArrowRight, FaSpinner
} from 'react-icons/fa';

const MedicationSearchPage = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!trackingNumber.trim()) {
      alert('Por favor, ingresa un número de seguimiento válido');
      return;
    }

    setIsSearching(true);
    
    // Simular búsqueda
    setTimeout(() => {
      setIsSearching(false);
      navigate(`/medication-tracking/${trackingNumber.trim()}`);
    }, 1000);
  };

  const handleQuickAccess = (sampleNumber) => {
    setTrackingNumber(sampleNumber);
    setTimeout(() => {
      navigate(`/medication-tracking/${sampleNumber}`);
    }, 500);
  };

  const sampleNumbers = [
    { number: "MAC-2025-001", description: "Medicamento Oncológico - En Adjudicación" },
    { number: "MAC-2025-002", description: "Tratamiento Cardiovascular - Entregado" },
    { number: "MAC-2025-003", description: "Terapia Biológica - En Cotización" }
  ];

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 dark:bg-primary-900/50 rounded-full text-primary-600 dark:text-primary-400 mb-6">
          <FaPrescriptionBottle className="text-3xl" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Seguimiento de Medicamentos
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Consulta el estado de tu medicamento de alto costo
        </p>
      </motion.div>

      {/* Search Form */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <FaSearch className="text-primary-500" />
          Buscar por Número de Seguimiento
        </h2>
        
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label htmlFor="trackingNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Número de Seguimiento
            </label>
            <div className="relative">
              <input
                type="text"
                id="trackingNumber"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-lg"
                placeholder="Ej: MAC-2025-001"
                disabled={isSearching}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <FaKeyboard className="text-gray-400" />
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isSearching || !trackingNumber.trim()}
            className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-lg shadow-lg"
          >
            {isSearching ? (
              <>
                <FaSpinner className="animate-spin" />
                Buscando...
              </>
            ) : (
              <>
                <FaSearch />
                Buscar Medicamento
                <FaArrowRight />
              </>
            )}
          </button>
        </form>

        {/* QR Scanner Option */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            className="w-full py-3 border-2 border-primary-500 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            onClick={() => alert('Función de escaneo QR próximamente disponible')}
          >
            <FaQrcode />
            Escanear Código QR
          </button>
        </div>
      </motion.div>

      {/* Quick Access Examples */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <FaInfoCircle className="text-blue-500" />
          Ejemplos de Seguimiento
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
          Puedes probar con estos números de seguimiento de ejemplo:
        </p>
        
        <div className="space-y-3">
          {sampleNumbers.map((sample, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleQuickAccess(sample.number)}
              className="w-full p-4 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono font-semibold text-primary-600 dark:text-primary-400">
                    {sample.number}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {sample.description}
                  </p>
                </div>
                <FaArrowRight className="text-gray-400" />
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Information Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-800/50 rounded-full flex items-center justify-center">
            <FaInfoCircle className="text-blue-600 dark:text-blue-400 text-xl" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
              ¿Cómo funciona el seguimiento?
            </h4>
            <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
              <li>• Ingresa tu número de seguimiento en el campo superior</li>
              <li>• El sistema consultará el estado actual de tu medicamento</li>
              <li>• Verás un timeline detallado del proceso completo</li>
              <li>• Recibirás información sobre fechas y próximos pasos</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Contact Information */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-8 text-center"
      >
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          ¿Necesitas ayuda? Contacta al Consejo de Médicos
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-3 text-sm">
          <a 
            href="tel:+5435142250044" 
            className="text-primary-600 dark:text-primary-400 hover:underline"
          >
            📞 +54 351 4225004
          </a>
          <a 
            href="mailto:consejomedico@cmpc.org.ar" 
            className="text-primary-600 dark:text-primary-400 hover:underline"
          >
            ✉️ consejomedico@cmpc.org.ar
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default MedicationSearchPage;