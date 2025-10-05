<template>
  <nav class="flex space-x-2 overflow-x-auto">
    <RouterLink
      v-for="tab in tabs"
      :key="tab.to"
      :to="tab.to"
      class="px-4 py-2 text-base font-medium whitespace-nowrap rounded-full transition-colors"
      :class="{
        'bg-teal-100 text-teal-700': activePath.startsWith(tab.to),
        'text-gray-600 hover:text-teal-600 hover:bg-teal-50': !activePath.startsWith(tab.to)
      }"
    >
      {{ tab.label }}
    </RouterLink>
  </nav>
</template>

<script setup>
const props = defineProps({
  tabs: Array,
  activePath: String
})
</script>

<style scoped>
nav::-webkit-scrollbar {
  display: none;
}
nav {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
