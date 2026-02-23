<template>
  <div v-show="props.Request_from=='pat_dash' || props.Request_from=='opd_consult'">
<div class="grid grid-cols-12 mt-1"v-if="patient.doc">
    <div class="flex flex-col items-center justify-start space-x-1 pt-1 pb-0.5">
      <div class="bg-white rounded-full w-9 h-9 border" v-if="patient.doc.sex != 'Other'">
       <User class="p-2 w-9 h-9" :class="[patient.doc.sex === 'Female' ? 'text-pink-600/80' :'text-blue-700']"/>
      </div>
      <div class="bg-white rounded-full w-9 h-9 border" v-else>
       <User class="p-2 w-9 h-9 text-yellow-600"/>
      </div>
      <div class="text-2xs text-gray-400 flex flex-row items-center justify-center"><i>{{ Pat_id }}</i></div> 
    </div>
    
    <!-- Middle: Navigation -->
    <div class="col-span-8 pt-3 flex flex-grow items-center justify-start 
    content-around text-gray-900 bg-inherit mx-1 p-1 text-base space-y-1">
      <div>
          <div class="flex flex-grow pb-1">{{ patient.doc.patient_name }}, {{patient.doc.aged}}yrs, {{ patient.doc.sex }}
            <div class="text-red-800 pl-2">{{ patient.doc.blood_group }}</div>
          
          <div class="flex flex-row">
            <div class="text-sm flex"><Phone class="w-3 h-4 mx-1"/>{{ patient.doc.mobile }}</div>
            <div class="text-xs flex text-white bg-teal-700 ml-2 -mt-1.5 p-1 
            rounded-full" v-if="patient.doc.emergency">
              <Siren class="w-3 h-3 mr-1"/>{{ patient.doc.emergency }}
            </div>
          </div>
          </div>
          
      </div>   
    </div>
    <div v-if="false" v-show="props.Request_from=='opd_consult'" class="p-1 pb-0.5 col-span-3 items-center justify-center space-x-1 space-y-1.5 capitalize">
      <div class="text-sm text-gray-600 flex flex-row px-1 items-center justify-start">
        <Button class="flex items-end justify-end bg-transparent" @click="pat_hit_dialog=true" >
          <Pencil v-if="result_grouped" class="h-4 text-gray-600"/>
          <MessageCirclePlus v-else class="h-5 text-gray-600"/>
        </Button>
        Pvt Notes
      </div>      
      <div class="text-sm text-gray-700 flex flex-row px-1 items-center justify-start">
        {{ pvtNotes }}
        </div>
    </div>
          
    
  </div>
  </div>

<Dialog v-model="pat_hit_dialog" :options="{size: '2xl'}">
    <template #body-title>
      <h3>Patient History & Notes</h3>
    </template>
    <template #body-content>
      <div class="grid grid-cols-2 gap-1">
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
        <Rating v-model="rating" v-show="false"/>
      <Textarea v-model="pvtNotes" label="Pvt Notes" placeholder='Your Pvt Notes' class="h-40 rounded-lg text-sm mb-6"/>
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
      <span class="flex flex-row item-center justify-center mt-3" v-show="!history_flag">
    <Button @click="update_patient();" :loading="patient.get.loading" 
    class="rounded-full bg-white border border-teal-800 text-teal-800">
    Update Patient</Button></span>
    </div>
    </template>
    <!-- <template #actions>
      <Button @click="update_patient();" :loading="patient.get.loading"
      class="rounded-full bg-white border border-teal-800 text-teal-800" v-show="!history_flag" >
        Confirm
      </Button>
    </template> -->
  </Dialog>
  {{error}}
</template>
<script setup>
import { ref,watch,reactive } from 'vue';
import { User,ChevronsLeft,ChevronsRight,Phone,Siren,Pencil,HeartPlus,MessageCirclePlus } from 'lucide-vue-next';
import {Badge, FormControl,Button,Rating, createDocumentResource,Dialog,Textarea} from 'frappe-ui';
import { direct_out } from '@/composables/useInteractionNotesDirect.js';
import { patient_panel } from '@/composables/usePatientStore.js';
import dayjs from 'dayjs';
import { createLexicon } from '@/composables/useCreateLexicon.js';
import NewLexicon from '@/component/shared/NewMedicalLexicon.vue';
const { history_flag}= createLexicon();

const { patientPanel_flag,pvtNotes,rating }= patient_panel();
const {result,result_grouped,comments,library,stop_submit} =direct_out();

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
// watch(() => patient.doc,
// (doc) => {
//   pvtNotes.value=patient.doc.patient_details;
//   rating.value=(patient.doc.rating*5);
//   notes.value=patient.doc.pat_hist;
//   hist_Date.value=patient.doc.history_updated_on;
//   if(notes.value){
//   interation_direct(notes.value);}
// // if(patient.doc.pat_hist){
// //   let hist=patient.doc.pat_hist.replaceAll(/'/g, '"');
// //     let hist_str_1 = hist.replaceAll('None', ' ');
// //     let hist_str = hist_str_1.replaceAll('>>', ' ');
// //     console.log("I fired"+hist_str)
// // pat_hist.value=JSON.parse(hist_str)
// // }
// })
function update_patient(){
let flag_save=false;
let res=result_grouped.value
  if((notes.value)!=(patient.doc.pat_hist)){
     // interation_direct(notes.value);
      if(stop_submit.value){
        flag_save=true;
        result_grouped.value=res;
      }else{
        hist_Date.value=dayjs().format("YYYY-MM-DD")
      }
    }
if(!flag_save){
patient.setValue.submit({
    pat_hist: notes.value.replace(/(\r\n|\n|\r|;\n)/g, ";\n"),
    //originalString.replace(/(\r\n|\n|\r)/g, ", ");
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
         //   interation_direct(notes.value)
          }, 1000);
          
          }
          
    }
    );
</script>