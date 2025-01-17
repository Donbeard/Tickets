<template>
    <div class="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold text-gray-900 text-center mb-6">Registro de Usuario</h2>
        <form @submit.prevent="registerUser">
          <div class="mb-4">
            <label for="nombre" class="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              id="nombre"
              type="text"
              v-model="form.nombre"
              required
              placeholder="Ingrese su nombre"
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div class="mb-4">
            <label for="correo" class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input
              id="correo"
              type="email"
              v-model="form.correo"
              required
              placeholder="Ingrese su correo"
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div class="mb-4">
            <label for="usuario" class="block text-sm font-medium text-gray-700">Usuario</label>
            <input
              id="usuario"
              type="text"
              v-model="form.usuario"
              required
              placeholder="Ingrese un nombre de usuario"
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div class="mb-4">
            <label for="contrasena" class="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              id="contrasena"
              type="password"
              v-model="form.contrasena"
              required
              placeholder="Ingrese su contraseña"
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out"
          >
            Registrar
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        form: {
          nombre: '',
          correo: '',
          usuario: '',
          contrasena: '',
        },
      };
    },
    methods: {
      async registerUser() {
        try {
          // Realiza la llamada a la API para registrar al usuario
          console.log('Datos del formulario:', this.form);
          // Aquí puedes usar axios o apiClient para enviar los datos al backend
          // Ejemplo:
          // await apiClient.post('/register', this.form);
          alert('Usuario registrado exitosamente');
        } catch (error) {
          console.error('Error al registrar usuario:', error);
          alert('Hubo un problema al registrar el usuario');
        }
      },
    },
  };
  </script>