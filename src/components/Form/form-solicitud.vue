<template>
    <div class="w-full bg-gray-100">
      <div class="w-full bg-white shadow-md ml-2 mr-2 sm:ml-4 sm:mr-4 mt-2 sm:mt-4">


      <!-- Título -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 pt-4 sm:pt-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-gray-900">
          Solicitudes ¡Bienvenido, <span class="text-indigo-600">{{ nombreCompleto }}</span>!
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
                placeholder="Buscar solicitudes..."
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
                  <div v-if="!['id', 'titulo', 'version_error'].includes(column.key)" class="dropdown-container">
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
                    class="origin-top-right fixed rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    :style="{
                      zIndex: 1000,
                      top: `${dropdownPosition.y}px`,
                      left: `${dropdownPosition.x}px`,
                      maxHeight: '80vh',
                      overflowY: 'auto',
                      minWidth: '200px'
                    }"
                  >
                    <div class="py-1">
                      <template v-for="option in columnOptions[column.key]" :key="option.id">
                        <div class="flex items-center px-4 py-2">
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
                          solicitud.prioridad === 1 ? 'bg-red-100 text-red-800' :
                          solicitud.prioridad === 2 ? 'bg-yellow-100 text-yellow-800' :
                          solicitud.prioridad === 3 ? 'bg-green-100 text-green-800' :
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
                      <span class="block truncate">{{ solicitud.submodulo_nombre }}</span>
                      <span class="tooltip-text">{{ solicitud.submodulo_nombre }}</span>
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
                        v-if="userType !== 'C' || (userType === 'C' && solicitud.estado === 'S')"
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
                        v-if="userType !== 'C' && 'S'"
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
                  <template v-else>
                    <div class="tooltip-container">
                      <span class="block truncate">{{ getModuloName(solicitud[column.key]) }}</span>
                      <span class="tooltip-text">{{ getModuloName(solicitud[column.key]) }}</span>
                    </div>
                  </template>
                </td>
              </tr>

              <!-- Fila expandible para tareas -->
              <tr v-if="solicitud.showTareas">
                <td :colspan="filteredColumns.length + 1" class="px-0 py-1 bg-gray-50">
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
                        @click="openNewTaskModal(solicitud)" 
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
                            <td class="px-2 py-2 text-xs text-center" v-if="userType !== 'C'">
                              <div class="flex items-center justify-center gap-2">
                                <button 
                                  @click="viewTaskDetails(tarea.id)" 
                                  class="text-blue-600 hover:text-blue-900"
                                  title="Ver detalles"
                                >
                                  <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                </button>
                                <button 
                                  @click="editTask(tarea)" 
                                  class="text-indigo-600 hover:text-indigo-900"
                                  title="Editar tarea"
                                >
                                  <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button 
                                  @click="deleteTask(tarea.id)" 
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
            <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span>
            -
            <span class="font-medium">{{ Math.min(currentPage * pageSize, filteredAndSortedSolicitudes.length) }}</span>
            de
            <span class="font-medium">{{ filteredAndSortedSolicitudes.length }}</span>
            registros
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
                    maxlength="30"
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
                    <option v-for="modulo in modulos" :key="modulo.id" :value="modulo.id">
                      {{ modulo.nombre }}
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
                    <option v-for="submodulo in filteredSubmodulos" :key="submodulo.id" :value="submodulo.id">
                      {{ submodulo.nombre }}
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
                <textarea id="new-descripcion" v-model="newSolicitud.descripcion" :class="['w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duración-200 resize-none', showError && !newSolicitud.descripcion ? 'border-red-500' : 'border-gray-300']" rows="4" placeholder="Describa paso a paso el problema que se ha detectado y el codigo de error generado en el programa"></textarea>
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
                  <option v-for="modulo in modulos" :key="modulo.id" :value="modulo.id">
                    {{ modulo.nombre }}
                  </option>
                </select>
              </div>

              <!-- Submódulo -->
              <div class="flex items-center">
                <label for="edit-submodulo" class="w-1/4 text-sm font-medium text-gray-700">Submódulo:</label>
                <select 
                  id="edit-submodulo" 
                  v-model="editableSolicitud.submodulo" 
                  class="w-3/4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Seleccione un submódulo</option>
                  <option v-for="submodulo in submodulos" :key="submodulo.id" :value="submodulo.id">
                    {{ submodulo.nombre }}
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
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

    <!-- Modal Tareas - Solo mejoras visuales -->
    <div v-if="showTareasModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" aria-hidden="true"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div class="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full border border-gray-200">
          <!-- Header con gradiente -->
          <div class="bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-4">
            <h3 class="text-2xl font-bold text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Tareas de la Solicitud {{ currentSolicitudId }}
            </h3>
          </div>

          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <!-- Lista de tareas con más información -->
            <div class="mb-6">
              <h4 class="text-lg font-medium text-gray-900 mb-3">Tareas existentes</h4>
              <div v-if="tareas && tareas.length > 0" class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                      <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fechas</th>
                      <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                      <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario Asignado</th>
                      <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Programada</th>
                      <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duración</th>
                      <th class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" v-if="userType !== 'C'">Acciones</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="tarea in solicitud.tareas" :key="tarea.id" class="hover:bg-gray-50">
                      <td class="px-3 py-2 text-xs text-gray-700 align-top max-w-xs">
                        <div class="line-clamp-2">{{ tarea.descripcion }}</div>
                        <div v-if="tarea.usuario_asignado" class="text-xs text-blue-600 mt-1">
                          Asignado a: {{ getNombreUsuario(tarea.usuario_asignado) }}
                        </div>
                        <div v-if="tarea.usuario_reasignado" class="text-xs text-purple-600 mt-1">
                          Reasignado a: {{ getNombreUsuario(tarea.usuario_reasignado) }}
                        </div>
                      </td>
                      <td class="px-3 py-2 text-xs text-gray-600 align-top whitespace-nowrap">
                        <div class="flex flex-col space-y-1">
                          <div class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Creación: {{ formatDate(tarea.fecha_creacion) }}</span>
                          </div>
                          <div v-if="tarea.fecha_programada" class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Programada: {{ formatDate(tarea.fecha_programada) }}</span>
                          </div>
                          <div v-if="tarea.fecha_inicio" class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Inicio: {{ formatDate(tarea.fecha_inicio) }}</span>
                          </div>
                          <div v-if="tarea.fecha_fin" class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                            </svg>
                            <span>Fin: {{ formatDate(tarea.fecha_fin) }}</span>
                          </div>
                        </div>
                      </td>
                      <td class="px-3 py-2 text-xs whitespace-nowrap align-top">
                        <span :class="[
                          'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                          tarea.estado === 1 ? 'bg-yellow-100 text-yellow-800' : 
                          tarea.estado === 2 ? 'bg-blue-100 text-blue-800' :
                          tarea.estado === 3 ? 'bg-green-100 text-green-800' :
                          tarea.estado === 4 ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        ]">
                          {{ getModuloName(tarea.estado, 'estados_tareas') || 'Sin estado' }}
                        </span>
                        <div v-if="tarea.motivo_cancelacion" class="text-xs text-red-500 mt-1 max-w-xs line-clamp-2">
                          {{ tarea.motivo_cancelacion }}
                        </div>
                      </td>
                      <td class="px-3 py-2 text-xs text-gray-600 whitespace-nowrap align-top">
                        <div v-if="tarea.duracion" class="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {{ tarea.duracion }}
                        </div>
                        <div v-if="tarea.tiempoFacturable" class="flex items-center text-green-600 mt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {{ tarea.tiempoFacturable }}
                        </div>
                      </td>
                      <td class="px-3 py-2 whitespace-nowrap text-xs text-center align-top" v-if="userType !== 'C'">
                        <div class="flex flex-col sm:flex-row items-center justify-center gap-2">
                          <button 
                            @click="editTarea(solicitud, tarea)" 
                            class="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 p-1 rounded"
                            title="Editar tarea"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            @click="deleteTarea(solicitud, tarea.id)" 
                            class="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-1 rounded"
                            title="Eliminar tarea"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else class="text-center py-6 bg-gray-50 rounded-md mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p class="mt-2 text-sm text-gray-500">No hay tareas asociadas a esta solicitud</p>
              </div>
            </div>

            <!-- Formulario nueva tarea con campos adicionales -->
            <div class="mt-6 border-t border-gray-200 pt-4" v-if="userType !== 'C'">
              <h4 class="text-lg font-medium text-gray-900 mb-3">{{ editingTarea ? 'Editar Tarea' : 'Nueva Tarea' }}</h4>
              <form @submit.prevent="saveTarea">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <!-- Descripción -->
                  <div class="md:col-span-2">
                    <label for="tarea-descripcion" class="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
                    <textarea
                      id="tarea-descripcion"
                      v-model="nuevaTarea.descripcion"
                      rows="2"
                      required
                      class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Descripción de la tarea"
                    ></textarea>
                  </div>

                  <!-- Fecha programada -->
                  <div>
                    <label for="tarea-fecha-programada" class="block text-sm font-medium text-gray-700 mb-1">Fecha programada</label>
                    <input
                      id="tarea-fecha-programada"
                      v-model="nuevaTarea.fecha_programada"
                      type="datetime-local"
                      class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <!-- Fecha inicio -->
                  <div>
                    <label for="tarea-fecha-inicio" class="block text-sm font-medium text-gray-700 mb-1">Fecha inicio</label>
                    <input
                      id="tarea-fecha-inicio"
                      v-model="nuevaTarea.fecha_inicio"
                      type="datetime-local"
                      class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <!-- Fecha fin -->
                  <div>
                    <label for="tarea-fecha-fin" class="block text-sm font-medium text-gray-700 mb-1">Fecha fin</label>
                    <input
                      id="tarea-fecha-fin"
                      v-model="nuevaTarea.fecha_fin"
                      type="datetime-local"
                      class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <!-- Duración -->
                  <div>
                    <label for="tarea-duracion" class="block text-sm font-medium text-gray-700 mb-1">Duración</label>
                    <input
                      id="tarea-duracion"
                      v-model="nuevaTarea.duracion"
                      type="text"
                      class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Ej: 2 horas"
                    />
                  </div>

                  <!-- Tiempo facturable -->
                  <div>
                    <label for="tarea-tiempo-facturable" class="block text-sm font-medium text-gray-700 mb-1">Tiempo facturable</label>
                    <input
                      id="tarea-tiempo-facturable"
                      v-model="nuevaTarea.tiempoFacturable"
                      type="text"
                      class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Ej: 1.5 horas"
                    />
                  </div>

                  <!-- Estado -->
                  <div>
                    <label for="tarea-estado" class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <select
                      id="tarea-estado"
                      v-model="nuevaTarea.estado"
                      class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="">Seleccione un estado</option>
                      <option v-for="estado in estados" :key="estado.id" :value="estado.id">
                        {{ estado.nombre }}
                      </option>
                    </select>
                  </div>

                  <!-- Usuario asignado -->
                  <div>
                    <label for="tarea-usuario-asignado" class="block text-sm font-medium text-gray-700 mb-1">Usuario asignado</label>
                    <select
                      id="tarea-usuario-asignado"
                      v-model="nuevaTarea.usuario_asignado"
                      class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="">Seleccione usuario asignado</option>
                      <option v-for="(nombre, id) in usuariosSoporteMap" :key="id" :value="id">
                        {{ nombre }}
                      </option>
                    </select>
                  </div>

                  <!-- Usuario reasignado -->
                  <div>
                    <label for="tarea-usuario-reasignado" class="block text-sm font-medium text-gray-700 mb-1">Usuario reasignado</label>
                    <select
                      id="tarea-usuario-reasignado"
                      v-model="nuevaTarea.usuario_reasignado"
                      class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="">Seleccione un usuario</option>
                      <option v-for="(nombre, id) in usuariosSoporteMap" :key="id" :value="id">{{ nombre }}</option>
                    </select>
                  </div>

                  <!-- Motivo cancelación -->
                  <div class="md:col-span-2">
                    <label for="tarea-motivo-cancelacion" class="block text-sm font-medium text-gray-700 mb-1">Motivo cancelación</label>
                    <textarea
                      id="tarea-motivo-cancelacion"
                      v-model="nuevaTarea.motivo_cancelacion"
                      rows="2"
                      class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Motivo de cancelación (si aplica)"
                    ></textarea>
                  </div>
                </div>

                <!-- Botones del formulario -->
                <div class="flex justify-end gap-3">
                  <button
                    type="button"
                    @click="cancelTaskForm"
                    class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="closeTareasModal" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Cerrar
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
                  detalleSolicitud.estado === 'S' ? 'bg-yellow-100 text-yellow-800' :
                  detalleSolicitud.estado === 'P' ? 'bg-blue-100 text-blue-800' :
                  detalleSolicitud.estado === 'T' ? 'bg-green-100 text-green-800' :
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

            <!-- Anexos con mejor diseño -->
            <div class="bg-white rounded-lg">
              <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                </svg>
                Anexos
              </h4>
              <div v-if="anexos && anexos.length > 0" class="space-y-3">
                <div v-for="anexo in anexos" :key="anexo.id" 
                     class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
                  <span class="text-sm text-gray-700 font-medium">{{ anexo.descripcion || 'Sin descripción' }}</span>
                  <button 
                    @click="downloadAnexo(anexo)"
                    class="inline-flex items-center px-4 py-2 border border-indigo-500 text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                    Descargar
                  </button>
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

  <!-- Modal para crear/editar tarea -->
  <teleport to="body">
    <div v-if="showTaskModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 p-4 sm:p-6">
        <div class="flex justify-between items-center pb-4 border-b">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ isEditingTask ? 'Editar Tarea' : 'Nueva Tarea' }}
          </h3>
          <button @click="closeTaskModal" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="mt-4 max-h-[70vh] overflow-y-auto">
          <form @submit.prevent="saveTask">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Descripción -->
              <div class="sm:col-span-2">
                <label for="descripcion" class="block text-sm font-medium text-gray-700">Descripción*</label>
                <textarea
                  id="descripcion"
                  v-model="currentTask.descripcion"
                  required
                  rows="3"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                ></textarea>
              </div>
              
              <!-- Estado -->
              <div>
                <label for="estado" class="block text-sm font-medium text-gray-700">Estado</label>
                <select
                  id="estado"
                  v-model="currentTask.estado"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option :value="null">Seleccione un estado</option>
                  <option v-for="estado in estados" :key="estado.id" :value="estado.id">
                    {{ estado.nombre }}
                  </option>
                </select>
              </div>
              
              <!-- Usuario Asignado -->
                <div>
                  <label for="usuario_asignado" class="block text-sm font-medium text-gray-700">Usuario Asignado</label>
                  <select
                    id="usuario_asignado"
                    v-model="currentTask.usuario_asignado"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option :value="null">Seleccione un usuario</option>
                    <!-- Usando usuariosSoporteList que ya se carga con fetchUsuariosSoporte -->
                    <option v-for="usuario in usuariosSoporteList" :key="usuario.id" :value="usuario.id">
                      {{ (usuario.first_name || '') + ' ' + (usuario.last_name || '') || usuario.username }}
                    </option>
                  </select>
                </div>

                <!-- Usuario Reasignado -->
                <div>
                  <label for="usuario_reasignado" class="block text-sm font-medium text-gray-700">Usuario Reasignado</label>
                  <select
                    id="usuario_reasignado"
                    v-model="currentTask.usuario_reasignado"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option :value="null">Seleccione un usuario</option>
                    <!-- Usando usuariosSoporteList que ya se carga con fetchUsuariosSoporte -->
                    <option v-for="usuario in usuariosSoporteList" :key="usuario.id" :value="usuario.id">
                      {{ (usuario.first_name || '') + ' ' + (usuario.last_name || '') || usuario.username }}
                    </option>
                  </select>
                </div>
              
              <!-- Fecha Programada -->
              <div>
                <label for="fecha_programada" class="block text-sm font-medium text-gray-700">Fecha Programada</label>
                <input
                  id="fecha_programada"
                  type="datetime-local"
                  v-model="currentTask.fecha_programada"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              
              <!-- Fecha Inicio -->
              <div>
                <label for="fecha_inicio" class="block text-sm font-medium text-gray-700">Fecha Inicio</label>
                <input
                  id="fecha_inicio"
                  type="datetime-local"
                  v-model="currentTask.fecha_inicio"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              
              <!-- Fecha Fin -->
              <div>
                <label for="fecha_fin" class="block text-sm font-medium text-gray-700">Fecha Fin</label>
                <input
                  id="fecha_fin"
                  type="datetime-local"
                  v-model="currentTask.fecha_fin"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              
              <!-- Duración -->
              <div>
                <label for="duracion" class="block text-sm font-medium text-gray-700">Duración</label>
                <input
                  id="duracion"
                  type="text"
                  v-model="currentTask.duracion"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              
              <!-- Tiempo Facturable -->
              <div>
                <label for="tiempoFacturable" class="block text-sm font-medium text-gray-700">Tiempo Facturable</label>
                <input
                  id="tiempoFacturable"
                  type="text"
                  v-model="currentTask.tiempoFacturable"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              
              <!-- Motivo Cancelación -->
              <div class="sm:col-span-2">
                <label for="motivo_cancelacion" class="block text-sm font-medium text-gray-700">Motivo Cancelación</label>
                <textarea
                  id="motivo_cancelacion"
                  v-model="currentTask.motivo_cancelacion"
                  rows="2"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                ></textarea>
              </div>
            </div>
            
            <div class="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                class="inline-flex justify-center w-full sm:w-auto rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:text-sm"
              >
                {{ isEditingTask ? 'Guardar Cambios' : 'Crear Tarea' }}
              </button>
              <button
                type="button"
                @click="closeTaskModal"
                class="mt-3 sm:mt-0 inline-flex justify-center w-full sm:w-auto rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </teleport>

  <!-- Modal para ver detalles de tarea -->
  <teleport to="body">
    <div v-if="showViewTaskModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 p-4 sm:p-6">
        <div class="flex justify-between items-center pb-4 border-b">
          <h3 class="text-lg font-semibold text-gray-900">
            Detalle de Tarea #{{ currentTask.id }}
          </h3>
          <button @click="closeViewTaskModal" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="mt-4 max-h-[70vh] overflow-y-auto">
          <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
            <div>
              <dt class="text-sm font-medium text-gray-500">ID</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ currentTask.id }}</dd>
            </div>
            
            <div>
              <dt class="text-sm font-medium text-gray-500">Estado</dt>
              <dd class="mt-1 text-sm text-gray-900">
                <span :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  getEstadoTareaClass(currentTask.estado)
                ]">
                  {{ getEstadoTareaNombre(currentTask.estado) }}
                </span>
              </dd>
            </div>
            
            <div class="sm:col-span-2">
              <dt class="text-sm font-medium text-gray-500">Descripción</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ currentTask.descripcion }}</dd>
            </div>
            
            <div>
              <dt class="text-sm font-medium text-gray-500">Usuario Asignado</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ getUsuarioNombre(currentTask.usuario_asignado) }}</dd>
            </div>
            
            <div>
              <dt class="text-sm font-medium text-gray-500">Usuario Reasignado</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ getUsuarioNombre(currentTask.usuario_reasignado) }}</dd>
            </div>
            
            <div>
              <dt class="text-sm font-medium text-gray-500">Fecha Creación</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ formatDate(currentTask.fecha_creacion) }}</dd>
            </div>
            
            <div>
              <dt class="text-sm font-medium text-gray-500">Fecha Programada</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ formatDate(currentTask.fecha_programada) }}</dd>
            </div>
            
            <div>
              <dt class="text-sm font-medium text-gray-500">Fecha Inicio</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ formatDate(currentTask.fecha_inicio) }}</dd>
            </div>
            
            <div>
              <dt class="text-sm font-medium text-gray-500">Fecha Fin</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ formatDate(currentTask.fecha_fin) }}</dd>
            </div>
            
            <div>
              <dt class="text-sm font-medium text-gray-500">Duración</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ currentTask.duracion || '-' }}</dd>
            </div>
            
            <div>
              <dt class="text-sm font-medium text-gray-500">Tiempo Facturable</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ currentTask.tiempoFacturable || '-' }}</dd>
            </div>
            
            <div class="sm:col-span-2">
              <dt class="text-sm font-medium text-gray-500">Motivo Cancelación</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ currentTask.motivo_cancelacion || '-' }}</dd>
            </div>
            
            <div v-if="currentTask.archivo" class="sm:col-span-2">
              <dt class="text-sm font-medium text-gray-500">Archivo</dt>
              <dd class="mt-1 text-sm text-gray-900">
                <a :href="currentTask.archivo" class="text-indigo-600 hover:text-indigo-900" target="_blank">
                  Ver archivo adjunto
                </a>
              </dd>
            </div>
          </dl>
        </div>
        
        <div class="mt-5 sm:mt-6">
          <button
            type="button"
            @click="closeViewTaskModal"
            class="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { PlusIcon } from '@heroicons/vue/24/outline'
import { Teleport } from 'vue'

</script>

<script>
import apiClient from '@/apiClient';
import { memoize } from 'lodash';
export default {
  name: 'FormSolicitud',
  components: {
    PlusIcon,
    Teleport
  },
  data() {
    return {
      
      showTaskModal: false,
    showViewTaskModal: false,
    isEditingTask: false,
    currentTask: {
      descripcion: '',
      estado: null,
      usuario_asignado: null,
      usuario_reasignado: null,
      fecha_programada: null,
      fecha_inicio: null,
      fecha_fin: null,
      duracion: '',
      tiempoFacturable: '',
      motivo_cancelacion: '',
      solicitud: null
    },
    currentSolicitud: null,
      allSolicitudes: [],
      currentPage: 1,     
      pageSize: 10,       
      editingField: null, 
      editingRowId: null, 
      dropdownOpen: {},
      filters: {},
      solicitudes: [],
      filteredSolicitudes: [],
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
        modulo: '',
        submodulo: '',
        accion: '',
        descripcion: '',
        descripcion_anexo: '',
        version_error: ''  
      },
      anexos: [],
      selectedFile: null,
      showModalDetails: false,
      showModalEdit: false,
      showModalCreate: false,
      errorMessage: '',
      statusMessage: '',
      tareasSolicitud: [],
      showModalTareas: false,
      showTareasModal: false,
      currentTarea: { descripcion: '', solicitud: null },
      currentSolicitudId: null,
      tareas: [],
      columnWidths: {
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
        acciones: 50
      },
      columns: [
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
        { key: 'acciones', label: 'Acciones' },
      ],
      nombreCompleto: '',
      userType: '',
      usuariosSoporteMap: {},
      usuariosSoporteList: [],
      colombiaTime: null,
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
      
      // Modificamos la estructura de nuevaTarea para incluir todos los campos
      nuevaTarea: {
        descripcion: '',
        solicitud: null,
        fecha_programada: null,
        fecha_inicio: null,
        fecha_fin: null,
        duracion: '',
        motivo_cancelacion: '',
        tiempoFacturable: '',
        usuario_asignado: null,
        usuario_reasignado: null,
        estado: null
      },
      editingTarea: false,
      editTareaId: null,
      estadoCancelado: '3', // ID del estado "Cancelado" - ajustar según corresponda
      };
  },
  computed: {
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
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredAndSortedSolicitudes.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredAndSortedSolicitudes.length / this.pageSize);
    },
  },
  created() {
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
  },
  beforeUnmount() {
    window.removeEventListener('click', this.closeDropdowns);
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout)
    }
  },
  methods: {
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
  async fetchSubmodulos() {
      try {
        const response = await apiClient.get('/submodulos/');
        this.submodulos = response.data;
      } catch (error) {
        console.error('Error al obtener submódulos:', error);
      }
    },
    startEditing(rowId, field) {
      if (this.userType === 'S' || this.userType === 'A') {
        this.editingRowId = rowId;
        this.editingField = field;
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

        const token = localStorage.getItem('access_token');
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
        const response = await fetch('http://worldtimeapi.org/api/timezone/America/Bogota');
        const data = await response.json();
        return new Date(data.datetime);
      } catch (error) {
        console.error('Error al obtener la hora de Colombia:', error);
        return new Date(); // Fallback a la hora local si hay un error
      }
    },
    
    formatDate(dateString) {
      if (!dateString) return '';
      
      const date = new Date(dateString);
      
      // Ajustar la fecha para la zona horaria de Colombia (UTC-5)
      const adjustedDate = new Date(date.getTime());
      
      return adjustedDate.toLocaleString('es-CO', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    },
    async setFechaSistema() {
      if (this.editableSolicitud.estado !== "S" && !this.isFechaAsignada) {
        this.colombiaTime = await this.getColombiaTime();
        this.editableSolicitud.fecha_asignacion = this.formatDate(this.colombiaTime);
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
      await this.fetchUsuarios(); // Método para cargar todos los usuarios
      const response = await apiClient.get('/solicitudes/');
      
      // Mapear y enriquecer los datos
      this.allSolicitudes = response.data.map(solicitud => ({
        ...solicitud,
        usuario_cliente_nombre: this.getUserFullName(solicitud.usuario_cliente),
        usuario_soporte_nombre: this.getUserFullName(solicitud.usuario_soporte),
        submodulo_nombre: this.getSubmoduloName(solicitud.submodulo),
        accion_nombre: this.getAccionName(solicitud.accion)
      }));

      // Ordenar por fecha de creación
      this.allSolicitudes.sort((a, b) => 
        new Date(b.fecha_creacion) - new Date(a.fecha_creacion)
      );
    } catch (error) {
      this.statusMessage = 'Error al cargar las solicitudes';
      this.isSuccess = false;
    }
  },

  applyPagination() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.solicitudes = this.allSolicitudes.slice(startIndex, endIndex);
  },

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  },

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  },

    async showSolicitudDetails(id) {
      try {
        const solicitudResponse = await apiClient.get(`/solicitudes/${id}/`);
        this.detalleSolicitud = solicitudResponse.data;
        const anexosResponse = await apiClient.get(`/anexos/${id}/solicitud-anexos/`);
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
        const token = localStorage.getItem('access_token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        // Paso 1: Obtener la información del anexo
        const anexoInfoUrl = `${apiClient.defaults.baseURL}anexos/${anexo.id}/`;
        const anexoInfoResponse = await apiClient.get(anexoInfoUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Obtener la URL del archivo
        const fileUrl = anexoInfoResponse.data.archivo;
        if (!fileUrl) {
          throw new Error('No se encontró la URL del archivo');
        }

        // Paso 2: Descargar el archivo
        const response = await apiClient.get(fileUrl, {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Verificar que la respuesta sea un archivo binario
        if (!response.data || response.data.type === 'application/json') {
          const errorText = await response.data.text();
          console.error('Error del servidor:', errorText);
          throw new Error('El servidor no devolvió un archivo válido');
        }

        // Crear un enlace temporal para descargar el archivo
        const blob = new Blob([response.data], {
          type: response.headers['content-type'] || 'application/octet-stream',
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        // Obtener el nombre del archivo
        const contentDisposition = response.headers['content-disposition'];
        const filename = contentDisposition
          ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
          : anexo.descripcion || 'archivo_adjunto';

        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();

        // Limpiar
        link.remove();
        window.URL.revokeObjectURL(url);

        console.log('Descarga completada con éxito');
        
      } catch (error) {
        this.isSuccess = false;
        this.statusMessage = 'Hubo un problema al descargar el archivo.';
        console.error('Error detallado al descargar el anexo:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
        });

        let errorMessage = 'Hubo un problema al descargar el archivo.';
        if (error.message === 'No se encontró el token de autenticación') {
          errorMessage = 'Su sesión ha expirado. Por favor, vuelva a iniciar sesión.';
        } else if (error.response?.status === 404) {
          errorMessage = 'El archivo no se encuentra disponible.';
        } else if (error.response?.status === 401) {
          errorMessage = 'Su sesión ha expirado. Por favor, vuelva a iniciar sesión.';
        }

        this.statusMessage = errorMessage;
      }
    },
    toggleTareas(solicitud) {
      // Enfoque compatible con Vue 3
      if (solicitud.showTareas === undefined) {
        // Vue 3 no necesita $set para reactividad
        solicitud.showTareas = false;
      }
      
      solicitud.showTareas = !solicitud.showTareas;
      
      // Si estamos mostrando las tareas y no están cargadas, cargarlas
      if (solicitud.showTareas && (!solicitud.tareas || solicitud.tareas.length === 0)) {
        this.loadTareas(solicitud);
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

    // Crear una nueva tarea
    async createTarea(solicitud) {
      if (!solicitud.nuevaTarea.trim()) return;

      try {
        const colombiaTime = await this.getColombiaTime();
        
        const response = await apiClient.post('/tareas/', {
          descripcion: solicitud.nuevaTarea,
          solicitud: solicitud.id,
          fecha_creacion: colombiaTime.toISOString(), // Guarda la fecha y hora completa
        });
        
        solicitud.tareas.push(response.data);
        solicitud.nuevaTarea = '';
        this.statusMessage = 'Tarea creada correctamente';
        this.isSuccess = true;
      } catch (error) {
        this.statusMessage = 'Error al crear la tarea.';
        this.isSuccess = false;
      }
    },

    // Eliminar una tarea
    async deleteTarea(solicitud, tareaId) {
      try {
        await apiClient.delete(`/tareas/${tareaId}/`);
        solicitud.tareas = solicitud.tareas.filter(tarea => tarea.id !== tareaId);
      } catch (error) {
        this.statusMessage = 'Error al eliminar la tarea.';
        this.isSuccess = false;
      }
    },

    closeTareasModal() {
      this.showTareasModal = false;
      this.currentSolicitudId = null;
      this.tareas = [];
      this.nuevaTarea = '';
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

    handleEstadoChange() {
      if (this.originalEstado === 'S' && this.editableSolicitud.estado !== 'S' && !this.editableSolicitud.fecha_asignacion) {
        this.editableSolicitud.fecha_asignacion = new Date().toISOString().split("T")[0];
      } else if (this.editableSolicitud.estado === 'T') {
        this.editableSolicitud.fecha_finalizacion = new Date().toISOString().split("T")[0];
      }

      if (this.editableSolicitud.estado === 'P' && !this.editableSolicitud.usuario_soporte && this.usuariosSoporte.length > 0) {
        this.editableSolicitud.usuario_soporte = this.usuariosSoporte[0].id;
      }
    },
    
    async updateSolicitud() {
      try {
        const colombiaTime = await this.getColombiaTime();
        
        const solicitudToUpdate = {
          ...this.editableSolicitud,
          fecha_asignacion: this.editableSolicitud.estado !== 3 ? colombiaTime.toISOString() : null,
          fecha_finalizacion: this.editableSolicitud.estado === 5 ? colombiaTime.toISOString() : null,
        };

        await apiClient.put(`/solicitudes/${this.editableSolicitud.id}/`, solicitudToUpdate);
        await this.fetchSolicitudes();
        this.closeModal();
        this.statusMessage = 'Solicitud actualizada correctamente';
        this.isSuccess = true;
      } catch (error) {
        this.statusMessage = '❌ Error al actualizar la solicitud:';
        this.isSuccess = false;
        this.statusMessage = error.response?.data?.detail || "Error al actualizar la solicitud";
      }
    },

    async createSolicitud() {
      try {
        // Validar campos requeridos
        if (!this.newSolicitud.titulo || !this.newSolicitud.modulo || !this.newSolicitud.submodulo 
        || !this.newSolicitud.accion || !this.newSolicitud.descripcion || !this.newSolicitud.version) {
          this.statusMessage = "Por favor, complete todos los campos requeridos.";
          this.isSuccess = false;
          return;
        }

        const currentUser = JSON.parse(localStorage.getItem('user'));

        // Preparar datos de la solicitud
        const solicitudData = {
          titulo: this.newSolicitud.titulo,
          descripcion: this.newSolicitud.descripcion,
          modulo: this.newSolicitud.modulo,
          submodulo: this.newSolicitud.submodulo || null,
          accion: this.newSolicitud.accion,
          prioridad: 3,
          estado: 2,
          usuario_cliente: currentUser.id,
          version_error: this.newSolicitud.version ? parseInt(this.newSolicitud.version) : null 
        };


        // Crear la solicitud
        const solicitudResponse = await apiClient.post('/solicitudes/', solicitudData);

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
            this.statusMessage('Error al subir anexo:', anexoError);
          }
        }

        this.statusMessage = "Solicitud creada exitosamente";
        this.isSuccess = true;
        this.closeModal();
        this.fetchSolicitudes();
      } catch (error) {
        if (error.response?.data) {
          const errorMessages = Object.entries(error.response.data)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
          this.statusMessage = "Error al crear la solicitud: " + errorMessages;
        } else {
          this.statusMessage = "Error al crear la solicitud";
        }
        this.isSuccess = false;
      }
    },
    handleFileUpload(event) {
      this.selectedFile = event.target.files[0];
    }, 
    closeModal() {
      this.showModalDetails = false;
      this.showModalEdit = false;
      this.showModalCreate = false;
      this.detalleSolicitud = null;
      this.editableSolicitud = {
        usuario_soporte: null,
      };
      this.newSolicitud = {
        titulo: '',
        modulo: '',
        submodulo: '',
        descripcion: '',
        prioridad: 3,
        estado: 1,
        descripcion_anexo: '',
        version: ''  // Agregamos el campo versión
      };
      this.selectedFile = null;
      this.closeModalTareas = null;
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
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
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
      console.log('Botón clickeado') // Debug
      this.showModalCreate = true
      this.newSolicitud = {
        titulo: '',
        modulo: '',
        submodulo: '',
        accion: '',
        descripcion: '',
        descripcion_anexo: '',
        version: ''  // Agregamos el campo versión
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
      if (this.debouncedSearchTimeout) {
        clearTimeout(this.debouncedSearchTimeout);
      }
      
      this.debouncedSearchTimeout = setTimeout(() => {
        this.filterSolicitudes();
        console.log("Buscando:", this.searchQuery);
      }, 300);
    },
    
    // Función para limpiar la búsqueda
    clearSearch() {
      this.searchQuery = '';
      this.filterSolicitudes();
    },
    
    // Inicializar la tarea para crear una nueva
    resetNuevaTarea() {
      this.nuevaTarea = {
        descripcion: '',
        solicitud: this.currentSolicitudId,
        fecha_programada: null,
        fecha_inicio: null,
        fecha_fin: null,
        duracion: '',
        motivo_cancelacion: '',
        tiempoFacturable: '',
        usuario_asignado: null,
        usuario_reasignado: null,
        estado: null
      };
      this.editingTarea = false;
      this.editTareaId = null;
    },
    
    // Método para preparar la edición de una tarea
    editTarea(tarea) {
      this.nuevaTarea = { ...tarea };
      this.editingTarea = true;
      this.editTareaId = tarea.id;
    },
    
    // Método para cancelar la edición
    cancelEditTarea() {
      this.resetNuevaTarea();
    },
    
    // Método para guardar la tarea (crear o actualizar)
    async saveTarea() {
      try {
        if (this.editingTarea) {
          // Actualizar tarea existente
          await apiClient.put(`/tareas/${this.editTareaId}/`, this.nuevaTarea);
          this.mostrarMensaje('Tarea actualizada correctamente', true);
        } else {
          // Crear nueva tarea
          await apiClient.post('/tareas/', this.nuevaTarea);
          this.mostrarMensaje('Tarea creada correctamente', true);
        }
        
        // Recargar las tareas y resetear el formulario
        await this.loadTareas();
        this.resetNuevaTarea();
      } catch (error) {
        console.error('Error al guardar la tarea:', error);
        this.mostrarMensaje('Error al guardar la tarea', false);
      }
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
  openNewTaskModal(solicitud) {
    this.isEditingTask = false;
    this.currentSolicitud = solicitud;
    this.currentTask = {
      descripcion: '',
      estado: 1, // Estado predeterminado: Pendiente
      usuario_asignado: null,
      usuario_reasignado: null,
      fecha_programada: null,
      fecha_inicio: null,
      fecha_fin: null,
      duracion: '',
      tiempoFacturable: '',
      motivo_cancelacion: '',
      solicitud: solicitud.id
    };
    this.showTaskModal = true;
  },
    openViewTaskModal(tarea) {
      this.currentTask = { ...tarea };
      this.showViewTaskModal = true;
    },
    openEditTaskModal(tarea, solicitud) {
      this.isEditingTask = true;
      this.currentSolicitud = solicitud;
      
      // Crear una copia de la tarea para no modificar la original directamente
      this.currentTask = { ...tarea };
      
      // Formatear fechas para input datetime-local
      if (this.currentTask.fecha_programada) {
        this.currentTask.fecha_programada = this.formatDateForInput(this.currentTask.fecha_programada);
      }
      if (this.currentTask.fecha_inicio) {
        this.currentTask.fecha_inicio = this.formatDateForInput(this.currentTask.fecha_inicio);
      }
      if (this.currentTask.fecha_fin) {
        this.currentTask.fecha_fin = this.formatDateForInput(this.currentTask.fecha_fin);
      }
      
      this.showTaskModal = true;
    },
    formatDateForInput(dateString) {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) return null;
    
    // Formato YYYY-MM-DDThh:mm
    return date.toISOString().slice(0, 16);
  },
    closeTaskModal() {
      this.showTaskModal = false;
      this.isEditingTask = false;
      this.currentTask = {
        descripcion: '',
        estado: null,
        usuario_asignado: null,
        usuario_reasignado: null,
        fecha_programada: null,
        fecha_inicio: null,
        fecha_fin: null,
        duracion: '',
        tiempoFacturable: '',
        motivo_cancelacion: '',
        solicitud: this.currentSolicitudId
      };
    },
  
    // Cerrar modal de vista de tarea
    closeViewTaskModal() {
      this.showViewTaskModal = false;
      this.currentTask = {};
    },
    async saveTask() {
    try {
      let response;
      const taskData = { ...this.currentTask };
      
      // Asegurarse de que el ID de solicitud esté definido
      if (!taskData.solicitud && this.currentSolicitud) {
        taskData.solicitud = this.currentSolicitud.id;
      }
      
      if (this.isEditingTask) {
        // Actualizar tarea existente
        response = await apiClient.put(`/tareas/${taskData.id}/`, taskData);
        
        // Actualizar la tarea en el array local
        const index = this.currentSolicitud.tareas.findIndex(t => t.id === taskData.id);
        if (index !== -1) {
          this.currentSolicitud.tareas.splice(index, 1, response.data);
        }
        
        this.showToastMessage('Tarea actualizada correctamente', true);
      } else {
        // Crear nueva tarea
        response = await apiClient.post('/tareas/', taskData);
        
        // Agregar la nueva tarea al array local
        if (this.currentSolicitud.tareas) {
          this.currentSolicitud.tareas.push(response.data);
        } else {
          this.currentSolicitud.tareas = [response.data];
        }
        
        this.showToastMessage('Tarea creada correctamente', true);
      }
      
      this.closeTaskModal();
    } catch (error) {
      console.error('Error al guardar tarea:', error);
      this.showToastMessage('Error al guardar la tarea: ' + (error.response?.data?.detail || 'Intente nuevamente'), false);
    }
  },
    // Confirmar eliminación de tarea
  confirmDeleteTask(tarea, solicitud) {
    if (confirm('¿Está seguro de que desea eliminar esta tarea?')) {
      this.deleteTask(tarea, solicitud);
    }
  },
    // Eliminar tarea
  async deleteTask(tarea, solicitud) {
    try {
      await apiClient.delete(`/tareas/${tarea.id}/`);
      
      // Eliminar la tarea del array local
      solicitud.tareas = solicitud.tareas.filter(t => t.id !== tarea.id);
      
      this.showToastMessage('Tarea eliminada correctamente', true);
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      this.showToastMessage('Error al eliminar la tarea', false);
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
    viewTaskDetails(taskId) {
      try {
        // Obtener los detalles de la tarea desde la API
        apiClient.get(`/tareas/${taskId}/`).then(response => {
          this.currentTask = response.data;
          this.showViewTaskModal = true;
        }).catch(error => {
          this.mostrarMensaje('Error al cargar los detalles de la tarea: ' + error.message, false);
        });
      } catch (error) {
        this.mostrarMensaje('Error al procesar la solicitud: ' + error.message, false);
      }
    },
    
    editTask(task) {
      try {
        this.currentTask = { ...task }; // Hacer una copia para no modificar la original
        this.isEditingTask = true;
        this.showTaskModal = true;
      } catch (error) {
        this.mostrarMensaje('Error al editar la tarea: ' + error.message, false);
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
        1: 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs', // Pendiente
        2: 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs',     // En Proceso
        3: 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs',   // Completada
        4: 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs'        // Cancelada
      };
      
      return clases[estadoId] || 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
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
</style>