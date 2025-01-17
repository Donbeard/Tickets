// src/apiClient.js
import axios from 'axios';
import router from './router'; // Asegúrate de importar el router para redirecciones

const apiClient = axios.create({
  baseURL: 'https://wxsoporte.onrender.com/api/', // Cambia esto si tu base URL es diferente
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para incluir el token en las solicitudes
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); // Asegúrate de que el nombre coincida
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
          const response = await axios.post('https://wxsoporte.onrender.com/api/token/refresh/', {
            refresh: refreshToken,
          });

          localStorage.setItem('accessToken', response.data.access);
          apiClient.defaults.headers['Authorization'] = `Bearer ${response.data.access}`;
          originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
          return apiClient(originalRequest);
        } catch (err) {
          console.error('Error al refrescar el token', err);
          // Opcional: redirigir al usuario a la página de login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          router.push('/login');
          return Promise.reject(err);
        }
      } else {
        // No hay refresh token, redirigir a login
        router.push('/login');
      }
    }

    return Promise.reject(error);
  }
);

apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
        console.log('Token agregado a la solicitud:', token);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

export default apiClient;
