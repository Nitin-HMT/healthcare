<script setup>
import Sidebar from "@/component/ui/Sidebar.vue";
import PageHeader from "@/component/ui/PageHeader.vue";
import { useUiStore } from "@/stores/UiStore";

const ui = useUiStore();
</script>

<template>
  <div class="flex">
    <Sidebar />

    <div
      class="flex-1 min-h-screen bg-gray-50 transition-all duration-300"
      :class="[
        'ml-0', // default for mobile
        {
          'md:ml-16': ui.isSidebarCollapsed,
          'md:ml-64': !ui.isSidebarCollapsed,
        },
      ]"
    >
      <PageHeader />
      <RouterView class="mt-14" />
    </div>
  </div>
</template>
