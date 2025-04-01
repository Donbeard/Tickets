// src/apiClient.js
import axios from 'axios';
import router from './router'; // Asegúrate de importar el router para redirecciones

const apiClient = axios.create({
  baseURL: 'http://144.76.41.52:8070/api/', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cache para el token
let cachedToken = null;
let tokenPromise = null;

const getToken = async () => {
  // Si ya tenemos un token en cache, lo devolvemos
  if (cachedToken) {
    return cachedToken;
  }

  // Si ya hay una promesa pendiente, esperamos por ella
  if (tokenPromise) {
    return tokenPromise;
  }

  // Crear nueva promesa para obtener el token
  tokenPromise = new Promise((resolve) => {
    const token = localStorage.getItem('accessToken');
    cachedToken = token;
    resolve(token);
  });

  const token = await tokenPromise;
  tokenPromise = null; // Limpiar la promesa pendiente
  return token;
};

// Interceptor para incluir el token en las solicitudes
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas 401 y refrescar el token si es necesario
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          const response = await axios.post('http://144.76.41.52:8070/api/token/refresh/', {
            refresh: refreshToken,
          });

          localStorage.setItem('accessToken', response.data.access);
          cachedToken = response.data.access; // Actualizar el token en cache
          apiClient.defaults.headers['Authorization'] = `Bearer ${response.data.access}`;
          originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
          return apiClient(originalRequest);
        } catch (err) {
          console.error('Error al refrescar el token', err);
          // Limpiar tokens y cache
          cachedToken = null;
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          router.push('/');
          return Promise.reject(err);
        }
      } else {
        // No hay refresh token, redirigir a login
        router.push('/');
      }
    }

    return Promise.reject(error);
  }
);

export const validateToken = async () => {
  try {

    await apiClient.get('/usuarios/current/'); 
    
    return true;
  } catch (error) {
    return false;
  }
};

export default apiClient;
