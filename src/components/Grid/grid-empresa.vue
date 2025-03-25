<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
    <!-- Encabezado con búsqueda y botón de nueva empresa -->
    <div class="mb-4 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
      <h1 class="text-3xl font-bold text-gray-900">
        Empresa ¡Bienvenido!<span class="text-indigo-600"></span>
      </h1>
      <!-- Barra de búsqueda -->
      <div v-if="userType !== 'C'" class="relative flex-1 max-w-xs">
        <input
          type="text"
          v-model="searchQuery"
          @input="handleSearchInput"
          placeholder="Buscar empresa..."
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

      <!-- Botón de nueva empresa -->
      <button
        v-if="userType !== 'C'"
        @click="abrirModalCrear"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Nueva Empresa
      </button>

      <!-- Nuevo botón de Agregar Empresa -->
      <button
        @click="showAddEmpresaModal = true"
        type="button"
        class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
      >
        <PlusIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
        Agregar Empresa
      </button>
    </div>

    <div v-if="!selectedEmpresa">
      <div class="overflow-x-auto rounded-lg border border-gray-200 shadow">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th v-for="column in columns" :key="column.key" 
                  class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div class="flex items-center cursor-pointer" @click="sortTable(column.key)">
                  {{ column.label }}
                  <svg v-if="sortKey === column.key" class="ml-1 h-4 w-4" 
                       :class="sortOrder === 'asc' ? '' : 'transform rotate-180'" 
                       xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 4.414 6.707 7.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
              </th>
              <th class="relative px-3 py-2">
                <span class="sr-only">Acciones</span>
              </th>
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
            <tr v-else-if="filteredEmpresas.length === 0" class="hover:bg-gray-50">
              <td :colspan="columns.length + 1" class="px-3 py-2 text-sm text-gray-500 text-center">
                No se encontraron empresas
              </td>
            </tr>
            
            <!-- Filas con columnas separadas -->
            <tr v-for="empresa in paginatedEmpresas" :key="empresa.id" class="hover:bg-gray-50">
              <!-- NIT -->
              <td class="px-3 py-1.5 text-xs text-gray-500">
                {{ empresa.nit }}
              </td>
              
              <!-- Nombre (ahora separado) -->
              <td class="px-3 py-1.5 text-xs font-medium text-gray-900">
                {{ empresa.nombre }}
              </td>

              <!-- Dirección (nueva columna) -->
              <td class="px-3 py-1.5 text-xs text-gray-500">
                {{ empresa.direccion || '-' }}
              </td>
              
              <!-- Email -->
              <td class="px-3 py-1.5 text-xs text-gray-500">
                {{ empresa.email || '-' }}
              </td>
              
              <!-- Teléfono (ahora separado) -->
              <td class="px-3 py-1.5 text-xs text-gray-500">
                {{ empresa.telefono || '-' }}
              </td>

              <!-- Whatsapp (nueva columna) -->
              <td class="px-3 py-1.5 text-xs text-gray-500">
                <span v-if="empresa.whatsapp" class="flex items-center">
                  <svg class="flex-shrink-0 mr-1 h-3 w-3 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor">
                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                  </svg>
                  {{ empresa.whatsapp }}
                </span>
                <span v-else>-</span>
              </td>
              
              <!-- Estado (ahora separado) -->
              <td class="px-3 py-1.5 text-xs whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                      :class="empresa.activo === 'S' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                  {{ empresa.activo === 'S' ? 'Activo' : 'Inactivo' }}
                </span>
              </td>

              <!-- Cantidad de Usuarios (nueva columna) -->
              <td class="px-3 py-1.5 text-xs text-gray-500">
                <span v-if="empresa.cantidad_usuarios" class="flex items-center">
                  <svg class="h-3 w-3 mr-1 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  {{ empresa.cantidad_usuarios }}
                </span>
                <span v-else>-</span>
              </td>
              
              <!-- Licencia -->
              <td class="px-3 py-1.5 text-xs text-gray-500">
                {{ empresa.licencia || '-' }}
              </td>
              
              <!-- Fecha Inicio -->
              <td class="px-3 py-1.5 text-xs text-gray-500 whitespace-nowrap">
                {{ empresa.fecha_inicio ? formatDate(empresa.fecha_inicio) : '-' }}
              </td>
              
              <!-- Fecha Fin -->
              <td class="px-3 py-1.5 text-xs text-gray-500 whitespace-nowrap">
                {{ empresa.fecha_fin ? formatDate(empresa.fecha_fin) : '-' }}
              </td>
              
              <!-- Acciones -->
              <td class="px-3 py-1.5 whitespace-nowrap text-right text-xs font-medium">
                <button 
                  v-if="userType !== 'C'"
                  @click="selectEmpresa(empresa)" 
                  class="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 py-1 px-2 rounded"
                >
                  Ver detalle
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Paginación -->
      <div class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
        <!-- Selector de registros por página y resumen -->
        <div class="flex items-center space-x-8">
          <!-- Selector de registros por página -->
          <div class="flex items-center space-x-3">
            <label for="itemsPerPage" class="text-sm font-medium text-gray-700">Mostrar:</label>
            <select 
              v-model="itemsPerPage" 
              id="itemsPerPage"
              class="h-9 px-3 border border-gray-300 bg-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
            <span class="text-sm text-gray-600">registros</span>
          </div>

          <!-- Información de registros mostrados -->
          <p class="text-sm text-gray-700">
            Mostrando <span class="font-medium">{{ startItem }}</span> a <span class="font-medium">{{ endItem }}</span> de <span class="font-medium">{{ filteredEmpresas.length }}</span> resultados
          </p>
        </div>

        <!-- Resto de la paginación existente -->
        <div>
          <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
            >
              <span class="sr-only">Anterior</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <!-- Páginas -->
            <template v-for="(page, index) in displayedPages" :key="index">
              <button
                v-if="page !== '...'"
                @click="changePage(page)"
                :class="[
                  'relative inline-flex items-center px-4 py-2 text-sm font-semibold',
                  page === currentPage
                    ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                    : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                ]"
              >
                {{ page }}
              </button>
              <span
                v-else
                class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
              >
                ...
              </span>
            </template>
            
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
            >
              <span class="sr-only">Siguiente</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>

    <div v-else class="space-y-6">
      <!-- Botón de regreso con mejor diseño -->
      <div class="flex items-center mb-2">
        <button 
          @click="volverALista" 
          class="text-gray-600 hover:text-gray-800 flex items-center transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span class="text-sm font-medium">Volver a la lista</span>
        </button>
      </div>

      <!-- Formulario ultra compacto con botones integrados -->
      <div v-if="selectedEmpresa" class="mt-4">
        <div class="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
          <div class="bg-gradient-to-r from-indigo-50 to-blue-50 px-3 py-1.5 border-b border-indigo-100 flex justify-between items-center">
            <h3 class="text-xs font-semibold text-indigo-900">
              Editar empresa: {{ selectedEmpresa.nombre }}
            </h3>
            <button @click="selectedEmpresa = null" class="text-gray-500 hover:text-gray-700">
              <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="px-3 py-2">
            <!-- Formulario ultra compacto con botones integrados -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-x-2 gap-y-1.5">
              <!-- Primera fila: NIT, Nombre, Teléfono, Whatsapp, Estado -->
              
              <!-- NIT -->
              <div class="flex items-center">
                <label for="nit" class="block text-xs font-medium text-gray-700 w-12">NIT:</label>
                <input 
                  type="text" 
                  id="nit" 
                  v-model="selectedEmpresa.nit" 
                  class="block w-full py-0.5 px-1.5 text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <!-- Nombre -->
              <div class="flex items-center col-span-2">
                <label for="nombre" class="block text-xs font-medium text-gray-700 w-12">Nombre:</label>
                <input 
                  type="text" 
                  id="nombre" 
                  v-model="selectedEmpresa.nombre" 
                  class="block w-full py-0.5 px-1.5 text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <!-- Teléfono -->
              <div class="flex items-center">
                <label for="telefono" class="block text-xs font-medium text-gray-700 w-12">Tel:</label>
                <input 
                  type="text" 
                  id="telefono" 
                  v-model="selectedEmpresa.telefono" 
                  class="block w-full py-0.5 px-1.5 text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <!-- Whatsapp -->
              <div class="flex items-center">
                <label for="whatsapp" class="block text-xs font-medium text-gray-700 w-12">WA:</label>
                <input 
                  type="text" 
                  id="whatsapp" 
                  v-model="selectedEmpresa.whatsapp" 
                  class="block w-full py-0.5 px-1.5 text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <!-- Estado -->
              <div class="flex items-center">
                <label for="activo" class="block text-xs font-medium text-gray-700 w-12">Estado:</label>
                <select 
                  id="activo" 
                  v-model="selectedEmpresa.activo" 
                  class="block w-full py-0.5 px-1.5 text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="S">Activo</option>
                  <option value="N">Inactivo</option>
                </select>
              </div>

              <!-- Segunda fila: Fechas, Dirección, Correo -->
              <div class="flex items-center col-span-3">
                <label for="direccion" class="block text-xs font-medium text-gray-700 w-12">Dir:</label>
                <input 
                  type="text" 
                  id="direccion" 
                  v-model="selectedEmpresa.direccion" 
                  class="block w-full py-0.5 px-1.5 text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div class="flex items-center col-span-3">
                <label for="email" class="block text-xs font-medium text-gray-700 w-12">Email:</label>
                <div class="w-full flex space-x-1 items-center">
                  <input 
                    type="email" 
                    id="email" 
                    v-model="selectedEmpresa.email" 
                    class="block w-full py-0.5 px-1.5 text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  
                  <!-- Botones de acción -->
                  <button 
                    @click="updateEmpresa" 
                    class="py-0.5 px-2 text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                    title="Guardar cambios"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  
                  <button 
                    @click="selectedEmpresa = null" 
                    class="py-0.5 px-2 text-xs font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none"
                    title="Cancelar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Pestañas para contactos y notas (ultra compacto) -->
          <div class="border-t border-gray-200 px-2 py-1">
            <nav class="flex space-x-4 text-xs">
              <button 
                @click="activeTab = 'contactos'" 
                :class="[activeTab === 'contactos' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'py-0.5 border-b-2 font-medium text-xs']"
              >
                Contactos
              </button>
              <button 
                @click="activeTab = 'notas'" 
                :class="[activeTab === 'notas' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'py-0.5 border-b-2 font-medium text-xs']"
              >
                Notas
              </button>
              <button 
                @click="activeTab = 'licencia'" 
                :class="[activeTab === 'licencia' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'py-0.5 border-b-2 font-medium text-xs']"
              >
                Licencia
              </button>
            </nav>
          </div>

          <!-- Contenido de pestañas (compacto) -->
          <div class="p-2">
            <div v-if="activeTab === 'contactos'">
              <ContactosEmpresa :empresa="selectedEmpresa" />
            </div>
            <div v-if="activeTab === 'notas'">
              <NotasEmpresa :empresa="selectedEmpresa" />
            </div>
            <div v-if="activeTab === 'licencia'">
              <LicenciaTab :empresaId="selectedEmpresa.id" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal para crear nueva empresa -->
  <div v-if="showCreateModal">
    <CreateEmpresa @close="showCreateModal = false" @created="handleCreated" />
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

  <!-- Modal de Agregar Empresa -->
  <AddUsuariosTerceros 
    v-if="showAddEmpresaModal"
    @close="showAddEmpresaModal = false"
    @success="handleEmpresaAdded"
  />
</template>

<script>
import { ref, onMounted, computed} from 'vue'
import CreateEmpresa from '@/components/Form/create-empresa.vue'
import ContactosEmpresa from '@/components/Form/contactos-empresa.vue'
import NotasEmpresa from '@/components/Form/notas-empresa.vue'
import LicenciaTab from '@/components/Grid/LicenciaTab.vue'
import apiClient from '@/apiClient'
import { PlusIcon } from '@heroicons/vue/24/outline'
import AddUsuariosTerceros from '../Form/add-usuariosTerceros.vue'

export default {
  name: 'GridEmpresa',
  components: {
    CreateEmpresa,
    ContactosEmpresa,
    NotasEmpresa,
    LicenciaTab,
    PlusIcon,
    AddUsuariosTerceros
  },

  setup() {
    const empresas = ref([])
    const showCreateModal = ref(false)
    const selectedEmpresa = ref(null)
    const loading = ref(false)
    const error = ref(null)
    const showToast = ref(false)
    const isSuccess = ref(true)
    const statusMessage = ref('')
    const searchQuery = ref('')
    const sortKey = ref('nombre')
    const sortOrder = ref('asc')
    const debouncedSearchTimeout = ref(null)
    const activeTab = ref('contactos')
    const userType = ref(localStorage.getItem('user_type'))
    const userTerceroId = ref(null)
    const showAddEmpresaModal = ref(false)

    // Añadir variables reactivas para la paginación
    const itemsPerPage = ref(10);
    const currentPage = ref(1);

    const columns = [
      { key: 'nit', label: 'NIT' },
      { key: 'nombre', label: 'Nombre' },
      { key: 'direccion', label: 'Dirección' },
      { key: 'email', label: 'Email' },
      { key: 'telefono', label: 'Teléfono' },
      { key: 'whatsapp', label: 'Whatsapp' },
      { key: 'activo', label: 'Estado' },
      { key: 'cantidad_usuarios', label: 'Usuarios' },
      { key: 'licencia', label: 'Licencia' },
      { key: 'fecha_inicio', label: 'Fecha Inicio' },
      { key: 'fecha_fin', label: 'Fecha Fin' }
    ]

    const fetchEmpresas = async () => {
      loading.value = true
      error.value = null
      try {
        // Obtener empresas y licencias
        const [empresasResponse, licenciasResponse] = await Promise.all([
          apiClient.get('/terceros/'),
          apiClient.get('/licencias/')
        ])
        
        // Mapear empresas con sus licencias
        empresas.value = empresasResponse.data.map(empresa => {
          const licencia = licenciasResponse.data.find(l => l.tercero === empresa.id)
          return {
            ...empresa,
            cantidad_usuarios: licencia?.cantidad_usuarios || '-',
            licencia: licencia?.licencia || '-',
            fecha_inicio: licencia?.fecha_inicio || '-',
            fecha_fin: licencia?.fecha_fin || '-'
          }
        })
      } catch (e) {
        console.error('Error fetching data:', e)
        error.value = 'Error al cargar los datos'
      } finally {
        loading.value = false
      }
    }

    // Función con debounce para la búsqueda
    const handleSearchInput = () => {
      if (debouncedSearchTimeout.value) {
        clearTimeout(debouncedSearchTimeout.value)
      }
      
      debouncedSearchTimeout.value = setTimeout(() => {
        console.log("Buscando:", searchQuery.value)
      }, 300)
    }
    
    // Función para limpiar la búsqueda
    const clearSearch = () => {
      searchQuery.value = ''
    }

    const filteredEmpresas = computed(() => {
      let result = [...empresas.value]
      
      // Si es usuario tipo C, solo mostrar su empresa
      if (userType.value === 'C' && userTerceroId.value) {
        result = result.filter(empresa => empresa.id === userTerceroId.value)
      }
      
      // Aplicar filtro de búsqueda
      if (searchQuery.value) {
        const search = searchQuery.value.toLowerCase().trim()
        
        if (search) {
          console.log("Aplicando filtro de búsqueda:", search)
          
          result = result.filter(empresa => 
            String(empresa.nit || '').toLowerCase().includes(search) ||
            String(empresa.nombre || '').toLowerCase().includes(search) ||
            String(empresa.email || '').toLowerCase().includes(search) ||
            String(empresa.telefono || '').toLowerCase().includes(search) ||
            String(empresa.direccion || '').toLowerCase().includes(search) ||
            String(empresa.whatsapp || '').toLowerCase().includes(search) ||
            String(empresa.licencia || '').toLowerCase().includes(search)
          )
          
          console.log("Resultados filtrados:", result.length)
        }
      }
      
      // Ordenar resultados
      if (sortKey.value) {
        result.sort((a, b) => {
          let aValue = a[sortKey.value]
          let bValue = b[sortKey.value]
          
          // Manejo especial para fechas
          if (sortKey.value === 'fecha_inicio' || sortKey.value === 'fecha_fin') {
            aValue = new Date(a[sortKey.value] || 0).getTime()
            bValue = new Date(b[sortKey.value] || 0).getTime()
          }
          
          // Asegurarse de que los valores no son nulos
          aValue = aValue === null || aValue === undefined ? '' : aValue
          bValue = bValue === null || bValue === undefined ? '' : bValue
          
          // Comparación de valores
          if (sortOrder.value === 'asc') {
            return aValue > bValue ? 1 : -1
          } else {
            return aValue < bValue ? 1 : -1
          }
        })
      }
      
      return result
    })

    const sortTable = (key) => {
      // Si se hace clic en la misma columna, invertimos el orden
      if (sortKey.value === key) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
      } else {
        // Si es una nueva columna, configuramos la clave y el orden predeterminado (asc)
        sortKey.value = key
        sortOrder.value = 'asc'
      }
    }
    const selectEmpresa = (empresa) => {
      selectedEmpresa.value = { ...empresa }
    }

    const handleCreated = async () => {
      await fetchEmpresas()
      showCreateModal.value = false
    }

    const showToastMessage = (message, success = true) => {
      statusMessage.value = message
      isSuccess.value = success
      showToast.value = true
      
      // Auto-hide toast after 5 seconds
      setTimeout(() => {
        showToast.value = false
      }, 5000)
    }

    const updateEmpresa = async () => {
      try {
        // Verificar que los campos requeridos estén completos
        if (!selectedEmpresa.value.nit || !selectedEmpresa.value.nombre || 
            !selectedEmpresa.value.direccion || !selectedEmpresa.value.telefono || 
            !selectedEmpresa.value.email) {
          showToastMessage('Por favor complete todos los campos requeridos', false);
          return;
        }
        
        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(selectedEmpresa.value.email)) {
          showToastMessage('Por favor ingrese un email válido', false);
          return;
        }
        
        // Formatear los datos según lo que espera la API
        const empresaData = {
          nit: parseInt(selectedEmpresa.value.nit),
          nombre: selectedEmpresa.value.nombre.trim(),
          direccion: selectedEmpresa.value.direccion.trim(),
          telefono: parseInt(selectedEmpresa.value.telefono),
          email: selectedEmpresa.value.email.trim().toLowerCase(),
          activo: selectedEmpresa.value.activo
        };
        
        // Solo agregar whatsapp si tiene valor
        if (selectedEmpresa.value.whatsapp && String(selectedEmpresa.value.whatsapp).trim() !== '') {
          empresaData.whatsapp = parseInt(selectedEmpresa.value.whatsapp);
        }
        
        console.log('Actualizando empresa:', JSON.stringify(empresaData));
        
        // Cambiar la URL de /empresas/ a /terceros/
        await apiClient.put(`/terceros/${selectedEmpresa.value.id}/`, empresaData);
        
        // Actualizamos la lista de empresas en segundo plano
        fetchEmpresas();
        
        // Mostramos mensaje de éxito
        showToastMessage('Empresa actualizada correctamente', true);
        
        // No regresamos a la lista - mantenemos el formulario abierto
      } catch (error) {
        console.error('Error al actualizar empresa:', error);
        
        // Mostrar mensaje de error más específico si está disponible
        if (error.response && error.response.data) {
          const errorData = error.response.data;
          let errorMessage = 'Error al actualizar la empresa: ';
          
          if (typeof errorData === 'object' && !Array.isArray(errorData)) {
            Object.entries(errorData).forEach(([field, messages]) => {
              if (Array.isArray(messages)) {
                errorMessage += `${field}: ${messages.join(', ')} `;
              } else if (typeof messages === 'object') {
                errorMessage += `${field}: ${JSON.stringify(messages)} `;
              } else {
                errorMessage += `${field}: ${messages} `;
              }
            });
          } else if (typeof errorData === 'string') {
            errorMessage += errorData;
          } else {
            errorMessage += 'Verifique los datos ingresados.';
          }
          
          showToastMessage(errorMessage, false);
        } else {
          showToastMessage('Error al actualizar la empresa. Por favor, intente de nuevo.', false);
        }
      }
    }

    const formatDate = (date) => {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('es-ES')
    }

    // Función explícita para abrir el modal
    const abrirModalCrear = () => {
      console.log('Abriendo modal...')
      showCreateModal.value = true
    }

    const volverALista = async () => {
      selectedEmpresa.value = null
      await fetchEmpresas() // Recargar datos
    }

    // Obtener el ID del tercero seleccionado al inicio
    onMounted(() => {
      const selectedTercero = localStorage.getItem('selectedTercero')
      if (selectedTercero) {
        try {
          const terceroData = JSON.parse(selectedTercero)
          userTerceroId.value = terceroData.id
        } catch (e) {
          console.error('Error al parsear tercero seleccionado:', e)
        }
      }
      fetchEmpresas()
    })

    // Computed properties para paginación
    const totalPages = computed(() => {
      return Math.ceil(filteredEmpresas.value.length / itemsPerPage.value);
    });

    const startItem = computed(() => {
      return filteredEmpresas.value.length === 0 ? 0 : (currentPage.value - 1) * itemsPerPage.value + 1;
    });

    const endItem = computed(() => {
      return Math.min(currentPage.value * itemsPerPage.value, filteredEmpresas.value.length);
    });

    const paginatedEmpresas = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return filteredEmpresas.value.slice(start, end);
    });

    // Función para cambiar de página
    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
      }
    };

    // Función para ir a la página anterior
    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    // Función para ir a la página siguiente
    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    // Computed property para mostrar las páginas en la paginación
    const displayedPages = computed(() => {
      const total = totalPages.value;
      const current = currentPage.value;
      const pages = [];
      
      if (total <= 7) {
        // Si hay 7 o menos páginas, mostrar todas
        for (let i = 1; i <= total; i++) {
          pages.push(i);
        }
      } else {
        // Siempre mostrar la primera página
        pages.push(1);
        
        // Si la página actual está entre las primeras 3, mostrar las primeras 5 páginas
        if (current <= 3) {
          for (let i = 2; i <= 5; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(total);
        } 
        // Si la página actual está entre las últimas 3, mostrar las últimas 5 páginas
        else if (current >= total - 2) {
          pages.push('...');
          for (let i = total - 4; i <= total; i++) {
            pages.push(i);
          }
        } 
        // Si la página actual está en el medio, mostrar 2 páginas antes y 2 después
        else {
          pages.push('...');
          for (let i = current - 1; i <= current + 1; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(total);
        }
      }
      
      return pages;
    });

    const handleEmpresaAdded = () => {
      showAddEmpresaModal.value = false;
      // Refrescar la lista de empresas
      fetchEmpresas();
    };

    return {
      empresas,
      showCreateModal,
      selectedEmpresa,
      loading,
      error,
      columns,
      selectEmpresa,
      handleCreated,
      showToast,
      isSuccess,
      statusMessage,
      searchQuery,
      sortKey,
      sortOrder,
      sortTable,
      showToastMessage,
      updateEmpresa,
      formatDate,
      abrirModalCrear,
      filteredEmpresas,
      handleSearchInput,
      clearSearch,
      activeTab,
      userType,
      userTerceroId,
      volverALista,
      itemsPerPage,
      currentPage,
      totalPages,
      startItem,
      endItem,
      paginatedEmpresas,
      changePage,
      prevPage,
      nextPage,
      displayedPages,
      showAddEmpresaModal,
      handleEmpresaAdded
    }
  }
}
</script>

<style scoped>
/* Estilos adicionales para mejorar la apariencia */
input, select {
  background-color: rgb(249, 250, 251);
}

input:focus, select:focus {
  background-color: white;
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
  --tw-ring-color: rgb(99, 102, 241);
  border-color: rgb(99, 102, 241);
}

/* Efecto hover para campos */
input:hover, select:hover {
  border-color: rgb(156, 163, 175);
}

/* Mejoras de la tabla */
table {
  border-collapse: separate;
  border-spacing: 0;
}

th:first-child {
  border-top-left-radius: 0.375rem;
}

th:last-child {
  border-top-right-radius: 0.375rem;
}

tr:last-child td:first-child {
  border-bottom-left-radius: 0.375rem;
}

tr:last-child td:last-child {
  border-bottom-right-radius: 0.375rem;
}
</style> 