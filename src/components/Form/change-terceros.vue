<template>
    <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="$emit('close')"></div>
  
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
  
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <BuildingOfficeIcon class="h-6 w-6 text-blue-600" aria-hidden="true" />
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Cambiar Empresa
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Seleccione la empresa a la que desea cambiar
                  </p>
                </div>
              </div>
            </div>
  
            <div class="mt-5">
              <div class="space-y-2 max-h-60 overflow-y-auto">
                <button
                  v-for="empresa in empresasUsuario"
                  :key="empresa.id"
                  @click="seleccionarEmpresa(empresa)"
                  :class="[
                    'w-full text-left px-4 py-3 rounded-lg transition-colors',
                    empresa.id === Number(currentTerceroId) 
                      ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' 
                      : 'hover:bg-gray-50'
                  ]"
                >
                  <div class="font-medium">{{ empresa.nombre }}</div>
                  <div class="text-sm text-gray-500">NIT: {{ empresa.nit }}</div>
                </button>
              </div>
  
              <div v-if="empresasUsuario.length === 0" class="text-center py-4 text-gray-500">
                No hay empresas disponibles
              </div>
            </div>
          </div>
  
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              @click="$emit('close')"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { BuildingOfficeIcon } from '@heroicons/vue/24/outline';
  import axios from 'axios';
  
  const emit = defineEmits(['close', 'empresaSeleccionada']);
  const empresasUsuario = ref([]);
  const currentTerceroId = ref(null);
  
  onMounted(async () => {
    await cargarEmpresas();
    currentTerceroId.value = localStorage.getItem('terceroId');
  });
  
  const cargarEmpresas = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const currentUser = JSON.parse(localStorage.getItem('user'));
      
      // Obtener las relaciones del usuario
      const usuariosTercerosResponse = await axios.get('http://144.76.41.52:8070/api/usuariosTerceros/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Respuesta completa:', usuariosTercerosResponse.data);

      // Filtrar las relaciones del usuario actual
      const misRelaciones = usuariosTercerosResponse.data.filter(
        ut => ut.usuario === currentUser.id || ut.usuario.id === currentUser.id
      );

      console.log('Mis relaciones:', misRelaciones);

      if (misRelaciones.length === 0) {
        console.log('No se encontraron relaciones para el usuario:', currentUser.id);
        return;
      }

      // Obtener los terceros
      const tercerosPromises = misRelaciones.map(relacion => {
        const terceroId = typeof relacion.tercero === 'object' ? relacion.tercero.id : relacion.tercero;
        return axios.get(`http://144.76.41.52:8070/api/terceros/${terceroId}/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      });

      const tercerosResponses = await Promise.all(tercerosPromises);
      empresasUsuario.value = tercerosResponses.map(response => response.data);

      console.log('Empresas cargadas:', empresasUsuario.value);

    } catch (error) {
      console.error('Error al cargar empresas:', error);
      if (error.response) {
        console.error('Detalles del error:', error.response.data);
      }
    }
  };
  
  const seleccionarEmpresa = (empresa) => {
    console.log('Seleccionando empresa:', empresa);
    localStorage.setItem('terceroId', empresa.id);
    localStorage.setItem('terceroNombre', empresa.nombre);
    emit('empresaSeleccionada', empresa);
    emit('close');
    // Recargar la página para actualizar los datos
    window.location.reload();
  };
  </script>