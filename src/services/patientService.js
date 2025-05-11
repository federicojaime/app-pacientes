import axios from 'axios';

// Función para mostrar alertas de depuración en la interfaz
const showDebugAlert = (message, type = 'info') => {
  const alertDiv = document.createElement('div');
  alertDiv.className = `fixed bottom-0 left-0 right-0 p-4 m-4 z-50 rounded-lg shadow-lg ${
    type === 'error' ? 'bg-red-500 text-white' : 
    type === 'success' ? 'bg-green-500 text-white' : 
    'bg-blue-500 text-white'
  }`;
  
  // Crear contenedor flex para el mensaje y el botón de cerrar
  const container = document.createElement('div');
  container.className = 'flex justify-between items-start';
  
  // Contenido del mensaje
  const content = document.createElement('div');
  content.className = 'flex-1 mr-4';
  
  // Título
  const title = document.createElement('h3');
  title.className = 'font-bold mb-1';
  title.textContent = type === 'error' ? 'Error API' : type === 'success' ? 'Éxito API' : 'Info API';
  content.appendChild(title);
  
  // Mensaje
  const text = document.createElement('p');
  text.className = 'text-sm';
  text.textContent = message;
  content.appendChild(text);
  
  container.appendChild(content);
  
  // Botón de cerrar
  const closeBtn = document.createElement('button');
  closeBtn.className = 'text-white hover:text-gray-200';
  closeBtn.textContent = '×';
  closeBtn.style.fontSize = '24px';
  closeBtn.onclick = () => document.body.removeChild(alertDiv);
  container.appendChild(closeBtn);
  
  alertDiv.appendChild(container);
  
  document.body.appendChild(alertDiv);
  
  // Auto-eliminar después de 20 segundos
  setTimeout(() => {
    if (document.body.contains(alertDiv)) {
      document.body.removeChild(alertDiv);
    }
  }, 20000);
};

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
  
  // Mostrar información de la solicitud
  const requestInfo = `📤 ${config.method.toUpperCase()} ${config.url}`;
  const requestData = config.data ? ` | Datos: ${JSON.stringify(config.data).substring(0, 500)}` : '';
  showDebugAlert(`${requestInfo}${requestData}`, 'info');
  
  return config;
}, (error) => {
  showDebugAlert(`Error en la configuración de la solicitud: ${error.message}`, 'error');
  return Promise.reject(error);
});

// Interceptor para manejar errores de respuesta
API.interceptors.response.use(
  (response) => {
    // Mostrar información de la respuesta exitosa
    const responseInfo = `📥 ${response.status} ${response.statusText} | ${response.config.method.toUpperCase()} ${response.config.url}`;
    const responseData = response.data ? ` | Respuesta: ${JSON.stringify(response.data).substring(0, 500)}` : '';
    showDebugAlert(`${responseInfo}${responseData}`, 'success');
    
    return response;
  },
  (error) => {
    // Manejar errores comunes de forma centralizada
    if (error.response) {
      // La petición fue hecha y el servidor respondió con un código de estado
      // que cae fuera del rango 2xx
      const errorInfo = `🚫 Error ${error.response.status} | ${error.config.method.toUpperCase()} ${error.config.url}`;
      const errorData = error.response.data ? ` | Respuesta: ${JSON.stringify(error.response.data).substring(0, 500)}` : '';
      showDebugAlert(`${errorInfo}${errorData}`, 'error');
      
      console.error('Error de respuesta:', error.response.status, error.response.data);
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      showDebugAlert(`❌ No se recibió respuesta del servidor | ${error.config?.method?.toUpperCase()} ${error.config?.url}`, 'error');
      console.error('Error de conexión:', error.request);
    } else {
      // Algo ocurrió durante la configuración de la petición
      showDebugAlert(`🔴 Error: ${error.message}`, 'error');
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
      showDebugAlert(`Verificando DNI: ${dni}`, 'info');
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
      showDebugAlert(`Registrando paciente con DNI: ${patientData.dni}`, 'info');
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
      showDebugAlert(`Actualizando paciente ID: ${id}`, 'info');
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
      showDebugAlert(`Obteniendo citas para paciente ID: ${patientId}`, 'info');
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
      showDebugAlert(`Obteniendo recetas para paciente ID: ${patientId}`, 'info');
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
      showDebugAlert(`Obteniendo estudios médicos para paciente ID: ${patientId}`, 'info');
      const response = await API.get(`/patients/${patientId}/medical-tests`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener estudios médicos:', error);
      throw error;
    }
  }
};

export default patientService;