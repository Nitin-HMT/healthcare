<template>
<div>
  <div v-if="lab_results.data && lab_results.data.length && result.length" class="flex-grow border p-1.5 mt-2 pt-2  font-sans text-sm text-gray-900 font-bold leading-5 tracking-wide bg-white rounded-md capitalize drop-shadow-sm">
    Lab Results (Last 7 days, <u class="px-0.5">Divergent</u> Only):
  <div v-for="(item,index) in result" class="font-normal text-base tracking-wide flex flex-wrap p-1 gap-1">
  <div class="pr-0.5">{{ item.label }}:</div>
  <div v-for="(items,index) in (item.tests)">
    <Badge :variant="'subtle'" class="text-red-900 bg-gradient-to-l from-white to-white border border-red-600" size="md">{{ items }}</Badge>
  </div> 
  </div>
  <div class="text-sm text-gray-500 flex flex-grow items-center justify-center font-light pt-0.5">
    View Full Results By Clicking History Below</div>
  </div>
  <div v-else class="flex flex-col border mt-2 p-2 justify-center items-center capitalize drop-shadow-sm bg-white rounded-md">
  <div class="font-sans text-sm text-gray-600 font-light leading-5 tracking-wide "> No <u class="px-0.5"> Divergent </u> Labs Reported in the last 7 days.</div>
  <div class="text-gray-900 font-sans text-sm" v-if="last_date">Last Report Date : {{ last_date }}</div>
  </div>
</div>
    
</template>
<script setup>
import { ref,watch } from 'vue';
import {Badge, Textarea,Button,Rating, createListResource,Dialog} from 'frappe-ui';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import updateLocale from 'dayjs/plugin/updateLocale';
import { patient_panel } from '@/composables/usePatientStore.js';
dayjs.extend(relativeTime);
dayjs.extend(LocalizedFormat);
dayjs.extend(updateLocale);

let start_time=dayjs().subtract(7, 'day');//day
const { patientPanel_flag,pvtNotes,rating,vitals_flag }= patient_panel();
const props = defineProps({
    Pat_id: String,
    App_id: String,
    Room_id: String,
    Request_from: String,
  });
let result=ref([]);
let last_date=ref("");
const lab_dialog=ref(false);
const create_new=ref(false);
let lab_results = createListResource({
doctype: "Lab Test",
fields: ["name","result_date","`tabQuick Create Lab Results`.test_name",
"`tabQuick Create Lab Results`.result","`tabQuick Create Lab Results`.uom","`tabQuick Create Lab Results`.min_normal_range","`tabQuick Create Lab Results`.max_normal_range"],
filters: {
  patient: props.Pat_id,
  result_date: [">",start_time],
  docstatus: 1,
},
pageLength: 200000,
orderBy: 'result_date asc',
auto: true,
transform(data) {
result.value.splice(0);
last_date.value="";
for (let d of data) {
last_date.value=dayjs(d.result_date).format('DD/MM/YYYY');
let label= dayjs(d.result_date).fromNow();//dayjs(d.signs_date+" "+d.signs_time).fromNow()
let test_name= d.test_name;
if(d.test_name){
let arr= test_name.split("-").map(function(item) {
          return item.trim();
        });
test_name=arr[0];}

const existingDateGroup = result.value.find(group => group.label === label);
if(d.result<d.min_normal_range || d.result>d.max_normal_range){
  // not correct as there may be positive negative as well
if (existingDateGroup) {
  existingDateGroup.tests.push(test_name+": "+d.result+" "+d.uom);
} else {
  result.value.push({
    label: label,
    name: d.name,
    tests: [(test_name+": "+d.result+" "+d.uom)]
    //min: d.min_normal_range,
    //max: d.max_normal_range,
  });
}}
}
}});
</script>