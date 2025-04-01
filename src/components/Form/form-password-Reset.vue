<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-6 py-5 lg:px-8">
    <div class="w-full max-w-md">
      <div class="bg-white p-8 rounded-lg shadow-md">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
          <img class="mx-auto h-10 w-auto" src="https://static.wixstatic.com/media/7a7799_d00b73646de9440f88c6f421422244a3.png" alt="Your Company" />
          <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Recuperación de contraseña</h2>
        </div>
        <form @submit.prevent="sendResetEmail" class="mt-8 space-y-6">
          <div class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
              <input
                id="email"
                type="email"
                v-model="email"
                required
                placeholder="Ingrese su correo electrónico"
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out"
            >
              Enviar enlace de recuperación
            </button>
          </div>
          <div v-if="message" :class="['mt-4 p-2 rounded', isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700']">
            {{ message }}
          </div>
          <div class="text-center">
            <p class="text-sm text-gray-600">
              ¿Ya tienes una cuenta?
              <router-link to="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
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
      email: "",
      message: "",
      isSuccess: false,
    };
  },
  methods: {
    async sendResetEmail() {
      try {
        const baseUrl = 'http://144.76.41.52:8070'; // URL del servidor
        
        const response = await apiClient.post("/password-reset/", { 
          email: this.email,
          reset_url: `${baseUrl}/reset-password`
        });
        
        console.log('Respuesta del servidor:', response.data); // Para debug
        
        this.message = "Si el correo es válido, recibirás un enlace de recuperación.";
        this.isSuccess = true;
      } catch (error) {
        console.error('Error completo:', error);
        console.error('Datos del error:', error.response?.data);
        this.message = "Ocurrió un error, intenta de nuevo.";
        this.isSuccess = false;
      }
    },
  },
};
</script>