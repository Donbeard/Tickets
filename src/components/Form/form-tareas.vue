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
        </div>
      </div>

      <!-- Tabla de Tareas - Filas más delgadas -->
      <div class="bg-white rounded-lg shadow-sm w-full">
        <div class="w-full overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 mt-4">
            <thead class="bg-gray-50">
              <tr>
                <!-- Acciones -->
                <th scope="col" class="px-4 py-1 text-right text-xs font-medium text-Black uppercase tracking-wider">
                  <div class="flex justify-end items-center">
                    Acciones
                  </div>
                </th>
                <!-- ID -->
                <th scope="col" class="px-4 py-1 text-left text-xs font-medium text-Black uppercase tracking-wider">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center cursor-pointer" @click="sortTareas('id')">
                      ID
                      <span class="ml-1">
                        <svg v-if="getSortIcon('id') === 'asc'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                        </svg>
                        <svg v-else-if="getSortIcon('id') === 'desc'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </span>
                    </div>
                    <button @click="toggleFilter('id')" class="text-gray-500 hover:text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                    </button>
                  </div>
                  <div v-if="activeFilter === 'id'" class="mt-2 p-2 bg-white shadow rounded border absolute z-10 w-48">
                    <input
                      type="text"
                      v-model="idFilter"
                      @input="applyFilters"
                      placeholder="Filtrar por ID..."
                      class="block w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <div class="mt-2 flex justify-end">
                      <button @click="clearIdFilter" class="text-xs text-gray-600 hover:text-gray-800">Limpiar</button>
                    </div>
                  </div>
                </th>
                <!-- F. Programada -->
                <th scope="col" class="px-4 py-1 text-left text-xs font-medium text-Black uppercase tracking-wider">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center cursor-pointer" @click="sortTareas('fecha_programada')">
                      F. Programada
                      <span class="ml-1">
                        <svg v-if="getSortIcon('fecha_programada') === 'asc'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                        </svg>
                        <svg v-else-if="getSortIcon('fecha_programada') === 'desc'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </span>
                    </div>
                    <button @click.stop="toggleFilter('programada')" class="text-black hover:text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                    </button>
                  </div>
                  <div v-if="activeFilter === 'programada'" class="mt-2 p-2 bg-white shadow rounded border absolute z-10 w-48">
                    <div class="space-y-1">
                      <div v-for="(option, index) in dateOptions" :key="index" class="flex items-center">
                        <input 
                          type="radio" 
                          :id="`programada-${index}`" 
                          :value="option.value" 
                          v-model="programadaFilterOption"
                          @change="applyDateFilter('programada', option.value)"
                          class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <label :for="`programada-${index}`" class="ml-2 block text-sm text-gray-900">
                          {{ option.label }}
                        </label>
                      </div>
                      <div class="mt-2 pt-2 border-t border-gray-200">
                        <div class="text-sm font-medium text-gray-700 mb-1">Personalizado:</div>
                        <div class="space-y-2">
                          <input
                            type="date"
                            v-model="programadaFilters.startDate"
                            @change="programadaFilterOption = 'custom'; applyFilters()"
                            class="block w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Desde"
                          />
                          <input
                            type="date"
                            v-model="programadaFilters.endDate"
                            @change="programadaFilterOption = 'custom'; applyFilters()"
                            class="block w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Hasta"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="mt-2 flex justify-end">
                      <button @click="clearDateFilter('programada')" class="text-xs text-gray-600 hover:text-gray-800">Limpiar</button>
                    </div>
                  </div>
                </th>
                <!-- Columna de Descripción -->
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider w-64">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center cursor-pointer" @click="sortTareas('descripcion')">
                      Descripción
                      <span class="ml-1">
                        <svg v-if="getSortIcon('descripcion') === 'asc'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                        </svg>
                        <svg v-else-if="getSortIcon('descripcion') === 'desc'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </span>
                    </div>
                    <button @click.stop="toggleFilter('descripcion')" class="text-gray-500 hover:text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                    </button>
                  </div>
                  <!-- Filtro de descripción -->
                  <div v-if="activeFilter === 'descripcion'" class="mt-2 p-2 bg-white shadow rounded border absolute z-10" @click.stop>
                    <input 
                      type="text" 
                      v-model="searchQuery" 
                      @input="applyFilters"
                      placeholder="Buscar descripción..." 
                      class="w-full px-2 py-1 text-xs border rounded"
                    >
                    <div class="mt-2 flex justify-end">
                      <button @click="searchQuery = ''; applyFilters()" class="text-xs text-gray-600 hover:text-gray-800">Limpiar</button>
                    </div>
                  </div>
                </th>
                
                <!-- Solicitud -->
                <th scope="col" class="px-4 py-1 text-left text-xs font-medium text-Black uppercase tracking-wider cursor-pointer" @click="sortTareas('solicitud')">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      Solicitud
                      <span class="ml-1">
                        <svg v-if="getSortIcon('solicitud') === 'asc'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                        </svg>
                        <svg v-else-if="getSortIcon('solicitud') === 'desc'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </span>
                    </div>
                    <button @click.stop="toggleFilter('solicitud')" class="text-black hover:text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                    </button>
                  </div>
                  <div v-if="activeFilter === 'solicitud'" class="absolute bg-white shadow-md p-2 z-10 mt-1 rounded border" @click.stop>
                    <div class="mb-2">
                      <input 
                        type="text" 
                        v-model="solicitudSearchQuery" 
                        @input="applyFilters"
                        placeholder="Buscar solicitud..." 
                        class="w-full px-2 py-1 text-xs border rounded"
                      >
                    </div>
                    <div class="flex justify-end">
                      <button @click="clearSolicitudSearch" class="text-xs text-red-600 hover:text-red-800">Limpiar</button>
                    </div>
                  </div>
                </th>
                
                <!-- Estado -->
                <th scope="col" class="px-4 py-1 text-left text-xs font-medium text-Black uppercase tracking-wider">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center cursor-pointer" @click="sortTareas('estado')">
                      Estado
                      <span class="ml-1">
                        <svg v-if="getSortIcon('estado') === 'asc'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                        </svg>
                        <svg v-else-if="getSortIcon('estado') === 'desc'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </span>
                    </div>
                    <button @click.stop="toggleFilter('estado')" class="text-black hover:text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                    </button>
                  </div>
                  <div v-if="activeFilter === 'estado'" class="mt-2 p-2 bg-white shadow rounded border absolute z-10 w-64" @click.stop>
                    <div class="max-h-60 overflow-y-auto">
                      <div v-for="estado in estados" :key="estado.id" class="flex items-center mb-1">
                        <input 
                          type="checkbox" 
                          :id="`estado-${estado.id}`" 
                          :value="estado.id" 
                          v-model="estadoFilters"
                          @change="applyFilters"
                          class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label :for="`estado-${estado.id}`" class="ml-2 block text-sm text-gray-900">
                          {{ estado.nombre }}
                        </label>
                      </div>
                    </div>
                    <div class="mt-2 flex justify-between">
                      <button @click="selectAllEstados" class="text-xs text-indigo-600 hover:text-indigo-800">Seleccionar todos</button>
                      <button @click="clearEstadoFilters" class="text-xs text-gray-600 hover:text-gray-800">Limpiar</button>
                    </div>
                  </div>
                </th>
                
                <!-- Asignado a -->
                <th scope="col" class="px-4 py-1 text-left text-xs font-medium text-Black uppercase tracking-wider">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center cursor-pointer" @click="sortTareas('usuario_asignado')">
                      Asignado a
                      <span class="ml-1">
                        <svg v-if="getSortIcon('usuario_asignado') === 'asc'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                        </svg>
                        <svg v-else-if="getSortIcon('usuario_asignado') === 'desc'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </span>
                    </div>
                    <button @click.stop="toggleFilter('usuario_asignado')" class="text-black hover:text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                    </button>
                  </div>
                  <div v-if="activeFilter === 'usuario_asignado'" class="mt-2 p-2 bg-white shadow rounded border absolute z-10 w-64" @click.stop>
                    <div class="max-h-60 overflow-y-auto">
                      <div v-for="usuario in getUsuariosAsignados" :key="usuario.id" class="flex items-center mb-1">
                        <input 
                          type="checkbox" 
                          :id="`usuario-asignado-${usuario.id}`" 
                          :value="usuario.id" 
                          v-model="usuarioAsignadoFilters"
                          @change="applyFilters"
                          class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label :for="`usuario-asignado-${usuario.id}`" class="ml-2 block text-sm text-gray-900">
                          {{ usuario.nombre }} {{ usuario.apellido }}
                        </label>
                      </div>
                    </div>
                    <div class="mt-2 flex justify-between">
                      <button @click="selectAllUsuariosAsignados" class="text-xs text-indigo-600 hover:text-indigo-800">Seleccionar todos</button>
                      <button @click="clearUsuarioAsignadoFilters" class="text-xs text-gray-600 hover:text-gray-800">Limpiar</button>
                    </div>
                  </div>
                </th>
                
                <!-- Reasignado a -->
                <th scope="col" class="px-4 py-1 text-left text-xs font-medium text-Black uppercase tracking-wider">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center cursor-pointer" @click="sortTareas('usuario_reasignado')">
                      Reasignado a
                      <span class="ml-1">
                        <svg v-if="getSortIcon('usuario_reasignado') === 'asc'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                        </svg>
                        <svg v-else-if="getSortIcon('usuario_reasignado') === 'desc'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </span>
                    </div>
                    <button @click.stop="toggleFilter('usuario_reasignado')" class="text-black hover:text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                    </button>
                  </div>
                  <div v-if="activeFilter === 'usuario_reasignado'" class="mt-2 p-2 bg-white shadow rounded border absolute z-10 w-64" @click.stop>
                    <div class="max-h-60 overflow-y-auto">
                      <div v-for="usuario in getUsuariosReasignados" :key="usuario.id" class="flex items-center mb-1">
                        <input 
                          type="checkbox" 
                          :id="`usuario-reasignado-${usuario.id}`" 
                          :value="usuario.id" 
                          v-model="usuarioReasignadoFilters"
                          @change="applyFilters"
                          class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label :for="`usuario-reasignado-${usuario.id}`" class="ml-2 block text-sm text-gray-900">
                          {{ usuario.nombre }} {{ usuario.apellido }}
                        </label>
                      </div>
                    </div>
                    <div class="mt-2 flex justify-between">
                      <button @click="selectAllUsuariosReasignados" class="text-xs text-indigo-600 hover:text-indigo-800">Seleccionar todos</button>
                      <button @click="clearUsuarioReasignadoFilters" class="text-xs text-gray-600 hover:text-gray-800">Limpiar</button>
                    </div>
                  </div>
                </th>
                
                
                
                <!-- F. Inicio -->
                <th scope="col" class="px-4 py-1 text-left text-xs font-medium text-Black uppercase tracking-wider">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center cursor-pointer" @click="sortTareas('fecha_inicio')">
                      F. Inicio
                      <span class="ml-1">
                        <svg v-if="getSortIcon('fecha_inicio') === 'asc'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                        </svg>
                        <svg v-else-if="getSortIcon('fecha_inicio') === 'desc'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </span>
                    </div>
                    <button @click.stop="toggleFilter('inicio')" class="text-black hover:text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                    </button>
                  </div>
                  <div v-if="activeFilter === 'inicio'" class="mt-2 p-2 bg-white shadow rounded border absolute z-10 w-48">
                    <div class="space-y-1">
                      <div v-for="(option, index) in dateOptions" :key="index" class="flex items-center">
                        <input 
                          type="radio" 
                          :id="`inicio-${index}`" 
                          :value="option.value" 
                          v-model="inicioFilterOption"
                          @change="applyDateFilter('inicio', option.value)"
                          class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <label :for="`inicio-${index}`" class="ml-2 block text-sm text-gray-900">
                          {{ option.label }}
                        </label>
                      </div>
                      <div class="mt-2 pt-2 border-t border-gray-200">
                        <div class="text-sm font-medium text-gray-700 mb-1">Personalizado:</div>
                        <div class="space-y-2">
                          <input
                            type="date"
                            v-model="inicioFilters.startDate"
                            @change="inicioFilterOption = 'custom'; applyFilters()"
                            class="block w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Desde"
                          />
                          <input
                            type="date"
                            v-model="inicioFilters.endDate"
                            @change="inicioFilterOption = 'custom'; applyFilters()"
                            class="block w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Hasta"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="mt-2 flex justify-end">
                      <button @click="clearDateFilter('inicio')" class="text-xs text-gray-600 hover:text-gray-800">Limpiar</button>
                    </div>
                  </div>
                </th>
                
                <!-- F. Fin -->
                <th scope="col" class="px-4 py-1 text-left text-xs font-medium text-Black uppercase tracking-wider">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center cursor-pointer" @click="sortTareas('fecha_fin')">
                      F. Fin
                      <span class="ml-1">
                        <svg v-if="getSortIcon('fecha_fin') === 'asc'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                        </svg>
                        <svg v-else-if="getSortIcon('fecha_fin') === 'desc'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </span>
                    </div>
                    <button @click.stop="toggleFilter('fin')" class="text-black hover:text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                    </button>
                  </div>
                  <div v-if="activeFilter === 'fin'" class="mt-2 p-2 bg-white shadow rounded border absolute z-10 w-48">
                    <div class="space-y-1">
                      <div v-for="(option, index) in dateOptions" :key="index" class="flex items-center">
                        <input 
                          type="radio" 
                          :id="`fin-${index}`" 
                          :value="option.value" 
                          v-model="finFilterOption"
                          @change="applyDateFilter('fin', option.value)"
                          class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <label :for="`fin-${index}`" class="ml-2 block text-sm text-gray-900">
                          {{ option.label }}
                        </label>
                      </div>
                      <div class="mt-2 pt-2 border-t border-gray-200">
                        <div class="text-sm font-medium text-gray-700 mb-1">Personalizado:</div>
                        <div class="space-y-2">
                          <input
                            type="date"
                            v-model="finFilters.startDate"
                            @change="finFilterOption = 'custom'; applyFilters()"
                            class="block w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Desde"
                          />
                          <input
                            type="date"
                            v-model="finFilters.endDate"
                            @change="finFilterOption = 'custom'; applyFilters()"
                            class="block w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Hasta"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="mt-2 flex justify-end">
                      <button @click="clearDateFilter('fin')" class="text-xs text-gray-600 hover:text-gray-800">Limpiar</button>
                    </div>
                  </div>
                </th>
                
                <!-- Empresa -->
                <th scope="col" class="px-4 py-1 text-left text-xs font-medium text-Black uppercase tracking-wider">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center cursor-pointer" @click="sortTareas('empresa')">
                      Empresa
                      <span class="ml-1">
                        <svg v-if="getSortIcon('empresa') === 'asc'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                        </svg>
                        <svg v-else-if="getSortIcon('empresa') === 'desc'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </span>
                    </div>
                    <button @click.stop="toggleFilter('empresa')" class="text-black hover:text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                    </button>
                  </div>
                  <div v-if="activeFilter === 'empresa'" class="mt-2 p-2 bg-white shadow rounded border absolute z-10 w-64" @click.stop>
                    <div class="mb-2">
                      <input 
                        type="text" 
                        v-model="empresaSearchQuery" 
                        @input="filterEmpresas"
                        placeholder="Buscar empresa..." 
                        class="w-full px-2 py-1 text-xs border rounded"
                      >
                    </div>
                    <div class="max-h-60 overflow-y-auto">
                      <div v-for="empresa in filteredEmpresas" :key="empresa.id" class="flex items-center mb-1">
                        <input 
                          type="checkbox" 
                          :id="`empresa-${empresa.id}`" 
                          :value="empresa.id" 
                          v-model="empresaFilters"
                          @change="applyFilters"
                          class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label :for="`empresa-${empresa.id}`" class="ml-2 block text-sm text-gray-900">
                          {{ empresa.nombre }}
                        </label>
                      </div>
                    </div>
                    <div class="mt-2 flex justify-between">
                      <button @click="selectAllEmpresas" class="text-xs text-indigo-600 hover:text-indigo-800">Seleccionar todos</button>
                      <button @click="clearEmpresaFilters" class="text-xs text-gray-600 hover:text-gray-800">Limpiar</button>
                    </div>
                  </div>
                </th>
                
                
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr 
                v-for="(tarea, index) in paginatedTareas" 
                :key="tarea.id" 
                :class="[
                  'hover:bg-gray-50', 
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                ]"
              >
                <!-- Acciones -->
                <td class="px-3 py-2 whitespace-nowrap text-right text-xs font-medium">
                  <div class="flex justify-end space-x-2">
                    <button 
                      @click="openEditModal(tarea)" 
                      class="text-indigo-600 hover:text-indigo-900"
                      title="Editar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      @click="deleteTarea(tarea.id)" 
                      class="text-red-600 hover:text-red-900"
                      title="Eliminar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <button 
                      @click="createRelatedTarea(tarea)" 
                      class="text-green-600 hover:text-green-900"
                      title="Crear tarea relacionada"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                </td>
                <!-- ID -->
                <td class="px-3 py-2 whitespace-nowrap text-xs text-black">
                  {{ tarea.id }}
                </td>
                <!-- F. Programada -->
                <td class="px-3 py-2 whitespace-nowrap text-xs text-text-black">
                  {{ formatDate(tarea.fecha_programada) }}
                </td>
                <!-- Celda de Descripción -->
                <td class="px-3 py-3 text-xs w-64">
                  <div 
                    class="truncate max-w-xs" 
                    :title="tarea.descripcion || '-'"
                  >
                    {{ tarea.descripcion || '-' }}
                  </div>
                </td>
                
                <!-- Solicitud -->
                <td class="px-3 py-2 whitespace-nowrap text-xs text-black">
                  {{ tarea.solicitud }} - {{ getSolicitudTitulo(tarea.solicitud) }}
                </td>
                
                <!-- Estado -->
                <td class="px-3 py-2 whitespace-nowrap text-xs">
                  <span :class="['px-2 py-0.5 rounded-full text-xs font-medium', getEstadoClass(tarea.estado)]">
                    {{ getEstadoLabel(tarea.estado) }}
                  </span>
                </td>
                
                <!-- Asignado a -->
                <td class="px-3 py-2 whitespace-nowrap text-xs text-black">
                  {{ getUserName(tarea.usuario_asignado) }}
                </td>
                
                <!-- Reasignado a -->
                <td class="px-3 py-2 whitespace-nowrap text-xs text-black">
                  {{ tarea.usuario_reasignado ? getUserName(tarea.usuario_reasignado) : '-' }}
                </td>
                
                
                
                <!-- F. Inicio -->
                <td class="px-3 py-2 whitespace-nowrap text-xs text-black">
                  {{ formatDate(tarea.fecha_inicio) }}
                </td>
                
                <!-- F. Fin -->
                <td class="px-3 py-2 whitespace-nowrap text-xs text-black">
                  {{ formatDate(tarea.fecha_fin) }}
                </td>
                
                <!-- Empresa -->
                <td class="px-4 py-2 whitespace-nowrap text-sm text-black">
                  {{ getEmpresaNombre(tarea.solicitud) }}
                </td>
                
                
              </tr>
              
              <!-- Mensaje cuando no hay tareas -->
              <tr v-if="filteredTareas.length === 0">
                <td colspan="9" class="px-3 py-3 text-center text-xs text-gray-500">
                  No se encontraron tareas con los filtros aplicados.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Agregar después de la tabla -->
    <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div class="flex-1 flex justify-between sm:hidden">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          :class="[
            'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white',
            currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
          ]"
        >
          Anterior
        </button>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          :class="[
            'ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white',
            currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
          ]"
        >
          Siguiente
        </button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Mostrando <span class="font-medium">{{ startItem }}</span> a <span class="font-medium">{{ endItem }}</span> de <span class="font-medium">{{ filteredTareas.length }}</span> resultados
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              @click="firstPage"
              :disabled="currentPage === 1"
              :class="[
                'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500',
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
              ]"
            >
              <span class="sr-only">Primera página</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              :class="[
                'relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500',
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
              ]"
            >
              <span class="sr-only">Anterior</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <!-- Botones de página -->
            <template v-for="page in displayedPages" :key="page">
              <button
                v-if="page !== '...'"
                @click="goToPage(page)"
                :class="[
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                  currentPage === page
                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                ]"
              >
                {{ page }}
              </button>
              <span
                v-else
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
              >
                ...
              </span>
            </template>
            
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              :class="[
                'relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500',
                currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
              ]"
            >
              <span class="sr-only">Siguiente</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
            <button
              @click="lastPage"
              :disabled="currentPage === totalPages"
              :class="[
                'relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500',
                currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
              ]"
            >
              <span class="sr-only">Última página</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </nav>
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
                <!-- Campo Solicitud (solo lectura) -->
                <div class="flex items-center">
                  <label class="block text-sm font-medium text-gray-700 w-1/4">
                    Solicitud:
                  </label>
                  <div class="block w-3/4 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm">
                    {{ currentTarea.solicitud }}
                  </div>
                </div>

                <!-- Campo Descripción (ancho completo) -->
                <div class="flex items-start">
                  <label for="descripcion" class="block text-sm font-medium text-gray-700 w-1/4 pt-2">
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
                
                <!-- Campos en dos columnas -->
                <div class="grid grid-cols-2 gap-4">
                  <!-- Columna 1: Estado -->
                  <div class="flex items-center">
                    <label for="estado" class="block text-sm font-medium text-gray-700 w-1/3">
                      Estado:
                    </label>
                    <select
                      id="estado"
                      v-model="currentTarea.estado"
                      class="block w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm"
                    >
                      <option value="" disabled>Seleccione</option>
                      <option v-for="estado in estados" 
                              :key="estado.id" 
                              :value="estado.id">
                        {{ estado.nombre }}
                      </option>
                    </select>
                  </div>
                  
                  <!-- Columna 2: Usuario Asignado (solo usuarios tipo S) -->
                  <div class="flex items-center">
                    <label for="usuario_asignado" class="block text-sm font-medium text-gray-700 w-1/3">
                      Asignado a:
                    </label>
                    <select
                      id="usuario_asignado"
                      v-model="currentTarea.usuario_asignado"
                      class="block w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm"
                    >
                      <option value="">Sin asignar</option>
                      <option v-for="usuario in usuariosSoporte" 
                              :key="usuario.id" 
                              :value="usuario.id">
                        {{ usuario.nombre }} {{ usuario.apellido }}
                      </option>
                    </select>
                  </div>
                </div>
                
                <!-- Campo Motivo Cancelación (mostrar solo si estado es cancelado) -->
                <div v-if="currentTarea.estado == 4" class="flex items-center">
                  <label for="motivo_cancelacion" class="block text-sm font-medium text-gray-700 w-1/4">
                    Motivo:
                  </label>
                  <textarea
                    id="motivo_cancelacion"
                    v-model="currentTarea.motivo_cancelacion"
                    rows="2"
                    class="block w-3/4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm"
                    placeholder="Motivo de cancelación"
                  ></textarea>
                </div>
                
                <!-- Fecha Programada (formato 24h) -->
                <div class="flex items-center">
                  <label for="fecha_programada" class="block text-sm font-medium text-gray-700 w-1/4">
                    F. Programada:
                  </label>
                  <input
                    type="datetime-local"
                    id="fecha_programada"
                    v-model="currentTarea.fecha_programada"
                    class="block w-3/4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm"
                  />
                </div>
                
                <!-- Fecha Inicio con botón para hora actual -->
                <div class="flex items-center">
                  <label for="fecha_inicio" class="block text-sm font-medium text-gray-700 w-1/4">
                    F. Inicio:
                  </label>
                  <div class="flex w-3/4 space-x-1">
                    <input
                      type="datetime-local"
                      id="fecha_inicio"
                      v-model="currentTarea.fecha_inicio"
                      class="block flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm"
                    />
                    <button 
                      type="button"
                      @click="setCurrentDateTime('inicio')"
                      class="px-2 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200"
                      title="Establecer hora actual"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <!-- Fecha Fin con botón para hora actual (solo en edición) -->
                <div v-if="!showModalCreate" class="flex items-center">
                  <label for="fecha_fin" class="block text-sm font-medium text-gray-700 w-1/4">
                    F. Fin:
                  </label>
                  <div class="flex w-3/4 space-x-1">
                    <input
                      type="datetime-local"
                      id="fecha_fin"
                      v-model="currentTarea.fecha_fin"
                      @change="calcularDuracion"
                      class="block flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm"
                    />
                    <button 
                      type="button"
                      @click="setCurrentDateTime('fin')"
                      class="px-2 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200"
                      title="Establecer hora actual"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <!-- Campos solo para edición, no para creación -->
                <div v-if="showModalEdit">
                  <!-- Campos en dos columnas para edición -->
                  <div class="grid grid-cols-2 gap-4">
                    <!-- Duración (calculada automáticamente) -->
                    <div class="flex items-center">
                      <label for="duracion" class="block text-sm font-medium text-gray-700 w-1/3">
                        Duración:
                      </label>
                      <input
                        type="text"
                        id="duracion"
                        v-model="currentTarea.duracion"
                        readonly
                        class="block w-2/3 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm"
                        placeholder="Auto"
                      />
                    </div>

                    <!-- Tiempo Facturable (solo en edición) -->
                    <div class="flex items-center">
                      <label for="tiempoFacturable" class="block text-sm font-medium text-gray-700 w-1/3">
                        T. Facturable:
                      </label>
                      <input
                        type="text"
                        id="tiempoFacturable"
                        v-model="currentTarea.tiempoFacturable"
                        placeholder="Ej: 2h"
                        class="block w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm"
                      />
                    </div>
                  </div>
                  
                  <!-- Usuario Reasignado (solo en edición) -->
                  <div class="flex items-center mt-4">
                    <label for="usuario_reasignado" class="block text-sm font-medium text-gray-700 w-1/4">
                      Reasignado a:
                    </label>
                    <select
                      id="usuario_reasignado"
                      v-model="currentTarea.usuario_reasignado"
                      class="block w-3/4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm"
                    >
                      <option value="">Sin reasignar</option>
                      <option v-for="usuario in usuariosSoporte" 
                              :key="usuario.id" 
                              :value="usuario.id">
                        {{ usuario.nombre }} {{ usuario.apellido }}
                      </option>
                    </select>
                  </div>
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
import { ref, onMounted, watch, computed } from 'vue';
import apiClient from '@/apiClient'

export default {
  name: 'FormTareas',
  
  emits: ['showMessage'],
  
  setup(props, { emit }) {
    const reasignadoFilter = ref(''); 
    const empresaFilter = ref('');
    const tareas = ref([]);
    const solicitudes = ref([]);
    const usuarios = ref([]);
    const estados = ref([]);
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
      estado: '',
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

    // Variables para ordenamiento
    const sortColumn = ref('fecha_programada');
    const sortDirection = ref('desc');
    
    const fetchTareas = async () => {
      try {
        const response = await apiClient.get('/tareas/');
        tareas.value = response.data;
        filteredTareas.value = [...tareas.value];
        
        // Aplicar ordenamiento por defecto (fecha programada descendente)
        sortColumn.value = 'fecha_programada';
        sortDirection.value = 'desc';
        sortFilteredTareas();
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
    
    const fetchEstados = async () => {
      try {
        const response = await apiClient.get('/estados/');
        estados.value = response.data;
      } catch (error) {
        console.error('Error al obtener estados:', error);
      }
    };

    const filterTareas = () => {
      applyFilters();
    };

    const createTarea = async () => {
      try {
        // Verificar que los campos requeridos estén completos
        if (!currentTarea.value.descripcion || !currentTarea.value.solicitud) {
          errorMessage.value = 'Por favor complete los campos requeridos';
          return;
        }

        // Asegurarse de que el estado tenga un valor válido
        if (!currentTarea.value.estado) {
          currentTarea.value.estado = 1; // Asignar estado por defecto (pendiente)
        }

        // Preparar los datos para enviar al servidor
        const tareaData = {
          descripcion: currentTarea.value.descripcion,
          solicitud: currentTarea.value.solicitud,
          estado: currentTarea.value.estado,
          usuario_asignado: currentTarea.value.usuario_asignado || null,
          fecha_programada: currentTarea.value.fecha_programada || null,
          fecha_inicio: currentTarea.value.fecha_inicio || null,
          fecha_fin: currentTarea.value.fecha_fin || null,
          motivo_cancelacion: currentTarea.value.motivo_cancelacion || null
        };

        // Verificar token de autenticación
        const token = localStorage.getItem('token');
        if (!token) {
          errorMessage.value = 'No hay sesión activa. Por favor inicie sesión nuevamente.';
          return;
        }

        console.log('Enviando datos de tarea:', tareaData);

        // Enviar solicitud al servidor con el token de autenticación
        const response = await apiClient.post('/tareas/', tareaData, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Respuesta del servidor:', response.data);

        // Agregar la nueva tarea a la lista
        tareas.value.push(response.data);
        
        // Cerrar el modal y limpiar el formulario
        showModalCreate.value = false;
        currentTarea.value = { solicitud: '' };
        errorMessage.value = '';
        
        // Mostrar mensaje de éxito
        emit('showMessage', {
          type: 'success',
          text: 'Tarea creada exitosamente'
        });
        
        // Recargar las tareas para actualizar la lista
        fetchTareas();
      } catch (error) {
        console.error('Error al crear tarea:', error);
        
        // Mostrar mensaje de error específico si está disponible
        if (error.response && error.response.data) {
          errorMessage.value = `Error: ${JSON.stringify(error.response.data)}`;
        } else {
          errorMessage.value = `Error al crear la tarea: ${error.message}`;
        }
      }
    };

    const editTarea = async (id) => {
      try {
        const response = await apiClient.get(`/tareas/${id}/`);
        currentTarea.value = response.data;
        showModalEdit.value = true;
      } catch (error) {
        console.error('Error al obtener detalles de tarea:', error);
        errorMessage.value = 'Error al cargar los detalles de la tarea. Por favor, intente de nuevo.';
      }
    };

    const updateTarea = async () => {
      try {
        // Verificar que los campos requeridos estén completos
        if (!currentTarea.value.descripcion) {
          errorMessage.value = 'Por favor complete la descripción';
          return;
        }

        // Verificar token de autenticación
        const token = localStorage.getItem('token');
        if (!token) {
          errorMessage.value = 'No hay sesión activa. Por favor inicie sesión nuevamente.';
          return;
        }

        // Preparar los datos para enviar al servidor
        const tareaData = {
          descripcion: currentTarea.value.descripcion,
          estado: currentTarea.value.estado,
          usuario_asignado: currentTarea.value.usuario_asignado || null,
          fecha_programada: currentTarea.value.fecha_programada || null,
          fecha_inicio: currentTarea.value.fecha_inicio || null,
          fecha_fin: currentTarea.value.fecha_fin || null,
          duracion: currentTarea.value.duracion || null,
          tiempoFacturable: currentTarea.value.tiempoFacturable || null,
          usuario_reasignado: currentTarea.value.usuario_reasignado || null,
          motivo_cancelacion: currentTarea.value.motivo_cancelacion || null
        };

        console.log('Actualizando tarea:', tareaData);

        // Enviar solicitud al servidor con el token de autenticación
        const response = await apiClient.put(`/tareas/${currentTarea.value.id}/`, tareaData, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Respuesta del servidor:', response.data);

        // Actualizar la tarea en la lista
        const index = tareas.value.findIndex(t => t.id === currentTarea.value.id);
        if (index !== -1) {
          tareas.value[index] = response.data;
        }
        
        // Cerrar el modal y limpiar el formulario
        showModalEdit.value = false;
        currentTarea.value = { solicitud: '' };
        errorMessage.value = '';
        
        // Mostrar mensaje de éxito
        emit('showMessage', {
          type: 'success',
          text: 'Tarea actualizada exitosamente'
        });
        
        // Recargar las tareas para actualizar la lista
        fetchTareas();
      } catch (error) {
        console.error('Error al actualizar tarea:', error);
        
        // Mostrar mensaje de error específico si está disponible
        if (error.response && error.response.data) {
          errorMessage.value = `Error: ${JSON.stringify(error.response.data)}`;
        } else {
          errorMessage.value = `Error al actualizar la tarea: ${error.message}`;
        }
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
        estado: '',
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

    // Función para formatear fechas
    const formatDate = (dateString) => {
      if (!dateString) return '-';
      
      // Crear un objeto Date a partir de la cadena de fecha
      const date = new Date(dateString);
      
      // Formatear la fecha como DD/MM/YYYY
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() devuelve 0-11
      const year = date.getFullYear();
      
      return `${day}/${month}/${year}`;
    };

    const getEstadoLabel = (estadoId) => {
      const estado = estados.value.find(e => e.id === estadoId);
      return estado ? estado.nombre : 'Desconocido';
    };

    const getEstadoClass = (estadoId) => {
      const estado = estados.value.find(e => e.id === estadoId);
      if (!estado) return 'bg-gray-100 text-gray-800';
      
      // Mapeo de IDs a clases de colores
      // Ajusta estos IDs según los valores reales en tu base de datos
      switch (estado.id) {
        case 5: return 'bg-yellow-100 text-yellow-800'; // Sin asignar
        case 6: return 'bg-blue-100 text-blue-800';     // Asignado
        case 7: return 'bg-green-100 text-green-800';   // Terminado
        case 8: return 'bg-red-100 text-red-800';       // Cancelado
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

    const toggleFilter = (filterName) => {
      activeFilter.value = activeFilter.value === filterName ? null : filterName;
    };

    const applyFilters = () => {
      console.log('Aplicando todos los filtros con valores:');
      console.log('- searchQuery:', searchQuery.value);
      console.log('- solicitudFilters:', solicitudFilters.value);
      console.log('- estadoFilters:', estadoFilters.value);
      console.log('- usuarioAsignadoFilters:', usuarioAsignadoFilters.value);
      console.log('- usuarioReasignadoFilters:', usuarioReasignadoFilters.value);
      console.log('- empresaFilters:', empresaFilters.value);
      
      // Comenzar con todas las tareas
      let result = [...tareas.value];
      console.log(`Total de tareas iniciales: ${result.length}`);
      
      // Filtro de búsqueda (descripción, ID, solicitud)
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(tarea => 
          (tarea.descripcion && tarea.descripcion.toLowerCase().includes(query)) || 
          (tarea.id && String(tarea.id).includes(query)) ||
          (tarea.solicitud && String(tarea.solicitud).toLowerCase().includes(query))
        );
        console.log(`Después del filtro de búsqueda: ${result.length} tareas`);
      }
      
      // Filtro de solicitud (múltiple) - CORREGIDO
      if (solicitudFilters.value && solicitudFilters.value.length > 0) {
        console.log('Aplicando filtro de solicitud con valores:', solicitudFilters.value);
        
        // Convertir los IDs de solicitud a números para comparación
        const solicitudIds = solicitudFilters.value.map(id => Number(id));
        
        result = result.filter(tarea => {
          // Asegurarse de que tarea.solicitud sea un número
          const solicitudId = typeof tarea.solicitud === 'object' ? 
            Number(tarea.solicitud.id) : Number(tarea.solicitud);
          
          return solicitudIds.includes(solicitudId);
        });
        
        console.log(`Después del filtro de solicitud: ${result.length} tareas`);
      }
      
      // Filtro de estado (múltiple)
      if (estadoFilters.value && estadoFilters.value.length > 0) {
        result = result.filter(tarea => 
          tarea.estado && estadoFilters.value.includes(tarea.estado)
        );
        console.log(`Después del filtro de estado: ${result.length} tareas`);
      }
      
      // Filtro de usuario asignado (múltiple)
      if (usuarioAsignadoFilters.value && usuarioAsignadoFilters.value.length > 0) {
        result = result.filter(tarea => 
          tarea.usuario_asignado && usuarioAsignadoFilters.value.includes(tarea.usuario_asignado)
        );
        console.log(`Después del filtro de usuario asignado: ${result.length} tareas`);
      }
      
      // Filtro de usuario reasignado (múltiple)
      if (usuarioReasignadoFilters.value && usuarioReasignadoFilters.value.length > 0) {
        result = result.filter(tarea => 
          tarea.usuario_reasignado && usuarioReasignadoFilters.value.includes(tarea.usuario_reasignado)
        );
        console.log(`Después del filtro de usuario reasignado: ${result.length} tareas`);
      }
      
      // Filtro de empresa (múltiple) - CORREGIDO
      if (empresaFilters.value && empresaFilters.value.length > 0) {
        console.log('Aplicando filtro de empresa con valores:', empresaFilters.value);
        
        // Primero, obtener los IDs de terceros que corresponden a los nombres seleccionados
        const terceroIds = [];
        for (const empresaNombre of empresaFilters.value) {
          const tercero = terceros.value.find(t => t.nombre === empresaNombre);
          if (tercero) {
            terceroIds.push(tercero.id);
            console.log(`Empresa ${empresaNombre} corresponde al tercero ID ${tercero.id}`);
          }
        }
        
        console.log('IDs de terceros a filtrar:', terceroIds);
        
        if (terceroIds.length > 0) {
          result = result.filter(tarea => {
            if (!tarea.solicitud) return false;
            
            // Obtener la solicitud asociada a la tarea
            const solicitud = solicitudes.value.find(s => s.id === tarea.solicitud);
            if (!solicitud || !solicitud.usuario_cliente) {
              return false;
            }
            
            // Obtener el ID del usuario cliente
            const usuarioClienteId = solicitud.usuario_cliente;
            
            // Buscar en usuariosTerceros las relaciones para este usuario
            for (const ut of usuariosTerceros.value) {
              // Verificar si esta relación corresponde al usuario cliente
              const utUsuarioId = typeof ut.usuario === 'object' ? ut.usuario.id : ut.usuario;
              if (utUsuarioId !== usuarioClienteId) continue;
              
              // Obtener el ID del tercero
              const terceroId = typeof ut.tercero === 'object' ? ut.tercero.id : ut.tercero;
              
              // Verificar si este tercero está en los filtros seleccionados
              if (terceroIds.includes(terceroId)) {
                return true;
              }
            }
            
            return false;
          });
        }
        
        console.log(`Después del filtro de empresa: ${result.length} tareas`);
      }
      
      // Filtros de fecha (mantener como está porque funciona)
      result = result.filter(tarea => {
        return checkDateFilter(tarea, 'programada') && 
               checkDateFilter(tarea, 'inicio') && 
               checkDateFilter(tarea, 'fin');
      });
      console.log(`Después de los filtros de fecha: ${result.length} tareas`);
      
      // Actualizar filteredTareas con el resultado final
      filteredTareas.value = result;
      
      // Aplicar ordenamiento
      sortFilteredTareas();
    };

    const clearFilters = () => {
      searchQuery.value = '';
      dateFilters.value.startDate = '';
      dateFilters.value.endDate = '';
      programadaFilters.value.startDate = '';
      programadaFilters.value.endDate = '';
      inicioFilters.value.startDate = '';
      inicioFilters.value.endDate = '';
      finFilters.value.startDate = '';
      finFilters.value.endDate = '';
      statusFilter.value = '';
      userFilter.value = '';
      activeFilter.value = null;
      filteredTareas.value = [...tareas.value];
      
      // Aplicar ordenamiento después de limpiar filtros
      sortFilteredTareas();
    };
    
    // Observar cambios en los filtros y la búsqueda para aplicar filtros automáticamente
    watch([searchQuery, dateFilters, programadaFilters, statusFilter, userFilter, inicioFilters, finFilters], 
      () => {
        applyFilters();
      }, 
      { deep: true }
    );

    const createRelatedTarea = (tarea) => {
      currentTarea.value = {
        descripcion: '',
        solicitud: tarea.solicitud,
        estado: '',
        motivo_cancelacion: '',
        fecha_programada: '',
        fecha_inicio: '',
        fecha_fin: '',
        duracion: '',
        tiempoFacturable: '',
        usuario_asignado: '',
        usuario_reasignado: ''
      };
      
      const estadoPendiente = estados.value.find(e => e.codigo === 'PEND' || e.nombre.toLowerCase().includes('pendiente'));
      if (estadoPendiente) {
        currentTarea.value.estado = estadoPendiente.id;
      }
      
      showModalCreate.value = true;
    };

    const openCreateModal = () => {
      // Resetear el formulario
      currentTarea.value = {
        descripcion: '',
        solicitud: '',
        estado: '',
        motivo_cancelacion: '',
        fecha_programada: '',
        fecha_inicio: '',
        fecha_fin: '',
        duracion: '',
        tiempoFacturable: '',
        usuario_asignado: '',
        usuario_reasignado: ''
      };
      
      // Establecer estado inicial (por ejemplo, "Pendiente")
      const estadoPendiente = estados.value.find(e => e.codigo === 'PEND' || e.nombre.toLowerCase().includes('pendiente'));
      if (estadoPendiente) {
        currentTarea.value.estado = estadoPendiente.id;
      }
      
      // Abrir el modal de creación
      showModalCreate.value = true;
    };

    // Función para obtener el título de la solicitud
    const getSolicitudTitulo = (solicitudId) => {
      if (!solicitudId) return '';
      
      const solicitud = solicitudes.value.find(s => s.id === solicitudId);
      return solicitud ? solicitud.titulo : '';
    };

    // Filtrar usuarios de soporte (tipo "S")
    const usuariosSoporte = computed(() => {
      return usuarios.value.filter(usuario => usuario.tipo === 'S');
    });

    // Función para establecer la fecha y hora actual en un campo (formato 24h)
    const setCurrentDateTime = (campo) => {
      const now = new Date();
      
      // Formato YYYY-MM-DDThh:mm en 24 horas
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0'); // 24 horas
      const minutes = String(now.getMinutes()).padStart(2, '0');
      
      const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
      
      if (campo === 'inicio') {
        currentTarea.value.fecha_inicio = formattedDate;
      } else if (campo === 'fin') {
        currentTarea.value.fecha_fin = formattedDate;
        // Calcular duración automáticamente cuando se establece la fecha fin
        calcularDuracion();
      }
    };

    // Función para calcular la duración entre fecha_inicio y fecha_fin
    const calcularDuracion = () => {
      if (currentTarea.value.fecha_inicio && currentTarea.value.fecha_fin) {
        const inicio = new Date(currentTarea.value.fecha_inicio);
        const fin = new Date(currentTarea.value.fecha_fin);
        
        // Verificar que las fechas sean válidas y que fin sea posterior a inicio
        if (isNaN(inicio.getTime()) || isNaN(fin.getTime()) || fin <= inicio) {
          currentTarea.value.duracion = '';
          return;
        }
        
        // Calcular diferencia en milisegundos
        const diff = fin.getTime() - inicio.getTime();
        
        // Convertir a horas y minutos
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        // Formatear resultado
        currentTarea.value.duracion = `${hours}h ${minutes}m`;
      }
    };

    // Función para ordenar las tareas
    const sortTareas = (column) => {
      if (sortColumn.value === column) {
        // Si ya estamos ordenando por esta columna, cambiamos la dirección
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
      } else {
        // Si es una nueva columna, establecemos la columna y dirección por defecto
        sortColumn.value = column;
        sortDirection.value = 'asc';
      }
      
      // Ordenar las tareas filtradas
      sortFilteredTareas();
    };
    
    // Función para obtener el ícono de ordenamiento
    const getSortIcon = (column) => {
      if (sortColumn.value !== column) return 'none';
      return sortDirection.value === 'asc' ? 'asc' : 'desc';
    };
    
    // Función para ordenar las tareas filtradas
    const sortFilteredTareas = () => {
      if (!filteredTareas.value || !sortColumn.value) return;
      
      filteredTareas.value.sort((a, b) => {
        let valueA, valueB;
        
        // Obtener los valores a comparar según la columna
        switch (sortColumn.value) {
          case 'id':
            valueA = a.id;
            valueB = b.id;
            break;
          case 'descripcion':
            valueA = a.descripcion ? a.descripcion.toLowerCase() : '';
            valueB = b.descripcion ? b.descripcion.toLowerCase() : '';
            break;
          case 'solicitud':
            valueA = a.solicitud;
            valueB = b.solicitud;
            break;
          case 'estado':
            valueA = getEstadoLabel(a.estado).toLowerCase();
            valueB = getEstadoLabel(b.estado).toLowerCase();
            break;
          case 'usuario_asignado':
            valueA = getUserName(a.usuario_asignado).toLowerCase();
            valueB = getUserName(b.usuario_asignado).toLowerCase();
            break;
          case 'fecha_programada':
            valueA = a.fecha_programada ? new Date(a.fecha_programada) : new Date(0);
            valueB = b.fecha_programada ? new Date(b.fecha_programada) : new Date(0);
            break;
          case 'fecha_inicio':
            valueA = a.fecha_inicio ? new Date(a.fecha_inicio) : new Date(0);
            valueB = b.fecha_inicio ? new Date(b.fecha_inicio) : new Date(0);
            break;
          case 'fecha_fin':
            valueA = a.fecha_fin ? new Date(a.fecha_fin) : new Date(0);
            valueB = b.fecha_fin ? new Date(b.fecha_fin) : new Date(0);
            break;
          case 'empresa':
            valueA = getEmpresaNombre(a.solicitud);
            valueB = getEmpresaNombre(b.solicitud);
            break;
          default:
            valueA = a[sortColumn.value];
            valueB = b[sortColumn.value];
        }
        
        // Comparar los valores
        if (valueA === valueB) return 0;
        
        // Determinar el orden según la dirección
        const direction = sortDirection.value === 'asc' ? 1 : -1;
        
        // Comparar según el tipo de dato
        if (valueA instanceof Date && valueB instanceof Date) {
          return valueA > valueB ? direction : -direction;
        } else {
          return valueA > valueB ? direction : -direction;
        }
      });
    };

    // Función para limpiar un filtro de fecha
    const clearDateFilter = (filterType) => {
      switch (filterType) {
        case 'programada':
          programadaFilters.value = { startDate: '', endDate: '' };
          break;
        case 'inicio':
          inicioFilters.value = { startDate: '', endDate: '' };
          break;
        case 'fin':
          finFilters.value = { startDate: '', endDate: '' };
          break;
      }
      applyFilters();
    };

    // Variables para los nuevos filtros
    const solicitudFilters = ref([]);
    const estadoFilters = ref([]);
    const usuarioFilters = ref([]);
    const programadaFilterOption = ref('');
    const inicioFilterOption = ref('');
    const finFilterOption = ref('');
    
    // Opciones para filtros de fecha
    const dateOptions = [
      { label: 'Hoy', value: 'today' },
      { label: 'Ayer', value: 'yesterday' },
      { label: 'Esta semana', value: 'thisWeek' },
      { label: 'Este mes', value: 'thisMonth' },
      { label: 'Este año', value: 'thisYear' },
      { label: 'Años anteriores', value: 'previousYears' }
    ];
    
    // Función para seleccionar todos los elementos de un filtro
    const selectAllSolicitudes = () => {
      solicitudFilters.value = solicitudes.value.map(s => s.id);
      applyFilters();
    };
    
    const selectAllEstados = () => {
      estadoFilters.value = estados.value.map(e => e.id);
      applyFilters();
    };
    
    const selectAllUsuarios = () => {
      usuarioFilters.value = usuarios.value.map(u => u.id);
      applyFilters();
    };
    
    // Funciones para limpiar filtros específicos
    const clearSolicitudFilters = () => {
      solicitudFilters.value = [];
      applyFilters();
    };
    
    const clearEstadoFilters = () => {
      estadoFilters.value = [];
      applyFilters();
    };
    
    const clearUsuarioFilters = () => {
      usuarioFilters.value = [];
      applyFilters();
    };
    
    // Función para aplicar filtros de fecha predefinidos
    const applyDateFilter = (type, option) => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let startDate = '';
      let endDate = '';
      let firstDayOfWeek; // Declaración movida fuera del case
      
      switch (option) {
        case 'today':
          startDate = today.toISOString().split('T')[0];
          endDate = today.toISOString().split('T')[0];
          break;
        case 'yesterday':
          startDate = yesterday.toISOString().split('T')[0];
          endDate = yesterday.toISOString().split('T')[0];
          break;
        case 'thisWeek':
          firstDayOfWeek = new Date(today); // Asignación sin declaración
          firstDayOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)); // Lunes
          startDate = firstDayOfWeek.toISOString().split('T')[0];
          endDate = today.toISOString().split('T')[0];
          break;
        case 'thisMonth':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
          endDate = today.toISOString().split('T')[0];
          break;
        case 'thisYear':
          startDate = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
          endDate = today.toISOString().split('T')[0];
          break;
        case 'previousYears':
          startDate = new Date(0).toISOString().split('T')[0]; // Desde el inicio
          endDate = new Date(now.getFullYear() - 1, 11, 31).toISOString().split('T')[0]; // Hasta el final del año anterior
          break;
      }
      
      if (type === 'programada') {
        programadaFilters.value.startDate = startDate;
        programadaFilters.value.endDate = endDate;
      } else if (type === 'inicio') {
        inicioFilters.value.startDate = startDate;
        inicioFilters.value.endDate = endDate;
      } else if (type === 'fin') {
        finFilters.value.startDate = startDate;
        finFilters.value.endDate = endDate;
      }
      
      applyFilters();
    };
    
    // Función para limpiar todos los filtros
    const clearAllFilters = () => {
      searchQuery.value = '';
      dateFilters.value = { startDate: '', endDate: '' };
      programadaFilters.value = { startDate: '', endDate: '' };
      inicioFilters.value = { startDate: '', endDate: '' };
      finFilters.value = { startDate: '', endDate: '' };
      statusFilter.value = '';
      userFilter.value = '';
      solicitudFilters.value = [];
      estadoFilters.value = [];
      usuarioFilters.value = [];
      usuarioAsignadoFilters.value = [];
      usuarioReasignadoFilters.value = [];
      empresaFilters.value = [];
      empresaSearchQuery.value = '';
      programadaFilterOption.value = '';
      inicioFilterOption.value = '';
      finFilterOption.value = '';
      activeFilter.value = null;
      
      filteredTareas.value = [...tareas.value];
      sortFilteredTareas();
    };

    onMounted(async () => {
      try {
        console.log('Iniciando carga de datos...');
        await Promise.all([
          fetchTareas(),
          fetchSolicitudes(),
          fetchUsuarios(),
          fetchEstados(),
          fetchTerceros(),
          fetchUsuariosTerceros()
        ]);
        console.log('Todos los datos cargados correctamente');
        
        // Inicializar empresas después de cargar los datos
        allEmpresas.value = getUniqueEmpresas();
        filteredEmpresas.value = [...allEmpresas.value];
      } catch (error) {
        console.error('Error durante la carga de datos:', error);
      }
    });

    // Nuevas variables reactivas
    const usuarioAsignadoFilters = ref([]);
    const usuarioReasignadoFilters = ref([]);

    // Métodos para seleccionar todos los usuarios
    const selectAllUsuariosAsignados = () => {
      usuarioAsignadoFilters.value = usuarios.value.map(u => u.id);
      applyFilters();
    };

    const selectAllUsuariosReasignados = () => {
      usuarioReasignadoFilters.value = usuarios.value.map(u => u.id);
      applyFilters();
    };

    // Métodos para limpiar filtros
    const clearUsuarioAsignadoFilters = () => {
      usuarioAsignadoFilters.value = [];
      applyFilters();
    };

    const clearUsuarioReasignadoFilters = () => {
      usuarioReasignadoFilters.value = [];
      applyFilters();
    };

    // Computed property para obtener usuarios asignados únicos que aparecen en las tareas
    const getUsuariosAsignados = computed(() => {
      // Obtener IDs únicos de usuarios asignados
      const usuariosAsignadosIds = [...new Set(tareas.value.map(tarea => tarea.usuario_asignado))];
      
      // Filtrar la lista de usuarios para obtener solo los que están asignados a tareas
      return usuarios.value.filter(usuario => usuariosAsignadosIds.includes(usuario.id));
    });

    // Computed property para obtener usuarios reasignados únicos que aparecen en las tareas
    const getUsuariosReasignados = computed(() => {
      // Obtener IDs únicos de usuarios reasignados (excluyendo valores nulos)
      const usuariosReasignadosIds = [...new Set(
        tareas.value
          .filter(tarea => tarea.usuario_reasignado) // Filtrar tareas con usuario_reasignado no nulo
          .map(tarea => tarea.usuario_reasignado)
      )];
      
      // Filtrar la lista de usuarios para obtener solo los que están reasignados a tareas
      return usuarios.value.filter(usuario => usuariosReasignadosIds.includes(usuario.id));
    });

    // Variables para paginación
    const itemsPerPage = ref(10);
    const currentPage = ref(1);

    // Computed properties para paginación
    const totalPages = computed(() => {
      return Math.ceil(filteredTareas.value.length / itemsPerPage.value);
    });

    const startItem = computed(() => {
      return filteredTareas.value.length === 0 ? 0 : (currentPage.value - 1) * itemsPerPage.value + 1;
    });

    const endItem = computed(() => {
      return Math.min(currentPage.value * itemsPerPage.value, filteredTareas.value.length);
    });

    const paginatedTareas = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return filteredTareas.value.slice(start, end);
    });

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
        
        // Determinar si mostrar puntos suspensivos después de la primera página
        if (current > 3) {
          pages.push('...');
        }
        
        // Determinar el rango de páginas alrededor de la página actual
        let start = Math.max(2, current - 1);
        let end = Math.min(total - 1, current + 1);
        
        // Ajustar el rango para mostrar siempre 3 páginas si es posible
        if (start === 2) {
          end = Math.min(total - 1, end + 1);
        }
        if (end === total - 1) {
          start = Math.max(2, start - 1);
        }
        
        // Agregar el rango de páginas
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
        
        // Determinar si mostrar puntos suspensivos antes de la última página
        if (current < total - 2) {
          pages.push('...');
        }
        
        // Siempre mostrar la última página
        pages.push(total);
      }
      
      return pages;
    });

    // Métodos para paginación
    const goToPage = (page) => {
      currentPage.value = page;
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    const firstPage = () => {
      currentPage.value = 1;
    };

    const lastPage = () => {
      currentPage.value = totalPages.value;
    };

    // Resetear la página actual cuando cambian los filtros
    watch(filteredTareas, () => {
      currentPage.value = 1;
    });

    // Agregar esta función donde defines tus métodos
    const openEditModal = (tarea) => {
      currentTarea.value = { ...tarea };
      showModalEdit.value = true;
    };

    // Función para obtener el nombre de la empresa a partir de la solicitud
    const getEmpresaNombre = (solicitudId) => {
      if (!solicitudId) return '-';
      
      // Buscar la solicitud en la lista de solicitudes
      const solicitud = solicitudes.value.find(s => s.id === solicitudId);
      if (!solicitud) return '-';
      
      // Si la solicitud tiene usuario_cliente, buscar en usuariosTerceros
      if (solicitud.usuario_cliente) {
        // Verificar si tenemos usuariosTerceros cargados
        if (!usuariosTerceros.value || usuariosTerceros.value.length === 0) {
          return 'Cargando...';
        }
        
        // Buscar todas las relaciones para este usuario_cliente
        const relacionesUsuario = usuariosTerceros.value.filter(ut => 
          ut.usuario && (
            (typeof ut.usuario === 'object' && ut.usuario.id === solicitud.usuario_cliente) ||
            (typeof ut.usuario === 'number' && ut.usuario === solicitud.usuario_cliente)
          )
        );
        
        if (relacionesUsuario.length > 0) {
          // Tomar la primera relación
          const usuarioTercero = relacionesUsuario[0];
          
          if (usuarioTercero.tercero) {
            // Si tercero es un objeto con nombre
            if (typeof usuarioTercero.tercero === 'object' && usuarioTercero.tercero.nombre) {
              return usuarioTercero.tercero.nombre;
            }
            
            // Si tercero es un ID, buscar en la lista de terceros
            if (typeof usuarioTercero.tercero === 'number') {
              const tercero = terceros.value.find(t => t.id === usuarioTercero.tercero);
              if (tercero) {
                return tercero.nombre;
              }
            }
          }
        }
      }
      
      return '-';
    };

    // Agregar la definición de usuariosTerceros como variable reactiva
    const usuariosTerceros = ref([]);
    const terceros = ref([]);

    // Función para obtener los terceros
    const fetchTerceros = async () => {
      try {
        console.log('Obteniendo terceros...');
        const token = localStorage.getItem('token');
        const response = await apiClient.get('/terceros/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('Terceros obtenidos:', response.data);
        terceros.value = response.data;
      } catch (error) {
        console.error('Error al obtener terceros:', error);
        errorMessage.value = 'Error al cargar los terceros. Por favor, intente de nuevo.';
      }
    };

    // Función para obtener usuariosTerceros
    const fetchUsuariosTerceros = async () => {
      try {
        console.log('Obteniendo usuariosTerceros...');
        const token = localStorage.getItem('token');
        const response = await apiClient.get('/usuariosTerceros/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('UsuariosTerceros obtenidos:', response.data);
        usuariosTerceros.value = response.data;
      } catch (error) {
        console.error('Error al obtener usuariosTerceros:', error);
      }
    };

    // Agregar variable reactiva para la búsqueda de solicitud
    const solicitudSearchQuery = ref('');

    // Función para limpiar la búsqueda de solicitud
    const clearSolicitudSearch = () => {
      solicitudSearchQuery.value = '';
      applyFilters();
    };

    // Agregar variable reactiva para el filtro de empresa
    const empresaSearchQuery = ref('');
    const empresaFilters = ref([]);

    // Función para obtener todas las empresas únicas (corregida)
    const getUniqueEmpresas = () => {
      console.log('Obteniendo empresas únicas...');
      const empresasSet = new Set();
      
      tareas.value.forEach(tarea => {
        if (tarea.solicitud) {
          const empresaNombre = getEmpresaNombre(tarea.solicitud);
          console.log(`Tarea ${tarea.id}, solicitud: ${tarea.solicitud}, empresa: ${empresaNombre}`);
          
          if (empresaNombre && empresaNombre !== '-') {
            empresasSet.add(empresaNombre);
          }
        }
      });
      
      const empresas = Array.from(empresasSet).map(nombre => ({ id: nombre, nombre }));
      console.log('Empresas únicas encontradas:', empresas);
      return empresas;
    };

    // Función para filtrar empresas basado en la búsqueda
    const filterEmpresas = () => {
      if (!empresaSearchQuery.value) {
        filteredEmpresas.value = [...allEmpresas.value];
      } else {
        const query = empresaSearchQuery.value.toLowerCase();
        filteredEmpresas.value = allEmpresas.value.filter(
          empresa => empresa.nombre.toLowerCase().includes(query)
        );
      }
    };

    // Función para seleccionar todas las empresas (corregida)
    const selectAllEmpresas = () => {
      console.log('Seleccionando todas las empresas:', filteredEmpresas.value);
      empresaFilters.value = filteredEmpresas.value.map(empresa => empresa.id);
      console.log('IDs de empresas seleccionadas:', empresaFilters.value);
      applyFilters();
    };

    // Función para limpiar los filtros de empresa
    const clearEmpresaFilters = () => {
      empresaFilters.value = [];
      empresaSearchQuery.value = '';
      filteredEmpresas.value = [...allEmpresas.value];
      applyFilters();
    };

    // Computed property para obtener empresas únicas que aparecen en las tareas
    const filteredEmpresas = ref([]);
    const allEmpresas = ref([]);

    // Función para verificar si una tarea cumple con los filtros de fecha
    const checkDateFilter = (tarea, filterType) => {
      let tareaDate;
      let filters;
      
      // Determinar qué campo de fecha y qué filtros usar
      switch (filterType) {
        case 'programada':
          tareaDate = tarea.fecha_programada;
          filters = programadaFilters.value;
          break;
        case 'inicio':
          tareaDate = tarea.fecha_inicio;
          filters = inicioFilters.value;
          break;
        case 'fin':
          tareaDate = tarea.fecha_fin;
          filters = finFilters.value;
          break;
        default:
          return true; // Si no hay filtro específico, la tarea pasa
      }
      
      // Si no hay fechas de filtro establecidas, la tarea pasa
      if (!filters.startDate && !filters.endDate) {
        return true;
      }
      
      // Si la tarea no tiene la fecha que estamos filtrando
      if (!tareaDate) {
        return false; // No pasa el filtro si no tiene la fecha
      }
      
      // Convertir la fecha de la tarea a un objeto Date y resetear la hora
      const tareaDateObj = new Date(tareaDate);
      const tareaDateOnly = new Date(
        tareaDateObj.getFullYear(),
        tareaDateObj.getMonth(),
        tareaDateObj.getDate()
      );
      
      // Verificar fecha de inicio del filtro
      if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        // Resetear la hora a 00:00:00
        startDate.setHours(0, 0, 0, 0);
        
        if (tareaDateOnly < startDate) {
          return false; // No pasa el filtro si es anterior a la fecha de inicio
        }
      }
      
      // Verificar fecha de fin del filtro
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        // Establecer la hora a 23:59:59 para incluir todo el día
        endDate.setHours(23, 59, 59, 999);
        
        if (tareaDateOnly > endDate) {
          return false; // No pasa el filtro si es posterior a la fecha de fin
        }
      }
      
      return true; // Pasa todos los filtros de fecha
    };

    const applyPredefinedDateFilter = (type, option) => {
      console.log(`Aplicando filtro predefinido: ${type}, opción: ${option}`);
      
      // Obtener la fecha actual en la zona horaria local
      const now = new Date();
      
      // Crear una fecha para "hoy" con la hora establecida a 00:00:00
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      // Crear una fecha para "ayer" con la hora establecida a 00:00:00
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      // Declarar todas las variables necesarias fuera del switch
      let startDate = '';
      let endDate = '';
      let firstDayOfWeek;
      let dayOfWeek;
      let daysToSubtract;
      
      switch (option) {
        case 'today':
          // Formato YYYY-MM-DD para hoy
          startDate = today.toISOString().split('T')[0];
          endDate = startDate; // Mismo día para inicio y fin
          break;
        case 'yesterday':
          // Formato YYYY-MM-DD para ayer
          startDate = yesterday.toISOString().split('T')[0];
          endDate = startDate; // Mismo día para inicio y fin
          break;
        case 'thisWeek':
          // Calcular el lunes de esta semana
          firstDayOfWeek = new Date(today);
          dayOfWeek = today.getDay(); // 0 = domingo, 1 = lunes, ...
          daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Si es domingo, restar 6 días, sino restar (día - 1)
          firstDayOfWeek.setDate(today.getDate() - daysToSubtract);
          
          startDate = firstDayOfWeek.toISOString().split('T')[0];
          endDate = today.toISOString().split('T')[0];
          break;
        case 'thisMonth':
          // Primer día del mes actual
          startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
          endDate = today.toISOString().split('T')[0];
          break;
        case 'thisYear':
          // Primer día del año actual
          startDate = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
          endDate = today.toISOString().split('T')[0];
          break;
        case 'previousYears':
          // Desde el inicio del tiempo hasta el final del año anterior
          startDate = new Date(0).toISOString().split('T')[0];
          endDate = new Date(now.getFullYear() - 1, 11, 31).toISOString().split('T')[0];
          break;
      }
      
      console.log(`Fechas calculadas - Inicio: ${startDate}, Fin: ${endDate}`);
      
      // Aplicar las fechas al filtro correspondiente
      if (type === 'programada') {
        programadaFilters.value.startDate = startDate;
        programadaFilters.value.endDate = endDate;
      } else if (type === 'inicio') {
        inicioFilters.value.startDate = startDate;
        inicioFilters.value.endDate = endDate;
      } else if (type === 'fin') {
        finFilters.value.startDate = startDate;
        finFilters.value.endDate = endDate;
      }
      
      // Aplicar los filtros
      applyFilters();
    };

    return {
      tareas,
      solicitudes,
      usuarios,
      estados,
      searchQuery,
      filteredTareas,
      errorMessage,
      showModalCreate,
      showModalEdit,
      dateFilters,
      programadaFilters,
      statusFilter,
      userFilter,
      activeFilter,
      currentTarea,
      inicioFilters,
      finFilters,
      fetchTareas,
      filterTareas,
      createTarea,
      editTarea,
      updateTarea,
      deleteTarea,
      closeModal,
      formatDate,
      getEstadoLabel,
      getEstadoClass,
      getUserName,
      toggleFilter,
      applyFilters,
      clearFilters,
      createRelatedTarea,
      openCreateModal,
      getSolicitudTitulo,
      setCurrentDateTime,
      calcularDuracion,
      usuariosSoporte,
      sortColumn,
      sortDirection,
      sortTareas,
      getSortIcon,
      sortFilteredTareas,
      clearDateFilter,
      solicitudFilters,
      estadoFilters,
      usuarioFilters,
      programadaFilterOption,
      inicioFilterOption,
      finFilterOption,
      dateOptions,
      
      selectAllSolicitudes,
      selectAllEstados,
      selectAllUsuarios,
      clearSolicitudFilters,
      clearEstadoFilters,
      clearUsuarioFilters,
      applyDateFilter,
      clearAllFilters,
      usuarioAsignadoFilters,
      usuarioReasignadoFilters,
      selectAllUsuariosAsignados,
      selectAllUsuariosReasignados,
      clearUsuarioAsignadoFilters,
      clearUsuarioReasignadoFilters,
      getUsuariosAsignados,
      getUsuariosReasignados,
      itemsPerPage,
      currentPage,
      totalPages,
      startItem,
      endItem,
      paginatedTareas,
      
      displayedPages,
      goToPage,
      prevPage,
      nextPage,
      firstPage,
      lastPage,
      openEditModal,
      getEmpresaNombre,
      usuariosTerceros,
      terceros,
      fetchTerceros,
      fetchUsuariosTerceros,
      solicitudSearchQuery,
      clearSolicitudSearch,
      empresaSearchQuery,
      empresaFilters,
      filteredEmpresas,
      allEmpresas,
      reasignadoFilter,
      empresaFilter,
      getUniqueEmpresas,
      filterEmpresas,
      selectAllEmpresas,
      clearEmpresaFilters,
      checkDateFilter,
      applyPredefinedDateFilter
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

/* Fijar el ancho de la columna de descripción */
.w-64 {
  width: 16rem;
  min-width: 16rem;
  max-width: 16rem;
}

/* Estilo para el texto truncado con tooltip */
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>