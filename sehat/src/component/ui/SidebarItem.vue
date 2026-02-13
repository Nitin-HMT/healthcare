<template>
  <RouterLink
    :to="to"
    class="flex items-center space-x-3 px-4 py-2 rounded-md transition-colors"
    :class="[
      isActive
        ? 'bg-teal-100 text-teal-700 font-semibold'
        : 'text-white hover:bg-white hover:text-teal-700',
      collapsed ? 'justify-center' : 'justify-start',
    ]"
  >
    <slot name="icon">
      <component :is="icon" stroke-width="2.5" :size="32" class="h-6 w-6" />
    </slot>
    <span v-if="!collapsed" class="truncate">{{ label }}</span>
  </RouterLink>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const props = defineProps({
  icon: String,
  label: String,
  to: String,
  collapsed: Boolean,
});

const route = useRoute();
const isActive = computed(() => route.path.startsWith(props.to));
</script>
