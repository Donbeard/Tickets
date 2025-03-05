<template>
  <div class="w-full bg-white shadow-md rounded-lg overflow-hidden">
    <!-- Barra de búsqueda y botones (opcional) -->
    <div v-if="showHeader" class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 p-4">
      <slot name="header"></slot>
    </div>

    <div class="w-full overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr class="divide-x divide-gray-100">
            <!-- Columna de expansión si es necesaria -->
            <th v-if="expandable" class="w-8 px-1 py-2"></th>
            
            <th v-for="column in columns" 
                :key="column.key" 
                class="px-1 py-1 text-left text-xs text-black tracking-wider cursor-pointer select-none relative"
            >
              <div class="flex items-center justify-between">
                <span @click="handleSort(column.key)">
                  {{ column.label }}
                  <span v-if="sortBy === column.key" class="ml-1">
                    {{ sortOrder === 'asc' ? '▲' : '▼' }}
                  </span>
                </span>
                
                <!-- Filtro dropdown si la columna es filtrable -->
                <div v-if="column.filterable" class="dropdown-container">
                  <slot name="filter" :column="column"></slot>
                </div>
              </div>
            </th>
          </tr>
        </thead>

        <tbody class="bg-white divide-y divide-gray-200">
          <template v-for="(item, index) in sortedData" :key="item.id">
            <!-- Fila principal -->
            <tr :class="getRowClass(index)" class="hover:bg-gray-50 divide-x divide-gray-100">
              <!-- Columna de expansión -->
              <td v-if="expandable" class="px-1 py-2 text-left cursor-pointer w-8">
                <slot name="expand-button" :item="item"></slot>
              </td>

              <!-- Columnas de datos -->
              <td v-for="column in columns" 
                  :key="column.key"
                  :style="column.style"
                  class="px-1 py-1 whitespace-normal text-xs text-black-500 break-words"
              >
                <slot :name="column.key" :item="item" :column="column">
                  {{ formatValue(item, column) }}
                </slot>
              </td>
            </tr>

            <!-- Fila expandible -->
            <tr v-if="expandable && item.showExpanded">
              <td :colspan="columns.length + 1">
                <slot name="expanded-content" :item="item"></slot>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div v-if="showPagination" class="flex items-center justify-between py-6 px-6 bg-white border-t border-gray-200">
      <slot name="pagination"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReusableTable',
  props: {
    data: { 
      type: Array, 
      required: true 
    },
    columns: { 
      type: Array, 
      required: true 
    },
    showHeader: {
      type: Boolean,
      default: false
    },
    showPagination: {
      type: Boolean,
      default: false
    },
    expandable: {
      type: Boolean,
      default: false
    },
    alternateRows: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      sortBy: '',
      sortOrder: 'asc',
    };
  },

  computed: {
    sortedData() {
      if (!this.sortBy) return this.data;
      
      return [...this.data].sort((a, b) => {
        const valA = this.getValue(a, this.sortBy);
        const valB = this.getValue(b, this.sortBy);
        
        if (valA < valB) return this.sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }
  },

  methods: {
    handleSort(column) {
      if (this.sortBy === column) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortBy = column;
        this.sortOrder = 'asc';
      }
      this.$emit('sort', { column, order: this.sortOrder });
    },

    getValue(item, key) {
      return key.split('.').reduce((obj, key) => obj?.[key], item);
    },

    formatValue(item, column) {
      const value = this.getValue(item, column.key);
      if (column.formatter) {
        return column.formatter(value, item);
      }
      return value;
    },

    getRowClass(index) {
      if (!this.alternateRows) return '';
      return index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
    }
  }
};
</script>
  