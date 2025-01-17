<template>
    <div>
      <h2>Crear Solicitud</h2>
      <form @submit.prevent="crearSolicitud">
        <label for="usuario_cliente">Usuario Cliente</label>
        <input 
          id="usuario_cliente"
          type="text"
          v-model="solicitud.usuario_cliente"
          readonly
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
  
        <label for="titulo">Título</label>
        <input 
          id="titulo"
          type="text"
          v-model="solicitud.titulo"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Título de la solicitud"
        />
  
        <label for="descripcion">Descripción</label>
        <textarea 
          id="descripcion"
          v-model="solicitud.descripcion"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Descripción"
        ></textarea>
  
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded mt-4">
          Crear Solicitud
        </button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        solicitud: {
          usuario_cliente: '',
          titulo: '',
          descripcion: ''
        }
      };
    },
    created() {
      // Obtener usuario autenticado desde localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        this.solicitud.usuario_cliente = user.username; // Usar el ID o nombre según lo que requieras
      } else {
        alert('No se encontró información del usuario. Por favor, inicia sesión.');
        this.$router.push('/login'); // Redirige a la pantalla de login
      }
    },
    methods: {
      async crearSolicitud() {
        try {
          const token = localStorage.getItem('accessToken'); // Obtener el token de autenticación
          const response = await axios.post(
            'https://wxsoporte.onrender.com/api/solicitudes/',
            this.solicitud,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          alert('Solicitud creada con éxito.');
          this.$router.push('/solicitudes'); // Redirige a la lista de solicitudes
        } catch (error) {
          console.error('Error al crear la solicitud:', error);
          alert('Hubo un error al crear la solicitud. Inténtalo nuevamente.');
        }
      }
    }
  };
  </script>
  