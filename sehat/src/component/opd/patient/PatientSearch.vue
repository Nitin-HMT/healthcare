<template>
  <div class="bg-inherit">
     <!--Search Bar-->
     <div>
      <div class=" grid grid-cols-12 gap-2 p-2">
        <div v-if="!patientStore.sel_pat"/>
        <div v-if="!patientStore.sel_pat" class="col-span-8 block w-full rounded-full px-2 py-2 bg-gray-100 border-solid border border-gray-100 hover:bg-gray-200/90 transition-all">
          <Autocomplete 
            :options="patientStore.patients" 
            v-model="patient"
            placeholder="Search Patient" 
            :multiple="false"
            class="block w-full rounded-full bg-gray-100 border-solid border border-gray-100 hover:bg-gray-200/90 transition-all "
          >
          <template #item-prefix="{ option }">
            <User class="w-4 h-4" :class="[
            option.gender === 'Female' ? 'text-pink-700' :'text-blue-700'
        ]" />
          </template>
            <template #prefix>
            <User class="w-4 h-4 mr-4 text-gray-700" />
            </template>
          </Autocomplete>
        </div>
        <div v-if="patientStore.sel_pat" class="col-span-8 flex flex-center">
          <PatientDisplay/>
        </div>
        
        <div><Button
            @click="add_patient=true"
            class="w-full rounded-full py-5 mt-1 bg-gray-300 border-solid border hover:bg-gray-400 text-lg transition-all"
            :variant="'subtle'"
            :ref_for="true"
            theme="gray"
            size="md"
            label="Button"
            :loading="false"
            :loadingText="null"
            :disabled="false"
            :link="null"
          >
          <UserPen class="w-6 h-6 rounded-full text-gray-700" v-if="patientStore.sel_pat"/>
          <UserPlus class="w-6 h-6 rounded-full text-gray-700" v-if="!patientStore.sel_pat"/>         
        </Button></div>
        <div class="col-span-1 gap-2 flex" v-if="patientStore.sel_pat">
          <div>
            <Button
            @click="updatePatient"
            class="w-full rounded-full py-5 mt-1 bg-gray-300 border-solid border hover:bg-gray-400 text-lg transition-all"
            :variant="'subtle'"
            :ref_for="true"
            theme="gray"
            size="md"
            label="Button"
            :loading="false"
            :loadingText="null"
            :link="null"
          >
          <CircleX class="w-6 h-6 rounded-full text-gray-700" />
          </Button>
          
    </div></div>
        
        
      </div>
    </div>
  </div>
  <Dialog :options="{
      title: 'Add/Edit Patient',
      size: '2xl',
      }"
      v-model="add_patient">
      <template #body-content>
         <div class= "text-md font-sans space-y-1"> 
            <span>
                <p class="font-mono text-gray-600 font-light flex items-center justify-end">{{ patientStore.sel_pat.name }}</p>
                <div class="grid md:grid-cols-3 gap-4 border-b border-grey-50/80 pb-3">
                  <FormControl v-model="data.new_patient[0]" :required="true" label="First Name" type="text" placeholder="First Name" />
                  <FormControl v-model="data.new_patient[1]" label="Middle Name" type="text" placeholder="Middle Name" />
                  <FormControl v-model="data.new_patient[2]" label="Last Name" type="text" placeholder="Last Name" />
                </div>
                <p></p>
                <div class="grid md:grid-cols-2 gap-4 mt-3">
                  <FormControl v-model="data.new_patient[3]" :required="true" label="Age" type="number" placeholder="Age" />
                  <FormControl type="select" :required="true" :options="data.gender" label="Gender" v-model="data.new_patient[4]" placeholder="Gender" />
                  <FormControl type="select" :options="data.blood" label="Blood Group" v-model="data.new_patient[5]" placeholder="Blood Group" />
                  <FormControl v-model="data.new_patient[6]" :required="true" label="Mobile" type="text" placeholder="Mobile" />
                
                  <!-- <FormControl v-model="data.new_patient[7]" label="Email" type="email" placeholder="Email" /> -->
                </div>
            </span>
            <ErrorMessage :message="make_patient.error"/>
          </div>
      </template>
      <template #actions>
        <div class="flex flex-row justify-start items-center ">
           <div v-if="data.new_patient[6] && data.new_patient[6].length==10">
            <Button @click="make_patient.submit()" v-if="data.new_patient[6].length==10" :loading="make_patient.loading" variant="solid" class="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white transition-all">
              Save/Update
            </Button>
          </div>
          <div v-else class="text-xs text-red-800">Mobile Number Incorrect (10 Digits only)</div>
            <Button variant="subtle" class="ml-2" @click="clear">Clear</Button>
            <Button class="ml-2 bg-gradient-to-r from-red-800 to-red-600 hover:from-red-900 hover:to-red-700 text-white transition-all"
              @click="add_patient = false">Close</Button>
        </div>
  </template>
  </Dialog>
</template>

<script setup>
import { reactive, ref,watch } from 'vue';
import { Button,Autocomplete,Dialog,FormControl } from 'frappe-ui';
import { CircleX,UserPlus, User, UserPen } from 'lucide-vue-next';
import { createResource, ErrorMessage } from 'frappe-ui';
import { usePatientStore } from '@/stores/patientStore';
import PatientDisplay from '@/component/opd/patient/PatientDisplay.vue';
import { useRoute } from "vue-router";
const route= useRoute();
//const pat_id = route.params.pat_id;

const patientStore = usePatientStore()
const patient =ref("")
const data = reactive({
        new_patient: [null, null, null, null, null, null, null, null],
        gender: [{label:'Male',value:'Male',},{label:'Female',value:'Female',},{label:'Other',value:'Other',}],
        blood: [{label:'A +',value:'A Positive',},{label:'A -',value:'A Negative',},
                {label:'AB +',value:'AB Positive',},{label:'AB -',value:'AB Negative',},
                {label:'B +',value:'B Positive',},{label:'B -',value:'B Negative',},
                {label:'O +',value:'O Positive',},{label:'O -',value:'O Negative',},
              ]
    });
    const add_patient =ref(false);
    watch(patient,
        async (patient) => {
        if (patient) {
          console.log(patient);
          //data.new_patient = data.selected.new
          patientStore.setSel_pat(patient);
          data.new_patient=patient.new;   
    }
    }
    );
    function updatePatient(){
        data.new_patient=[null, null, null, null, null, null, null, null];
        patientStore.clearSel_pat();
        patient.value=null;

    }
    const make_patient = createResource({
        url: 'healthcare.api.make_patient',
        makeParams(){
            return {
                ptname:patientStore.sel_pat,
                new_pt:data.new_patient
            }
        },
        onSuccess: (d) => {
          //Patient_details.fetch();
          add_patient.value=false;
          data.new_patient.splice(0);
          let label = d.patient_name;
            let description = d.patient_name+" | "+d.aged+" Yrs";
            let value= label+","+d.mobile;
            if(patientStore.sel_pat){
                if(patientStore.sel_pat.i>=0){
                  //Modifying old Patient
                  //Modifying Something with a Position number - i number
                  let pt = {"i":patientStore.sel_pat.i,"label": label, "description": description, "value": value, "gender": d.sex,"gen_abbr": d.gen_abbr, "name":d.name, 
            "new":[d.first_name,d.middle_name,d.last_name,d.aged,d.sex,d.blood_group,d.mobile,d.email] };
                  patientStore.modPat(patientStore.sel_pat.i,pt)
                  patientStore.setSel_pat(pt);
                  patient.value=pt;
                }

            }else{
            let counter= (patientStore.patients.length)
          let pt = {"i":counter,"label": label, "description": description, "value": value, "gender": d.sex,"gen_abbr": d.gen_abbr, "name":d.name, 
            "new":[d.first_name,d.middle_name,d.last_name,d.aged,d.sex,d.blood_group,d.mobile,d.email] };
            if(patientStore.sel_pat){console.log("oid"+patientStore.sel_pat.i)}
            patientStore.setPatients(pt);
            patientStore.setSel_pat(pt);
            patient.value=pt;
        } }  
    })
    // make_allergy.submit()
    function clear(){
      data.new_patient.splice(0);
      data.new_patient=[null, null, null, null, null, null, null, null];
    }
    // <ErrorMessage :message="make_allergy.error"/>
</script>
