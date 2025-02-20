<template>
  <div class="min-h-screen bg-gray-100 py-6">
    <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <!-- Header con gradiente -->
      <div class="bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-white flex items-center">
            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
            Gestión de Submódulos
          </h1>
          
          <!-- Botón Nuevo Submódulo -->
          <button 
            @click="handleNewSubmodulo"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Nuevo Submódulo
          </button>
        </div>
      </div>

      <!-- Formulario -->
      <div class="p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Código -->
          <div class="relative">
            <label for="codigo" class="block text-sm font-medium text-gray-700">Código *</label>
            <input 
              v-model="form.codigo" 
              type="text" 
              id="codigo" 
              maxlength="10"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Ingrese el código del submódulo"
            >
          </div>

          <!-- Nombre -->
          <div class="relative">
            <label for="nombre" class="block text-sm font-medium text-gray-700">Nombre</label>
            <input 
              v-model="form.nombre" 
              type="text" 
              id="nombre" 
              maxlength="20"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Ingrese el nombre del submódulo"
            >
          </div>

          <!-- Módulo -->
          <div class="relative">
            <label for="modulo" class="block text-sm font-medium text-gray-700">Módulo *</label>
            <select 
              v-model="form.modulo" 
              id="modulo"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Seleccione un módulo</option>
              <option v-for="modulo in modulos" :key="modulo.id" :value="modulo.id">
                {{ modulo.nombre }}
              </option>
            </select>
          </div>

          <!-- Descripción -->
          <div class="relative">
            <label for="descripcion" class="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea 
              v-model="form.descripcion" 
              id="descripcion" 
              rows="4"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm resize-none"
              placeholder="Ingrese una descripción del submódulo"
            ></textarea>
          </div>

          <!-- Botones de acción -->
          <div class="flex gap-4">
            <button 
              type="submit" 
              class="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              {{ editingId ? 'Actualizar' : 'Guardar' }}
            </button>
            <button 
              v-if="editingId"
              type="button" 
              @click="handleDelete"
              class="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Eliminar
            </button>
          </div>
        </form>

        <!-- Lista de submódulos -->
        <div class="mt-8">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Lista de Submódulos</h2>
          <div class="bg-white shadow overflow-hidden sm:rounded-md">
            <ul class="divide-y divide-gray-200">
              <li v-for="submodulo in submodulos" :key="submodulo.id" class="hover:bg-gray-50">
                <div class="px-4 py-4 sm:px-6">
                  <div class="flex items-center justify-between">
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center">
                        <p class="text-sm font-medium text-indigo-600 truncate">{{ submodulo.codigo }}</p>
                        <span class="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {{ submodulo.nombre }}
                        </span>
                        <span class="ml-2 text-sm text-gray-500">
                          Módulo: {{ getModuloNombre(submodulo.modulo) }}
                        </span>
                      </div>
                      <p class="mt-1 text-sm text-gray-500">{{ submodulo.descripcion }}</p>
                    </div>
                    <div class="ml-4 flex-shrink-0">
                      <button 
                        @click="editSubmodulo(submodulo)"
                        class="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        Editar
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast de notificación -->
    <div 
      v-if="showToast"
      class="fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg text-white"
      :class="[isSuccess ? 'bg-green-500' : 'bg-red-500']"
    >
      {{ statusMessage }}
    </div>
  </div>
</template>

<script>
import apiClient from '@/apiClient';

export default {
  data() {
    return {
      form: {
        codigo: '',
        nombre: '',
        descripcion: '',
        modulo: ''
      },
      submodulos: [],
      modulos: [],
      editingId: null,
      showToast: false,
      statusMessage: '',
      isSuccess: true,
      toastTimeout: null
    };
  },
  methods: {
    async fetchSubmodulos() {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          this.showNotification('No se encontró el token de acceso', false);
          this.$router.push('/login');
          return;
        }

        const response = await apiClient.get('/submodulos/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        this.submodulos = response.data;
      } catch (error) {
        console.error('Error al obtener submódulos:', error);
        this.showNotification('Error al cargar los submódulos', false);
      }
    },

    async fetchModulos() {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        const response = await apiClient.get('/modulos/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        this.modulos = response.data;
      } catch (error) {
        console.error('Error al obtener módulos:', error);
      }
    },

    async handleSubmit() {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          this.showNotification('No se encontró el token de acceso', false);
          this.$router.push('/');
          return;
        }

        const url = this.editingId ? `/submodulos/${this.editingId}/` : '/submodulos/';
        const method = this.editingId ? 'put' : 'post';

        await apiClient[method](url, this.form, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        await this.fetchSubmodulos();
        this.resetForm();
        this.showNotification(
          `Submódulo ${this.editingId ? 'actualizado' : 'creado'} exitosamente`, 
          true
        );
      } catch (error) {
        console.error('Error al guardar el submódulo:', error);
        this.showNotification('Error al guardar el submódulo', false);
      }
    },

    async handleDelete() {
      if (!confirm('¿Está seguro de eliminar este submódulo?')) return;

      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        await apiClient.delete(`/submodulos/${this.editingId}/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        await this.fetchSubmodulos();
        this.resetForm();
        this.showNotification('Submódulo eliminado exitosamente', true);
      } catch (error) {
        console.error('Error al eliminar el submódulo:', error);
        this.showNotification('Error al eliminar el submódulo', false);
      }
    },

    handleNewSubmodulo() {
      this.resetForm();
      document.querySelector('form').scrollIntoView({ behavior: 'smooth' });
    },

    editSubmodulo(submodulo) {
      this.form = { ...submodulo };
      this.editingId = submodulo.id;
      document.querySelector('form').scrollIntoView({ behavior: 'smooth' });
    },

    resetForm() {
      this.form = {
        codigo: '',
        nombre: '',
        descripcion: '',
        modulo: ''
      };
      this.editingId = null;
    },

    showNotification(message, success = true) {
      this.statusMessage = message;
      this.isSuccess = success;
      this.showToast = true;

      if (this.toastTimeout) {
        clearTimeout(this.toastTimeout);
      }

      this.toastTimeout = setTimeout(() => {
        this.showToast = false;
        this.statusMessage = '';
      }, 3000);
    },

    getModuloNombre(moduloId) {
      const modulo = this.modulos.find(m => m.id === moduloId);
      return modulo ? modulo.nombre : 'No encontrado';
    }
  },
  async mounted() {
    await this.fetchModulos();
    await this.fetchSubmodulos();
  },
  beforeUnmount() {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
  }
};
</script>
