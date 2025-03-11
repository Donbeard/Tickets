<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" aria-hidden="true"></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full border border-gray-200">
        <!-- Header con gradiente -->
        <div class="bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-4">
          <h3 class="text-2xl font-bold text-white flex items-center">
            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
            </svg>
            Editar Empresa
          </h3>
        </div>

        <!-- Contenido del formulario -->
        <div class="bg-white px-6 pt-6 pb-4 sm:p-8 sm:pb-6">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-2 gap-4">
              <!-- NIT -->
              <div class="flex items-center">
                <label class="w-1/4 text-sm font-medium text-gray-700">NIT <span class="text-red-500">*</span></label>
                <div class="w-3/4">
                  <input 
                    type="number" 
                    v-model="formData.nit"
                    required
                    :max="9223372036854775807"
                    :min="-9223372036854775808"
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  />
                </div>
              </div>

              <!-- Nombre -->
              <div class="flex items-center">
                <label class="w-1/4 text-sm font-medium text-gray-700">Nombre <span class="text-red-500">*</span></label>
                <div class="w-3/4">
                  <input 
                    type="text" 
                    v-model="formData.nombre"
                    required
                    maxlength="100"
                    minlength="1"
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  />
                </div>
              </div>

              <!-- Dirección -->
              <div class="flex items-center">
                <label class="w-1/4 text-sm font-medium text-gray-700">Dirección <span class="text-red-500">*</span></label>
                <div class="w-3/4">
                  <input 
                    type="text" 
                    v-model="formData.direccion"
                    required
                    maxlength="100"
                    minlength="1"
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  />
                </div>
              </div>

              <!-- Teléfono -->
              <div class="flex items-center">
                <label class="w-1/4 text-sm font-medium text-gray-700">Teléfono <span class="text-red-500">*</span></label>
                <div class="w-3/4">
                  <input 
                    type="number" 
                    v-model="formData.telefono"
                    required
                    :max="9223372036854775807"
                    :min="-9223372036854775808"
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  />
                </div>
              </div>

              <!-- Email -->
              <div class="flex items-center">
                <label class="w-1/4 text-sm font-medium text-gray-700">Email <span class="text-red-500">*</span></label>
                <div class="w-3/4">
                  <input 
                    type="email" 
                    v-model="formData.email"
                    required
                    maxlength="255"
                    minlength="1"
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  />
                </div>
              </div>

              <!-- WhatsApp -->
              <div class="flex items-center">
                <label class="w-1/4 text-sm font-medium text-gray-700">WhatsApp</label>
                <div class="w-3/4">
                  <input 
                    type="number" 
                    v-model="formData.whatsapp"
                    :max="9223372036854775807"
                    :min="-9223372036854775808"
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  />
                </div>
              </div>

              <!-- Estado -->
              <div class="flex items-center">
                <label class="w-1/4 text-sm font-medium text-gray-700">Estado</label>
                <div class="w-3/4">
                  <select 
                    v-model="formData.activo"
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  >
                    <option value="S">Activo</option>
                    <option value="N">Inactivo</option>
                  </select>
                </div>
              </div>

              <!-- Licencia -->
              <div class="flex items-center">
                <label class="w-1/4 text-sm font-medium text-gray-700">Licencia <span class="text-red-500">*</span></label>
                <div class="w-3/4">
                  <input 
                    type="text" 
                    v-model="formData.licencia"
                    required
                    pattern="[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}"
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  />
                </div>
              </div>

              <!-- Fecha Inicio -->
              <div class="flex items-center">
                <label class="w-1/4 text-sm font-medium text-gray-700">Fecha Inicio <span class="text-red-500">*</span></label>
                <div class="w-3/4">
                  <input 
                    type="date" 
                    v-model="formData.fecha_inicio"
                    required
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  />
                </div>
              </div>

              <!-- Fecha Fin -->
              <div class="flex items-center">
                <label class="w-1/4 text-sm font-medium text-gray-700">Fecha Fin <span class="text-red-500">*</span></label>
                <div class="w-3/4">
                  <input 
                    type="date" 
                    v-model="formData.fecha_fin"
                    required
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  />
                </div>
              </div>

              <!-- Cantidad Usuarios -->
              <div class="flex items-center">
                <label class="w-1/4 text-sm font-medium text-gray-700">Cantidad Usuarios <span class="text-red-500">*</span></label>
                <div class="w-3/4">
                  <input 
                    type="number" 
                    v-model="formData.cantidad_usuarios"
                    required
                    min="-32768"
                    max="32767"
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
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
            class="w-full sm:w-auto inline-flex justify-center items-center rounded-md px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-medium shadow-sm hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Actualizar
          </button>
          <button 
            @click="$emit('close')" 
            type="button" 
            class="mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center items-center rounded-md px-6 py-2.5 border border-gray-300 bg-white text-gray-700 font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
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
</template>

<script>
import { ref } from 'vue'
import apiClient from '@/apiClient'

export default {
  name: 'EditEmpresa',
  props: {
    empresa: {
      type: Object,
      required: true
    }
  },
  emits: ['close', 'updated'],
  
  setup(props, { emit }) {
    const formData = ref({
      nit: props.empresa.nit,
      nombre: props.empresa.nombre,
      direccion: props.empresa.direccion,
      telefono: props.empresa.telefono,
      email: props.empresa.email,
      whatsapp: props.empresa.whatsapp,
      activo: props.empresa.activo,
      licencia: props.empresa.licencia,
      fecha_inicio: props.empresa.fecha_inicio,
      fecha_fin: props.empresa.fecha_fin,
      cantidad_usuarios: props.empresa.cantidad_usuarios
    })

    const handleSubmit = async () => {
      try {
        const response = await apiClient.put(`/terceros/${props.empresa.id}/`, formData.value)
        emit('updated', response.data)
      } catch (error) {
        console.error('Error updating empresa:', error)
      }
    }

    return {
      formData,
      handleSubmit
    }
  }
}
</script>
