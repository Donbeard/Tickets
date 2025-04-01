<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-6 py-5 lg:px-8">
    <div class="w-full max-w-md">
      <div class="bg-white p-8 rounded-lg shadow-md">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
          <img class="mx-auto h-10 w-auto" src="https://static.wixstatic.com/media/7a7799_d00b73646de9440f88c6f421422244a3.png" alt="Your Company" />
          <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Registro usuario</h2>
        </div>
        <form @submit.prevent="registerUser" class="mt-8 space-y-6">
          <div class="space-y-4">
            <div>
              <label for="first_name" class="block text-sm font-medium text-gray-700">Nombres</label>
              <input
                id="first_name"
                type="text"
                v-model="form.first_name"
                @input="handleFirstNameInput"
                required
                placeholder="Ingrese sus nombres"
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label for="last_name" class="block text-sm font-medium text-gray-700">Apellidos</label>
              <input
                id="last_name"
                type="text"
                v-model="form.last_name"
                @input="handleLastNameInput"
                required
                placeholder="Ingrese sus apellidos"
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">NITs de Empresas</label>
              <div class="space-y-2">
                <div v-for="(nit, index) in form.nits" :key="index" class="flex items-center space-x-2">
                  <div class="flex-1 relative">
                    <input
                      type="number"
                      v-model="form.nits[index].value"
                      required
                      placeholder="Ingrese el NIT de la empresa"
                      class="block w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      :class="[form.nits[index].isValid === false ? 'border-red-500' : form.nits[index].isValid ? 'border-green-500' : 'border-gray-300']"
                      @blur="validateNit(index)"
                    />
                    <button 
                      v-if="form.nits.length > 1"
                      type="button" 
                      @click="removeNit(index)" 
                      title="Eliminar empresa"
                      class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 focus:outline-none"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    
                    <!-- Mensaje de validación -->
                    <div v-if="form.nits[index].isValid === false" class="text-red-500 text-xs mt-1">
                      Empresa no encontrada
                    </div>
                    <div v-else-if="form.nits[index].isValid" class="text-green-600 text-xs mt-1">
                      <strong>{{ form.nits[index].empresaNombre }}</strong>
                    </div>
                  </div>
                  
                  <!-- Botón + solo en el último input -->
                  <button 
                    v-if="index === form.nits.length - 1"
                    type="button" 
                    @click="addNit" 
                    title="Añadir empresa"
                    class="p-1.5 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
              <input
                id="email"
                type="email"
                v-model="form.email"
                required
                placeholder="Ingrese su correo electrónico"
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
              <input
                id="password"
                type="password"
                v-model="form.password"
                required
                placeholder="Ingrese su contraseña"
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label for="whatsapp" class="block text-sm font-medium text-gray-700">Telefono</label>
              <input
                id="whatsapp"
                type="number"
                v-model="form.whatsapp"
                placeholder="Ingrese su número de WhatsApp"
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label for="cargo" class="block text-sm font-medium text-gray-700">Cargo</label>
              <input
                id="cargo"
                type="text"
                v-model="form.cargo"
                @input="handleCargoInput"
                placeholder="Ingrese su cargo"
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out"
            >
              Registrar
            </button>
          </div>
          <div v-if="statusMessage" :class="['mt-4 p-2 rounded', isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700']">
            {{ statusMessage }}
          </div>
          <div v-if="errors.length > 0" class="mt-4 p-2 rounded bg-red-100 text-red-700">
            <ul>
              <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
            </ul>
          </div>
          <div class="text-center">
            <p class="text-sm text-gray-600">
              ¿Ya tienes una cuenta?
              <router-link to="/ingreso" class="font-medium text-indigo-600 hover:text-indigo-500">
                Iniciar sesión
              </router-link>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '@/apiClient';

export default {
  data() {
    return {
      form: {
        first_name: '',
        last_name: '',
        nits: [{
          value: null,
          isValid: null,
          empresaNombre: '',
          terceroId: null
        }],
        email: '',
        password: '',
        whatsapp: null,
        username: '', 
        tipo: 'C',
        is_active: true,
        is_staff: false,
        is_superuser: false,
        cargo: '',
      },
      statusMessage: '',
      isSuccess: false,
      errors: [],
      isValidatingNit: false,
    };
  },
  computed: {
    isFormValid() {
      const hayNitsValidos = this.form.nits.some(nit => nit.isValid === true);
      const todosNitsValidos = this.form.nits.every(nit => nit.isValid === true || nit.value === null || nit.value === '');
      
      return hayNitsValidos && todosNitsValidos;
    }
  },
  methods: {
    addNit() {
      const newNit = {
        value: null,
        isValid: null,
        empresaNombre: '',
        terceroId: null
      };
      
      this.form.nits.push(newNit);
    },
    
    removeNit(index) {
      if (this.form.nits.length > 1) {
        this.form.nits.splice(index, 1);
      }
    },
    
    async validateNit(index) {
      const nit = this.form.nits[index].value;
      
      if (!nit) {
        this.form.nits[index].isValid = null;
        this.form.nits[index].empresaNombre = '';
        this.form.nits[index].terceroId = null;
        return;
      }
      
      this.isValidatingNit = true;
      
      try {
        this.form.nits[index].isValid = null;
        this.form.nits[index].empresaNombre = '';
        this.form.nits[index].terceroId = null;
        
        
        const response = await apiClient.get(`/terceros/`);
        
        
        const tercero = response.data.find(t => t.nit.toString() === nit.toString());
        
        if (tercero) {
          
          const nitData = {
            value: nit,
            isValid: true,
            empresaNombre: tercero.nombre || `Empresa ${tercero.id}`,
            terceroId: tercero.id
          };
          

          
          this.form.nits[index] = nitData;
          
          
          // Determinar el tipo de usuario según el NIT
          this.determinarTipoUsuario(nit);
        } else {
          this.form.nits[index].isValid = false;
          this.form.nits[index].empresaNombre = '';
          this.form.nits[index].terceroId = null;
          

        }
      } catch (error) {

        this.form.nits[index].isValid = false;
        this.form.nits[index].empresaNombre = '';
        this.form.nits[index].terceroId = null;
      } finally {
        this.isValidatingNit = false;
      }
    },
    
    // Nuevo método para determinar el tipo de usuario según el NIT
    determinarTipoUsuario(nit) {
      // Lista de NITs que corresponden a usuarios tipo S (Supervisor)
      const nitsSupervisores = ['901430071','901244174']; // Añade aquí todos los NITs que deban ser tipo S
      
      if (nitsSupervisores.includes(nit.toString())) {

        this.form.tipo = 'S';
      } else {

        this.form.tipo = 'C';
      }
    },
    
    traducirMensajeError(mensaje) {
      const traducciones = {
        "A user with that username already exists.": "Ya existe un usuario con ese nombre de usuario.",
        "This field may not be blank.": "Este campo no puede estar vacío.",
        "Enter a valid email address.": "Ingrese una dirección de correo electrónico válida.",
        "Ensure this field has at least 8 characters.": "Asegúrese de que este campo tenga al menos 8 caracteres.",
        "object does not exist": "El objeto no existe en el sistema.",
        "The password is too similar to the username.": "La contraseña es muy similar al nombre de usuario.",
        "This password is too common.": "Esta contraseña es demasiado común.",
        "This password is entirely numeric.": "Esta contraseña es completamente numérica.",
        "Invalid token.": "Token inválido.",
        "User not found.": "Usuario no encontrado.",
        // Añadir más traducciones según sea necesario
      };
      
      // Buscar coincidencias exactas
      if (traducciones[mensaje]) {
        return traducciones[mensaje];
      }
      
      // Buscar coincidencias parciales
      for (const key in traducciones) {
        if (mensaje.includes(key)) {
          return traducciones[key];
        }
      }
      
      // Si no hay traducción, devolver el mensaje original
      return mensaje;
    },
    
    async registerUser() {
      try {
        this.statusMessage = ''; 
        this.errors = [];
        
        if (!this.isFormValid) {
          this.errors.push("Debe tener al menos un NIT válido para registrarse");
          return;
        }
        
        const nitsValidos = this.form.nits
          .filter(nit => nit.isValid && nit.terceroId)
          .map(nit => nit.terceroId);
        
        if (nitsValidos.length === 0) {
          this.errors.push("Debe ingresar al menos un NIT de empresa válido");
          return;
        }
        
        if (!this.form.email) {
          this.errors.push("El correo electrónico es obligatorio");
          return;
        }
        
        if (!this.form.password) {
          this.errors.push("La contraseña es obligatoria");
          return;
        }
        
        if (this.form.password.length < 8) {
          this.errors.push("La contraseña debe tener al menos 8 caracteres");
          return;
        }
        
        // Verificar si alguno de los NITs requiere tipo S
        const nitsIngresados = this.form.nits
          .filter(nit => nit.isValid && nit.value)
          .map(nit => nit.value.toString());
          
        const nitsSupervisores = ['901430071']; // Misma lista que en determinarTipoUsuario
        const debeSerSupervisor = nitsIngresados.some(nit => nitsSupervisores.includes(nit));
        
        if (debeSerSupervisor) {
          this.form.tipo = 'S';

        }
        
        const formData = {
          first_name: this.form.first_name,
          last_name: this.form.last_name,
          email: this.form.email,
          password: this.form.password,
          whatsapp: this.form.whatsapp ? parseInt(this.form.whatsapp) : null,
          is_active: true,
          is_staff: false,
          is_superuser: false,
          username: this.form.email,
          nombre: `${this.form.first_name} ${this.form.last_name}`,
          tipo: this.form.tipo,
          cargo: this.form.cargo || null,
        };
        

        
        let usuarioCreado = false;
        let relacionesExitosas = false;
        let userResponse = null;
        
        try {
          // 1. Crear usuario
          console.log('', {
            ...formData,
            password: '[REDACTED]' // No logear la contraseña
          });
          userResponse = await apiClient.post('/usuarios/', formData);
          usuarioCreado = true;
          
          // 2. Obtener token

          const loginResponse = await apiClient.post('/token/', {
            username: this.form.email,
            password: this.form.password
          });
          
          if (!loginResponse.data?.access) {

            throw new Error('No se pudo obtener token de autenticación');
          }

          
          const token = loginResponse.data.access;
          
          // 3. Crear relaciones

          const relacionesPromises = nitsValidos.map(async (terceroId) => {
            const usuarioTerceroData = {
              usuario: userResponse.data.id,
              tercero: terceroId
            };
            
            try {
              console.log(``, {
                headers: { Authorization: `Bearer ${token ? 'TOKEN_PRESENTE' : 'TOKEN_AUSENTE'}` }
              });
              
              const response = await apiClient.post('/usuariosTerceros/', usuarioTerceroData, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              
              return response;
              
            } catch (error) {
              console.error(``, {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                headers: error.response?.headers
              });
              throw error;
            }
          });
          
          await Promise.all(relacionesPromises);
          relacionesExitosas = true;
          
        } catch (error) {
          console.error('', {
            fase: usuarioCreado ? 'creación de relaciones' : 'creación de usuario',
            status: error.response?.status,
            message: error.message,
            data: error.response?.data
          });
          throw error;
        }
        
        if (relacionesExitosas) {
          this.statusMessage = '¡Usuario registrado exitosamente!';
          this.isSuccess = true;
          setTimeout(() => {
            this.$router.push('/login');
          }, 2000);
        } else if (usuarioCreado) {
          this.statusMessage = 'Usuario creado pero no se pudieron vincular las empresas';
          this.errors.push('Se creó el usuario pero no se pudieron vincular las empresas. Por favor contacte al administrador.');
          this.isSuccess = false;
        }
      } catch (error) {
        this.isSuccess = false;
        if (error.response?.status === 401) {
          console.error('', {
            endpoint: error.config?.url,
            method: error.config?.method,
            hasToken: !!error.config?.headers?.Authorization,
            responseData: error.response?.data
          });
          this.errors.push(`No autorizado al intentar ${error.config?.method} ${error.config?.url}`);
        } else if (error.response?.status === 0 || !error.response) {
          this.errors.push('No se pudo conectar con el servidor. Verifique su conexión a internet.');
        } else if (error.response?.status === 400) {
          const errorData = error.response.data;
          
          for (const key in errorData) {
            if (Array.isArray(errorData[key])) {
              errorData[key].forEach(msg => {
                const mensajeTraducido = this.traducirMensajeError(msg);
                this.errors.push(`${key}: ${mensajeTraducido}`);
              });
            } else {
              const mensajeTraducido = this.traducirMensajeError(errorData[key]);
              this.errors.push(`${key}: ${mensajeTraducido}`);
            }
          }
        } else if (error.response?.status === 404) {
          this.errors.push('El servicio de registro no está disponible en este momento.');
        } else if (error.response?.status === 500) {
          this.errors.push('Error en el servidor. Por favor, intente más tarde o contacte con soporte.');
        } else {
          this.statusMessage = 'Hubo un problema al registrar el usuario. Por favor, intente de nuevo.';
        }
      }
    },
    capitalizeFirstLetter(string) {
      if (!string) return '';
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    },
    handleFirstNameInput(event) {
      this.form.first_name = this.capitalizeFirstLetter(event.target.value);
    },
    handleLastNameInput(event) {
      this.form.last_name = this.capitalizeFirstLetter(event.target.value);
    },
    handleCargoInput(event) {
      this.form.cargo = this.capitalizeFirstLetter(event.target.value);
    }
  },
  async mounted() {
    try {
      await apiClient.get('/terceros/');
    } catch (error) {
      console.error('', error);
    }
  },
};
</script>