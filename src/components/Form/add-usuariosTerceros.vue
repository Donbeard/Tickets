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
                  Agregar Nueva Empresa
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Ingrese el NIT de la empresa a la que desea tener acceso
                  </p>
                </div>
              </div>
            </div>
  
            <div class="mt-5">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">NIT de la Empresa</label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <input
                    v-model="nit"
                    type="text"
                    @input="buscarEmpresa"
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 border-gray-300"
                    placeholder="Ej: 900123456"
                    :class="{'border-red-300': errorMessage}"
                  />
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <span v-if="isSearching" class="text-sm text-gray-400">
                      Buscando...
                    </span>
                  </div>
                </div>
              </div>
  
              <div v-if="empresaEncontrada" class="mt-4 p-4 bg-gray-50 rounded-md">
                <h4 class="text-sm font-medium text-gray-900">Empresa encontrada:</h4>
                <div class="mt-2">
                  <p class="text-sm text-gray-600"><span class="font-medium">Nombre:</span> {{ empresaEncontrada.nombre }}</p>
                  <p class="text-sm text-gray-600"><span class="font-medium">NIT:</span> {{ empresaEncontrada.nit }}</p>
                </div>
              </div>
  
              <div v-if="errorMessage" class="mt-2">
                <p class="text-sm text-red-600">{{ errorMessage }}</p>
              </div>
            </div>
          </div>
  
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              @click="agregarEmpresa"
              :disabled="!empresaEncontrada || isLoading"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isLoading ? 'Agregando...' : 'Agregar Empresa' }}
            </button>
            <button
              type="button"
              @click="$emit('close')"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import { BuildingOfficeIcon } from '@heroicons/vue/24/outline';
  import debounce from 'lodash/debounce';
  
  const emit = defineEmits(['close', 'success']);
  const nit = ref('');
  const errorMessage = ref('');
  const isLoading = ref(false);
  const isSearching = ref(false);
  const empresaEncontrada = ref(null);
  
  const buscarEmpresa = debounce(async () => {
    try {
      if (!nit.value || nit.value.length < 3) {
        empresaEncontrada.value = null;
        return;
      }
  
      isSearching.value = true;
      errorMessage.value = '';
  
      const token = localStorage.getItem('accessToken');
      const baseURL = 'http://144.76.41.52:8070/api';
  
      const tercerosResponse = await axios.get(`${baseURL}/terceros/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const tercero = tercerosResponse.data.find(
        t => t.nit === Number(nit.value)
      );
  
      if (tercero) {
        empresaEncontrada.value = tercero;
        errorMessage.value = '';
      } else {
        empresaEncontrada.value = null;
        errorMessage.value = 'No se encontró una empresa con este NIT';
      }
    } catch (error) {
      console.error('Error al buscar empresa:', error);
      errorMessage.value = 'Error al buscar la empresa';
      empresaEncontrada.value = null;
    } finally {
      isSearching.value = false;
    }
  }, 500);
  
  const agregarEmpresa = async () => {
    if (!empresaEncontrada.value) {
      errorMessage.value = 'Primero debe buscar una empresa válida';
      return;
    }
  
    try {
      isLoading.value = true;
      const token = localStorage.getItem('accessToken');
      const baseURL = 'http://144.76.41.52:8070/api';
      const currentUser = JSON.parse(localStorage.getItem('user'));
  
      const usuariosTercerosResponse = await axios.get(`${baseURL}/usuariosTerceros/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      const relacionExistente = usuariosTercerosResponse.data.find(
        ut => ut.usuario === currentUser.id && ut.tercero === empresaEncontrada.value.id
      );
  
      if (relacionExistente) {
        errorMessage.value = 'Ya tienes acceso a esta empresa';
        return;
      }
  
      const nuevaRelacion = {
        usuario: currentUser.id,
        tercero: empresaEncontrada.value.id
      };
  
      const response = await axios.post(`${baseURL}/usuariosTerceros/`, nuevaRelacion, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      console.log('Relación creada exitosamente:', response.data);
      emit('success', empresaEncontrada.value);
      emit('close');
    } catch (error) {
      console.error('Error completo:', error);
      errorMessage.value = 'Error al agregar la empresa. Por favor, verifica los datos.';
    } finally {
      isLoading.value = false;
    }
  };
  </script>