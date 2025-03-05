import { createApp } from 'vue'
import App from './App.vue';
import router from './router';
import './style.css';
import apiClient from './apiClient';

const app = createApp(App);

// Función para verificar token antes de redireccionar
const checkAuthAndRedirect = async () => {
  if (sessionStorage.redirect) {
    const redirect = sessionStorage.redirect;
    delete sessionStorage.redirect;
    
    // Extraer la parte de la ruta que viene después de /Tickets/
    const path = redirect.replace(/.*\/Tickets\//, '/');
    
    // Verificar si es una ruta de autenticación (login, registro, recuperación de contraseña)
    const authRoutes = ['/', '/register', '/password-reset', '/password-reset-confirm'];
    const isAuthRoute = authRoutes.some(route => path.startsWith(route));
    
    // Si es una ruta de autenticación, redirigir directamente
    if (isAuthRoute) {
      router.push(path);
      return;
    }
    
    // Para otras rutas, verificar si hay un token válido
    const token = localStorage.getItem('accessToken');
    if (token) {
      const isValid = await apiClient.validateToken();
      if (isValid) {
        router.push(path); // Token válido, redirigir a la ruta original
      } else {
        router.push('/'); // Token inválido, ir al login
      }
    } else {
      router.push('/'); // No hay token, ir al login
    }
  }
};

// Ejecutar después de montar la app
app.use(router);
app.mount('#app');

// Verificar redirección después de que la app esté montada
checkAuthAndRedirect();