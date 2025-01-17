<template>
  <div class="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Gestión de Tareas</h1>
      
      <!-- Controls Section -->
      <div class="bg-white shadow-md rounded-lg p-6 mb-8">
        <div class="flex flex-wrap items-center gap-4 mb-6">
          <button 
            @click="showModalCreate = true"
            class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out"
          >
            Nueva Tarea
          </button>
          
          <!-- Search Input -->
          <div class="flex-grow">
            <label for="search" class="sr-only">Buscar</label>
            <div class="relative">
              <input 
                id="search"
                type="text" 
                v-model="searchQuery" 
                @input="filterTareas" 
                placeholder="Buscar por descripción"
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tareas Table -->
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Creación</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solicitud</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="tarea in filteredTareas" :key="tarea.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ tarea.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ tarea.descripcion }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(tarea.fecha_creacion) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ tarea.solicitud }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button @click="editTarea(tarea.id)" class="text-indigo-600 hover:text-indigo-900 mr-2">Editar</button>
                <button @click="deleteTarea(tarea.id)" class="text-red-600 hover:text-red-900">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-if="errorMessage" class="mt-4 text-red-600 text-sm">{{ errorMessage }}</p>
    </div>

    <!-- Modal Crear/Editar -->
    <div v-if="showModalCreate || showModalEdit" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form @submit.prevent="showModalCreate ? createTarea() : updateTarea()">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                {{ showModalCreate ? 'Crear Nueva Tarea' : 'Editar Tarea' }}
              </h3>
              <div class="mt-2 space-y-4">
                <div>
                  <label for="descripcion" class="block text-sm font-medium text-gray-700">Descripción:</label>
                  <input 
                    id="descripcion" 
                    v-model="currentTarea.descripcion" 
                    type="text" 
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                </div>
                <div>
                  <label for="solicitud" class="block text-sm font-medium text-gray-700">Solicitud:</label>
                  <select 
                    id="solicitud" 
                    v-model="currentTarea.solicitud" 
                    required
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option v-for="solicitud in solicitudes" :key="solicitud.id" :value="solicitud.id">
                      {{ solicitud.id }} - {{ solicitud.modulo }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                type="submit" 
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {{ showModalCreate ? 'Crear' : 'Guardar' }}
              </button>
              <button 
                @click="closeModal" 
                type="button" 
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted} from 'vue';
import apiClient from '@/apiClient';

export default {
  setup() {
    const tareas = ref([]);
    const filteredTareas = ref([]);
    const solicitudes = ref([]);
    const searchQuery = ref('');
    const errorMessage = ref('');
    const showModalCreate = ref(false);
    const showModalEdit = ref(false);
    const currentTarea = ref({
      descripcion: '',
      solicitud: null
    });

    const fetchTareas = async () => {
      try {
        const response = await apiClient.get('/tareas/');
        tareas.value = response.data;
        filterTareas();
      } catch (error) {
        console.error('Error al obtener tareas:', error);
        errorMessage.value = 'Error al cargar las tareas. Por favor, intente de nuevo.';
      }
    };

    const fetchSolicitudes = async () => {
      try {
        const response = await apiClient.get('/solicitudes/');
        solicitudes.value = response.data;
      } catch (error) {
        console.error('Error al obtener solicitudes:', error);
        errorMessage.value = 'Error al cargar las solicitudes. Por favor, intente de nuevo.';
      }
    };

    const filterTareas = () => {
      filteredTareas.value = tareas.value.filter(tarea =>
        tarea.descripcion.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    };

    const createTarea = async () => {
      try {
        await apiClient.post('/tareas/', currentTarea.value);
        await fetchTareas();
        closeModal();
        alert('Tarea creada exitosamente');
      } catch (error) {
        console.error('Error al crear tarea:', error);
        errorMessage.value = 'Error al crear la tarea. Por favor, intente de nuevo.';
      }
    };

    const editTarea = async (id) => {
      try {
        const response = await apiClient.get(`/tareas/${id}/`);
        currentTarea.value = response.data;
        showModalEdit.value = true;
      } catch (error) {
        console.error('Error al obtener detalles de la tarea:', error);
        errorMessage.value = 'Error al cargar los detalles de la tarea. Por favor, intente de nuevo.';
      }
    };

    const updateTarea = async () => {
      try {
        await apiClient.put(`/tareas/${currentTarea.value.id}/`, currentTarea.value);
        await fetchTareas();
        closeModal();
        alert('Tarea actualizada exitosamente');
      } catch (error) {
        console.error('Error al actualizar tarea:', error);
        errorMessage.value = 'Error al actualizar la tarea. Por favor, intente de nuevo.';
      }
    };

    const deleteTarea = async (id) => {
      if (confirm('¿Está seguro de que desea eliminar esta tarea?')) {
        try {
          await apiClient.delete(`/tareas/${id}/`);
          await fetchTareas();
          alert('Tarea eliminada exitosamente');
        } catch (error) {
          console.error('Error al eliminar tarea:', error);
          errorMessage.value = 'Error al eliminar la tarea. Por favor, intente de nuevo.';
        }
      }
    };

    const closeModal = () => {
      showModalCreate.value = false;
      showModalEdit.value = false;
      currentTarea.value = { descripcion: '', solicitud: null };
    };

    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('es-ES', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    };

    onMounted(() => {
      fetchTareas();
      fetchSolicitudes();
    });

    return {
      tareas,
      filteredTareas,
      solicitudes,
      searchQuery,
      errorMessage,
      showModalCreate,
      showModalEdit,
      currentTarea,
      filterTareas,
      createTarea,
      editTarea,
      updateTarea,
      deleteTarea,
      closeModal,
      formatDate
    };
  }
};
</script>