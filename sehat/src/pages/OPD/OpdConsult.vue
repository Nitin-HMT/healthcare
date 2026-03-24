<template>
  <div class="hidden md:flex h-screen overflow-hidden flex-grow" :key="app_id">
    <div class="flex-grow m-1.5 flex flex-col min-h-0 overflow-hidden">
      
      <!-- Patient Panel — fixed height, never moves -->
      <div class="flex-none bg-white rounded-t-md drop-shadow-md">
        <div class="bg-teal-50 rounded-t-md">
          <PatientPanel
            :Pat_id="pat_id"
            :Request_from="route.name"
            class="mx-3"
          />
        </div>
      </div>

      <!-- Interaction — takes remaining height, handles its own scroll -->
      <div class="flex-1 min-h-0 overflow-hidden bg-white drop-shadow-md">
        <Interaction
          :Pat_id="pat_id"
          :App_id="app_id"
          Collapse="true"
          :Request_from="route.name"
        />
      </div>

      <!-- More Information — below, only shows if needed -->
      <div class="flex-none" v-if="userStore.pay_settings">
        <MoreInformation
          :Pat_id="pat_id"
          :App_id="app_id"
          Collapse="true"
          :Request_from="route.name"
        />
      </div>

    </div>
  </div>
</template>
<script setup>
import { useRoute } from "vue-router";
import PatientPanel from "@/component/ui/PatientPanel.vue";
import Interaction from "@/component/shared/PatientInteraction2.vue";
import MoreInformation from "@/component/shared/OpdMoreInfo.vue";
import { patient_panel } from "@/composables/usePatientStore.js";
import { useUserStore } from "@/stores/userStore";
import { computed} from "vue";
import { onBeforeRouteLeave } from 'vue-router';

const { pat_hit_dialog } = patient_panel();
const route = useRoute();
const app_id = computed(() => route.params.app_id);
const pat_id = computed(() => route.params.pat_id);
const userStore = useUserStore();

onBeforeRouteLeave((to, from, next) => {
    const confirmed = window.confirm("You may have unsaved changes, Do you want to proceed");
    if (confirmed) {
      next(); // Proceed to the next route
    } else {
      next(false); // Cancel the navigation
    }
});

</script>
