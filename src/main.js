import { createApp } from 'vue'
import App from './App.vue';
import router from './router';
import './style.css';

const app = createApp(App);
// Manejar la redirección después de que la aplicación se cargue
if (sessionStorage.redirect) {
  const redirect = sessionStorage.redirect;
  delete sessionStorage.redirect;
  router.push(redirect); // Navega a la ruta guardada
}
app.use(router);
app.mount('#app');