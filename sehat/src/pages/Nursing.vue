<template>
  <div class="mt-4 grid sm:grid-cols-3 gap-3 p-3" v-if="all_searches_x.length">
    <div v-for="sin_vital in all_searches_x" class="p-3 gap-2 space-y-2 justify-between flex-col "
    :class="[sin_vital.gen_abbr === 'Female' ? 'bg-pink-200/70 hover:shadow-md hover:bg-pink-200/90 transition-all' :'hover:shadow-md bg-blue-200/70 hover:bg-blue-200/90 transition-all']"
    @click="edit_vitals(sin_vital)">
        <span class="p-3 grid md:grid-cols-1 gap-2" >
          <div class="text-gray-600 flex items-end justify-end text-base">{{ sin_vital.doctor }}</div>
          <div class="flex"><FeatherIcon class="w-9 h-9" :class="[sin_vital.gen_abbr === 'Female' ? 'text-pink-700' :'text-blue-700']"  name="user"/>
            <!-- <Badge  :variant="'solid'" size="sm" class= " text-white border-white bg-violet-900">
                {{(index+1)}}
            </Badge> -->
          </div>
          <span class="font-sans font-semibold decoration-gray-600 flex gap-4 " v-if="sin_vital" >
            {{ sin_vital.label }} | {{  sin_vital.gen_abbr }} | {{ sin_vital.new[3] }}
          </span>
          <p class="flex items-start justify-center flex-col font-sans text-sm" v-if="sin_vital">
            </p>
          <!-- <p class="flex items-start justify-end flex-col font-light text-sm">
          {{ sin_vital.Vitals[0]}} mmHg| {{ sin_vital.Vitals[1] }}bpm | SpO2 : {{ sin_vital.Vitals[2] }}%  
          | Ht: {{ sin_vital.Vitals[3] }}m | Wt: {{ sin_vital.Vitals[4] }}Kg 
          | BMI: {{ sin_vital.Vitals[5] }}-{{ sin_vital.Vitals[8] }}|
          </p> -->
      </span>
        <span class="col-span-3 flex items-center justify-end text-base">
          <div class="text-gray-600 font-light"> {{ sin_vital.name }}</div>
        </span>
    </div>
  </div>

  <div v-else class="mt-4 md:mx-[200px] flex item-center justify-center gap-3 p-3">
    <Badge :variant="'solid'" class=" block w-full rounded-full px-2 py-2 font-serif item-center justify-center
    bg-gradient-to-r from-red-800 to-red-600 hover:from-red-900 hover:to-red-700 text-white transition-all" size="xl" label="No Appointments"/>
  </div>
  <Dialog :options="{title: 'Patient Vitals', size: '2xl'}" v-model="patDialogshown">
      <template #body-content >
                <span class="grid md:grid-cols-2 gap-2 p-1 font-sans" v-if="selected_vitals.new">
                  <div >{{selected_vitals.label}} | {{selected_vitals.gender}} | {{ selected_vitals.new[3] }}</div>
                  
                  <div class="col-span-2 grid grid-cols-3 gap-2">
                  <FormControl :required="true" description="Sys/Dia, '/' Required, mmHg" v-model="selected_vitals.Vitals[0]" type="text" label="BP" placeholder="BP" />
                  <FormControl description="bpm" v-model="selected_vitals.Vitals[1]" type="number" label="Pulse" placeholder="HeartRate" />
                  <FormControl description="0-99" v-model="selected_vitals.Vitals[2]" type="number" label="SpO2 (%)" placeholder="SpO2" />
                  </div>
                  <div class="col-span-2 grid grid-cols-3 gap-2">
                  <FormControl description="If you enter value less than 8, 
                  then it will be taken as feet,
                   Else > 8 will be taken as cms" v-model="height" type="number" 
                   label="Ht" @change="heightx(height)" placeholder="Height" /> 
                  <FormControl description="Kgs" v-model="selected_vitals.Vitals[4]" type="number" @change="heightx(height)" label="Wt" placeholder="Weight" />
                  <FormControl description="°f" v-model="selected_vitals.Vitals[6]" type="number" label="Temp" placeholder="Temperature" />
                </div>
                <div class="col-span-2">
                  <FormControl v-model="selected_vitals.Vitals[7]" type="textarea" label="Vital Notes" placeholder="Vital Notes" />
                </div>
                </span>
                <ErrorMessage :message="create_vitals.error"/>
      </template>
      <template #actions>
        <div class="flex items-center justify-center gap-5">
         <Button variant="solid" theme="blue" 
         @click="create_vitals.submit()" :loading="create_vitals.loading">
         Submit Vitals</Button>
         <Button class="ml-2" variant="subtle" theme="blue" @click="selected_vitals.Vitals=[]; height=0">Clear</Button>
         <Button class="ml-2" variant="subtle" theme="blue" @click="patDialogshown=false">Close</Button>
        </div>
      </template>

  </Dialog>
</template>

<script setup>
import { createListResource, FeatherIcon,Badge, Dialog,FormControl,createResource,ErrorMessage } from 'frappe-ui';
import { onMounted,inject,ref,watch } from 'vue';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import updateLocale from 'dayjs/plugin/updateLocale';

dayjs.extend(relativeTime);
dayjs.extend(LocalizedFormat);
dayjs.extend(updateLocale);

const all_searches_x = ref([]);
let sel_pat=inject("patient");
const patDialogshown = ref(false);
let selected_vitals= ref([]);
let height= ref(0.00);
let appointments=createListResource({
  doctype: "Patient Appointment",
  fields: ["*"],
  setValue: {
        onSuccess() {
          console.log("This will be successful!!!")
          all_searches_x.value.splice(0);
          selected_vitals.value=[];
          patDialogshown.value=false;
          get_appoint();
        },
    },

})
//appointment_date: dayjs(),
function get_appoint(){
  all_searches_x.value.splice(0);
  console.log("I am being called")
let appointments_x=createListResource({
  doctype: "Patient Appointment",
  fields: ["*"],
  filters:{
    status: ["in","Open,Scheduled"],
  patient: sel_pat.details.name,
  appointment_date: dayjs().format('L LT'), 
},
orderBy: 'modified asc',
  auto: true,
  transform(data) {
        for (let d of data) {
            let label = d.patient_name;
            let description = d.patient_name+" | "+d.patient_age;
            let value= d.patient;
            let vital_record=d.vital_sign;
            let status=d.status;
            let vitals =[d.bp,d.pulse,d.spo2,d.height,d.weight,d.bmi,d.temperature,d.vital_sign_notes,
        d.nutrition_note,d.referring_practitioner,d.fee_valid];
            let more= ["","","",d.patient_age,d.patient_sex,"","",""];
            let pt = { "label": label,"status": status, "vital_record": vital_record,"doctor": d.practitioner, "description": description, "value": value, "gender": d.patient_sex,"gen_abbr": d.patient_sex, "name":d.name, 
            "new": more,"Vitals":vitals};
            all_searches_x.value.push(pt);
        }
        }

});
}

function heightx(ht){
  let heighty= 0.0001;
	if (ht>20){
		heighty= (ht/100).toFixed(2);
	} else if (ht<8 && ht>0){
		let x=ht;
		let y=parseFloat(x);
		let feet = Math.floor(y)
		//console.log("imfiringsss" + y);
		let inch = x.split('.')[1];
		//console.log("inch" + inch);
		let final= (feet*12)+parseFloat(inch)
		heighty= (final*0.0254).toFixed(2);
	} else {
		heighty =0;
	}
  selected_vitals.value.Vitals[3]=heighty;
  if( selected_vitals.value.Vitals[4] && selected_vitals.value.Vitals[4]>0.00 && heighty && heighty>0.00){
  let bmi_x = (selected_vitals.value.Vitals[4]/ (heighty * heighty)).toFixed(2);
	let bmi_note_x = null;

	if (bmi_x<18.5) {
		bmi_note_x ='Underweight';
	} else if (bmi_x>=18.5 && bmi_x<25) {
		bmi_note_x ='Normal';
	} else if (bmi_x>=25 && bmi_x<30) {
		bmi_note_x = 'Overweight';
	} else if (bmi_x>=30) {
		bmi_note_x = 'Obese';
	}
  //console.log(bmi_x+">>>>>"+bmi_note_x);
  selected_vitals.value.Vitals[5]=bmi_x;
  selected_vitals.value.Vitals[8]=bmi_note_x;
  }
  
}

watch(() => sel_pat.details,
(details) => {
all_searches_x.value.splice(0);
get_appoint();
console.log("I am firing")
}
);
//appointments.fetch()
onMounted(() => {
get_appoint();})

function edit_vitals(Patient){
  patDialogshown.value=true;
  selected_vitals.value=Patient;
}

let create_vitals=createResource({
    url: 'healthcare.api.make_vitals',
    makeParams(){
        return {
          patient_data: selected_vitals.value
        }
    },
    onSuccess: (lab_temp) => {    
      appointments.setValue.submit({
      name: selected_vitals.value.name,
      status: 'Confirmed',
      vital_sign: lab_temp
      })
      sel_pat.ref_flag=true;
  }   
})


// const appointList = computed (() =>{
//   if(appointments.list.data){
//       return appointments.list.data;
//   }
//   return [];
// })
</script>
