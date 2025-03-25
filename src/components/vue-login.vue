<template>
  <div class="min-h-screen flex-1 flex-col justify-center px-6 py-5 lg:px-8">

    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-10 w-auto" src="https://static.wixstatic.com/media/7a7799_d00b73646de9440f88c6f421422244a3.png" alt="Your Company" />
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Iniciar Sesión</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="validateCredentials">
        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Usuario</label>
          <div class="mt-2">
            <input id="email" v-model="email" name="email" type="text" required
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Contraseña</label>
          <div class="mt-2">
            <input id="password" v-model="password" name="password" type="password" required
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
          </div>
        </div>

        <div>
          <button type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            :disabled="isLoading">
            {{ isLoading ? 'Validando...' : 'Iniciar Sesión' }}
          </button>
        </div>
      </form>

      <!-- Modal de selección de empresa -->
      <div v-if="showEmpresaModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Seleccione Empresa
                  </h3>
                  <div class="mt-4">
                    <select 
                      v-model="selectedTerceroId"
                      class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      required
                    >
                      <option value="" disabled>Seleccione una empresa</option>
                      <option v-for="tercero in empresasUsuario" :key="tercero.id" :value="tercero.id">
                        {{ tercero.nombre }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                type="button"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                @click="completeLogin"
                :disabled="isLoading || !selectedTerceroId"
              >
                {{ isLoading ? 'Accediendo...' : 'Ingresar' }}
              </button>
              <button 
                type="button"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                @click="showEmpresaModal = false"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>

      <p v-if="errorMessage" class="mt-2 text-center text-sm text-red-600">
        {{ errorMessage }}
      </p>
      <div class="mt-4 text-center">
        <p class="text-sm text-gray-600">
          ¿Quieres registrarte?
          <router-link to="/register" class="font-medium text-indigo-600 hover:text-indigo-500">
            Registro
          </router-link>
        </p>
      </div>
      <div class="mt-4 text-center">
        <p class="text-sm text-gray-600">
          ¿Olvidaste tu contraseña?
          <router-link to="/password-reset" class="font-medium text-indigo-600 hover:text-indigo-500">
            Recuperar
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
      isLoading: false,
      showEmpresaModal: false,
      userData: null,
      empresasUsuario: [],
      selectedTerceroId: '',
      selectedTerceroNombre: ''
    };
  },
  methods: {
    async validateCredentials() {
      this.isLoading = true;
      this.errorMessage = '';
      
      try {
        // Intentar primero con el endpoint /api/login/ como indica la documentación
        try {
          const loginResponse = await axios.post('http://144.76.41.52:8070/api/login/', {
            email: this.email,
            password: this.password
          });
          
          if (loginResponse.data && loginResponse.data.access) {
            await this.procesarLoginExitoso(loginResponse.data);
            return;
          }
        } catch (loginError) {
          // Continuar con el siguiente intento si falla
        }
        
        // Si falla, intentar con token/ usando username
        try {
          const tokenResponse = await axios.post('http://144.76.41.52:8070/api/token/', {
            username: this.email,
            password: this.password
          });
          
          if (tokenResponse.data && tokenResponse.data.access) {
            await this.procesarLoginExitoso(tokenResponse.data);
            return;
          }
        } catch (tokenError) {
          console.log('Intento con username en /api/token/ falló:', tokenError.response?.data);
        }
        
        // Último intento con token/ usando email
        try {
          const emailTokenResponse = await axios.post('http://144.76.41.52:8070/api/token/', {
            email: this.email,
            password: this.password
          });
          
          if (emailTokenResponse.data && emailTokenResponse.data.access) {
            await this.procesarLoginExitoso(emailTokenResponse.data);
            return;
          }
        } catch (emailTokenError) {
          // Si llegamos aquí, todos los intentos han fallado
          this.errorMessage = "Credenciales incorrectas. Verifique su usuario y contraseña.";
        }
      } catch (error) {
        this.errorMessage = "Error en la validación. Intente nuevamente.";
      } finally {
        this.isLoading = false;
      }
    },
    
    // Método auxiliar para procesar login exitoso
    async procesarLoginExitoso(responseData) {
      const tempToken = responseData.access;
      this.userData = responseData;
      
      try {
        const empresasResponse = await axios.get('http://144.76.41.52:8070/api/usuariosTerceros/', {
          headers: {
            'Authorization': `Bearer ${tempToken}`
          }
        });
        
        if (empresasResponse.data && empresasResponse.data.length > 0) {
          const relacionesUsuario = empresasResponse.data.filter(relacion => 
            relacion.usuario.id === this.userData.user.id
          );
          
          if (relacionesUsuario.length === 0) {
            this.errorMessage = "No tiene empresas asociadas a su cuenta.";
            return;
          }
          
          // Eliminar duplicados
          const tercerosUnicos = [];
          const terceroIds = new Set();
          relacionesUsuario.forEach(relacion => {
            if (!terceroIds.has(relacion.tercero.id)) {
              terceroIds.add(relacion.tercero.id);
              tercerosUnicos.push(relacion.tercero);
            }
          });
          
          this.empresasUsuario = tercerosUnicos;

          // Si solo hay una empresa, hacer login automático
          if (this.empresasUsuario.length === 1) {
            this.selectedTerceroId = this.empresasUsuario[0].id;
            this.selectedTerceroNombre = this.empresasUsuario[0].nombre;
            await this.completeLogin();
          } else {
            // Si hay más de una empresa, mostrar el modal
            this.showEmpresaModal = true;
          }
        } else {
          this.errorMessage = "No se encontraron empresas en el sistema.";
        }
      } catch (error) {
        this.errorMessage = "Error al obtener las empresas asociadas.";
      }
    },
    
    async completeLogin() {
      this.isLoading = true;
      this.errorMessage = '';
      
      try {
        const terceroSeleccionado = this.empresasUsuario.find(t => t.id === this.selectedTerceroId);
        this.selectedTerceroNombre = terceroSeleccionado ? terceroSeleccionado.nombre : '';
        
        // Guardar información completa en localStorage
        localStorage.setItem('accessToken', this.userData.access);
        localStorage.setItem('refreshToken', this.userData.refresh);
        
        // Guardar información del usuario y tercero seleccionado
        const userInfo = {
          ...this.userData.user,
          tipo: this.userData.user.tipo,
          terceroId: this.selectedTerceroId,
          terceroNombre: this.selectedTerceroNombre
        };
        

        
        localStorage.setItem('user', JSON.stringify(userInfo));
        localStorage.setItem('user_type', userInfo.tipo);
        
        // Guardar tercero seleccionado
        localStorage.setItem('selectedTercero', JSON.stringify({
          id: this.selectedTerceroId,
          nombre: this.selectedTerceroNombre
        }));
        
        // Configurar el token de autorización global para Axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.userData.access}`;

        
        // Verificar si hay una ruta guardada
        const redirectTo = sessionStorage.getItem('redirectTo');
        sessionStorage.removeItem('redirectTo'); // Limpiar después de usar

        // Redirigir a la ruta guardada o a solicitudes por defecto
        this.$router.push(redirectTo || '/solicitudes');
      } catch (error) {

        this.errorMessage = "Ocurrió un error al finalizar el proceso de inicio de sesión.";
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>