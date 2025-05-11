import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaIdCard,FaInfoCircle, FaMapMarkerAlt, FaPhone, FaEnvelope, FaPencilAlt, FaSave, FaTimes, FaWeight, FaRulerVertical, FaHospital } from 'react-icons/fa';

const PatientProfile = ({ patient, onSave }) => {
  const [editableFields, setEditableFields] = useState({
    email: patient?.email || '',
    telefono: patient?.telefono || '',
    calle: patient?.calle || '',
    numero: patient?.numero || '',
    piso: patient?.piso || '',
    departamento: patient?.departamento || '',
    ciudad: patient?.ciudad || '',
    provincia: patient?.provincia || '',
    cpostal: patient?.cpostal || '',
    peso: patient?.peso || '',
    talla: patient?.talla || ''
  });

  const [editing, setEditing] = useState({});
  const [touched, setTouched] = useState({});
  const [validations, setValidations] = useState({});
  
  // Actualizar los campos editables cuando cambia el paciente
  useEffect(() => {
    if (patient) {
      setEditableFields({
        email: patient.email || '',
        telefono: patient.telefono || '',
        calle: patient.calle || '',
        numero: patient.numero || '',
        piso: patient.piso || '',
        departamento: patient.departamento || '',
        ciudad: patient.ciudad || '',
        provincia: patient.provincia || '',
        cpostal: patient.cpostal || '',
        peso: patient.peso || '',
        talla: patient.talla || ''
      });
    }
  }, [patient]);
  
  // Campos que el usuario puede editar
  const editableFieldsConfig = {
    telefono: { 
      icon: <FaPhone />, 
      label: 'Teléfono', 
      type: 'tel',
      placeholder: 'Ingresa tu teléfono',
      validate: value => {
        if (value && !/^\d{7,15}$/.test(value)) {
          return 'El teléfono debe tener entre 7 y 15 dígitos';
        }
        return null;
      }
    },
    email: { 
      icon: <FaEnvelope />, 
      label: 'Email', 
      type: 'email',
      placeholder: 'Ingresa tu email',
      validate: value => {
        if (value && !/\S+@\S+\.\S+/.test(value)) {
          return 'Ingresa un email válido';
        }
        return null;
      }
    },
    calle: { 
      icon: <FaMapMarkerAlt />, 
      label: 'Calle', 
      type: 'text',
      placeholder: 'Ingresa tu calle'
    },
    numero: { 
      icon: null, 
      label: 'Número', 
      type: 'text',
      placeholder: 'Nº',
      validate: value => {
        if (value && !/^\d{1,5}$/.test(value)) {
          return 'Ingresa un número válido';
        }
        return null;
      }
    },
    piso: { 
      icon: null, 
      label: 'Piso', 
      type: 'text',
      placeholder: 'Piso'
    },
    departamento: { 
      icon: null, 
      label: 'Departamento', 
      type: 'text',
      placeholder: 'Depto.'
    },
    ciudad: { 
      icon: <FaMapMarkerAlt />, 
      label: 'Ciudad', 
      type: 'text',
      placeholder: 'Ingresa tu ciudad'
    },
    provincia: { 
      icon: <FaMapMarkerAlt />, 
      label: 'Provincia', 
      type: 'text',
      placeholder: 'Ingresa tu provincia'
    },
    cpostal: { 
      icon: <FaMapMarkerAlt />, 
      label: 'Código Postal', 
      type: 'text',
      placeholder: 'CP',
      validate: value => {
        if (value && !/^\d{1,8}$/.test(value)) {
          return 'Ingresa un código postal válido';
        }
        return null;
      }
    },
    peso: { 
      icon: <FaWeight />, 
      label: 'Peso (kg)', 
      type: 'number',
      placeholder: 'Ingresa tu peso en kg',
      validate: value => {
        if (value && (isNaN(value) || value < 0 || value > 500)) {
          return 'Ingresa un peso válido';
        }
        return null;
      }
    },
    talla: { 
      icon: <FaRulerVertical />, 
      label: 'Talla (cm)', 
      type: 'number',
      placeholder: 'Ingresa tu talla en cm',
      validate: value => {
        if (value && (isNaN(value) || value < 0 || value > 300)) {
          return 'Ingresa una talla válida';
        }
        return null;
      }
    }
  };

  // Campos que solo pueden verse (no editarse)
  const readOnlyFields = {
    nombre: { icon: <FaUser />, label: 'Nombre', value: patient?.nombre },
    apellido: { icon: <FaUser />, label: 'Apellido', value: patient?.apellido },
    dni: { icon: <FaIdCard />, label: 'DNI', value: patient?.dni },
    sexo: { icon: <FaUser />, label: 'Sexo', value: patient?.sexo === 'M' ? 'Masculino' : 'Femenino' },
    fecnac: { 
      icon: <FaUser />, 
      label: 'Fecha de Nacimiento', 
      value: patient?.fecnac 
        ? new Date(patient.fecnac).toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }) 
        : ''
    },
    idobrasocial: { 
      icon: <FaHospital />, 
      label: 'Obra Social', 
      value: patient?.idobrasocial ? patient.idobrasocial : 'SIN OBRA SOCIAL' 
    }
  };

  // Validar un campo específico
  const validateField = (field, value) => {
    const config = editableFieldsConfig[field];
    if (config && config.validate) {
      return config.validate(value);
    }
    return null;
  };

  const handleEdit = (field) => {
    setEditing({...editing, [field]: true});
    setTouched({...touched, [field]: false});
  };

  const handleCancel = (field) => {
    setEditing({...editing, [field]: false});
    setTouched({...touched, [field]: false});
    // Revertir a los valores originales
    setEditableFields({
      ...editableFields,
      [field]: patient[field] || ''
    });
    
    // Eliminar cualquier error de validación para este campo
    if (validations[field]) {
      const newValidations = {...validations};
      delete newValidations[field];
      setValidations(newValidations);
    }
  };

  const handleChange = (field, value) => {
    setEditableFields({
      ...editableFields,
      [field]: value
    });
    
    // Ejecutar validación solo si el campo ya ha sido tocado
    if (touched[field]) {
      const error = validateField(field, value);
      setValidations({
        ...validations,
        [field]: error
      });
    }
  };
  
  const handleBlur = (field) => {
    setTouched({...touched, [field]: true});
    const error = validateField(field, editableFields[field]);
    setValidations({
      ...validations,
      [field]: error
    });
  };

  const handleSave = (field) => {
    // Validar el campo antes de guardar
    const error = validateField(field, editableFields[field]);
    
    if (error) {
      setValidations({
        ...validations,
        [field]: error
      });
      return;
    }
    
    setEditing({...editing, [field]: false});
    setTouched({...touched, [field]: false});
    
    // Eliminar cualquier error de validación para este campo
    if (validations[field]) {
      const newValidations = {...validations};
      delete newValidations[field];
      setValidations(newValidations);
    }
    
    // Sólo actualizar si el valor ha cambiado
    if (editableFields[field] !== patient[field]) {
      onSave({...patient, [field]: editableFields[field]});
    }
  };

  const renderEditableField = (key) => {
    const config = editableFieldsConfig[key];
    const isEditing = editing[key];
    const error = validations[key];
    
    return (
      <div key={key} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm mb-3 transition-all duration-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-gray-800 dark:text-white">
            {config.icon && <span className="text-primary-500">{config.icon}</span>}
            <span className="font-medium">{config.label}:</span>
          </div>
          {isEditing ? (
            <div className="flex gap-2">
              <button 
                onClick={() => handleSave(key)}
                className="p-1 text-green-500 hover:text-green-600 transition-colors"
                aria-label="Guardar"
                disabled={!!error}
              >
                <FaSave />
              </button>
              <button 
                onClick={() => handleCancel(key)}
                className="p-1 text-red-500 hover:text-red-600 transition-colors"
                aria-label="Cancelar"
              >
                <FaTimes />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => handleEdit(key)}
              className="p-1 text-gray-500 hover:text-primary-500 transition-colors"
              aria-label="Editar"
            >
              <FaPencilAlt />
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="mt-2">
            <input
              type={config.type}
              value={editableFields[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              onBlur={() => handleBlur(key)}
              className={`w-full px-3 py-2 border ${error ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white`}
              placeholder={config.placeholder}
              autoFocus
            />
            {error && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>
            )}
          </div>
        ) : (
          <div className="mt-1 text-gray-700 dark:text-gray-300">
            {editableFields[key] || <span className="text-gray-400 dark:text-gray-500 italic">Sin datos</span>}
          </div>
        )}
      </div>
    );
  };

  const renderReadOnlyField = (key) => {
    const config = readOnlyFields[key];
    
    return (
      <div key={key} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm mb-3">
        <div className="flex items-center gap-2 text-gray-800 dark:text-white">
          <span className="text-primary-500">{config.icon}</span>
          <span className="font-medium">{config.label}:</span>
        </div>
        <div className="mt-1 text-gray-700 dark:text-gray-300">
          {config.value || <span className="text-gray-400 dark:text-gray-500 italic">Sin datos</span>}
        </div>
      </div>
    );
  };

  // Verificar si hay algún campo en modo edición
  const isAnyFieldEditing = Object.values(editing).some(v => v);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
            <FaUser className="text-3xl text-primary-500" />
          </div>
          <div>
            <h2 className="text-white text-xl font-bold">{patient?.nombre} {patient?.apellido}</h2>
            <p className="text-primary-100">DNI: {patient?.dni}</p>
          </div>
        </div>
      </div>

      {isAnyFieldEditing && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-600 dark:text-blue-300">
          <div className="flex items-center gap-2">
            <FaInfoCircle className="text-blue-500" />
            <p>Para guardar tus cambios, haz clic en el icono de guardado.</p>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Información Personal</h3>
        {Object.keys(readOnlyFields).map(renderReadOnlyField)}
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Información de Contacto</h3>
        {['telefono', 'email'].map(renderEditableField)}
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Domicilio</h3>
        {['calle', 'numero', 'piso', 'departamento', 'ciudad', 'provincia', 'cpostal'].map(renderEditableField)}
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Información Médica</h3>
        {['peso', 'talla'].map(renderEditableField)}
      </div>
    </motion.div>
  );
};

export default PatientProfile;