import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaIdCard, FaMapMarkerAlt, FaPhone, FaEnvelope, FaPencilAlt, FaSave, FaTimes, FaWeight, FaRulerVertical, FaHospital } from 'react-icons/fa';

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
  
  // Campos que el usuario puede editar
  const editableFieldsConfig = {
    telefono: { icon: <FaPhone />, label: 'Teléfono', type: 'text' },
    email: { icon: <FaEnvelope />, label: 'Email', type: 'email' },
    calle: { icon: <FaMapMarkerAlt />, label: 'Calle', type: 'text' },
    numero: { icon: null, label: 'Número', type: 'number' },
    piso: { icon: null, label: 'Piso', type: 'number' },
    departamento: { icon: null, label: 'Departamento', type: 'text' },
    ciudad: { icon: <FaMapMarkerAlt />, label: 'Ciudad', type: 'text' },
    provincia: { icon: <FaMapMarkerAlt />, label: 'Provincia', type: 'text' },
    cpostal: { icon: <FaMapMarkerAlt />, label: 'Código Postal', type: 'text' },
    peso: { icon: <FaWeight />, label: 'Peso (kg)', type: 'number' },
    talla: { icon: <FaRulerVertical />, label: 'Talla (cm)', type: 'number' }
  };

  // Campos que solo pueden verse (no editarse)
  const readOnlyFields = {
    nombre: { icon: <FaUser />, label: 'Nombre', value: patient?.nombre },
    apellido: { icon: <FaUser />, label: 'Apellido', value: patient?.apellido },
    dni: { icon: <FaIdCard />, label: 'DNI', value: patient?.dni },
    sexo: { icon: <FaUser />, label: 'Sexo', value: patient?.sexo === 'M' ? 'Masculino' : 'Femenino' },
    fecnac: { icon: <FaUser />, label: 'Fecha de Nacimiento', value: patient?.fecnac ? new Date(patient.fecnac).toLocaleDateString() : '' },
    idobrasocial: { icon: <FaHospital />, label: 'Obra Social', value: patient?.idobrasocial ? patient.idobrasocial : 'SIN OBRA SOCIAL' }
  };

  const handleEdit = (field) => {
    setEditing({...editing, [field]: true});
  };

  const handleCancel = (field) => {
    setEditing({...editing, [field]: false});
    // Revertir a los valores originales
    setEditableFields({
      ...editableFields,
      [field]: patient[field] || ''
    });
  };

  const handleChange = (field, value) => {
    setEditableFields({
      ...editableFields,
      [field]: value
    });
  };

  const handleSave = (field) => {
    setEditing({...editing, [field]: false});
    onSave({...patient, [field]: editableFields[field]});
  };

  const renderEditableField = (key) => {
    const config = editableFieldsConfig[key];
    const isEditing = editing[key];
    
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
          <input
            type={config.type}
            value={editableFields[key]}
            onChange={(e) => handleChange(key, e.target.value)}
            className="mt-2 w-full px-3 py-2 border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            autoFocus
          />
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