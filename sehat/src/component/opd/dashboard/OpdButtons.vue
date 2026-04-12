<template>
  <div
    class="space-x-2 -mb-2 flex flex-grow justify-start items-end ml-2 pr-6 mt-1.5"
  >
    <Button
      @click="vitalsqueue(app.get(props.App_id))"
      class="bg-teal-50 text-xs hover:bg-gradient-to-b from-teal-200 via-teal-50 to-teal-50 rounded-t-xl rounded-none"
      ><span>+ Vitals</span></Button
    >
    
    <!-- <Button
      @click="pay_hit_dialog = true"
      class="bg-teal-50 text-xs hover:bg-gradient-to-b from-teal-200 via-teal-50 to-teal-50 rounded-t-xl rounded-none"
      ><span>Payment History</span></Button
    > -->
    <Button
      @click="vital_dialog = true"
      class="bg-teal-50 text-xs hover:bg-gradient-to-b from-teal-200 via-teal-50 to-teal-50 rounded-t-xl rounded-none"
      ><span>Vitals History</span></Button
    >
    <Button
      @click="med_hist_dialog = true"
      class="bg-teal-50 text-xs hover:bg-gradient-to-b from-teal-200 via-teal-50 to-teal-50 rounded-t-xl rounded-none"
      ><span>Medical History</span></Button
    >
    <!-- <Button @click="lab_dialog=true;create_new=false" class="bg-teal-50 text-xs hover:bg-gradient-to-b from-teal-200 via-teal-50 to-teal-50  rounded-t-xl rounded-none"><span>Lab History</span></Button> -->
    <!-- <Button @click="lab_dialog=true;create_new=true" class="bg-teal-50 text-xs hover:bg-gradient-to-b from-teal-200 via-teal-50 to-teal-50  rounded-t-xl rounded-none"><span>+ Labs</span></Button> -->
  </div>

  <Dialog v-model="med_hist_dialog" :options="{ size: '4xl' }">
    <template #body-title>
      <h3>Medical History</h3>
    </template>
    <template #body-content>
      <MedicalHistory
        :Pat_id="props.Pat_id"
        :App_id="props.App_id"
        :Request_from="props.Request_from"
      />
    </template>
  </Dialog>
  <Dialog v-model="pay_hit_dialog" :options="{ size: '4xl' }">
    <template #body-title>
      <h3>Invoice History</h3>
    </template>
    <template #body-content>
      <PaymentHistory
        :Pat_id="props.Pat_id"
        :App_id="props.App_id"
        :Request_from="props.Request_from"
      />
    </template>
  </Dialog>
  <Dialog v-model="vital_dialog" :options="{ size: '4xl' }">
    <template #body-title>
      <h3>Vital's History</h3>
    </template>
    <template #body-content>
      <div class="flex flex-col gap-3">
        <VitalsHistory
          :Pat_id="props.Pat_id"
          :App_id="props.App_id"
          :Request_from="props.Request_from"
        />
      </div>
    </template>
  </Dialog>
  <Dialog v-model="lab_dialog" :options="{ size: '4xl' }">
    <template #body-title>
      <h3>Lab Results</h3>
    </template>
    <template #body-content>
      <div class="flex flex-col gap-3">
        <LabHistory
          :Pat_id="props.Pat_id"
          :App_id="props.App_id"
          :Request_from="props.Request_from"
          :create_new="create_new"
        />
      </div>
    </template>
    <template #actions>
      <Button
        @click="lab_dialog = false"
        class="rounded-full bg-white border border-teal-800 text-teal-800"
      >
        Close
      </Button>
    </template>
  </Dialog>
  <Dialog v-model="vital_flag" :options="{ size: '4xl' }">
    <template #body-title>
      <h3>New Vitals</h3>
    </template>
    <template #body-content>
      <div class="flex flex-col gap-3">
        <VitalsEntry :App="app.get(props.App_id)" />
      </div>
    </template>
    <!-- <template #actions>
    <Button @click="lab_dialog=false"
    class="rounded-full bg-white border border-teal-800 text-teal-800" >
    Close
    </Button>
</template> -->
  </Dialog>
</template>
<script setup>
import { ref } from "vue";
import { User } from "lucide-vue-next";
import { Button, Dialog } from "frappe-ui";
import MedicalHistory from "@/component/shared/MedicalHistory.vue";
import PaymentHistory from "@/component/shared/PaymentHistory.vue";
import VitalsHistory from "@/component/shared/VitalsHistory.vue";
import LabHistory from "@/component/shared/LabHistory.vue";
import { useAppointmentStore } from "@/stores/appointmentStore.js";
import { vitals } from "@/composables/useVitals.js";
import VitalsEntry from "@/component/shared/VitalsEntry.vue";

const med_hist_dialog = ref(false);
const pay_hit_dialog = ref(false);
const vital_dialog = ref(false);
const lab_dialog = ref(false);
const create_new = ref(false);
const appointStore = useAppointmentStore();
const { vital_flag, vitals_patient } = vitals();
let app = ref();
app.value = appointStore.app_map;
const props = defineProps({
  Pat_id: String,
  App_id: String,
  Room_id: String,
  Request_from: String,
});
function vitalsqueue(pat_id_vitals) {
  vitals_patient.value = pat_id_vitals;
  vital_flag.value = true;
}
</script>
