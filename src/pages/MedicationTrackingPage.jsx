import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaReceipt, FaUserMd, FaClipboardList, FaHandHoldingMedical,
    FaTruck, FaCheckCircle, FaTimesCircle, FaClock, FaInfoCircle,
    FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaPhone, FaSpinner,
    FaPrescriptionBottle, FaExclamationTriangle, FaFileAlt, FaArrowRight,
    FaEnvelope
} from 'react-icons/fa';

const MedicationTrackingPage = () => {
    const { trackingNumber } = useParams();
    const [medicationData, setMedicationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedStep, setSelectedStep] = useState(null);

    // Simulación de llamada a la API
    useEffect(() => {
        const fetchMedicationData = async () => {
            try {
                setLoading(true);
                // Simular delay de API
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Datos corregidos con 5 pasos como en las imágenes
                const mockData = {
                    trackingNumber: trackingNumber,
                    patient: {
                        name: "Juan Fernando Flores",
                        dni: "12345678",
                        phone: "+54 351 4225004",
                        address: "Mendoza 251, Barrio Alberdi, Córdoba, Argentina"
                    },
                    medication: {
                        name: "Medicamento de Alto Costo - Oncológico",
                        code: "MAC-2025-001",
                        dosage: "500mg",
                        quantity: "30 comprimidos",
                        doctor: "Juan Fernando Flores MP 123123",
                        prescriptionDate: "05/09/2025"
                    },
                    currentStep: 4, // Paso actual (0-4, total 5 pasos)
                    steps: [
                        {
                            id: 0,
                            name: "Receta",
                            description: "Receta médica emitida",
                            icon: <FaReceipt />,
                            status: "completed",
                            date: "05/09/2025",
                            details: "Emitida por Dr. Juan Fernando Flores",
                            color: "text-blue-500"
                        },
                        {
                            id: 1,
                            name: "Auditoría Médica",
                            description: "Revisión y validación médica",
                            icon: <FaUserMd />,
                            status: "completed",
                            date: "05/09/2025",
                            details: "Control: Requiere informe Médico",
                            color: "text-purple-500"
                        },
                        {
                            id: 2,
                            name: "Cotización",
                            description: "Solicitud de cotización a laboratorios",
                            icon: <FaClipboardList />,
                            status: "completed",
                            date: "08/09/2025",
                            details: "Se emite a laboratorios pedido de Cotización",
                            color: "text-orange-500"
                        },
                        {
                            id: 3,
                            name: "Adjudicación",
                            description: "Proceso de adjudicación y evaluación",
                            icon: <FaHandHoldingMedical />,
                            status: "completed",
                            date: "11/09/2025",
                            details: "Fecha Cierre: Se reciben propuestas de Laboratorios. Comisión Evaluadora adjudica - Se notifica al adjudicatario, se solicita fecha, lugar y horario de entrega",
                            color: "text-green-500"
                        },
                        {
                            id: 4,
                            name: "Entrega",
                            description: "Medicamento entregado al paciente",
                            icon: <FaTruck />,
                            status: "current",
                            date: "13/09/2025",
                            details: "Aviso al Paciente de fecha, lugar y hora de entrega",
                            color: "text-green-600"
                        }
                    ],
                    timeline: [
                        {
                            date: "05/09/2025",
                            action: "Receta Emitida",
                            description: "Dr. Juan Fernando Flores emite receta médica",
                            status: "success"
                        },
                        {
                            date: "05/09/2025",
                            action: "Auditoría Médica Recibida",
                            description: "Control: Requiere informe Médico",
                            status: "info"
                        },
                        {
                            date: "06/09/2025",
                            action: "Documentación Requerida",
                            description: "Se recepta documentación",
                            status: "warning"
                        },
                        {
                            date: "07/09/2025",
                            action: "Medicamentos Aprobados",
                            description: "Medicamentos Aprobados",
                            status: "success"
                        },
                        {
                            date: "08/09/2025",
                            action: "Cotización Iniciada",
                            description: "Se emite a laboratorios pedido de Cotización",
                            status: "info"
                        },
                        {
                            date: "11/09/2025",
                            action: "Propuestas Recibidas",
                            description: "Fecha Cierre: Se reciben propuestas de Laboratorios",
                            status: "success"
                        },
                        {
                            date: "12/09/2025",
                            action: "Adjudicación Completada",
                            description: "Comisión Evaluadora adjudica - Se notifica al adjudicatario",
                            status: "success"
                        },
                        {
                            date: "12/09/2025",
                            action: "Acuerdo de Condiciones",
                            description: "Acuerdo de condiciones para entrega",
                            status: "success"
                        },
                        {
                            date: "13/09/2025",
                            action: "Preparación para Entrega",
                            description: "Aviso al Paciente de fecha, lugar y hora de entrega",
                            status: "current"
                        }
                    ]
                };

                setMedicationData(mockData);
                // Establecer el paso actual como seleccionado por defecto
                setSelectedStep(mockData.currentStep);
            } catch (err) {
                setError("Error al cargar la información del seguimiento");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (trackingNumber) {
            fetchMedicationData();
        }
    }, [trackingNumber]);

    const goToNextStep = () => {
        if (selectedStep < medicationData.steps.length - 1) {
            setSelectedStep(selectedStep + 1);
        }
    };

    const goToPreviousStep = () => {
        if (selectedStep > 0) {
            setSelectedStep(selectedStep - 1);
        }
    };

    const goToStep = (stepIndex) => {
        // Solo permitir navegar a pasos completados, actual, o el siguiente inmediato
        if (stepIndex <= medicationData.currentStep + 1) {
            setSelectedStep(stepIndex);
        }
    };

    const getStepStatus = (stepIndex, currentStep) => {
        if (stepIndex < currentStep) return 'completed';
        if (stepIndex === currentStep) return 'current';
        return 'pending';
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <FaCheckCircle className="text-green-500" />;
            case 'current':
                return <FaClock className="text-blue-500 animate-pulse" />;
            case 'pending':
                return <FaClock className="text-gray-400" />;
            case 'warning':
                return <FaExclamationTriangle className="text-yellow-500" />;
            case 'info':
                return <FaInfoCircle className="text-blue-500" />;
            case 'success':
                return <FaCheckCircle className="text-green-500" />;
            default:
                return <FaClock className="text-gray-400" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-500';
            case 'current':
                return 'bg-blue-500';
            case 'pending':
                return 'bg-gray-300';
            default:
                return 'bg-gray-300';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                >
                    <FaSpinner className="text-4xl text-primary-500 animate-spin mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Cargando información del seguimiento
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Número de seguimiento: {trackingNumber}
                    </p>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md"
                >
                    <FaTimesCircle className="text-4xl text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Error al cargar información
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                        <FaArrowLeft /> Volver al inicio
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4 transition-colors"
                    >
                        <FaArrowLeft /> Volver al inicio
                    </Link>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center">
                                <FaPrescriptionBottle className="text-2xl text-primary-600 dark:text-primary-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                    Seguimiento de Medicamentos
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Número de seguimiento: <span className="font-mono font-semibold">{trackingNumber}</span>
                                </p>
                            </div>
                        </div>

                        {/* Patient Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Información del Paciente</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                    <strong>Nombre:</strong> {medicationData.patient.name}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                    <strong>DNI:</strong> {medicationData.patient.dni}
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Prescriptor/ar</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                    {medicationData.medication.doctor}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Progress Timeline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8"
                >
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <FaClipboardList className="text-primary-500" />
                        Estado del Proceso
                    </h2>

                    {/* Timeline Path - Responsive Design */}
                    <div className="relative py-8">
                        {/* Desktop version */}
                        <div className="hidden md:block">
                            {/* Main horizontal line */}
                            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300 dark:bg-gray-600 transform -translate-y-1/2"></div>

                            {/* Progress line (green) */}
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{
                                    width: `${(medicationData.currentStep / (medicationData.steps.length - 1)) * 100}%`
                                }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                className="absolute top-1/2 left-0 h-0.5 bg-green-500 transform -translate-y-1/2 z-10"
                            />

                            {/* Desktop Steps */}
                            <div className="relative flex justify-between items-center">
                                {medicationData.steps.map((step, index) => {
                                    const status = getStepStatus(index, medicationData.currentStep);
                                    const isSelected = selectedStep === index;

                                    return (
                                        <motion.div
                                            key={step.id}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.3 + index * 0.1 }}
                                            className="flex flex-col items-center z-30 cursor-pointer"
                                            onClick={() => goToStep(index)}
                                        >
                                            {/* Circle */}
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${status === 'completed'
                                                    ? 'bg-green-500 text-white'
                                                    : status === 'current'
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-300 text-gray-600'
                                                } ${isSelected ? 'ring-2 ring-blue-300' : ''}`}>
                                                {status === 'completed' ? (
                                                    <FaCheckCircle className="text-lg" />
                                                ) : (
                                                    <span className="text-sm">{step.icon}</span>
                                                )}
                                            </div>

                                            {/* Step name */}
                                            <h3 className={`mt-3 font-semibold text-sm ${status === 'completed' ? 'text-green-600' :
                                                    status === 'current' ? 'text-blue-600' :
                                                        'text-gray-500'
                                                }`}>
                                                {step.name}
                                            </h3>

                                            {/* Description */}
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 text-center max-w-28 leading-tight">
                                                {step.description}
                                            </p>

                                            {/* Date */}
                                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                <FaCalendarAlt className="text-xs" />
                                                {step.date}
                                            </p>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Mobile version - Vertical layout */}
                        <div className="md:hidden space-y-6">
                            {medicationData.steps.map((step, index) => {
                                const status = getStepStatus(index, medicationData.currentStep);
                                const isSelected = selectedStep === index;
                                const isLast = index === medicationData.steps.length - 1;

                                return (
                                    <motion.div
                                        key={step.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 + index * 0.1 }}
                                        className="relative"
                                    >
                                        <div
                                            className={`flex items-center p-4 rounded-lg cursor-pointer transition-all ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-300' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                                                }`}
                                            onClick={() => goToStep(index)}
                                        >
                                            {/* Circle */}
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md mr-4 flex-shrink-0 ${status === 'completed'
                                                    ? 'bg-green-500 text-white'
                                                    : status === 'current'
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-300 text-gray-600'
                                                }`}>
                                                {status === 'completed' ? (
                                                    <FaCheckCircle className="text-lg" />
                                                ) : (
                                                    <span className="text-sm">{step.icon}</span>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1">
                                                <h3 className={`font-semibold text-base ${status === 'completed' ? 'text-green-600' :
                                                        status === 'current' ? 'text-blue-600' :
                                                            'text-gray-500'
                                                    }`}>
                                                    {step.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    {step.description}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                                    <FaCalendarAlt className="text-xs" />
                                                    {step.date}
                                                </p>
                                            </div>

                                            {/* Status indicator */}
                                            <div className="ml-4">
                                                {status === 'completed' && (
                                                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                                        <FaCheckCircle className="text-green-500 text-sm" />
                                                    </div>
                                                )}
                                                {status === 'current' && (
                                                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <FaClock className="text-blue-500 text-sm animate-pulse" />
                                                    </div>
                                                )}
                                                {status === 'pending' && (
                                                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                                                        <FaClock className="text-gray-400 text-sm" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Connecting line for mobile */}
                                        {!isLast && (
                                            <div className="ml-6 w-0.5 h-4 bg-gray-300 dark:bg-gray-600"></div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Navigation Controls */}
                    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={goToPreviousStep}
                            disabled={selectedStep === 0}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <FaArrowLeft />
                            Anterior
                        </button>

                        <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Paso {selectedStep + 1} de {medicationData.steps.length}
                            </p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                                {medicationData.steps[selectedStep]?.name}
                            </p>
                        </div>

                        <button
                            onClick={goToNextStep}
                            disabled={selectedStep === medicationData.steps.length - 1 || selectedStep > medicationData.currentStep}
                            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Siguiente
                            <FaArrowRight />
                        </button>
                    </div>

                    {/* Selected Step Details */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedStep}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="mt-6 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600"
                        >
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                {medicationData.steps[selectedStep]?.icon}
                                {medicationData.steps[selectedStep]?.name}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-3">
                                {medicationData.steps[selectedStep]?.description}
                            </p>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                                <strong>Detalles:</strong> {medicationData.steps[selectedStep]?.details}
                            </p>
                            {medicationData.steps[selectedStep]?.date && (
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 flex items-center gap-1">
                                    <FaCalendarAlt />
                                    Fecha: {medicationData.steps[selectedStep]?.date}
                                </p>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                {/* Detailed Timeline Log */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
                >
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <FaFileAlt className="text-primary-500" />
                        Historial Detallado
                    </h2>

                    <div className="space-y-4">
                        {medicationData.timeline.map((event, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                className={`flex items-start gap-4 p-4 rounded-lg border-l-4 ${event.status === 'success' ? 'border-green-400 bg-green-50 dark:bg-green-900/20' :
                                        event.status === 'current' ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' :
                                            event.status === 'warning' ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' :
                                                event.status === 'info' ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' :
                                                    'border-gray-400 bg-gray-50 dark:bg-gray-700/20'
                                    }`}
                            >
                                <div className="flex-shrink-0 mt-1">
                                    {getStatusIcon(event.status)}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {event.action}
                                        </h3>
                                        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                            <FaCalendarAlt className="text-xs" />
                                            {event.date}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                                        {event.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Contact Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 bg-primary-50 dark:bg-primary-900/20 rounded-xl p-6"
                >
                    <h3 className="font-semibold text-primary-800 dark:text-primary-200 mb-4 flex items-center gap-2">
                        <FaInfoCircle />
                        Información de Contacto - CMPC
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-primary-700 dark:text-primary-300">
                            <FaPhone />
                            <span>+54 351 4225004</span>
                        </div>
                        <div className="flex items-center gap-2 text-primary-700 dark:text-primary-300">
                            <FaEnvelope />
                            <span>consejomedico@cmpc.org.ar</span>
                        </div>
                        <div className="flex items-start gap-2 text-primary-700 dark:text-primary-300 md:col-span-2">
                            <FaMapMarkerAlt className="mt-1 flex-shrink-0" />
                            <span>Mendoza 251, Barrio Alberdi, Córdoba, Argentina</span>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-primary-200 dark:border-primary-700">
                        <p className="text-primary-600 dark:text-primary-300 text-sm">
                            <strong>Horarios de atención:</strong> Lunes a Viernes de 8:00 a 16:00 hs
                        </p>
                        <p className="text-primary-600 dark:text-primary-300 text-sm mt-1">
                            Para consultas sobre medicamentos de alto costo, comunícate durante el horario de atención.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default MedicationTrackingPage;