<template>
    <div v-if="patient" class="p-3 grid md:grid-cols-5 gap-2 shadow-md bg-gray-100/80 rounded-sm space-y-2 justify-between flex-col hover:bg-violet-100/20 transition-all">
      <span class="flex gap-2 col-span-2" @click="patDialogshown=true">
        <FeatherIcon class="w-8 h-8" :class="[
            patient.list.data[0].gen_abbr === 'F' ? 'text-pink-700' :'text-blue-700'
        ]"  name="user"/>
       <p class="font-mono font-bold underline decoration-gray-600 flex gap-4">Patient Details:</p>
        <p class="flex items-center justify-between flex-col font-sans" v-if="patient">{{ data.appnt_patient.label }}| {{  Patient_details.list.data[0].gen_abbr }} | {{ data.appnt_patient.description }}</p>
        <p v-if="Patient_details">
          <Badge
            v-if="data.appnt_patient.Vitals[10]"
            :variant="'solid'"
            :ref_for="true"
            theme="green"
            size="sm"
            label="Free"
          />
        </p>
      </span>
      <span v-if="Patient_details" class="col-span-2" @click="patDialogshown=true" >
        <p class="flex items-center justify-between flex-col font-sans font-light text-sm">
        {{ data.appnt_patient.Vitals[0]}}| {{ data.appnt_patient.Vitals[1] }}bpm | SpO2 : {{ data.appnt_patient.Vitals[2] }}%  | Ht: {{ data.appnt_patient.Vitals[3] }}m | Wt: {{ data.appnt_patient.Vitals[4] }}Kg | BMI: {{ data.appnt_patient.Vitals[5] }}-{{ data.appnt_patient.Vitals[8] }}|</p>
        <div v-if="data.appnt_patient.Vitals[9]" class="flex items-center justify-between flex-col font-sans font-light text-sm">Refferring Dr: {{ data.appnt_patient.Vitals[9] }}
        <!--<p class="flex items-center justify-between flex-col font-sans font-light text-sm" v-if="data.appnt_patient.Vitals[9].label">Refferring Dr: {{ data.appnt_patient.Vitals[9].label }}</p>
        <p class="flex items-center justify-between flex-col font-sans font-light text-sm" v-else>Refferring Dr: {{ data.appnt_patient.Vitals[9] }}</p>
      --></div>
      </span>
      <span class="flex items-right justify-end">
        <!--<Button variant="solid" class= "bg-gradient-to-r from-violet-800 to-red-800 
        hover:from-amber-400 hover:to-green-900"
        :loading="false"
        :loadingText="null"
        :disabled="false"
        :link="null"
      >view complete history</Button>-->
      </span>
      
    </div>
</template>
<script setup>
import { reactive, ref, computed, watch } from 'vue';
import { Badge, Button, FormControl, Autocomplete,Dialog,FeatherIcon,Select,TabButtons,Tabs } from 'frappe-ui';
import { createListResource,createResource, ErrorMessage } from 'frappe-ui';
import Header from '@/component/Header.vue';
import ItemCard from '@/component/ItemCard.vue';
import {createToast} from "@/utils.js";
defineProps({
    patient: String,
    appointment: String,
  });
const patDialogshown = ref(false);
const productsList = computed (() =>{
    if(productsResource.list.data){
        return productsResource.list.data;
    }
    return [];
})
</script>