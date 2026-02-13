<template>
  <header
    class="px-4 py-3 bg-white shadow-sm fixed top-0 right-0 w-full z-20"
    :class="[
      'pl-0', // default for mobile
      {
        'md:pl-[70px]': ui.isSidebarCollapsed,
        'md:pl-[260px]': !ui.isSidebarCollapsed,
      },
    ]"
  >
    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
      <!-- Title & Department -->
      <div class="mb-2 md:mb-0">
        <h1 class="text-xl font-semibold text-teal-700">{{ title }}</h1>
        <p v-if="subtitle" class="text-sm text-gray-500">{{ subtitle }}</p>
      </div>
      <div></div>
      <!-- <PatientSearch v-if="showPatientSearch" class="w-180"/> -->
      <!-- Dynamic Tab Actions -->

      <HeaderTabs :tabs="tabs" :activePath="route.path" />
    </div>
  </header>
</template>

<script setup>
import { useRoute } from "vue-router";
import HeaderTabs from "./HeaderTabs.vue";
import { useHeaderConfig } from "@/composables/useHeaderConfig.js";
import PatientSearch from "@/component/opd/patient/PatientSearch.vue";
import { fetchInitialData } from "@/data/initialdata";
import { useUiStore } from "@/stores/UiStore";

const route = useRoute();
const { title, subtitle, tabs, showPatientSearch } = useHeaderConfig();
const ui = useUiStore();
</script>

<style scoped>
/* Styling can be extended as needed */
</style>
