<template>
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th v-for="column in columns" 
                :key="column.key" 
                class="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                @click="handleSort(column.key)">
              {{ column.label }}
              <span v-if="sortBy === column.key">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="row in sortedData" :key="row.id" class="hover:bg-gray-50">
            <td v-for="column in columns" 
                :key="column.key" 
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ row[column.key] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      data: { type: Array, required: true },
      columns: { type: Array, required: true }, // [{ key: 'id', label: 'ID' }]
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
          const valA = a[this.sortBy];
          const valB = b[this.sortBy];
          if (valA < valB) return this.sortOrder === 'asc' ? -1 : 1;
          if (valA > valB) return this.sortOrder === 'asc' ? 1 : -1;
          return 0;
        });
      },
    },
    methods: {
      handleSort(column) {
        if (this.sortBy === column) {
          this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
          this.sortBy = column;
          this.sortOrder = 'asc';
        }
      },
    },
  };
  </script>
  