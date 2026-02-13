<template>
  <!-- v-if="!patientStore.sel_pat" -->
  <div class="m-1 md:grid md:grid-cols-2">
    <div class="col-span-2"><Summary /></div>
    <div
      class="m-2 p-2 bg-white drop-shadow-xl rounded-md transition-all duration-300 ease-in-out"
    >
      <div class="">Current Appointments</div>
      <AppointQueue
        v-if="!appoint_flag"
        class="transition-opacity duration-3000 ease-in-out"
      />
      <NewAppointment
        v-else
        class="transition-opacity duration-3000 ease-in-out"
      />
    </div>
    <div
      class="m-2 p-2 bg-white drop-shadow-xl rounded-md shadow-red-500 transition-all duration-300 ease-in-out"
    >
      <OpdTasks />
    </div>
    <!-- <div class="m-2 bg-white ">
            Cold Call Dashboard
        </div>    
        <div class="m-2 bg-white ">
            Clinic Management- Room Assignments, Doctor Information, DBs
            {{appointStore.followup_pending}}
        </div>
        <div class="m-2 bg-white ">
            Emergency Alerts
        </div> -->
  </div>
</template>
<script setup>
import AppointQueue from "@/component/opd/dashboard/AppointmentQueue.vue";
import OpdTasks from "@/component/opd/dashboard/OpdTasks.vue";
import Summary from "@/component/opd/dashboard/SummaryCards.vue";
import { useAppointmentStore } from "@/stores/appointmentStore.js";
import { ref, onMounted, onUnmounted } from "vue";
import NewAppointment from "@/component/opd/patient/NewAppointment.vue";
import { appoint } from "@/composables/useAppointmentUtils.js";

const appointStore = useAppointmentStore();
const counter = ref(0);
let intervalId = null;

const { appoint_flag } = appoint();

//Keep Calling the Appointment Book for updation every 30 secs
const myFunction = () => {
  counter.value++;
  console.log("Refreshed Appointments", counter.value);
  appointStore.setAppointments();
  // Add your desired logic here
};

onMounted(() => {
  // Call myFunction every 2 minutes (120,000 milliseconds)
  intervalId = setInterval(myFunction, 30 * 1000);
});

onUnmounted(() => {
  // Clear the interval when the component is unmounted
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>
