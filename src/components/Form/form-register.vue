<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-6 py-5 lg:px-8">
    <div class="w-full max-w-md">
      <div class="bg-white p-8 rounded-lg shadow-md">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
          <img class="mx-auto h-10 w-auto" src="https://static.wixstatic.com/media/7a7799_d00b73646de9440f88c6f421422244a3.png" alt="Your Company" />
          <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Registro usuario</h2>
        </div>
        <form @submit.prevent="registerUser" class="mt-8 space-y-6">
          <div class="space-y-4">
            <div>
              <label for="first_name" class="block text-sm font-medium text-gray-700">Nombres</label>
              <input
                id="first_name"
                type="text"
                v-model="form.first_name"
                required
                placeholder="Ingrese sus nombres"
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label for="last_name" class="block text-sm font-medium text-gray-700">Apellidos</label>
              <input
                id="last_name"
                type="text"
                v-model="form.last_name"
                required
                placeholder="Ingrese sus apellidos"
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label for="nit" class="block text-sm font-medium text-gray-700">NIT</label>
              <input
                id="nit"
                type="number"
                v-model="form.nit"
                required
                placeholder="Ingrese su NIT"
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
              <input
                id="email"
                type="email"
                v-model="form.email"
                required
                placeholder="Ingrese su correo electrónico"
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
              <input
                id="password"
                type="password"
                v-model="form.password"
                required
                placeholder="Ingrese su contraseña"
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label for="whatsapp" class="block text-sm font-medium text-gray-700">Telefono</label>
              <input
                id="whatsapp"
                type="number"
                v-model="form.whatsapp"
                placeholder="Ingrese su número de WhatsApp"
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out"
            >
              Registrar
            </button>
          </div>
          <div v-if="statusMessage" :class="['mt-4 p-2 rounded', isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700']">
            {{ statusMessage }}
          </div>
          <div v-if="errors.length > 0" class="mt-4 p-2 rounded bg-red-100 text-red-700">
            <ul>
              <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
            </ul>
          </div>
          <div class="text-center">
            <p class="text-sm text-gray-600">
              ¿Ya tienes una cuenta?
              <router-link to="/" class="font-medium text-indigo-600 hover:text-indigo-500">
                Iniciar sesión
              </router-link>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '@/apiClient';

export default {
  data() {
    return {
      form: {
        first_name: '',
        last_name: '',
        nit: null,
        email: '',
        password: '',
        whatsapp: null,
        username: '', 
        tipo: 'C',
        is_active: true,
        is_staff: false,
        is_superuser: false,
      },
      statusMessage: '',
      isSuccess: false,
      errors: [],
    };
  },
  methods: {
    async registerUser() {
      try {
        this.statusMessage = ''; 
        this.errors = [];
        this.form.username = this.form.email;
        this.form.nit = this.form.nit ? parseInt(this.form.nit) : null;
        this.form.whatsapp = this.form.whatsapp ? parseInt(this.form.whatsapp) : null;

        const response = await apiClient.post('/usuarios/', this.form);
        
        console.log('Usuario registrado:', response.data);
        this.statusMessage = 'Usuario registrado exitosamente';
        this.isSuccess = true;
        setTimeout(() => {
          this.$router.push('/');
        }, 2000);
      } catch (error) {
        console.error('Error al registrar usuario:', error);
        this.isSuccess = false;
        if (error.response && error.response.data) {
          const errorData = error.response.data;
          for (const key in errorData) {
            if (Array.isArray(errorData[key])) {
              this.errors.push(`${key}: ${errorData[key].join(', ')}`);
            } else {
              this.errors.push(`${key}: ${errorData[key]}`);
            }
          }
        } else {
          this.statusMessage = 'Hubo un problema al registrar el usuario. Por favor, intente de nuevo.';
        }
      }
    },
  },
};
</script>