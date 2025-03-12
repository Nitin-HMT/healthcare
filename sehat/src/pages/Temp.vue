<template>
  <!--Nav Bar containing the location and Patient Select and Create, display -->
  <nav>
    <div v-if="appoints.length && sel_pat.details.name">
    </div>
    <div v-else class="mt-4 md:mx-[200px] flex item-center justify-center gap-3 p-3">
    <Badge :variant="'solid'" class=" block w-full rounded-full px-2 py-2 font-serif item-center justify-center
    bg-gradient-to-r from-red-800 to-red-600 hover:from-red-900 hover:to-red-700 text-white transition-all" size="xl" label="No Appointment"/>
  </div>
  </nav>
  <!--{{ data.appnt_patient }}
   selected patient information display -->
  <div class="p-3 flex gap-2 gap-x-5 font-sans shadow-md bg-gradient-to-r  from-gray-200/30 from-20% via-gray-200/10 via-60% to-gray-200/60 to-90% rounded-sm space-y-2 justify-between flex-col" v-if="appoints.length && sel_pat.details.name">
  <!-- {{Patient_details.list.data[0].medical_history}} -->
    <span class="flex items-center gap-x-10 text-gray-900" >
      <Tabs as="div"  
      :tabs="[
        {
          label: 'History',
          content: history.hist
        },
        {
          label: 'Surgery',
          content: history.surg_hist
        },
        {
          label: 'Medication',
          content: history.meds
        },
        {
          label: 'Allergies',
          content: history.allergy
        },
        {
          label: 'Doctors Notes',
          content: history.patient_details
        },
        {
          label: 'More Information',
          content: ''
        },
      ]">
      <template #tab-panel="{ tab }">
        <div class="py-2">
          <div v-if="tab.label!= 'Doctors Notes' && tab.label!= 'More Information'" v-for="(x,index) in tab.content" class="grid grid-cols-4 gap-2 py-2">
            <FormControl v-if="tab.label=='History'" v-model="x[0]" :options="hist_history" type="autocomplete" placeholder="Name" />
            <FormControl v-if="tab.label=='Surgery'" v-model="x[0]" :options="surg_history" type="autocomplete" placeholder="Name" />
            <FormControl v-if="tab.label=='Medication'" v-model="x[0]" :options="med_history" type="autocomplete" placeholder="Name" />
            <FormControl v-if="tab.label=='Allergies'" v-model="x[0]" :options="aller_history" type="autocomplete" placeholder="Name" />
            <FormControl v-model="x[1]" type="text" placeholder="Since" />
            <FormControl v-model="x[2]" type="text" placeholder="Comment" />
            <div class="flex justify-start items-between pt-1 pr-6">
                <button><FeatherIcon class="w-6 h-6 text-red-600" name="x" @click="clear_Hist_line(tab.content,index)"/></button>
              </div>
          </div>
          <div v-else v-for="y in tab.content">
            {{y}}
          </div>
          <Button v-if="tab.label=='History'" @click="history.hist.push([''])">+ Add History</Button>
          <Button v-if="tab.label=='Surgery'" @click="history.surg_hist.push([''])">+ Add Surgery</Button>
          <Button v-if="tab.label=='Medication'" @click="history.meds.push([''])">+ Add Medication</Button>
          <Button v-if="tab.label=='Allergies'" @click="history.allergy.push([''])">+ Add Allergies</Button>
          <FormControl class="py-2" v-if="tab.label=='Doctors Notes'" v-model="more_info.pvt_notes" type="textarea" placeholder="Your Private Notes" />
          <div v-if="tab.label=='More Information'" class="grid md:grid-cols-3 gap-2 p-1 font-sans">
            <FormControl v-model="more_info.add_sym" type="textarea" placeholder="Further Description of Symptoms, Diagnosis & History" />
            <FormControl v-model="more_info.add_advise" type="textarea" placeholder="Further Advice" />
            <FormControl type="autocomplete" :options="referdr" v-model="more_info.add_referal" placeholder="Referred To"/>
          </div>
        </div>
      </template>
    </Tabs>
    <div class="flex items-end justify-end gap-2 col-span-2 mb-1">
      <!-- <Button
          @click="updateSearches"
          :variant="'subtle'"
          :ref_for="true"
          theme="green"
          size="md"
          label="Button"
          :loading="false"
          :loadingText="null"
          :link="null"
        >
        <FeatherIcon class="w-6 h-6 rounded-full text-gray-700"  name="refresh-ccw"/>
        </Button> -->
        <Button
          @click="clearAll"
          :variant="'solid'"
          :ref_for="true"
          theme="red"
          size="md"
          label="Button"
          :loading="false"
          :loadingText="null"
          :link="null"
        >
        <FeatherIcon class="w-6 h-6 rounded-full text-white"  name="trash-2"/>
        </Button>
      </div>


     <!-- <p v-if="Patient_details.list.data[0].medical_history">History:{{  Patient_details.list.data[0].medical_history }}</p>
      <p v-if="Patient_details.list.data[0].surgical_history">Surgery:{{  Patient_details.list.data[0].surgical_history }}</p>
      <p v-if="Patient_details.list.data[0].medication">Medications:{{  Patient_details.list.data[0].medication }}</p>
      <p v-if="Patient_details.list.data[0].allergies">Allergies: {{  Patient_details.list.data[0].allergies }}</p>
      <p class="text-red-700" v-if="Patient_details.list.data[0].patient_details">Notes: {{  Patient_details.list.data[0].patient_details }}</p>
    -->
    </span></div>
  <!--Search Bar-->
  <div v-if="appoints.length && sel_pat.details.name">
    <div class="px-[30px] py-4 mx-6 grid grid-cols-12 gap-2">
      <div class="col-span-10">
        <Autocomplete 
          :options="all_searches" 
          v-model="data.selected" 
          placeholder="Search for Symptoms, Diagnosis, Medicines, Labs or Procedures" 
          :multiple="true"
          class="block w-full rounded-full px-2 py-3 font-mono bg-gray-100 border-solid border border-gray-100 hover:bg-gray-200/90 transition-all "
        >
        <template #item-prefix="{ option }">
        <img
          :src="option.image.toString()"
          class="h-6 w-6"
        >
        </template>
          <template #prefix>
          <!--<FeatherIcon
            class="w-5 font-extrabold text-teal-700"
            name="search"
          />-->
          <FeatherIcon class="w-6 h-6" :class="[appoints[0].gender === 'Female' ? 'text-pink-700' :'text-blue-700']"  name="search"/>
          </template>
        </Autocomplete>
      </div>
      <div class="col-span-2 gap-2 flex">
        <div><Button
          @click="add_item.create_new=true"
          class="rounded-full"
          :variant="'subtle'"
          :ref_for="true"
          theme="gray"
          size="2xl"
          label="Button"
          :loading="false"
          :loadingText="null"
          :disabled="false"
          :link="null"
        >
        <FeatherIcon class="w-6 h-6" :class="[appoints[0].gender === 'Female' ? 'text-pink-700' :'text-blue-700']"  name="plus"/>
        </Button></div><div>
        <Button class= "rounded-full" v-if="doctor_flag"
      :loading="make_opd_prescription.loading"
      size="2xl"
      :variant="'subtle'"
      :loadingText="null"
      :disabled="false"
      :link="null"
      @click="submit_confirm=true"
    ><FeatherIcon class="w-6 h-6" :class="[appoints[0].gender === 'Female' ? 'text-pink-700' :'text-blue-700']" name="send"/></Button>
      <Button class="bg-gray-200 p-3 flex items-center justify-between text-xs font-light text-gray-600 rounded-lg" v-if="!doctor_flag">Only Doctors Allowed to Submit</Button>
  </div></div>
      
    </div>
  </div>
  <!-- PENDING--- ROVING PATIENT CREATION AND DISPLAY -->
   <!-- Display of Symptoms, Diagnsis, Meds etc -->
  <div class="grid md:grid-cols-3 gap-2 p-1">
    <ItemCard
      v-if="categorizedItems.syms.length > 0"
      @click="symDialogshown=true"
      title="Observations"
      :items="categorizedItems.syms"
      image="/files/symptoms.jpg"
      underlineColor="font-mono font-bold underline decoration-violet-600 flex items-center justify-between gap-4"
      cardClass="mt-4 p-3 shadow-md bg-violet-100/80 rounded-sm space-y-2 flex items-center justify-between flex-col hover:bg-violet-200 transition-all"
    />
    <ItemCard
      v-if="categorizedItems.diag.length > 0"
      @click="diagDialogshown=true"
      title="Diagnosis"
      :items="categorizedItems.diag"
      image="/files/diagnosis.jpg"
      underlineColor="font-mono font-bold underline decoration-green-600 flex items-center justify-between gap-4"
      cardClass="mt-4 p-3 shadow-md bg-green-100/80 rounded-sm space-y-2 flex items-center justify-between flex-col hover:bg-green-200 transition-all"
    />
    <ItemCard
      v-if="categorizedItems.lab.length > 0"
      @click="labDialogshown=true"
      title="Labs"
      :items="categorizedItems.lab"
      image="/files/lab_test_blue_2.jpg"
      underlineColor="font-mono font-bold underline decoration-blue-600 flex items-center justify-between gap-4"
      cardClass="mt-4 p-3 shadow-md bg-blue-800/10 rounded-sm space-y-2 flex items-center justify-between flex-col hover:bg-blue-800/20 transition-all"
    />
    <ItemCard
      v-if="categorizedItems.surgery.length > 0"
      @click="surDialogshown=true"
      title="Procedures"
      :items="categorizedItems.surgery"
      image="/files/surgery _red.jpg"
      underlineColor="font-mono font-bold underline decoration-red-600 flex items-center justify-between gap-4"
      cardClass="mt-4 p-3 shadow-md bg-red-100/50 rounded-sm space-y-2 flex items-center justify-between flex-col hover:bg-red-200 transition-all"
    />
    <ItemCard
      v-if="categorizedItems.meds.length > 0"
      @click="medDialogshown=true"
      title="Medicine"
      :items="categorizedItems.meds"
      image="/files/pill_yellow.jpg"
      underlineColor="font-mono font-bold underline decoration-amber-600 flex items-center justify-between gap-4"
      cardClass="col-span-2 mt-4 p-3 shadow-md bg-amber-100/50 rounded-sm space-y-2 flex items-center justify-between flex-col hover:bg-amber-200 transition-all"
    />
  </div>
  <!-- <div>
  <div v-if="appoints.length && sel_pat.details.name" @click="moreinfoDialog=true" class="py-2 m-1 flex items-center justify-between flex-col col-span-2 mt-4 px-3 shadow-md bg-teal-100/50 rounded-sm hover:bg-teal-200 transition-all">
      <span class="font-mono font-bold underline decoration-teal-600 flex gap-4">Patient History & Additional Information</span>
      <div class="grid md:grid-cols-7 gap-2 font-sans"> 
      <div v-if="more_info.add_sym" Class="col-span-2"><p class="font-bold">Further Symptoms: </p>{{more_info.add_sym}}</div>
      <div v-if="more_info.add_advise" Class="col-span-2"><p class="font-bold">Further Advise: </p>{{more_info.add_advise}}</div>
      <div v-if="more_info.add_followup"><p class="font-bold">Follow-up:</p> {{more_info.add_followup}} Days</div>
      <div v-if="more_info.add_referal"><p class="font-bold">Reffered To:</p> {{more_info.add_referal.label}}</div>
      <div v-if="more_info.pvt_notes"><p class="font-bold">Private Notes:</p> {{more_info.pvt_notes}}</div>
      <div class="col-span-7" v-if="data.history.length>0">
              <p class="font-bold">Patient History:</p>
              <span v-for="(item) in data.history"> 
                {{item.history_type}}-{{item.label}} {{item.since}} {{item.comment}} | 
            </span>
      </div>
    </div>
  </div></div> -->
  <!-- PENDING- Extra Data eg follow up etc entry-->

<!-- ALL DIALOGS-->
<Dialog :options="{
    title: 'Symptoms',
    size: 'lg'
    }"
    v-model="symDialogshown">
    <template #body-content>
        <ul class= "space-y-2">
            <li v-for="(item,index) in data.selected" class="gap-1 hover:bg-violet-300/30 hover:underline" > 
              <span v-if="item.type=='Complaint'" class="grid md:grid-cols-5 gap-2">
                <div class="col-span-2 font-serif font-light text-sm flex justify-start items-between pl-3 pt-1">{{item.label}}</div>
              <FormControl class="col-span-2" v-model="item.additional_attr" type="text" placeholder="Comments" />
              <div class="flex justify-end items-between pr-6" >
                <button><FeatherIcon class="w-6 h-6 text-red-600" name="x" @click="clear_line(index)"/></button>
              </div>
            </span>
            </li>
        </ul>
    </template>
</Dialog>
<Dialog :options="{
    title: 'Diagnosis',
    size: 'xl'
    }"
    v-model="diagDialogshown">
    <template #body-content>
        <ul class= "space-y-2">
            <!-- <li v-for="(item,index) in data.selected" > 
              <span v-if="item.type=='Diagnosis'" class="grid md:grid-cols-2 gap-2">
                {{item.label}} - {{ item.additional_attr }}</span>
            </li> -->
            <li v-for="(item,index) in data.selected" class="gap-1 hover:bg-green-200/30 hover:underline" > 
              <span v-if="item.type=='Diagnosis'" class="grid md:grid-cols-5 gap-2">
                <div class="col-span-2 font-serif font-light text-sm flex justify-start items-between pl-3 pt-1">
                  {{item.label}} 
                </div>
                <div class="col-span-2 font-serif font-light text-sm flex justify-start items-between pl-3 pt-1">
                  {{ item.additional_attr }}
                </div>
              <div class="flex justify-end items-between pr-6" >
                <button><FeatherIcon class="w-6 h-6 text-red-600" name="x" @click="clear_line(index)"/></button>
              </div>
            </span>
            </li>
        </ul>
    </template>
</Dialog>
<Dialog :options="{
    title: 'Labs',
    size: 'xl'
    }"
    v-model="labDialogshown">
    <template #body-content>
        <ul class= "space-y-2">
            <!-- <li v-for="(item,index) in data.selected" > 
              <span v-if="item.type=='Diagnosis'" class="grid md:grid-cols-2 gap-2">
                {{item.label}} - {{ item.additional_attr }}</span>
            </li> -->
            <li v-for="(item,index) in data.selected" class="gap-1 hover:bg-blue-200/30 hover:underline" > 
              <span v-if="item.type=='labs'" class="grid md:grid-cols-3 gap-2">
                <div class="col-span-2 font-serif font-light text-sm flex justify-start items-between pl-3 pt-1">
                  {{item.label}} 
                </div>
              <div class="flex justify-end items-between pr-6" >
                <button><FeatherIcon class="w-6 h-6 text-red-600" name="x" @click="clear_line(index)"/></button>
              </div>
            </span>
            </li>
        </ul>
    </template>
</Dialog>
<Dialog :options="{
    title: 'Procedures',
    size: '2xl'
    }"
    v-model="surDialogshown">
    <template #body-content>
        <ul class= "space-y-2">
            <!-- <li v-for="(item,index) in data.selected" > 
              <span v-if="item.type=='surg'" class="grid md:grid-cols-3 gap-2">
                {{item.label}} 
              <FormControl :type="'date'" v-model="item.additional_attr" placeholder="Date" />
              <FormControl v-model="item.additional_attr_2" type="text" placeholder="Comments" /></span>
            </li> -->
            <li v-for="(item,index) in data.selected" class="gap-1 hover:bg-red-200/30 hover:underline" > 
              <span v-if="item.type=='surg'" class="grid md:grid-cols-10 gap-2">
                <div class="col-span-3 font-serif font-light text-sm flex justify-start items-between pl-3 pt-1">
                  {{item.label}} 
                </div>
                <FormControl class="col-span-3" :type="'date'" v-model="item.additional_attr" placeholder="Date" />
              <FormControl class="col-span-3" v-model="item.additional_attr_2" type="text" placeholder="Comments" />
              <div class="flex justify-end items-between pr-6" >
                <button><FeatherIcon class="w-6 h-6 text-red-600" name="x" @click="clear_line(index)"/></button>
              </div>
            </span>
            </li>
        </ul>
    </template>
</Dialog>
<Dialog :options="{
    title: 'Medicine',
    size: '3xl'
    }"
    v-model="medDialogshown">
    <template #body-content>
        <ul class= "space-y-2">
            <!-- <li v-for="(item,index) in data.selected" > 
              <span v-if="item.type=='Meds'" class="grid md:grid-cols-5 gap-2">
                <p class="col-span-2">{{item.label}} </p>
              <FormControl v-model="item.additional_attr" type="text" placeholder="Date" />
              <Select :options="med_dosage" v-model="item.additional_attr" placeholder="Dosage" />
              <Select :options="med_duration" v-model="item.additional_attr_2" placeholder="Duration" />
              <p>{{ item.sp_attr }}</p>
              </span>
            </li> -->
            <li v-for="(item,index) in data.selected" class="gap-1 hover:bg-yellow-100/60 hover:underline" > 
              <span v-if="item.type=='Meds'" class="grid md:grid-cols-7 gap-2">
                <div class="col-span-2 font-serif font-light text-sm flex justify-start items-between pl-3 pt-1">
                  {{item.label}} 
                </div>
                <Select :options="med_dosage" v-model="item.additional_attr" placeholder="Dosage" />
              <Select :options="med_duration" v-model="item.additional_attr_2" placeholder="Duration" />
              <p class="col-span-2 font-serif font-light text-sm flex justify-end pt-1 items-between">{{ item.sp_attr }}</p>
              <div class="flex justify-end items-between pr-6">
                <button><FeatherIcon class="w-6 h-6 text-red-600" name="x" @click="clear_line(index)"/></button>
              </div>
            </span>
            </li>
        </ul>
    </template>
</Dialog>
<!--<Autocomplete :options="all_history" v-model="data.history" placeholder="Add History Here" :multiple="true"/>-->
<!-- <Dialog :options="{
    title: 'History & More Information',
    size: '3xl'
    }"
    v-model="moreinfoDialog">
    <template #body-content>
        <span class="grid md:grid-cols-2 gap-2 p-1 font-sans">
            
              <FormControl v-model="more_info.add_sym" type="textarea" placeholder="Further Description of Symptoms, Diagnosis & History" />
              <FormControl v-model="more_info.add_advise" type="textarea" placeholder="Further Advice" />
              <FormControl v-model="more_info.add_followup" type="number" label="Follow Up (In Days)" />
              <FormControl type="autocomplete" :options="referdr" v-model="more_info.add_referal" placeholder="Referred To" label="Referred To"/>
              <FormControl v-model="more_info.pvt_notes" type="textarea" placeholder="Your Private Notes" />
              <div></div>
              <div class="col-span-2">
                Patient History
              
            </div>
          </span>
          <span>
            <div class="pt-4">
              <ul class= "space-y-2">
              <li v-for="(item,index) in data.history" class="gap-2 hover:bg-teal-200/30 hover:underline" > 
              <span class="grid md:grid-cols-5 gap-2">
                <p class="font-serif font-light text-sm flex justify-start items-between pl-3 pt-1">{{item.history_type}}</p>
                <p class="font-serif font-light text-sm flex justify-start items-between pt-1">{{item.label}}</p>
              <FormControl class="font-serif font-light text-sm flex justify-start items-between pt-1" v-model="item.since" type="text" placeholder="Since" />
              <FormControl class="font-serif font-light text-sm flex justify-start items-between pt-1" v-model="item.comment" type="text" placeholder="Comments" />
              <div class="flex justify-end items-between pt-1 pr-6">
                <button><FeatherIcon class="w-6 h-6 text-red-600" name="x" @click="clear_Hist_line(index)"/></button>
              </div>
            </span>
            </li>
          </ul>
            </div>
          </span>
    </template>
    
</Dialog> -->
<Dialog v-model="submit_confirm">
  <template #body-title>
    <h3>Confirm Advise Submission</h3>
    <ErrorMessage :message="make_opd_prescription.error"/>
  </template>
  <template #body-content>
    <FormControl v-model="more_info.add_followup" type="number" label="Follow Up (In Days)" class="pb-2 pr-10" />
    <p>Are You Sure you want to submit this Patient Advise?
    </p>
  </template>
  <template #actions>
    <Button  variant="solid" class= "bg-gradient-to-r from-pink-500 to-blue-600 hover:from-pink-600 hover:to-blue-700"
      :loading="make_opd_prescription.loading"  @click="make_opd_prescription.submit()">
      Confirm
    </Button>
    <!-- v-if="sel_pat.appoint.invoiced || sel_pat.appoint.fee_valid"
    <Button v-else :disabled="true">Submit Stopped as Payment Not Completed</Button> -->
    <Button
      variant="solid"
      class= "ml-2 bg-gradient-to-r from-red-800 to-red-600 hover:from-red-900 hover:to-red-700"
      @click="submit_confirm = false"
    >
      Cancel
    </Button>
  </template>
</Dialog>
<Dialog v-model="add_item.create_new"
:options="{
    title: 'Add New Items',
    size: '5xl'
    }">
  <template #body-content>
    <div class="flex">
<TabButtons
  :buttons="[
    {
      label: 'Symptoms',
      value: 'symptoms',
    },
    {
      label: 'Diagnosis',
      value: 'diagnosis',
    },
    {
      label: 'Labs',
      value: 'labs',
    },
    {
      label: 'Procedure',
      value: 'procedure',
    },
    {
      label: 'Medicine',
      value: 'medicine',
    },
    {
      label: 'Referral',
      value: 'refer',
    },
    {
      label: 'Allergy',
      value: 'allergy',
    },
  ]"
  v-model="add_item.selected_new"
/>
</div>
<div class="p-2 py-5 text-base tracking-wider text-gray-500 "> Please Add Details in a way that you would generally Prescribe, and not for this specific Patient.</div>
<ErrorMessage :message="make_symptoms.error"/>
<ErrorMessage :message="make_diagnosis.error"/>
<ErrorMessage :message="make_labs.error"/>
<ErrorMessage :message="make_procedure.error"/>
<ErrorMessage :message="make_medicine.error"/>
<ErrorMessage :message="make_refer.error"/>
<ErrorMessage :message="make_allergy.error"/>
<div class="text-xs text-green-600 pb-2">{{ create_msg }}</div>
<div class="grid grid-cols-4 gap-3 " v-if="add_item.selected_new=='symptoms'">
<FormControl v-model="add_item.symptoms" type="text" placeholder="Complaint Name" />
</div>
<div v-if="add_item.selected_new=='diagnosis'" class="grid grid-cols-4 gap-3">
<FormControl v-model="add_item.diagnosis[0]" type="text" placeholder="Diagnosis Name" />
<FormControl v-model="add_item.diagnosis[1]" type="textarea" placeholder="Lifestyle Advise" />
</div>
<div v-if="add_item.selected_new=='labs'" class="grid grid-cols-4 gap-3">
<FormControl v-model="add_item.labs" description="Please dont use '-' " type="text" placeholder="Lab Name" />
<div v-if="sp_char(add_item.labs,'-')" class="text-xs text-red-800 font-mono underline decoration-double">Please Remove '-'</div>
<!--<FormControl v-model="x" type="text" placeholder="Result-UOM" />
<FormControl v-model="x" type="text" placeholder="xxx" />-->
</div>
<div v-if="add_item.selected_new=='procedure'" class="grid grid-cols-4 gap-3">
<FormControl v-model="add_item.procedure" type="text" placeholder="Procedure Name" />
<!--<FormControl v-model="x" type="text" placeholder="xxx" />-->
</div>
<div v-if="add_item.selected_new=='medicine'" class="grid grid-cols-4 gap-3">
<FormControl v-model="add_item.medicine[0]" type="text" placeholder="Medicine Brand Name" />
<Select :options="[{label:'Tablet',value:'Tablet',},{label:'Cream',value:'Cream',},{label:'Capsule',value:'Capsule',},{label:'Injection',value:'Injection',},{label:'Syrup',value:'Syrup',}]" 
v-model="add_item.medicine[1]" placeholder="Dosage Form" />
<Select :options="med_dosage" v-model="add_item.medicine[2]" placeholder="Dosage" />
<Autocomplete :options="med_duration" v-model="add_item.medicine[3]" placeholder="Duration" />
<FormControl v-model="add_item.medicine[4]" type="text" placeholder="Generic Name/Salt Name" />
<FormControl v-model="add_item.medicine[5]" type="textarea" placeholder="Special Instruction" />
</div>
<div v-if="add_item.selected_new=='refer'" class="grid grid-cols-4 gap-3">
<FormControl v-model="add_item.refer[0]" type="text" placeholder="Referred To Doctor Name" />
<FormControl v-model="add_item.refer[1]" type="textarea" placeholder="More Info eg Speciallity, Mobile No." />
</div>
<div v-if="add_item.selected_new=='allergy'" class="grid grid-cols-4 gap-3">
<FormControl v-model="add_item.allergy" type="text" placeholder="Allergy Name" />
</div>
  </template>
  <template #actions>
    <Button variant="solid" class= "bg-gradient-to-r from-pink-500 to-blue-600 hover:from-pink-600 hover:to-blue-700"
      @click="createitem">
      Confirm
    </Button>
    <Button variant="solid"
      class= "ml-2 bg-gradient-to-r from-red-800 to-red-600 hover:from-red-900 hover:to-red-700"
      @click="add_item.create_new = false"
    >
      Cancel
    </Button>
  </template>
</Dialog>
{{data.history}}
{{history.hist}}
</template>

<script setup>
    import { reactive, ref, computed, watch,inject,onMounted } from 'vue';
    import { Badge, Button, FormControl, Autocomplete,Dialog,FeatherIcon,Select,TabButtons,Tabs } from 'frappe-ui';
    import { createListResource,createResource, ErrorMessage,DateTimePicker } from 'frappe-ui';
    import ItemCard from '@/component/ItemCard.vue';
    import {session,userRole} from '@/data/session';

   let roles_z=userRole.roles.fetch()
   let doctor_flag=computed(() => userRole.roles.data.includes("OPD Doctor"))
    let sel_pat=inject("patient");
    let pay_flag= ref(false)
    pay_flag.value=sel_pat.appoint;
    //Declaring Variable
    const data = reactive({
        clinic_type: "Clinic",
        selected: [],
        roving_hosp: "",
        appnt_patient: "",
        appointment_name: "",
        history:[],
        work_area: "Advise",
    });
    const previous = reactive({
        ind_hist:"",
    })
    const more_info = reactive({
        add_sym: "",
        add_advise: "",
        add_followup: 0,
        pvt_notes:"",
        add_referal:"",
        
    });
    const history = reactive({
      allergy: [],
      surg_hist:[],
      hist: [],
      meds:[],
      patient_details:[]

    });
    const add_item = reactive({
        create_new : false,
        selected_new: "symptoms",
        symptoms: [],
        diagnosis: [null,null],
        labs:[],
        procedure:[],
        medicine:[null,null,null,null,null,null],
        refer:[null,null],
        allergy:[]
    });
    const referdr=ref([]);
    const all_searches = ref([]);
    const hist_history= ref([]);
    const med_history= ref([]);
    const surg_history= ref([]);
    const aller_history= ref([]);
    const appoints = ref([]);
    const med_dosage = ref([]);
    const med_duration = ref([]);
    let Patient_details = ref("");
    const symDialogshown = ref(false);
    const diagDialogshown = ref(false);
    const labDialogshown = ref(false);
    const appoint_flag = ref(false);
    const medDialogshown = ref(false);
    const surDialogshown = ref(false);
    const patDialogshown = ref(false);
    const moreinfoDialog = ref(false);
    let submit_confirm = ref(false);

    let create_msg= ref("")
    
    // Function to transform and add to all_searches
    const addToAllSearches = (label, description, type, image, additional_attr,additional_attr_2,sp_attr,added) => {
        all_searches.value.push({
        label,
        value: label + (description ? "," + description : ""),
        description: description || label,
        image,
        type,
        additional_attr,
        additional_attr_2,
        sp_attr,
        added
        });
    };
    //to hold and update the selected syms, diag etc
    const categorizedItems = computed(() => {
        const categories = {
        meds: [],
        syms: [],
        diag: [],
        lab: [],
        surgery: []
        };
    
        data.selected.forEach(item => {
        if (item.type === "Meds") categories.meds.push(item);
        if (item.type === "Complaint") categories.syms.push(item);
        if (item.type === "Diagnosis") categories.diag.push(item);
        if (item.type === "labs") categories.lab.push(item);
        if (item.type === "surg") categories.surgery.push(item);
        });
    
        return categories;
    });
    // getting all the active appointments-- more filters may be needed and check to see new records?
watch(() => sel_pat.details,
(details) => {
appoints.value.splice(0);
let appointment = createListResource({
doctype: "Patient Appointment",
fields: ["*"],
filters: {
status: ["in","Open,Scheduled,Confirmed"],
patient: sel_pat.details.name,
},
orderBy: 'time_of_payment asc',
pageLength: 10,
auto: true,
debounce: 500,
transform(data) {
for (let d of data) {
let label = d.patient_name;
let description = d.patient_age;
let vitals =[d.bp,d.pulse,d.spo2,d.height,d.weight,d.bmi,d.temperature,d.vital_signs_note,
        d.nutrition_note,d.referring_practitioner,d.fee_valid]
let pt = { "label": label, "Vitals":vitals, "gender":d.patient_sex ,"patient_id":d.patient,"value": d.name , "description": description, "image": "/files/user_icon.svg", "type": "Patient", "full_string": d };
appoints.value.push(pt);
data.appnt_patient=appoints[0];
if(appoints.value.length){
  appoint_flag.value=true;
}else{
  appoint_flag.value=false;
}
}
}
});
Patient_details = createListResource({
        doctype: "Patient",
        fields: ["*"],
        filters: {
            name: sel_pat.details.name
        },
        pageLength: 1,
        auto: true,
        transform(data) {
for (let d of data) {
  const aller_rows = d.allergies.split(';');
  history.allergy = aller_rows.map(row => row.split(',')).map(arr => arr.map(item => item.replace(/^\s+/, '')));
  const Mhist_rows = d.medical_history.split(';');
  history.hist = Mhist_rows.map(row => row.split(',')).map(arr => arr.map(item => item.replace(/^\s+/, '')));
  const Shist_rows = d.surgical_history.split(';');
  history.surg_hist = Shist_rows.map(row => row.split(',')).map(arr => arr.map(item => item.replace(/^\s+/, '')));
  const meds_rows = d.medication.split(';');
  history.meds = meds_rows.map(row => row.split(',')).map(arr => arr.map(item => item.replace(/^\s+/, '')));
  if(d.patient_details.indexOf('|')){
  history.patient_details = d.patient_details.split('|')}
  else{
    history.patient_details = d.patient_details;
  }
}
}
    }); 
}
);
data.history=computed(() => history.allergy.concat(history.hist,history.surg_hist,history.meds))
// data.history= history.allergy.concat(history.hist,history.surg_hist,history.meds)
onMounted(() => {
  appoints.value.splice(0);
let appointment = createListResource({
doctype: "Patient Appointment",
fields: ["*"],
filters: {
status: ["in","Open,Scheduled,Confirmed"],
patient: sel_pat.details.name,
},
orderBy: 'time_of_payment asc',
pageLength: 10,
auto: true,
debounce: 500,
transform(data) {
for (let d of data) {
let label = d.patient_name;
let description = d.patient_age;
let vitals =[d.bp,d.pulse,d.spo2,d.height,d.weight,d.bmi,d.temperature,d.vital_signs_note,
        d.nutrition_note,d.referring_practitioner,d.fee_valid]
let pt = { "label": label, "Vitals":vitals, "gender":d.patient_sex ,"patient_id":d.patient,"value": d.name , "description": description, "image": "/files/user_icon.svg", "type": "Patient", "full_string": d };
appoints.value.push(pt);
data.appnt_patient=appoints[0];
if(appoints.value.length){
  appoint_flag.value=true;
}else{
  appoint_flag.value=false;
}
}
}
});
Patient_details = createListResource({
        doctype: "Patient",
        fields: ["*"],
        filters: {
            name: sel_pat.details.name
        },
        pageLength: 1,
        auto: true,
        transform(data) {
for (let d of data) {
  const aller_rows = d.allergies.split(';');
  history.allergy = aller_rows.map(row => row.split(',')).map(arr => arr.map(item => item.replace(/^\s+/, '')));
  const Mhist_rows = d.medical_history.split(';');
  history.hist = Mhist_rows.map(row => row.split(',')).map(arr => arr.map(item => item.replace(/^\s+/, '')));
  const Shist_rows = d.surgical_history.split(';');
  history.surg_hist = Shist_rows.map(row => row.split(',')).map(arr => arr.map(item => item.replace(/^\s+/, '')));
  const meds_rows = d.medication.split(';');
  history.meds = meds_rows.map(row => row.split(',')).map(arr => arr.map(item => item.replace(/^\s+/, '')));
  history.patient_details = d.patient_details.split('|');
}
}
    }); 
})


    // getting all the active symptoms-- more filters may be needed and check to see new records?
    const symptoms = createListResource({
        doctype: "Complaint",
        fields: ["complaints"],
        auto: true,
        pageLength: 500,
        transform(data) {
        data.forEach(d => {
            addToAllSearches(d.complaints, null, "Complaint", "/files/symptoms.jpg","",null,null,null);
        });
        }
    });
    const refferal = createListResource({
        doctype: "Referring Doctor",
        fields: ["*"],
        auto: true,
        pageLength: 200,
        transform(data) {
        for (let d of data) {
            let label = d.doctor_name;
            let description = d.more_information;
            let name = d.name;
            let pt = { "label": label, "name":name, "value": name, "description": description, "type": "referdr"};
            referdr.value.push(pt);
        }
        }
    });
    
    // getting all the active diagnosis-- more filters may be needed and check to see new records?
    const diagnosis = createListResource({
        doctype: "Diagnosis",
        fields: ["diagnosis", "lifestyle_advise"],
        auto: true,
        pageLength: 500,
        transform(data) {
        data.forEach(d => {
            addToAllSearches(d.diagnosis, null, "Diagnosis", "/files/diagnosis.jpg",d.lifestyle_advise,null,null,null);
        // addTohistory(d.diagnosis, null, "PED", "",null,null,null,null);
            let label = d.diagnosis;
            let pt = { "label": label, "description": label, "value": label , "history_type": "PED","history_doctype":"Diagnosis"};
            hist_history.value.push(pt);
        });
        }
    });
    // getting all the active labs-- more filters may be needed and check to see new records?
    const labs = createListResource({
        doctype: "Lab Test Template",
        fields: ["lab_test_name","name"],
        auto: true,
        pageLength: 500,
        transform(data) {
        data.forEach(d => {
            addToAllSearches(d.lab_test_name, null, "labs", "/files/lab_test_blue_2.jpg","",null,null,d.name);
        });
        }
    });
    // getting all the active medicine-- more filters may be needed and check to see new records?
    const medicine = createListResource({
        doctype: "OPD Medication",
        fields: ["name","medicine_brand", "generic_name", "dosage_form", "default_duration", "default_dosage", "special_instruction"],
        auto: true,
        pageLength: 1000,
        transform(data) {
        data.forEach(d => {
            addToAllSearches(`${d.dosage_form} ${d.medicine_brand}`, `${d.generic_name}, ${d.default_duration}, ${d.default_dosage}`, "Meds", "/files/pill_yellow.jpg",d.default_dosage, d.default_duration,d.special_instruction,[d.name,d.dosage_form]);
            //addTohistory(`${d.dosage_form} ${d.medicine_brand}`, `${d.generic_name}, ${d.default_duration}, ${d.default_dosage}`, "Medication", "",d.default_dosage, d.default_duration,d.special_instruction,[d.name,d.dosage_form]);
            let label = d.name;
            let pt = { "label": `${d.dosage_form} ${d.medicine_brand}`, "description": `${d.generic_name}`, "value": label , "history_type": "Medication","history_doctype":"OPD Medication"};
            med_history.value.push(pt);
        });
        }
    });
    // getting all the active procedure-- more filters may be needed and check to see new records?
    const surg = createListResource({
        doctype: "Clinical Procedure Template",
        fields: ["template","name"],
        auto: true,
        pageLength: 500,
        transform(data) {
        data.forEach(d => {
            addToAllSearches(d.template, null, "surg", "/files/surgery _red.jpg","","","",d.name);
            //addTohistory(d.template, null, "Surgical History", "","","","",d.name);
            let label = d.template;
            let pt = { "label": label, "description": label, "value": d.name , "history_type": "Surgical History", "history_doctype":"Clinical Procedure Template"};
            surg_history.value.push(pt);
        });
        }
    });
    const dosage = createListResource({
        doctype: "Prescription Dosage",
        fields: ["*"],
        auto: true,
        pageLength: 200,
        transform(data) {
        for (let d of data) {
            let pt = { "label": d.dosage, "value": d.dosage };
            med_dosage.value.push(pt);
        };
        }
    });
    const allergy = createListResource({
        doctype: "Patient Allergy",
        fields: ["*"],
        auto: true,
        pageLength: 200,
        transform(data) {
        for (let d of data) {
            let label = d.name;
            let pt = { "label": label, "description": label, "value": label , "history_type": "Allergy","history_doctype":"Patient Allergy"};
            aller_history.value.push(pt);
        }
        }
    });
    const duration = createListResource({
        doctype: "Prescription Duration",
        fields: ["*"],
        auto: true,
        pageLength: 200,
        transform(data) {
        for (let d of data) {
            let pt = { "label": d.name,"value":d.name };
            med_duration.value.push(pt);
        };
        }
    });
    
    const make_opd_prescription = createResource({
        url: 'healthcare.api.make_prescripton',
        makeParams(){
            return {
                patient:Patient_details.list.data[0],
                appoint: appoints.value,
                selected: data.selected,
                extras:more_info,
                History: data.history
            }
        },
        onSuccess: (data_Z) => {
        data.appointment_name=data_Z.name;
        printed();
        submit_confirm.value=false;
        clearAll();
        updateSearches();
        }   
    })
    function printed(){
        window.open("/app/print/Patient Encounter/"+data.appointment_name, "_blank");
    }
    function updateSearches(){
        all_searches.value.splice(0);
        hist_history.splice(0);
        med_history.splice(0);
        surg_history.splice(0);
        aller_history.splice(0);
        med_dosage.value.splice(0);
        med_duration.value.splice(0);
        referdr.value.splice(0);
        symptoms.fetch();
        diagnosis.fetch();
        labs.fetch();
        medicine.fetch();
        surg.fetch();
        dosage.fetch();
        duration.fetch();
        allergy.fetch();
        refferal.fetch();
    }
    function clearAll(){
        sel_pat.details="";
        sel_pat.appoint="";
        sel_pat.ref_flag=true;
    // submit_confirm=false;
        data.appnt_patient="";
        data.selected=[];
        hist_history.splice(0);
        med_history.splice(0);
        surg_history.splice(0);
        aller_history.splice(0);
        more_info.add_sym= ""
        more_info.add_advise= ""
        more_info.add_followup= 0
        more_info.pvt_notes=""
        more_info.add_referal=""
    }
    function createitem(){
        if(add_item.selected_new=="symptoms") make_symptoms.submit();
        if(add_item.selected_new=="diagnosis") make_diagnosis.submit();
        if(add_item.selected_new=="labs") make_labs.submit();
        if(add_item.selected_new=="procedure") make_procedure.submit();
        if(add_item.selected_new=="medicine") make_medicine.submit();
        if(add_item.selected_new=="refer") make_refer.submit();
        if(add_item.selected_new=="allergy") make_allergy.submit();
    }
    const make_symptoms = createResource({
        url: 'healthcare.api.make_symptoms',
        makeParams(){
            return {
                name:add_item.symptoms
            }
        },
        onSuccess: (data_sym) => {
            //console.log(data_sym)
            addToAllSearches(data_sym.complaints, null, "Complaint", "/files/symptoms.jpg","",null,null,null);
            add_item.symptoms="";
           // add_item.create_new=false;
            let x= { "label": data_sym.complaints, "value": data_sym.complaints, "description": data_sym.complaints, "image": "/files/symptoms.jpg", "type": "Complaint", "additional_attr": "", "additional_attr_2": null, "sp_attr": null, "added": null }
            data.selected.push(x)
            create_msg.value="Symptom Created Successfully"
        // data.appointment_name=data_Z.name;
        }   
    })
    const make_diagnosis = createResource({
        url: 'healthcare.api.make_diagnosis',
        makeParams(){
            return {
                name:add_item.diagnosis[0],
                desc:add_item.diagnosis[1]
            }
        },
        onSuccess: (data_diag) => {
        // data.appointment_name=data_Z.name;
            addToAllSearches(data_diag.diagnosis, null, "Diagnosis", "/files/diagnosis.jpg",data_diag.lifestyle_advise,null,null,null);
            add_item.diagnosis=[null,null];
           // add_item.create_new=false;
            let x=  { "label": data_diag.diagnosis, "value": data_diag.diagnosis, "description": data_diag.diagnosis, "image": "/files/diagnosis.jpg", "type": "Diagnosis", "additional_attr": ((data_diag.lifestyle_advise) ? data_diag.lifestyle_advise : "") , "additional_attr_2": null, "sp_attr": null, "added": null }
            data.selected.push(x)
            create_msg.value="Diagnosis Created Successfully"
            let label = data_diag.diagnosis;
            let pt = { "label": label, "description": label, "value": label , "history_type": "PED","history_doctype":"Diagnosis"};
            hist_history.value.push(pt);
        }   
    })
    const make_labs = createResource({
        url: 'healthcare.api.make_labs',
        makeParams(){
            return {
                name:add_item.labs,
            }
        },
        onSuccess: (data_labs) => {
        // data.appointment_name=data_Z.name;
        addToAllSearches(data_labs.lab_test_name, null, "labs", "/files/lab_test_blue_2.jpg","",null,null,data_labs.name)
        add_item.labs=[];
       // add_item.create_new=false;
        let x=  { "label": data_labs.lab_test_name, "value": data_labs.lab_test_name, "description": data_labs.lab_test_name, "image": "/files/lab_test_blue_2.jpg", "type": "labs", "additional_attr": "", "additional_attr_2": null, "sp_attr": null, "added": data_labs.name }
        data.selected.push(x)
        create_msg.value="Lab Created Successfully"
        }   
    })
    const make_medicine = createResource({
        url: 'healthcare.api.make_medicine',
        makeParams(){
            return {
                name:add_item.medicine[0],
                form:add_item.medicine[1],
                dosage:add_item.medicine[2],
                duration:add_item.medicine[3].value,
                generic:add_item.medicine[4],
                sp_inst:add_item.medicine[5]
    
            }
        },
        onSuccess: (data_medicine) => {
        // data.appointment_name=data_Z.name;
        addToAllSearches(`${data_medicine.dosage_form} ${data_medicine.medicine_brand}`, `${data_medicine.generic_name}, ${data_medicine.default_duration}, ${data_medicine.default_dosage}`, "Meds", "/files/pill_yellow.jpg",data_medicine.default_dosage, data_medicine.default_duration,data_medicine.special_instruction,[data_medicine.name,data_medicine.dosage_form]);
        add_item.medicine=[null,null,null,null,null,null];
       // add_item.create_new=false;
        let x=  { "label": `${data_medicine.dosage_form} ${data_medicine.medicine_brand}`, "value": `${data_medicine.dosage_form} ${data_medicine.medicine_brand},${data_medicine.generic_name}, ${data_medicine.default_duration}, ${data_medicine.default_dosage}`, "description": `${data_medicine.generic_name}, ${data_medicine.default_duration}, ${data_medicine.default_dosage}`, "image": "/files/pill_yellow.jpg", "type": "Meds", "additional_attr": data_medicine.default_dosage, "additional_attr_2": data_medicine.default_duration, "sp_attr": data_medicine.special_instruction, "added": [data_medicine.name,data_medicine.dosage_form] }
        data.selected.push(x);
        let label = data_medicine.name;
        let pt = { "label": `${data_medicine.dosage_form} ${data_medicine.medicine_brand}`, "description": `${data_medicine.generic_name}`, "value": label , "history_type": "Medication","history_doctype":"OPD Medication"};
        med_history.value.push(pt);
        create_msg.value="Medicine Created Successfully"
        }   
    })
    const make_refer = createResource({
        url: 'healthcare.api.make_refer',
        makeParams(){
            return {
                name:add_item.refer[0],
                desc:add_item.refer[1]
            }
        },
        onSuccess: (data_refer) => {
        // data.appointment_name=data_Z.name;
        add_item.refer=[null,null];
      //  add_item.create_new=false;
       // refferal.fetch();
        let label = data_refer.doctor_name;
        let description = data_refer.more_information;
        let name = data_refer.name;
        let pt = { "label": label, "name":name, "value": name, "description": description, "type": "referdr"};
        referdr.value.push(pt);
        more_info.add_referal=pt
        create_msg.value="Referring Dr Created Successfully"
        }   
    })
    const make_allergy = createResource({
        url: 'healthcare.api.make_allergy',
        makeParams(){
            return {
                name:add_item.allergy
            }
        },
        onSuccess: (data_allergy) => {
        // data.appointment_name=data_Z.name;
        add_item.allergy=[];
        let label = data_allergy.name;
        let pt = { "label": label, "description": label, "value": label , "history_type": "Allergy","history_doctype":"Patient Allergy"};
        aller_history.value.push(pt);
        //data.history.push(pt);
       // add_item.create_new=false;
        //allergy.fetch();
        create_msg.value="Allergy Created Successfully"
        }   
    })
    const make_procedure = createResource({
        url: 'healthcare.api.make_procedure',
        makeParams(){
            return {
                name:add_item.procedure
            }
        },
        onSuccess: (data_procedure) => {
        // data.appointment_name=data_Z.name;
        addToAllSearches(data_procedure.template, null, "surg", "/files/surgery _red.jpg","","","",data_procedure.name);
        add_item.procedure=[];
      //  add_item.create_new=false;
        let x=   { "label": data_procedure.template, "value": data_procedure.template, "description": data_procedure.template, "image": "/files/surgery _red.jpg", "type": "surg","additional_attr": "", "additional_attr_2": "", "sp_attr": "", "added": data_procedure.name }
        data.selected.push(x);
        let label = data_procedure.template;
        let pt = { "label": label, "description": label, "value": data_procedure.name , "history_type": "Surgical History", "history_doctype":"Clinical Procedure Template"};
        surg_history.value.push(pt);
        create_msg.value="Procedure Created Successfully"
        }   
    })
    function sp_char(search,char){
      //console.log(search+"-"+char);
      let text = search.includes(char);
      return text
    }
    function clear_line(locater){
      data.selected.splice(locater,1);
    }
    function clear_Hist_line(array,locater){
      array.splice(locater,1);
    }
    
</script>