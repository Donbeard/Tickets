<template>
    <div :class="['flex flex-col space-y-1.5 text-center sm:text-left', className]">
      <slot></slot>
    </div>
  </template>
  
  <script setup>
  defineProps({
    className: {
      type: String,
      default: '',
    },
  })
  </script>