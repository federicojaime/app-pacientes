import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserPlus, FaSpinner, FaArrowLeft, FaCheck } from 'react-icons/fa';
import PatientContext from '../contexts/PatientContext';
import patientService from '../services/patientService';
import ErrorHandler from '../components/ui/ErrorHandler';

const RegisterPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setPatient } = useContext(PatientContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    dni: location?.state?.dni || '',
    nombre: '',
    apellido: '',
    sexo: 'M',
    fecnac: '',
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
  }, [formData.dni]);

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

  return (
    <div className="container mx-auto max-w-md">
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
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 md:p-8"
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
            <div>
              <label htmlFor="dni" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                DNI *
              </label>
              <input
                type="text"
                id="dni"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${errors.dni ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white`}
                placeholder="Ingresa tu DNI"
                disabled={location?.state?.dni}
              />
              {errors.dni && (
                <p className="mt-1 text-sm text-red-500">{errors.dni}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${errors.nombre ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white`}
                  placeholder="Ingresa tu nombre"
                />
                {errors.nombre && (
                  <p className="mt-1 text-sm text-red-500">{errors.nombre}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Apellido *
                </label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${errors.apellido ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white`}
                  placeholder="Ingresa tu apellido"
                />
                {errors.apellido && (
                  <p className="mt-1 text-sm text-red-500">{errors.apellido}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="sexo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sexo *
                </label>
                <select
                  id="sexo"
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="fecnac" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fecha de Nacimiento *
                </label>
                <input
                  type="date"
                  id="fecnac"
                  name="fecnac"
                  value={formData.fecnac}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${errors.fecnac ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white`}
                />
                {errors.fecnac && (
                  <p className="mt-1 text-sm text-red-500">{errors.fecnac}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Paso 2: Información de Contacto */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${errors.email ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white`}
                  placeholder="Ingresa tu email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${errors.telefono ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white`}
                  placeholder="Ingresa tu teléfono"
                />
                {errors.telefono && (
                  <p className="mt-1 text-sm text-red-500">{errors.telefono}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="calle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Calle
              </label>
              <input
                type="text"
                id="calle"
                name="calle"
                value={formData.calle}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="Ingresa tu calle"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="numero" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Número
                </label>
                <input
                  type="text"
                  id="numero"
                  name="numero"
                  value={formData.numero}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Nº"
                />
              </div>
              
              <div>
                <label htmlFor="piso" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Piso
                </label>
                <input
                  type="text"
                  id="piso"
                  name="piso"
                  value={formData.piso}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Piso"
                />
              </div>
              
              <div>
                <label htmlFor="departamento" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Depto.
                </label>
                <input
                  type="text"
                  id="departamento"
                  name="departamento"
                  value={formData.departamento}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Depto."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ciudad
                </label>
                <input
                  type="text"
                  id="ciudad"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Ciudad"
                />
              </div>
              
              <div>
                <label htmlFor="provincia" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Provincia
                </label>
                <input
                  type="text"
                  id="provincia"
                  name="provincia"
                  value={formData.provincia}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Provincia"
                />
              </div>
              
              <div>
                <label htmlFor="cpostal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Código Postal
                </label>
                <input
                  type="text"
                  id="cpostal"
                  name="cpostal"
                  value={formData.cpostal}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="CP"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="peso" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  id="peso"
                  name="peso"
                  value={formData.peso}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Peso en kg"
                />
              </div>
              
              <div>
                <label htmlFor="talla" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Talla (cm)
                </label>
                <input
                  type="number"
                  id="talla"
                  name="talla"
                  value={formData.talla}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Talla en cm"
                />
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2"
              disabled={loading}
            >
              <FaArrowLeft /> Atrás
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2"
              disabled={loading}
            >
              <FaArrowLeft /> Cancelar
            </button>
          )}
          
          <button
            type="button"
            onClick={nextStep}
            className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
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