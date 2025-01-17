<template>
    <DialogRoot v-bind="$attrs">
      <slot></slot>
    </DialogRoot>
  </template>
  
  <script setup>
  import { DialogRoot } from 'radix-vue'
  </script>