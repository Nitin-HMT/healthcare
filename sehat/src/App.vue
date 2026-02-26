<script setup>
import Sidebar from "@/component/ui/Sidebar.vue";
import PageHeader from "@/component/ui/PageHeader.vue";
import { useUiStore } from "@/stores/UiStore";
import { useUserStore } from "@/stores/userStore";

const ui = useUiStore();
const user =useUserStore();
</script>

<template>
  <div class="flex">
    <Sidebar v-if="user.avatar.length"/>
    
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
      <PageHeader v-if="user.avatar.length"/>
      <div v-else class=" text-xs text-teal-700">Welcome, Login Please</div>
      <!-- <div class="pt-20">{{ user.avatar.length }}</div> -->
      <RouterView class="mt-14" />

    </div>
  </div>
</template>
