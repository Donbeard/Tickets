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
        <router-link
          v-for="item in updatedNavigation"
          :key="item.name"
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
          <component :is="item.icon" class="h-6 w-6" :class="{ 'mr-3': !isCollapsed }" aria-hidden="true" />
          <span v-if="!isCollapsed">{{ item.name }}</span>
        </router-link>
        <button 
          @click="logout" 
          :class="[
            'text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-base font-medium rounded-md mb-1',
            isCollapsed ? 'justify-center' : ''
          ]"
        >
          <LogoutIcon class="h-6 w-6" :class="{ 'mr-3': !isCollapsed }" aria-hidden="true" />
          <span v-if="!isCollapsed">Cerrar sesión</span>
        </button>
      </nav>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top bar para móvil -->
      <div class="bg-gray-800 text-white md:hidden" v-if="!$route.meta.hideNavbar">
        <div class="flex items-center px-4 py-3">
          <button @click="mobileMenuOpen = true" class="text-gray-400 hover:text-white">
            <Bars3Icon class="h-6 w-6" aria-hidden="true" />
          </button>
          <span class="ml-2 text-xl font-semibold">WxSoporte</span>
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Bars3Icon, XMarkIcon, HomeIcon, ChevronLeftIcon, ChevronRightIcon, DocumentTextIcon, BookmarkIcon, BuildingOfficeIcon } from '@heroicons/vue/24/outline'
import LogoutIcon from '@heroicons/vue/24/outline/ArrowRightOnRectangleIcon'

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
  ]

  // Si no hay tipo de usuario, intentar obtenerlo de nuevo
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
  userType.value = null
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
</script>