<template>
        <div class="m-2 col-span-2 "
        :class="[userStore.pay_settings?'grid grid-cols-3':'grid grid-cols-2']"
        >
      <div class="my-2 mr-2 p-2 bg-white drop-shadow-xl rounded-md grid-cols-4 gap-2 flex">
        <UsersRound class="w-10 h-10 pt-2 text-gray-600"/>
        <div class="col-span-3">
          <div class="text-xs text-gray-600">Patients In Queue</div>
          <div class="text-3xl pl-6 pt-2 text-gray-700 ">{{ appointStore.appoint_stats[0] }}</div>
        </div>
      </div>
      <div class="my-2 ml-2 p-2 bg-white drop-shadow-xl rounded-md grid-cols-4 gap-2 flex">
        <History class="w-10 h-10 pt-2 text-gray-600"/>
        <div class="col-span-3">
          <div class="text-xs text-gray-600">Avg Wait Time per Consult
            (In mins)</div>
          <div class="text-3xl pl-6 pt-2 text-gray-700">{{ appointStore.appoint_stats[1] }}</div>
        </div>
      </div>
      <div class="m-2 p-2 bg-white drop-shadow-xl rounded-md grid-cols-4 gap-2 flex" v-show="userStore.pay_settings">
        <IndianRupee class="w-10 h-10 pt-2 text-gray-600"/>
        <div class="col-span-3">
          <div class="text-xs text-gray-600">Collection Today</div>
          <div class="text-3xl pl-6 pt-2 text-gray-700">{{ appointStore.appoint_stats[2] }}</div>
        </div>
      </div>
      </div>
</template>
<script setup>
import {UsersRound, History,IndianRupee } from 'lucide-vue-next';
import { useAppointmentStore } from '@/stores/appointmentStore.js'
import { useUserStore } from "@/stores/userStore";
const appointStore = useAppointmentStore();
const userStore = useUserStore();
</script>