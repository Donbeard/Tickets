import { createRouter, createWebHistory } from 'vue-router';
import login from '../components/vue-login.vue';
import hello from '../components/hello-world.vue';
import formSolicitud from '../components/Form/form-solicitud.vue';
import formTareas from '../components/Form/form-tareas.vue';
import FormRegister from '@/components/Form/form-register.vue';

const routes = [
  { path: '', component: login, meta: { hideNavbar: true } },
  { path: '/hello', component: hello },
  { path: '/solicitudes', component: formSolicitud, meta: { requiresAuth: true } },
  { path: '/tareas', component: formTareas, meta: { requiresAuth: true } },
  { path: '/register', component: FormRegister, meta: { requiresAuth: false } },
];



const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;