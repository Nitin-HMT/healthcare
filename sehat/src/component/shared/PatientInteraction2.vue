<template>
  <!-- Release 1<br/>
          7.need to format the placement/color of final submit<br/>
          8.Do I need to improve the patient history? not closing auto<br/>
          9.Stop Submit if Medicine dosage isnt updated- and update the same if blanks - UPDATE FUNCTION NEEDS TO BE MADE<br/>
          10. Develop *Fuzy Match* and Aliases, may be lookup using generic name as well<br/>
          11. Develop Medical Templates<br/>
          a. progress bar- on all activities, throttle check <br/>
          b. dont directly go to print and list page after submit, hold that page and then go for print<br/>
          c. All input on the lhs and all buttons on the RHS<br/>
          d. edit db easily<br/>
          e. ** Not medicine or medicine and ????<br/>
======================================<br/>          
          12. develop one master drug and several ways to order it by doctors??<br/>
          13. break the patient interaction code into smaller pieces.<br/>
         ** fuzy and master and list can be iteration 2 -->
    <div class="flex-grow border pt-4 text-sm bg-white rounded-b-lg border-x-8 border-teal-50">
      <div class="px-2">
        <div class="text-xs capitalize text-gray-500 pt-1" v-if="true">Coming Soon: Near Matches, abbreviations, Treatment Plans, Energy Points</div>
        <div class="text-xl font-semibold pb-1">Interaction Notes</div>
        <!-- <div class="text-sm p-1 font-medium tracking-wide bg-white text-teal-800 rounded-md pl-2 ">Please Review if all your Obx & Rx have been Transcribed Correctly</div> -->
        <div class="col-span-1 grid grid-cols-4 gap-2 gap-x-3 tracking-wide">

          <div class="col-span-4 grid grid-cols-6 gap-1 border border-red-400 rounded-lg pb-1" v-if="result_grouped && result_grouped.Unknown">
              <p class="text-sm font-medium px-1 gap-2 pl-1 my-1 col-span-6 underline">I didn't Understand these Terms:</p>
              <div class="text-sm font-medium tracking-wide text-red-500 pl-2 pb-1 col-span-6 ">
                Couldn't Transcribe these, Please Review them, Create a new Medical Terminology if Required, <br/>If not, they will be added to comments</div>
              <div v-for="(item,index) in result_grouped.Unknown" class="flex flex-wrap gap-x-2 pt-1 pl-2 align-baseline">
                <Pencil class="h-4 text-teal-800 cursor-pointer -mr-1 " @click="phraseCorrection(item)"/>
                {{item.Functional}}
               <Badge :variant="'outline'" size="sm" theme="red" @click="create_new_element(item)" class="cursor-pointer">Fix</Badge>
              </div>
            </div>

            <div class="flex flex-col">
              Obx,
              <div class="grid grid-cols-1 gap-1 py-0.5" v-if="result_grouped && result_grouped.Symptoms">
                <p class="text-sm font-medium px-1 gap-2 pl-1 my-0.5 flex-grow underline">Symptoms & Obx:</p>
                <div v-for="(item,index) in result_grouped.Symptoms" class="flex gap-x-2 pt-0.5 pl-2 align-baseline">
                  <Pencil class="h-4 text-teal-800 cursor-pointer -mr-2 " @click="phraseCorrection(item)"/>
                  <div v-if="item.new">{{item.Functional}}<Badge :variant="'outline'" size="sm" theme="orange" @click="create_new_element(item)" class="cursor-pointer">Review</Badge></div>
                  <div v-else class="align-baseline flex gap-x-2">{{item.Item[1]}}
                    <FormControl :type="'text'" disabled="true" v-if="item.Qualifier[0]" size="sm" variant="outline" placeholder="Comments" v-model="item.Qualifier[0].comments"/>
                  </div>
                  
              </div>
              </div>
              <div class="grid grid-cols-1 gap-1 py-0.5" v-if="result_grouped && result_grouped.Diagnosis">
                <p class="text-sm font-medium px-1 gap-2 pl-1 my-0.5 flex-grow underline">Diagnosis:</p>
                <div v-for="(item,index) in result_grouped.Diagnosis" class="flex gap-x-2 pt-0.5 pl-2 align-baseline">
                <Pencil class="h-4 text-teal-800 cursor-pointer -mr-2 " @click="phraseCorrection(item)"/>
                  <div v-if="item.new">{{item.Functional}}<Badge :variant="'outline'" size="sm" theme="orange" @click="create_new_element(item)" class="cursor-pointer">Review</Badge></div>
                  <div v-else class="align-baseline flex gap-x-2">{{item.Item[1]}}
                    <FormControl :type="'text'" disabled="true" v-if="item.Qualifier[0]" size="sm" variant="outline" placeholder="Comments" v-model="item.Qualifier[0].comments"/>
                  </div>
                </div>
              </div>
              <VitalsPanel :Pat_id="props.Pat_id" :App_id= "props.App_id" Collapse= true Request_from= "OPD" />
            </div>
            <div class="col-span-3">
              Rx,
            <div class="grid grid-cols-1 gap-1 py-0.5" v-if="result_grouped && result_grouped.labs">
              <p class="text-sm font-medium px-1 gap-2 pl-1 my-0.5 flex-grow underline">Labs:</p>
              <div v-for="(item,index) in result_grouped.labs" class="flex gap-x-2 pt-0.5 pl-2 align-baseline">
              <Pencil class="h-4 text-teal-800 cursor-pointer -mr-2 " @click="phraseCorrection(item)"/>
                <div v-if="item.new">{{item.Functional}}<Badge :variant="'outline'" size="sm" theme="orange" @click="create_new_element(item)" class="cursor-pointer">Review</Badge></div>
                  <div v-else class="align-baseline flex gap-x-2">{{item.Item[2]}}
                    <FormControl :type="'text'" disabled="true" v-if="item.Qualifier[0]" size="sm" variant="outline" placeholder="Comments" v-model="item.Qualifier[0].comments"/>
                  </div>
                </div>
            </div>
            <div class="grid grid-cols-1 gap-1 py-0.5" v-if="result_grouped && result_grouped.surg">
              <p class="text-sm font-medium px-1 gap-2 pl-1 my-0.5 flex-grow underline">Procedure:</p>
              <div v-for="(item,index) in result_grouped.surg" class="flex gap-x-2 pt-0.5 pl-2 align-baseline">
               <Pencil class="h-4 text-teal-800 cursor-pointer -mr-2 " @click="phraseCorrection(item)"/>
                <div v-if="item.new">{{item.Functional}}<Badge :variant="'outline'" size="sm" theme="orange" @click="create_new_element(item)" class="cursor-pointer">Review</Badge></div>
                  <div v-else class="align-baseline flex gap-x-2">{{item.Item[2]}}
                    <FormControl :type="'text'" disabled="true" v-if="item.Qualifier[0]" size="sm" variant="outline" placeholder="Comments" v-model="item.Qualifier[0].comments"/>
                  </div>
                </div>
            </div>
            <div class="grid grid-cols-1 gap-1 py-0.5" v-if="result_grouped && result_grouped.Meds">
              
              <p class="text-sm font-medium px-1 gap-2 pl-1 my-0.5 flex-grow underline">Medicine:</p>
              <div v-for="(item,index) in result_grouped.Meds" class="flex gap-x-2 pt-0.5 pl-2 align-baseline">
               <Pencil class="h-4 text-teal-800 cursor-pointer -mr-1 " @click="phraseCorrection(item)"/>
               <div class="align-baseline grid grid-cols-5 gap-x-1">
                <div v-if="item.new" class="col-span-2 flex gap-x-2">{{item.Functional}}<Badge :variant="'outline'" size="sm" theme="orange" @click="create_new_element(item)" class="cursor-pointer">Review</Badge></div>
                <div v-else-if="!item.Qualifier[0] || !(item.Qualifier[0] && item.Qualifier[0].medicine_form!=null && item.Qualifier[0].dosage!=null
                 && item.Qualifier[0].period!=null)" class="col-span-2 grid grid-cols-4 gap-x-2">
                  <div class="col-span-4 flex">{{ item.Qualifier[0].medicine_form }}{{item.Item[7]}}
                  <Badge :variant="'outline'" size="sm" theme="red" @click="create_new_element(item)" class="cursor-pointer">Fix</Badge></div>
                </div>
                <div v-else class="col-span-2 flex gap-x-2">
                    <div  class="flex"><div v-if="item.Qualifier[0]" class="pr-0.5">{{ item.Qualifier[0].medicine_form }}</div>
                    {{item.Item[7]}}</div>
                </div>
                    <FormControl :type="'text'" disabled="true" :options="library.dosage_db" v-if="item.Qualifier[0]" size="sm" variant="outline" placeholder="Dose" v-model="item.Qualifier[0].dosage"/>
                    <FormControl :type="'text'" disabled="true" :options="library.duration_db" v-if="item.Qualifier[0]" size="sm" variant="outline" placeholder="Period" v-model="item.Qualifier[0].period"/>
                    <FormControl :type="'text'" class="flex" disabled="true" v-if="item.Qualifier[0]" size="sm" variant="outline" placeholder="Comments" v-model="item.Qualifier[0].comments"/>
              </div>
                </div>
            </div>
            <div class="grid grid-cols-1 gap-1 py-2" v-if="result_grouped && result_grouped.Allergy">
              <p class="text-sm px-1 gap-2 pl-1 my-0.5 flex-grow text-amber-500">
                Allergy Terminology used, Not Processed, Please add these to Patient History via Patient Panel</p>
              
            </div>
            
            </div>          
        </div>
        <div class="grid grid-cols-4 gap-1 py-0.5">
          <div/><div class="col-span-3">
              <p class="text-sm font-medium px-1 gap-2 pl-1 my-1 flex-grow underline" v-if="comments||interaction.follow_up||selrefdr.label">
                More Information:</p>
              <div class="flex flex-col gap-1 pt-1 pl-2 align-baseline">
                <div v-if="comments" class="flex">
                  <Pencil class="h-4 text-teal-800 cursor-pointer -mr-1 " @click="phraseCorrection(comments)"/>
                  <b>Comments:</b> {{ comments }}</div>
                <div class="grid grid-cols-12 gap-2">
            <FormControl variant="outline" type="autocomplete" :options="referdr" v-model="selrefdr" placeholder="Refer To" 
                class="col-span-4 rounded-full"/>
            <Button :variant="'outline'" size="md" label="+"
                class="rounded-full bg-white border border-teal-800 text-teal-800" @click="refer_create=true"/>
            <div class="col-span-2"></div>
            <FormControl variant="outline" :type="'number'" :ref_for="true" size="sm" placeholder="Follow-up (In Days)"
                v-model="interaction.follow_up" class="col-span-5"/>
            </div>
              </div></div>
        </div>
        <div class="m-3 flex flex-grow items-end justify-end pr-8 gap-x-2">
             <!-- <div class="py-2 text-sm grid grid-cols-1">{{interaction.notes}}</div> 
              v-if="!stop_submit"
             -->
            <!-- <Button :variant="'subtle'" size="md" label="Back"
                class="rounded-full bg-white border border-teal-800 text-teal-800" @click="review=false;patientPanel_flag=false;vitals_flag=true"/> -->
                <Button :variant="'subtle'" v-if="!interaction_flag" size="md" label="Submit" 
                class="rounded-full bg-teal-800 border border-white text-white
                 hover:text-teal-800 hover:border-teal-800 hover:bg-white" @click="time_differnce(start_time),interaction_flag=true"/>
                 <!-- <Badge v-else label="Unrecognised Terms, Please Fix to Submit" disabled="true" :theme="'red'"/> -->
        </div>
    </div>
       <div v-if="!interaction_flag">
       <OPDButtons :Pat_id="pat_id" :App_id= "app_id" Collapse= true :Request_from= "route.name"/>
    <div class="p-1.5 py-4 text-sm bg-teal-50">
        <div>
          <!-- <div class="text-md font-semibold">Impression & Advise</div> -->
          <div class="grid grid-cols-10 gap-3">
        <div class="col-span-9">      
        <Popover>
  <template #target="{ togglePopover }">
    <Textarea
    :variant="'outline'" placeholder=
'You can use symbols to force match (optional): 
@ symptoms, # Meds, $ labs, ^ Diagnosis, * Procedure, ! Allergy, "" Descriptive Comments' class="w-full h-20 resize-none text-sm col-span-9" 
        @keyup.enter.stop="chat_Append(interaction.chat)"
        @focus="togglePopover()"
        @keyup.stop="chat_search(interaction.chat)"
        v-model="interaction.chat"/>
  </template>
  <template #body-main v-if="continuos_input.show_result">
    <div v-for="(item,index) in all_search" 
    class="p-1 px-2 text-xs text-gray-900 hover:bg-gray-100/80 rounded-sm">
      <div v-if="item[0] =='Meds'" class="grid grid-cols-6">
        <div class="col-span-2 flex items-center gap-x-1" @click="interaction.chat=item[2]+' '+item[7];
        continuos_input.show_result=false
        ">
        <!-- +' '+item[5]+' '+item[4] -->
          <Avatar :shape="'square'" :image="'/files/pill_yellow.jpg'" size="xs"/>
          {{item[2]}} {{item[7]}}
        </div>
        <div>{{item[5]}}</div>
        <div>{{item[4]}}</div>
        <div class="col-span-2 flex item-end justify-end text-gray-700">{{item[3]}}</div>
      </div>
      <div v-else-if="item[0] =='Symptoms'" @click="interaction.chat=item[1];chat_Append(interaction.chat)"><div class="flex items-center gap-x-1">
          <Avatar :shape="'square'" :image="'/files/symptoms.jpg'" size="xs"/>
          {{item[1]}}
      </div></div>
      <div v-else-if="item[0] =='Diagnosis'" @click="interaction.chat=item[1];chat_Append(interaction.chat)"><div class="flex items-center gap-x-1">
          <Avatar :shape="'square'" :image="'/files/diagnosis.jpg'" size="xs"/>
          {{item[1]}}
      </div></div>
      <div v-else-if="item[0] =='labs'" @click="interaction.chat=item[2];chat_Append(interaction.chat)"><div class="flex items-center gap-x-1">
          <Avatar :shape="'square'" :image="'/files/lab_test_blue_2.jpg'" size="xs"/>
          {{item[2]}}
      </div></div>
      <div v-else-if="item[0] =='surg'" @click="interaction.chat=item[2];chat_Append(interaction.chat)"><div class="flex items-center gap-x-1">
          <Avatar :shape="'square'" :image="'/files/surgery _red.jpg'" size="xs"/>
          {{item[2]}}
      </div></div>
      <div v-else-if="item[0] =='Allergy'" @click="interaction.chat=''"><div class="flex items-center gap-x-1">
          <Avatar :shape="'square'" :image="'/files/diagnosis.jpg'" size="xs"/>
          {{item[1]}}
      </div></div>
      <div v-else>{{item}}</div>
      <!-- {{item}} -->
    </div>
    
  </template>
</Popover>
      </div>
        <div class="flex flex-grow items-center justify-center rounded-md hover:bg-teal-800/70 bg-teal-800 text-white text-base" 
        @click="chat_Append(interaction.chat); review=true; patientPanel_flag=true;vitals_flag=false">
            Confirm
        </div> </div>
        <div class="text-xs text-gray-600 font-light font-mono mt-2 flex items-end justify-end">{{interaction.notes}}</div>
        </div>        
    </div>
      </div>
      <div v-else class="grid grid-cols-3 gap-x-3 gap-y-2 p-2 border-b-8 border-teal-50 bg-blue-50/30">
        
         
      <div class="font-extrabold text-lg col-span-3 flex items-center justify-center">
          Review, Submit & Print
        </div>
        <div v-if="stop_submit" class="font-light text-md col-span-3 flex items-center justify-center">
          New Terminology found, Please Review them, all categorised terminology will be added to the lexicon
          as is.<br/> Incase of Uncategorised Terms, they will be put under Doctors Comments.<br/>
          Incase of New Medicine, Please review them before submit, else System will ask you to verify each one.
        </div>
        
        <div class="text-sm col-span-3 flex items-center justify-center"> Please Confirm that the transcriptions are correct. </div>
        <div class="col-span-2 flex items-center justify-start">  
         <Switch
    size="sm"
    label="I confirm The Transcription"
    :disabled="false"
    v-model="submit_choice"
    class="bg-green-100 hover:bg-teal-200/60 active:bg-teal-200/60"
  />
  </div>
  <div class="text-xs pt-2 text-gray-800 capitalize flex flex-wrap item-center justify-center">Consultation Time: {{time_diff}} mins</div>
  <FormControl :type="'textarea'" v-model="submit_comments" 
      v-show="submit_choice==false" placeholder="Please tell us about the transcription error"/>
      <div v-if="submit_choice==true"/>
      <div v-if="submit_choice==true" class="text-sm 
      capitalize flex flex-col">
        Would you like to create a template from this Transcription for Future Use?
        <span class="text-blue-700 underline">yes</span>
      </div>
      <div class="text-sm text-red-700 capitalize flex flex-wrap items-center justify-center" v-if="submit_choice==false">Incase of incorrect transcription, a Blank prescrption will be printed with your Impressions,
         You can make the Prescription by hand</div>  
  <div class="text-sm text-blue-800 capitalize flex flex-wrap items-center justify-center"> Please save the patient history & notes from the patient panel before confirming transcription, 
        you will not get chance to do so after submission</div>  
         
  <div class="flex flex-row items-center justify-center">
      <Button @click="make_prescription(false)" v-if="submit_choice==false && submit_comments.length>0" :loading="interaction_load"
      class="rounded-full bg-white border border-red-800 text-red-800 hover:bg-red-800/30" >
       Submit Prescription & Report Discrepancy
      </Button>
      <Button @click="make_prescription(true)" v-if="submit_choice==true" :loading="interaction_load"
      class="rounded-full bg-teal-800 border text-white hover:bg-teal-500" >
         Approve Transcript
      </Button>
      <Button @click="interaction_flag=false" 
      class="rounded-full ml-2" :variant="'solid'" theme="gray">
        Back to Chat
      </Button></div>
      <ErrorMessage :message="error_interaction" />
    <ErrorMessage message="Error: Please select transcription failed and complete submission, we will review it further" v-if="error_interaction" />
      </div>    
  </div>
    

<!-- Dialog to create a new reffering doctor/ department-->
  <Dialog v-model="refer_create">
    <template #body-title>
      <h3>Create Referal Doctor</h3>
    </template>
    <template #body-content>
      <div class="flex flex-col gap-3">
        <ErrorMessage :message="error_ref"/>
        <FormControl v-model="refer_new.refer[0]" type="text" label="Doctor Name" placeholder="Referred To Doctor Name" />
        <FormControl v-model="refer_new.refer[1]" type="textarea" label="More Info" placeholder="More Info eg Speciallity, Mobile No." />
      </div>
    </template>
    <template #actions>
      <Button @click="make_newRef(refer_new.refer[0],refer_new.refer[1])" v-if="refer_new.refer[0]"
      class="rounded-full bg-white border border-teal-800 text-teal-800" >
        Confirm
      </Button>
    </template>
  </Dialog>

  <Dialog v-model="correction">
    <template #body-title>
      <h3>Edit Phrase</h3>
    </template>
    <template #body-content>
      <div class="flex flex-col gap-3">
        <FormControl v-model="under_operation.correction" type="textarea" label="Phrase Correction" />
      </div>
    </template>
    <template #actions>
      
      <Button @click="correct_phrase()"
      class="rounded-full bg-white border border-teal-800 text-teal-800 mr-1" >
        Confirm
      </Button>
      <Button @click="remove_phrase()"
      class="rounded-full bg-white border border-red-800 text-red-800 mr-1" >
        Delete
      </Button>
      <Button @click="correction=false;under_operation.original=''; under_operation.correction='';"
      class="rounded-full bg-white border border-teal-800 text-teal-800 mr-1" >
        Close
      </Button>
      
    </template>
  </Dialog>

  <Dialog v-model="lexicon_flag" :options="{size: '4xl'}" v-if="submit_sp_dialog_flag">
    <template #body-title>
      <h3 class="text-lg font-semibold pb-1">Add to Medical Lexicon</h3>
    </template>
    <template #body-content>
      <NewLexicon :Phrase="under_operation" />
    </template>
    
  </Dialog>

  <!-- <Dialog v-model="interaction_flag_s" :options="{size: 'xl'}">
    <template #body-title>
      <h3>Submit & Print</h3>
    </template>
    <template #body-content>
      <div class="flex flex-col gap-3">
        <!-- review=false;patientPanel_flag=false;vitals_flag=true
       <div class="text-sm"> Please Confirm that the transcriptions are correct. </div>
              
         <TabButtons
    :buttons="[
      {
        label: 'Confirm',
        value: 'Correct',
      },
      {
        label: 'Incorrect',
        value: 'Incorrect',
      },
    ]"
    v-model="submit_choice"
  />
  <div class="text-sm text-gray-700" v-if="submit_choice=='Incorrect'">Incase of incorrect transcription, a Blank prescrption will be printed with your Impressions,
         You can make the Prescription by hand</div>
      <FormControl :type="'textarea'" v-model="submit_comments" 
      v-show="submit_choice=='Incorrect'" placeholder="Please tell us about the transcription error"/>
      </div>
      <div class="text-xs pt-2 text-gray-800 capitalize flex flex-wrap item-center justify-center"> Please save the patient history & notes from the patient panel before confirming transcription, 
        you will not get chance to do so after submission</div>
        <div class="text-xs pt-2 text-gray-800 capitalize flex flex-wrap item-center justify-center">Consultation Time: {{time_diff}} mins</div>
      <ErrorMessage :message="error_interaction" />
    <ErrorMessage message="Error: Please select transcription failed and complete submission, we will review it further" v-if="error_interaction" />
    </template>
    <template #actions>
      <div class="flex flex-row items-center justify-center">
      <Button @click="make_prescription(false)" v-if="submit_choice=='Incorrect' && submit_comments.length>0" :loading="interaction_load"
      class="rounded-full bg-white border border-red-800 text-red-800 hover:bg-red-800/30" >
       Submit Prescription & Report Discrepancy
      </Button>
      <Button @click="make_prescription(true)" v-if="submit_choice=='Correct'" :loading="interaction_load"
      class="rounded-full bg-teal-800 border text-white hover:bg-teal-500" >
         Approve Transcript
      </Button>
      <Button @click="interaction_flag=false" 
      class="rounded-full ml-2" :variant="'solid'" theme="gray">
        Close
      </Button></div>
    </template>
    
  </Dialog> -->
</template>
<script setup>

import { reactive,ref,watch } from 'vue';
import {Avatar,Textarea,Button, FormControl,Dialog,Badge,Switch,ErrorMessage,TextInput,Popover} from 'frappe-ui';
import { referral } from '@/composables/useReferralUtils.js';
import { direct_out } from '@/composables/useInteractionNotesDirect.js';
import { suggest } from '@/composables/useInteractionNotesSuggest.js';
import { patient_panel } from '@/composables/usePatientStore.js';
import VitalsPanel from '@/component/shared/VitalsDisplay.vue';
import NewLexicon from '@/component/shared/NewMedicalLexicon.vue';
import { createInteraction } from '@/composables/useCreateInteraction.js';
import { createLexicon } from '@/composables/useCreateLexicon.js';
import { Pencil } from 'lucide-vue-next';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';
import { useRoute } from "vue-router";
import OPDButtons from '@/component/opd/dashboard/OpdButtons.vue';
const route= useRoute();
const app_id = route.params.app_id;
const pat_id = route.params.pat_id;

const router = useRouter();
const start_time=dayjs()
const time_diff=ref("")
const { patientPanel_flag,vitals_flag }= patient_panel();
const { referdr, make_newRef, selrefdr,refer_create,error_ref } = referral();
const {result,interation_direct,result_grouped,comments,library,stop_submit} =direct_out();
const {search_direct,search_result,all_search} =suggest();
const { make_newInteraction, error_interaction,interaction_load,interaction_flag,interaction_id }= createInteraction();
const { make_newLexicon, error_lexicon,lexicon_flag,lexicon_load,lexicon_id }= createLexicon();
const review=ref(true);
const correction=ref(false);
const submit_choice=ref(false);
const submit_sp_dialog_flag=ref(true);
const submit_comments=ref("");
const under_operation=reactive({
  Display:"",
  Category:"",
  Name:"",
  Life_sty:"",
  lab_type:"No Result",
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
  const interaction= reactive({
    //notes:"Fever 2d; Seasonal Flu, CBC \n Inhalation, tab azithromycin OD x5d \n Amputation of Toe",
    //notes:'"plenty of rest required" fever;@bloody nose;cough 2 days;seasonal flu more comment;cbc;test;stamlo 5mg test test;thyronorm 75 once daily 3 months;exercise;amputation of toe comment',
    notes:"",
    chat:"",
    follow_up:null
})
  const continuos_input= reactive({
    //search_result:[1,2,3,4,5,6,7],
    show_result:false
  })
function create_new_element(phrase){
  lexicon_flag.value=true;
  under_operation.Display=phrase.Display;
  under_operation.Category=phrase.Item[0];
  under_operation.Name=phrase.Item[1];
  if(under_operation.Category=="Meds" && phrase.Qualifier.length ){
    under_operation.med_panel[0]=phrase.Qualifier[0].medicine_form;
    under_operation.med_panel[2]=phrase.Qualifier[0].dosage;
    under_operation.med_panel[3]=phrase.Qualifier[0].period;
  }
}
function phraseCorrection(item){
  correction.value=true;
  under_operation.original=item.Original||'"'+item+'"';
  under_operation.correction=item.Original||'"'+item+'"';
}
function remove_phrase(){
  const step_1=interaction.notes.trim().replace(/\r\n?/g, "\n").replace(/\u2028|\u2029/g, "\n").replace(/[ \t]+/g," ").replace(/([@#%^$;,&*!])\1+/g,"$1").toLowerCase();
  const new_string=step_1.replace(under_operation.original+";","").trim().replace(/\r\n?/g, "\n").replace(/\u2028|\u2029/g, "\n").replace(/[ \t]+/g," ").toLowerCase().replace(/([@#%^$;,&*!])\1+/g,"$1")
  interaction.notes=new_string;
  interation_direct(new_string)
  correction.value=false;
  under_operation.original="";
  under_operation.correction="";
}
function correct_phrase(){
  const step_1=interaction.notes.trim().replace(/\r\n?/g, "\n").replace(/\u2028|\u2029/g, "\n").replace(/[ \t]+/g," ").replace(/([@#%^$;,&*!])\1+/g,"$1").toLowerCase();
  const new_string=step_1.replace(under_operation.original+";",under_operation.correction+";").trim().replace(/\r\n?/g, "\n").replace(/\u2028|\u2029/g, "\n").replace(/[ \t]+/g," ").replace(/([@#%^$;,&*!])\1+/g,"$1").toLowerCase();
  interaction.notes=new_string;
  interation_direct(new_string)
  correction.value=false;
  under_operation.original="";
  under_operation.correction="";
}
function make_prescription(correct_flag){
  const data=ref([]);
  const create_flag=ref(false);
  new_lexiconcheck()
  //step 4: Then submit it, if errored response, stop, if all clear then go ahead
  //step 5: if all okay, then print prescription
  //step 6: if template is selected as yes, then continue showing the pop-up and ask for template details
  //step 7: if template then print button and template
  //step 8: if no template then print and list of patients
  //step 9: after tempate made, step 8 - patient list
  //step 10: Progress bar for all of the above
  data.value=[interaction.notes,interaction.follow_up,selrefdr.value.name,props.Pat_id,props.App_id,props.Room_id,props.Request_from]
  create_flag.value=make_newInteraction(correct_flag,data.value,result.value,comments.value,submit_comments.value,time_diff.value)
  if(create_flag){
    //new prescription 
    review.value=true;
    patientPanel_flag.value=false;
    vitals_flag.value=false;
    router.push('/opd');
    // Navigating by named route
   // router.push({ name: 'UserDetail', params: { id: 123 } });
    //get next patient
  }
//
}
const refer_new= reactive({
  refer:[null,null]
});
function time_differnce(start){
const date1 = dayjs()
time_diff.value= date1.diff(start, 'minute')
}

watch(lexicon_flag,
        async (lexicon_flag) => {
          if(!lexicon_flag){
            under_operation.Display="";
          under_operation.Category="";
          under_operation.Name="";
          under_operation.Life_sty="";
          under_operation.lab_type="No Result";
          under_operation.surg_adv="";
          under_operation.med_panel=["","","","",""]
          setTimeout(() => {
            interation_direct(interaction.notes)
            submit_sp_dialog_flag.value=true;
          }, 2000);
          }
    }
    );
function chat_Append(chat){
  if(chat.length>1){
  interaction.notes=interaction.notes+chat.trim()+"; ";
  interation_direct(interaction.notes);
  interaction.chat="";
  continuos_input.show_result=false;
  //new_lexiconcheck()
}
}

function new_lexiconcheck(){
    //Step 1: On Accepting the Transcription, all the New ones will get first created
  //step 1a: stop at medicine to get full picture before proceeding
  //step 2: convert all unknowns to comments
  //step 3: run the interaction comments again through the function and reprocess it
  if(result.value){
    for (const key in result.value) {
      if(result.value[key].new && result.value[key].Category=="Unknown"){
        interaction.notes=interaction.notes.replace(result.value[key].Original+";","\""+result.value[key].Original+"\";").trim();
        interation_direct(interaction.notes);
      }
      else if(result.value[key].new && result.value[key].Category=="Meds"){

      if(result.value[key].Qualifier.length>0){
        let qual=result.value[key].Qualifier[0]
        //if all qualifiers are present, allow to create the lexicon and go ahead in the loop
        if('medicine_form' in qual && 'dosage' in qual && 'period' in qual){
          console.log("all qualifiers present but will even then need to stop for sanity check")
          create_new_element(result.value[key])
          break;
        }else{
          console.log("Incomplete Qualifier- User to Input")
          // Incomplete Qualifiers found, the submit Protocol is stopped and elements are needed to be entered
          create_new_element(result.value[key])
          break;
        } 
        //else break
      }
      else{
        console.log("No Qualifier- User to Input")
        // No Qualifiers found, the submit Protocol is stopped and elements are needed to be entered
        create_new_element(result.value[key])
        break;
      }
      }
      else if(result.value[key].new){
        submit_sp_dialog_flag.value=false;
        create_new_element(result.value[key])
        make_newLexicon(under_operation)
      }
      // else if(!result.value[key].new && result.value[key].Category=="Meds" && !result.value[key].Qualifier[0] && (!result.value[key].Qualifier[0].medicine_form==null ||
      //  !result.value[key].Qualifier[0].dosage==null || !result.value[key].Qualifier[0].period==null)){
      //   //old added medicine, not having default qualifier
      //   create_new_element(result.value[key])
      //   break;
      //  }
      
    }
  }
}

function chat_search(chat){
  
  if(chat.length>3 && (chat.indexOf('"'))){
    continuos_input.show_result=true
    //console.log("iam being called"+chat);

    search_direct(chat)
  }else{
    continuos_input.show_result=false
  }
}


</script>