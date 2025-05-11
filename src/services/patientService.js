import axios from 'axios';

// Configuración base de axios
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Timeout de 10 segundos para las peticiones
});

// Interceptor para agregar token de autenticación si existe
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor para manejar errores de respuesta
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejar errores comunes de forma centralizada
    if (error.response) {
      // La petición fue hecha y el servidor respondió con un código de estado
      // que cae fuera del rango 2xx
      console.error('Error de respuesta:', error.response.status, error.response.data);
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      console.error('Error de conexión:', error.request);
    } else {
      // Algo ocurrió durante la configuración de la petición
      console.error('Error de configuración:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Servicio para manejar pacientes
const patientService = {
  // Verificar paciente por DNI
  checkPatientByDni: async (dni) => {
    try {
      const response = await API.get(`/patients/check/${dni}`);
      return response.data;
    } catch (error) {
      console.error('Error al verificar paciente:', error);
      throw error;
    }
  },
  
  // Registrar nuevo paciente
  registerPatient: async (patientData) => {
    try {
      const response = await API.post('/patients', patientData);
      return response.data;
    } catch (error) {
      console.error('Error al registrar paciente:', error);
      throw error;
    }
  },
  
  // Actualizar datos del paciente
  updatePatient: async (id, updatedData) => {
    try {
      const response = await API.put(`/patients/${id}`, updatedData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar paciente:', error);
      throw error;
    }
  },
  
  // Obtener próximas citas médicas del paciente
  getPatientAppointments: async (patientId) => {
    try {
      const response = await API.get(`/patients/${patientId}/appointments`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener citas:', error);
      throw error;
    }
  },
  
  // Obtener recetas médicas del paciente
  getPatientPrescriptions: async (patientId) => {
    try {
      const response = await API.get(`/patients/${patientId}/prescriptions`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener recetas:', error);
      throw error;
    }
  },
  
  // Obtener estudios médicos del paciente
  getPatientMedicalTests: async (patientId) => {
    try {
      const response = await API.get(`/patients/${patientId}/medical-tests`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener estudios médicos:', error);
      throw error;
    }
  }
};

export default patientService;