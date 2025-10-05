<template >
  <!--Nav Bar containing the location and Patient Select and Create, display -->
  <!-- <Sidebar /> -->
  <!--{{ data.appnt_patient }}
   selected patient information display -->

  <!-- PENDING--- ROVING PATIENT CREATION AND DISPLAY -->
   <!-- Display of Symptoms, Diagnsis, Meds etc -->
    <div class="grid grid-cols-12">
<div :class="[hist_flag ? 'col-span-5 transition-all duration-700 ease-linear' :'col-span-10 transition-all duration-700 ease-linear']"> <!--< div :class="[hist_flag ? 'col-span-2' :'col-span-10']" >-->
  <div>
  <nav v-if="!hist_flag">
    <!--Search Bar-->
  <div v-if="appoints.length && sel_pat.details.name ">
    <div class="md:px-[80px] py-2 mx-6 grid grid-cols-12 gap-2">
      <div class="col-span-1">
        <Tooltip text="Clears all Obx, advise, patient etc" :hover-delay="1" :placement="'top'">
        <Button
          @click="clearAll"
          class="rounded-full hover:bg-red-500"
          :variant="'ghost'"
          :ref_for="true"
          theme="red"
          size="md"
          label="Button"
          :loading="false"
          :loadingText="null"
          :disabled="false"
          :link="null"
        >
        <FeatherIcon class="w-6 h-6" :class="[appoints[0].gender === 'Female' ? 'text-pink-700 hover:text-red-900 transform-all' :'text-blue-700 hover:text-red-900']"  name="trash-2"/>
        </Button></Tooltip></div>
      <div class="col-span-9">
        <Autocomplete 
          :options="all_searches" 
          v-model="data.selected" 
          placeholder="Search for Symptoms, Diagnosis, Medicines, Labs or Procedures" 
          :multiple="true"
          class="block w-full rounded-full font-mono bg-gray-100 border-solid border border-gray-100 hover:bg-gray-200/90 transition-all "
        >
        <template #item-prefix="{ option }">
        <img
          :src="option.image.toString()"
          class="h-4 w-4"
        >
        </template>
          <template #prefix>
          <!--<FeatherIcon
            class="w-5 font-extrabold text-teal-700"
            name="search"
          />-->
          <FeatherIcon class="w-4 h-4" :class="[appoints[0].gender === 'Female' ? 'text-pink-700' :'text-blue-700']"  name="search"/>
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
          size="md"
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
      size="md"
      :variant="'subtle'"
      :loadingText="null"
      :disabled="false"
      :link="null"
      @click="submit_confirm=true"
    ><FeatherIcon class="w-6 h-6" :class="[appoints[0].gender === 'Female' ? 'text-pink-700' :'text-blue-700']" name="send"/></Button>
      <Button class="bg-gray-200 p-3 flex items-center justify-between text-xs font-light text-gray-600 rounded-lg" v-if="!doctor_flag">Only Doctors Allowed to Submit</Button>
    </div>
  </div>
      
    </div>
  </div>
    <div v-else class="mt-4 md:mx-[200px] flex item-center justify-center gap-3 p-3">
    <Badge :variant="'solid'" class=" block w-full rounded-full px-2 py-2 font-serif item-center justify-center
    bg-gradient-to-r from-red-800 to-red-600 hover:from-red-900 hover:to-red-700 text-white transition-all" size="xl" label="No Appointment"/>
  </div>
  </nav>
  <div class=" grid md:grid-cols-3 gap-2 p-1" v-if="appoints.length && sel_pat.details.name">
    <div class="mt-4 p-3 shadow-md bg-violet-100 rounded-sm flex items-center justify-between flex-col hover:bg-violet-200 transition-all">
      <span class="font-mono font-bold underline decoration-violet-600 flex items-center justify-between gap-4">
        <Avatar
          :shape="'circle'"
          :ref_for="true"
          image="/files/symptoms.jpg"
          label="EY"
          size="xl"
          v-if="!hist_flag"
        />
        Observations
      </span>
      <div class="grid grid-cols-7 gap-2">
        <div class="col-span-6">
      <Autocomplete 
          v-if="!hist_flag"
          :options="ind_symptoms" 
          v-model="data.selected" 
          placeholder="Search for Symptoms" 
          :multiple="true"
          class="block w-full rounded-full font-mono bg-gray-100 border-solid border border-gray-100 hover:bg-gray-200/90 transition-all "
        >
        <template #item-prefix="{ option }">
        <img
          :src="option.image.toString()"
          class="h-4 w-4"
        >
        </template>
          <template #prefix>
          <!--<FeatherIcon
            class="w-5 font-extrabold text-teal-700"
            name="search"
          />-->
          <FeatherIcon class="w-4 h-4" :class="[appoints[0].gender === 'Female' ? 'text-pink-700' :'text-blue-700']"  name="search"/>
          </template>
        </Autocomplete>
      </div><div><div><Button v-if="!hist_flag"
          @click="add_item.create_new=true"
          class="rounded-full bg-violet-800"
          :variant="'solid'"
          :ref_for="true"
          
          size="sm"
          label="Button"
          :loading="false"
          :loadingText="null"
          :disabled="false"
          :link="null"
        >
        <FeatherIcon class="w-6 h-6 text-white"  name="plus"/>
        </Button></div></div>
      </div>
      <ul v-for="item,index in data.selected" :key="item.value" class="flex items-center justify-between font-sans">
         
        <li class="grid grid-cols-7 space-y-2" v-if="item.type=='Complaint'" ><div class="col-span-3">{{ item.label }}</div> 
          <FormControl v-if="!hist_flag" class="col-span-3" variant="outline" v-model="item.additional_attr" type="text" placeholder="Comments" />
          <div class="flex justify-end items-between" v-if="!hist_flag" >
                <button><FeatherIcon class="w-5 h-5 text-red-600" name="x" @click="clear_line(index)"/></button>
          </div>  
        </li> 
      </ul>
    </div>
    <div class="mt-4 p-3 shadow-md bg-green-100/80 rounded-sm flex items-center justify-between flex-col hover:bg-green-200 transition-all">
      <span class="font-mono font-bold underline decoration-green-600 flex items-center justify-between gap-4">
        <Avatar
          v-if="!hist_flag"
          :shape="'circle'"
          :ref_for="true"
          image="/files/diagnosis.jpg"
          label="EY"
          size="xl"
        />
        Diagnosis
      </span>
      <ul v-for="item,index in data.selected" :key="item.value" class="flex items-center justify-between font-sans">
         <li class="grid grid-cols-12 space-y-2" v-if="item.type=='Diagnosis'"><div class="col-span-11">{{ item.label }}</div> 
          <button v-if="!hist_flag"><FeatherIcon class="w-5 h-5 text-red-600" name="x" @click="clear_line(index)"/></button>
         </li>
      </ul>
    </div>
    <div class="mt-4 p-3 shadow-md bg-blue-800/10 rounded-sm flex items-center justify-between flex-col hover:bg-blue-800/20 transition-all">
      <span class="font-mono font-bold underline decoration-blue-600 flex items-center justify-between gap-4">
        <Avatar
          v-if="!hist_flag"
          :shape="'circle'"
          :ref_for="true"
          image="/files/lab_test_blue_2.jpg"
          label="EY"
          size="xl"
        />
        Labs
      </span>
      <ul v-for="item,index in data.selected" :key="item.value" class="flex items-center justify-between font-sans">
        <li class="grid grid-cols-12 space-y-2" v-if="item.type=='labs'"><div class="col-span-11">{{ item.label }}</div>
          <button v-if="!hist_flag"><FeatherIcon class="w-5 h-5 text-red-600" name="x" @click="clear_line(index)"/></button>
        </li>
      </ul>
    </div>
    <div class="mt-4 p-3 shadow-md bg-red-100/50 rounded-sm flex items-center justify-between flex-col hover:bg-red-200 transition-all">
      <span class="font-mono font-bold underline decoration-red-600 flex items-center justify-between gap-4">
        <Avatar
          v-if="!hist_flag"
          :shape="'circle'"
          :ref_for="true"
          image="/files/surgery _red.jpg"
          label="EY"
          size="xl"
        />
        Procedures
      </span>
      <ul v-for="item,index in data.selected" :key="item.value" class="flex items-center justify-between font-sans">
        <li class="grid grid-cols-12 gap-2 space-y-2" v-if="item.type=='surg'">
                <div class="col-span-6 flex">
                  {{item.label}} 
                </div>
                <!-- <DatePicker class="col-span-3"  variant="outline" v-model="item.additional_attr" placeholder="Date"/> -->
                <FormControl v-if="!hist_flag" class="col-span-6" variant="outline" :type="'date'" v-model="item.additional_attr" placeholder="Date" />
                <FormControl  v-if="!hist_flag" class="col-span-9" variant="outline" v-model="item.additional_attr_2" type="text" placeholder="Comments" />
                
                <div  v-if="!hist_flag" class="flex justify-end items-between" >
                <button><FeatherIcon class="w-6 h-6 text-red-600" name="x" @click="clear_line(index)"/></button>
              </div></li>
      </ul>
    </div>
    <div class="col-span-2 mt-4 p-3 shadow-md bg-amber-100/50 rounded-sm flex items-center justify-between flex-col hover:bg-amber-200 transition-all">
      <span class="font-mono font-bold underline decoration-amber-600 flex items-center justify-between gap-4">
        <Avatar
        v-if="!hist_flag"
          :shape="'circle'"
          :ref_for="true"
          image="/files/pill_yellow.jpg"
          label="EY"
          size="xl"
        />
        Medicine
      </span>
      <ul v-for="item,index in data.selected" :key="item.value" class="flex font-sans">
        <li v-if="item.type=='Meds'" class="grid md:grid-cols-7 gap-2 space-y-2">
                <div :class="[hist_flag ? 'col-span-10' :'col-span-2']" class="font-sans flex justify-start items-between pl-3 pt-1">
                  {{item.label}} 
                </div>
                <Select :options="med_dosage" v-if="!hist_flag" v-model="item.additional_attr" variant="outline" placeholder="Dosage" />
              <Select :options="med_duration" v-if="!hist_flag" v-model="item.additional_attr_2" variant="outline" placeholder="Duration" />
              <FormControl class="col-span-2" v-if="!hist_flag" v-model="item.sp_attr" type="text" variant="outline" placeholder="More Information" />
              <!-- <p class="col-span-2 font-serif font-light text-sm flex justify-end pt-1 items-between">{{ item.sp_attr }}</p> -->
              <div class="flex justify-end items-between pr-6" v-if="!hist_flag">
                <button ><FeatherIcon class="w-6 h-6 text-red-600" name="x" @click="clear_line(index)"/></button>
              </div>
            </li>
          </ul>
    </div>
  </div>
  <div>
  <div v-if="appoints.length && sel_pat.details.name" class="py-2 m-1 flex items-center justify-between flex-col col-span-2 mt-4 px-3 shadow-md bg-teal-100/50 rounded-sm hover:bg-teal-200 transition-all">
      <span class="font-mono font-bold underline decoration-teal-600 flex gap-4">Additional Information</span>
      <div class="grid md:grid-cols-6 gap-2 font-sans pt-2" v-if="!hist_flag">
            <FormControl class="col-span-2" label="Further Symptoms" variant="outline" v-model="more_info.add_sym" type="textarea" placeholder="Further Description of Symptoms, Diagnosis & History" />
            <FormControl class="col-span-2" label="Further Advise" variant="outline" v-model="more_info.add_advise" type="textarea" placeholder="Further Advice" />
            <FormControl v-model="more_info.add_followup" label="Follow-up (In days)" variant="outline" type="number" placeholder="Follow Up (In Days)" />
            <FormControl type="autocomplete" :options="referdr" label="Referred To" v-model="more_info.add_referal" variant="outline" placeholder="Referred To"/>
            <div></div> 
      </div>
    </div></div></div></div>
    <div :class="[hist_flag ? 'col-span-7' :'col-span-2']" class=" transition-all duration-700 ease-linear mt-5 ml-2 mb-1 mr-1 p-3 flex gap-2 gap-x-5 font-sans shadow-md bg-gradient-to-r  from-gray-200/30 from-20% via-gray-200/10 via-60% to-gray-200/60 to-90% rounded-sm space-y-2 justify-between flex-col" 
  v-if="appoints.length && sel_pat.details.name">
    <span v-if="!hist_flag" class="flex flex-col gap-x-10 text-gray-700" >
      <span class="font-mono font-bold underline decoration-grey-600 flex items-center justify-between gap-4">
        <Button @click="hist_flag=true" :variant="'ghost'" theme="gray">
          <FeatherIcon class="w-6 h-6 font-extrabold" name="chevrons-left"/>
          <!-- <FeatherIcon class="w-4 h-4" name="edit-2"/> -->
        </Button>
        <p v-if="data.history.length">History Summary</p>
        <p v-else>Expand to Add History or Pvt Notes</p>
      </span>
      <p v-for="(item) in data.history" class="gap-2">  
              <p class="font-serif font-light text-sm pt-1">{{item.label}}</p>
      </p>
      <span v-if="dr_notes.length" class="gap-2 font-mono text-base font-bold underline decoration-grey-600 flex items-center justify-between">
        Your Previous Pvt Notes
      </span>
      <p v-for="item in dr_notes" class="gap-2">
        <p class="font-serif font-light text-sm pt-1">{{item}}</p>
      </p>
    </span>
    <span class="flex flex-col gap-x-10 text-gray-900" v-else >
    <span class="font-mono font-bold underline decoration-grey-600 grid grid-cols-6">
      <div class="flex items-start justify-start">
        <Button @click="hist_flag=false" :variant="'ghost'" theme="gray">
          <FeatherIcon class="w-6 h-6 font-extrabold" name="chevrons-right"/>
          <!-- <FeatherIcon class="w-4 h-4" name="edit-2"/> -->
        </Button></div>
        <div class="col-span-5 flex items-center justify-center">Detailed History</div>
      </span>
    <Tabs as="div"  
      :tabs="[
        {
          label: 'History'
        },
        {
          label: 'Surgery'
        },
        {
          label: 'Medication'
        },
        {
          label: 'Allergies'
        },
        {
          label: 'Doctor\'s Notes',
         // content: Patient_details.list.data[0].patient_details
        },
      ]">
      <template #tab-panel="{ tab }">
        <div class="p-2">
          <div class="grid grid-cols-12 gap-2" v-if="tab.label!='Doctor\'s Notes'">
            <div class="col-span-11" >
          <Autocomplete v-if="tab.label!='Doctor\'s Notes'" :options="all_history" v-model="data.history" placeholder="Add History Here" :multiple="true"
          class="block w-full rounded-full font-mono bg-teal-100 border-solid border border-teal-100 hover:bg-teal-200/90 transition-all " 
          >
          <template #prefix>
          <FeatherIcon class="w-4 h-4" :class="[appoints[0].gender === 'Female' ? 'text-pink-700' :'text-blue-700']"  name="search"/>
          </template>
        </Autocomplete></div>    
        <div><Button v-if="hist_flag"
          @click="add_item.create_new=true"
          class="rounded-full bg-gray-900"
          :variant="'solid'"
          :ref_for="true"
          
          size="sm"
          label="Button"
          :loading="false"
          :loadingText="null"
          :disabled="false"
          :link="null"
        >
        <FeatherIcon class="w-6 h-6 text-white"  name="plus"/>
        </Button></div></div>
          <div v-if="tab.label=='History'" class="p-3">
            <li v-for="(item,index) in data.history" class="gap-2 hover:bg-teal-200/30 hover:underline">
              <div v-if="item.history_type=='PED'" class="grid md:grid-cols-4 gap-2">
              <p class="font-serif font-light text-sm flex justify-start items-between pt-1">{{item.label}}</p>
              <FormControl class="font-serif font-light text-sm flex justify-start items-between pt-1" v-model="item.since" type="text" placeholder="Since" />
              <FormControl class="font-serif font-light text-sm flex justify-start items-between pt-1" v-model="item.comment" type="text" placeholder="Comments" />
              <div class="flex justify-end items-between pt-1 pr-6">
                <button><FeatherIcon class="w-6 h-6 text-red-600" name="x" @click="clear_Hist_line(index)"/></button>
              </div>
            </div>
            <div v-else></div>
            </li>
          </div>
          <div v-if="tab.label=='Surgery'" class="p-3">
            <li v-for="(item) in data.history" class="gap-2 hover:bg-teal-200/30 hover:underline">
              <div v-if="item.history_type=='Surgical History'" class="grid md:grid-cols-4 gap-2">
              <p class="font-serif font-light text-sm flex justify-start items-between pt-1">{{item.label}}</p>
              <FormControl class="font-serif font-light text-sm flex justify-start items-between pt-1" v-model="item.since" type="text" placeholder="Since" />
              <FormControl class="font-serif font-light text-sm flex justify-start items-between pt-1" v-model="item.comment" type="text" placeholder="Comments" />
              <div class="flex justify-end items-between pt-1 pr-6">
                <button><FeatherIcon class="w-6 h-6 text-red-600" name="x" @click="clear_Hist_line(index)"/></button>
              </div>
            </div>
            <div v-else></div>
            </li>
          </div>
          <div v-if="tab.label=='Medication'" class="p-3">
            <li v-for="(item) in data.history" class="gap-2 hover:bg-teal-200/30 hover:underline">
              <div v-if="item.history_type=='Medication'" class="grid md:grid-cols-4 gap-2">
              <p class="font-serif font-light text-sm flex justify-start items-between pt-1">{{item.label}}</p>
              <FormControl class="font-serif font-light text-sm flex justify-start items-between pt-1" v-model="item.since" type="text" placeholder="Since" />
              <FormControl class="font-serif font-light text-sm flex justify-start items-between pt-1" v-model="item.comment" type="text" placeholder="Comments" />
              <div class="flex justify-end items-between pt-1 pr-6">
                <button><FeatherIcon class="w-6 h-6 text-red-600" name="x" @click="clear_Hist_line(index)"/></button>
              </div>
            </div>
            <div v-else></div>
            </li>
          </div>
          <div v-if="tab.label=='Allergies'" class="p-3">
            <li v-for="(item) in data.history" class="gap-2 hover:bg-teal-200/30 hover:underline">
              <div v-if="item.history_type=='Allergy'" class="grid md:grid-cols-4 gap-2">
              <p class="font-serif font-light text-sm flex justify-start items-between pt-1">{{item.label}}</p>
              <FormControl class="font-serif font-light text-sm flex justify-start items-between pt-1" v-model="item.since" type="text" placeholder="Since" />
              <FormControl class="font-serif font-light text-sm flex justify-start items-between pt-1" v-model="item.comment" type="text" placeholder="Comments" />
              <div class="flex justify-end items-between pt-1 pr-6">
                <button><FeatherIcon class="w-6 h-6 text-red-600" name="x" @click="clear_Hist_line(index)"/></button>
              </div>
            </div>
            <div v-else></div>
            </li>
          </div>
          
          <div v-if="tab.label=='Doctor\'s Notes'" class="p-3">
            <li v-for="item in dr_notes" class="p-1 hover:bg-teal-200/30">
              {{item}}
            </li>
            <FormControl class="pt-2" v-if="tab.label=='Doctor\'s Notes'" v-model="more_info.pvt_notes" type="textarea" variant="outline" label="Add Notes" placeholder="Your Private Notes" />
          </div>
        </div>
      </template>
    </Tabs>
    </span>
  </div>
</div>
  <!-- PENDING- Extra Data eg follow up etc entry-->
  
<!-- ALL DIALOGS-->
<Dialog v-model="submit_confirm">
  <template #body-title>
    <h3 class="font-semibold">Confirm Advise Submission</h3>
    <ErrorMessage :message="make_opd_prescription.error"/>
  </template>
  <template #body-content>
    <p>Are You Sure you want to submit this Patient Advise?
    </p>
  </template>
  <template #actions>
    <Button variant="solid" class= "bg-gradient-to-r from-pink-500 to-blue-600 hover:from-pink-600 hover:to-blue-700"
      :loading="make_opd_prescription.loading"  @click="make_opd_prescription.submit()">
      Confirm
    </Button>
    <!-- <Button v-else :disabled="true">Submit Stopped as Payment Not Completed</Button> 
     v-if="sel_pat.appoint.invoiced || sel_pat.appoint.fee_valid"
    -->
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
<Select :options="[{label:'Tablet',value:'Tablet',},{label:'Cream',value:'Cream',},{label:'Capsule',value:'Capsule',},{label:'Injection',value:'Injection',},{label:'Syrup',value:'Syrup',},
{label:'Sachet',value:'Sachet',},{label:'Solution',value:'Solution',},{label:'Inhaler',value:'Inhaler',}]" 
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

<!-- {{data.selected}} -->
</template>

<script setup>
    import { reactive, ref, computed, watch,inject,onMounted } from 'vue';
    import { Badge, Avatar,Tooltip, Button, FormControl, Autocomplete,Dialog,FeatherIcon,Select,TabButtons,Tabs } from 'frappe-ui';
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
    const ind_symptoms = ref([]);
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
    let hist_flag=ref(false);
    const all_searches = ref([]);
    const all_history= ref([])
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
    let create_msg= ref("");
    let hist_dict=ref("");
    let dr_notes=ref([]);
    
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
        if(type=="Complaint"){
          ind_symptoms.value.push({
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
        }
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
data.history.splice(0);
dr_notes.value.splice(0);
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
Patient_details.value = createListResource({
        doctype: "Patient",
        fields: ["*"],
        filters: {
            name: sel_pat.details.name
        },
        pageLength: 1,
        auto: true,
        transform(data) {
          pull_hist(data);
        }  
    });
    console.log("I am in watch");
    }
  
);

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
          pull_hist(data);
        }
    }); 
    console.log("I am in mounted");
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
            let pt = { "label": label, "description": label, "value": label , "history_type": "PED","history_doctype":"Diagnosis","since":"","comment":""};
            all_history.value.push(pt);
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
            let pt = { "label": `${d.dosage_form} ${d.medicine_brand}`, "description": `${d.generic_name}`, "value": label , "history_type": "Medication","history_doctype":"OPD Medication","since":"","comment":""};
            all_history.value.push(pt);
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
            let pt = { "label": label, "description": label, "value": d.name , "history_type": "Surgical History", "history_doctype":"Clinical Procedure Template","since":"","comment":""};
            all_history.value.push(pt);
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
            let pt = { "label": label, "description": label, "value": label , "history_type": "Allergy","history_doctype":"Patient Allergy", "since":"","comment":""};
            all_history.value.push(pt);
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
        all_history.value.splice(0);
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
        data.history=[];
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
            let pt = { "label": label, "description": label, "value": label , "history_type": "PED","history_doctype":"Diagnosis","since":"","comment":""};
            all_history.value.push(pt);
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
        let pt = { "label": `${data_medicine.dosage_form} ${data_medicine.medicine_brand}`, "description": `${data_medicine.generic_name}`, "value": label , "history_type": "Medication","history_doctype":"OPD Medication","since":"","comment":""};
        all_history.value.push(pt);
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
        let pt = { "label": label, "description": label, "value": label , "history_type": "Allergy","history_doctype":"Patient Allergy", "since":"","comment":""};
        all_history.value.push(pt);
        data.history.push(pt);
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
        let pt = { "label": label, "description": label, "value": data_procedure.name , "history_type": "Surgical History", "history_doctype":"Clinical Procedure Template","since":"","comment":""};
        all_history.value.push(pt);
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
    function clear_Hist_line(locater){
      data.history.splice(locater,1);
    }
function pull_hist(desk){   
  if(desk[0].pat_hist){
    let hist=desk[0].pat_hist.replaceAll(/'/g, '"');
    let hist_str = hist.replaceAll('None', ' ');
    let x= JSON.parse(hist_str);
    //PED
    let ped=x.ped;
    for(let i = 0; i < ped.length; i++){
      let u= ped[i].split(">>");
      let pt = { "label": u[0], "description": u[0], "value": u[0] , "history_type": "PED","history_doctype":"Diagnosis", "since":u[1],"comment":u[2]};
      data.history.push(pt);
    }
    let sur=x.surgery;
    for(let i = 0; i < sur.length; i++){
      let u= sur[i].split(">>");
      let label= u[0].split("-");
      let pt = { "label": label[0], "description": label[0], "value": u[0] , "history_type": "Surgical History", "history_doctype":"Clinical Procedure Template", "since":u[1],"comment":u[2]};
      data.history.push(pt);
    }
    let med=x.medicine;
    for(let i = 0; i < med.length; i++){
      let u= med[i].split(">>");
      let label= u[0].split("-");
      let pt = { "label": label[0], "description": label[0], "value": u[0] , "history_type": "Medication","history_doctype":"OPD Medication","since":u[1],"comment":u[2]};
      data.history.push(pt);
    }
    let all=x.allergy;
    for(let i = 0; i < all.length; i++){
      let u= all[i].split(">>");
      let pt = { "label": u[0], "description": u[0], "value": u[0] , "history_type": "Allergy","history_doctype":"Patient Allergy", "since":u[1],"comment":u[2]};
      data.history.push(pt);
    }
    }
  if(desk[0].patient_details){   
    dr_notes.value=desk[0].patient_details.split("|");
  }
  }
</script>