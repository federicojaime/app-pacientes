import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserPlus, FaSpinner, FaArrowLeft, FaCheck, FaIdCard, FaLock, FaInfoCircle } from 'react-icons/fa';
import PatientContext from '../contexts/PatientContext';
import patientService from '../services/patientService';
import ErrorHandler from '../components/ui/ErrorHandler';
// Importamos los estilos responsivos
import '../utils/responsive.css';

const RegisterPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setPatient } = useContext(PatientContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);
  const [fromDniScan, setFromDniScan] = useState(false);
  
  // Inicializar el formulario con los datos recibidos del escaneo del DNI si existen
  const [formData, setFormData] = useState({
    dni: location?.state?.dni || '',
    nombre: location?.state?.nombre || '',
    apellido: location?.state?.apellido || '',
    sexo: location?.state?.sexo || 'M',
    fecnac: location?.state?.fecnac || '',
    email: '',
    telefono: '',
    calle: '',
    numero: '',
    piso: '',
    departamento: '',
    ciudad: '',
    provincia: '',
    cpostal: '',
    peso: '',
    talla: '',
    idobrasocial: 'SIN OBRA SOCIAL'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Verificar si los datos vienen de un escaneo de DNI
    if (location?.state?.fromDniScan) {
      setFromDniScan(true);
    }
    
    // Validación del DNI
    if (formData.dni.length > 0 && !/^\d{7,8}$/.test(formData.dni)) {
      setErrors(prev => ({ ...prev, dni: 'El DNI debe tener entre 7 y 8 dígitos' }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.dni;
        return newErrors;
      });
    }
  }, [formData.dni, location?.state]);

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.dni) newErrors.dni = 'El DNI es obligatorio';
    if (!formData.nombre) newErrors.nombre = 'El nombre es obligatorio';
    if (!formData.apellido) newErrors.apellido = 'El apellido es obligatorio';
    if (!formData.fecnac) newErrors.fecnac = 'La fecha de nacimiento es obligatoria';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    
    if (formData.telefono && !/^\d{7,15}$/.test(formData.telefono)) {
      newErrors.telefono = 'El teléfono debe contener entre 7 y 15 dígitos';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      handleRegister();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleRegister = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await patientService.registerPatient(formData);
      
      if (result.success && result.patient) {
        setPatient(result.patient);
        navigate('/profile');
      } else {
        setError(new Error('No se pudo completar el registro. Por favor, inténtalo de nuevo.'));
      }
    } catch (error) {
      console.error('Error al registrar paciente:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRetry = () => {
    setError(null);
  };

  // Determinar si un campo debe estar bloqueado (solo lectura) por venir del escaneo del DNI
  const isFieldReadOnly = (fieldName) => {
    const fieldsFromDni = ['dni', 'nombre', 'apellido', 'sexo', 'fecnac'];
    return fromDniScan && fieldsFromDni.includes(fieldName);
  };

  // Renderizado de campo de formulario con estado de solo lectura cuando corresponda
  const renderFormField = (name, label, type = 'text', required = false, placeholder = '') => {
    const readOnly = isFieldReadOnly(name);
    
    return (
      <div>
        <label 
          htmlFor={name} 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center"
        >
          {label} {required && <span className="text-red-500 ml-1">*</span>}
          {readOnly && (
            <FaLock className="text-gray-400 dark:text-gray-500 ml-2 text-xs" title="Campo obtenido del DNI" />
          )}
        </label>
        <input
          type={type}
          id={name}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className={`w-full px-4 py-2 border ${
            errors[name] 
              ? 'border-red-300 dark:border-red-500' 
              : readOnly 
                ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800' 
                : 'border-gray-300 dark:border-gray-600'
          } rounded-lg focus:outline-none ${
            !readOnly && 'focus:ring-2 focus:ring-primary-500'
          } dark:bg-gray-700 dark:text-white ${
            readOnly && 'cursor-not-allowed text-gray-700 dark:text-gray-300'
          }`}
          placeholder={placeholder}
          readOnly={readOnly}
          disabled={readOnly}
        />
        {errors[name] && (
          <p className="mt-1 text-sm text-red-500">{errors[name]}</p>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto max-w-md mobile-full-width">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/50 rounded-full text-primary-600 dark:text-primary-400 mb-4">
          <FaUserPlus className="text-3xl" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Registro de Paciente
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Completa tus datos para acceder a nuestros servicios médicos
        </p>
      </motion.div>

      {fromDniScan && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-600 rounded-r-lg"
        >
          <div className="flex items-start gap-3">
            <FaInfoCircle className="mt-0.5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
            <div>
              <p className="text-blue-700 dark:text-blue-300 font-medium">Datos del DNI detectados</p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                Los campos con información obtenida del DNI no pueden modificarse.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {error && (
        <div className="mb-6">
          <ErrorHandler 
            error={error} 
            onRetry={handleRetry}
            message="Hubo un problema al procesar el registro."
          />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 md:p-8 mobile-compact"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {step === 1 ? 'Información Personal' : 'Información de Contacto'}
          </h2>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${step === 1 ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
            <span className={`w-3 h-3 rounded-full ${step === 2 ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
          </div>
        </div>

        {/* Paso 1: Información Personal */}
        {step === 1 && (
          <div className="space-y-4">
            {renderFormField('dni', 'DNI', 'text', true, 'Ingresa tu DNI')}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderFormField('nombre', 'Nombre', 'text', true, 'Ingresa tu nombre')}
              {renderFormField('apellido', 'Apellido', 'text', true, 'Ingresa tu apellido')}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="sexo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                  Sexo *
                  {isFieldReadOnly('sexo') && (
                    <FaLock className="text-gray-400 dark:text-gray-500 ml-2 text-xs" title="Campo obtenido del DNI" />
                  )}
                </label>
                <select
                  id="sexo"
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${
                    isFieldReadOnly('sexo') 
                      ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 cursor-not-allowed' 
                      : 'border-gray-300 dark:border-gray-600'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white`}
                  disabled={isFieldReadOnly('sexo')}
                >
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>
              
              {renderFormField('fecnac', 'Fecha de Nacimiento', 'date', true)}
            </div>
          </div>
        )}

        {/* Paso 2: Información de Contacto */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderFormField('email', 'Email', 'email', false, 'Ingresa tu email')}
              {renderFormField('telefono', 'Teléfono', 'tel', false, 'Ingresa tu teléfono')}
            </div>

            {renderFormField('calle', 'Calle', 'text', false, 'Ingresa tu calle')}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 input-group-mobile">
              {renderFormField('numero', 'Número', 'text', false, 'Nº')}
              {renderFormField('piso', 'Piso', 'text', false, 'Piso')}
              {renderFormField('departamento', 'Depto.', 'text', false, 'Depto.')}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 input-group-mobile">
              {renderFormField('ciudad', 'Ciudad', 'text', false, 'Ciudad')}
              {renderFormField('provincia', 'Provincia', 'text', false, 'Provincia')}
              {renderFormField('cpostal', 'Código Postal', 'text', false, 'CP')}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderFormField('peso', 'Peso (kg)', 'number', false, 'Peso en kg')}
              {renderFormField('talla', 'Talla (cm)', 'number', false, 'Talla en cm')}
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2 btn-mobile-lg"
              disabled={loading}
            >
              <FaArrowLeft /> Atrás
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2 btn-mobile-lg"
              disabled={loading}
            >
              <FaArrowLeft /> Cancelar
            </button>
          )}
          
          <button
            type="button"
            onClick={nextStep}
            className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2 btn-mobile-lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" /> Procesando...
              </>
            ) : (
              <>
                {step === 1 ? 'Siguiente' : 'Registrarse'} {step === 1 ? null : <FaCheck />}
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;