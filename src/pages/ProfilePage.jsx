import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaIdCard, FaCheck, FaSpinner } from 'react-icons/fa';
import PatientContext from '../contexts/PatientContext';
import PatientProfile from '../components/patient/PatientProfile';
import patientService from '../services/patientService';
import ErrorHandler from '../components/ui/ErrorHandler';

const ProfilePage = () => {
  const { patient, setPatient } = useContext(PatientContext);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Si no hay paciente, redirigimos al escáner
  if (!patient) {
    navigate('/scan');
    return null;
  }

  const handleSavePatient = async (updatedPatient) => {
    setLoading(true);
    setSuccess(false);
    setError(null);
    
    try {
      const result = await patientService.updatePatient(patient.id, updatedPatient);
      
      if (result.success) {
        setPatient(result.patient);
        setSuccess(true);
        
        // Ocultar el mensaje de éxito después de unos segundos
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        setError(new Error('No se pudo actualizar la información. Por favor, inténtalo de nuevo.'));
      }
    } catch (error) {
      console.error('Error al actualizar el paciente:', error);
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
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/50 rounded-full text-primary-600 dark:text-primary-400 mb-4">
          <FaIdCard className="text-3xl" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Mi Perfil Médico
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Aquí puedes ver y actualizar tu información personal y médica
        </p>
      </motion.div>

      {loading && (
        <div className="fixed inset-0 bg-black/20 dark:bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg flex items-center gap-4">
            <FaSpinner className="text-2xl text-primary-500 animate-spin" />
            <p className="text-gray-700 dark:text-gray-200 font-medium">Actualizando datos...</p>
          </div>
        </div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3 text-green-600 dark:text-green-400"
        >
          <FaCheck className="text-lg flex-shrink-0" />
          <p>Tus datos se han actualizado correctamente</p>
        </motion.div>
      )}

      {error && (
        <div className="mb-6">
          <ErrorHandler 
            error={error} 
            onRetry={handleRetry}
            message="Hubo un problema al actualizar tus datos."
          />
        </div>
      )}

      <PatientProfile patient={patient} onSave={handleSavePatient} />
    </div>
  );
};

export default ProfilePage;