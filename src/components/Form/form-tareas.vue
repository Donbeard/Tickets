<template>
  <div class="bg-gray-50 py-4 w-full">
    <div class="px-4 sm:px-6 lg:px-8 w-full">
      <!-- Encabezado con controles integrados (título a la izquierda, botón y búsqueda a la derecha) -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h1 class="text-2xl font-bold text-gray-900 mb-2 sm:mb-0">Gestión de Tareas</h1>
        
        <div class="flex flex-col sm:flex-row gap-2 sm:items-center">
          <!-- Barra de búsqueda -->
          <div class="relative w-full sm:w-72">
            <input 
              type="text" 
              v-model="searchQuery" 
              @input="filterTareas" 
              placeholder="Buscar tareas..."
              class="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
            <div class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
              <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>
          
          <!-- Botón Nueva Tarea -->
          <button 
            @click="showModalCreate = true"
            class="inline-flex items-center justify-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full sm:w-auto"
          >
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            Nueva Tarea
          </button>
        </div>
      </div>

            <!-- Tabla de Tareas - Filas más delgadas -->
      <div class="bg-white rounded-lg shadow-sm w-full">
        <div class="w-full overflow-x-auto">
          <table class="w-full table-auto divide-y divide-indigo-200">
            <thead class="bg-gradient-to-r from-indigo-50 to-blue-50">
              <tr>
                <th scope="col" class="px-2 py-1 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider border-r border-indigo-100">ID</th>
                <th scope="col" class="px-2 py-1 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider border-r border-indigo-100 w-1/6">Descripción</th>
                <th scope="col" class="px-2 py-1 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider border-r border-indigo-100">Solicitud</th>
                
                <!-- Encabezado con filtro de fecha de creación -->
                <th scope="col" class="px-2 py-1 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider border-r border-indigo-100">
                  <div class="flex items-center justify-between">
                    <span>F. Creación</span>
                    <button 
                      @click="toggleFilter('fechaCreacion')" 
                      class="ml-1 text-indigo-500 hover:text-indigo-700"
                      title="Filtrar por fecha de creación"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                    </button>
                  </div>
                  <div v-if="activeFilter === 'fechaCreacion'" class="mt-2 bg-white p-2 rounded shadow-md border border-gray-200 absolute z-10">
                    <div class="flex flex-col gap-2">
                      <div class="flex items-center gap-1">
                        <label class="text-xs text-gray-600">Desde:</label>
                        <input 
                          type="date" 
                          v-model="dateFilters.startDate" 
                          class="border border-gray-300 rounded-md text-xs p-1 w-full"
                        />
                      </div>
                      <div class="flex items-center gap-1">
                        <label class="text-xs text-gray-600">Hasta:</label>
                        <input 
                          type="date" 
                          v-model="dateFilters.endDate" 
                          class="border border-gray-300 rounded-md text-xs p-1 w-full"
                        />
                      </div>
                      <div class="flex justify-between mt-1">
                        <button 
                          @click="applyFilters(); activeFilter = null"
                          class="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700"
                        >
                          Aplicar
                        </button>
                        <button 
                          @click="activeFilter = null"
                          class="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                        >
                          Cerrar
                        </button>
                      </div>
                    </div>
                  </div>
                </th>
                
                <!-- Encabezado con filtro de fecha programada -->
                <th scope="col" class="px-2 py-1 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider border-r border-indigo-100">
                  <div class="flex items-center justify-between">
                    <span>F. Programada</span>
                    <button 
                      @click="toggleFilter('fechaProgramada')" 
                      class="ml-1 text-indigo-500 hover:text-indigo-700"
                      title="Filtrar por fecha programada"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                    </button>
                  </div>
                  <div v-if="activeFilter === 'fechaProgramada'" class="mt-2 bg-white p-2 rounded shadow-md border border-gray-200 absolute z-10">
                    <div class="flex flex-col gap-2">
                      <div class="flex items-center gap-1">
                        <label class="text-xs text-gray-600">Desde:</label>
                        <input 
                          type="date" 
                          v-model="programadaFilters.startDate" 
                          class="border border-gray-300 rounded-md text-xs p-1 w-full"
                        />
                      </div>
                      <div class="flex items-center gap-1">
                        <label class="text-xs text-gray-600">Hasta:</label>
                        <input 
                          type="date" 
                          v-model="programadaFilters.endDate" 
                          class="border border-gray-300 rounded-md text-xs p-1 w-full"
                        />
                      </div>
                      <div class="flex justify-between mt-1">
                        <button 
                          @click="applyFilters(); activeFilter = null"
                          class="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700"
                        >
                          Aplicar
                        </button>
                        <button 
                          @click="activeFilter = null"
                          class="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                        >
                          Cerrar
                        </button>
                      </div>
                    </div>
                  </div>
                </th>
                
                <!-- Encabezado con filtro de fecha de inicio -->
                <th scope="col" class="px-2 py-1 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider border-r border-indigo-100">
                  <div class="flex items-center justify-between">
                    <span>F. Inicio</span>
                    <button 
                      @click="toggleFilter('fechaInicio')" 
                      class="ml-1 text-indigo-500 hover:text-indigo-700"
                      title="Filtrar por fecha de inicio"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                    </button>
                  </div>
                  <div v-if="activeFilter === 'fechaInicio'" class="mt-2 bg-white p-2 rounded shadow-md border border-gray-200 absolute z-10">
                    <div class="flex flex-col gap-2">
                      <div class="flex items-center gap-1">
                        <label class="text-xs text-gray-600">Desde:</label>
                        <input 
                          type="date" 
                          v-model="inicioFilters.startDate" 
                          class="border border-gray-300 rounded-md text-xs p-1 w-full"
                        />
                      </div>
                      <div class="flex items-center gap-1">
                        <label class="text-xs text-gray-600">Hasta:</label>
                        <input 
                          type="date" 
                          v-model="inicioFilters.endDate" 
                          class="border border-gray-300 rounded-md text-xs p-1 w-full"
                        />
                      </div>
                      <div class="flex justify-between mt-1">
                        <button 
                          @click="applyFilters(); activeFilter = null"
                          class="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700"
                        >
                          Aplicar
                        </button>
                        <button 
                          @click="activeFilter = null"
                          class="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                        >
                          Cerrar
                        </button>
                      </div>
                    </div>
                  </div>
                </th>
                
                <!-- Encabezado con filtro de fecha de fin -->
                <th scope="col" class="px-2 py-1 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider border-r border-indigo-100">
                  <div class="flex items-center justify-between">
                    <span>F. Fin</span>
                    <button 
                      @click="toggleFilter('fechaFin')" 
                      class="ml-1 text-indigo-500 hover:text-indigo-700"
                      title="Filtrar por fecha de fin"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                    </button>
                  </div>
                  <div v-if="activeFilter === 'fechaFin'" class="mt-2 bg-white p-2 rounded shadow-md border border-gray-200 absolute z-10">
                    <div class="flex flex-col gap-2">
                      <div class="flex items-center gap-1">
                        <label class="text-xs text-gray-600">Desde:</label>
                        <input 
                          type="date" 
                          v-model="finFilters.startDate" 
                          class="border border-gray-300 rounded-md text-xs p-1 w-full"
                        />
                      </div>
                      <div class="flex items-center gap-1">
                        <label class="text-xs text-gray-600">Hasta:</label>
                        <input 
                          type="date" 
                          v-model="finFilters.endDate" 
                          class="border border-gray-300 rounded-md text-xs p-1 w-full"
                        />
                      </div>
                      <div class="flex justify-between mt-1">
                        <button 
                          @click="applyFilters(); activeFilter = null"
                          class="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700"
                        >
                          Aplicar
                        </button>
                        <button 
                          @click="activeFilter = null"
                          class="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                        >
                          Cerrar
                        </button>
                      </div>
                    </div>
                  </div>
                </th>
                
                <!-- Encabezado con filtro de duración -->
                <th scope="col" class="px-2 py-1 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider border-r border-indigo-100">Duración</th>
                
                <!-- Encabezado con filtro de estado -->
                <th scope="col" class="px-2 py-1 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider border-r border-indigo-100">
                  <div class="flex items-center justify-between">
                    <span>Estado</span>
                    <button 
                      @click="toggleFilter('estado')" 
                      class="ml-1 text-indigo-500 hover:text-indigo-700"
                      title="Filtrar por estado"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                    </button>
                  </div>
                  <div v-if="activeFilter === 'estado'" class="mt-2 bg-white p-2 rounded shadow-md border border-gray-200 absolute z-10">
                    <div class="flex flex-col gap-2">
                      <select 
                        v-model="statusFilter" 
                        class="border border-gray-300 rounded-md text-xs p-1 w-full"
                      >
                        <option value="">Todos</option>
                        <option v-for="estado in estadosSolicitud" :key="estado.id" :value="estado.id">
                          {{ estado.nombre }}
                        </option>
                      </select>
                      <div class="flex justify-between mt-1">
                        <button 
                          @click="applyFilters(); activeFilter = null"
                          class="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700"
                        >
                          Aplicar
                        </button>
                        <button 
                          @click="activeFilter = null"
                          class="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                        >
                          Cerrar
                        </button>
                      </div>
                    </div>
                  </div>
                </th>
                
                <!-- Encabezado con filtro de usuario -->
                <th scope="col" class="px-2 py-1 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider border-r border-indigo-100">
                  <div class="flex items-center justify-between">
                    <span>Usuario</span>
                    <button 
                      @click="toggleFilter('usuario')" 
                      class="ml-1 text-indigo-500 hover:text-indigo-700"
                      title="Filtrar por usuario"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                    </button>
                  </div>
                  <div v-if="activeFilter === 'usuario'" class="mt-2 bg-white p-2 rounded shadow-md border border-gray-200 absolute z-10">
                    <div class="flex flex-col gap-2">
                      <select 
                        v-model="userFilter" 
                        class="border border-gray-300 rounded-md text-xs p-1 w-full"
                      >
                        <option value="">Todos</option>
                        <option v-for="usuario in usuarios" :key="usuario.id" :value="usuario.id">
                          {{ usuario.nombre }} {{ usuario.apellido }}
                        </option>
                      </select>
                      <div class="flex justify-between mt-1">
                        <button 
                          @click="applyFilters(); activeFilter = null"
                          class="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700"
                        >
                          Aplicar
                        </button>
                        <button 
                          @click="activeFilter = null"
                          class="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                        >
                          Cerrar
                        </button>
                      </div>
                    </div>
                  </div>
                </th>
                
                <th scope="col" class="px-2 py-1 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                  <div class="flex justify-between items-center">
                    <span>Acciones</span>
                    <button 
                      @click="clearFilters" 
                      class="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 px-2 rounded"
                      title="Limpiar filtros"
                    >
                      Limpiar
                    </button>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-indigo-100">
              <tr v-for="tarea in filteredTareas" 
                  :key="tarea.id" 
                  class="hover:bg-blue-50 transition-colors duration-150">
                <td class="px-2 py-1 whitespace-nowrap text-xs font-medium text-black border-r border-indigo-50">{{ tarea.id }}</td>
                <td class="px-2 py-1 text-xs text-black truncate max-w-xs border-r border-indigo-50">{{ tarea.descripcion }}</td>
                <td class="px-2 py-1 whitespace-nowrap text-xs text-black border-r border-indigo-50">{{ tarea.solicitud }}</td>
                <td class="px-2 py-1 whitespace-nowrap text-xs text-black border-r border-indigo-50">{{ formatDate(tarea.fecha_creacion) }}</td>
                <td class="px-2 py-1 whitespace-nowrap text-xs text-black border-r border-indigo-50">{{ formatDate(tarea.fecha_programada) }}</td>
                <td class="px-2 py-1 whitespace-nowrap text-xs text-black border-r border-indigo-50">{{ formatDate(tarea.fecha_inicio) }}</td>
                <td class="px-2 py-1 whitespace-nowrap text-xs text-black border-r border-indigo-50">{{ formatDate(tarea.fecha_fin) }}</td>
                <td class="px-2 py-1 whitespace-nowrap text-xs text-black border-r border-indigo-50">{{ tarea.duracion || '-' }}</td>
                <td class="px-2 py-1 whitespace-nowrap text-xs border-r border-indigo-50">
                  <span :class="[
                    'px-1.5 py-0.5 inline-flex text-xs leading-4 font-medium rounded-full',
                    getEstadoClass(tarea.estado)
                  ]">
                    {{ getEstadoLabel(tarea.estado) }}
                  </span>
                </td>
                <td class="px-2 py-1 whitespace-nowrap text-xs text-black border-r border-indigo-50">
                  {{ getUserName(tarea.usuario_asignado) || '-' }}
                </td>
                <td class="px-2 py-1 whitespace-nowrap text-xs font-medium">
                  <div class="flex space-x-1">
                    <button 
                      @click="editTarea(tarea.id)"
                      class="text-indigo-600 hover:text-indigo-900 p-0.5 bg-indigo-50 rounded-full hover:bg-indigo-100 transition-colors duration-150"
                      title="Editar"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </button>
                    <button 
                      @click="deleteTarea(tarea.id)"
                      class="text-red-600 hover:text-red-900 p-0.5 bg-red-50 rounded-full hover:bg-red-100 transition-colors duration-150"
                      title="Eliminar"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <!-- Si no hay tareas -->
              <tr v-if="filteredTareas.length === 0">
                <td colspan="11" class="px-2 py-3 text-center text-xs text-gray-500">
                  No se encontraron tareas
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal para Crear/Editar Tarea -->
    <div v-if="showModalCreate || showModalEdit" 
         class="fixed inset-0 z-50 overflow-y-auto"
         aria-labelledby="modal-title" 
         role="dialog" 
         aria-modal="true">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-60 transition-opacity backdrop-blur-sm" 
             aria-hidden="true"
             @click="closeModal"></div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-indigo-100">
          <form @submit.prevent="showModalCreate ? createTarea() : updateTarea()">
            <div class="bg-gradient-to-r from-indigo-600 to-blue-500 px-4 py-3 flex justify-between items-center">
              <h3 class="text-lg leading-6 font-medium text-white">
                {{ showModalCreate ? 'Crear Nueva Tarea' : 'Editar Tarea' }}
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
            
            <div class="bg-white px-4 py-4">
              <div class="space-y-4">
                <!-- Campo Descripción -->
                <div class="flex items-center">
                  <label for="descripcion" class="block text-sm font-medium text-gray-700 w-1/4">
                    Descripción:
                  </label>
                  <textarea
                    id="descripcion"
                    v-model="currentTarea.descripcion"
                    rows="3"
                    required
                    class="block w-3/4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm"
                    placeholder="Ingrese la descripción de la tarea"
                  ></textarea>
                </div>

                <!-- Campo Solicitud -->
                <div class="flex items-center">
                  <label for="solicitud" class="block text-sm font-medium text-gray-700 w-1/4">
                    Solicitud:
                  </label>
                  <select
                    id="solicitud"
                    v-model="currentTarea.solicitud"
                    required
                    class="block w-3/4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm"
                  >
                    <option value="" disabled>Seleccione una solicitud</option>
                    <option v-for="solicitud in solicitudes" 
                            :key="solicitud.id" 
                            :value="solicitud.id">
                      {{ solicitud.id }} - {{ solicitud.modulo }}
                    </option>
                  </select>
                </div>
                
                <!-- Campo Estado -->
                <div class="flex items-center">
                  <label for="estado" class="block text-sm font-medium text-gray-700 w-1/4">
                    Estado:
                  </label>
                  <select
                    id="estado"
                    v-model="currentTarea.estado"
                    class="block w-3/4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm"
                  >
                    <option value="1">Pendiente</option>
                    <option value="2">En progreso</option>
                    <option value="3">Completada</option>
                    <option value="4">Cancelada</option>
                  </select>
                </div>

                <!-- Campo Motivo Cancelación (mostrar solo si estado es cancelado) -->
                <div v-if="currentTarea.estado == 4" class="flex items-center">
                  <label for="motivo_cancelacion" class="block text-sm font-medium text-gray-700 w-1/4">
                    Motivo Cancelación:
                  </label>
                  <textarea
                    id="motivo_cancelacion"
                    v-model="currentTarea.motivo_cancelacion"
                    rows="2"
                    class="block w-3/4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm"
                    placeholder="Motivo de cancelación"
                  ></textarea>
                </div>

                <!-- Fecha Programada -->
                <div class="flex items-center">
                  <label for="fecha_programada" class="block text-sm font-medium text-gray-700 w-1/4">
                    Fecha Programada:
                  </label>
                  <input
                    type="datetime-local"
                    id="fecha_programada"
                    v-model="currentTarea.fecha_programada"
                    class="block w-3/4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm"
                  />
                </div>

                <!-- Fecha Inicio -->
                <div class="flex items-center">
                  <label for="fecha_inicio" class="block text-sm font-medium text-gray-700 w-1/4">
                    Fecha Inicio:
                  </label>
                  <input
                    type="datetime-local"
                    id="fecha_inicio"
                    v-model="currentTarea.fecha_inicio"
                    class="block w-3/4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm"
                  />
                </div>

                <!-- Fecha Fin -->
                <div class="flex items-center">
                  <label for="fecha_fin" class="block text-sm font-medium text-gray-700 w-1/4">
                    Fecha Fin:
                  </label>
                  <input
                    type="datetime-local"
                    id="fecha_fin"
                    v-model="currentTarea.fecha_fin"
                    class="block w-3/4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm"
                  />
                </div>

                <!-- Duración -->
                <div class="flex items-center">
                  <label for="duracion" class="block text-sm font-medium text-gray-700 w-1/4">
                    Duración:
                  </label>
                  <input
                    type="text"
                    id="duracion"
                    v-model="currentTarea.duracion"
                    placeholder="Ej: 2h 30m"
                    class="block w-3/4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm"
                  />
                </div>

                <!-- Tiempo Facturable -->
                <div class="flex items-center">
                  <label for="tiempoFacturable" class="block text-sm font-medium text-gray-700 w-1/4">
                    Tiempo Facturable:
                  </label>
                  <input
                    type="text"
                    id="tiempoFacturable"
                    v-model="currentTarea.tiempoFacturable"
                    placeholder="Ej: 2h"
                    class="block w-3/4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm"
                  />
                </div>

                <!-- Usuario Asignado -->
                <div class="flex items-center">
                  <label for="usuario_asignado" class="block text-sm font-medium text-gray-700 w-1/4">
                    Usuario Asignado:
                  </label>
                  <select
                    id="usuario_asignado"
                    v-model="currentTarea.usuario_asignado"
                    class="block w-3/4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm"
                  >
                    <option value="">Sin asignar</option>
                    <option v-for="usuario in usuarios" 
                            :key="usuario.id" 
                            :value="usuario.id">
                      {{ usuario.nombre }} {{ usuario.apellido }}
                    </option>
                  </select>
                </div>

                <!-- Usuario Reasignado -->
                <div class="flex items-center">
                  <label for="usuario_reasignado" class="block text-sm font-medium text-gray-700 w-1/4">
                    Usuario Reasignado:
                  </label>
                  <select
                    id="usuario_reasignado"
                    v-model="currentTarea.usuario_reasignado"
                    class="block w-3/4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm"
                  >
                    <option value="">Sin reasignar</option>
                    <option v-for="usuario in usuarios" 
                            :key="usuario.id" 
                            :value="usuario.id">
                      {{ usuario.nombre }} {{ usuario.apellido }}
                    </option>
                  </select>
                </div>
              </div>

              <div v-if="errorMessage" class="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {{ errorMessage }}
              </div>
            </div>
            
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
              <button
                type="submit"
                class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-base font-medium text-white hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {{ showModalCreate ? 'Crear' : 'Actualizar' }}
              </button>
              <button
                type="button"
                @click="closeModal"
                class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import apiClient from '@/apiClient'

// Definir estados directamente en el componente
const estadosSolicitud = [
  { id: 5, nombre: 'Sin asignar' },
  { id: 6, nombre: 'Asignado' },
  { id: 7, nombre: 'Terminado' },
  { id: 8, nombre: 'Cancelado' }
];

export default {
  name: 'FormTareas',
  
  setup() {
    const tareas = ref([]);
    const solicitudes = ref([]);
    const usuarios = ref([]);
    const searchQuery = ref('');
    const filteredTareas = ref([]);
    const errorMessage = ref('');
    const showModalCreate = ref(false);
    const showModalEdit = ref(false);
    
    // Filtros
    const dateFilters = ref({
      startDate: '',
      endDate: ''
    });
    const programadaFilters = ref({
      startDate: '',
      endDate: ''
    });
    const statusFilter = ref('');
    const userFilter = ref('');
    const activeFilter = ref(null);
    
    const currentTarea = ref({
      descripcion: '',
      solicitud: '',
      estado: 1,
      motivo_cancelacion: '',
      fecha_programada: '',
      fecha_inicio: '',
      fecha_fin: '',
      duracion: '',
      tiempoFacturable: '',
      usuario_asignado: '',
      usuario_reasignado: ''
    });

    // Filtros adicionales
    const inicioFilters = ref({
      startDate: '',
      endDate: ''
    });
    const finFilters = ref({
      startDate: '',
      endDate: ''
    });

    const fetchTareas = async () => {
      try {
        const response = await apiClient.get('/tareas/');
        tareas.value = response.data;
        filteredTareas.value = [...tareas.value];
      } catch (error) {
        console.error('Error al obtener tareas:', error);
        errorMessage.value = 'Error al cargar las tareas. Por favor, actualice la página e intente de nuevo.';
      }
    };

    const fetchSolicitudes = async () => {
      try {
        const response = await apiClient.get('/solicitudes/');
        solicitudes.value = response.data;
      } catch (error) {
        console.error('Error al obtener solicitudes:', error);
      }
    };

    const fetchUsuarios = async () => {
      try {
        const response = await apiClient.get('/usuarios/');
        usuarios.value = response.data;
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    };

    const filterTareas = () => {
      const query = searchQuery.value.toLowerCase();
      filteredTareas.value = tareas.value.filter(tarea => 
        tarea.descripcion.toLowerCase().includes(query) || 
        String(tarea.id).includes(query) ||
        String(tarea.solicitud).toLowerCase().includes(query)
      );
    };

    const createTarea = async () => {
      try {
        await apiClient.post('/tareas/', currentTarea.value);
        closeModal();
        await fetchTareas();
      } catch (error) {
        console.error('Error al crear tarea:', error);
        errorMessage.value = 'Error al crear la tarea. Por favor, intente de nuevo.';
      }
    };

    const editTarea = async (id) => {
      try {
        const response = await apiClient.get(`/tareas/${id}/`);
        currentTarea.value = response.data;
        // Convertir números a string para los selects
        currentTarea.value.estado = String(currentTarea.value.estado || 1);
        showModalEdit.value = true;
      } catch (error) {
        console.error('Error al obtener detalles de tarea:', error);
        errorMessage.value = 'Error al cargar los detalles de la tarea. Por favor, intente de nuevo.';
      }
    };

    const updateTarea = async () => {
      try {
        // Convertir string a número para la API
        const tareaToUpdate = {...currentTarea.value};
        tareaToUpdate.estado = Number(tareaToUpdate.estado);
        
        await apiClient.put(`/tareas/${currentTarea.value.id}/`, tareaToUpdate);
        closeModal();
        await fetchTareas();
      } catch (error) {
        console.error('Error al actualizar tarea:', error);
        errorMessage.value = 'Error al actualizar la tarea. Por favor, intente de nuevo.';
      }
    };

    const deleteTarea = async (id) => {
      if (!confirm('¿Está seguro de eliminar esta tarea?')) return;
      
      try {
        await apiClient.delete(`/tareas/${id}/`);
        await fetchTareas();
      } catch (error) {
        console.error('Error al eliminar tarea:', error);
        errorMessage.value = 'Error al eliminar la tarea. Por favor, intente de nuevo.';
      }
    };

    const closeModal = () => {
      showModalCreate.value = false;
      showModalEdit.value = false;
      errorMessage.value = '';
      currentTarea.value = {
        descripcion: '',
        solicitud: '',
        estado: 1,
        motivo_cancelacion: '',
        fecha_programada: '',
        fecha_inicio: '',
        fecha_fin: '',
        duracion: '',
        tiempoFacturable: '',
        usuario_asignado: '',
        usuario_reasignado: ''
      };
    };

    const formatDate = (dateString) => {
      if (!dateString) return '-';
      
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    };

    const getEstadoLabel = (estado) => {
      // Convertir a número si viene como string
      const estadoNum = Number(estado);
      return estadosSolicitud.find(e => e.id === estadoNum)?.nombre || 'Desconocido';
    };

    const getEstadoClass = (estado) => {
      // Convertir a número si viene como string
      const estadoNum = Number(estado);
      
      switch (estadoNum) {
        case 5: return 'bg-yellow-100 text-yellow-800'; // Sin asignar
        case 6: return 'bg-blue-100 text-blue-800';    // Asignado
        case 7: return 'bg-green-100 text-green-800';  // Terminado
        case 8: return 'bg-red-100 text-red-800';      // Cancelado
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    const getUserName = (userId) => {
      if (!userId) return '-';
      
      // Buscar el usuario por ID
      const usuario = usuarios.value.find(u => u.id === userId);
      
      if (!usuario) return userId; // Si no se encuentra, mostrar el ID
      
      // Formatear el nombre completo
      const firstName = usuario.nombre || '';
      const lastName = usuario.apellido || '';
      return `${firstName} ${lastName}`.trim() || usuario.username || userId;
    };

    // Método para alternar la visibilidad de los filtros
    const toggleFilter = (filterName) => {
      activeFilter.value = activeFilter.value === filterName ? null : filterName;
    };

    // Método para aplicar filtros (actualizado)
    const applyFilters = () => {
      let filtered = [...tareas.value];
      
      // Filtrar por texto de búsqueda
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(tarea => 
          tarea.descripcion.toLowerCase().includes(query) || 
          String(tarea.id).includes(query) ||
          String(tarea.solicitud).toLowerCase().includes(query)
        );
      }
      
      // Filtrar por rango de fechas de creación
      if (dateFilters.value.startDate && dateFilters.value.endDate) {
        const startDate = new Date(dateFilters.value.startDate);
        const endDate = new Date(dateFilters.value.endDate);
        endDate.setHours(23, 59, 59); // Incluir todo el día final
        
        filtered = filtered.filter(tarea => {
          if (!tarea.fecha_creacion) return false;
          const fechaCreacion = new Date(tarea.fecha_creacion);
          return fechaCreacion >= startDate && fechaCreacion <= endDate;
        });
      }
      
      // Filtrar por rango de fechas programadas
      if (programadaFilters.value.startDate && programadaFilters.value.endDate) {
        const startDate = new Date(programadaFilters.value.startDate);
        const endDate = new Date(programadaFilters.value.endDate);
        endDate.setHours(23, 59, 59); // Incluir todo el día final
        
        filtered = filtered.filter(tarea => {
          if (!tarea.fecha_programada) return false;
          const fechaProgramada = new Date(tarea.fecha_programada);
          return fechaProgramada >= startDate && fechaProgramada <= endDate;
        });
      }
      
      // Filtrar por estado
      if (statusFilter.value) {
        filtered = filtered.filter(tarea => Number(tarea.estado) === Number(statusFilter.value));
      }
      
      // Filtrar por usuario
      if (userFilter.value) {
        filtered = filtered.filter(tarea => String(tarea.usuario_asignado) === String(userFilter.value));
      }
      
      // Filtrar por rango de fechas de inicio
      if (inicioFilters.value.startDate && inicioFilters.value.endDate) {
        const startDate = new Date(inicioFilters.value.startDate);
        const endDate = new Date(inicioFilters.value.endDate);
        endDate.setHours(23, 59, 59); // Incluir todo el día final
        
        filtered = filtered.filter(tarea => {
          if (!tarea.fecha_inicio) return false;
          const fechaInicio = new Date(tarea.fecha_inicio);
          return fechaInicio >= startDate && fechaInicio <= endDate;
        });
      }
      
      // Filtrar por rango de fechas de fin
      if (finFilters.value.startDate && finFilters.value.endDate) {
        const startDate = new Date(finFilters.value.startDate);
        const endDate = new Date(finFilters.value.endDate);
        endDate.setHours(23, 59, 59); // Incluir todo el día final
        
        filtered = filtered.filter(tarea => {
          if (!tarea.fecha_fin) return false;
          const fechaFin = new Date(tarea.fecha_fin);
          return fechaFin >= startDate && fechaFin <= endDate;
        });
      }
      
      filteredTareas.value = filtered;
    };
    
    const clearFilters = () => {
      searchQuery.value = '';
      dateFilters.value.startDate = '';
      dateFilters.value.endDate = '';
      programadaFilters.value.startDate = '';
      programadaFilters.value.endDate = '';
      statusFilter.value = '';
      userFilter.value = '';
      activeFilter.value = null;
      inicioFilters.value.startDate = '';
      inicioFilters.value.endDate = '';
      finFilters.value.startDate = '';
      finFilters.value.endDate = '';
      filteredTareas.value = [...tareas.value];
    };
    
    // Observar cambios en los filtros de fecha
    watch([() => dateFilters.value.startDate, () => dateFilters.value.endDate], () => {
      if (dateFilters.value.startDate && dateFilters.value.endDate) {
        applyFilters();
      }
    });

    onMounted(() => {
      fetchTareas();
      fetchSolicitudes();
      fetchUsuarios();
    });

    return {
      tareas,
      filteredTareas,
      solicitudes,
      usuarios,
      searchQuery,
      errorMessage,
      showModalCreate,
      showModalEdit,
      currentTarea,
      // Filtros
      dateFilters,
      programadaFilters,
      statusFilter,
      userFilter,
      activeFilter,
      toggleFilter,
      estadosSolicitud,
      // Métodos
      fetchTareas,
      filterTareas,
      applyFilters,
      clearFilters,
      createTarea,
      editTarea,
      updateTarea,
      deleteTarea,
      closeModal,
      formatDate,
      getEstadoLabel,
      getEstadoClass,
      getUserName,
      // Filtros adicionales
      inicioFilters,
      finFilters
    };
  }
}
</script>

<style scoped>
/* Asegurar que la tabla ocupe todo el espacio disponible */
.w-full {
  width: 100% !important;
}

/* Hacer que la tabla sea completamente responsiva */
@media (max-width: 1024px) {
  .overflow-x-auto {
    max-width: 100vw;
  }
}

/* Reducir altura de las filas */
tr {
  line-height: 1.2;
}
</style>