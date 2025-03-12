<template>
    <div class="space-y-4">
      <!-- Información de la licencia -->
      <div v-if="licencia" class="bg-white rounded-lg border border-gray-200">
        <div class="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h3 class="text-sm font-medium text-gray-900">Información de Licencia</h3>
        </div>
        
        <div class="p-4">
          <form @submit.prevent="handleSubmit" class="space-y-4">
  
            <!-- UUID de Licencia (readonly) -->
            <div class="grid grid-cols-3 gap-4 items-center">
              <label class="text-xs font-medium text-gray-700">UUID Licencia:</label>
              <div class="col-span-2">
                <input 
                  type="text" 
                  v-model="formData.licencia" 
                  readonly
                  class="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-gray-50 cursor-not-allowed"
                />
              </div>
            </div>
  
            <!-- Fecha Inicio -->
            <div class="grid grid-cols-3 gap-4 items-center">
              <label class="text-xs font-medium text-gray-700">Fecha Inicio:</label>
              <div class="col-span-2">
                <input 
                  type="date" 
                  v-model="formData.fecha_inicio"
                  class="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
  
            <!-- Fecha Fin -->
            <div class="grid grid-cols-3 gap-4 items-center">
              <label class="text-xs font-medium text-gray-700">Fecha Fin:</label>
              <div class="col-span-2">
                <input 
                  type="date" 
                  v-model="formData.fecha_fin"
                  class="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
  
            <!-- Cantidad de Usuarios -->
            <div class="grid grid-cols-3 gap-4 items-center">
              <label class="text-xs font-medium text-gray-700">Cantidad de Usuarios:</label>
              <div class="col-span-2">
                <input 
                  type="number" 
                  v-model="formData.cantidad_usuarios"
                  min="1"
                  class="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
  
            <!-- Botones de acción -->
            <div class="flex justify-end space-x-2 pt-4 border-t">
              <button
                type="submit"
                class="px-3 py-1 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
  
      <!-- Mensaje y botón cuando no hay licencia -->
      <div v-else class="text-center py-4 space-y-4">
        <p class="text-sm text-gray-500">Esta empresa no tiene licencia asignada.</p>
        <button
          @click="showCreateModal = true"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Añadir Licencia
        </button>
      </div>
  
      <!-- Modal de creación de licencia -->
      <CreateLicencia 
        v-if="showCreateModal"
        :terceroId="empresaId"
        :fromTab="true"
        @close="showCreateModal = false"
        @created="onLicenciaCreated"
      />
  
      <!-- Toast de notificación -->
      <div 
        v-if="showToast"
        class="fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg"
        :class="isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
      >
        {{ statusMessage }}
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue'
  import apiClient from '@/apiClient'
  import CreateLicencia from '@/components/Form/create-licencia.vue'
  
  export default {
    name: 'LicenciaTab',
    components: {
      CreateLicencia
    },
    props: {
      empresaId: {
        type: [Number, String],
        required: true
      }
    },
  
    setup(props) {
      const licencia = ref(null)
      const showCreateModal = ref(false)
      const formData = ref({
        licencia: '',
        fecha_inicio: '',
        fecha_fin: '',
        cantidad_usuarios: 1
      })
      const showToast = ref(false)
      const isSuccess = ref(true)
      const statusMessage = ref('')
      const terceroNombre = ref('')
  
      const fetchLicencia = async () => {
        try {
          const [licenciaResponse, terceroResponse] = await Promise.all([
            apiClient.get('/licencias/'),
            apiClient.get(`/terceros/${props.empresaId}/`)
          ])
          
          const licenciaEmpresa = licenciaResponse.data.find(l => l.tercero === parseInt(props.empresaId))
          
          if (licenciaEmpresa) {
            licencia.value = licenciaEmpresa
            formData.value = { ...licenciaEmpresa }
            terceroNombre.value = `${terceroResponse.data.nombre} - ${terceroResponse.data.nit}`
          }
        } catch (error) {
          console.error('Error al cargar la licencia:', error)
          showToastMessage('Error al cargar la información de la licencia', false)
        }
      }
  
      const showToastMessage = (message, success = true) => {
        statusMessage.value = message
        isSuccess.value = success
        showToast.value = true
        setTimeout(() => {
          showToast.value = false
        }, 3000)
      }
  
      const handleSubmit = async () => {
        try {
          await apiClient.put(`/licencias/${licencia.value.id}/`, {
            ...formData.value,
            tercero: props.empresaId // Mantener el tercero original
          })
          showToastMessage('Licencia actualizada correctamente')
          await fetchLicencia() // Recargar datos
        } catch (error) {
          console.error('Error al actualizar la licencia:', error)
          showToastMessage('Error al actualizar la licencia', false)
        }
      }
  
      const onLicenciaCreated = async () => {
        showCreateModal.value = false
        await fetchLicencia()
        showToastMessage('Licencia creada correctamente')
      }
  
      onMounted(() => {
        fetchLicencia()
      })
  
      return {
        licencia,
        showCreateModal,
        formData,
        showToast,
        isSuccess,
        statusMessage,
        handleSubmit,
        onLicenciaCreated,
        terceroNombre
      }
    }
  }
  </script>