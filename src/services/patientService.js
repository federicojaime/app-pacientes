import axios from 'axios';

// Obtener la URL base de la API desde las variables de entorno
const API_URL = import.meta.env.VITE_API_URL || 'https://app-pacientes-server-production.up.railway.app/api';

// Configuración base de axios
const API = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // Aumentado a 15 segundos para redes más lentas en producción
});

// Interceptor para agregar token de autenticación si existe
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Agregar información de la versión de la app y el entorno
  config.headers['X-App-Version'] = '1.0.0';
  config.headers['X-App-Environment'] = import.meta.env.MODE || 'production';
  
  return config;
}, (error) => {
  console.error('Error en la configuración de la solicitud:', error);
  return Promise.reject(error);
});

// Interceptor para el manejo de respuestas
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejar errores comunes de forma centralizada
    let errorMessage = 'Error de conexión. Verifica tu conexión a internet y vuelve a intentarlo.';
    let errorDetails = null;
    
    if (error.response) {
      // La petición fue hecha y el servidor respondió con un código de estado
      switch (error.response.status) {
        case 400:
          errorMessage = 'Solicitud incorrecta. Por favor, verifica los datos proporcionados.';
          break;
        case 401:
          errorMessage = 'No autorizado. Inicia sesión nuevamente.';
          break;
        case 404:
          errorMessage = 'Recurso no encontrado.';
          break;
        case 409:
          errorMessage = 'Ya existe un registro con esos datos.';
          break;
        case 500:
          errorMessage = 'Error en el servidor. Intenta más tarde.';
          break;
        default:
          errorMessage = `Error ${error.response.status}: ${error.response.statusText}`;
      }
      
      errorDetails = error.response.data;
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      errorMessage = 'No se recibió respuesta del servidor. Verifica tu conexión o intenta más tarde.';
    }
    
    // Personalizar el objeto de error para facilitar su manejo
    const customError = new Error(errorMessage);
    customError.originalError = error;
    customError.details = errorDetails;
    customError.type = error.response ? 'server' : 'network';
    
    // Log del error para depuración
    console.error('Error en API:', {
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method
    });
    
    return Promise.reject(customError);
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
      // Formatear los datos para asegurar compatibilidad con la API
      const formattedData = {
        ...patientData,
        // Asegurar que ciertos campos sean string
        dni: String(patientData.dni),
        // Convertir a números si es necesario
        peso: patientData.peso ? Number(patientData.peso) : null,
        talla: patientData.talla ? Number(patientData.talla) : null,
        // Asegurar que los campos vacíos sean null y no cadenas vacías
        email: patientData.email || null,
        telefono: patientData.telefono || null,
        calle: patientData.calle || null,
        numero: patientData.numero || null,
        piso: patientData.piso || null,
        departamento: patientData.departamento || null,
        ciudad: patientData.ciudad || null,
        provincia: patientData.provincia || null,
        cpostal: patientData.cpostal || null
      };
      
      const response = await API.post('/patients', formattedData);
      return response.data;
    } catch (error) {
      console.error('Error al registrar paciente:', error);
      throw error;
    }
  },
  
  // Actualizar datos del paciente
  updatePatient: async (id, updatedData) => {
    try {
      // Formatear los datos para evitar enviar campos vacíos como cadenas vacías
      const formattedData = Object.fromEntries(
        Object.entries(updatedData)
          .filter(([_, value]) => value !== '')
          .map(([key, value]) => {
            // Convertir a número los campos numéricos
            if (key === 'peso' || key === 'talla') {
              return [key, value ? Number(value) : null];
            }
            return [key, value];
          })
      );
      
      const response = await API.put(`/patients/${id}`, formattedData);
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