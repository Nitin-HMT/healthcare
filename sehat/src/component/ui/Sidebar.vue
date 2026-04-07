<template>
  <!-- Desktop + Tablet Sidebar -->
  <aside
    class="hidden md:flex flex-col justify-between h-screen fixed bg-teal-600 shadow transition-all duration-300 ease-in-out z-40"
    :class="ui.isSidebarCollapsed ? 'w-16' : 'w-64'"
  >
    <!-- Top: Logo -->
    <div class="p-4">
      <div class="flex items-center space-x-2 text-white">
        <Avatar
          :shape="'square'"
          :ref_for="true"
          image="/files/2_bg_cr.png"
          label="EY"
          size="xl"
        />
        <span
          v-if="!ui.isSidebarCollapsed"
          class="text-xl font-bold text-white"
        >
          {{ companyStore.company || "Doctor@oncloud" }}
        </span>
      </div>
    </div>
    <!-- Middle: Navigation -->
    <nav class="flex-1 px-2 space-y-2 text-white">
      <SidebarItem
        v-if="
          userStore.role.includes('OPD Doctor') ||
          userStore.role.includes('Receptionist')
        "
        :icon="Stethoscope"
        label="OPD"
        to="/opd"
        :collapsed="ui.isSidebarCollapsed"
      />

      <SidebarItem
        v-if="false"
        :icon="Bed"
        label="IPD"
        to="/ipd"
        :collapsed="ui.isSidebarCollapsed"
      />
      <!-- v-if="userStore.role.includes('OPD Doctor') || userStore.role.includes('Nurse')" -->
      <SidebarItem
        v-if="false"
        :icon="FlaskConical"
        label="Labs"
        to="/labs"
        :collapsed="ui.isSidebarCollapsed"
      />
      <!-- v-if="userStore.role.includes('OPD Doctor')" -->
      <SidebarItem
        v-if="
          userStore.role.includes('Sales Manager') && false
        "
        :icon="Coins"
        label="Pharmacy"
        to="/billing"
        :collapsed="ui.isSidebarCollapsed"
      />
      <!-- v-if="userStore.role.includes('Billing') || userStore.role.includes('Accounts')" -->
    </nav>

    <!-- Bottom: Avatar + Collapse Button -->
    <div class="p-4 flex flex-col items-start space-y-2">
      <SidebarUserPopover :collapsed="ui.isSidebarCollapsed" />
    </div>
    <div class="mb-12 p-4 flex items-end space-y-2">
      <button
        @click="ui.toggleSidebar"
        class="text-gray-500 hover:text-teal-600 transition"
        aria-label="Toggle Sidebar"
      >
        <ChevronsRight
          class="w-6 h-6 text-white"
          v-if="ui.isSidebarCollapsed"
        />
        <ChevronsLeft
          class="w-6 h-6 text-white"
          v-if="!ui.isSidebarCollapsed"
        />
      </button>
    </div>
  </aside>

  <!-- Mobile Bottom Nav -->
  <MobileNavBar class="md:hidden" />
</template>

<script setup>
import { Avatar } from "frappe-ui";
import SidebarItem from "./SidebarItem.vue";
import SidebarUserPopover from "./SidebarUserPopover.vue";
import MobileNavBar from "./MobileNavBar.vue";
import {
  Stethoscope,
  FlaskConical,
  Coins,
  Bed,
  ChevronsRight,
  ChevronsLeft,
} from "lucide-vue-next";
import { useUiStore } from "@/stores/UiStore";
import { useUserStore } from "@/stores/userStore";
import { useCompanyStore } from "@/stores/companyStore";

const ui = useUiStore();
const userStore = useUserStore();
const companyStore = useCompanyStore();
</script>

<style scoped>
/* Optional styles here */
</style>
