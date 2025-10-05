<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-t shadow md:hidden z-50">
    <ul class="flex justify-around items-center h-14">
      <!-- OPD -->
      <li v-if="userStore.role.includes('OPD Doctor') || userStore.role.includes('Receptionist')">
        <RouterLink to="/opd" class="flex flex-col items-center text-xs text-gray-600 hover:text-teal-700">
          <Stethoscope class="w-5 h-5" />
          <span>OPD</span>
        </RouterLink>
      </li>

      <!-- IPD -->
      <li v-if="userStore.role.includes('OPD Doctor') || userStore.role.includes('Nurse')">
        <RouterLink to="/ipd" class="flex flex-col items-center text-xs text-gray-600 hover:text-teal-700">
          <Bed class="w-5 h-5" />
          <span>IPD</span>
        </RouterLink>
      </li>

      <!-- Labs -->
      <li v-if="userStore.role.includes('Lab Technician')">
        <RouterLink to="/labs" class="flex flex-col items-center text-xs text-gray-600 hover:text-teal-700">
          <Beaker class="w-5 h-5" />
          <span>Labs</span>
        </RouterLink>
      </li>

      <!-- Billing / Plan -->
      <li v-if="userStore.role.includes('FinanceManager') || userStore.role.includes('ClinicOwner')">
        <RouterLink to="/billing" class="flex flex-col items-center text-xs text-gray-600 hover:text-teal-700">
          <Coins class="w-5 h-5" />
          <span>Plan</span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { Stethoscope, Bed, Beaker, Coins } from 'lucide-vue-next'

const userStore = useUserStore()
</script>

<style scoped>
/* Optional additional styling */
</style>
