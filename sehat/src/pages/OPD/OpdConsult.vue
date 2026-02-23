<template>
  <!-- {{ route.name }} -->
  <div class="hidden md:flex flex-grow" :key="app_id">
    <div class="flex-grow m-1.5">
      <div class="bg-white rounded-md drop-shadow-md">
        <div class="bg-teal-50 rounded-t-md ">
          <PatientPanel
            :Pat_id="pat_id"
            :Request_from="route.name"
            class="mx-3"
          />
        </div>
        <Interaction
          :Pat_id="pat_id"
          :App_id="app_id"
          Collapse="true"
          :Request_from="route.name"
        />
      </div>
      <MoreInformation
          :Pat_id="pat_id"
          :App_id="app_id"
          Collapse="true"
          :Request_from="route.name"
          v-if="userStore.pay_settings"
        />
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
