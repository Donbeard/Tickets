<template>
  <div class="w-full bg-gray-100">
    <div class="w-full bg-white shadow-md ml-2 mr-2 sm:ml-4 sm:mr-4 mt-2 sm:mt-4">


    <!-- Título -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 pt-4 sm:pt-6 px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900">
        Solicitudes ¡Bienvenido, <span class="text-indigo-600">{{ nombreCompleto }}</span>!
        <span v-if="empresaActual" class="block text-lg text-gray-600 mt-1">
          Empresa: <span class="text-indigo-600">{{ empresaActual }}</span>
        </span>
      </h1>
      
      <div class="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-0">
        <!-- Mejora del campo de búsqueda -->
        <div class="flex items-center px-4 py-3 sm:px-6 bg-white border-b border-gray-200">
          <div class="relative flex-grow max-w-lg">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              name="search"
              id="search"
              class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-10 py-2 border-gray-300 rounded-md"
              placeholder="Buscar titulo de solicitud..."
              @input="handleSearchInput"
            />
            <button
              v-if="searchQuery"
              @click="clearSearch"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Botón Nueva Solicitud -->
        <div class="mb-4">
          <button
            type="button"
            @click.stop="handleNewSolicitud"
            class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <PlusIcon class="h-5 w-5 mr-2" />
            Nueva Solicitud
          </button>
        </div>
        <!-- Agregar esto donde están los demás botones de acción, probablemente cerca del botón de búsqueda o filtros -->
        <button 
          @click="refreshTable" 
          class="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          title="Refrescar datos"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Tabla de solicitudes -->
    <div class="bg-white shadow-sm overflow-hidden sm:rounded-lg mb-4 pr-2">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
          <tr class="divide-x divide-gray-100">
            <th class="w-8 px-1 py-2"></th>
            <th
              v-for="column in filteredColumns"
              :key="column.key"
              class="px-1 py-1 text-left text-xs text-black tracking-wider cursor-pointer select-none relative"
            >
              <div class="flex items-center justify-between">
                <span @click="sortTable(column.key)">
                  {{ column.label }}
                  <span v-if="sortBy === column.key" class="ml-1">
                    {{ sortOrder === 'asc' ? '▲' : '▼' }}
                  </span>
                </span>
                <!-- Solo mostrar el botón de filtro si NO es ID, título o acciones -->
                <div v-if="!['id', 'titulo', 'version_error', 'acciones', 'usuario_cliente_nombre'].includes(column.key)" class="dropdown-container">
                  <button 
                    @click="(event) => toggleDropdown(column.key, event)"
                    class="ml-1 p-1 hover:bg-gray-100 rounded-md"
                  >
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <!-- Menú desplegable -->
              <Teleport to="body">
                <div
                  v-if="dropdownOpen[column.key]"
                  class="origin-top-right absolute mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  :style="{
                    zIndex: 1000,
                    top: `${dropdownPosition.y}px`,
                    left: `${dropdownPosition.x}px`,
                  }"
                  @click.stop
                >
                  <!-- Contenido para el filtro de empresa -->
                  <div v-if="column.key === 'clie'" class="py-2 px-3 w-64">
                    <div class="mb-2">
                      <input 
                        type="text" 
                        v-model="empresaSearchQuery" 
                        placeholder="Buscar empresa..." 
                        class="w-full px-2 py-1 text-xs border rounded"
                      />
                    </div>
                    <div class="max-h-60 overflow-y-auto">
                      <div v-for="empresa in filteredEmpresas" :key="empresa.id" class="flex items-center mb-1">
                        <input 
                          type="checkbox" 
                          :id="`empresa-${empresa.id}`" 
                          :value="empresa.id" 
                          v-model="filters.empresa"
                          @change="handleFilterChange"
                          class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label :for="`empresa-${empresa.id}`" class="ml-2 block text-sm text-gray-900">
                          {{ empresa.nombre }}
                        </label>
                      </div>
                      <div v-if="filteredEmpresas.length === 0" class="text-sm text-gray-500 py-1">
                        No se encontraron empresas con solicitudes
                      </div>
                    </div>
                    <div class="mt-2 flex justify-between">
                      <button @click="clearEmpresaFilter" class="text-xs text-gray-600 hover:text-gray-800">Limpiar</button>
                      <button @click="selectAllEmpresas" class="text-xs text-gray-600 hover:text-gray-800">Seleccionar todo</button>
                    </div>
                  </div>
                  <div class="max-h-60 overflow-y-auto">
                    <template v-for="option in column.key === 'empresa' ? 
                      filteredEmpresas : 
                      (column.key === 'modulo' || column.key === 'submodulo' ? 
                        columnFilterOptions[column.key] : 
                        columnOptions[column.key])" 
                      :key="option.id"
                    >
                      <div class="flex items-center px-4 py-2 hover:bg-gray-100">
                        <input
                          type="checkbox"
                          :id="`${column.key}-${option.id}`"
                          :value="option.id"
                          v-model="filters[column.key]"
                          @change="filterSolicitudes"
                          class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label :for="`${column.key}-${option.id}`" class="ml-2 text-sm text-gray-700">
                          {{ option.nombre }}
                        </label>
                      </div>
                    </template>
                  </div>
                </div>
              </Teleport>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <template v-for="(solicitud, index) in paginatedSolicitudes" :key="solicitud.id">
            <!-- Fila principal -->
            <tr :class="getRowClass(index)" class="hover:bg-gray-50 divide-x divide-gray-100">
              <!-- Columna de flecha para expandir tareas -->
              <td class="px-1 py-2 text-left cursor-pointer w-8" @click="toggleTareas(solicitud)">
                <span class="text-black-500 hover:text-gray-700 transition-transform duration-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 transform transition-transform"
                    :class="{ 'rotate-90': solicitud.showTareas }"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a 1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
              </td>

              <!-- Columnas dinámicas -->
              <td
                v-for="column in filteredColumns"
                :key="column.key"
                :style="getColumnStyle(column.key)"
                class="px-1 py-1 whitespace-nowrap text-xs text-black-500"
              >

                <!-- Prioridad (editable) -->
                <template v-if="column.key === 'prioridad'">
                  <template v-if="editingRowId === solicitud.id && editingField === 'prioridad'">
                    <select
                      v-model="solicitud.prioridad"
                      @blur="saveField(solicitud, 'prioridad')"
                      class="w-full px-2 py-1 border rounded focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option v-for="prioridad in prioridades" :key="prioridad.id" :value="prioridad.id">
                        {{ prioridad.nombre }}
                      </option>
                    </select>
                  </template>
                  <template v-else>
                    <span
                      v-if="userType === 'S' || userType === 'A'"
                      @click="startEditing(solicitud.id, 'prioridad')"
                      class="cursor-pointer"
                    >
                      <span :class="[
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                        solicitud.prioridad === 3 ? 'bg-red-100 text-red-800' :
                        solicitud.prioridad === 2 ? 'bg-yellow-100 text-yellow-800' :
                        solicitud.prioridad === 1 ? 'bg-green-100 text-green-800' :
                        solicitud.prioridad === 4 ? 'bg-black text-white' :
                        'bg-gray-100 text-gray-800'
                      ]">
                        {{ getModuloName(solicitud.prioridad, 'prioridades') }}
                      </span>
                    </span>
                    <span v-else>
                      {{ getModuloName(solicitud.prioridad, 'prioridades') }}
                    </span>
                  </template>
                </template>

                <!-- Estado (editable) -->
                <template v-else-if="column.key === 'estado'">
                  <template v-if="editingRowId === solicitud.id && editingField === 'estado'">
                    <select
                      v-model="solicitud.estado"
                      @change="saveField(solicitud, 'estado')"
                      class="w-full px-2 py-1 border rounded focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option v-for="estado in estados" :key="estado.id" :value="estado.id">
                        {{ getModuloName(estado.id, 'estados') }}
                      </option>
                    </select>
                  </template>
                  <template v-else>
                    <span
                      v-if="userType === 'S' || userType === 'A'"
                      @click="startEditing(solicitud.id, 'estado')"
                      class="cursor-pointer"
                    >
                      {{ getModuloName(solicitud.estado, 'estados') }}
                    </span>
                    <span v-else>
                      {{ getModuloName(solicitud.estado, 'estados') }}
                    </span>
                  </template>
                </template>

                <!-- Orden (editable) -->
                <template v-else-if="column.key === 'orden'">
                  <template v-if="editingRowId === solicitud.id && editingField === 'orden'">
                    <input
                      v-model="solicitud.orden"
                      @blur="saveField(solicitud, 'orden')"
                      type="number"
                      class="w-16 px-2 py-1 text-sm border rounded focus:ring-indigo-500 focus:border-indigo-500 text-center"
                      min="0"
                    />
                  </template>
                  <template v-else>
                    <span
                      v-if="userType === 'S' || userType === 'A'"
                      @click="startEditing(solicitud.id, 'orden')"
                      class="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer transition-colors duration-200"
                    >
                      <template v-if="solicitud.orden">
                        {{ solicitud.orden }}
                      </template>
                      <template v-else>
                        <svg 
                          class="h-3 w-3 mr-1" 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            stroke-linecap="round" 
                            stroke-linejoin="round" 
                            stroke-width="2" 
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </template>
                    </span>
                    <span v-else>
                      {{ solicitud.orden || 'N/A' }}
                    </span>
                  </template>
                </template>

                <!-- Otros campos no editables con tooltips -->
                <template v-else-if="column.key === 'usuario_cliente_nombre'">
                  <div class="tooltip-container">
                    <span class="block truncate">{{ solicitud.usuario_cliente_nombre }}</span>
                    <span class="tooltip-text">{{ solicitud.usuario_cliente_nombre }}</span>
                  </div>
                </template>
                <template v-else-if="column.key === 'usuario_soporte_nombre'">
                  <div class="tooltip-container">
                    <span class="block truncate">{{ solicitud.usuario_soporte_nombre }}</span>
                    <span class="tooltip-text">{{ solicitud.usuario_soporte_nombre }}</span>
                  </div>
                </template>
                <template v-else-if="column.key === 'accion'">
                  <div class="tooltip-container">
                    <span class="block truncate">{{ solicitud.accion_nombre }}</span>
                    <span class="tooltip-text">{{ solicitud.accion_nombre }}</span>
                  </div>
                </template>
                <template v-else-if="column.key === 'opcion'">
                  <div class="tooltip-container">
                    <span class="block truncate">{{ getModuloName(solicitud[column.key], 'opciones') }}</span>
                    <span class="tooltip-text">{{ getModuloName(solicitud[column.key], 'opciones') }}</span>
                  </div>
                </template>
                <template v-else-if="column.key === 'submodulo'">
                  <div class="tooltip-container">
                    <span class="block truncate">
                      {{ getSubmoduloNombre(solicitud.submodulo) || 'No asignado' }}
                    </span>
                    <span class="tooltip-text">
                      {{ getSubmoduloNombre(solicitud.submodulo) || 'No asignado' }}
                    </span>
                  </div>
                </template>
                <template v-else-if="column.key === 'modulo'">
                  <div class="tooltip-container">
                    <span class="block truncate">{{ getModuloName(solicitud.modulo, 'modulos') }}</span>
                    <span class="tooltip-text">{{ getModuloName(solicitud.modulo, 'modulos') }}</span>
                  </div>
                </template>
                <template v-else-if="column.key === 'acciones'">
                  <div class="flex space-x-2 justify-center">
                    <!-- Botón Ver -->
                    <button 
                      @click="showSolicitudDetails(solicitud.id)" 
                      class="text-indigo-600 hover:text-indigo-900 p-1 bg-indigo-50 rounded-full hover:bg-indigo-100 transition-colors duration-150"
                      title="Ver detalles"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    
                    <!-- Botón Editar -->
                    <button
                      v-if="userType !== 'C' || (userType === 'C' && solicitud.estado === 5) && solicitud.estado !== 7 && solicitud.estado !== 8"
                      @click="editSolicitud(solicitud.id)"
                      class="text-yellow-600 hover:text-yellow-900 p-1 bg-yellow-50 rounded-full hover:bg-yellow-100 transition-colors duration-150"
                      title="Editar solicitud"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    
                    <!-- Botón Eliminar -->
                    <button
                      v-if="userType !== 'C'"
                      @click="deleteSolicitud(solicitud.id)"
                      class="text-red-600 hover:text-red-900 p-1 bg-red-50 rounded-full hover:bg-red-100 transition-colors duration-150"
                      title="Eliminar solicitud"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </template>
                <template v-else-if="column.key.includes('fecha')">
                  {{ formatDate(solicitud[column.key]) }}
                </template>
                <template v-else-if="column.key === 'empresa'">
                  <div class="tooltip-container">
                    <span class="inline-block truncate empresa-text overflow-hidden">
                      {{ solicitud.empresa_nombre }}
                    </span>
                    <span class="tooltip-text">
                      {{ solicitud.empresa_nombre }}
                    </span>
                  </div>
                </template>
                <template v-else>
                  <div class="tooltip-container">
                    <span class="block truncate">{{ getModuloName(solicitud[column.key]) }}</span>
                    <span class="tooltip-text">{{ getModuloName(solicitud[column.key]) }}</span>
                  </div>
                </template>
              </td>
            </tr>

            <!-- Fila expandible para tareas -->
            <tr v-if="solicitud.showTareas && userType !== 'C'" class="bg-gray-50">
              <td colspan="16" class="px-4 py-2">
                <!-- Contenido de las tareas -->
                <div class="bg-white shadow-sm rounded-lg">
                  <!-- Cabecera con botón de nueva tarea -->
                  <div class="bg-gradient-to-r from-indigo-50 to-blue-50 p-3 rounded-t-lg border-b border-indigo-100 flex justify-between items-center">
                    <h4 class="text-sm font-semibold text-indigo-800">
                      <span class="inline-flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Tareas de la Solicitud #{{ solicitud.id }}
                      </span>
                    </h4>
                    <!-- Botón Nueva Tarea -->
                    <button 
                      @click="NuevaTarea(solicitud)" 
                      class="inline-flex items-center px-2 py-1 text-xs font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
                    >
                      <svg class="h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Nueva Tarea
                    </button>
                  </div>

                  <!-- Tabla de tareas expandida horizontalmente -->
                  <div class="overflow-x-auto">
                    <table class="w-full table-fixed divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                        <tr>
                          <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">ID</th>
                          <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Descripción</th>
                          <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Usuario Asignado</th>
                          <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Usuario Reasignado</th>
                          <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Fecha Creación</th>
                          <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Fecha Programada</th>
                          <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Fecha Inicio</th>
                          <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Fecha Fin</th>
                          <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Duración</th>
                          <th class="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24" v-if="userType !== 'C'">Acciones</th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-if="!solicitud.tareas || solicitud.tareas.length === 0">
                          <td colspan="10" class="px-2 py-4 text-center text-sm text-gray-500">
                            No hay tareas registradas para esta solicitud
                          </td>
                        </tr>
                        <tr v-for="tarea in solicitud.tareas" :key="tarea.id" class="hover:bg-gray-50">
                          <!-- ID -->
                          <td class="px-2 py-2 whitespace-nowrap text-sm text-gray-500">
                            {{ tarea.id }}
                          </td>
                          
                          <!-- Descripción -->
                          <td class="px-2 py-2 text-sm text-gray-900 truncate">
                            {{ tarea.descripcion }}
                          </td>
                          
                          <!-- Usuario Asignado -->
                          <td class="px-2 py-2 whitespace-nowrap text-sm text-gray-600">
                            <div class="flex items-center">
                              <svg class="h-3 w-3 mr-1 text-blue-500 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span class="truncate">{{ usuariosSoporteMap[tarea.usuario_asignado] || 'No asignado' }}</span>
                            </div>
                          </td>

                          <!-- Usuario Reasignado -->
                          <td class="px-2 py-2 whitespace-nowrap text-sm text-gray-600">
                            <span class="text-gray-400 text-xs">{{ tarea.usuario_reasignado ? usuariosSoporteMap[tarea.usuario_reasignado] : 'No reasignado' }}</span>
                          </td>
                          
                          <!-- Fecha Creación -->
                          <td class="px-2 py-2 text-xs text-gray-600 whitespace-nowrap">
                            {{ formatDate(tarea.fecha_creacion) }}
                          </td>
                          
                          <!-- Fecha Programada -->
                          <td class="px-2 py-2 text-xs text-gray-600 whitespace-nowrap">
                            {{ tarea.fecha_programada ? formatDate(tarea.fecha_programada) : '-' }}
                          </td>
                          
                          <!-- Fecha Inicio -->
                          <td class="px-2 py-2 text-xs text-gray-600 whitespace-nowrap">
                            {{ tarea.fecha_inicio ? formatDate(tarea.fecha_inicio) : '-' }}
                          </td>
                          
                          <!-- Fecha Fin -->
                          <td class="px-2 py-2 text-xs text-gray-600 whitespace-nowrap">
                            {{ tarea.fecha_fin ? formatDate(tarea.fecha_fin) : '-' }}
                          </td>
                          
                          <!-- Duración -->
                          <td class="px-2 py-2 text-xs text-gray-600 whitespace-nowrap">
                            {{ tarea.duracion || '-' }}
                          </td>
                          
                          <!-- Acciones -->
                          <td class="px-2 py-2 text-xs text-center" v-if="userType !== 'C' || tarea.estado === 'S'">
                            <div class="flex items-center justify-center gap-2">
                              <!-- Botón Ver Detalles - visible para todos -->
                              <button 
                                @click="DetalleTareas(tarea.id)" 
                                class="text-blue-600 hover:text-blue-900"
                                title="Ver detalles"
                              >
                                <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                              
                              <!-- Botón Editar - visible para no clientes o clientes con estado 'S' -->
                              <button 
                                v-if="userType !== 'C' || tarea.estado === 'S'"
                                @click="EditarTarea(tarea.id)" 
                                class="text-indigo-600 hover:text-indigo-900"
                                title="Editar tarea"
                              >
                                <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              
                              <!-- Botón Eliminar - solo visible para no clientes -->
                              <button 
                                v-if="userType !== 'C'"
                                @click="EliminarTarea(tarea.id)" 
                                class="text-red-600 hover:text-red-900"
                                title="Eliminar tarea"
                              >
                                <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              </td>
            </tr>
          </template>
          
          <!-- Mensaje si no hay solicitudes -->
          <tr v-if="paginatedSolicitudes.length === 0">
            <td :colspan="filteredColumns.length + 1" class="px-6 py-4 text-center text-gray-500">
              No se encontraron solicitudes
            </td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>

    <!-- Controles de paginación -->
    <div class="flex items-center justify-between py-6 px-6 bg-white border-t border-gray-200 mt-4">
      <!-- Selector de registros por página -->
      <div class="flex items-center space-x-3">
        <label for="pageSize" class="text-sm font-medium text-gray-700">Mostrar:</label>
        <select 
          v-model="pageSize" 
          id="pageSize"
          class="h-9 px-3 border border-gray-300 bg-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
        <span class="text-sm text-gray-600">registros</span>
      </div>

      <!-- Información y controles de paginación -->
      <div class="flex items-center gap-6">
        <!-- Información de registros -->
        <div class="text-sm text-gray-700">
          Mostrando <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span> a
          <span class="font-medium">{{ Math.min(currentPage * pageSize, filteredSolicitudes.length) }}</span> de
          <span class="font-medium">{{ filteredSolicitudes.length }}</span> resultados
        </div>

        <!-- Botones de navegación -->
        <div class="flex flex-wrap items-center space-x-2 space-y-2 sm:space-y-0">
          <!-- Botón Primera Página -->
          <button 
            @click="currentPage = 1" 
            :disabled="currentPage === 1"
            class="inline-flex items-center px-2 py-1 sm:px-4 sm:py-2 border border-gray-300 rounded-md bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="h-4 w-4 sm:h-5 sm:w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
            Primera
          </button>

          <button 
            @click="prevPage" 
            :disabled="currentPage === 1"
            class="inline-flex items-center px-2 py-1 sm:px-4 sm:py-2 border border-gray-300 rounded-md bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="h-4 w-4 sm:h-5 sm:w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Anterior
          </button>
          
          <!-- Número de página actual -->
          <span class="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm text-gray-700 bg-gray-100 rounded-md">
            Página {{ currentPage }} de {{ totalPages }}
          </span>

          <button 
            @click="nextPage" 
            :disabled="currentPage >= totalPages"
            class="inline-flex items-center px-2 py-1 sm:px-4 sm:py-2 border border-gray-300 rounded-md bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
            <svg class="h-4 w-4 sm:h-5 sm:w-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <!-- Botón Última Página -->
          <button 
            @click="currentPage = totalPages" 
            :disabled="currentPage >= totalPages"
            class="inline-flex items-center px-2 py-1 sm:px-4 sm:py-2 border border-gray-300 rounded-md bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Última
            <svg class="h-4 w-4 sm:h-5 sm:w-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

  <!-- Modal para Crear Solicitud -->
  <div v-if="showModalCreate" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" aria-hidden="true"></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full border border-gray-200">
        <!-- Header con gradiente -->
        <div class="bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-4">
          <h3 class="text-2xl font-bold text-white flex items-center">
            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Nueva Solicitud
          </h3>
        </div>

        <!-- Contenido del formulario de creación -->
        <div class="bg-white px-6 pt-6 pb-4 sm:p-8 sm:pb-6">
          <!-- Título -->
          <h3 class="text-2xl font-semibold text-gray-900 mb-6" id="modal-title">Crear Solicitud</h3>

          <!-- Campos del formulario -->
          <div class="space-y-6">
            <!-- Título -->
            <div class="flex items-center">
              <label class="w-1/4 text-sm font-medium text-gray-700">Título <span class="text-red-500">*</span></label>
              <div class="w-3/4 relative">
                <input 
                  v-model="newSolicitud.titulo" 
                  type="text" 
                  maxlength="40"
                  @input="formatearTexto($event, 'newSolicitud', 'titulo')"
                  :class="['w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200', showError && !newSolicitud.titulo ? 'border-red-500' : 'border-gray-300']"
                  placeholder="Describa de forma resumida el nombre del incidente"
                >
                <span class="absolute right-2 bottom-2 text-xs text-gray-400">
                  {{ newSolicitud.titulo?.length || 0 }}/40
                </span>
              </div>
            </div>

            <!-- Módulo -->
            <div class="flex items-center">
              <label class="w-1/4 text-sm font-medium text-gray-700">
                Módulo <span class="text-red-500">*</span>
              </label>
              <div class="w-3/4">
                <select
                  v-model="newSolicitud.modulo"
                  @change="handleModuloChange"
                  :class="['w-3/4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200', showError && !newSolicitud.modulo ? 'border-red-500' : 'border-gray-300']"
                >
                  <option value="">Seleccione un módulo</option>
                  <option 
                    v-for="modulo in [...modulos].sort((a, b) => a.nombre.localeCompare(b.nombre))" 
                    :key="modulo.id" 
                    :value="modulo.id"
                  >
                    {{ modulo.id }} - {{ modulo.nombre }}
                  </option>
                </select>
                <div v-if="showError && !newSolicitud.modulo" class="text-red-500 text-xs mt-1">
                  El módulo es requerido
                </div>
              </div>
            </div>

            <!-- Submódulo -->
            <div class="flex items-center">
              <label class="w-1/4 text-sm font-medium text-gray-700">
                Submódulo <span class="text-red-500">*</span>
              </label>
              <div class="w-3/4">
                <select
                  v-model="newSolicitud.submodulo"
                  :disabled="!newSolicitud.modulo"
                  :class="['w-3/4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200', showError && !newSolicitud.submodulo ? 'border-red-500' : 'border-gray-300']"
                >
                  <option value="">
                    {{ !newSolicitud.modulo ? 'Primero seleccione un módulo' : 'Seleccione un submódulo (opcional)' }}
                  </option>
                  <option 
                    v-for="submodulo in submodulos
                      .filter(s => s.modulo === newSolicitud.modulo || 
                                  (s.modulo && s.modulo.id === newSolicitud.modulo))
                      .sort((a, b) => a.nombre.localeCompare(b.nombre))" 
                    :key="submodulo.id" 
                    :value="submodulo.id"
                  >
                    {{ submodulo.id }} - {{ submodulo.nombre }}
                  </option>
                </select>
                <div v-if="showError && !newSolicitud.submodulo" class="text-red-500 text-xs mt-1">
                  El submódulo es requerido
                </div>
              </div>
            </div>

            <!-- Acción -->
            <div class="flex items-center">
              <label for="new-accion" class="w-1/4 text-sm font-medium text-gray-700">Acción <span class="text-red-500">*</span>:</label>
              <select id="new-accion" v-model="newSolicitud.accion" :class="['w-3/4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200', showError && !newSolicitud.accion ? 'border-red-500' : 'border-gray-300']">
                <option value="">Seleccione una acción</option>
                <option v-for="accion in acciones" :key="accion.id" :value="accion.id">
                  {{ accion.nombre }}
                </option>
              </select>
              <div v-if="showError && !newSolicitud.accion" class="text-red-500 text-xs mt-1">
                La acción es requerida
              </div>
            </div>

            <!-- Descripción -->
            <div>
              <label for="new-descripcion" class="block text-sm font-medium text-gray-700 mb-2">Descripción del error <span class="text-red-500">*</span>:</label>
              <textarea 
                id="new-descripcion" 
                v-model="newSolicitud.descripcion" 
                @input="formatearTexto($event, 'newSolicitud', 'descripcion')"
                :class="['w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duración-200 resize-none', showError && !newSolicitud.descripcion ? 'border-red-500' : 'border-gray-300']" 
                rows="4" 
                placeholder="Describa paso a paso el problema que se ha detectado y el codigo de error generado en el programa"
              ></textarea>
              <div v-if="showError && !newSolicitud.descripcion" class="text-red-500 text-xs mt-1">
                La descripción es requerida
              </div>
            </div>

            <!-- Versión -->
            <div class="flex items-center">
              <label for="new-version" class="w-1/4 text-sm font-medium text-gray-700">Versión <span class="text-red-500">*</span>:</label>
              <input 
                id="new-version" 
                v-model="newSolicitud.version" 
                type="text" 
                :class="['w-3/4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200', showError && !newSolicitud.version ? 'border-red-500' : 'border-gray-300']"
                placeholder="Ingrese la versión"
              >
              <div v-if="showError && !newSolicitud.version" class="text-red-500 text-xs mt-1">
                La versión es requerida
              </div>
            </div>

            <!-- Después del campo Versión y antes del campo Adjuntar Anexo -->
            <div v-if="userType !== 'C'" class="flex items-center">
              <label for="new-fecha-creacion" class="w-1/4 text-sm font-medium text-gray-700">Fecha Creación (Temporal):</label>
              <div class="w-3/4">
                <DatePicker
                  v-model="newSolicitud.fecha_creacion_manual"
                  :model-config="{ type: 'string', mask: 'YYYY-MM-DDTHH:mm:00' }"
                  :masks="{ input: 'DD/MM/YYYY HH:mm' }"
                  :is-24hr="true"
                  mode="dateTime"
                  class="w-3/4"
                  :popover="{ 
                    visibility: 'click', 
                    placement: 'auto', 
                    isInteractive: true, 
                    modifiers: [{ name: 'preventOverflow', options: { padding: 8 } }],
                    positionFixed: true
                  }"
                >
                  <template v-slot="{ inputValue, inputEvents }">
                    <input
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm"
                      :value="inputValue"
                      v-on="inputEvents"
                      placeholder="Ingrese solicitudes con fechas anteriores a la actual."
                    />
                  </template>
                </DatePicker>
                <div class="text-xs text-gray-500 mt-1">
                  Este campo es temporal para ingresar solicitudes con fechas anteriores.
                </div>
              </div>
            </div>

            <!-- Manejo de anexos -->
            <div class="flex items-center">
              <label class="w-1/4 text-sm font-medium text-gray-700">Adjuntar Anexo:</label>
              <div class="w-3/4">
                <input
                  type="file"
                  @change="handleFileUpload"
                  class="w-3/4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                >
              </div>
            </div>

            <!-- Descripción del anexo -->
            <div class="flex items-center">
              <label for="new-descripcionanexo" class="w-1/4 text-sm font-medium text-gray-700">Descripción del anexo:</label>
              <input id="new-descripcionanexo" v-model="newSolicitud.descripcion_anexo" type="text" class="w-3/4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200" placeholder="Ingresa descripción del anexo">
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-gradient-to-r from-gray-50 to-white px-6 py-4 sm:px-8 sm:flex sm:flex-row-reverse gap-3 border-t border-gray-200">
          <button 
            @click="createSolicitud"
            type="button" 
            class="w-full sm:w-auto inline-flex justify-center items-center rounded-md px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-medium shadow-sm hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Crear Solicitud
          </button>
          <button @click="closeModal" type="button" class="mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center items-center rounded-md px-6 py-2.5 border border-gray-300 bg-white text-gray-700 font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duración-200">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal para Editar Solicitud -->
  <div v-if="showModalEdit" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" aria-hidden="true"></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full border border-gray-200">
        <!-- Header con gradiente -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-500 px-6 py-4">
          <h3 class="text-2xl font-bold text-white flex items-center">
            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            Editar Solicitud
          </h3>
        </div>

        <!-- Contenido del formulario de edición -->
        <div class="bg-white px-6 pt-6 pb-4 sm:p-8 sm:pb-6">
          <h3 class="text-2xl font-semibold text-gray-900 mb-6">Editar Solicitud</h3>

          <div class="space-y-6">
            <!-- Título -->
            <div class="flex items-center">
              <label for="edit-titulo" class="w-1/4 text-sm font-medium text-gray-700">Título:</label>
              <input 
                id="edit-titulo" 
                v-model="editableSolicitud.titulo" 
                type="text"
                @input="formatearTexto($event, 'editableSolicitud', 'titulo')"
                class="w-3/4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
            </div>

            <!-- Módulo -->
            <div class="flex items-center">
              <label for="edit-modulo" class="w-1/4 text-sm font-medium text-gray-700">Módulo:</label>
              <select 
                id="edit-modulo" 
                v-model="editableSolicitud.modulo" 
                class="w-3/4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Seleccione un módulo</option>
                <option 
                  v-for="modulo in [...modulos].sort((a, b) => a.nombre.localeCompare(b.nombre))" 
                  :key="modulo.id" 
                  :value="modulo.id"
                >
                  {{ modulo.id }} - {{ modulo.nombre }}
                </option>
              </select>
            </div>

            <!-- Submódulo -->
            <div class="flex items-center">
              <label for="edit-submodulo" class="w-1/4 text-sm font-medium text-gray-700">Submódulo:</label>
              <select 
                v-model="editableSolicitud.submodulo"
                :disabled="!editableSolicitud.modulo"
                class="w-3/4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">
                  {{ !editableSolicitud.modulo ? 'Primero seleccione un módulo' : 'Seleccione un submódulo' }}
                </option>
                <option 
                  v-for="submodulo in submodulos
                    .filter(s => s.modulo === editableSolicitud.modulo || 
                                (s.modulo && s.modulo.id === editableSolicitud.modulo))
                    .sort((a, b) => a.nombre.localeCompare(b.nombre))" 
                  :key="submodulo.id" 
                  :value="submodulo.id"
                >
                  {{ submodulo.id }} - {{ submodulo.nombre }}
                </option>
              </select>
            </div>

            <!-- Acción -->
            <div class="flex items-center">
              <label for="edit-accion" class="w-1/4 text-sm font-medium text-gray-700">Acción:</label>
              <select 
                id="edit-accion" 
                v-model="editableSolicitud.accion" 
                class="w-3/4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Seleccione una acción</option>
                <option v-for="accion in acciones" :key="accion.id" :value="accion.id">
                  {{ accion.nombre }}
                </option>
              </select>
            </div>

            <!-- Descripción -->
            <div>
              <label for="edit-descripcion" class="block text-sm font-medium text-gray-700 mb-2">Descripción:</label>
              <textarea 
                id="edit-descripcion" 
                v-model="editableSolicitud.descripcion"
                @input="formatearTexto($event, 'editableSolicitud', 'descripcion')" 
                rows="4"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              ></textarea>
            </div>

            <!-- Campos solo para usuarios de soporte y admin -->
            <template v-if="userType !== 'C'">
              <!-- Estado -->
              <div class="flex items-center">
                <label for="edit-estado" class="w-1/4 text-sm font-medium text-gray-700">Estado:</label>
                <select 
                  id="edit-estado" 
                  v-model="editableSolicitud.estado"
                  class="w-3/4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option v-for="estado in estados" :key="estado.id" :value="estado.id">
                    {{ estado.nombre }}
                  </option>
                </select>
              </div>

              <!-- Prioridad -->
              <div class="flex items-center">
                <label for="edit-prioridad" class="w-1/4 text-sm font-medium text-gray-700">Prioridad:</label>
                <select 
                  id="edit-prioridad" 
                  v-model="editableSolicitud.prioridad"
                  class="w-3/4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option v-for="prioridad in prioridades" :key="prioridad.id" :value="prioridad.id">
                    {{ prioridad.nombre }}
                  </option>
                </select>
              </div>

              <!-- Usuario Soporte -->
              <div class="flex items-center">
                <label for="edit-soporte" class="w-1/4 text-sm font-medium text-gray-700">Usuario Soporte:</label>
                <select 
                  id="edit-soporte" 
                  v-model="editableSolicitud.usuario_soporte"
                  class="w-3/4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Seleccione usuario de soporte</option>
                  <option v-for="(nombre, id) in usuariosSoporteMap" :key="id" :value="id">
                    {{ nombre }}
                  </option>
                </select>
              </div>
            <!-- Añadir dentro del modal de edición, después del selector de usuario de soporte -->
            <div v-if="editableSolicitud.estado === 6" class="flex items-center mt-4 animate__animated animate__fadeIn">
              <label for="fecha-asignacion" class="w-1/4 text-sm font-medium text-gray-700">Fecha Asignación:</label>
              <div class="w-3/4">
                <DatePicker
                  v-model="fechaAsignacionManual"
                  :model-config="{ type: 'string', mask: 'YYYY-MM-DDTHH:mm:00' }"
                  :masks="{ input: 'DD/MM/YYYY HH:mm' }"
                  :is-24hr="true"
                  mode="dateTime"
                  class="w-full"
                  :popover="{ 
                    visibility: 'click', 
                    placement: 'auto', 
                    isInteractive: true, 
                    modifiers: [{ name: 'preventOverflow', options: { padding: 8 } }],
                    positionFixed: true
                  }"
                >
                  <template v-slot="{ inputValue, inputEvents }">
                    <input
                      id="fecha-asignacion"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm"
                      :value="inputValue"
                      v-on="inputEvents"
                      placeholder="Opcional: Seleccione fecha y hora de asignación"
                    />
                  </template>
                </DatePicker>
                <p class="text-xs text-gray-500 mt-1">Si no selecciona fecha, se usará la fecha actual al guardar.</p>
              </div>
            </div>

            <!-- Agregar dentro del modal de edición, justo después del selector de estado -->
            <div v-if="editableSolicitud.estado === 6 && originalEstado !== 6" class="flex items-center mt-4 animate__animated animate__fadeIn">
              <label for="tarea-descripcion" class="w-1/4 text-sm font-medium text-gray-700">Descripción de tarea:</label>
              <div class="w-3/4">
                <textarea 
                  id="tarea-descripcion" 
                  v-model="nuevaTareaDescripcion" 
                  rows="2"
                  placeholder="Descripción para la tarea que se creará automáticamente"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
                <p class="text-xs text-gray-500 mt-1">Esta tarea se creará automáticamente al guardar la solicitud.</p>
              </div>
            </div>
          
            <!-- Fecha Programada para la tarea -->
            <div v-if="editableSolicitud.estado === 6 && originalEstado !== 6" class="flex items-center mt-4 animate__animated animate__fadeIn">
              <label for="tarea-fecha-programada" class="w-1/4 text-sm font-medium text-gray-700">Fecha Programada:</label>
              <div class="w-3/4">
                <DatePicker
                  v-model="nuevaTareaFechaProgramada"
                  :model-config="{ type: 'string', mask: 'YYYY-MM-DDTHH:mm:00' }"
                  :masks="{ input: 'DD/MM/YYYY HH:mm' }"
                  :is-24hr="true"
                  mode="dateTime"
                  class="w-full"
                  :popover="{ 
                    visibility: 'click', 
                    placement: 'auto', 
                    isInteractive: true, 
                    modifiers: [{ name: 'preventOverflow', options: { padding: 8 } }],
                    positionFixed: true
                  }"
                >
                  <template v-slot="{ inputValue, inputEvents }">
                    <input
                      id="tarea-fecha-programada"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm"
                      :value="inputValue"
                      v-on="inputEvents"
                      placeholder="Seleccione fecha y hora para programar la tarea"
                    />
                  </template>
                </DatePicker>
                <p class="text-xs text-gray-500 mt-1">Fecha y hora para programar la ejecución de la tarea.</p>
              </div>
            </div>
          
            
          </template>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-gradient-to-r from-gray-50 to-white px-6 py-4 sm:px-8 sm:flex sm:flex-row-reverse gap-3 border-t border-gray-200">
          <button 
            @click="updateSolicitud"
            type="button" 
            class="w-full sm:w-auto inline-flex justify-center items-center rounded-md px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-medium shadow-sm hover:from-blue-700 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Guardar Cambios
          </button>
          <button @click="closeModal" type="button" class="mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center items-center rounded-md px-6 py-2.5 border border-gray-300 bg-white text-gray-700 font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duración-200">
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

<!-- Modal para Ver Detalles -->
<div v-if="showModalDetails" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
  <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" aria-hidden="true"></div>
    <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

    <div class="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-gray-200">
      <div class="bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-4">
        <h3 class="text-2xl font-bold text-white flex items-center">
          <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Detalles de Solicitud
        </h3>
      </div>

      <div class="bg-white px-6 pt-6 pb-4 sm:p-8">
        <div v-if="detalleSolicitud" class="space-y-6">
          <!-- Información básica en cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
              <label class="block text-sm font-semibold text-gray-700 mb-1">Título</label>
              <p class="text-gray-800">{{ detalleSolicitud.titulo }}</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
              <label class="block text-sm font-semibold text-gray-700 mb-1">Estado</label>
              <span :class="[
                'px-2 py-1 text-sm font-medium rounded-full',
                detalleSolicitud.estado === 1 ? 'bg-yellow-100 text-yellow-800' :
                detalleSolicitud.estado === 2 ? 'bg-blue-100 text-blue-800' :
                detalleSolicitud.estado === 3 ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              ]">
                {{ getModuloName(detalleSolicitud.estado, 'estados') }}
              </span>
            </div>
          </div>

          <!-- Descripción con mejor formato -->
          <div class="bg-white p-4 rounded-lg border border-gray-200">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
            <p class="text-gray-700 whitespace-pre-wrap">{{ detalleSolicitud.descripcion }}</p>
          </div>

          <!-- Anexos con previsualización -->
          <div class="bg-white rounded-lg">
            <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
              </svg>
              Anexos
            </h4>
            <div v-if="anexos && anexos.length > 0" class="space-y-3">
              <div v-for="anexo in anexos" :key="anexo.id" 
                   class="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm text-gray-700 font-medium">{{ anexo.descripcion || 'Sin descripción' }}</span>
                  <div class="flex space-x-2">
                    <button 
                      @click="viewAnexo(anexo)"
                      class="inline-flex items-center px-4 py-2 border border-indigo-500 text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                    >
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      Ver
                    </button>
                    <button 
                      @click="downloadAnexo(anexo)"
                      class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                    >
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                      </svg>
                      Descargar
                    </button>
                  </div>
                </div>
                <!-- Área de previsualización -->
                <div v-if="anexo.isViewing" class="mt-4">
                  <div v-if="isImage(anexo)" class="flex justify-center border rounded-lg overflow-hidden">
                    <img 
                      :src="getAnexoUrl(anexo)" 
                      class="max-h-96 object-contain cursor-pointer hover:opacity-90 transition-opacity" 
                      :alt="anexo.descripcion"
                      @click="() => {
                        showImageModal = true;
                        currentImageUrl = anexo.archivo;
                      }"
                    >
                  </div>
                  <div v-else-if="isPDF(anexo)" class="flex items-center">
                    <a 
                      :href="getAnexoUrl(anexo)" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      class="inline-flex items-center text-indigo-600 hover:text-indigo-800"
                    >
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                      </svg>
                      Ver PDF en nueva pestaña
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <p v-else class="text-sm text-gray-500 italic">No hay anexos disponibles</p>
          </div>
        </div>
      </div>

      <!-- Footer con gradiente y botón mejorado -->
      <div class="bg-gradient-to-r from-gray-50 to-white px-6 py-4 sm:px-8 sm:flex sm:flex-row-reverse border-t border-gray-200">
        <button 
          @click="closeModal" 
          type="button" 
          class="w-full sm:w-auto inline-flex justify-center items-center rounded-md px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-medium shadow-sm hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          Cerrar
        </button>
      </div>
    </div>
  </div>
</div>

<!-- Modal para Tareas -->
<div v-if="showModalTarea" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
  <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-60 transition-opacity backdrop-blur-sm" aria-hidden="true" @click="closeModal"></div>

    <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

    <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-visible shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-indigo-100">
      <!-- Header -->
      <div class="bg-gradient-to-r from-indigo-600 to-blue-500 px-4 py-3 flex justify-between items-center">
        <h3 class="text-lg leading-6 font-medium text-white">
          {{ modalType === 'new' ? 'Nueva Tarea' : modalType === 'edit' ? 'Editar Tarea' : 'Detalle de Tarea' }}
        </h3>
        <button 
          type="button" 
          @click="closeModal" 
          class="text-white hover:text-gray-200 transition-colors duration-150"
        >
          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Contenido del formulario -->
      <div class="bg-white px-4 py-4">
        <div class="space-y-4">
          <!-- Campo Descripción -->
          <div class="flex items-start">
            <label class="block text-sm font-medium text-gray-700 w-1/4 pt-2">
              Descripción:
            </label>
            <textarea
              v-model="currentTarea.descripcion"
              :disabled="modalType === 'detail'"
              rows="3"
              class="block w-3/4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm"
              :class="{'bg-gray-50': modalType === 'detail'}"
            ></textarea>
          </div>

          <!-- Campos en dos columnas -->
          <div class="grid grid-cols-2 gap-4">
            <!-- Estado -->
            <div class="flex items-center">
              <label class="block text-sm font-medium text-gray-700 w-1/3">
                Estado:
              </label>
              <select
                v-model="currentTarea.estado"
                class="block w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm"
              >
                <option v-for="estado in estados" :key="estado.id" :value="estado.id">
                  {{ estado.nombre }}
                </option>
              </select>
            </div>

            <!-- Usuario Asignado -->
            <div class="flex items-center">
              <label class="block text-sm font-medium text-gray-700 w-1/3">
                Asignado a:
              </label>
              <select
                v-model="currentTarea.usuario_asignado"
                class="block w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm"
              >
                <option value="">Sin asignar</option>
                <option v-for="(nombre, id) in usuariosSoporteMap" :key="id" :value="id">
                  {{ nombre }}
                </option>
              </select>
            </div>
          </div>
          
          <!-- Fecha Programada -->
          <div class="flex items-center">
            <label class="block text-sm font-medium text-gray-700 w-1/4">
              F. Programada:
            </label>
            <div class="w-3/4">
              <DatePicker
                v-model="currentTarea.fecha_programada"
                :model-config="{ type: 'string', mask: 'YYYY-MM-DDTHH:mm:00' }"
                :masks="{ input: 'DD/MM/YYYY HH:mm' }"
                :time-picker-options="timePickerOptions"
                :is-24hr="true"
                mode="dateTime"
                class="w-full"
              >
                <template v-slot="{ inputValue, inputEvents }">
                  <input
                    class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm"
                    :value="inputValue"
                    v-on="inputEvents"
                  />
                </template>
              </DatePicker>
            </div>
          </div>

          <!-- Fecha Inicio -->
          <div class="flex items-center">
            <label class="block text-sm font-medium text-gray-700 w-1/4">
              F. Inicio:
            </label>
            <div class="w-3/4">
              <DatePicker
                v-model="currentTarea.fecha_inicio"
                :model-config="{ type: 'string', mask: 'YYYY-MM-DDTHH:mm:00', timeAdjust: 'none' }"
                :masks="{ input: 'DD/MM/YYYY HH:mm' }"
                :time-picker-options="timePickerOptions"
                :is-24hr="true"
                mode="dateTime"
                class="w-full"
                @update:model-value="calcularDuracion"
                :popover="{ 
                  visibility: 'click', 
                  placement: 'auto', 
                  isInteractive: true, 
                  modifiers: [{ name: 'preventOverflow', options: { padding: 8 } }],
                  positionFixed: true
                }"
              >
                <template v-slot="{ inputValue, inputEvents }">
                  <div class="relative">
                    <input
                      class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm"
                      :value="inputValue"
                      v-on="inputEvents"
                    />
                    <button 
                      type="button"
                      @click="setCurrentDateTime('inicio')"
                      class="absolute inset-y-0 right-0 px-3 flex items-center bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-r-lg transition-colors"
                      title="Usar fecha y hora actual"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                </template>
              </DatePicker>
            </div>
          </div>

          <!-- Campos adicionales solo para edición -->
          <div v-if="modalType === 'edit'" class="flex items-center mt-4">
            <label class="block text-sm font-medium text-gray-700 w-1/4">
              Reasignar a:
            </label>
            <select
              v-model="currentTarea.usuario_reasignado"
              class="block w-3/4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm"
            >
              <option value="">Sin reasignar</option>
              <option 
                v-for="(nombre, id) in usuariosSoporteMap" 
                :key="id" 
                :value="id"
                :disabled="id == currentTarea.usuario_asignado"
              >
                {{ nombre }}
              </option>
            </select>
          </div>
          <template v-if="modalType === 'edit'">
            <!-- Fecha Fin -->
            <div class="flex items-center">
              <label class="block text-sm font-medium text-gray-700 w-1/4">
                F. Fin:
              </label>
              <div class="w-3/4">
                <DatePicker
                  v-model="currentTarea.fecha_fin"
                  :model-config="{ type: 'string', mask: 'YYYY-MM-DDTHH:mm:00', timeAdjust: 'none' }"
                  :masks="{ input: 'DD/MM/YYYY HH:mm' }"
                  :time-picker-options="timePickerOptions"
                  :is-24hr="true"
                  mode="dateTime"
                  class="w-full"
                  @update:model-value="calcularDuracion"
                  :popover="{ 
                    visibility: 'click', 
                    placement: 'auto', 
                    isInteractive: true, 
                    modifiers: [{ name: 'preventOverflow', options: { padding: 8 } }],
                    positionFixed: true
                  }"
                >
                  <template v-slot="{ inputValue, inputEvents }">
                    <div class="relative">
                      <input
                        class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm"
                        :value="inputValue"
                        v-on="inputEvents"
                      />
                      <button 
                        type="button"
                        @click="setCurrentDateTime('fin')"
                        class="absolute inset-y-0 right-0 px-3 flex items-center bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-r-lg transition-colors"
                        title="Usar fecha y hora actual"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </div>
                  </template>
                </DatePicker>
              </div>
            </div>

            <!-- Duración y Tiempo Facturable -->
            <div class="grid grid-cols-2 gap-4">
              <div class="flex items-center">
                <label class="block text-sm font-medium text-gray-700 w-1/3">
                  Duración:
                </label>
                <input
                  type="text"
                  v-model="currentTarea.duracion"
                  readonly
                  class="block w-2/3 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm"
                  placeholder="Auto"
                />
              </div>

              <div class="flex items-center">
                <label class="block text-sm font-medium text-gray-700 w-1/3">
                  T. Facturable:
                </label>
                <input
                  type="text"
                  v-model="currentTarea.tiempoFacturable"
                  placeholder="Ej: 2h"
                  class="block w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm"
                />
              </div>
            </div>
          </template>

          <!-- Tipo y Cita -->
          <div class="grid grid-cols-2 gap-4">
            <div class="flex items-center">
              <label class="block text-sm font-medium text-gray-700 w-1/3">
                Tipo:
              </label>
              <select
                v-model="currentTarea.tipo"
                class="block w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm"
              >
                <option v-for="option in tipoOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>

            <div class="flex items-center">
              <label class="block text-sm font-medium text-gray-700 w-1/3">
                ¿Cita?:
              </label>
              <select
                v-model="currentTarea.cita"
                class="block w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm"
              >
                <option value="N">No</option>
                <option value="S">Sí</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
        <button
          v-if="modalType !== 'detail'"
          @click="saveTarea"
          type="button"
          class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-base font-medium text-white hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
        >
          {{ modalType === 'new' ? 'Crear' : 'Actualizar' }}
        </button>
        <button
          type="button"
          @click="closeModal"
          class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        >
          {{ modalType === 'detail' ? 'Cerrar' : 'Cancelar' }}
        </button>
      </div>
    </div>
  </div>
</div>

<!-- Modal para ver imagen -->
<Teleport to="body">
  <div v-if="showImageModal" class="fixed inset-0 z-50 overflow-hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-center justify-center min-h-screen p-4">
      <div 
        class="fixed inset-0 bg-black bg-opacity-75 transition-opacity" 
        @click="showImageModal = false"
      ></div>
      
      <div class="relative bg-white rounded-lg max-w-4xl w-full mx-auto overflow-hidden">
        <div class="absolute top-0 right-0 pt-4 pr-4 z-10">
          <button 
            @click="showImageModal = false" 
            class="bg-white rounded-full p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <svg class="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="relative">
          <img 
            :src="currentImageUrl" 
            class="max-h-[80vh] w-auto mx-auto"
            alt="Vista ampliada"
          >
        </div>
      </div>
    </div>
  </div>
</Teleport>



</template>

<script setup>
import { PlusIcon } from '@heroicons/vue/24/outline'
import { Teleport } from 'vue'
import { DatePicker } from 'v-calendar'

</script>

<script>
import apiClient from '@/apiClient';
import { memoize } from 'lodash';
export default {
name: 'FormSolicitud',
components: {
  PlusIcon,
  Teleport,
  DatePicker
},
data() {
  return {
  
    
    // Estados de modal

    
    currentSolicitud: null,
    allSolicitudes: [],
    currentPage: 1,     
    pageSize: 20,       
    editingField: null, 
    editingRowId: null, 
    dropdownOpen: {},
    filters: {
      empresa: [], // Inicializar como array vacío
    },
    solicitudes: [],
    usuariosSoporte: [],
    searchQuery: '',
    filterPrioridades: [],
    filterEstados: [],
    filterModulos: [],
    sortBy: 'fecha_creacion',
    sortOrder: 'desc',
    startDate: '',
    endDate: '',
    isSuccess: false,
    modulos: [],
    submodulos: [],
    prioridades: [],
    estados: [],
    acciones: [],
    detalleSolicitud: null,
    editableSolicitud: {
      usuario_soporte: null,
      fecha_asignacion: "",
      orden: null,
    },
    isFechaAsignada: false,
    newSolicitud: {
      titulo: '',
      descripcion: '',
      modulo: null,
      submodulo: null,
      accion: null,
      estado: 5, 
      prioridad: 1,
      fecha_creacion_manual: null
    },
    anexos: [],
    empresas: [], // Lista de empresas
    empresaSearchQuery: '', // Búsqueda de empresas
    selectedFile: null,
    showModalDetails: false,
    showModalEdit: false,
    showModalCreate: false,
    errorMessage: '',
    statusMessage: '',
    tareasSolicitud: [],

    currentSolicitudId: null,
    tareas: [],
    columnWidths: {
      acciones: 50,
      id: 11,
      fecha_creacion: 80,
      fecha_asignacion: 80,
      fecha_finalizacion: 80,
      titulo: 200,              
      modulo: 100,
      submodulo: 100,
      accion: 100,
      estado: 50,
      prioridad: 20,           
      orden: 11,
      version_error: 11,
      
    },
    columns: [
      { key: 'acciones', label: 'Acciones' },
      { key: 'id', label: '#' },
      { key: 'fecha_creacion', label: 'F.Crea' },
      { key: 'clie', label: 'Empresa' },
      { key: 'usuario_cliente_nombre', label: 'Q.Repo' },
      { key: 'titulo', label: 'Título' },
      { key: 'modulo', label: 'Módulo' },
      { key: 'submodulo', label: 'Submodulo' },
      { key: 'accion', label: 'Acción' },
      { key: 'estado', label: 'Estado' },
      { key: 'prioridad', label: 'Pr' },
      { key: 'usuario_soporte_nombre', label: 'Resp' },
      { key: 'fecha_asignacion', label: 'F.Asig' },
      { key: 'orden', label: 'Orden' },
      { key: 'version_error', label: 'Vrs' },
      { key: 'fecha_finalizacion', label: 'F.Fin' },
      
    ],
    nombreCompleto: '',
    userType: 'C', // Valor por defecto
    usuariosSoporteMap: {},
    usuariosSoporteList: [],
    colombiaTime: null,
    tareaOriginal: null,
    dropdownPosition: {
      x: 0,
      y: 0
    },
    columnOptions: {
      fecha_creacion: [
        { id: 'today', nombre: 'Hoy' },
        { id: 'week', nombre: 'Esta semana' },
        { id: 'month', nombre: 'Este mes' },
        { id: 'year', nombre: 'Este año' },
        { id: 'past', nombre: 'Años anteriores' }
      ],
      fecha_asignacion: [
        { id: 'today', nombre: 'Hoy' },
        { id: 'week', nombre: 'Esta semana' },
        { id: 'month', nombre: 'Este mes' },
        { id: 'year', nombre: 'Este año' },
        { id: 'past', nombre: 'Años anteriores' }
      ],
    },
    showToast: false,
    toastTimeout: null,
    originalEstado: null,
    usuariosMap: {}, // Para almacenar el mapeo de IDs a nombres de usuario
    showError: false,
    debouncedSearchTimeout: null,
    estadoCancelado: '8', // ID del estado "Cancelado" - ajustar según corresponda
    terceroId: null,
    terceroNombre: 'Sin empresa',
    terceros: [],
    usuariosTercerosMap: {},
    tercerosMap: {},
    // Estados para modales de tareas
    showModalTarea: false,
    modalType: '', // 'new', 'edit', 'detail'
    currentTarea: {
      id: null,
      descripcion: '',
      fecha_programada: null,
      fecha_inicio: null,
      fecha_fin: null,
      duracion: '00:00',
      tiempoFacturable: '00:00',
      motivo_cancelacion: '',
      solicitud: null,
      usuario_asignado: null,
      usuario_reasignado: null,
      estado: 5
    },
    tipoOptions: [
      { value: 'G', label: 'Garantía' },
      { value: 'I', label: 'Interno' },
      { value: 'F', label: 'Facturable' }
    ],
    showImageModal: false,
    currentImageUrl: null,
    timePickerOptions: {
      hours: { min: 8, max: 18 },
      minutes: { step: 5 }
    },
    empresaSearch: '',
    nuevaTareaDescripcion: '',
    nuevaTareaFechaProgramada: null,
    empresaActual: '',
    originalSolicitudes: [],
    fechaAsignacionManual: null,
    };
},
computed: {
  filteredSolicitudes() {
    console.log('Recalculando filteredSolicitudes...');
    
    // Si no hay datos originales, devolver array vacío
    if (!this.originalSolicitudes || !Array.isArray(this.originalSolicitudes)) {
      return [];
    }
    
    // Comenzar con los datos originales
    let filtered = [...this.originalSolicitudes];
    console.log('Datos originales:', filtered.length);
    
    // Aplicar filtro de empresa si está activo
    if (this.filters.empresa && this.filters.empresa.length > 0) {
      const selectedCompanyIds = this.filters.empresa;
      const selectedCompanies = selectedCompanyIds.map(id => 
        this.empresas.find(e => e.id === id)?.nombre
      ).filter(Boolean);
      
      filtered = filtered.filter(solicitud => {
        const empresaNombre = solicitud.empresa_nombre || solicitud.clie;
        return selectedCompanies.includes(empresaNombre);
      });
      console.log('Después de filtro empresa:', filtered.length);
    }
    
    // Aplicar otros filtros
    Object.entries(this.filters).forEach(([key, values]) => {
      if (key === 'empresa' || !values || values.length === 0) return;
      
      filtered = filtered.filter(solicitud => {
        if (['estado', 'prioridad', 'modulo', 'submodulo', 'accion'].includes(key)) {
          return values.includes(solicitud[key]);
        } else if (key === 'usuario_cliente_nombre') {
          return values.includes(solicitud.usuario_cliente);
        } else if (key === 'usuario_soporte_nombre') {
          return values.includes(solicitud.usuario_soporte);
        } else if (key.includes('fecha')) {
          const fechaSolicitud = new Date(solicitud[key]);
          return this.isDateInFilter(fechaSolicitud, values);
        } else {
          return values.includes(solicitud[key]);
        }
      });
      console.log(`Después de filtro ${key}:`, filtered.length);
    });
    
    // Aplicar búsqueda si existe
    if (this.searchQuery) {
      const searchLower = this.searchQuery.toLowerCase();
      filtered = filtered.filter(solicitud => 
        solicitud.titulo?.toLowerCase().includes(searchLower) ||
        solicitud.descripcion?.toLowerCase().includes(searchLower) ||
        solicitud.id?.toString().includes(searchLower)
      );
    }
    
    return filtered;
  },
  filteredAndSortedSolicitudes() {
    let result = [...this.allSolicitudes];

    // Aplicar búsqueda global
    if (this.searchQuery) {
      const searchLower = this.searchQuery.toLowerCase();
      result = result.filter(solicitud => {
        return (
          // Datos básicos
          String(solicitud.id)?.toLowerCase().includes(searchLower) ||
          solicitud.titulo?.toLowerCase().includes(searchLower) ||
          solicitud.descripcion?.toLowerCase().includes(searchLower) ||
          
          // Usuarios
          solicitud.usuario_cliente_nombre?.toLowerCase().includes(searchLower) ||
          solicitud.usuario_soporte_nombre?.toLowerCase().includes(searchLower) ||
          
          // Estados y prioridades
          this.getModuloName(solicitud.estado, 'estados')?.toLowerCase().includes(searchLower) ||
          this.getModuloName(solicitud.prioridad, 'prioridades')?.toLowerCase().includes(searchLower) ||
          
          // Módulos y submódulos
          this.getModuloName(solicitud.modulo, 'modulos')?.toLowerCase().includes(searchLower) ||
          solicitud.submodulo_nombre?.toLowerCase().includes(searchLower) ||
          
          // Fechas
          this.formatDate(solicitud.fecha_creacion)?.includes(searchLower) ||
          this.formatDate(solicitud.fecha_asignacion)?.includes(searchLower) ||
          this.formatDate(solicitud.fecha_finalizacion)?.includes(searchLower)
        );
      });
    }

    // Aplicar filtros específicos (mantener el código existente de filtros)
    result = this.filterSolicitudes(result);

    // Aplicar ordenamiento
    if (this.sortBy) {
      result.sort((a, b) => {
        let aValue = a[this.sortBy];
        let bValue = b[this.sortBy];

        // Convertir a fechas si es necesario
        if (this.sortBy.includes('fecha')) {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        if (this.sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    return result;
  },
  filteredOpciones() {
    if (!this.newSolicitud.modulo) {
      return [];
    }
    return this.opciones.filter(opcion => opcion.startsWith(this.newSolicitud.modulo));
  },
  filteredSubmodulos() {
    if (!this.newSolicitud.modulo) {
      return [];
    }
    return this.submodulos.filter(submodulos => 
      submodulos.modulo === this.newSolicitud.modulo
    );
  },

  // Nuevo computed property para edición
  filteredSubmodulosEdit() {
    if (!this.editableSolicitud.modulo) {
      return [];
    }
    return this.submodulos.filter(submodulos => 
      submodulos.modulo === this.editableSolicitud.modulo
    );
  },
  filteredColumns() {
    const restrictedColumns = {
      C: ["clie", "prioridad", "orden", "id", "usuario_soporte"],
      S: [],
      A: []  
    };

    return this.columns.filter(column => 
      !(restrictedColumns[this.userType] || []).includes(column.key)
    );
  },
  paginatedSolicitudes() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    
    // Tomar una porción de las solicitudes filtradas
    return this.filteredSolicitudes.slice(startIndex, endIndex);
  },
  totalPages() {
    return Math.ceil(this.filteredSolicitudes.length / this.pageSize);
  },
  columnFilterOptions() {
    const getUniqueModulos = () => {
      const modulosUnicos = [...new Set(this.solicitudes.map(s => s.modulo))].filter(Boolean);
      return modulosUnicos.map(moduloId => {
        const modulo = this.modulos.find(m => m.id === moduloId);
        return modulo ? {
          id: modulo.id,
          nombre: modulo.nombre
        } : null;
      }).filter(Boolean);
    };

    const getUniqueSubmodulos = () => {
      const submodulosUnicos = [...new Set(this.solicitudes.map(s => s.submodulo))].filter(Boolean);
      return submodulosUnicos.map(submoduloId => {
        const submodulo = this.submodulos.find(s => s.id === submoduloId);
        return submodulo ? {
          id: submodulo.id,
          nombre: submodulo.nombre
        } : null;
      }).filter(Boolean);
    };

    return {
      ...this.columnOptions,
      modulo: getUniqueModulos(),
      submodulo: getUniqueSubmodulos()
    };
  },
  filteredEmpresas() {
    console.log('Calculando filteredEmpresas, total empresas:', this.empresas?.length || 0);
    
    if (!this.empresas || this.empresas.length === 0) {
      console.log('No hay empresas disponibles');
      return [];
    }
    
    if (!this.empresaSearchQuery) {
      console.log('Mostrando todas las empresas');
      return this.empresas;
    }
    
    const query = this.empresaSearchQuery.toLowerCase();
    const filtered = this.empresas.filter(empresa => {
      // Verificar que empresa y empresa.nombre existen
      if (!empresa || !empresa.nombre) {
        console.log('Empresa sin nombre:', empresa);
        return false;
      }
      
      return empresa.nombre.toLowerCase().includes(query);
    });
    
    console.log('Empresas filtradas:', filtered.length);
    return filtered;
  },
  empresasConSolicitudes() {
    // Si no hay solicitudes originales, devolver array vacío
    if (!this.originalSolicitudes || !Array.isArray(this.originalSolicitudes)) {
      return [];
    }
    
    // Obtener un conjunto único de IDs o nombres de empresas que aparecen en solicitudes
    const empresasUnicas = new Set();
    const nombresEmpresas = new Map(); // Para mapear nombres a IDs
    
    this.originalSolicitudes.forEach(solicitud => {
      const empresaNombre = solicitud.empresa_nombre || solicitud.clie;
      if (empresaNombre) {
        // Buscar la empresa en la lista completa
        const empresa = this.empresas.find(e => e.nombre === empresaNombre);
        if (empresa) {
          empresasUnicas.add(empresa.id);
          nombresEmpresas.set(empresa.id, empresaNombre);
        }
      }
    });
    
    // Convertir el conjunto a un array de objetos empresa
    return Array.from(empresasUnicas).map(id => ({
      id: id,
      nombre: nombresEmpresas.get(id) || `Empresa ${id}` // Nombre de respaldo si no se encuentra
    })).sort((a, b) => a.nombre.localeCompare(b.nombre)); // Ordenar alfabéticamente
  },
},
created() {
  this.fetchTerceros();
  const user = JSON.parse(localStorage.getItem('user'));
  const userData = localStorage.getItem('user');
  if (userData) {
    const user = JSON.parse(userData);
    if (user && user.tipo) {
      this.userType = user.tipo; // Asignar el tipo de usuario
    } else {
      this.userType = 'C'; // Valor predeterminado si no hay tipo de usuario
    }
  } else {
    this.userType = 'C'; // Valor predeterminado si no hay usuario en localStorage
  }
  if (user) {
    this.userType = user.tipo; // Asignar el tipo de usuario
  }
  if (user) {
    this.newSolicitud.usuario_cliente = user.id;
    this.newSolicitud.usuario_cliente_nombre = user.username;
    this.newSolicitud.usuario_cliente_email = user.email;



  } else {
    alert('No se encontró información del usuario. Por favor, inicia sesión.');
    this.$router.push('/');
  }
  this.initializeColumnWidths();
  this.fetchUsuariosSoporte();
  this.fetchUsuarios(); // Método para cargar todos los usuarios

  // Inicializar filtros
  this.filteredColumns.forEach(column => {
    this.filters[column.key] = [];
    this.dropdownOpen[column.key] = false;
  });
  
  this.columnOptions = {};
  this.filteredColumns.forEach(column => {
    this.columnOptions[column.key] = this.getColumnOptions(column.key);
  });
},

mounted() {
  this.fetchSolicitudes();
  this.cargarUsuario();
  this.sortTable('fecha_creacion'); 
  this.fetchUsuariosSoporte();
  window.addEventListener('click', this.closeDropdowns); 
  this.fetchAcciones();
  this.fetchEstados();
  this.fetchModulos();
  this.fetchPrioridades();
  this.fetchSubmodulos();
  this.sortOrder = 'desc';
  
  // Cargar datos del usuario incluyendo el tercero seleccionado
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  this.terceroId = userData.terceroId || null;
  this.terceroNombre = userData.terceroNombre || 'Sin empresa';
  
  // Obtener la empresa actual del usuario
  try {
    // Obtener el usuario directamente de localStorage como JSON
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('accessToken');
    
    if (currentUser && currentUser.terceroId) {
      // Obtener el terceroId del usuario
      const terceroId = currentUser.terceroId;
      
      // Cargar usuarios-terceros para validar la relación usando promesas
      apiClient.get('/usuariosTerceros/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        // Buscar el tercero correspondiente
        const usuarioTercero = response.data.find(ut => 
          ut.tercero && ut.tercero.id === terceroId
        );
        
        if (usuarioTercero && usuarioTercero.tercero) {
          this.empresaActual = usuarioTercero.tercero.nombre;
          console.log('Empresa actual:', this.empresaActual);
        }
      })
      .catch(error => {
        console.error('Error al obtener usuarios-terceros:', error);
      });
    }
  } catch (error) {
    console.error('Error al obtener la empresa actual:', error);
  }
},
beforeUnmount() {
  window.removeEventListener('click', this.closeDropdowns);
  if (this.toastTimeout) {
    clearTimeout(this.toastTimeout)
  }
  // Asegurarse de restaurar el scroll cuando el componente se desmonta
},
methods: {
  clearEmpresaFilter() {
    this.filters.empresa = [];
    this.empresaSearchQuery = '';
    this.applyFilters();
  },
  
  selectAllEmpresas() {
    // Usar empresasConSolicitudes en lugar de todas las empresas
    this.filters.empresa = this.empresasConSolicitudes.map(empresa => empresa.id);
    this.handleFilterChange();
  },
  handleFilterChange() {
    console.log('Filtros cambiados:', JSON.stringify(this.filters));
    this.currentPage = 1; // Regresar a la primera página
  },
  applyAllFilters() {
    console.log('Aplicando todos los filtros...');
    
    // Comenzar con los datos originales
    let filtered = [...this.originalSolicitudes];
    
    // Aplicar filtro de empresa si está activo
    if (this.filters.empresa && this.filters.empresa.length > 0) {
      console.log('Aplicando filtro de empresa:', this.filters.empresa);
      
      // Obtener nombres de empresas seleccionadas
      const selectedCompanyIds = this.filters.empresa;
      const selectedCompanies = selectedCompanyIds.map(id => 
        this.empresas.find(e => e.id === id)?.nombre
      ).filter(Boolean);
      
      console.log('Empresas seleccionadas:', selectedCompanies);
      
      // Filtrar por nombre de empresa
      filtered = filtered.filter(solicitud => {
        const empresaNombre = solicitud.empresa_nombre || solicitud.clie;
        return selectedCompanies.includes(empresaNombre);
      });
      
      console.log(`Después de filtro empresa: ${filtered.length} solicitudes`);
    }
    
    // Aplicar otros filtros
    Object.entries(this.filters).forEach(([key, values]) => {
      if (key === 'empresa' || !values || values.length === 0) return; // Omitir filtro de empresa (ya aplicado)
      
      console.log(`Aplicando filtro ${key}:`, values);
      
      filtered = filtered.filter(solicitud => {
        // Manejar diferentes tipos de filtros apropiadamente
        if (['estado', 'prioridad', 'modulo', 'submodulo', 'accion'].includes(key)) {
          return values.includes(solicitud[key]);
        } else if (key === 'usuario_cliente_nombre') {
          return values.includes(solicitud.usuario_cliente);
        } else if (key === 'usuario_soporte_nombre') {
          return values.includes(solicitud.usuario_soporte);
        } else if (key.includes('fecha')) {
          // Manejar filtros de fecha
          const fechaSolicitud = new Date(solicitud[key]);
          return this.isDateInFilter(fechaSolicitud, values);
        } else {
          // Caso por defecto
          return values.includes(solicitud[key]);
        }
      });
      
      console.log(`Después de filtro ${key}: ${filtered.length} solicitudes`);
    });
    
    // Aplicar búsqueda si existe
    if (this.searchQuery) {
      const searchLower = this.searchQuery.toLowerCase();
      filtered = filtered.filter(solicitud => 
        solicitud.titulo?.toLowerCase().includes(searchLower) ||
        solicitud.descripcion?.toLowerCase().includes(searchLower) ||
        solicitud.id?.toString().includes(searchLower)
      );
      console.log(`Después de búsqueda: ${filtered.length} solicitudes`);
    }
    
    // Actualizar allSolicitudes con los resultados filtrados
    this.allSolicitudes = filtered;
    
    // Resetear a la primera página y aplicar paginación
    this.currentPage = 1;
    
    // CLAVE: Reset solicitudes antes de aplicar paginación
    this.solicitudes = [];
    
    // Forzar actualización completa usando nextTick
    this.$nextTick(() => {
      this.applyPagination();
    });
    
    console.log('Filtrado completado. Solicitudes a mostrar:', this.solicitudes.length);
  },
isDateInFilter(date, filterValues) {
  if (!date || isNaN(date.getTime())) return false;
  
  const today = new Date();
  
  return filterValues.some(filterId => {
    switch (filterId) {
      case 'today':
        return date.toDateString() === today.toDateString();
      case 'week': {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        return date >= startOfWeek && date <= endOfWeek;
      }
      case 'month': {
        return date.getMonth() === today.getMonth() && 
               date.getFullYear() === today.getFullYear();
      }
      case 'year': {
        return date.getFullYear() === today.getFullYear();
      }
      case 'past': {
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        return date < startOfYear;
      }
      default:
        return false;
    }
  });
},

  // Método auxiliar para filtrar por todos los criterios
  filterSolicitudByAllCriteria(solicitud) {
    // Aplicar todos los demás filtros
    for (const [key, values] of Object.entries(this.filters)) {
      if (key === 'empresa' || values.length === 0) continue; // Omitir empresa que ya se procesó
      
      // Obtener el valor a comparar
      const solicitudValue = solicitud[key];
      
      // Si hay valores seleccionados y el valor de la solicitud no está entre ellos
      if (values.length > 0 && !values.includes(solicitudValue)) {
        return false;
      }
    }
    
    return true;
  },

  async created() {
    await this.fetchSubmodulos();
    console.log('Componente creado - Iniciando carga de datos');
    try {
      const response = await apiClient.get('/terceros/');
      this.empresas = response.data;
    } catch (error) {
      console.error('Error al cargar empresas:', error);
    }
    try {
      this.isLoading = true;
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        console.error('No se encontró token de acceso');
        return;
      }

      console.log('Token encontrado:', token);

      // 1. Cargar usuarios-terceros
      console.log('Iniciando carga de usuarios-terceros...');
      const usuariosTercerosResponse = await apiClient.get('/usuariosTerceros/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Datos de usuariosTerceros:', usuariosTercerosResponse.data);

      // Crear mapa de usuarios-terceros
      this.usuariosTercerosMap = {};
      usuariosTercerosResponse.data.forEach(ut => {
        if (ut.usuario && ut.tercero) {
          this.usuariosTercerosMap[ut.usuario.id] = {
            tercero: ut.tercero,
            usuario: ut.usuario
          };
          console.log(`Agregado al mapa - Usuario ID ${ut.usuario.id}:`, {
            terceroNombre: ut.tercero.nombre,
            usuarioNombre: ut.usuario.nombre || ut.usuario.username
          });
        }
      });


      // 2. Cargar solicitudes
      console.log('Iniciando carga de solicitudes...');
      const solicitudesResponse = await apiClient.get('/solicitudes/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });


      // Procesar cada solicitud
      this.allSolicitudes = solicitudesResponse.data.map(solicitud => {
        const usuarioTercero = this.usuariosTercerosMap[solicitud.usuario_cliente];

        console.log(`Procesando solicitud ${solicitud.id}:`, {
          usuario_cliente: solicitud.usuario_cliente,
          usuarioTercero: usuarioTercero
        });

        return {
          ...solicitud,
          clie: usuarioTercero ? usuarioTercero.tercero.nombre : 'Sin empresa',
          usuario_cliente_nombre: usuarioTercero ? 
            `${usuarioTercero.usuario.first_name || ''} ${usuarioTercero.usuario.last_name || ''}`.trim() || 
            usuarioTercero.usuario.username : 
            'Usuario no encontrado'
        };
      });

      console.log('Solicitudes procesadas:', this.allSolicitudes);

      // Ordenar y aplicar paginación
      this.allSolicitudes.sort((a, b) => 
        new Date(b.fecha_creacion) - new Date(a.fecha_creacion)
      );
      
      this.applyPagination();
      
    } catch (error) {
      console.error('Error en carga inicial:', error);
      if (error.response) {
        console.error('Detalles del error:', {
          status: error.response.status,
          data: error.response.data
        });
      }
    } finally {
      this.isLoading = false;
    }
  },

  formatearFechaHoraActual() {
    // Obtener la fecha y hora actual
    const now = new Date();
    
    // Sumar 5 horas explícitamente
    now.setHours(now.getHours() + 5);
    
    // Formatear en formato ISO
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    // Formato: YYYY-MM-DDTHH:MM:SS
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    
    return formattedDate;
  },
  async fetchTerceros() {
  try {
    console.log('Cargando terceros...');
    const token = localStorage.getItem('accessToken');
    const response = await apiClient.get('/terceros/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Terceros cargados:', response.data);
    this.empresas = response.data;
    
    // Verificar que los datos tienen la estructura esperada
    if (this.empresas.length > 0) {
      console.log('Ejemplo de tercero:', this.empresas[0]);
    }
  } catch (error) {
    console.error('Error al cargar terceros:', error);
    if (error.response) {
      console.error('Detalles del error:', error.response.data);
    }
  }
},
  getRowClass(index) {
    return index % 2 === 0 ? 'bg-white' : 'bg-gray-100';
  },
  async fetchAcciones() {
  try {
    const response = await apiClient.get('/acciones/');
    this.acciones = response.data;
  } catch (error) {
    console.error('Error al obtener acciones:', error);
  }
},
async fetchEstados() {
  try {
    const response = await apiClient.get('/estados/');
    this.estados = response.data;
  } catch (error) {
    console.error('Error al obtener estados:', error);
  }
},
async fetchModulos() {
    try {
      const response = await apiClient.get('/modulos/');
      this.modulos = response.data;
    } catch (error) {
      console.error('Error al obtener módulos:', error);
    }
  },
async fetchPrioridades() {
  try {
    const response = await apiClient.get('/prioridades/');
    this.prioridades = response.data;
  } catch (error) {
    console.error('Error al obtener prioridades:', error);
  }
},
getSubmoduloNombre(submoduloId) {
    if (!submoduloId) return 'No asignado';
    
    const submodulo = this.submodulos.find(s => s.id === submoduloId);
    if (!submodulo) {
      // Si no encontramos el submódulo, intentamos usar el nombre guardado
      return this.solicitud?.submodulo_nombre || 'No asignado';
    }
    
    return submodulo.nombre;
  },
  
  // Asegurarse que los submódulos estén cargados
  async fetchSubmodulos() {
    try {
      const response = await apiClient.get('/submodulos/');
      this.submodulos = response.data;
    } catch (error) {
      console.error('Error al cargar submódulos:', error);
    }
  },
  async saveField(solicitud, field) {
    try {
      const colombiaTime = await this.getColombiaTime();
      let dataToUpdate = {
        titulo: solicitud.titulo,
        descripcion: solicitud.descripcion,
        modulo: solicitud.modulo,
        submodulo: solicitud.submodulo,
        accion: solicitud.accion,
        estado: solicitud.estado,
        prioridad: solicitud.prioridad,
        usuario_cliente: solicitud.usuario_cliente,
        usuario_soporte: solicitud.usuario_soporte || null,
        orden: solicitud.orden || null
      };

      if (field === 'estado') {
        dataToUpdate.fecha_asignacion = solicitud.estado !== 'S' ? colombiaTime.toISOString() : null;
        dataToUpdate.fecha_finalizacion = solicitud.estado === 'T' ? colombiaTime.toISOString() : null;
      }

      const token = localStorage.getItem('accessToken');
      const response = await apiClient.put(
        `/solicitudes/${solicitud.id}/`, 
        dataToUpdate,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        this.editingRowId = null;
        this.editingField = null;
        this.statusMessage = 'Cambios guardados correctamente';
        this.isSuccess = true;
        await this.fetchSolicitudes();
      }
    } catch (error) {
      this.statusMessage = error.response?.data?.detail || 'Error al guardar los cambios';
      this.isSuccess = false;
      
      const originalSolicitud = this.solicitudes.find(s => s.id === solicitud.id);
      if (originalSolicitud) {
        solicitud[field] = originalSolicitud[field];
      }
    }
  },
  
  cargarUsuario() {
    const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        if (user) {
          this.nombreCompleto = `${user.nombres} ${user.apellidos}`; // Asignar el nombre completo
        }
      }
  },

  async getColombiaTime() {
  try {
    const now = new Date();
    // Sumar 5 horas
    now.setHours(now.getHours() + 5);
    
    // Formatear la fecha
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // Crear fecha ISO
    const adjustedTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    console.log('Hora ajustada (+5):', adjustedTime);
    
    return new Date(adjustedTime);
  } catch (error) {
    console.warn('Error al generar hora:', error);
    const now = new Date();
    now.setHours(now.getHours() + 5);
    return now;
  }
},
  
  formatDate(dateString) {
  if (!dateString) return '';
  
  try {
    // Agregar 'Z' para interpretar la fecha como UTC si no tiene zona horaria
    const date = new Date(dateString + (dateString.endsWith('Z') ? '' : 'Z'));
    
    // Formatear en zona horaria de Colombia
    return date.toLocaleString('es-CO', {
      timeZone: 'America/Bogota',
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch (error) {
    console.warn('Error al formatear fecha:', error);
    return dateString;
  }
},
async setFechaSistema() {
  if (this.editableSolicitud.estado !== "S" && !this.isFechaAsignada) {
    const colombiaTime = await this.getColombiaTime();
    this.editableSolicitud.fecha_asignacion = this.formatDate(colombiaTime);
    this.isFechaAsignada = true;
  }
},
  isWithinDateRange(date) {
    if (!this.startDate && !this.endDate) return true;
    const solicitudDate = new Date(date);
    const start = this.startDate ? new Date(this.startDate) : new Date(0);
    const end = this.endDate ? new Date(this.endDate) : new Date();
    return solicitudDate >= start && solicitudDate <= end;
  },
  toggleDropdown(columnKey, event) {
    console.log('Abriendo dropdown para:', columnKey);
    
    // Si es el dropdown de empresa, asegúrate de cargar todas las empresas
    if (columnKey === 'empresa') {
      this.empresaSearch = '';
      this.filteredEmpresas = [...this.empresas]; // Mostrar todas las empresas
    }
    
    // Cerrar otros dropdowns abiertos
    Object.keys(this.dropdownOpen).forEach(key => {
      if (key !== columnKey) {
        this.dropdownOpen[key] = false;
      }
    });

    // Toggle del dropdown actual
    this.dropdownOpen[columnKey] = !this.dropdownOpen[columnKey];

    if (this.dropdownOpen[columnKey]) {
      const rect = event.target.getBoundingClientRect();
      this.dropdownPosition = {
        x: rect.left,
        y: rect.bottom + window.scrollY
      };
    }
  },
  getColumnOptions(columnKey) {
    if (this.columnOptions[columnKey]) {
      return this.columnOptions[columnKey];
    }
    return [];
  },
  sortTable(columnKey) {
    if (this.sortBy === columnKey) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = columnKey;
      this.sortOrder = 'desc';
    }
    
    // Ordenar allSolicitudes
    this.allSolicitudes.sort((a, b) => {
      if (columnKey === 'fecha_creacion') {
        return this.sortOrder === 'desc'
          ? new Date(b[columnKey]) - new Date(a[columnKey])
          : new Date(a[columnKey]) - new Date(b[columnKey]);
      }

      const valueA = a[columnKey]?.toString().toLowerCase() ?? '';
      const valueB = b[columnKey]?.toString().toLowerCase() ?? '';
      
      return this.sortOrder === 'desc'
        ? valueB.localeCompare(valueA)
        : valueA.localeCompare(valueB);
    });

    // Aplicar paginación después de ordenar
    this.applyPagination();
  },
  filterEmpresas() {
    if (!this.empresaSearch) {
      // Mostrar todas las empresas disponibles
      this.filteredEmpresas = this.empresas;
    } else {
      // Filtrar empresas por nombre
      const searchLower = this.empresaSearch.toLowerCase();
      this.filteredEmpresas = this.empresas.filter(empresa => 
        empresa.nombre.toLowerCase().includes(searchLower)
      );
    }
  },
  filterSolicitudes() {
    if (!Array.isArray(this.allSolicitudes)) return [];

    let filtered = [...this.allSolicitudes];

    Object.keys(this.filters).forEach(key => {
      if (this.filters[key] && this.filters[key].length > 0) {
        filtered = filtered.filter(solicitud => {
          // Filtros de fecha
          if (key === 'fecha_creacion' || key === 'fecha_asignacion') {
            const fechaSolicitud = new Date(solicitud[key]);
            return this.filters[key].some(filterId => {
              const today = new Date();
              const fechaComparar = new Date(fechaSolicitud);

              switch (filterId) {
                case 'today': {
                  return fechaComparar.toDateString() === today.toDateString();
                }
                case 'week': {
                  const startOfWeek = new Date(today);
                  startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)); // Ajuste para que la semana empiece en lunes
                  startOfWeek.setHours(0, 0, 0, 0); // Inicio del día
                  const endOfWeek = new Date(startOfWeek);
                  endOfWeek.setDate(startOfWeek.getDate() + 6);
                  endOfWeek.setHours(23, 59, 59, 999); // Fin del día
                  return fechaComparar >= startOfWeek && fechaComparar <= endOfWeek;
                }
                case 'month': {
                  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                  startOfMonth.setHours(0, 0, 0, 0); // Inicio del día
                  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                  endOfMonth.setHours(23, 59, 59, 999); // Fin del día
                  return fechaComparar >= startOfMonth && fechaComparar <= endOfMonth;
                }
                case 'year': {
                  const startOfYear = new Date(today.getFullYear(), 0, 1);
                  startOfYear.setHours(0, 0, 0, 0); // Inicio del día
                  const endOfYear = new Date(today.getFullYear(), 11, 31);
                  endOfYear.setHours(23, 59, 59, 999); // Fin del día
                  return fechaComparar >= startOfYear && fechaComparar <= endOfYear;
                }
                case 'past': {
                  const startOfYear = new Date(today.getFullYear(), 0, 1);
                  startOfYear.setHours(0, 0, 0, 0); // Inicio del día
                  return fechaComparar < startOfYear;
                }
                default:
                  return false;
              }
            });
          }
              // Filtro de quien reporta
              else if (key === 'usuario_cliente_nombre') {
                return this.filters[key].includes(solicitud.usuario_cliente);
              }
              // Filtro de responsable
              else if (key === 'usuario_soporte_nombre') {
                return this.filters[key].includes(solicitud.usuario_soporte);
              }
              // Filtros de selección múltiple (estado, prioridad, etc.)
              else if (['estado', 'prioridad', 'modulo', 'submodulo', 'accion'].includes(key)) {
                return this.filters[key].includes(solicitud[key]);
              }
              // Filtro de texto para título
              else if (key === 'titulo' && this.filters[key]) {
                return solicitud[key]?.toLowerCase().includes(this.filters[key].toLowerCase());
              }
              // Otros filtros
              else {
                return this.filters[key].includes(solicitud[key]);
              }
            });
          }
        });

        return filtered;
      },
      async fetchSolicitudes() {
      try {
        console.log('Iniciando fetchSolicitudes()...');
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
          console.error('No se encontró token de acceso');
          return;
        }
        
        // 1. Obtener datos de usuario
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : {};
        console.log('Datos de usuario:', user);
        
        // 2. Cargar relación usuario-tercero
        const usuariosTercerosResponse = await apiClient.get('/usuariosTerceros/');
        
        // Crear mapa de relaciones usuario-tercero
        const usuariosTercerosMap = {};
        usuariosTercerosResponse.data.forEach(ut => {
          if (ut.id) {
            usuariosTercerosMap[ut.id] = {
              tercero: ut.tercero,
              usuario: ut.usuario
            };
          }
        });
        
        // 3. Encontrar relación específica para usuario actual
        let usuarioTerceroRelacionId = null;
        if (user.tipo === 'C') {
          const relacion = usuariosTercerosResponse.data.find(ut => 
            ut.usuario && ut.tercero && 
            ut.usuario.id === user.id
          );
          
          if (relacion) {
            usuarioTerceroRelacionId = relacion.id;
            console.log(`Relación usuario-tercero encontrada: ${usuarioTerceroRelacionId}`);
          } else {
            console.warn('No se encontró relación usuario-tercero para este usuario');
          }
        }
        
        // 4. Cargar solicitudes
        const response = await apiClient.get('/solicitudes/');
        
        // 5. Filtrar solicitudes según tipo de usuario
        let solicitudes = response.data;
        if (user.tipo === 'C' && usuarioTerceroRelacionId) {
          solicitudes = solicitudes.filter(s => s.usuario_cliente == usuarioTerceroRelacionId);
          console.log(`Solicitudes filtradas por relación ID ${usuarioTerceroRelacionId}: ${solicitudes.length}`);
        }
        
        // 6. Procesar cada solicitud (mantener el código original)
        this.allSolicitudes = solicitudes.map(solicitud => {
          const usuarioTercero = usuariosTercerosMap[solicitud.usuario_cliente];
          
          return {
            ...solicitud,
            clie: usuarioTercero ? usuarioTercero.tercero.nombre : 'Sin empresa',
            usuario_cliente_nombre: usuarioTercero ? 
              `${usuarioTercero.usuario.first_name || ''} ${usuarioTercero.usuario.last_name || ''}`.trim() || 
              usuarioTercero.usuario.username : 
              'Usuario no encontrado',
            usuario_soporte_nombre: this.getUserFullName(solicitud.usuario_soporte) || 'Sin asignar',
            submodulo_nombre: this.getSubmoduloName(solicitud.submodulo) || 'Desconocido',
            accion_nombre: this.getAccionName(solicitud.accion) || 'Desconocida',
            showTareas: false
          };
        });
        
        // 7. Ordenar y aplicar paginación (mantener el código original)
        this.allSolicitudes.sort((a, b) => 
          new Date(b.fecha_creacion) - new Date(a.fecha_creacion)
        );
        
        // Después de procesar todas las solicitudes, guardar una copia profunda como originalSolicitudes
        this.originalSolicitudes = JSON.parse(JSON.stringify(this.allSolicitudes));
        
        // Aplicar paginación
        this.applyPagination();

        console.log("originalSolicitudes:", this.originalSolicitudes.length);
        console.log("allSolicitudes:", this.allSolicitudes.length);
      } catch (error) {
        console.error("Error al obtener solicitudes:", error);
      }
    },

    applyPagination() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    console.log(`Aplicando paginación: página ${this.currentPage}, elementos ${startIndex} a ${endIndex}`);
    
    // Asegurarse de que estamos trabajando con un array válido
    if (Array.isArray(this.allSolicitudes)) {
      // Importante: Primero copia profunda para evitar problemas de referencia
      const paginatedData = JSON.parse(JSON.stringify(
        this.allSolicitudes.slice(startIndex, endIndex)
      ));
      
      // Luego asigna a solicitudes
      this.solicitudes = paginatedData;
      
      console.log(`Solicitudes paginadas: ${this.solicitudes.length}`);
      
      // Verificar el DOM después de la actualización
      this.$nextTick(() => {
        const filas = document.querySelectorAll('table tbody tr');
        console.log(`Filas en DOM después de paginación: ${filas.length}`);
      });
    } else {
      console.error('allSolicitudes no es un array:', this.allSolicitudes);
      this.solicitudes = [];
    }
  },

nextPage() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
  }
},
isImage(anexo) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const extension = anexo.archivo.toLowerCase().split('.').pop();
    console.log('Extensión del archivo:', extension);
    console.log('¿Es imagen?:', imageExtensions.includes('.' + extension));
    return imageExtensions.includes('.' + extension);
  },

  isPDF(anexo) {
    const extension = anexo.archivo.toLowerCase().split('.').pop();
    console.log('¿Es PDF?:', extension === 'pdf');
    return extension === 'pdf';
  },

  getAnexoUrl(anexo) {
    // Usar directamente la URL del archivo que viene del servidor
    return anexo.archivo;
  },

  viewAnexo(anexo) {
    console.log('Anexo completo:', anexo);
    anexo.isViewing = !anexo.isViewing;
  },
  async showSolicitudDetails(id) {
    try {
      // Debug del token
      const solicitudResponse = await apiClient.get(`/solicitudes/${id}/`);
      this.detalleSolicitud = solicitudResponse.data;
      const anexosResponse = await apiClient.get(`/anexos/${id}/solicitud-anexos/`);
      this.anexos = anexosResponse.data.map(anexo => ({
      ...anexo,
      isViewing: false
      }));
      this.anexos = anexosResponse.data;
      this.showModalDetails = true;
    } catch (error) {
      this.isSuccess = false;
      this.statusMessage = 'Hubo un problema al cargar los detalles de la solicitud.';
    }
  },
  closeDetailsModal() {
    this.showModalDetails = false;
    this.currentSolicitudId = null;
  },
  closeEditModal() {
    this.showModalEdit = false;
    this.currentSolicitudId = null;
    this.fechaAsignacionManual = null; // Limpiamos la fecha manual
    this.editableSolicitud = {
      usuario_soporte: null,
      fecha_asignacion: "", 
      orden: null,
    };
  },
  getModuloName(id, tipo) {
    try {
      let lista;
      switch (tipo) {
        case 'prioridades':
          lista = this.prioridades;
          break;
        case 'estados':
          lista = this.estados;
          break;
        case 'modulos':
          lista = this.modulos;
          break;
        default:
          return id;
      }
      
      const item = lista.find(item => item.id === id);
      return item ? item.nombre : id;
    } catch (error) {
      return id;
    }
  },
  async downloadAnexo(anexo) {
    try {
      // Debug del token
      const token = localStorage.getItem('accessToken');
      console.log('Token encontrado:', token ? 'Sí' : 'No');
      console.log('Primeros 10 caracteres del token:', token ? token.substring(0, 10) + '...' : 'No hay token');

      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      // Paso 1: Obtener la información del anexo
      const anexoInfoResponse = await apiClient.get(`/anexos/${anexo.id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Respuesta del servidor:', anexoInfoResponse.data);

      // Verificar que tenemos la URL del archivo
      const fileUrl = anexoInfoResponse.data.archivo;
      if (!fileUrl) {
        throw new Error('URL del archivo no encontrada en la respuesta');
      }

      // Paso 2: Descargar el archivo
      const response = await apiClient.get(fileUrl, {
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': '*/*'
        }
      });

      // Crear blob y descargar
      const blob = new Blob([response.data], {
        type: response.headers['content-type'] || 'application/octet-stream'
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', anexo.descripcion || 'archivo_adjunto');
      document.body.appendChild(link);
      link.click();

      // Limpiar
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);

      this.statusMessage = 'Archivo descargado correctamente';
      this.isSuccess = true;

    } catch (error) {
      console.error('Error detallado:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      this.isSuccess = false;
      
      if (error.message === 'No se encontró el token de autenticación') {
        this.statusMessage = 'Sesión expirada. Por favor, actualice la página.';
      } else if (error.response?.status === 404) {
        this.statusMessage = 'El archivo no se encuentra disponible.';
      } else {
        this.statusMessage = 'Error al descargar el archivo. Por favor, intente nuevamente.';
      }
    }
},

  toggleTareas(solicitud) {
    // Verificar tipo de usuario antes de permitir la acción
    if (this.userType === 'C') {
      return
    }

    if (solicitud.showTareas === undefined) {
      solicitud.showTareas = false
    }
    
    solicitud.showTareas = !solicitud.showTareas
    
    if (solicitud.showTareas) {
      this.loadTareas(solicitud)
    }
  },

  // Obtener tareas de una solicitud
  async fetchTareas(solicitud) {
    try {
      const response = await apiClient.get(`/tareas/${solicitud.id}/solicitud-tareas/`);
      solicitud.tareas = response.data;
      solicitud.nuevaTarea = ''; // Reiniciar el campo de nueva tarea
    } catch (error) {
      this.statusMessage = 'Error al cargar las tareas.';
      this.isSuccess = false;
    }
  },

  // Editar solicitud
  async editSolicitud(id) {
    try {
      const response = await apiClient.get(`/solicitudes/${id}/`);
      this.editableSolicitud = { 
        ...response.data,
        orden: response.data.orden || null,
        fecha_finalizacion: response.data.fecha_finalizacion || null,
      };
      this.originalEstado = this.editableSolicitud.estado;
      this.showModalEdit = true;
      
      // Cargar los usuarios de soporte al abrir el modal
      await this.fetchUsuariosSoporte();

    } catch (error) {
      this.statusMessage = error.response?.data?.detail || "Error al cargar solicitud para editar";
      this.isSuccess = false;
    }
  },
  setCurrentDateTime(field) {
    // Obtener la fecha y hora actual
    const now = new Date();
    
    // Ajustar la zona horaria (no añadir 5 horas)
    // Crear una fecha en formato ISO pero manteniendo la hora local
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    // Formato: YYYY-MM-DDTHH:MM:00
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:00`;
    
    console.log('Fecha actual formateada:', formattedDate);
    
    if (field === 'inicio') {
      this.currentTarea.fecha_inicio = formattedDate;
      console.log('Fecha inicio actualizada a:', this.currentTarea.fecha_inicio);
      
      // Recalcular duración si es necesario
      if (this.currentTarea.fecha_fin) {
        this.calcularDuracion();
      }
    } 
    else if (field === 'fin') {
      this.currentTarea.fecha_fin = formattedDate;
      console.log('Fecha fin actualizada a:', this.currentTarea.fecha_fin);
      
      // Recalcular duración si es necesario
      if (this.currentTarea.fecha_inicio) {
        this.calcularDuracion();
      }
    }
  },
  handleEstadoChange() {
  console.log('Estado cambiado de', this.originalEstado, 'a', this.editableSolicitud.estado);
  
  // Actualizar fecha de asignación solo cuando cambia de sin asignar (5) a asignado (6)
  if (this.originalEstado === 5 && this.editableSolicitud.estado === 6) {
    // No asignamos automáticamente la fecha aquí, lo haremos en updateSolicitud
    // para permitir que la fecha manual tenga prioridad
    console.log('Estado cambiado a Asignado - se asignará fecha al guardar');
  }
  
  // Actualizar fecha de finalización cuando el estado es terminado (7) o cancelado (8)
  if (this.editableSolicitud.estado === 7 || this.editableSolicitud.estado === 8) {
    this.editableSolicitud.fecha_finalizacion = this.formatearFechaHoraActual();
    console.log('Fecha de finalización actualizada:', this.editableSolicitud.fecha_finalizacion);
  }

  // Asignar usuario de soporte automáticamente si cambia a asignado y no tiene uno
  if (this.editableSolicitud.estado === 6 && !this.editableSolicitud.usuario_soporte && this.usuariosSoporte.length > 0) {
    this.editableSolicitud.usuario_soporte = this.usuariosSoporte[0].id;
  }
},
  
async updateSolicitud() {
  try {
    // Copia base de la solicitud a actualizar
    const solicitudToUpdate = { ...this.editableSolicitud };
    
    // Guardar el estado y soporte anteriores para comparar después
    const estadoAnterior = this.originalEstado;
    
    // Lógica para fecha de asignación (con soporte para fecha manual)
    if (this.originalEstado === 5 && this.editableSolicitud.estado === 6) {
      if (this.fechaAsignacionManual) {
        // Usar la fecha manual seleccionada por el usuario
        solicitudToUpdate.fecha_asignacion = this.fechaAsignacionManual;
        console.log('Aplicando fecha de asignación manual:', solicitudToUpdate.fecha_asignacion);
      } else {
        // Usar la fecha actual como antes si no hay selección manual
        solicitudToUpdate.fecha_asignacion = this.formatearFechaHoraActual();
        console.log('Aplicando fecha de asignación automática:', solicitudToUpdate.fecha_asignacion);
      }
    }
    
    // Lógica para fecha de finalización (verificación adicional)
    if (this.editableSolicitud.estado === 7 || this.editableSolicitud.estado === 8) {
      // Doble verificación de fecha de finalización
      if (!solicitudToUpdate.fecha_finalizacion) {
        solicitudToUpdate.fecha_finalizacion = this.formatearFechaHoraActual();
        console.log('Aplicando fecha de finalización:', solicitudToUpdate.fecha_finalizacion);
      }
    }

    // Enviar solicitud actualizada
    await apiClient.put(`/solicitudes/${this.editableSolicitud.id}/`, solicitudToUpdate);
    
    // Verificar si el estado cambió a "asignado" (6) y se seleccionó un usuario de soporte
    const estadoAsignado = solicitudToUpdate.estado === 6;
    const nuevoSoporte = solicitudToUpdate.usuario_soporte;
    const cambioASoporteAsignado = 
      (estadoAnterior !== 6 && estadoAsignado) && nuevoSoporte;
    
    // Si cambió a estado asignado y tiene usuario de soporte, crear tarea automáticamente
    if (cambioASoporteAsignado) {
      console.log("Creando tarea automática para solicitud asignada");
      
      // Usar la descripción personalizada o una descripción por defecto
      const descripcionTarea = this.nuevaTareaDescripcion || 
        `Tarea automática para solicitud: ${solicitudToUpdate.titulo}`;
      
      // Crear objeto de tarea
      const nuevaTarea = {
        solicitud: solicitudToUpdate.id,
        descripcion: descripcionTarea,
        estado: 6,
        usuario_asignado: nuevoSoporte,
        tipo: "I", 
        cita: "N",
        fecha_programada: this.nuevaTareaFechaProgramada || null
      };
      
      try {
        // Crear la tarea
        await apiClient.post("/tareas/", nuevaTarea);
        console.log("Tarea creada automáticamente");
      } catch (tareaError) {
        console.error("Error al crear tarea automática:", tareaError);
      }
    }
    
    await this.fetchSolicitudes();
    this.closeModal();
    this.statusMessage = 'Solicitud actualizada correctamente';
    this.isSuccess = true;
  } catch (error) {
    this.isSuccess = false;
    this.statusMessage = error.response?.data?.detail || "Error al actualizar la solicitud";
    console.error('Error al actualizar solicitud:', error);
  }
},

  async createSolicitud() {
  try {
    console.log('Iniciando creación de solicitud...');
    
    // Obtener el usuario directamente de localStorage como JSON
    const currentUser = JSON.parse(localStorage.getItem('user'));
    
    if (!currentUser || !currentUser.id) {
      this.statusMessage = 'No se encontró información del usuario en la sesión. Por favor, inicie sesión nuevamente.';
      this.isSuccess = false;
      console.error('Error: Usuario no encontrado en localStorage', localStorage.getItem('user'));
      return;
    }
    
    // Obtener el terceroId del usuario
    const terceroId = currentUser.terceroId;
    if (!terceroId) {
      console.error('Error: terceroId no está definido en el usuario');
      this.statusMessage = 'Debe seleccionar una empresa válida.';
      this.isSuccess = false;
      return;
    }
    
    // Comprobar el token
    const token = localStorage.getItem('accessToken');
    console.log('Token disponible:', !!token);
    
    // Cargar usuarios-terceros para validar la relación
    const usuariosTercerosResponse = await apiClient.get('/usuariosTerceros/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Datos de usuariosTerceros:', usuariosTercerosResponse.data);

    // Buscar el ID de la relación usuario-tercero
    const usuarioTercero = usuariosTercerosResponse.data.find(ut => 
      ut.usuario.id === currentUser.id && ut.tercero.id === terceroId
    );

    if (!usuarioTercero) {
      this.statusMessage = 'No se encontró una relación válida entre el usuario y la empresa seleccionada.';
      this.isSuccess = false;
      console.error('Error: Relación usuario-tercero no encontrada');
      return;
    }

    // Formatear la fecha manualmente si existe
    let fechaCreacion;
    if (this.newSolicitud.fecha_creacion_manual) {
      // Usar la fecha manual proporcionada
      fechaCreacion = this.newSolicitud.fecha_creacion_manual;
    } else {
      // Usar la fecha actual con +5 horas
      fechaCreacion = this.formatearFechaHoraActual();
    }
    
    console.log('Fecha de creación a usar:', fechaCreacion);

    const solicitudData = {
      titulo: this.newSolicitud.titulo,
      descripcion: this.newSolicitud.descripcion,
      modulo: this.newSolicitud.modulo,
      submodulo: this.newSolicitud.submodulo || null,
      accion: this.newSolicitud.accion,
      prioridad: 1,
      estado: 5,
      usuario_cliente: usuarioTercero.id,
      version_error: this.newSolicitud.version ? parseInt(this.newSolicitud.version) : null,
      fecha_creacion: fechaCreacion // Campo para la fecha de creación
    };
    
    // Depurar datos antes de enviar
    console.log('Datos de solicitud a enviar:', JSON.stringify(solicitudData));
    
    // Crear la solicitud
    const solicitudResponse = await apiClient.post('/solicitudes/', solicitudData);
    console.log('Solicitud creada:', solicitudResponse.data);
    
    // Manejar anexos si existen
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('archivo', this.selectedFile);
      formData.append('solicitud', solicitudResponse.data.id);
      formData.append('descripcion', this.newSolicitud.descripcion_anexo || '');
      
      try {
        await apiClient.post('/anexos/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } catch (anexoError) {
        console.error('Error al subir anexo:', anexoError);
      }
    }
    
    this.statusMessage = 'Solicitud creada exitosamente';
    this.isSuccess = true;
    this.closeModal();
    await this.fetchSolicitudes(); // Recargar solicitudes para mostrar la nueva
    
  } catch (error) {
    console.error('Error completo:', error);
    
    if (error.response) {
      console.error('Respuesta del servidor:', error.response.data);
      
      // Mostrar errores de validación de manera más clara
      if (error.response.data) {
        let errorMsg = '';
        
        // Formatear errores de validación del objeto
        Object.keys(error.response.data).forEach(key => {
          const value = error.response.data[key];
          errorMsg += `${key}: ${Array.isArray(value) ? value.join(', ') : value}\n`;
        });
        
        this.statusMessage = 'Error: ' + (errorMsg || JSON.stringify(error.response.data));
        this.isSuccess = false;
      } else {
        this.statusMessage = 'Error desconocido al crear la solicitud';
        this.isSuccess = false;
      }
    } else {
      this.statusMessage = 'Error al crear la solicitud. Por favor, intente nuevamente.';
      this.isSuccess = false;
    }
  }
},
calcularDuracion() {
    if (!this.currentTarea.fecha_inicio || !this.currentTarea.fecha_fin) return;
    
    try {
      console.log('Calculando duración entre:', this.currentTarea.fecha_inicio, 'y', this.currentTarea.fecha_fin);
      
      // Crear objetos Date a partir de los strings
      const inicio = new Date(this.currentTarea.fecha_inicio);
      const fin = new Date(this.currentTarea.fecha_fin);
      
      // Verificar que las fechas sean válidas
      if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
        console.error('Fechas inválidas para calcular duración');
        return;
      }
      
      // Calcular la diferencia en milisegundos
      const diff = fin - inicio;
      
      // Si la diferencia es negativa, la fecha fin es anterior a la fecha inicio
      if (diff < 0) {
        console.error('La fecha fin es anterior a la fecha inicio');
        return;
      }
      
      // Convertir a horas y minutos
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      // Formatear como HH:MM
      this.currentTarea.duracion = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      console.log('Duración calculada:', this.currentTarea.duracion);
      
      // Por defecto, el tiempo facturable es igual a la duración
      this.currentTarea.tiempoFacturable = this.currentTarea.duracion;
    } catch (error) {
      console.error('Error al calcular duración:', error);
    }
  },
  handleFileUpload(event) {
    this.selectedFile = event.target.files[0];
  }, 
  closeModal() {
    this.showModalDetails = false;
    this.showModalEdit = false;
    this.showModalCreate = false;
    this.showImageModal = false; // Agregamos el modal de imagen
    this.currentImageUrl = null;  // Limpiamos la URL de la imagen
    this.detalleSolicitud = null;
    this.editableSolicitud = {
      usuario_soporte: null,
    };
    this.newSolicitud = {
      titulo: '',
      descripcion: '',
      modulo: null,
      submodulo: null,
      accion: null,
      estado: 5,
      prioridad: 1
    };
    this.selectedFile = null;
    this.closeModalTareas = null;
    this.showModalTarea = false;
    this.modalType = '';
    this.currentTarea = {
      id: null,
      descripcion: '',
      fecha_programada: null,
      fecha_inicio: null,
      fecha_fin: null,
      duracion: '00:00',
      tiempoFacturable: '00:00',
      motivo_cancelacion: '',
      solicitud: null,
      usuario_asignado: null,
      usuario_reasignado: null,
      estado: 1
    };
    // Manejar el scroll directamente aquí
    if (typeof window !== 'undefined' && window.document) {
      window.document.body.style.overflow = 'auto';
    }
    this.nuevaTareaDescripcion = '';
    this.nuevaTareaFechaProgramada = '';
  },

  async deleteSolicitud(id) {
    if (confirm('¿Está seguro de que desea eliminar esta solicitud?')) {
      try {
        await apiClient.delete(`/solicitudes/${id}/`);
        this.fetchSolicitudes();
        this.statusMessage = 'Solicitud eliminada correctamente';
        this.isSuccess = true;
      } catch (error) {
        this.isSuccess = false;
        this.statusMessage = error.response?.data?.detail || 'Error al eliminar solicitud';
      }
    }
  },
  formatearTexto(event, objetoName, campo) {
    const texto = event.target.value;
    // Solo aplicar si hay texto
    if (texto && texto.length > 0) {
      // Convertir primera letra a mayúscula y el resto a minúscula
      const textoFormateado = texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
      
      // Actualizar el valor en el objeto correspondiente
      this[objetoName][campo] = textoFormateado;
    }
  },
  initializeColumnWidths() {
    this.columns.forEach((column) => {
      if (!this.columnWidths[column.key]) {
        this.columnWidths[column.key] = 50; // Establece valores iniciales si no existen
      }
    });
  },

  startResize(event, columnKey) {
    const startX = event.clientX;
    const startWidth = this.columnWidths[columnKey];

    const doDrag = (e) => {
      const newWidth = startWidth + (e.clientX - startX);
      if (newWidth > 10) {
        this.columnWidths[columnKey] = newWidth;
      }
    };

    const stopDrag = () => {
      document.removeEventListener('mousemove', doDrag);
      document.removeEventListener('mouseup', stopDrag);
    };

    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);
  },
  async fetchUsuariosSoporte() {
    try {
      const response = await apiClient.get("/usuarios/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      // Filtrar solo los usuarios tipo "S"
      const usuariosSoporteFiltrados = response.data.filter(user => user.tipo === "S");

      // Actualizar usuariosSoporteMap con nombre completo
      this.usuariosSoporteMap = {};
      usuariosSoporteFiltrados.forEach(user => {
        const nombreCompleto = `${user.first_name || ''} ${user.last_name || ''}`.trim();
        this.usuariosSoporteMap[user.id] = nombreCompleto || user.username;
      });

      // Guardar la lista completa
      this.usuariosSoporteList = usuariosSoporteFiltrados;


    } catch (error) {
      this.statusMessage("❌ Error al obtener usuarios de soporte:", error);
    }
  },
  async refreshTable() {
      try {
        this.statusMessage = "Actualizando datos...";
        this.isSuccess = true;
        await this.fetchSolicitudes();
        this.statusMessage = "Datos actualizados correctamente";
      } catch (error) {
        this.statusMessage = "Error al actualizar los datos";
        this.isSuccess = false;
        console.error("Error al refrescar tabla:", error);
      }
    },
  initializeColumnOptions() {
    try {
      // Obtener valores únicos para quien reporta
      const reportadoresUnicos = this.allSolicitudes
        .filter(s => s.usuario_cliente && s.usuario_cliente_nombre)
        .map(s => ({
          id: s.usuario_cliente,
          nombre: s.usuario_cliente_nombre
        }))
        .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i); // Eliminar duplicados

      this.columnOptions = {
        // Mantener las opciones existentes
        fecha_creacion: [
          { id: 'today', nombre: 'Hoy' },
          { id: 'week', nombre: 'Esta semana' },
          { id: 'month', nombre: 'Este mes' },
          { id: 'year', nombre: 'Este año' },
          { id: 'past', nombre: 'Años anteriores' }
        ],
        estado: this.estados,
        prioridad: this.prioridades,
        modulo: this.modulos,
        submodulo: this.submodulos,
        accion: this.acciones,
        // Agregar las opciones de quien reporta
        usuario_cliente: reportadoresUnicos
      };

    } catch (error) {
      console.error('Error al inicializar opciones:', error);
    }
  },
  handleNewSolicitud() {
    this.showModalCreate = true
    this.newSolicitud = {
      titulo: '',
      descripcion: '',
      modulo: null,
      submodulo: null,
      accion: null,
      estado: 1, // Corrección: estado debe ser 1 (numérico)
      prioridad: 1 // Corrección: prioridad debe ser 1 (numérico)
    }
  },
  getPrioridadClase(prioridad) {
    const nombre = this.getModuloName(prioridad, 'prioridades')
    switch (nombre) {
      case 'Alto':
        return 'bg-red-100 text-red-800'
      case 'Medio':
        return 'bg-yellow-100 text-yellow-800'
      case 'Bajo':
        return 'bg-green-100 text-green-800'
      case 'Bloq':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  },
  // Método para cargar todos los usuarios
  async fetchUsuarios() {
    try {
      const response = await apiClient.get('/usuarios/');
      // Crear un mapa de ID -> nombre completo
      this.usuariosMap = response.data.reduce((acc, user) => {
        acc[user.id] = `${user.first_name} ${user.last_name}`.trim() || user.username;
        return acc;
      }, {});
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  },
    
  // Método para obtener el nombre del usuario
  getUserFullName(userId) {
    return this.usuariosMap[userId] || 'No asignado';
  },

  // Método para obtener el nombre del submodulo
  getSubmoduloName(submoduloId) {
    const submodulo = this.submodulos.find(s => s.id === submoduloId);
    return submodulo ? submodulo.nombre : 'No asignado';
  },

  // Método para obtener el nombre de la acción
  getAccionName(accionId) {
    const accion = this.acciones.find(a => a.id === accionId);
    return accion ? accion.nombre : 'No asignado';
  },

  // Asegúrate de que este método se llame cuando cambien los datos
  updateColumnOptions() {
    this.filteredColumns.forEach(column => {
      this.columnOptions[column.key] = this.getColumnOptions(column.key);
    });
  },
  handleModuloChange() {
    // Resetear el submódulo cuando cambia el módulo
    this.newSolicitud.submodulo = '';
  },
  validateForm() {
    this.showError = true;
    return this.newSolicitud.modulo && 
           this.newSolicitud.submodulo && 
           this.newSolicitud.titulo && 
           this.newSolicitud.descripcion;
  },
  // Método auxiliar para obtener la fecha actual en Colombia
  getCurrentDate() {
    return new Date();
  },
  getColumnStyle(columnKey) {
    // Para el resto de columnas, mantener el control estricto del ancho
    return {
      width: `${this.columnWidths[columnKey]}px`,
      minWidth: `${this.columnWidths[columnKey]}px`
    };
  },
  memoizedGetModuloName: memoize(function(id, tipo) {
    try {
      let lista;
      switch (tipo) {
        case 'prioridades':
          lista = this.prioridades;
          break;
        case 'estados':
          lista = this.estados;
          break;
        case 'modulos':
          lista = this.modulos;
          break;
        default:
          return id;
      }
      
      const item = lista.find(item => item.id === id);
      return item ? item.nombre : id;
    } catch (error) {
      return id;
    }
  }, function(id, tipo) {
    return `${id}-${tipo}`;
  }),

  memoizedFormatDate: memoize(function(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleString('es-CO', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}),
  // Función con debounce para la búsqueda
  handleSearchInput() {
    // Aplicar debounce si es necesario
    clearTimeout(this.debouncedSearchTimeout);
    this.debouncedSearchTimeout = setTimeout(() => {
      this.applyAllFilters();
    }, 300);
  },
  // Función para limpiar la búsqueda
  clearSearch() {
    this.searchQuery = '';
    this.applyAllFilters();
  },
  
  // Método para cancelar la edición
  cancelEditTarea() {
    this.resetNuevaTarea();
  },

  // Método para cargar los estados de tareas
  async loadEstadosTareas() {
    try {
      const response = await apiClient.get('/estados-tareas/');
      this.estadosTareas = {};
      response.data.forEach(estado => {
        this.estadosTareas[estado.id] = estado.nombre;
      });
    } catch (error) {
      console.error('Error al cargar los estados de tareas:', error);
    }
  },
  
  // Modificar el método loadTareas para incluir la carga de estados
  async loadTareas(solicitud) {
  if (!solicitud.tareas) {
    try {
      // Intentar obtener todas las tareas y filtrar manualmente
      const response = await apiClient.get('/tareas/');
      
      // Filtrar las tareas por el ID de la solicitud en el cliente
      const tareasFiltradasManualmente = response.data.filter(
        tarea => tarea.solicitud === solicitud.id
      );
      
      // Asignar las tareas filtradas
      solicitud.tareas = tareasFiltradasManualmente;
      
      // Log para depuración
      console.log(`Cargadas ${solicitud.tareas.length} tareas para la solicitud #${solicitud.id}`);
      
    } catch (error) {
      console.error('Error al cargar tareas:', error);
      this.mostrarMensaje('Error al cargar las tareas', false);
    }
  }
},

  formatDateForInput(dateString) {
    if (!dateString) return null;
    try {
      // Crear un objeto Date a partir del string
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null; // Fecha inválida
      
      // Formatear como YYYY-MM-DDTHH:MM:00 usando la hora local
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day}T${hours}:${minutes}:00`;
    } catch (error) {
      console.error('Error al formatear fecha para input:', error);
      return null;
    }
  },

  getUsuarioNombre(usuarioId) {
    return this.usuariosMap[usuarioId] || 'Sin asignar';
  },
  mostrarMensaje(mensaje, esExito) {
    // Si ya tienes un método de mostrar mensajes, puedes reutilizarlo
    if (this.statusMessage) {
      this.statusMessage = mensaje;
      this.isSuccess = esExito;
    } else {
      // Fallback básico
      alert(mensaje);
    }
  },
  
  // Método para formatear fechas
  formatFecha(fechaString) {
    if (!fechaString) return '-';
    
    try {
      const fecha = new Date(fechaString);
      return fecha.toLocaleString('es-CO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return fechaString;
    }
  },
  
  // Método para obtener el nombre del estado
  getEstadoNombre(estadoId) {
    if (!estadoId) return 'Sin estado';
    
    // Usar el estadosTarea que ya tienes definido
    const estado = this.estadosTarea.find(e => e.id === estadoId);
    return estado ? estado.nombre : `Estado ${estadoId}`;
  },
  
  // Método para obtener la clase CSS según el estado
  getEstadoClase(estadoId) {
    if (!estadoId) return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
    
    const clases = {
      1: 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs', // Sin Asignar
      2: 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs',     // Asignado
      3: 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs',   // Terminado
      4: 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs'        // Cancelada
    };
    
    return clases[estadoId] || 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
  },
  

 // Editar Tarea
 async EditarTarea(tareaId) {
    try {
      const response = await apiClient.get(`/tareas/${tareaId}/`);
      this.currentTarea = response.data;
      this.tareaOriginal = { ...response.data }; // Guardar copia original
      this.modalType = 'edit';
      this.showModalTarea = true;
    } catch (error) {
      this.mostrarMensaje('Error al cargar la tarea', false);
    }
  },

  // Ver Detalles
  async DetalleTareas(tareaId) {
    try {
      const response = await apiClient.get(`/tareas/${tareaId}/`);
      this.currentTarea = response.data;
      this.modalType = 'detail';
      this.showModalTarea = true;
    } catch (error) {
      this.mostrarMensaje('Error al cargar los detalles de la tarea', false);
    }
  },

  // Eliminar Tarea
  async EliminarTarea(tareaId) {
    if (confirm('¿Está seguro de eliminar esta tarea?')) {
      try {
        // Guardar el ID de la solicitud antes de eliminar la tarea
        const solicitudId = this.currentTarea.solicitud;
        console.log('Eliminando tarea:', tareaId, 'de solicitud:', solicitudId);
        
        // Eliminar la tarea
        await apiClient.delete(`/tareas/${tareaId}/`);
        
        // Cerrar el modal si está abierto
        this.showModalTarea = false;
        
        // Recargar las tareas de la solicitud
        if (solicitudId) {
          try {
            // Obtener todas las tareas y filtrar manualmente
            const response = await apiClient.get('/tareas/');
            
            // Filtrar las tareas por el ID de la solicitud
            const tareasFiltradas = response.data.filter(
              tarea => tarea.solicitud === solicitudId
            );
            
            console.log(`Recargadas ${tareasFiltradas.length} tareas para la solicitud #${solicitudId}`);
            
            // Actualizar las tareas en todas las instancias de la solicitud
            this.solicitudes.forEach(solicitud => {
              if (solicitud.id === solicitudId) {
                solicitud.tareas = tareasFiltradas;
              }
            });
            
            // Si estamos viendo la solicitud actual, también actualizamos sus tareas
            if (this.currentSolicitud && this.currentSolicitud.id === solicitudId) {
              this.currentSolicitud.tareas = tareasFiltradas;
            }
            
            // Forzar actualización de la vista
            this.$forceUpdate();
            
          } catch (loadError) {
            console.error('Error al recargar tareas:', loadError);
          }
        }
        
        // Mostrar mensaje de éxito usando el toast
        this.statusMessage = 'Tarea eliminada exitosamente';
        this.isSuccess = true;
        this.showToast = true;
        
        // Ocultar el toast después de 3 segundos
        setTimeout(() => {
          this.showToast = false;
        }, 3000);
        
      } catch (error) {
        console.error('Error al eliminar tarea:', error);
        
        // Mostrar mensaje de error usando el toast
        this.statusMessage = 'Error al eliminar la tarea';
        this.isSuccess = false;
        this.showToast = true;
        
        // Ocultar el toast después de 3 segundos
        setTimeout(() => {
          this.showToast = false;
        }, 3000);
      }
    }
  },
// Método para formatear fechas para el servidor
  formatDateForServer(dateString) {
    if (!dateString) return null;
    try {
      // Crear objeto Date a partir del string
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null; // Fecha inválida
      
      // Ajustar a hora Colombia (UTC-5)
      const colombiaTime = new Date(date.getTime() - (date.getTimezoneOffset() + 300) * 60000);
      
      // Formatear como ISO string
      return colombiaTime.toISOString();
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return null;
    }
  },
  // Guardar Tarea (crear/editar)
  async saveTarea() {
  try {
    // Validar campos requeridos
    if (!this.currentTarea.descripcion?.trim()) {
      this.statusMessage = 'La descripción es obligatoria';
      this.isSuccess = false;
      return;
    }

    if (!this.currentTarea.usuario_asignado) {
      this.statusMessage = 'Debe seleccionar un usuario asignado';
      this.isSuccess = false;
      return;
    }

    if (!this.currentTarea.tipo) {
      this.statusMessage = 'Debe seleccionar un tipo';
      this.isSuccess = false;
      return;
    }

    if (this.currentTarea.estado === 4 && !this.currentTarea.motivo_cancelacion) {
      this.statusMessage = 'El motivo de cancelación es obligatorio para tareas canceladas';
      this.isSuccess = false;
      return;
    }

    // Verificar si es una tarea nueva o existente
    const isNew = this.modalType === 'new';
    const endpoint = isNew ? '/tareas/' : `/tareas/${this.currentTarea.id}/`;
    const method = isNew ? 'post' : 'put';

    // Verificar si hay reasignación
    const hayReasignacion = !isNew && this.currentTarea.usuario_reasignado;

    // Preparar los datos asegurándose de que todos los campos tengan el formato correcto
    const tareaToSave = {
      descripcion: this.currentTarea.descripcion.trim(),
      solicitud: Number(this.currentTarea.solicitud),
      usuario_asignado: Number(this.currentTarea.usuario_asignado),
      estado: Number(this.currentTarea.estado),
      tipo: this.currentTarea.tipo,
      cita: this.currentTarea.cita || 'N',
      duracion: this.currentTarea.duracion || "00:00",
      tiempoFacturable: this.currentTarea.tiempoFacturable || "00:00"
    };

    // Formatear fechas si existen
    if (this.currentTarea.fecha_inicio) {
      // Si es un objeto Date, convertirlo a ISO string
      if (typeof this.currentTarea.fecha_inicio === 'object') {
        tareaToSave.fecha_inicio = this.currentTarea.fecha_inicio.toISOString();
      } else {
        // Asegurarse de que sea un formato ISO válido
        const fechaInicio = new Date(this.currentTarea.fecha_inicio);
        if (!isNaN(fechaInicio.getTime())) {
          tareaToSave.fecha_inicio = fechaInicio.toISOString();
        }
      }
    }

    if (this.currentTarea.fecha_programada) {
      if (typeof this.currentTarea.fecha_programada === 'object') {
        tareaToSave.fecha_programada = this.currentTarea.fecha_programada.toISOString();
      } else {
        const fechaProgramada = new Date(this.currentTarea.fecha_programada);
        if (!isNaN(fechaProgramada.getTime())) {
          tareaToSave.fecha_programada = fechaProgramada.toISOString();
        }
      }
    }

    if (this.currentTarea.fecha_fin) {
      if (typeof this.currentTarea.fecha_fin === 'object') {
        tareaToSave.fecha_fin = this.currentTarea.fecha_fin.toISOString();
      } else {
        const fechaFin = new Date(this.currentTarea.fecha_fin);
        if (!isNaN(fechaFin.getTime())) {
          tareaToSave.fecha_fin = fechaFin.toISOString();
        }
      }
      
      // Validar que fecha_fin sea posterior a fecha_inicio
      if (tareaToSave.fecha_inicio && new Date(tareaToSave.fecha_fin) < new Date(tareaToSave.fecha_inicio)) {
        this.statusMessage = 'La fecha de fin debe ser posterior a la fecha de inicio.';
        this.isSuccess = false;
        return;
      }
    }

    // Si es una tarea editada y tiene usuario reasignado, incluirlo
    if (hayReasignacion) {
      tareaToSave.usuario_reasignado = Number(this.currentTarea.usuario_reasignado);
    }

    // Si es una tarea cancelada, incluir el motivo
    if (this.currentTarea.estado === 4) {
      tareaToSave.motivo_cancelacion = this.currentTarea.motivo_cancelacion.trim();
    }

    // Log para debugging
    console.log('Datos a enviar:', {
      endpoint,
      method,
      data: tareaToSave
    });

    const response = await apiClient[method](endpoint, tareaToSave);
    console.log('Respuesta del servidor:', response.data);
    
    // Si hay reasignación, crear una nueva tarea para el usuario reasignado
    if (hayReasignacion) {
      try {
        // Obtener nombres para la descripción
        const usuarioOriginalNombre = this.usuariosSoporteMap[tareaToSave.usuario_asignado] || "Usuario anterior";
        const nuevoUsuarioNombre = this.usuariosSoporteMap[tareaToSave.usuario_reasignado] || "Nuevo usuario";
        
        // Crear nueva tarea para el usuario reasignado
        const nuevaTarea = {
          solicitud: tareaToSave.solicitud,
          descripcion: `Tarea reasignada de ${usuarioOriginalNombre} a ${nuevoUsuarioNombre}: ${tareaToSave.descripcion}`,
          estado: 6, // Estado asignado
          usuario_asignado: tareaToSave.usuario_reasignado,
          tipo: "I",
          cita: "N",
          fecha_inicio: this.formatearFechaHoraActual()
        };
        
        await apiClient.post("/tareas/", nuevaTarea);
        console.log("Tarea creada automáticamente por reasignación");
      } catch (tareaError) {
        console.error("Error al crear tarea por reasignación:", tareaError);
      }
    }
    
    this.showModalTarea = false;
    this.statusMessage = `Tarea ${isNew ? 'creada' : 'actualizada'} exitosamente`;
    this.isSuccess = true;

    // Recargar las tareas
    const solicitudId = this.currentTarea.solicitud;
    const tareasResponse = await apiClient.get('/tareas/');
    const tareasActualizadas = tareasResponse.data.filter(
      tarea => tarea.solicitud === solicitudId
    );
    
    // Actualizar las tareas en la solicitud actual
    const solicitudActual = this.solicitudes.find(s => s.id === solicitudId);
    if (solicitudActual) {
      solicitudActual.tareas = tareasActualizadas;
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    }

  } catch (error) {
    console.error('Error completo:', error);
    console.error('Error de la API:', {
      status: error.response?.status,
      data: error.response?.data,
      mensaje: error.message
    });

    // Mostrar mensaje de error más detallado
    if (error.response?.data) {
      const errorMessages = [];
      if (typeof error.response.data === 'object') {
        Object.entries(error.response.data).forEach(([campo, mensaje]) => {
          errorMessages.push(`${campo}: ${mensaje}`);
        });
        this.statusMessage = errorMessages.join('\n');
      } else {
        this.statusMessage = error.response.data.toString();
      }
    } else {
      this.statusMessage = 'Error al guardar la tarea';
    }
    this.isSuccess = false;
  }
},

// Nueva Tarea
NuevaTarea(solicitud) {
  // Obtener la fecha y hora actual en Colombia (UTC-5)
  const now = new Date();
  
  // Ajustar a hora Colombia (UTC-5)
  const colombiaTime = new Date(now.getTime() - (now.getTimezoneOffset() + 300) * 60000);
  
  const year = colombiaTime.getFullYear();
  const month = String(colombiaTime.getMonth() + 1).padStart(2, '0');
  const day = String(colombiaTime.getDate()).padStart(2, '0');
  const hours = String(colombiaTime.getHours()).padStart(2, '0');
  const minutes = String(colombiaTime.getMinutes()).padStart(2, '0');
  
  // Formato: YYYY-MM-DDTHH:MM:00
  const fechaActual = `${year}-${month}-${day}T${hours}:${minutes}:00`;
  
  this.modalType = 'new';
  this.currentTarea = {
    descripcion: '',
    fecha_programada: null,
    fecha_inicio: fechaActual,
    fecha_fin: null,
    duracion: '00:00',
    tiempoFacturable: '00:00',
    solicitud: solicitud.id,
    usuario_asignado: null,
    estado: 5,
    motivo_cancelacion: '',
    tipo: '', 
    cita: '', 
  };
  this.showModalTarea = true;
},
  resetNewSolicitud() {
  this.newSolicitud = {
    titulo: '',
    descripcion: '',
    modulo: null,
    submodulo: null,
    accion: null,
    estado: 5, 
    prioridad: 1 
  };
  this.errorMessage = ''; // Limpiar mensajes de error
},

// Método para formatear y validar tiempo en formato HH:MM
formatearTiempo(valor, campo) {
  // Eliminar cualquier carácter que no sea número
  let valorLimpio = valor.replace(/\D/g, '');

  // Limitar a 4 dígitos (2 para horas y 2 para minutos)
  valorLimpio = valorLimpio.slice(0, 4);

  // Si está vacío, establecer 00:00
  if (!valorLimpio) {
    this.currentTarea[campo] = '00:00';
    return;
  }

  // Separar en horas y minutos
  let horas = valorLimpio.slice(0, 2);
  let minutos = valorLimpio.slice(2, 4);

  // Validar valores

  let minutosNum = parseInt(minutos);

  if (minutosNum > 59) {
    minutosNum = 59;
    minutos = '59';
  }

  // Formatear el resultado
  this.currentTarea[campo] = `${horas.padStart(2, '0')}:${minutos.padStart(2, '0')}`;
},
 

  
},
watch: {
  filters: {
    handler() {
      this.filteredSolicitudes = this.filterSolicitudes();
    },
    deep: true
  },
  searchQuery: {
    handler() {
      try {
        this.filteredSolicitudes = this.filterSolicitudes();
      } catch (error) {
        console.error('Error en la búsqueda:', error);
      }
    },
    immediate: true,
    deep: true
  },
  solicitudes: {
    handler() {
      this.updateColumnOptions();
      this.filteredSolicitudes = this.filterSolicitudes();
    },
    deep: true
  },
  statusMessage(newMessage) {
    if (newMessage) {
      this.showToast = true
      
      // Limpiar timeout anterior si existe
      if (this.toastTimeout) {
        clearTimeout(this.toastTimeout)
      }
      
      // Establecer nuevo timeout
      this.toastTimeout = setTimeout(() => {
        this.showToast = false
        this.statusMessage = ''
      }, 3000) // Duración de 3 segundos
    }
  },
  // Observar cambios en solicitudes para actualizar opciones
  currentPage() {
    this.applyPagination(); // Actualizar las solicitudes paginadas cuando cambia la página
  },
  pageSize() {
    this.currentPage = 1; // Reset a la primera página cuando cambia el tamaño
  },
  allSolicitudes: {
    handler() {
      this.applyPagination();
    },
    deep: true
  },
  // Actualizar las opciones cuando cambien las listas base
  prioridades: {
    handler() {
      this.initializeColumnOptions();
    },
    immediate: true
  },
  estados: {
    handler() {
      this.initializeColumnOptions();
    },
    immediate: true
  },
  modulos: {
    handler() {
      this.initializeColumnOptions();
    },
    immediate: true
  },
  submodulos: {
    handler() {
      this.initializeColumnOptions();
    },
    immediate: true
  },
  acciones: {
    handler() {
      this.initializeColumnOptions();
    },
    immediate: true
  },
  showImageModal(newValue) {
    if (typeof window !== 'undefined' && window.document) {
      window.document.body.style.overflow = newValue ? 'hidden' : 'auto';
    }
  }
},


};
</script>

<style scoped>
.cursor-col-resize {
cursor: col-resize;
}
.cursor-pointer {
cursor: pointer;
}

.cursor-pointer:hover {
background-color: #f3f4f6; /* Cambia el color de fondo al pasar el mouse */
border-radius: 4px;
}

/* Asegurar que los estilos de Tailwind se apliquen correctamente */
.bg-red-100 { background-color: rgb(254, 226, 226); }
.text-red-800 { color: rgb(153, 27, 27); }

.bg-yellow-100 { background-color: rgb(254, 249, 195); }
.text-yellow-800 { color: rgb(133, 77, 14); }

.bg-green-100 { background-color: rgb(220, 252, 231); }
.text-green-800 { color: rgb(22, 101, 52); }

.bg-purple-100 { background-color: rgb(243, 232, 255); }
.text-purple-800 { color: rgb(107, 33, 168); }

.bg-gray-100 { background-color: rgb(243, 244, 246); }
.text-gray-800 { color: rgb(31, 41, 55); }

/* Asegurar que el toast esté por encima de todo */
.toast-container {
position: fixed;
top: 0;
right: 0;
z-index: 9999;
pointer-events: none;
}

.toast-container > * {
pointer-events: auto;
}

/* Estilos para el selector de registros por página */
select {
appearance: none;
background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
background-position: right 0.5rem center;
background-repeat: no-repeat;
background-size: 1.5em 1.5em;
padding-right: 2.5rem;
}

/* Estilos para botones deshabilitados */
button:disabled {
cursor: not-allowed;
}

.btn-tareas {
width: 30px;
min-width: 30px;
padding: 2px 5px;
}

/* Si estás usando un ícono de flecha, puedes ajustar su tamaño también */
.btn-tareas i, 
.btn-tareas svg {
width: 16px;
height: 16px;
}
.bg-white {
background-color: white;
}

.bg-gray-100 {
background-color: #f3f4f6; /* Gris claro */
}

/* Contenedor para los tooltips */
.tooltip-container {
position: relative;
display: inline-block;
max-width: 150px;
width: 100%;
}

/* Texto truncado dentro del contenedor */
.tooltip-container .truncate {
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
max-width: 100%;
}

/* Estilo del tooltip */
.tooltip-text {
visibility: hidden;
position: absolute;
background-color: rgba(0, 0, 0, 0.85);
color: white;
text-align: left;
padding: 5px 8px;
border-radius: 4px;
font-size: 0.75rem;
z-index: 100;

/* Posicionamiento */
bottom: 125%;
left: 0;
margin-left: 0;

/* Transición suave */
opacity: 0;
transition: opacity 0.3s;

/* Formato del texto */
white-space: normal;
word-break: break-word;
max-width: 250px;
line-height: 1.3;
}

/* Flecha del tooltip */
.tooltip-text::after {
content: "";
position: absolute;
top: 100%;
left: 15px;
border-width: 5px;
border-style: solid;
border-color: rgba(0, 0, 0, 0.85) transparent transparent transparent;
}

/* Mostrar tooltip al pasar el mouse */
.tooltip-container:hover .tooltip-text {
visibility: visible;
opacity: 1;
}

.toggle-body-scroll {
  overflow: hidden;
}

.tooltip-container {
  position: relative;
  display: inline-block;
}

.tooltip-container:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}

.tooltip-text {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  text-align: center;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  transition: opacity 0.3s;
}

.tooltip-text::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
}

.tooltip-container {
  position: relative;
  display: inline-block;
  width: 100%;
}

.empresa-text {
  /* Pantalla grande: texto completo */
  max-width: 300px;
}

/* Pantalla mediana */
@media (max-width: 1280px) {
  .empresa-text {
    max-width: 200px;
  }
}

/* Pantalla pequeña */
@media (max-width: 1024px) {
  .empresa-text {
    max-width: 150px;
  }
}

/* Pantalla muy pequeña */
@media (max-width: 768px) {
  .empresa-text {
    max-width: 100px;
  }
}

/* ... resto de los estilos del tooltip ... */
</style>
