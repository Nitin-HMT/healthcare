<template>
  <div class="grid grid-cols-3 border shadow-md col-span-2 bg-gradient-to-r  from-pink-200/30 from-20% via-blue-200/10 via-60% to-blue-200/60 to-90%">
  <div class="col-span-2">
    <Button class="my-1 py-1 bg-transparent text-gray-700/70 hover:bg-transparent active:bg-transparent ml-3 hover:text-amber-700
    relative after:bg-amber-700 after:absolute after:h-px after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer"
    :ref_for="true"
    size="md"
    :loading="false"
    :loadingText="null"
    :disabled="false"
    :link="null"
    @click="router.push({ 'name' : 'Booking'})">
    <template #prefix>
      <FeatherIcon class="w-5 h-5 text-ink-amber-2" name="book"/>
    </template>
    Booking
    </Button>
    <Button class="bg-transparent text-gray-700/70 hover:bg-transparent active:bg-transparent hover:text-purple-900
    relative after:bg-purple-900 after:absolute after:h-px after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer"
    :ref_for="true"
    size="md"
    :loading="false"
    :loadingText="null"
    :disabled="false"
    :link="null"
    @click="router.push({ 'name' : 'BHist'})">
    <template #prefix>
      <FeatherIcon class="w-5 h-5 text-purple-800" name="file-text"/>
    </template>
    Bill History
    </Button>
    <Button class="bg-transparent text-gray-700/70 hover:bg-transparent active:bg-transparent hover:text-blue-800
    relative after:bg-blue-800 after:absolute after:h-px after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer"
    :ref_for="true"
    size="md"
    :loading="false"
    :loadingText="null"
    :disabled="false"
    :link="null"
    @click="router.push({ 'name' : 'Labs'})">
    <template #prefix>
      <FeatherIcon class="w-5 h-5 text-ink-blue-3" name="heart"/>
    </template>
    Labs
    </Button>
    <Button class="bg-transparent text-gray-700/70 hover:bg-transparent active:bg-transparent hover:text-green-700
    relative after:bg-green-700 after:absolute after:h-px after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer"
    :ref_for="true"
    size="md"
    :loading="false"
    :loadingText="null"
    :disabled="false"
    :link="null"
    @click="router.push({ 'name' : 'Med_Hist'})">
    <template #prefix>
      <FeatherIcon class="w-5 h-5 text-ink-green-2" name="file-plus"/>
    </template>
    Medical History
    </Button>
    <Button class="bg-transparent text-gray-700/70 hover:bg-transparent active:bg-transparent hover:text-red-700
    relative after:bg-red-700 after:absolute after:h-px after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer"
    :ref_for="true"
    size="md"
    :loading="false"
    :loadingText="null"
    :disabled="false"
    :link="null"
    @click="router.push({ 'name' : 'Nursing'})">
    <template #prefix>
      <FeatherIcon class="'w-5 h-5 text-red-600" name="activity"/>
    </template>
    Vitals
    </Button>
    <Button class="bg-transparent text-gray-700/70 hover:bg-transparent active:bg-transparent  hover:text-teal-800
    relative after:bg-teal-800 after:absolute after:h-px after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 cursor-pointer"
    :ref_for="true"
    size="md"
    :loading="false"
    :loadingText="null"
    :disabled="false"
    :link="null"
    @click="router.push({ 'name' : 'Consult'})">
    <template #prefix>
      <FeatherIcon class="w-5 h-5 text-teal-600" name="clipboard"/>
    </template>
    Consultation
    </Button>
      <!--<Button class="bg-transparent text-gray-700/70 hover:bg-transparent active:bg-transparent "
      :ref_for="true"
      size="md"
      :loading="false"
      :loadingText="null"
      :disabled="true"
      :link="null"
      @click="">
      <template #prefix>
        <FeatherIcon class="w-5 h-5 text-gray-2" name="briefcase"/>
      </template>
      OPD Procedure
      </Button>-->
</div>
<div class="flex items-center justify-end mr-3">
    <Button class="bg-transparent hover:bg-transparent active:bg-transparent"
    :ref_for="true"
    size="md"
    :loading="false"
    :loadingText="null"
    :disabled="false"
    :link="null"
    @click="queue_flag=true"
    >
    <template #prefix>
      <FeatherIcon class="w-6 h-8 text-red-700 hover:text-red-900 rounded-full" name="grid"/>
      <!-- <Badge v-if="lab_tests.list.data" :variant="'solid'" size="sm" 
    class= "object-right-top text-white border-white bg-blue-800 absolute inset-4 flex justify-center items-end z-60 ">
      {{lab_tests.list.data.length}}
    </Badge> -->
    </template>

  </Button>
      <Badge v-if="appointCount" :variant="'solid'" size="sm" 
    class= " text-white border-white bg-gradient-to-r from-red-800 to-red-800 absolute inline-flex size-5" @click="queue_flag=true">
        {{appointCount}}
    </Badge>
    <Badge v-if="appointCount" :variant="'solid'" size="sm" 
    class= " text-white border-white bg-gradient-to-r from-red-800 to-red-800 animate-ping absolute inline-flex size-5" @click="queue_flag=true">
      
    </Badge>
    <div>
    <!-- <Badge v-if="lab_tests.list.data" :variant="'solid'" size="sm" 
    class= " text-white border-white bg-blue-800 absolute inset-4 flex justify-center items-end z-60 ">
      {{lab_tests.list.data.length}}
    </Badge> -->
  </div>

</div>
</div>
<PtDisp :Patient="sel_pat.details"/>
<Dialog v-model="queue_flag" :options="{size: '2xl'}">
  <template #body-title>
    <h3>OPD Queue</h3>
  </template>
  <template #body-content>
    <p><Tabs as="div"
      class="border bg-gray-50/10 font-seriff"
      :tabs="test_array"
    >
      <template #tab-panel="{ tab }">
        <div class="p-3">            
          <!--<div v-html="tab.full"></div>-->
          <div class="" v-if="tab.details.length">
            <ol class="grid grid-cols-6 text-base border gap-2 py-2 my-1 bg-gradient-to-r from-pink-100 to-blue-100">
              <div class="pl-3 flex gap-2 col-span-2">
                <div>S No.</div>
                <div>Patient</div>
              </div>
              <div>Age</div>
              <div>Payment Status</div>
              <div>Vitals</div>
              <div>Wait Time</div>
            </ol>
            <ol v-for="(item,index) in tab.details"  @click="appointqueue(item.pat_id)"
            class="grid grid-cols-6 text-sm border gap-2 py-2 my-1 hover:shadow-md hover:bg-cyan-100/20">
              <div class="pl-3 flex gap-2 col-span-2">
                <div><Badge variant="subtle" class="rounded-full" size="sm" :theme="statusToColor[item.opd]">{{(index+1)}}</Badge></div>
                <FeatherIcon class="w-4 h-4" :class="[item.gender === 'Female' ? 'text-pink-700' :'text-blue-700']"  name="user"/>
                {{item.patient}}
              </div>
              <div>{{ item.age }}</div>
              <div><FeatherIcon v-if="item.invoice || item.opd" class="w-4 h-4 text-green-800"  name="check-circle"/>
                <FeatherIcon v-else class="w-4 h-4 text-red-800"  name="x-circle"/>
              </div>              
              <div><FeatherIcon v-if="item.vitals " class="w-4 h-4 text-green-800"  name="check-circle"/>
                <FeatherIcon v-else class="w-4 h-4 text-red-800"  name="x-circle"/>
              </div>
              <div>{{ item.date }}</div>
            </ol>
          </div>
          <div v-else>
            <Badge :variant="'solid'" class=" block w-full rounded-full px-2 py-2 font-serif item-center justify-center
      bg-gradient-to-r from-red-800 to-red-600 hover:from-red-900 hover:to-red-700 text-white transition-all" size="xl" label="No Appointments"/>
          </div>
    
    </div>
      </template>
    </Tabs>
    </p>
  </template>
</Dialog>
<!-- <div class="text-xs flex items-center justify-end">{{ dayjs().format('L LT') }}</div> -->
</template>
<script setup>
import {useRouter} from 'vue-router';
import { FeatherIcon,Button,Dialog,createListResource,Tabs,Badge } from 'frappe-ui';
import { ref,inject,watch,computed } from 'vue'
import PtDisp from '@/component/Patient_display.vue';
import { dateformat} from "@/utils.js";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import updateLocale from 'dayjs/plugin/updateLocale';

dayjs.extend(relativeTime);
dayjs.extend(LocalizedFormat);
dayjs.extend(updateLocale);

const router =useRouter();
const queue_flag =ref(false)
let lab_tests=ref([]);
let sel_pat=inject("patient")
let test_array=ref([]);

watch(() => sel_pat.details,
            (details) => {
              lab_tests.fetch();
        }
        );
watch(() => sel_pat.ref_flag,
    (ref_flag) => {
      if (ref_flag) {
      test_array.value.splice(0);
      lab_tests.fetch();
      console.log("i am inside opd display flag")
      //sel_pat.ref_flag=false   
}
}
);
//appointment_date: dayjs().format('L LT'),
lab_tests = createListResource({
doctype: "Patient Appointment",
fields: ["name","creation","invoiced","appointment_date","appointment_datetime","practitioner","vital_sign","date_of_payment", "fee_valid", "status","patient","patient_name","patient_sex","patient_age"],
filters:{
  status: ["in","Open,Confirmed,Scheduled"],
  appointment_date: dayjs().format('L LT'),
},
orderBy: 'creation asc',
auto: true,
realtime: true,
transform(data) {
  test_array.value.splice(0);
      for (let d of data) {
        d.creation = dateformat(d.creation,"DD/MM/YYYY");
        let test_name= d.practitioner;
        const existingLabGroup = test_array.value.find(group => group.label === test_name);
if (existingLabGroup) {
  // If the group exists, push the new result into the tests array
  existingLabGroup.details.push({
    pat_id: d.patient,
    patient: d.patient_name,
    gender: d.patient_sex,
    age: d.patient_age,
    status:d.status,
    opd:d.fee_valid,
    date: dayjs(d.appointment_datetime).fromNow(),
    vitals:d.vital_sign,
    invoice:d.invoiced
  });
} else {
  // If no matching group is found, create a new entry
  test_array.value.push({
    label: test_name,
    details: [{
      pat_id: d.patient,
      patient: d.patient_name,
      gender: d.patient_sex,
      age: d.patient_age,
      status:d.status,
      opd:d.fee_valid,
      date: dayjs(d.appointment_datetime).fromNow(),
      vitals:d.vital_sign,
      invoice:d.invoiced
    }]
  });
}
      }
    },
});
const statusToColor = {
        "Cancelled": "red",
        "Scheduled": "blue",
        "Open":"blue",
        "0": "green",
        "Draft": "gray",
        "Confirmed": "orange",
        "Closed":"gray",
        "No Show":"red",
        "1": "red"
    }
function appointqueue(pat_id){
  let Patient_details = createListResource({
        doctype: "Patient",
        fields: ["*"],
        filters: {
            name: pat_id
        },
        auto: true,
        pageLength: 1,
        transform(data) {
        for (let d of data) {
            let label = d.patient_name;
            let description = d.patient_name+" | "+d.aged+" Yrs";
            let value= label+","+d.mobile;
            let pt = { "label": label, "description": description, "value": value, "gender": d.sex,"gen_abbr": d.gen_abbr, "name":d.name, 
            "new":[d.first_name,d.middle_name,d.last_name,d.aged,d.sex,d.blood_group,d.mobile,d.email] };
            sel_pat.details= pt;
            queue_flag.value=false;
        }
        }
    }); 
}

const appointCount = computed (() =>{
    if(lab_tests.list.data){
        return lab_tests.list.data.length;
    }
    return [];
})
// filters: {
// appointment_date: dayjs(),
// },
</script>