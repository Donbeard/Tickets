import axios from 'axios';

//Solicita un token al iniciar la aplicación
const api = axios.create({
  baseURL: 'http://144.76.41.52:8070/api/token',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configura un interceptor para incluir el token en las peticiones
api.interceptors.response.use(
    response => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
  
        // Refrescar el token
        const refresh_token = localStorage.getItem('refresh_token');
        if (refresh_token) {
          try {
            const response = await axios.post('wxsoporte.onrender.com/api/token', { refresh: refresh_token });
            localStorage.setItem('access_token', response.data.access);
            originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
            return axios(originalRequest);
          } catch (err) {
            console.error('Error al refrescar el token', err);
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/'; // Redirige a login si no se puede refrescar el token
          }
        }
      }
      return Promise.reject(error);
    }
  );
  
  export default api;