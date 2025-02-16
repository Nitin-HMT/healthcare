<template>
  <Header></Header>
  <nav class="m-2 bg-slate-200 ">
    <div class="flex"> 
      <div>Location of Consult:</div>
      <div>
        <Select class="mx-2"
          :options="[
            {
              label: 'Clinic',
              value: 'Clinic',
            },
            {
              label: 'Roving',
              value: 'Roving',
            },
          ]"
          v-model="data.clinic_type"
        />
      </div>

      <!--<li class="mx-2">
          <button class="border-2 border-green-300 py-1 px-2
           text-green-900 text-sm rounded-lg 
           focus:bg-green-300 hover:bg-green-600 hover:text-green-100 active:bg-blue-900
           hover:transition-all" @click="Tab_flag_clinic = true; Tab_flag_roving = false;">Clinic</button>
      </li>
      <li>
          <button class="border-2 border-green-300 py-1 px-2
           text-green-900 text-sm rounded-lg 
           focus:bg-green-300 hover:bg-green-600 hover:text-green-100 
           hover:transition-all" @click="Tab_flag_roving = true; Tab_flag_clinic = false;">Roving</button>
      </li> -->
      
      <TextInput
        :type="'search'"
        :ref_for="true"
        size="sm"
        variant="subtle"
        placeholder="Placeholder"
        :disabled="false"
        :modelValue="data.clinic_type"
      />
    </div>
  </nav>

  <div class="mt-4 grid md:grid-cols-3 gap-2 p-1">
    <div v-if="syms.length>0" class="mt-4 p-3 shadow-md bg-violet-100/80 rounded-sm space-y-2 flex items-center justify-between flex-col">
      <span class="font-mono font-bold underline decoration-violet-600 flex items-center justify-between gap-4">
        <Avatar
          :shape="'circle'"
          :ref_for="true"
          image="/files/symptoms.jpg"
          label="EY"
          size="xl"
          />
        Observations
      </span>
      <span class="flex items-center justify-between font-sans" v-for="item in syms">
        <p>{{ item.label }}</p>
      </span>
    </div>
    <div v-if="diag.length>0" class="mt-4 p-3 shadow-md bg-green-100/80 rounded-sm space-y-2 flex items-center justify-between flex-col">
      <span class="font-mono font-bold underline decoration-green-600 flex items-center justify-between gap-4">
        <Avatar
          :shape="'circle'"
          :ref_for="true"
          image="/files/diagnosis.jpg"
          label="EY"
          size="xl"
          />
        Diagnosis
      </span>
      <span class="flex items-center justify-between font-sans" v-for="item in diag">
        <p>{{ item.label }}</p>
      </span>
    </div>
    <div v-if="lab.length>0" class="mt-4 p-3 shadow-md bg-blue-800/10 rounded-sm space-y-2 flex items-center justify-between flex-col">
      <span class="font-mono font-bold underline decoration-blue-600 flex items-center justify-between gap-4">
        <Avatar
          :shape="'circle'"
          :ref_for="true"
          image="/files/lab_test_blue_2.jpg"
          label="EY"
          size="xl"
          />
        Labs
      </span>
      <span class="flex items-center justify-between font-sans" v-for="item in lab">
        <p>{{ item.label }}</p>
      </span>
    </div>
    <div v-if="surgery.length>0" class="mt-4 p-3 shadow-md bg-red-100/50 rounded-sm space-y-2 flex items-center justify-between flex-col">
      <span class="font-mono font-bold underline decoration-red-600 flex items-center justify-between gap-4">
        <Avatar
          :shape="'circle'"
          :ref_for="true"
          image="/files/surgery _red.jpg"
          label="EY"
          size="xl"
          />
        Procedures
      </span>
      <span class="flex items-center justify-between font-sans" v-for="item in surgery">
        <p>{{ item.label }}</p>
      </span>
    </div>
    <div v-if="meds.length>0" class=" col-span-2 mt-4 p-3 shadow-md bg-amber-100/50 rounded-sm space-y-2 flex items-center justify-between flex-col">
      <span class="font-mono font-bold underline decoration-amber-600 flex items-center justify-between gap-4">
        <Avatar
          :shape="'circle'"
          :ref_for="true"
          image="/files/pill_yellow.jpg"
          label="EY"
          size="xl"
          />
        Medicine
      </span>
      <span class="flex items-center justify-between font-sans" v-for="item in meds">
        <p>{{ item.label }} - {{ item.description }}</p>
      </span>
    </div>
  </div>
  <div>
    <div class="px-[30px] py-20 mx-6 grid grid-cols-12 gap-2">
      
      <div class="col-span-11">
      <Autocomplete 
        :options="all_searches" 
        v-model="data.selected" 
        placeholder="Search for Symptoms, Diagnosis, Medicines, Labs or Procedures" 
        :multiple="true"
        class="block w-full px-2 py-3 font-mono textarea:bg-red-900 text-red-900 bg-red-50 bg-opacity-30 border-solid border border-red-100 "
      >
        <template #item-prefix="{ option }">
          <img
            :src="option.image.toString()"
            class="h-6 w-6"
          >
        </template>
      </Autocomplete>
    </div>
    <div class="col-span-1"><Button
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
    +
  </Button></div>
      
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { Avatar, Dropdown, Button, Select, TextInput, Autocomplete } from 'frappe-ui'
import { createResource, createListResource } from 'frappe-ui'
import { session } from '../data/session'
import Header from '@/component/Header.vue'

const data = reactive({
  Tab_flag_clinic: true,
  Tab_flag_roving: false,
  clinic_type: "Clinic",
  selected: [],
});

const all_searches = ref([]);
let meds = ref([]);
let syms = ref([]);
let diag = ref([]);
let lab = ref([]);
let surgery = ref([]);

// Watch for changes in selected items
watch(
  () => data.selected,
  (selected) => {
    if (selected) {
      meds =[];
      syms =[];
      diag =[];
      lab =[];
      surgery =[];
      for (let s of selected) {
        if (s.type == "Meds") {
          meds.push(s);
        }
        if (s.type == "Complaint") {
          syms.push(s);
        }
        if (s.type == "Diagnosis") {
          diag.push(s);
        }
        if (s.type == "labs") {
          lab.push(s);
        }
        if (s.type == "surg") {
          surgery.push(s);
        }
      }
    }
  }
);

const medicine = createListResource({
  doctype: "OPD Medication",
  fields: ["medicine_brand", "generic_name", "dosage_form", "default_duration", "default_dosage"],
  auto: true,
  transform(data) {
    for (let d of data) {
      let label = d.medicine_brand;
      let description = d.generic_name + "," + d.dosage_form + "," + d.default_duration + "," + d.default_dosage;
      let med = { "label": label, "value": label + "," + description, "description": description, "image": "/files/pill_yellow.jpg", "type": "Meds" };
      all_searches.value.push(med);
    }
  }
});

const symptoms = createListResource({
  doctype: "Complaint",
  fields: ["complaints"],
  auto: true,
  transform(data) {
    for (let d of data) {
      let label = d.complaints;
      let med = { "label": label, "value": label, "image": "/files/symptoms.jpg", "type": "Complaint" };
      all_searches.value.push(med);
    }
  }
});

const diagnosis = createListResource({
  doctype: "Diagnosis",
  fields: ["diagnosis"],
  auto: true,
  transform(data) {
    for (let d of data) {
      let label = d.diagnosis;
      let med = { "label": label, "value": label, "image": "/files/diagnosis.jpg", "type": "Diagnosis" };
      all_searches.value.push(med);
    }
  }
});

const labs = createListResource({
  doctype: "Lab Test Template",
  fields: ["lab_test_name"],
  auto: true,
  transform(data) {
    for (let d of data) {
      let label = d.lab_test_name;
      let med = { "label": label, "value": label, "image": "/files/lab_test_blue_2.jpg", "type": "labs" };
      all_searches.value.push(med);
    }
  }
});

const surg = createListResource({
  doctype: "Clinical Procedure Template",
  fields: ["template"],
  auto: true,
  transform(data) {
    for (let d of data) {
      let label = d.template;
      let med = { "label": label, "value": label, "image": "/files/surgery _red.jpg", "type": "surg" };
      all_searches.value.push(med);
    }
  }
});
</script>