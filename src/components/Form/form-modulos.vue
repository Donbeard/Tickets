<template>
  <div class="min-h-screen bg-gray-100 py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Sección de Módulos con Submódulos -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 class="text-lg font-medium text-gray-900">Módulos y Submódulos</h2>
          <div class="p-4 flex justify-between items-center">
            <!-- Búsqueda de módulos -->
            <div class="relative w-64">
              <input
                v-model="searchModulo"
                type="text"
                placeholder="Buscar módulo..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          <button
            @click="handleNewModulo"
            class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Nuevo Módulo
          </button>
        </div>
        
        <!-- Tabla Maestro-Detalle -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="w-10 px-6 py-3"></th> <!-- Columna para expandir/colapsar -->
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <template v-for="modulo in sortedModulos" :key="modulo.id">
                <!-- Fila del Módulo -->
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4">
                    <button 
                      @click="toggleModulo(modulo)"
                      class="text-gray-500 hover:text-gray-700"
                    >
                      <ChevronRightIcon 
                        class="h-5 w-5 transform transition-transform duration-200"
                        :class="{'rotate-90': selectedModulo?.id === modulo.id}"
                      />
                    </button>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ modulo.id }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ modulo.nombre }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500">
                    {{ modulo.descripcion || '-' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      @click="editModulo(modulo)"
                      class="text-indigo-600 hover:text-indigo-900 mx-2"
                    >
                      <PencilIcon class="h-5 w-5" />
                    </button>
                    <button
                      @click="handleDelete(modulo)"
                      class="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon class="h-5 w-5" />
                    </button>
                  </td>
                </tr>

                <!-- Submódulos (expandibles) -->
                <tr v-if="selectedModulo?.id === modulo.id">
                  <td colspan="5" class="px-6 py-4 bg-gray-50">
                    <div class="border rounded-lg overflow-hidden">
                      <div class="bg-gray-100 px-4 py-2 flex justify-between items-center">
                        <h3 class="text-sm font-medium text-gray-700">Submódulos</h3>
                          <div class="bg-gray-100 px-4 py-2 flex justify-between items-center">
                            <div class="relative w-64">
                              <input
                                v-model="searchSubmodulo"
                                type="text"
                                placeholder="Buscar submódulo..."
                                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              >
                              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                              </div>
                            </div>
                          </div>
                          <button
                            @click="handleNewSubmodulo"
                            class="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            Nuevo Submódulo
                          </button>
                        </div>
                      
                      
                      
                      <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                          <tr>
                            <th class="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th class="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th class="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                            <th class="px-6 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                          </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                          <tr v-for="submodulo in sortedSubmodulos" :key="submodulo.id">
                            <td class="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                              {{ submodulo.id }}
                            </td>
                            <td class="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                              {{ submodulo.nombre }}
                            </td>
                            <td class="px-6 py-3 text-sm text-gray-500">
                              {{ submodulo.descripcion || '-' }}
                            </td>
                            <td class="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                @click="editSubmodulo(submodulo)"
                                class="text-indigo-600 hover:text-indigo-900 mx-2"
                              >
                                <PencilIcon class="h-5 w-5" />
                              </button>
                              <button
                                @click="handleDeleteSubmodulo(submodulo)"
                                class="text-red-600 hover:text-red-900"
                              >
                                <TrashIcon class="h-5 w-5" />
                              </button>
                            </td>
                          </tr>
                          <tr v-if="sortedSubmodulos.length === 0">
                            <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">
                              No hay submódulos para este módulo
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal para Módulo -->
    <div v-if="showModuloModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all">
        <!-- Header del modal -->
        <div class="bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-4 rounded-t-lg">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold text-white">
              {{ editingModulo ? 'Editar' : 'Nuevo' }} Módulo
            </h2>
            <button 
              @click="closeModuloModal"
              class="text-white hover:text-gray-200 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Contenido del modal -->
        <form @submit.prevent="submitModulo" class="p-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Código</label>
              <input 
                v-model="moduloForm.codigo" 
                type="text" 
                readonly
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-600 sm:text-sm"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
              <input 
                v-model="moduloForm.nombre" 
                type="text"
                required
                maxlength="50"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                placeholder="Ingrese el nombre"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea 
                v-model="moduloForm.descripcion"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors resize-none"
                placeholder="Ingrese una descripción"
              ></textarea>
            </div>
          </div>

          <!-- Footer del modal -->
          <div class="mt-6 flex justify-end gap-3">
            <button 
              type="button"
              @click="closeModuloModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              {{ editingModulo ? 'Actualizar' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal para Submódulo -->
    <div v-if="showSubmoduloModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all">
        <!-- Header del modal -->
        <div class="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 rounded-t-lg">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold text-white">
              {{ editingSubmodulo ? 'Editar' : 'Nuevo' }} Submódulo
            </h2>
            <button 
              @click="closeSubmoduloModal"
              class="text-white hover:text-gray-200 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Contenido del modal -->
        <form @submit.prevent="submitSubmodulo" class="p-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Código</label>
              <input 
                v-model="submoduloForm.codigo" 
                type="text" 
                readonly
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-600 sm:text-sm"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
              <input 
                v-model="submoduloForm.nombre" 
                type="text"
                required
                maxlength="100"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                placeholder="Ingrese el nombre"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea 
                v-model="submoduloForm.descripcion"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors resize-none"
                placeholder="Ingrese una descripción"
              ></textarea>
            </div>
          </div>

          <!-- Footer del modal -->
          <div class="mt-6 flex justify-end gap-3">
            <button 
              type="button"
              @click="closeSubmoduloModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              {{ editingSubmodulo ? 'Actualizar' : 'Guardar' }}
            </button>
          </div>
        </form>
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
import { PencilIcon, TrashIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';

export default {
  components: {
    PencilIcon,
    TrashIcon,
    ChevronRightIcon
  },
  data() {
    return {
      modulos: [],
      submodulos: [],
      selectedModulo: null,
      showModuloModal: false,
      showSubmoduloModal: false,
      editingModulo: null,
      editingSubmodulo: null,
      moduloForm: {
        codigo: '',
        nombre: '',
        descripcion: ''
      },
      submoduloForm: {
        codigo: '',
        nombre: '',
        descripcion: '',
        modulo: null
      },
      showToast: false,
      statusMessage: '',
      isSuccess: true,
      toastTimeout: null,
      searchModulo: '',
      searchSubmodulo: ''
    };
  },

  computed: {
    filteredModulos() {
      return this.modulos.filter(modulo =>
        modulo.nombre.toLowerCase().includes(this.searchModulo.toLowerCase()) ||
        modulo.id.toString().includes(this.searchModulo)
      );
    },
    
    sortedModulos() {
      return [...this.filteredModulos].sort((a, b) => a.nombre.localeCompare(b.nombre));
    },

    filteredSubmodulos() {
      const filtered = this.submodulos.filter(s => s.modulo === this.selectedModulo?.id);
      return filtered.filter(submodulo =>
        submodulo.nombre.toLowerCase().includes(this.searchSubmodulo.toLowerCase()) ||
        submodulo.id.toString().includes(this.searchSubmodulo)
      );
    },

    sortedSubmodulos() {
      return [...this.filteredSubmodulos].sort((a, b) => a.nombre.localeCompare(b.nombre));
    }
  },

  methods: {
    async fetchModulos() {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          this.showNotification('No se encontró el token de acceso', false);
          this.$router.push('/login');
          return;
        }

        const response = await apiClient.get('/modulos/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        this.modulos = response.data;
      } catch (error) {
        console.error('Error al obtener módulos:', error);
        this.showNotification('Error al cargar los módulos', false);
      }
    },

    async fetchSubmodulos() {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

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

    selectModulo(modulo) {
      this.selectedModulo = modulo;
    },

    handleNewModulo() {
      this.editingModulo = null;
      this.moduloForm = {
        codigo: this.generateModuloCode(),
        nombre: '',
        descripcion: ''
      };
      this.showModuloModal = true;
    },

    handleNewSubmodulo() {
      if (!this.selectedModulo) return;
      
      this.editingSubmodulo = null;
      this.submoduloForm = {
        codigo: this.generateSubmoduloCode(),
        nombre: '',
        descripcion: '',
        modulo: this.selectedModulo.id
      };
      this.showSubmoduloModal = true;
    },

    editModulo(modulo) {
      this.editingModulo = modulo;
      this.moduloForm = { ...modulo };
      this.showModuloModal = true;
    },

    editSubmodulo(submodulo) {
      this.editingSubmodulo = submodulo;
      this.submoduloForm = { ...submodulo };
      this.showSubmoduloModal = true;
    },

    async submitModulo() {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        const url = this.editingModulo 
          ? `/modulos/${this.editingModulo.id}/` 
          : '/modulos/';
        const method = this.editingModulo ? 'put' : 'post';

        await apiClient[method](url, this.moduloForm, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        await this.fetchModulos();
        this.closeModuloModal();
        this.showNotification(
          `Módulo ${this.editingModulo ? 'actualizado' : 'creado'} exitosamente`
        );
      } catch (error) {
        console.error('Error al guardar el módulo:', error);
        this.showNotification('Error al guardar el módulo', false);
      }
    },

    async submitSubmodulo() {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        const url = this.editingSubmodulo 
          ? `/submodulos/${this.editingSubmodulo.id}/` 
          : '/submodulos/';
        const method = this.editingSubmodulo ? 'put' : 'post';

        await apiClient[method](url, this.submoduloForm, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        await this.fetchSubmodulos();
        this.closeSubmoduloModal();
        this.showNotification(
          `Submódulo ${this.editingSubmodulo ? 'actualizado' : 'creado'} exitosamente`
        );
      } catch (error) {
        console.error('Error al guardar el submódulo:', error);
        this.showNotification('Error al guardar el submódulo', false);
      }
    },

    async handleDelete(modulo) {
      if (!confirm('¿Está seguro de eliminar este módulo?')) return;

      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        await apiClient.delete(`/modulos/${modulo.id}/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        await this.fetchModulos();
        if (this.selectedModulo?.id === modulo.id) {
          this.selectedModulo = null;
        }
        this.showNotification('Módulo eliminado exitosamente');
      } catch (error) {
        console.error('Error al eliminar el módulo:', error);
        this.showNotification('Error al eliminar el módulo', false);
      }
    },

    async handleDeleteSubmodulo(submodulo) {
      if (!confirm('¿Está seguro de eliminar este submódulo?')) return;

      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        await apiClient.delete(`/submodulos/${submodulo.id}/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        await this.fetchSubmodulos();
        this.showNotification('Submódulo eliminado exitosamente');
      } catch (error) {
        console.error('Error al eliminar el submódulo:', error);
        this.showNotification('Error al eliminar el submódulo', false);
      }
    },

    closeModuloModal() {
      this.showModuloModal = false;
      this.editingModulo = null;
      this.moduloForm = {
        codigo: '',
        nombre: '',
        descripcion: ''
      };
    },

    closeSubmoduloModal() {
      this.showSubmoduloModal = false;
      this.editingSubmodulo = null;
      this.submoduloForm = {
        codigo: '',
        nombre: '',
        descripcion: '',
        modulo: this.selectedModulo?.id || null
      };
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

    generateModuloCode() {
      if (!this.modulos.length) return '1';
      
      const lastCode = Math.max(...this.modulos.map(m => {
        const num = parseInt(m.codigo);
        return isNaN(num) ? 0 : num;
      }));
      
      return String(lastCode + 1);
    },

    generateSubmoduloCode() {
      if (!this.submodulos.length) return '1';
      
      const lastCode = Math.max(...this.submodulos.map(s => {
        const num = parseInt(s.codigo);
        return isNaN(num) ? 0 : num;
      }));
      
      return String(lastCode + 1);
    },

    formatModuloCode(codigo) {
      return codigo;
    },

    formatSubmoduloCode(submodulo) {
      const modulo = this.modulos.find(m => m.id === submodulo.modulo);
      return `${modulo?.codigo}-${submodulo.codigo}`;
    },

    toggleModulo(modulo) {
      this.selectedModulo = this.selectedModulo?.id === modulo.id ? null : modulo;
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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Estilos adicionales para hover y focus */
.hover\:shadow-lg:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.transition {
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>