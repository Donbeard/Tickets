<template>
  <div class="min-h-screen flex-1 flex-col justify-center px-6 py-5 lg:px-8">

    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-10 w-auto" src="https://static.wixstatic.com/media/7a7799_d00b73646de9440f88c6f421422244a3.png" alt="Your Company" />
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Iniciar Sesión</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <!-- Paso 1: Formulario de validación de credenciales -->
      <form v-if="!isValidated" class="space-y-6" @submit.prevent="validateCredentials">
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
            {{ isLoading ? 'Validando...' : 'Validar Credenciales' }}
          </button>
        </div>
      </form>

      <!-- Paso 2: Selección de empresa -->
      <form v-else class="space-y-6" @submit.prevent="completeLogin">
        <div>
          <label for="empresa" class="block text-sm font-medium leading-6 text-gray-900">Seleccione Empresa</label>
          <div class="mt-2">
            <select id="empresa" v-model="selectedTerceroId" 
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              required>
              <option value="" disabled>Seleccione una empresa</option>
              <option v-for="tercero in empresasUsuario" :key="tercero.id" :value="tercero.id">
                {{ tercero.nombre }}
              </option>
            </select>
          </div>
        </div>

        <div class="flex gap-4">
          <button type="button" @click="isValidated = false"
            class="flex w-1/2 justify-center rounded-md bg-gray-200 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-800 shadow-sm hover:bg-gray-300">
            Volver
          </button>
          <button type="submit"
            class="flex w-1/2 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500"
            :disabled="isLoading || !selectedTerceroId">
            {{ isLoading ? 'Accediendo...' : 'Ingresar' }}
          </button>
        </div>
      </form>

      <p v-if="errorMessage" class="mt-2 text-center text-sm text-red-600">
        {{ errorMessage }}
      </p>
      <div class="mt-4 text-center" v-if="!isValidated">
        <p class="text-sm text-gray-600">
          ¿Quieres registrarte?
          <router-link to="/register" class="font-medium text-indigo-600 hover:text-indigo-500">
            Registro
          </router-link>
        </p>
      </div>
      <div class="mt-4 text-center" v-if="!isValidated">
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
      isValidated: false,
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
          console.log('Intento con /api/login/ falló:', loginError.response?.data);
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
          console.log('Intento con email en /api/token/ falló:', emailTokenError.response?.data);
          // Si llegamos aquí, todos los intentos han fallado
          this.errorMessage = "Credenciales incorrectas. Verifique su usuario y contraseña.";
        }
      } catch (error) {
        console.error("Error general en validación:", error);
        this.errorMessage = "Error en la validación. Intente nuevamente.";
      } finally {
        this.isLoading = false;
      }
    },
    
    // Método auxiliar para procesar login exitoso
    async procesarLoginExitoso(responseData) {
      // Guardar token temporalmente
      const tempToken = responseData.access;
      this.userData = responseData;
      
      try {
        // Obtener las empresas asociadas al usuario
        const empresasResponse = await axios.get('http://144.76.41.52:8070/api/usuariosTerceros/', {
          headers: {
            'Authorization': `Bearer ${tempToken}`
          }
        });
        
        if (empresasResponse.data && empresasResponse.data.length > 0) {
          console.log('Todas las relaciones usuario-tercero:', empresasResponse.data);
          console.log('ID del usuario actual:', this.userData.user.id);
          console.log('Datos completos del usuario:', this.userData.user);
          console.log('Tipo de usuario:', this.userData.user.tipo);
          
          // Filtrar manualmente las relaciones para este usuario específico
          const relacionesUsuario = empresasResponse.data.filter(relacion => 
            relacion.usuario.id === this.userData.user.id
          );
          
          console.log('Relaciones filtradas para este usuario:', relacionesUsuario);
          
          if (relacionesUsuario.length === 0) {
            this.errorMessage = "No tiene empresas asociadas a su cuenta.";
            return;
          }
          
          this.empresasUsuario = relacionesUsuario.map(relacion => relacion.tercero);
          
          // Eliminar duplicados si es necesario (por ID de tercero)
          const tercerosUnicos = [];
          const terceroIds = new Set();
          
          this.empresasUsuario.forEach(tercero => {
            if (!terceroIds.has(tercero.id)) {
              terceroIds.add(tercero.id);
              tercerosUnicos.push(tercero);
            }
          });
          
          this.empresasUsuario = tercerosUnicos;
          this.isValidated = true;
        } else {
          this.errorMessage = "No se encontraron empresas en el sistema.";
        }
      } catch (error) {
        console.error("Error al obtener empresas:", error);
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
        
        console.log('Guardando información de usuario:', userInfo);
        console.log('Tipo de usuario a guardar:', userInfo.tipo);
        
        localStorage.setItem('user', JSON.stringify(userInfo));
        localStorage.setItem('user_type', userInfo.tipo);
        
        // Guardar tercero seleccionado
        localStorage.setItem('selectedTercero', JSON.stringify({
          id: this.selectedTerceroId,
          nombre: this.selectedTerceroNombre
        }));
        
        // Configurar el token de autorización global para Axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.userData.access}`;
        
        console.log('Login completado. Usuario:', userInfo);
        console.log('Tercero seleccionado:', {id: this.selectedTerceroId, nombre: this.selectedTerceroNombre});
        
        // Verificar si hay una ruta guardada
        const redirectTo = sessionStorage.getItem('redirectTo');
        sessionStorage.removeItem('redirectTo'); // Limpiar después de usar

        // Redirigir a la ruta guardada o a solicitudes por defecto
        this.$router.push(redirectTo || '/solicitudes');
      } catch (error) {
        console.error("Error al completar login:", error);
        this.errorMessage = "Ocurrió un error al finalizar el proceso de inicio de sesión.";
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>