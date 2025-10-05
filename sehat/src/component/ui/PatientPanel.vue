<template>
 <aside v-show="props.Request_from=='opd_consult'"
   class="hidden divide-y divide-gray-300 p-1 md:flex flex-col first-line:text-base fixed h-screen inset-y-0 top-0 right-0 bg-white drop-shadow-2xl transition-all duration-300 ease-in-out pt-16"  
    :class="patientPanel_flag ? 'w-16' : 'w-64'">

<div class="divide-y divide-gray-300" v-if="!patientPanel_flag && patient.doc">
    <div class="p-4 flex flex-col items-center justify-center space-x-2">
      <div class="rounded-full w-20 h-20 border"
      :class="[patient.doc.sex === 'Other' ? 'bg-yellow-300' :'bg-white']"
      >
       <User class=" p-2 w-20 h-20" :class="[patient.doc.sex === 'Female' ? 'text-pink-600/80' :'text-blue-700']"/>
     
      </div>
    </div>
    <div class="text-xs text-gray-400 flex flex-row px-1 items-center justify-center"><i>{{ Pat_id }}</i></div> 
    <!-- Middle: Navigation -->
    <div class="flex flex-col items-center justify-center text-gray-900 bg-white mx-1 p-1 text-base space-y-1">
     <div>{{ patient.doc.patient_name }}, {{patient.doc.aged}}yrs, {{ patient.doc.sex }}</div>
      <div class="text-red-800">{{ patient.doc.blood_group }}</div> 
     <div class="text-sm flex"><Phone class="w-3 h-3 mr-1"/>{{ patient.doc.mobile }}</div>
     <div class="text-sm flex text-white bg-orange-500 p-1 font-semibold rounded-full" v-if="patient.doc.emergency"><Siren class="w-4 h-4 mr-1"/>{{ patient.doc.emergency }}</div>
    </div>

    <!-- Bottom: Avatar + Collapse Button -->
    <div class="p-1 pb-0.5 items-center justify-center space-x-1 space-y-1.5 capitalize">
      <div class="text-sm text-gray-600 flex flex-row px-1 items-center justify-center">
        Chronic/Past Conditions
        <Button class="flex items-end justify-end bg-white" @click="pat_hit_dialog=true" >
          <Pencil v-if="result_grouped" class="h-4 text-gray-600"/>
          <SquarePlus v-else class="h-5 text-gray-600"/>
        </Button>
      </div>
      <div v-if="result_grouped" @click="pat_hit_dialog=true">
            <span v-for="(item,index) in result_grouped.Allergy"  class="space-x-1">
              <Badge :variant="'outline'" theme="red" size="sm" v-if="item.Item && !item.new">{{ item.Display }}</Badge>
          </span>
            <span v-for="(item,index) in result_grouped.Meds" class="space-x-1">
              <Badge :variant="'outline'" theme="blue" size="sm" v-if="item.Item && !item.new" class="flex flex-wrap">{{ item.Item[7]}}<!--({{  (item.Item[3]) }})--></Badge>
          </span>
            <span v-for="(item,index) in result_grouped.Diagnosis" class="space-x-1">
              <Badge :variant="'outline'" theme="orange" size="sm" v-if="item.Item && !item.new">{{ item.Display }}</Badge>
          </span>
            <span v-for="(item,index) in result_grouped.surg" class="space-x-1">
              <Badge :variant="'outline'" theme="green" size="sm" v-if="item.Item && !item.new">{{ item.Display }}</Badge>
          </span>
          </div>
    </div>      
    <div class="p-2 flex flex-col items-center justify-center space-x-1 space-y-1.5">
      <Rating v-model="rating" v-show="false"/>
      <Textarea :variant="'outline'" size="sm" placeholder="Your Pvt Notes" class="h-20" v-model="pvtNotes" />
    <span class="flex flex-row item-center justify-center mt-3" v-show="!history_flag">
    <Button @click="update_patient();" :loading="patient.get.loading" 
    class="rounded-full bg-white border border-teal-800 text-teal-800">
    Update Patient</Button></span>
    </div>
    
    <aside class="absolute top-20 -left-8 flex flex-col">
      <Button @click="med_hist_dialog=true" class="h-auto mt-16 -mr-1 bg-white hover:bg-gradient-to-tl from-white via-white to-purple-200 -translate-y-1/2 px-2 py-3 rounded-bl-sm rounded-tl-2xl rounded-none"><span class="leading-none [writing-mode:vertical-rl] rotate-180">Medical History</span></Button>
      <Button @click="pay_hit_dialog=true" class="h-auto relative top-2 -mr-1 mb-2 bg-white hover:bg-gradient-to-tl from-white via-white to-purple-200 -translate-y-1/2 px-2 py-3 rounded-bl-sm rounded-tl-2xl rounded-none"><span class="leading-none [writing-mode:vertical-rl] rotate-180">Payment History</span></Button>
      <Button v-if="!patientPanel_flag" @click="patientPanel_flag=true" class="h-auto hover:bg-gradient-to-l from-white via-white to-purple-200 relative top-32 bg-white hover:bg-white -m-1 -translate-y-1/2 px-2 py-10 rounded-l-full"><span class="hover:text-gray-900 leading-none [writing-mode:vertical-rl]"><ChevronsRight/></span></Button>
    </aside>
  </div>
  <div v-else-if="patientPanel_flag && patient.doc">
    <div class="leading-none [writing-mode:vertical-rl] p-4 flex flex-grow gap-3 items-center justify-between">
      <div class="bg-white rounded-full w-8 h-8 border">
       <User class=" p-2 w-8 h-8" :class="[patient.doc.sex === 'Female' ? 'text-pink-600/80' :'text-blue-700']"/>
      </div>
      {{ patient.doc.patient_name }}, {{patient.doc.aged}}yrs, {{ patient.doc.sex }}
      <div class="text-red-800">{{ patient.doc.blood_group }}</div> 
     <div class="text-sm flex"><Phone class="w-3 h-3 m-1 rotate-90"/>{{ patient.doc.mobile }}</div>
    <div class="text-sm flex text-white bg-orange-900 p-1 font-semibold rounded-full" v-if="patient.doc.emergency"><Siren class="w-4 h-4 mb-1 rotate-90"/> {{ patient.doc.emergency }}</div>
    </div>
    <aside class="absolute top-20 -left-8 flex flex-col">
      <Button @click="med_hist_dialog=true" class="h-auto mt-16 -mr-1 bg-white hover:bg-gradient-to-tl from-white via-white to-purple-200 -translate-y-1/2 px-2 py-3 rounded-bl-sm rounded-tl-2xl rounded-none"><span class="leading-none [writing-mode:vertical-rl] rotate-180">Medical History</span></Button>
      <Button @click="pay_hit_dialog=true" class="h-auto relative top-2 -mr-1 mb-2 bg-white hover:bg-gradient-to-tl from-white via-white to-purple-200 -translate-y-1/2 px-2 py-3 rounded-bl-sm rounded-tl-2xl rounded-none"><span class="leading-none [writing-mode:vertical-rl] rotate-180">Payment History</span></Button>
      <Button v-if="patientPanel_flag" @click="patientPanel_flag=false" class="h-auto hover:bg-gradient-to-l from-white via-white to-purple-200 relative top-32 bg-white hover:bg-white -m-1 -translate-y-1/2 px-2 py-10 rounded-l-full"><span class="hover:text-gray-900 leading-none [writing-mode:vertical-rl]"><ChevronsLeft/></span></Button>
      
    </aside>
  </div>
  </aside>
  <div v-show="props.Request_from=='pat_dash'">
<div class="grid grid-cols-12 mt-2"v-if="patient.doc">
    <div class="flex flex-col items-end justify-start space-x-2 p-2">
      <div class="bg-inherit rounded-full w-12 h-12 border">
       <User class="p-2 w-12 h-12" :class="[patient.doc.sex === 'Female' ? 'text-pink-600/80' :'text-blue-700']"/>
      </div>
    </div>
    
    <!-- Middle: Navigation -->
    <div class="col-span-10 pt-3 flex flex-grow items-center justify-start content-around text-gray-900 bg-inherit mx-1 p-1 text-lg space-y-1">
      <div>
          <div class="flex flex-grow pb-1">{{ patient.doc.patient_name }}, {{patient.doc.aged}}yrs, {{ patient.doc.sex }}
            <div class="text-red-800 pl-2">{{ patient.doc.blood_group }}</div>
          </div>
          <div class="flex flex-row pb-1">
            <div class="text-sm flex"><Phone class="w-3 h-3 mr-1"/>{{ patient.doc.mobile }}</div>
            <div class="text-sm flex text-white bg-orange-500 ml-2 p-1 
            font-semibold rounded-full" v-if="patient.doc.emergency">
              <Siren class="w-4 h-4 mr-1"/>{{ patient.doc.emergency }}
            </div>
          </div>
          <div class="text-xs text-gray-400 flex flex-row px-1 items-end justify-end"><i>{{ Pat_id }}</i></div> 
      </div>   
    </div>
    <div></div>
  </div>
  </div>
<Dialog v-model="pat_hit_dialog" :options="{size: '2xl'}">
    <template #body-title>
      <h3>Patient History</h3>
    </template>
    <template #body-content>
      <div class="flex flex-col gap-3" v-show="!history_flag">
        <Textarea v-model="notes" label="Patient History (Hx)" 
        placeholder=
'Enter Details as you would in any conversation(Pressing "Enter" or "," or ";" after every thought)
Whatever cant be transcribed will be corrected in next step

You can use symbols to force match (optional): 
# Continuos Medication, 
^ Pre-existing Disease, 
* Past Surgeries, 
! Allergies
"" Descriptive Comments' class="h-40 rounded-lg text-sm mb-6"
/>
      </div>
      <div>
        <div v-if="result_grouped && (result_grouped.Symptoms ||result_grouped.labs)"
        class="text-sm px-1 gap-2 pl-1 my-0.5 flex-grow text-amber-800">
          The History Input Contains Symptoms and/or Labs, these will not be processed, 
          please add them to Obx, Rx instead
        </div>
        <div v-if="result">
          <div v-for="item in result" v-show="!history_flag">
            <div class="flex flex-wrap gap-1 py-0.5 text-sm" v-if="item.Category=='Unknown'||(item.new && item.Category!='Symptoms' && item.Category!='labs')">
                {{item.Display}}<Badge :variant="'outline'" size="sm" theme="orange" @click="create_new_element(item)" class="cursor-pointer">Fix</Badge>
           </div>
          </div>
          <NewLexicon :Phrase="under_operation" v-if="history_flag" class="border border-gray-900" />
          <Button v-if="history_flag" @click="history_flag=false" variant="solid">Back</Button>
        </div>
      </div>
    </template>
    <template #actions>
      <Button @click="update_patient();" :loading="patient.get.loading"
      class="rounded-full bg-white border border-teal-800 text-teal-800" v-show="!history_flag" >
        Confirm
      </Button>
    </template>
  </Dialog>
    <Dialog v-model="med_hist_dialog" :options="{size: '4xl'}">
    <template #body-title>
      <h3>Medical History</h3>
    </template>
    <template #body-content>
      <MedicalHistory :Pat_id="props.Pat_id" :App_id= "props.App_id" :Request_from= "props.Request_from"/>
    </template>  
  </Dialog>
<Dialog v-model="pay_hit_dialog" :options="{size: '4xl'}">
    <template #body-title>
      <h3>Invoice History</h3>
    </template>
    <template #body-content>
      <PaymentHistory :Pat_id="props.Pat_id" :App_id= "props.App_id" :Request_from= "props.Request_from"/>
    </template>  
  </Dialog>
  {{error}}
</template>
<script setup>
import { ref,watch,reactive } from 'vue';
import { User,ChevronsLeft,ChevronsRight,Phone,Siren,Pencil,SquarePlus } from 'lucide-vue-next';
import {Badge, FormControl,Button,Rating, createDocumentResource,Dialog,Textarea} from 'frappe-ui';
import { direct_out } from '@/composables/useInteractionNotesDirect.js';
import MedicalHistory from '@/component/shared/MedicalHistory.vue';
import PaymentHistory from '@/component/shared/PaymentHistory.vue';
import { patient_panel } from '@/composables/usePatientStore.js';
import dayjs from 'dayjs';
import { createLexicon } from '@/composables/useCreateLexicon.js';
import NewLexicon from '@/component/shared/NewMedicalLexicon.vue';
const { history_flag}= createLexicon();

const { patientPanel_flag,pvtNotes,rating }= patient_panel();
const {result,interation_direct,result_grouped,comments,library,stop_submit} =direct_out();

const under_operation=reactive({
  Display:"",
  Category:"",
  Name:"",
  Life_sty:"",
  lab_type:"",
  surg_adv:"",
  med_panel:["","","","",""],
  correction:"",
  original:"",
  symbol:""
});

const props = defineProps({
    Pat_id: String,
    App_id: String,
    Room_id: String,
    Request_from: String,
  });
const pat_hit_dialog=ref(false);
const notes=ref("");
const error=ref("");
let patient = createDocumentResource({
  doctype: 'Patient',
  name: props.Pat_id,
  setValue: {
    onSuccess(id) {
      patient.reload()
      pat_hit_dialog.value=false
    },
    onError(errors) {
      error.value=errors;
    },
  },
})
let pat_hist=ref("");
const med_hist_dialog=ref(false);
const pay_hit_dialog=ref(false);
const hist_Date=ref("")
watch(() => patient.doc,
(doc) => {
  pvtNotes.value=patient.doc.patient_details;
  rating.value=(patient.doc.rating*5);
  notes.value=patient.doc.pat_hist;
  hist_Date.value=patient.doc.history_updated_on;
  if(notes.value){
  interation_direct(notes.value);}
// if(patient.doc.pat_hist){
//   let hist=patient.doc.pat_hist.replaceAll(/'/g, '"');
//     let hist_str_1 = hist.replaceAll('None', ' ');
//     let hist_str = hist_str_1.replaceAll('>>', ' ');
//     console.log("I fired"+hist_str)
// pat_hist.value=JSON.parse(hist_str)
// }
})
function update_patient(){
let flag_save=false;
let res=result_grouped.value
  if((notes.value)!=(patient.doc.pat_hist)){
      interation_direct(notes.value);
      if(stop_submit.value){
        flag_save=true;
        result_grouped.value=res;
      }else{
        hist_Date.value=dayjs().format("YYYY-MM-DD")
      }
    }
if(!flag_save){
patient.setValue.submit({
    pat_hist: notes.value,
    history_updated_on: hist_Date.value,
    rating: rating.value/5,
    patient_details:pvtNotes.value
})
}
}
function create_new_element(phrase){
  history_flag.value=true;
  under_operation.Display=phrase.Display;
  under_operation.Category=phrase.Item[0];
  under_operation.Name=phrase.Item[1];
}

watch(history_flag,
        async (history_flag) => {
          if(!history_flag){
          setTimeout(() => {
            interation_direct(notes.value)
          }, 1000);
          
          }
          
    }
    );
</script>