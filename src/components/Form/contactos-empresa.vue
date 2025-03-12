<template>
  <div class="bg-white rounded-md text-xs">
    <!-- Header con título y botón -->
    <div v-if="!showForm" class="flex justify-between items-center mb-2">
      <h3 class="text-xs font-medium text-gray-700">Contactos</h3>
      <button
        @click="showNewForm"
        class="inline-flex items-center rounded-md border border-transparent px-2 py-0.5 bg-indigo-50 text-xs font-medium text-indigo-600 hover:bg-indigo-100"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nuevo
      </button>
    </div>

    <!-- Formulario para agregar/editar contacto (modal moderno) -->
    <div v-if="showForm" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Overlay con efecto de blur mejorado -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-60 transition-opacity backdrop-blur-sm" aria-hidden="true"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-indigo-100">
          <!-- Header del modal con gradiente mejorado -->
          <div class="bg-gradient-to-r from-indigo-600 to-blue-500 px-4 py-3 flex justify-between items-center">
            <h3 class="text-sm font-medium text-white">
              {{ formData.id ? 'Editar Contacto' : 'Nuevo Contacto' }}
            </h3>
            <button 
              type="button" 
              @click="showForm = false" 
              class="text-white hover:text-gray-200 transition-colors duration-150"
            >
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleSubmit">
            <div class="bg-white px-4 py-4">
              <div class="space-y-4">
                <!-- Nombre - título a la izquierda e input a la derecha -->
                <div class="flex items-center">
                  <label for="nombre" class="block text-sm font-medium text-gray-700 w-1/4">Nombre:</label>
                  <input
                    type="text"
                    id="nombre"
                    v-model="formData.nombre"
                    required
                    maxlength="100"
                    class="block w-3/4 py-1.5 px-3 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  />
                </div>

                <!-- Cargo - título a la izquierda e input a la derecha -->
                <div class="flex items-center">
                  <label for="cargo" class="block text-sm font-medium text-gray-700 w-1/4">Cargo:</label>
                  <input
                    type="text"
                    id="cargo"
                    v-model="formData.cargo"
                    maxlength="100"
                    class="block w-3/4 py-1.5 px-3 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  />
                </div>

                <!-- Teléfono - título a la izquierda e input a la derecha -->
                <div class="flex items-center">
                  <label for="telefono" class="block text-sm font-medium text-gray-700 w-1/4">Teléfono:</label>
                  <input
                    type="text"
                    id="telefono"
                    v-model="formData.telefono"
                    required
                    class="block w-3/4 py-1.5 px-3 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  />
                </div>

                <!-- Email - título a la izquierda e input a la derecha -->
                <div class="flex items-center">
                  <label for="email" class="block text-sm font-medium text-gray-700 w-1/4">Email:</label>
                  <input
                    type="email"
                    id="email"
                    v-model="formData.email"
                    required
                    maxlength="255"
                    class="block w-3/4 py-1.5 px-3 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  />
                </div>
              </div>
            </div>

            <!-- Footer con degradado sutil -->
            <div class="bg-gradient-to-r from-gray-50 to-indigo-50 px-4 py-3 flex justify-end space-x-3">
              <button
                type="button"
                @click="showForm = false"
                class="py-1.5 px-3 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 shadow-sm transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="py-1.5 px-3 text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 shadow-sm transition-all duration-200 transform hover:scale-105"
              >
                {{ formData.id ? 'Actualizar' : 'Guardar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Lista de contactos en formato grilla compacta con nombre y cargo en columnas separadas -->
    <div v-if="!showForm">
      <div v-if="loading" class="text-center py-2 text-xs text-gray-500">
        Cargando...
      </div>
      
      <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-600 px-2 py-1 rounded text-xs" role="alert">
        {{ error }}
      </div>
      
      <div v-else-if="contactos.length === 0" class="text-center py-2 text-xs text-gray-500">
        No hay contactos disponibles.
      </div>
      
      <!-- Tabla compacta de contactos con columnas separadas y diseño mejorado -->
      <div v-else class="overflow-x-auto border border-indigo-200 rounded-md shadow-sm">
        <table class="min-w-full divide-y divide-indigo-200">
          <thead class="bg-gradient-to-r from-indigo-50 to-blue-50">
            <tr>
              <th scope="col" class="px-2 py-1.5 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider w-1/5 border-r border-indigo-100">
                Nombre
              </th>
              <th scope="col" class="px-2 py-1.5 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider w-1/5 border-r border-indigo-100">
                Cargo
              </th>
              <th scope="col" class="px-2 py-1.5 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider w-1/5 border-r border-indigo-100">
                Teléfono
              </th>
              <th scope="col" class="px-2 py-1.5 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider w-2/5 border-r border-indigo-100">
                Email
              </th>
              <th scope="col" class="px-2 py-1.5 text-right text-xs font-medium text-indigo-700 uppercase tracking-wider w-1/12">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-indigo-100">
            <tr v-for="contacto in contactos" :key="contacto.id" class="hover:bg-blue-50 transition-colors duration-150">
              <td class="px-2 py-1.5 whitespace-nowrap text-xs font-medium text-black border-r border-indigo-50">
                {{ contacto.nombre }}
              </td>
              <td class="px-2 py-1.5 whitespace-nowrap text-xs text-black border-r border-indigo-50">
                {{ contacto.cargo || '-' }}
              </td>
              <td class="px-2 py-1.5 whitespace-nowrap text-xs text-black border-r border-indigo-50">
                {{ contacto.telefono }}
              </td>
              <td class="px-2 py-1.5 text-xs text-black truncate max-w-[150px] border-r border-indigo-50">
                {{ contacto.email }}
              </td>
              <td class="px-2 py-1.5 whitespace-nowrap text-right text-xs font-medium">
                <div class="flex justify-end space-x-1">
                  <button 
                    @click="editContacto(contacto)" 
                    class="text-indigo-600 hover:text-indigo-900 p-0.5 bg-indigo-50 rounded-full hover:bg-indigo-100 transition-colors duration-150"
                    title="Editar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    @click="deleteContacto(contacto.id)" 
                    class="text-red-600 hover:text-red-900 p-0.5 bg-red-50 rounded-full hover:bg-red-100 transition-colors duration-150"
                    title="Eliminar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import apiClient from '@/apiClient'

export default {
  name: 'ContactosEmpresa',
  props: {
    empresa: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],

  setup(props) {
    const contactos = ref([])
    const showForm = ref(false)
    const loading = ref(true)
    const error = ref(null)
    const formData = ref({
      nombre: '',
      cargo: null,
      telefono: '',
      email: '',
      tercero: props.empresa.id
    })

    const fetchContactos = async () => {
      loading.value = true
      error.value = null
      try {
        const response = await apiClient.get(`/contactos/`, {
          params: { tercero: props.empresa.id }
        })
        contactos.value = response.data.filter(contacto => contacto.tercero === props.empresa.id)
      } catch (error) {
        console.error('Error fetching contactos:', error)
        error.value = 'Error al cargar los contactos'
      } finally {
        loading.value = false
      }
    }

    watch(() => props.empresa.id, (newVal, oldVal) => {
      if (newVal !== oldVal) {
        formData.value.tercero = newVal
        fetchContactos()
      }
    })

    const showNewForm = () => {
      formData.value = {
        nombre: '',
        cargo: null,
        telefono: '',
        email: '',
        tercero: props.empresa.id
      }
      showForm.value = true
    }

    const handleSubmit = async () => {
      try {
        if (formData.value.id) {
          await apiClient.put(`/contactos/${formData.value.id}/`, {
            ...formData.value,
            tercero: props.empresa.id
          })
        } else {
          await apiClient.post(`/contactos/`, {
            ...formData.value,
            tercero: props.empresa.id
          })
        }
        await fetchContactos()
        showForm.value = false
        formData.value = {
          nombre: '',
          cargo: null,
          telefono: '',
          email: '',
          tercero: props.empresa.id
        }
      } catch (error) {
        console.error('Error saving contacto:', error)
      }
    }

    const editContacto = (contacto) => {
      formData.value = { ...contacto }
      showForm.value = true
    }

    const deleteContacto = async (id) => {
      if (!confirm('¿Está seguro de eliminar este contacto?')) return

      try {
        await apiClient.delete(`/contactos/${id}/`)
        await fetchContactos()
      } catch (error) {
        console.error('Error deleting contacto:', error)
      }
    }

    onMounted(() => {
      fetchContactos()
    })

    return {
      contactos,
      showForm,
      formData,
      loading,
      error,
      handleSubmit,
      editContacto,
      deleteContacto,
      showNewForm
    }
  }
}
</script>

<style scoped>
/* Transiciones y animaciones */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.duration-200 {
  transition-duration: 200ms;
}

/* Mejoras para inputs */
input:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

/* Efecto hover para campos */
input:hover {
  border-color: #9ca3af;
}
</style>
