<template>
  <div class="min-h-screen flex-1 flex-col justify-center px-6 py-5 lg:px-8">

    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-10 w-auto" src="https://static.wixstatic.com/media/7a7799_d00b73646de9440f88c6f421422244a3.png" alt="Your Company" />
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Iniciar Sesión</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="login">
        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Usuario</label>
          <div class="mt-2">
            <input id="email" v-model="email" name="email" type="text" required
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Contraseña</label>
          <div class="mt-2">
            <input id="password" v-model="password" name="password" type="password" required
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
          </div>
        </div>

        <div>
          <button type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Ingresar
          </button>
        </div>
      </form>
      <p v-if="errorMessage" class="mt-2 text-center text-sm text-red-600">
        {{ errorMessage }}
      </p>
      <div class="mt-4 text-center">
          <p class="text-sm text-gray-600">
            ¿Quieres registrarte?
            <router-link to="/register" class="font-medium text-indigo-600 hover:text-indigo-500">
              Registro
            </router-link>
          </p>
        </div>
        <div class="mt-4 text-center">
          <p class="text-sm text-gray-600">
            ¿Olvidaste tu contraseña?
            <router-link to="/password-reset" class="font-medium text-indigo-600 hover:text-indigo-500">
              Recuperar
            </router-link>
          </p>
        </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  data() {
      return {
          email: '',
          password: '',
          errorMessage: ''
      };
  },
  methods: {
    async login() {
        try {
            const response = await axios.post('https://wxsoporte.onrender.com/api/login/', {
                email: this.email,
                password: this.password,
                tipo: this.tipo,
                username: this.username,

            });

            // Verificar si hay tokens en la respuesta (indicador de éxito)
            if (response.data.access && response.data.refresh) {
                // Guardar tokens en el almacenamiento local o cookies
                localStorage.setItem('accessToken', response.data.access);
                localStorage.setItem('refreshToken', response.data.refresh);

                // Opcional: almacenar información del usuario
                localStorage.setItem('user', JSON.stringify(response.data.user));

                this.$router.push('/solicitudes'); // Redirige al usuario
            } else {
                this.errorMessage = 'Error desconocido. Intente nuevamente.';
            }
        } catch (error) {
            if (error.response) {
                // Captura el mensaje del backend si está disponible
                this.errorMessage = error.response.data.detail || 'Credenciales inválidas.';
            } else {
                this.errorMessage = 'No se pudo conectar con el servidor. Verifique su conexión.';
            }
            console.error('Error en el inicio de sesión:', error);
        }
    }
}

};
</script>