<template>
<div class="transition-all duration-300 ease-in-out">
  <div v-if="false">
  <div v-if="vitals_1.data && vitals_1.data.length" class="flex-grow p-1.5 mt-2 pt-2  font-sans text-sm text-gray-900 font-bold leading-5 tracking-wide bg-white rounded-md capitalize drop-shadow-sm border">
  Vitals (Last 12 Hours):
  <div v-for="(item,index) in vitals_1.data" class="font-normal text-base tracking-wide flex flex-wrap p-1 gap-1">
  <div class="pr-0.5">{{ item.ui_date }}:</div> 
  <Badge theme="orange" :variant="'subtle'">{{ item.bp }}</Badge> 
  <Badge v-if="item.nutrition_note && item.nutrition_note!='Normal'" theme="blue" :variant="'subtle'">{{ item.nutrition_note }}</Badge> 
  <Badge v-if="item.pulse" theme="orange" :variant="'outline'">{{item.pulse}} bpm </Badge> 
  <Badge v-if="item.temperature" theme="orange" :variant="'outline'">{{ item.temperature }}°F </Badge> 
  <Badge v-if="item.spo2" theme="green" :variant="'outline'">SpO<sub>2</sub>: {{ item.spo2}}% </Badge>

  <Badge v-if="item.weight" theme="blue" :variant="'outline'">{{ item.weight }}Kg </Badge> 
  <Badge v-if="item.height" theme="blue" :variant="'outline'">{{ item.height }}m </Badge> 
  <Badge v-if="item.bmi" theme="blue" :variant="'outline'">BMI: {{ item.bmi }} </Badge>

  <div v-if="item.vital_signs_note" class="text-gray-700 pr-0.5">Notes: {{ item.vital_signs_note }}</div> 
  </div>
  </div>
  <div v-else class="flex-grow border mt-2 p-2 flex justify-center items-center  font-sans text-sm text-gray-900 font-light leading-5 tracking-wide bg-white rounded-md capitalize drop-shadow-sm">
  No Vitals Recorded in Last 12 Hours
  </div>
  </div>
  <div v-else>
  <div v-if="vitals_1.data && vitals_1.data.length" class="text-sm font-medium px-1 gap-2 pl-1 my-0.5 flex-grow capitalize">
  <div class="underline">Vitals:</div>
  <div v-for="(item,index) in vitals_1.data" >
  <div v-if="index<1" class="flex flex-wrap font-light gap-x-1 pt-0.5 pl-2 align-baseline">
  <div>{{ item.bp }}</div> 
  <div v-if="item.pulse">{{item.pulse}} bpm </div> 
  <div v-if="item.temperature">{{ item.temperature }}°F </div> 
  <div v-if="item.spo2">SpO<sub>2</sub>: {{ item.spo2}}% </div>
  <div v-if="item.weight">{{ item.weight }}Kg </div> 
  <div v-if="item.height" >{{ item.height }}m </div> 
  <div v-if="item.bmi" >BMI: {{ item.bmi }} </div>
  <div v-if="item.nutrition_note && item.nutrition_note!='Normal'">{{ item.nutrition_note }}</div> 
  <div v-if="item.vital_signs_note" class="text-gray-700 flex flex-wrap text-sm">Notes: {{ item.vital_signs_note }}</div> 
  </div>
  </div>
  </div>
  </div>
</div>
</template>
<script setup>
import {Badge, Dialog,Button, createListResource} from 'frappe-ui';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import updateLocale from 'dayjs/plugin/updateLocale';
import { ref,watch } from 'vue';
import { patient_panel } from '@/composables/usePatientStore.js';
import { useAppointmentStore } from '@/stores/appointmentStore.js';
import { vitals } from '@/composables/useVitals.js';
const appointStore = useAppointmentStore()
dayjs.extend(relativeTime);
dayjs.extend(LocalizedFormat);
dayjs.extend(updateLocale);
let app=ref()
const vital_dialog=ref(false);
const new_vital_dialog=ref(false);
const { make_newVital, error_vital,vital_create,Vital_load,vital_flag,vitals_patient }= vitals();
let start_time=dayjs().subtract(12, 'hour');
const { patientPanel_flag,pvtNotes,rating,vitals_flag }= patient_panel();
const props = defineProps({
    Pat_id: String,
    App_id: String,
    Room_id: String,
    Request_from: String,
  });
app.value=appointStore.app_map;
let vitals_1 = createListResource({
doctype: "Vital Signs",
fields: ["*"],
filters:{
  //status: ["in","Open,Confirmed,Scheduled"],
  docstatus: 1,
  creation: [">",start_time],
  patient:props.Pat_id
},
orderBy: 'creation desc',
auto: true,
realtime: true,
transform(data) {
 for (let d of data) {
        d.ui_date = dayjs(d.signs_date+" "+d.signs_time).fromNow()
      }
      return data
}});
watch(() => vital_flag.value,
(doc) => {
  if(!vital_flag.value){
    vitals_1.fetch();
  }
})
watch(() => vital_dialog.value,
(doc) => {
  if(!vital_dialog.value){
    vitals_1.fetch();
  }
})
function vitalsqueue(pat_id_vitals){
    vitals_patient.value=pat_id_vitals;
    vital_flag.value=true;
}
</script>