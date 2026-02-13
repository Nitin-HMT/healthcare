<template>
  <div
    class="p-1 bg-gradient-to-br from-amber-50 via-white to-amber-100 rounded-md transition-all duration-300 ease-in-out"
  >
    <div class="grid grid-cols-3 gap-2">
      <div class="flex-row col-span-2">
        <b>{{ vitals_all.label }}</b> | {{ vitals_all.gender }} |
        {{ vitals_all.age }} yrs
      </div>
      <div class="text-xs text-gray-500 justify-self-end pr-2">
        {{ vitals_all.name }}
      </div>

      <FormControl
        variant="outline"
        :required="true"
        description="Sys/Dia, '/' Required, mmHg"
        v-model="vitals_all.Vitals[0]"
        type="text"
        label="BP"
        placeholder="BP"
      />
      <FormControl
        variant="outline"
        description="bpm"
        v-model="vitals_all.Vitals[1]"
        type="number"
        label="Pulse"
        placeholder="HeartRate"
      />
      <FormControl
        variant="outline"
        description="0-99"
        v-model="vitals_all.Vitals[2]"
        type="number"
        label="SpO2 (%)"
        placeholder="SpO2"
      />
      <div>
        <FormControl
          variant="outline"
          description="If you enter value less than 8,then it will be taken as feet,Else > 8 will be taken as cm"
          v-model="height"
          type="number"
          label="Ht"
          @change="heightx(height)"
          placeholder="Height"
        />
        <div
          class="text-xs text-red-800"
          v-if="height != null && height.length < 3"
        >
          Height Not in correct format, Need a decimal or 3 digits
        </div>
      </div>
      <FormControl
        variant="outline"
        description="Kgs"
        v-model="vitals_all.Vitals[4]"
        type="number"
        @change="heightx(height)"
        label="Wt"
        placeholder="Weight"
      />
      <FormControl
        variant="outline"
        description="°f"
        v-model="vitals_all.Vitals[6]"
        type="number"
        label="Temp"
        placeholder="Temperature"
      />
      <FormControl
        variant="outline"
        v-model="vitals_all.Vitals[7]"
        type="textarea"
        label="Vital Notes"
        placeholder="Vital Notes"
        class="col-span-3"
      />

      <div class="col-span-1" />
      <div
        class="flex-row"
        v-if="
          vitals_all.Vitals[0] &&
          vitals_all.Vitals[0].length > 4 &&
          vitals_all.Vitals[0].search('/') > 0
        "
      >
        <Button
          :variant="'subtle'"
          size="md"
          class="justify-self-end rounded-full m-1 font-serif item-center justify-center bg-gradient-to-r from-amber-500/80 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white transition-all"
          @click="make_newVital(vitals_all)"
          :loading="Vital_load"
        >
          Submit Vitals
        </Button>
        <Button
          class="bg-transparent text-amber-700 hover:bg-amber-500/70 rounded-full hover:text-white ml-2"
          @click="
            vitals_all.Vitals = [];
            height = 0;
          "
          >Clear</Button
        >
      </div>
      <div v-else class="text-red-600 text-xs col-span-2">
        BP Not entered or Incorrect Format or too Short
      </div>
    </div>
  </div>
  <ErrorMessage :message="error_vital" />
</template>
<script setup>
import { useAppointmentStore } from "@/stores/appointmentStore.js";
import { FormControl, ErrorMessage, Button } from "frappe-ui";
import { vitals } from "@/composables/useVitals.js";
import { ref } from "vue";
const appointStore = useAppointmentStore();
const vitals_all = ref([]);
let height = ref(0.0);
const {
  make_newVital,
  error_vital,
  vital_create,
  Vital_load,
  vital_flag,
  vitals_patient,
} = vitals();
vitals_all.value = appointStore.sel_app;
//vitals_all.value=vitals_patient;
const props = defineProps({
  App: Object,
});
if (props.App) {
  vitals_all.value = props.App;
}

function heightx(ht) {
  let heighty = 0.0001;
  if (ht > 20) {
    heighty = (ht / 100).toFixed(2);
  } else if (ht < 8 && ht > 0) {
    let x = ht;
    let y = parseFloat(x);
    let feet = Math.floor(y);
    //console.log("imfiringsss" + y);
    let inch = x.split(".")[1];
    //console.log("inch" + inch);
    let final = feet * 12 + parseFloat(inch);
    heighty = (final * 0.0254).toFixed(2);
  } else {
    heighty = 0;
  }
  vitals_all.value.Vitals[3] = heighty;
  if (
    vitals_all.value.Vitals[4] &&
    vitals_all.value.Vitals[4] > 0.0 &&
    heighty &&
    heighty > 0.0
  ) {
    let bmi_x = (vitals_all.value.Vitals[4] / (heighty * heighty)).toFixed(2);
    let bmi_note_x = null;

    if (bmi_x < 18.5) {
      bmi_note_x = "Underweight";
    } else if (bmi_x >= 18.5 && bmi_x < 25) {
      bmi_note_x = "Normal";
    } else if (bmi_x >= 25 && bmi_x < 30) {
      bmi_note_x = "Overweight";
    } else if (bmi_x >= 30) {
      bmi_note_x = "Obese";
    }
    //console.log(bmi_x+">>>>>"+bmi_note_x);
    vitals_all.value.Vitals[5] = bmi_x;
    vitals_all.value.Vitals[8] = bmi_note_x;
  }
}
</script>
