<template>
  <div>
     <!--Search Bar-->
     <div class="bg-blue-50 bg-opacity-30 border-solid border-b-2 border-green-100">
      <div class=" px-[30px] pb-1 pt-4 mx-6 grid grid-cols-12 gap-2">
        <div></div>
        <div class="col-span-9">
          <Autocomplete 
            :options="all_searches" 
            v-model="data.selected"
            placeholder="Search Patient" 
            :multiple="false"
            class="block w-full rounded-full font-serif bg-gray-100 border-solid border border-gray-100 hover:bg-gray-200/90 transition-all "
          >
          <template #item-prefix="{ option }">
            <FeatherIcon class="w-4 h-4" :class="[
            option.gender === 'Female' ? 'text-pink-700' :'text-blue-700'
        ]"  name="user"/>
          </template>
            <template #prefix>
            <!--<FeatherIcon
              class="w-5 font-extrabold text-teal-700"
              name="search"
            />-->
            <FeatherIcon class="w-4 h-4 mr-4 text-gray-700"  name="users"/>
            </template>
          </Autocomplete>
        </div>
        <div class="col-span-2 gap-2 flex">
          <div><Button
            @click="add_patient=true"
            class="rounded-full"
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
          <FeatherIcon class="w-6 h-6 text-gray-700"  name="user-plus"/>
          </Button></div>
          <div>
            <Button
            @click="updatePatient"
            class="rounded-full"
            :variant="'subtle'"
            :ref_for="true"
            theme="gray"
            size="md"
            label="Button"
            :loading="false"
            :loadingText="null"
            :link="null"
          >
          <FeatherIcon class="w-6 h-6 rounded-full text-gray-700"  name="refresh-ccw"/>
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
                <p class="font-mono text-gray-600 font-light flex items-center justify-end">{{ data.selected.name }}</p>
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
            <Button @click="make_patient.submit()" v-if="data.new_patient[6].length==10" :loading="make_patient.loading" variant="solid" class="bg-gradient-to-r from-pink-500 to-blue-600 hover:from-pink-600 hover:to-blue-700 text-white transition-all">
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
import { reactive, ref,watch,inject } from 'vue';
import { Button,Autocomplete,FeatherIcon,Dialog,FormControl } from 'frappe-ui';
import { createListResource,createResource, ErrorMessage } from 'frappe-ui';
import { usePatientStore } from '@/stores/patientStore'

const data = reactive({
        selected: "",
        appnt_patient: "",
        appointment_name: "",
        new_patient: [null, null, null, null, null, null, null, null],
        gender: [{label:'Male',value:'Male',},{label:'Female',value:'Female',},{label:'Other',value:'Other',}],
        blood: [{label:'A +',value:'A Positive',},{label:'A -',value:'A Negative',},
                {label:'AB +',value:'AB Positive',},{label:'AB -',value:'AB Negative',},
                {label:'B +',value:'B Positive',},{label:'B -',value:'B Negative',},
                {label:'O +',value:'O Positive',},{label:'O -',value:'O Negative',},
              ]
    });
    const all_searches = ref([]);
    const add_patient =ref(false);
    let sel_pat=inject("patient");
    //const Patient_details= ref("");
    let Patient_details = createListResource({
        doctype: "Patient",
        fields: ["*"],
        filters: {
            status: 'Active'
        },
        auto: true,
        pageLength: 200000,
        transform(data) {
        for (let d of data) {
            let label = d.patient_name;
            let description = d.patient_name+" | "+d.aged+" Yrs";
            let value= label+","+d.mobile;
            let pt = { "label": label, "description": description, "value": value, "gender": d.sex,"gen_abbr": d.gen_abbr, "name":d.name, 
            "new":[d.first_name,d.middle_name,d.last_name,d.aged,d.sex,d.blood_group,d.mobile,d.email] };
            all_searches.value.push(pt);
        }
        }
    }); 
    watch(() => data.selected,
        (selected) => {
        if (selected) {
          data.new_patient = data.selected.new
          sel_pat.details=""
          sel_pat.appoint=""
          sel_pat.details=data.selected
          sel_pat.ref_flag=true
          console.log("I am indide pt search watcher dataselect")
          

const patientStore = usePatientStore()
patientStore.setPatient({
  name: 'PT-0001',
  full_name: 'John Doe',
  age: 34,
  gender: 'Male',
  mobile_no: '9876543210',
  doctor_notes: 'Chronic hypertension'
})
    }
    }
    );
watch(() => sel_pat.details,
(details) => {
if(!details){
  data.selected="";
}else{
  data.selected=sel_pat.details;
}
});
    function updatePatient(){
        all_searches.value.splice(0);
        sel_pat.details=""
        sel_pat.appoint=""
        sel_pat.ref_flag=true
        Patient_details.fetch();
        data.new_patient=[];
        data.selected="";

    }
    const make_patient = createResource({
        url: 'healthcare.api.make_patient',
        makeParams(){
            return {
                ptname:data.selected,
                new_pt:data.new_patient
            }
        },
        onSuccess: (d) => {
          Patient_details.fetch();
          add_patient.value=false;
          data.new_patient.splice(0);
          let label = d.patient_name;
            let description = d.patient_name+" | "+d.aged+" Yrs";
            let value= label+","+d.mobile;
          let pt = { "label": label, "description": description, "value": value, "gender": d.sex,"gen_abbr": d.gen_abbr, "name":d.name, 
            "new":[d.first_name,d.middle_name,d.last_name,d.aged,d.sex,d.blood_group,d.mobile,d.email] };
            data.selected=pt;
        // add_item.allergy=[];
        // add_item.create_new=false;
        // allergy.fetch();
          console.log(d);
        }   
    })
    // make_allergy.submit()
    function clear(){
      data.new_patient.splice(0);
      data.new_patient=[null, null, null, null, null, null, null, null];
    }
    // <ErrorMessage :message="make_allergy.error"/>
</script>
