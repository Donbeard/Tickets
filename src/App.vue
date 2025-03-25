<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar para desktop -->
    <aside 
      :class="[
        'bg-gray-800 text-white min-h-screen p-4 transition-all duration-300 ease-in-out hidden md:block',
        isCollapsed ? 'w-24' : 'w-64'
      ]" 
      v-if="!$route.meta.hideNavbar"
    >
      <!-- Logo and Toggle Button -->
      <div class="flex items-center mb-6 px-2">
        <img class="h-8 w-8 mr-2" src="https://static.wixstatic.com/media/7a7799_d00b73646de9440f88c6f421422244a3.png" alt="WxSoporte" />
        <span v-if="!isCollapsed" class="text-xl font-semibold">WxSoporte</span>
        <button @click="toggleSidebar" class="ml-auto text-white hover:text-gray-300">
          <ChevronLeftIcon v-if="!isCollapsed" class="h-6 w-6" />
          <ChevronRightIcon v-else class="h-6 w-6" />
        </button>
      </div>

      <!-- Navigation Items -->
      <nav>
        <template v-for="item in updatedNavigation" :key="item.name">
          <!-- Para items con href (rutas) -->
          <router-link
            v-if="item.href"
            :to="item.href"
            :class="[
              item.current 
                ? 'bg-gray-900 text-white' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
              'group flex items-center px-2 py-2 text-base font-medium rounded-md mb-1',
              isCollapsed ? 'justify-center' : ''
            ]"
            :aria-current="item.current ? 'page' : undefined"
          >
            <div class="relative">
              <component :is="item.icon" class="h-6 w-6" :class="{ 'mr-3': !isCollapsed }" aria-hidden="true" />
              <div 
                v-if="isCollapsed" 
                class="absolute left-full ml-2 w-auto px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none"
              >
                {{ item.name }}
              </div>
            </div>
            <span v-if="!isCollapsed">{{ item.name }}</span>
          </router-link>

          <!-- Para items con action (como cambiar empresa) -->
          <button
            v-else
            @click="item.action"
            :class="[
              'text-gray-300 hover:bg-gray-700 hover:text-white w-full',
              'group flex items-center px-2 py-2 text-base font-medium rounded-md mb-1',
              isCollapsed ? 'justify-center' : ''
            ]"
          >
            <div class="relative">
              <component :is="item.icon" class="h-6 w-6" :class="{ 'mr-3': !isCollapsed }" aria-hidden="true" />
              <div 
                v-if="isCollapsed" 
                class="absolute left-full ml-2 w-auto px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none"
              >
                {{ item.name }}
              </div>
            </div>
            <span v-if="!isCollapsed">{{ item.name }}</span>
          </button>
        </template>
      </nav>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top bar para móvil -->
      <div class="bg-gray-800 text-white md:hidden" v-if="!$route.meta.hideNavbar">
        <div class="flex items-center justify-between px-4 py-3">
          <div class="flex items-center">
            <button @click="mobileMenuOpen = true" class="text-gray-400 hover:text-white">
              <Bars3Icon class="h-6 w-6" aria-hidden="true" />
            </button>
            <img class="h-8 w-8 ml-3" src="https://static.wixstatic.com/media/7a7799_d00b73646de9440f88c6f421422244a3.png" alt="WxSoporte" />
          </div>
          
          <button
            @click="showCambiarEmpresaModal = true"
            class="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-300 hover:text-white transition-colors duration-150"
          >
            <BuildingOfficeIcon class="h-5 w-5" />
            <span class="font-medium max-w-[150px] truncate">{{ terceroNombre || 'Seleccionar' }}</span>
          </button>
        </div>

        <!-- Menú móvil overlay -->
        <Transition
          enter-active-class="transition ease-out duration-100 transform"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75 transform"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div v-if="mobileMenuOpen" class="fixed inset-0 z-40">
            <!-- Overlay de fondo oscuro -->
            <div class="fixed inset-0 bg-gray-600 bg-opacity-75" @click="mobileMenuOpen = false"></div>

            <!-- Panel de navegación -->
            <div class="fixed inset-y-0 left-0 w-full bg-gray-800 z-50">
              <div class="p-4">
                <div class="flex items-center justify-between mb-6">
                  <div class="flex items-center">
                    <img class="h-8 w-8 mr-2" src="https://static.wixstatic.com/media/7a7799_d00b73646de9440f88c6f421422244a3.png" alt="WxSoporte" />
                    <span class="text-xl font-semibold text-white">WxSoporte</span>
                  </div>
                  <button @click="mobileMenuOpen = false" class="text-gray-400 hover:text-white">
                    <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <nav>
                  <router-link
                    v-for="item in updatedNavigation"
                    :key="item.name"
                    :to="item.href"
                    :class="[
                      item.current 
                        ? 'bg-gray-900 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'group flex items-center px-2 py-2 text-base font-medium rounded-md mb-1'
                    ]"
                    :aria-current="item.current ? 'page' : undefined"
                    @click="mobileMenuOpen = false"
                  >
                    <component :is="item.icon" class="mr-3 h-6 w-6" aria-hidden="true" />
                    {{ item.name }}
                  </router-link>
                  <button 
                    @click="logout" 
                    class="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-base font-medium rounded-md mb-1 w-full"
                  >
                    <LogoutIcon class="mr-3 h-6 w-6" aria-hidden="true" />
                    Cerrar sesión
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Page content -->
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div class="w-full">
          <router-view></router-view>
        </div>
      </main>
    </div>

    <!-- Agregar el modal al final del template -->
    <ChangeTerceros 
      v-if="showCambiarEmpresaModal"
      @close="showCambiarEmpresaModal = false"
      @empresaSeleccionada="handleEmpresaSeleccionada"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Bars3Icon, XMarkIcon, HomeIcon, ChevronLeftIcon, ChevronRightIcon, DocumentTextIcon, BookmarkIcon, ArrowsRightLeftIcon, BuildingOfficeIcon} from '@heroicons/vue/24/outline'
import LogoutIcon from '@heroicons/vue/24/outline/ArrowRightOnRectangleIcon'
import ChangeTerceros from '@/components/Form/change-terceros.vue'

const router = useRouter()
const route = useRoute()
const mobileMenuOpen = ref(false)
const isCollapsed = ref(true)

// Hacer el tipo de usuario reactivo
const userType = ref(null)

// Función para actualizar el tipo de usuario
const updateUserType = () => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    try {
      const userData = JSON.parse(storedUser)
      userType.value = userData.tipo
      console.log('Tipo de usuario actualizado:', userType.value)
    } catch (e) {
      console.error('Error al parsear usuario:', e)
    }
  }
}

// Actualizar cuando cambie el localStorage
window.addEventListener('storage', () => {
  updateUserType()
})

// Actualizar cuando se monte el componente
onMounted(() => {
  updateUserType()
})

// Definir la navegación con control de acceso
const navigation = computed(() => {
  console.log('Calculando navegación para tipo:', userType.value)
  
  const allNavItems = [
    { name: 'Solicitudes', href: '/solicitudes', icon: HomeIcon, allowedTypes: ['S', 'A', 'C'] },
    { name: 'Tareas', href: '/tareas', icon: BookmarkIcon, allowedTypes: ['A', 'S'] },
    { name: 'Modulos', href: '/modulos', icon: DocumentTextIcon, allowedTypes: ['A', 'S'] },
    { name: 'Empresas', href: '/empresas', icon: BuildingOfficeIcon, allowedTypes: ['A', 'C', 'S'] },
    { 
      name: `Cambiar Empresa (${terceroNombre.value || 'No seleccionada'})`, 
      action: () => showCambiarEmpresaModal.value = true, 
      icon: ArrowsRightLeftIcon, 
      allowedTypes: ['A', 'C', 'S'] 
    },
    { 
      name: 'Cerrar Sesión', 
      action: logout, 
      icon: LogoutIcon, 
      allowedTypes: ['A', 'C', 'S'] 
    },
  ]

  if (!userType.value) {
    updateUserType()
  }

  return allNavItems.filter(item => 
    userType.value && item.allowedTypes.includes(userType.value)
  )
})

const updatedNavigation = computed(() => {
  return navigation.value.map(item => {
    return {
      ...item,
      current: item.href === route.path
    }
  })
})

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const logout = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  localStorage.removeItem('user_type')
  localStorage.removeItem('terceroId')
  localStorage.removeItem('terceroNombre')
  router.push('/')
}

// Verificar redirección de GitHub Pages
if (sessionStorage.redirect) {
  const redirect = sessionStorage.redirect
  delete sessionStorage.redirect
  window.location.href = redirect
}

// Verificar el tipo de usuario cada vez que cambia la ruta
router.beforeEach((to, from, next) => {
  updateUserType()
  next()
})

const showCambiarEmpresaModal = ref(false)
const terceroNombre = ref(localStorage.getItem('terceroNombre'))

const handleEmpresaSeleccionada = (empresa) => {
  terceroNombre.value = empresa.nombre
  showCambiarEmpresaModal.value = false
}
</script>