<template>
  <div class="min-h-screen bg-gray-100 py-6">
    <div class="max-w-6xl mx-auto">
      <div class="p-6">
        <!-- Grid container con responsive -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Primer cuadro - Lista de Módulos -->
          <div class="bg-white rounded-lg shadow-md p-6 h-fit self-start">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-semibold text-gray-800">Módulos</h2>
              <button
                @click="handleNewModulo"
                class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
              >
                Nuevo Módulo
              </button>
            </div>
            <div class="space-y-2">
              <div 
                v-for="modulo in modulos" 
                :key="modulo.id"
                @click="selectModulo(modulo)"
                :class="[
                  'p-4 rounded-lg border transition-all duration-200 cursor-pointer',
                  selectedModulo?.id === modulo.id 
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                ]"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <span class="text-sm font-medium text-gray-600">
                      {{ formatModuloCode(modulo.codigo) }}
                    </span>
                    <span class="font-medium text-gray-900">{{ modulo.nombre }}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <button
                      @click.stop="editModulo(modulo)"
                      class="text-gray-400 hover:text-indigo-600 transition-colors"
                    >
                      <PencilIcon class="h-5 w-5" />
                    </button>
                    <button
                      @click.stop="handleDelete(modulo)"
                      class="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <TrashIcon class="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <p v-if="modulo.descripcion" class="mt-1 text-sm text-gray-500">
                  {{ modulo.descripcion }}
                </p>
              </div>
            </div>
          </div>

          <!-- Segundo cuadro - Lista de Submódulos -->
          <div class="bg-white rounded-lg shadow-md p-6 h-fit self-start">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-semibold text-gray-800">Submódulos</h2>
              <button
                @click="handleNewSubmodulo"
                :disabled="!selectedModulo"
                class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Nuevo Submódulo
              </button>
            </div>
            <div v-if="selectedModulo" class="space-y-2">
              <div 
                v-for="submodulo in filteredSubmodulos" 
                :key="submodulo.id"
                class="p-4 rounded-lg border border-gray-200 hover:border-indigo-300 transition-all duration-200"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <span class="text-sm font-medium text-gray-600">
                      {{ formatSubmoduloCode(submodulo) }}
                    </span>
                    <span class="font-medium text-gray-900">{{ submodulo.nombre }}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <button
                      @click="editSubmodulo(submodulo)"
                      class="text-gray-400 hover:text-indigo-600 transition-colors"
                    >
                      <PencilIcon class="h-5 w-5" />
                    </button>
                    <button
                      @click="handleDeleteSubmodulo(submodulo)"
                      class="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <TrashIcon class="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <p v-if="submodulo.descripcion" class="mt-1 text-sm text-gray-500">
                  {{ submodulo.descripcion }}
                </p>
              </div>
            </div>
            <div v-else class="text-center py-8 text-gray-500">
              Selecciona un módulo para ver sus submódulos
            </div>
          </div>
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
                maxlength="20"
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
                maxlength="20"
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
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/outline';

export default {
  components: {
    PencilIcon,
    TrashIcon
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
      toastTimeout: null
    };
  },

  computed: {
    filteredSubmodulos() {
      return this.submodulos.filter(s => s.modulo === this.selectedModulo?.id);
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