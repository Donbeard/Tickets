<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Overlay con efecto de blur -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" aria-hidden="true"></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full border border-gray-200">
        <!-- Header con gradiente -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <h3 class="text-2xl font-bold text-white flex items-center">
            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Nueva Empresa
          </h3>
        </div>

        <!-- Contenido del formulario -->
        <div class="bg-white px-6 pt-6 pb-4 sm:p-8 sm:pb-6">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-2 gap-x-6 gap-y-4">
              <!-- Campos del formulario mejorados con layout horizontal -->
              <div class="flex items-center">
                <label class="w-1/4 text-sm font-medium text-gray-700">NIT:</label>
                <div class="w-3/4">
                  <input 
                    type="text" 
                    v-model="formData.nit"
                    required
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Ej. 123456789"
                  />
                </div>
              </div>

              <div class="flex items-center">
                <label class="w-1/4 text-sm font-medium text-gray-700">Nombre:</label>
                <div class="w-3/4">
                  <input 
                    type="text" 
                    v-model="formData.nombre"
                    required
                    maxlength="100"
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Nombre de la empresa"
                  />
                </div>
              </div>

              <div class="flex items-center">
                <label class="w-1/4 text-sm font-medium text-gray-700">Dirección:</label>
                <div class="w-3/4">
                  <input 
                    type="text" 
                    v-model="formData.direccion"
                    required
                    maxlength="100"
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Dirección completa"
                  />
                </div>
              </div>

              <div class="flex items-center">
                <label class="w-1/4 text-sm font-medium text-gray-700">Teléfono:</label>
                <div class="w-3/4">
                  <input 
                    type="text" 
                    v-model="formData.telefono"
                    required
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Teléfono principal"
                  />
                </div>
              </div>

              <div class="flex items-center">
                <label class="w-1/4 text-sm font-medium text-gray-700">Email:</label>
                <div class="w-3/4">
                  <input 
                    type="email" 
                    v-model="formData.email"
                    required
                    maxlength="255"
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="correo@empresa.com"
                  />
                </div>
              </div>

              <div class="flex items-center">
                <label class="w-1/4 text-sm font-medium text-gray-700">WhatsApp:</label>
                <div class="w-3/4">
                  <input 
                    type="text" 
                    v-model="formData.whatsapp"
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="WhatsApp (opcional)"
                  />
                </div>
              </div>

              <div class="flex items-center">
                <label class="w-1/4 text-sm font-medium text-gray-700">Estado:</label>
                <div class="w-3/4">
                  <select 
                    v-model="formData.activo"
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  >
                    <option value="A">Activo</option>
                    <option value="I">Inactivo</option>
                  </select>
                </div>
              </div>

              <div class="flex items-center">
                <label class="w-1/4 text-sm font-medium text-gray-700">Licencia:</label>
                <div class="w-3/4">
                  <input 
                    type="text" 
                    v-model="formData.licencia"
                    required
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-gray-50"
                    readonly
                  />
                </div>
              </div>

              <div class="flex items-center">
                <label class="w-1/4 text-sm font-medium text-gray-700">F. Inicio:</label>
                <div class="w-3/4">
                  <input 
                    type="date" 
                    v-model="formData.fecha_inicio"
                    required
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  />
                </div>
              </div>

              <div class="flex items-center">
                <label class="w-1/4 text-sm font-medium text-gray-700">F. Fin:</label>
                <div class="w-3/4">
                  <input 
                    type="date" 
                    v-model="formData.fecha_fin"
                    required
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  />
                </div>
              </div>

              <div class="flex items-center">
                <label class="w-1/4 text-sm font-medium text-gray-700">Usuarios:</label>
                <div class="w-3/4">
                  <input 
                    type="number" 
                    v-model="formData.cantidad_usuarios"
                    required
                    min="1"
                    max="999"
                    class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    placeholder="Cantidad de usuarios"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- Footer con gradiente -->
        <div class="bg-gradient-to-r from-gray-50 to-white px-6 py-4 sm:px-8 sm:flex sm:flex-row-reverse gap-3 border-t border-gray-200">
          <button 
            @click="handleSubmit"
            type="button" 
            class="w-full sm:w-auto inline-flex justify-center items-center rounded-md px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-sm hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Crear Empresa
          </button>
          <button 
            @click="$emit('close')" 
            type="button" 
            class="mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center items-center rounded-md px-6 py-2.5 border border-gray-300 bg-white text-gray-700 font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Toast notification usando Teleport -->
  <Teleport to="body">
    <Transition
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showToast"
        style="position: fixed; top: 1rem; right: 1rem; z-index: 9999; pointer-events: auto;"
        class="max-w-sm w-full bg-white shadow-lg rounded-lg ring-1 ring-black ring-opacity-5 overflow-hidden"
      >
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg
                v-if="isSuccess"
                class="h-6 w-6 text-green-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <svg
                v-else
                class="h-6 w-6 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p :class="[isSuccess ? 'text-green-700' : 'text-red-700']" class="text-sm font-medium">
                {{ statusMessage }}
              </p>
            </div>
            <div class="ml-4 flex-shrink-0 flex">
              <button
                @click="showToast = false"
                class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <span class="sr-only">Cerrar</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import { ref } from 'vue'
import apiClient from '@/apiClient'
import { v4 as uuidv4 } from 'uuid'

export default {
  name: 'CreateEmpresa',
  emits: ['close', 'created'],
  
  setup(props, { emit }) {
    const formData = ref({
      nit: '',
      nombre: '',
      direccion: '',
      telefono: '',
      email: '',
      whatsapp: '',
      activo: 'A',
      licencia: uuidv4(),
      fecha_inicio: new Date().toISOString().split('T')[0], // Fecha actual por defecto
      fecha_fin: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0], // Un año después por defecto
      cantidad_usuarios: 1
    })

    // Sistema de notificaciones toast
    const showToast = ref(false)
    const isSuccess = ref(true)
    const statusMessage = ref('')

    const showToastMessage = (message, success = true) => {
      statusMessage.value = message
      isSuccess.value = success
      showToast.value = true
      
      // Auto-hide toast after 5 seconds
      setTimeout(() => {
        showToast.value = false
      }, 5000)
    }

    const handleSubmit = async () => {
      try {
        const response = await apiClient.post('/terceros/', formData.value)
        showToastMessage('Empresa creada correctamente', true)
        emit('created', response.data)
        emit('close')
      } catch (error) {
        console.error('Error creating empresa:', error)
        showToastMessage('Error al crear la empresa. Por favor, intente de nuevo.', false)
      }
    }

    return {
      formData,
      handleSubmit,
      showToast,
      isSuccess,
      statusMessage,
      showToastMessage
    }
  }
}
</script>

<style scoped>
/* Efecto hover para campos */
input:hover, select:hover {
  border-color: rgb(156, 163, 175);
}

/* Transiciones suaves */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Mejoras estéticas para campos de entrada */
input, select {
  background-color: rgb(249, 250, 251);
}

input:focus, select:focus {
  background-color: white;
}

/* Efecto para campos readonly */
input[readonly] {
  background-color: #f3f4f6;
  cursor: not-allowed;
}
</style> 