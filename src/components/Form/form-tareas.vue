<template>
  <div class="min-h-screen bg-gray-50 py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Encabezado -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Gestión de Tareas</h1>
        <p class="mt-1 text-sm text-gray-600">Administre y organice las tareas del sistema</p>
      </div>

      <!-- Panel de Control -->
      <div class="bg-white rounded-2xl shadow-sm mb-6">
        <div class="p-6">
          <div class="flex flex-col sm:flex-row items-center gap-4">
            <!-- Botón Nueva Tarea -->
            <button 
              @click="showModalCreate = true"
              class="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Nueva Tarea
            </button>
            
            <!-- Barra de búsqueda -->
            <div class="flex-grow">
              <div class="relative">
                <input 
                  type="text" 
                  v-model="searchQuery" 
                  @input="filterTareas" 
                  placeholder="Buscar tareas..."
                  class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                />
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla de Tareas -->
      <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr class="bg-gray-50">
                <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solicitud</th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="tarea in filteredTareas" 
                  :key="tarea.id" 
                  class="hover:bg-gray-50 transition-colors duration-200">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ tarea.id }}</td>
                <td class="px-6 py-4 text-sm text-gray-500 max-w-md truncate">{{ tarea.descripcion }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(tarea.fecha_creacion) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ tarea.solicitud }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                  <button 
                    @click="editTarea(tarea.id)"
                    class="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button 
                    @click="deleteTarea(tarea.id)"
                    class="text-red-600 hover:text-red-900 transition-colors duration-200"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal de Crear/Editar -->
      <div v-if="showModalCreate || showModalEdit" 
           class="fixed inset-0 z-50 overflow-y-auto"
           aria-labelledby="modal-title" 
           role="dialog" 
           aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
               aria-hidden="true"
               @click="closeModal"></div>

          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <form @submit.prevent="showModalCreate ? createTarea() : updateTarea()">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                  {{ showModalCreate ? 'Crear Nueva Tarea' : 'Editar Tarea' }}
                </h3>
                
                <div class="space-y-4">
                  <!-- Campo Descripción -->
                  <div>
                    <label for="descripcion" class="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      id="descripcion"
                      v-model="currentTarea.descripcion"
                      rows="3"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      placeholder="Ingrese la descripción de la tarea"
                    ></textarea>
                  </div>

                  <!-- Campo Solicitud -->
                  <div>
                    <label for="solicitud" class="block text-sm font-medium text-gray-700 mb-1">
                      Solicitud
                    </label>
                    <select
                      id="solicitud"
                      v-model="currentTarea.solicitud"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    >
                      <option value="" disabled>Seleccione una solicitud</option>
                      <option v-for="solicitud in solicitudes" 
                              :key="solicitud.id" 
                              :value="solicitud.id">
                        {{ solicitud.id }} - {{ solicitud.modulo }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Botones del Modal -->
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200"
                >
                  {{ showModalCreate ? 'Crear' : 'Guardar' }}
                </button>
                <button
                  type="button"
                  @click="closeModal"
                  class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
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