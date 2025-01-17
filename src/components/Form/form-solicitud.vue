<template>
  <div class="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Solicitudes</h1>            
       <!-- Contenedor de búsqueda, filtros y botón -->
      <div class="flex flex-wrap items-center gap-4 mb-6">
      <!-- Botón de nueva solicitud -->
      <div class="flex-shrink-0">
        <button 
          @click="showModalCreate = true"
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out"
        >
          Nueva Solicitud
        </button>
      </div>
      <!-- Campo de búsqueda -->
      <div class="flex-grow min-w-[200px]">
        <label for="search" class="sr-only">Buscar</label>
        <div class="relative">
          <input 
            id="search"
            type="text" 
            v-model="searchQuery"   
            @input="filterSolicitudes" 
            placeholder="Buscar por ID o motivo de cancelación"
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
          />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Filtro por prioridad -->
      <div class="flex-shrink-0">
        <label for="priority" class="sr-only">Filtrar por Prioridad</label>
        <select 
          id="priority"
          v-model="filterPrioridad" 
          @change="filterSolicitudes" 
          class="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">Todas las prioridades</option>
          <option v-for="prioridad in prioridades" :key="prioridad" :value="prioridad">
            {{ getModuloName(prioridad) }}
          </option>
        </select>
      </div>

      <!-- Filtro por estado -->
      <div class="flex-shrink-0">
        <label for="status" class="sr-only">Filtrar por Estado</label>
        <select 
          id="status"
          v-model="filterEstado" 
          @change="filterSolicitudes" 
          class="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">Todos los estados</option>
          <option v-for="estado in estados" :key="estado" :value="estado">
            {{ getModuloName(estado) }}
          </option>
        </select>
      </div>


    </div>


      <!-- Tabla de solicitudes adaptable -->
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th 
                  v-for="column in columns" 
                  :key="column.key" 
                  class="px-6 py-2 text-left text-xm font-medium text-black-500 uppercase tracking-wider cursor-pointer select-none"
                  @click="sortTable(column.key)"
                  :class="{ 'relative': true }"
                  :style="{ width: columnWidths[column.key] + 'px' }"
                >
                  {{ column.label }}
                  <span v-if="sortBy === column.key">{{ sortOrder === 'asc' ? '' : '' }}</span>
                  <div class="absolute top-0 right-0 bottom-0 w-1 cursor-col-resize" @mousedown="startResize($event, column.key)"></div>
                </th>

              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="solicitud in filteredSolicitudes" :key="solicitud.id" class="hover:bg-gray-50">
                <td v-for="column in columns" :key="column.key" 
                    class="px-3 py-2 whitespace-normal text-sm text-black-500 break-words"
                    :style="{ width: columnWidths[column.key] + 'px' }"
                >
                  <template v-if="column.key === 'usuario_cliente_nombre'">
                    {{ getModuloName(solicitud.usuario_cliente_nombre) }} <!-- Mostrar el nombre aquí -->
                  </template>
                  <template v-else-if="column.key === 'acciones'">
                    <div class="flex flex-wrap gap-2">
                      <button @click="showSolicitudDetails(solicitud.id)" class="text-indigo-600 hover:text-indigo-900">V</button>
                      <button @click="editSolicitud(solicitud.id)" class="text-yellow-600 hover:text-yellow-900">Ed</button>
                      <button @click="openTareasModal(solicitud.id)" class="text-indigo-600 hover:text-indigo-900">T</button>
                      <button @click="deleteSolicitud(solicitud.id)" class="text-red-600 hover:text-red-900">X</button>
                    </div>
                  </template>
                  <template v-else-if="column.key === 'prioridad'">
                    <span :class="[
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                      solicitud.prioridad === 'B' ? 'bg-green-100 text-green-800' :
                      solicitud.prioridad === 'M' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    ]">
                      {{ getModuloName(solicitud[column.key]) }}
                    </span>
                  </template>
                  <template v-else-if="column.key.includes('fecha')">
                    {{ formatDate(solicitud[column.key]) }}
                  </template>
                  <template v-else>
                    {{ getModuloName(solicitud[column.key]) }}
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <p v-if="errorMessage" class="mt-4 text-red-600 text-sm">{{ errorMessage }}</p>
    </div>

      <!-- Modal para Ver Detalles -->
    <div v-if="showModalDetails" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">Detalles de Solicitud</h3>
            <div class="mt-2">
              <div v-if="detalleSolicitud">
                <p class="text-sm text-gray-500"><strong>Fecha de Creación:</strong> {{ formatDate(detalleSolicitud.fecha_creacion) }}</p>
                <p class="text-sm text-gray-500"><strong>Descripcion:</strong> {{ detalleSolicitud.descripcion }}</p>
                <p class="text-sm text-gray-500"><strong>Motivo de Cancelación:</strong> {{ detalleSolicitud.motivo_cancelacion || 'N/A' }}</p>
                <h4 class="font-semibold mt-4 text-sm text-gray-700">Anexos:</h4>
                <ul class="mt-1 space-y-1">
                  <li v-for="anexo in anexos" :key="anexo.id" class="flex items-center justify-between">
                    <span class="text-sm text-gray-600">{{ anexo.descripcion || 'Sin descripción' }}</span>
                    <a 
                      :href="anexo.archivo" 
                      download 
                      class="text-sm text-indigo-600 hover:text-indigo-900 flex items-center"
                      @click.prevent="downloadAnexo(anexo)"
                    >
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                      </svg>
                      Descargar
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="closeModal" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Editar -->
    <div v-if="showModalEdit" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form @submit.prevent="updateSolicitud">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">Editar Solicitud</h3>
              <div class="mt-2 space-y-4">
                <div>
                  <label for="edit-modulo" class="block text-sm font-medium text-gray-700">Módulo:</label>
                  <select id="edit-modulo" v-model="editableSolicitud.modulo" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                    <option v-for="modulo in modulos" :key="modulo" :value="modulo">{{ modulosMap[modulo] }}</option>
                  </select>
                </div>
                <div>
                  <label for="edit-prioridad" class="block text-sm font-medium text-gray-700">Prioridad:</label>
                  <select id="edit-prioridad" v-model="editableSolicitud.prioridad" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                    <option v-for="prioridad in prioridades" :key="prioridad" :value="prioridad">{{ modulosMap[prioridad] }}</option>
                  </select>
                </div>
                <div>
                <label for="edit-estado" class="block text-sm font-medium text-gray-700">Estado:</label>
                <select 
                  id="edit-estado" 
                  v-model="editableSolicitud.estado" 
                  @change="handleEstadoChange"
                  class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option v-for="estado in estados" :key="estado" :value="estado">{{ modulosMap[estado] }}</option>
                </select>
                </div>

                <div>
                  <label for="edit-fecha-asignacion" class="block text-sm font-medium text-gray-700">Fecha de Asignación:</label>
                  <input 
                    id="edit-fecha-asignacion" 
                    v-model="editableSolicitud.fecha_asignacion" 
                    type="text" 
                    readonly
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                </div>
                <div>
                  <label for="edit-motivo" class="block text-sm font-medium text-gray-700">Motivo de Cancelación:</label>
                  <input id="edit-motivo" v-model="editableSolicitud.motivo_cancelacion" type="text" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Ingrese motivo de cancelación (si aplica)">
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button type="submit" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
                Guardar
              </button>
              <button @click="closeModal" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal Crear -->
    <div v-if="showModalCreate" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form @submit.prevent="createSolicitud">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">Crear Solicitud</h3>
              <div class="mt-2 space-y-4">
                <div>
                  <label for="new-modulo" class="block text-sm font-medium text-gray-700">Módulo:</label>
                  <select id="new-modulo" v-model="newSolicitud.modulo" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" placeholder="Seleccione un modulo">
                    <option v-for="modulo in modulos" :key="modulo" :value="modulo">{{ modulosMap[modulo] }}</option> 
                  </select>
                </div>
                <input id="new-titulo" v-model="newSolicitud.titulo" type="text" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Ingresa un titulo">
                <div>
                  <label for="new-descripcion" class="block text-sm font-medium text-gray-700">Descripción del error:</label>
                  <textarea id="new-descripcion" v-model="newSolicitud.descripcion" class="mt-1 block w-full h-32 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Ingresa una descripción">
                  </textarea>
                </div>
                <label for="usuario_cliente">Usuario Cliente</label>
                  <input 
                    id="usuario_cliente"
                    type="text"
                    v-model="newSolicitud.usuario_cliente"
                    readonly
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                <div>
                  <label for="new-file" class="block text-sm font-medium text-gray-700">Adjuntar Anexo:</label>
                  <input id="new-file" type="file" @change="handleFileUpload" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100">
                </div>
                <input id="new-descripcionanexo" v-model="newSolicitud.descripcion_anexo" type="text" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Ingresa descripción del anexo">
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button type="submit" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
                Crear
              </button>
              <button @click="closeModal" type="button" class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 fo:ml-3 sm:w-auto sm:text-sm">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
          <!-- Modal Tareas -->
    <div v-if="showTareasModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Tareas de la Solicitud {{ currentSolicitudId }}</h3>

            <!-- Lista de tareas -->
            <ul class="divide-y divide-gray-200 mt-4">
              <li v-for="tarea in tareas" :key="tarea.id" class="py-4 flex justify-between items-center">
                <p class="text-sm text-gray-700">{{ tarea.descripcion }}</p>
                <button @click="deleteTarea(tarea.id)" class="text-red-600 hover:text-red-800">Eliminar</button>
              </li>
            </ul>

            <!-- Formulario nueva tarea -->
            <div class="mt-4">
              <input
                v-model="nuevaTarea"
                type="text"
                placeholder="Nueva tarea"
                class="w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button @click="createTarea" class="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md">Agregar</button>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="closeTareasModal" type="button" class="bg-indigo-600 text-white px-4 py-2 rounded-md">Cerrar</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import apiClient from '@/apiClient';

export default {
  data() {
    return {
      solicitudes: [],
      filteredSolicitudes: [],
      searchQuery: '',
      filterPrioridad: '',
      filterEstado: '',
      sortBy: 'id',
      sortOrder: 'asc',
      modulos: ["GE", "PA", "CO", "CP", "CC", "IN", "VE", "PE", "NO", "PP", "AF", "TA", "CF"],
      modulosMap: {
        GE: "General",
        PA: "Parametrización",
        CO: "Contabilidad",
        CP: "C por Pag",
        CC: "C por Cobrar",
        IN: "Inventario y Compras",
        VE: "Ventas",
        PE: "Pedidos",
        NO: "Nómina",
        PP: "Puntos de Pago",
        AF: "Activos Fijos",
        TA: "Taller Automotriz",
        CF: "Cartera Financiera",
        A: "Alta",
        M: "Media",
        B: "Baja",
        S: "Sin asignar",
        P: "Asignada",
        C: "Cancelada",
        T: "Terminada",
      },
      prioridades: ["A", "M", "B"],
      estados: ["S", "P", "C", "T"],
      detalleSolicitud: null,
      editableSolicitud: {
        usuario_soporte: null,
        fecha_asignacion: "",
      },
      isFechaAsignada: false,
      newSolicitud: {
        prioridad: "B",
        estado: "S",
        motivo_cancelacion: "N/A",
        modulo: '',
        descripcion: '',
        usuario_cliente: '',
        usuario_cliente_nombre: '',
      },
      anexos: [],
      selectedFile: null,
      showModalDetails: false,
      showModalEdit: false,
      showModalCreate: false,
      errorMessage: '',
      tareasSolicitud: [],
      showModalTareas: false,
      showTareasModal: false,
      currentTarea: { descripcion: '', solicitud: null },
      editingTarea: false,
      currentSolicitudId: null,
      tareas: [],
      nuevaTarea: '',
      columnWidths: {
        id: 80,
        usuario_cliente: 150,
        fecha_creacion: 100,
        fecha_asignacion: 100,
        fecha_finalizacion: 100,
        titulo: 200,
        prioridad: 80,
        soporte: 150,
        estado: 100,
        modulo: 100,
        acciones: 120
      },
      columns: [
        { key: 'id', label: 'ID' },
        { key: 'usuario_cliente_nombre', label: 'Clie' },
        { key: 'fecha_creacion', label: 'F.Crea' },
        { key: 'fecha_asignacion', label: 'F.Asignación' },
        { key: 'fecha_finalizacion', label: 'F.Fin' },
        { key: 'titulo', label: 'Título' },
        { key: 'prioridad', label: 'Prio' },
        { key: 'soporte', label: 'Soporte' },
        { key: 'estado', label: 'Estado' },
        { key: 'modulo', label: 'Módulo' },
        { key: 'acciones', label: 'Acciones' }
      ],
    };
  },
  created() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.newSolicitud.usuario_cliente = user.id;
      this.newSolicitud.usuario_cliente_nombre = user.username;
    } else {
      alert('No se encontró información del usuario. Por favor, inicia sesión.');
      this.$router.push('/');
    }
    this.initializeColumnWidths();
  },
  mounted() {
    this.fetchSolicitudes();
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-CA').format(date);
    },
    setFechaSistema() {
      if (this.editableSolicitud.estado !== "S" && !this.isFechaAsignada) {
        const now = new Date();
        this.editableSolicitud.fecha_asignacion = now.toISOString().split("T")[0];
        this.isFechaAsignada = true;
      }
    },
    filterSolicitudes() {
      this.filteredSolicitudes = this.solicitudes.filter((solicitud) => {
        const matchesSearchQuery =
          this.searchQuery === '' ||
          solicitud.id.toString().includes(this.searchQuery) ||
          solicitud.motivo_cancelacion?.toLowerCase().includes(this.searchQuery.toLowerCase());

        const matchesPrioridad =
          this.filterPrioridad === '' || solicitud.prioridad === this.filterPrioridad;

        const matchesEstado =
          this.filterEstado === '' || solicitud.estado === this.filterEstado;

        return matchesSearchQuery && matchesPrioridad && matchesEstado;
      });
      this.sortTable(this.sortBy);
    },
    sortTable(column) {
      // Validar que column sea un string válido
      if (!column || typeof column !== 'string') {
        console.error('Columna inválida:', column);
        return;
      }

      // Alternar el orden de la columna actual o cambiar la columna de orden
      if (this.sortBy === column) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortBy = column;
        this.sortOrder = 'asc';
      }

      // Ordenar las solicitudes
      this.filteredSolicitudes.sort((a, b) => {
        let valA = a[column] ?? ''; // Valor por defecto si es undefined
        let valB = b[column] ?? ''; // Valor por defecto si es undefined

        // Manejar columnas con fechas
        if (column.includes('fecha')) {
          valA = valA ? new Date(valA) : new Date(0); // Fecha mínima por defecto
          valB = valB ? new Date(valB) : new Date(0);
        }

        // Comparar valores
        if (valA < valB) return this.sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    },
    async fetchSolicitudes() {
      try {
        const response = await apiClient.get('/solicitudes/');
        this.solicitudes = response.data;
        this.filterSolicitudes();
      } catch (error) {
        console.error('Error al obtener solicitudes:', error);
        this.errorMessage = error.response?.data?.detail || 'Error al obtener solicitudes';
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
        console.error('Error al cargar los detalles de la solicitud:', error);
        this.errorMessage = 'Hubo un problema al cargar los detalles de la solicitud.';
      }
    },
    getModuloName(codigo) {
      return this.modulosMap[codigo] || codigo;
    },
    async downloadAnexo(anexo) {
      try {
        console.log('Downloading anexo:', anexo);

        const token = localStorage.getItem('access_token');
        console.log('Retrieved token:', token);

        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        const downloadUrl = `${apiClient.defaults.baseURL}/anexos/${anexo.id}/solicitud-anexos/`;
        
        console.log('Attempting download from:', downloadUrl);

        const response = await apiClient.get(downloadUrl, {
          responseType: 'blob',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': '*/*'
          }
        });

        console.log('Response received:', response.status, response.headers);

        if (!response.data || response.data.type === 'text/html') {
          throw new Error('Respuesta inválida del servidor');
        }

        const blob = new Blob([response.data], { 
          type: response.headers['content-type'] || 'application/octet-stream' 
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        const contentDisposition = response.headers['content-disposition'];
        const filename = contentDisposition 
          ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
          : anexo.descripcion || 'archivo_adjunto';
          
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        
        link.remove();
        window.URL.revokeObjectURL(url);
        
        console.log('Download completed successfully');
      } catch (error) {
        console.error('Error detallado al descargar el anexo:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });
        
        let errorMessage = 'Hubo un problema al descargar el archivo.';
        if (error.message === 'No se encontró el token de autenticación') {
          errorMessage = 'Su sesión ha expirado. Por favor, vuelva a iniciar sesión.';
        } else if (error.response?.status === 404) {
          errorMessage = 'El archivo no se encuentra disponible.';
        } else if (error.response?.status === 401) {
          errorMessage = 'Su sesión ha expirado. Por favor, vuelva a iniciar sesión.';
        }
        
        alert(errorMessage);
      }
    },
    
    async openTareasModal(solicitudId) {
      this.currentSolicitudId = solicitudId;
      this.tareas = [];
      this.showTareasModal = true;
      await this.fetchTareas(solicitudId);
    },

    async fetchTareas(solicitudId) {
      try {
        const response = await apiClient.get(`/tareas/${solicitudId}/solicitud-tareas/`);
        
        if (Array.isArray(response.data)) {
          this.tareas = response.data;
          this.errorMessage = '';
        } else {
          console.error('Respuesta inesperada de la API:', response.data);
          this.errorMessage = 'Error al cargar las tareas.';
          this.tareas = [];
        }
      } catch (error) {
        console.error('Error al obtener tareas:', error);
        this.errorMessage = 'Error al cargar las tareas. Por favor, intente de nuevo.';
        this.tareas = [];
      }
    },

    async createTarea() {
      if (!this.nuevaTarea.trim()) return;

      try {
        const response = await apiClient.post('https://wxsoporte.onrender.com/api/tareas/', {
          descripcion: this.nuevaTarea,
          solicitud: this.currentSolicitudId,
        });
        this.tareas.push(response.data);
        this.nuevaTarea = '';
        console.log('Tarea creada:', response.data);
      } catch (error) {
        console.error('Error al crear tarea:', error);
        this.errorMessage = 'Error al crear la tarea. Por favor, intente de nuevo.';
      }
    },

    async deleteTarea(tareaId) {
      try {
        await apiClient.delete(`/tareas/${tareaId}/`);
        this.tareas = this.tareas.filter(tarea => tarea.id !== tareaId);
      } catch (error) {
        console.error('Error al eliminar tarea:', error);
        this.errorMessage = 'Error al eliminar la tarea. Por favor, intente de nuevo.';
      }
    },

    closeTareasModal() {
      this.showTareasModal = false;
      this.currentSolicitudId = null;
      this.tareas = [];
      this.nuevaTarea = '';
    },

    async editSolicitud(id) {
      try {
        const response = await apiClient.get(`/solicitudes/${id}/`);
        this.editableSolicitud = { ...response.data };
        this.originalEstado = this.editableSolicitud.estado;
        this.showModalEdit = true;
      } catch (error) {
        console.error('Error al cargar la solicitud para editar:', error);
        this.errorMessage = error.response?.data?.detail || 'Error al cargar solicitud para editar';
      }
    },

    handleEstadoChange() {
      if (this.originalEstado === 'S' && this.editableSolicitud.estado !== 'S' && !this.editableSolicitud.fecha_asignacion) {
        this.editableSolicitud.fecha_asignacion = new Date().toISOString().split('T')[0];
      }
    },
    
    async updateSolicitud() {
      try {
        await apiClient.put(`/solicitudes/${this.editableSolicitud.id}/`, this.editableSolicitud);
        this.fetchSolicitudes();
        this.closeModal();
        alert('Solicitud actualizada correctamente');
      } catch (error) {
        console.error('Error al actualizar la solicitud:', error);
        this.errorMessage = error.response?.data?.detail || 'Error al actualizar la solicitud';
      }
    },

    async createSolicitud() {
      if (!this.newSolicitud.modulo || !this.newSolicitud.titulo || !this.newSolicitud.descripcion) {
        alert('Por favor, completa todos los campos obligatorios.');
        return;
      }
      const formData = new FormData();
      for (const [key, value] of Object.entries(this.newSolicitud)) {
        formData.append(key, value);
      }
      if (this.selectedFile) {
        formData.append("archivo", this.selectedFile);
      }
      try {
        await apiClient.post("/solicitudes/", formData);
        this.closeModal();
        this.fetchSolicitudes();
        alert('Solicitud creada correctamente');
      } catch (error) {
        console.error('Error al crear la solicitud:', error);
        console.error('Detalles del error:', error.response.data);
        this.errorMessage = error.response?.data?.detail || 'Error al crear la solicitud';
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
        prioridad: "B",
        estado: "S",
        motivo_cancelacion: "N/A",
        modulo: '',
        descripcion: '',
      };
      this.selectedFile = null;
      this.closeModalTareas = null;
    },

    async deleteSolicitud(id) {
      if (confirm('¿Está seguro de que desea eliminar esta solicitud?')) {
        try {
          await apiClient.delete(`/solicitudes/${id}/`);
          this.fetchSolicitudes();
          alert('Solicitud eliminada correctamente');
        } catch (error) {
          console.error('Error al eliminar solicitud:', error);
          this.errorMessage = error.response?.data?.detail || 'Error al eliminar solicitud';
        }
      }
    },

    initializeColumnWidths() {
      this.columns.forEach(column => {
        this.columnWidths[column.key] = 150;
      });
    },

    startResize(event, columnKey) {
      const startX = event.pageX;
      const startWidth = this.columnWidths[columnKey];

      const doDrag = (e) => {
        this.columnWidths[columnKey] = startWidth + (e.pageX - startX);
      };

      const stopDrag = () => {
        document.removeEventListener('mousemove', doDrag, false);
        document.removeEventListener('mouseup', stopDrag, false);
      };

      document.addEventListener('mousemove', doDrag, false);
      document.addEventListener('mouseup', stopDrag, false);
    },
  },
};
</script>

<style scoped>
.cursor-col-resize {
  cursor: col-resize;
}
</style>