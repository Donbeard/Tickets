import { createRouter, createWebHistory } from 'vue-router';
import login from '../components/vue-login.vue';
import formSolicitud from '../components/Form/form-solicitud.vue';
import formTareas from '../components/Form/form-tareas.vue';
import FormRegister from '@/components/Form/form-register.vue';
import PaswordReset from '@/components/Form/form-password-Reset.vue';
import PaswordResetConfirm from '@/components/Form/form-passwordResetConfirm.vue';
import Modulos from '@/components/Form/form-modulos.vue';
import Submodulos from '@/components/Form/form-submodulos.vue';
import GridEmpresa from '@/components/Grid/grid-empresa.vue';
import GridLicencias from '@/components/Grid/grid-licencias.vue';

const router = createRouter({
  history: createWebHistory(),
  routes : [
    { path: '/', component: login, meta: { hideNavbar: true, allowWithoutAuth: true } },
    { path: '/solicitudes', component: formSolicitud, meta: { requiresAuth: true} },
    { path: '/tareas', component: formTareas, meta: { requiresAuth: true } },
    { path: '/register', component: FormRegister, meta: { hideNavbar: true, allowWithoutAuth: true } },
    { path: '/password-reset', component: PaswordReset, meta: { hideNavbar: true, allowWithoutAuth: true } },
    { path: '/password-reset-confirm/:uid/:token', component: PaswordResetConfirm, meta: { hideNavbar: true, allowWithoutAuth: true } },
    { path: '/modulos', component: Modulos, meta: { requiresAuth: true } },
    { path: '/submodulos', component: Submodulos, meta: { requiresAuth: true } },
    { path: '/empresas', component: GridEmpresa, meta: { requiresAuth: true } },
    { path: '/licencias', component: GridLicencias, meta: { requiresAuth: true } },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
});

// Guard de navegación mejorado
router.beforeEach((to, from, next) => {
  // Si la ruta es pública (login, register, etc.)
  if (to.meta.allowWithoutAuth) {
    return next();
  }
  
  // Verificar autenticación para rutas protegidas
  const isAuthenticated = !!localStorage.getItem('accessToken');
  if (!isAuthenticated) {
    // Guardar la ruta a la que intentaba acceder
    sessionStorage.setItem('redirectTo', to.fullPath);
    console.log('Ruta protegida, redirigiendo a login');
    return next('/');
  }
  
  next();
});

export default router;