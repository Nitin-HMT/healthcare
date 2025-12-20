<template>
   <!-- {{ route.name }} -->
  <div class="hidden md:flex pt-14 flex-grow">
    <!--Side Bar with Medical History, Payment History-->    
    <div class="flex-grow m-2">
      <div class="bg-white rounded-md drop-shadow-md">
        <div class="bg-teal-50 rounded-t-md drop-shadow-sm">
      <PatientPanel :Pat_id="pat_id" :Request_from= "route.name" class="mx-3"/></div>
      
      <!--Top Panel, For Vitals and Labs-->
      <!-- <div class="grid grid-cols-2 gap-x-0.5 -mt-1 transition-all duration-300 ease-in-out">
        <VitalsPanel :Pat_id="pat_id" :App_id= "app_id" Collapse= true :Request_from= "route.name" v-if="vitals_flag" class="transition-all duration-300 ease-in-out" />
        <LabSummary :Pat_id="pat_id" :App_id= "app_id" Collapse= true :Request_from= "route.name" v-if="vitals_flag" class="transition-all duration-300 ease-in-out"/>
      </div> -->
      <!-- <OPDButtons :Pat_id="pat_id" :App_id= "app_id" Collapse= true :Request_from= "route.name"/> -->
      <Interaction :Pat_id="pat_id" :App_id= "app_id" Collapse= true :Request_from= "route.name"/></div>
  <!--More Information Panel- for OPD Payments, Refferals and App Id-->
      <div class="flex flex-row flex-grow gap-3 border p-1 m-1 mt-2 py-4 text-sm bg-white rounded-md drop-shadow-lg">
       <div class="font-sans text-sm text-gray-900 font-bold leading-5">More Information:</div> 
        <div v-for="item in appointStore.payment_pending"  @click="payqueue(item)">
          <div v-if="item.name==app_id" class="flex justify-start items-start gap-3">
            <Badge :variant="'solid'" class="bg-gradient-to-r from-pink-800 to-pink-600" size="lg" label="Payment Pending"/>
            <Badge :variant="'subtle'" class="text-white bg-gradient-to-r from-gray-600 to-gray-800" size="lg"
              v-if="item.refer">Reffered By: {{item.refer}}</Badge>
          </div>
        </div>
        <div v-for="item in appointStore.payment_complete "  @click="payqueue(item)">
          <div v-if="item.name==app_id" class="flex justify-start items-start gap-3">
            <Badge :variant="'solid'" class="bg-gradient-to-r from-orange-800 to-orange-600" size="lg" label="Free Visit" v-if="item.pos"/>
            <div v-else class="space-x-2">
              <Badge :variant="'solid'" class="bg-gradient-to-r from-teal-900 to-teal-700" size="lg" label="Payment Done"/>
              <Badge :variant="'subtle'" class="text-white bg-gradient-to-r from-cyan-600 to-cyan-800" size="lg">{{formatCurrency(item.bill,"INR")}}</Badge>
              <!-- <Badge>{{ item.pay_mode }}</Badge><Badge>{{ item.inv_id }}</Badge> -->
            </div>
            <Badge :variant="'subtle'" class="text-white bg-gradient-to-r from-gray-600 to-gray-800" size="lg"
              v-if="item.refer">Reffered By: {{item.refer}}</Badge>
          </div>
        </div>
        <div class="text-xs text-gray-600 flex justify-self-end items-self-end">{{ app_id }}</div>
      </div>
    </div>
  </div>
  <!-- Dialog to make or alter payments-->
  <Dialog v-model="pay_flag">
    <template #body-title>
      <h3>Payments</h3>
    </template>
    <template #body-content>
      <Payments/>
    </template>  
  </Dialog>

</template>
<script setup>
import { useRoute } from "vue-router";
import PatientPanel from '@/component/ui/PatientPanel.vue';
import VitalsPanel from '@/component/shared/VitalsDisplay.vue';
import Interaction from '@/component/shared/PatientInteraction2.vue';
import LabSummary from '@/component/shared/LabResultsSummary.vue';
import OPDButtons from '@/component/opd/dashboard/OpdButtons.vue';
import {Badge, Dialog} from 'frappe-ui';
import { patient_panel } from '@/composables/usePatientStore.js';
import { useAppointmentStore } from '@/stores/appointmentStore.js'
import {formatCurrency} from "@/utils.js";
import { payment } from '@/composables/useOpdPayment.js';
import Payments from '@/component/opd/dashboard/OpdPayment.vue'
const { pay_flag }= payment();

const appointStore = useAppointmentStore()
const { patientPanel_flag,vitals_flag }= patient_panel();

const route= useRoute();
const app_id = route.params.app_id;
const pat_id = route.params.pat_id;


function payqueue(pat_id_pay){
    appointStore.setsel_app(pat_id_pay);
   // vitals_patient.value=pat_id_vitals;
    pay_flag.value=true;
}


</script>