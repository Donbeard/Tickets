<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside 
      :class="[
        'bg-gray-800 text-white min-h-screen p-4 transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-16' : 'w-64'
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
          v-for="item in navigation"
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

    <!-- Mobile menu -->
    <div class="md:hidden" v-if="!$route.meta.hideNavbar">
      <Transition
        enter-active-class="transition ease-out duration-100 transform"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75 transform"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div v-if="mobileMenuOpen" class="fixed inset-0 z-40 bg-gray-600 bg-opacity-75" @click="mobileMenuOpen = false"></div>
      </Transition>

      <Transition
        enter-active-class="transition ease-out duration-100 transform"
        enter-from-class="-translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition ease-in duration-75 transform"
        leave-from-class="translate-x-0"
        leave-to-class="-translate-x-full"
      >
        <div v-if="mobileMenuOpen" class="fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 overflow-y-auto">
          <div class="p-4">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center">
                <img class="h-8 w-8 mr-2" src="https://static.wixstatic.com/media/7a7799_d00b73646de9440f88c6f421422244a3.png" alt="Your Company" />
                <span class="text-xl font-semibold text-white">WxSoporte</span>
              </div>
              <button @click="mobileMenuOpen = false" class="text-gray-400 hover:text-white">
                <XMarkIcon class="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <nav>
              <router-link
                v-for="item in navigation"
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
                class="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-base font-medium rounded-md mb-1"
              >
                <LogoutIcon class="mr-3 h-6 w-6" aria-hidden="true" />
                Cerrar sesión
              </button>
            </nav>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Main content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top bar for mobile menu button -->
      <div class="bg-gray-800 text-white md:hidden">
        <div class="flex items-center px-4 py-3">
          <button @click="mobileMenuOpen = true" class="text-gray-400 hover:text-white">
            <Bars3Icon class="h-6 w-6" aria-hidden="true" />
          </button>
          <span class="ml-2 text-xl font-semibold">WxSoporte</span>
        </div>
      </div>

      <!-- Page content -->
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div class="container mx-auto px-6 py-8">
          <router-view></router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Bars3Icon, XMarkIcon, HomeIcon, UsersIcon, FolderIcon, CalendarIcon, ChartBarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import LogoutIcon from '@heroicons/vue/24/outline/ArrowRightOnRectangleIcon'

const router = useRouter()
const mobileMenuOpen = ref(false)
const isCollapsed = ref(true)

const navigation = [
  { name: 'Solicitudes', href: '/solicitudes', icon: HomeIcon, current: true },
  { name: 'Tareas', href: '/tareas', icon: UsersIcon, current: false },
  { name: 'Registro', href: '/register', icon: FolderIcon, current: false },
  { name: '', href: '/', icon: CalendarIcon, current: false },
  { name: '', href: '/', icon: ChartBarIcon, current: false },
]

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const logout = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  router.push('/')
}
</script>