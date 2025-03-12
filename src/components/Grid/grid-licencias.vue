<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
    <!-- Encabezado con búsqueda y botón de nueva licencia -->
    <div class="mb-4 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
      <h1 class="text-3xl font-bold text-gray-900">
        Licencias<span class="text-indigo-600"></span>
      </h1>
      
      <!-- Barra de búsqueda -->
      <div class="relative flex-1 max-w-xs">
        <input
          type="text"
          v-model="searchQuery"
          @input="handleSearchInput"
          placeholder="Buscar nombre o NIT..."
          class="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
        </div>
        <button 
          v-if="searchQuery" 
          @click="clearSearch" 
          class="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <svg class="h-5 w-5 text-gray-400 hover:text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <!-- Botón de nueva licencia -->
      <button
        @click="abrirModalCrear"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Nueva Licencia
      </button>
    </div>

    <!-- Tabla de Licencias -->
    <div class="overflow-x-auto rounded-lg border border-gray-200 shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th v-for="column in columns" :key="column.key" 
                class="px-3 py-2 text-left text-xs font-medium text-black uppercase tracking-wider">
              <div class="flex items-center cursor-pointer" @click="sortTable(column.key)">
                {{ column.label }}
                <svg v-if="sortKey === column.key" class="ml-1 h-4 w-4" 
                     :class="sortOrder === 'asc' ? '' : 'transform rotate-180'" 
                     xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 4.414 6.707 7.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
            </th>
            <th class="px-3 py-2 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="loading" class="animate-pulse">
            <td :colspan="columns.length + 1" class="px-3 py-2 whitespace-nowrap">
              <div class="flex items-center justify-center">
                <svg class="animate-spin h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </td>
          </tr>
          <tr v-else-if="error" class="bg-red-50">
            <td :colspan="columns.length + 1" class="px-3 py-2 text-sm text-red-500 text-center">
              {{ error }}
            </td>
          </tr>
          <tr v-else-if="filteredLicencias.length === 0" class="hover:bg-gray-50">
            <td :colspan="columns.length + 1" class="px-3 py-2 text-sm text-black text-center">
              No se encontraron licencias
            </td>
          </tr>
          
          <tr v-for="licencia in filteredLicencias" :key="licencia.id" class="hover:bg-gray-50">
            <td class="px-3 py-1.5 text-xs text-black">
              {{ licencia.licencia }}
            </td>
            <td class="px-3 py-1.5 text-xs text-black">
              {{ formatDate(licencia.fecha_inicio) }}
            </td>
            <td class="px-3 py-1.5 text-xs text-black">
              {{ formatDate(licencia.fecha_fin) }}
            </td>
            <td class="px-3 py-1.5 text-xs text-black">
              {{ licencia.cantidad_usuarios }}
            </td>
            <td class="px-3 py-1.5 text-xs text-black">
              <template v-if="licencia.terceroNombre">
                {{ licencia.terceroNombre }}
                <span class="text-gray-500">({{ licencia.terceroNit }})</span>
              </template>
              <template v-else>-</template>
            </td>
            <td class="px-3 py-1.5 whitespace-nowrap text-right text-xs font-medium">
              <button 
                @click="editLicencia(licencia)"
                class="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 py-1 px-2 rounded mr-2"
              >
                Editar
              </button>
              <button 
                @click="deleteLicencia(licencia)"
                class="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 py-1 px-2 rounded"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Modal para crear/editar licencia -->
  <CreateLicencia 
    v-if="showModal"
    @close="closeModal"
    @created="onLicenciaCreated"
  />
</template>

<script>
import { ref, computed } from 'vue'
import apiClient from '@/apiClient'
import CreateLicencia from '@/components/Form/create-licencia.vue'

export default {
  name: 'GridLicencias',
  components: {
    CreateLicencia
  },

  setup() {
    const licencias = ref([])
    const terceros = ref({}) // Objeto para mapear id -> datos del tercero
    const loading = ref(true)
    const error = ref(null)
    const searchQuery = ref('')
    const sortKey = ref('licencia')
    const sortOrder = ref('asc')
    const showModal = ref(false)
    const editingLicencia = ref(null)
    const formData = ref({
      licencia: '',
      fecha_inicio: '',
      fecha_fin: '',
      cantidad_usuarios: 0,
      tercero: null
    })

    const columns = [
      { key: 'licencia', label: 'Licencia' },
      { key: 'fecha_inicio', label: 'Fecha Inicio' },
      { key: 'fecha_fin', label: 'Fecha Fin' },
      { key: 'cantidad_usuarios', label: 'Cantidad Usuarios' },
      { key: 'tercero', label: 'Tercero' }
    ]

    // Obtener datos de terceros
    const fetchTerceros = async () => {
      try {
        const response = await apiClient.get('/terceros/')
        // Crear un objeto mapeado para fácil acceso
        terceros.value = response.data.reduce((acc, tercero) => {
          acc[tercero.id] = tercero
          return acc
        }, {})
      } catch (err) {
        console.error('Error al cargar terceros:', err)
      }
    }

    const fetchLicencias = async () => {
      loading.value = true
      error.value = null
      try {
        await fetchTerceros() // Primero obtener los terceros
        const response = await apiClient.get('/licencias/')
        // Mapear las licencias con los datos del tercero
        licencias.value = response.data.map(licencia => ({
          ...licencia,
          terceroNombre: licencia.tercero ? terceros.value[licencia.tercero]?.nombre : '-',
          terceroNit: licencia.tercero ? terceros.value[licencia.tercero]?.nit : '-'
        }))
      } catch (err) {
        error.value = 'Error al cargar las licencias'
        console.error('Error:', err)
      } finally {
        loading.value = false
      }
    }

    const filteredLicencias = computed(() => {
      let result = [...licencias.value]
      
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(licencia => 
          licencia.licencia.toLowerCase().includes(query) ||
          licencia.terceroNombre.toLowerCase().includes(query) ||
          String(licencia.terceroNit).includes(query)
        )
      }

      result.sort((a, b) => {
        let aValue = a[sortKey.value]
        let bValue = b[sortKey.value]
        
        // Si estamos ordenando por tercero, usar el nombre del tercero
        if (sortKey.value === 'tercero') {
          aValue = a.terceroNombre
          bValue = b.terceroNombre
        }
        
        if (aValue === bValue) return 0
        const modifier = sortOrder.value === 'asc' ? 1 : -1
        return aValue > bValue ? modifier : -modifier
      })

      return result
    })

    const handleSearchInput = () => {
      // Implementar debounce si es necesario
    }

    const clearSearch = () => {
      searchQuery.value = ''
    }

    const sortTable = (key) => {
      if (sortKey.value === key) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
      } else {
        sortKey.value = key
        sortOrder.value = 'asc'
      }
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString()
    }

    const abrirModalCrear = () => {
      editingLicencia.value = null
      formData.value = {
        licencia: '',
        fecha_inicio: '',
        fecha_fin: '',
        cantidad_usuarios: 0,
        tercero: null
      }
      showModal.value = true
    }

    const editLicencia = (licencia) => {
      editingLicencia.value = licencia
      formData.value = { ...licencia }
      showModal.value = true
    }

    const closeModal = () => {
      showModal.value = false
      editingLicencia.value = null
    }

    const onLicenciaCreated = () => {
      // Actualizar la lista de licencias después de crear una nueva
      fetchLicencias()
    }

    const handleSubmit = async () => {
      try {
        if (editingLicencia.value) {
          await apiClient.put(`/licencias/${editingLicencia.value.id}/`, formData.value)
        } else {
          await apiClient.post('/licencias/', formData.value)
        }
        await fetchLicencias()
        closeModal()
      } catch (err) {
        console.error('Error:', err)
        // Manejar error
      }
    }

    const deleteLicencia = async (licencia) => {
      if (confirm('¿Está seguro de eliminar esta licencia?')) {
        try {
          await apiClient.delete(`/licencias/${licencia.id}/`)
          await fetchLicencias()
        } catch (err) {
          console.error('Error:', err)
          // Manejar error
        }
      }
    }

    // Cargar licencias al montar el componente
    fetchLicencias()

    return {
      licencias,
      loading,
      error,
      searchQuery,
      sortKey,
      sortOrder,
      showModal,
      editingLicencia,
      formData,
      columns,
      filteredLicencias,
      handleSearchInput,
      clearSearch,
      sortTable,
      formatDate,
      abrirModalCrear,
      editLicencia,
      closeModal,
      onLicenciaCreated,
      handleSubmit,
      deleteLicencia
    }
  }
}
</script> 