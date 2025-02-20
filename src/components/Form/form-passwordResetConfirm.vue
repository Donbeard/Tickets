<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-6 py-5 lg:px-8">
    <div class="w-full max-w-md">
      <div class="bg-white p-8 rounded-lg shadow-md">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
          <img class="mx-auto h-10 w-auto" src="https://static.wixstatic.com/media/7a7799_d00b73646de9440f88c6f421422244a3.png" alt="Your Company" />
          <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Restablecer Contraseña</h2>
        </div>
        <form @submit.prevent="resetPassword" class="mt-8 space-y-6">
          <div class="space-y-4">
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Nueva Contraseña</label>
              <input
                id="password"
                type="password"
                v-model="password"
                required
                placeholder="Ingrese su nueva contraseña"
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out"
            >
              Restablecer contraseña
            </button>
          </div>
          <div v-if="message" :class="['mt-4 p-2 rounded', isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700']">
            {{ message }}
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
      password: "",
      message: "",
      isSuccess: false,
    };
  },
  methods: {
    async resetPassword() {
      const { uid, token } = this.$route.params;
      try {
       await apiClient.post(`/password-reset-confirm/${uid}/${token}/`, {
          password: this.password,
        });
        this.message = "Contraseña restablecida con éxito.";
        this.isSuccess = true;
      } catch (error) {
        this.message = "Error al restablecer la contraseña.";
        this.isSuccess = false;
      }
    },
  },
};
</script>