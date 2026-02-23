<template>
  <div class="hidden md:flex flex-col">
    <!-- {{ route.name }} -->
    <div class="m-1 mt-3 bg-white rounded-xl drop-shadow-lg">
      <PatientPanel :Pat_id="pat_id" :Request_from="route.name" class="mx-3" />
    </div>
    <div class="grid grid-cols-2">
      <div class="m-1 bg-white rounded-xl drop-shadow-lg p-2 col-span-2">
        <div>Vitals History</div>
        <VitalsHistory :Pat_id="pat_id" :Request_from="route.name" />
      </div>
      <div
        class="m-1 bg-white rounded-xl drop-shadow-lg p-2 row-span-1 col-span-2"
      >
        <div>Medical History</div>
        <MedicalHistory :Pat_id="pat_id" :Request_from="route.name" />
      </div>
      <div class="m-1 bg-white rounded-xl drop-shadow-lg p-2">
        <div>Appointment History</div>
        <div v-if="appointment.list && appointment.list.data.length">
          <div
            class="grid grid-cols-4 border text-base bg-gradient-to-br from-teal-700/85 to-teal-900 text-white py-1 px-1 rounded-md"
          >
            <div>Name</div>
            <div>Doctor</div>
            <div>Status</div>
            <div class="flex justify-end items-end" v-if="userStore.pay_settings">Payment</div>
          </div>
          <div
            v-for="item in appointment.list.data"
            class="text-xs grid grid-cols-4 justify-start items-center py-1 px-1.5"
          >
            <div>{{ item.name }}</div>
            <div>{{ item.practitioner }}</div>
            <div>
              <Badge variant="subtle" :theme="statusToColor[item.status]">{{
                item.status
              }}</Badge>
            </div>
            <div v-show="!item.fee_valid" class="flex justify-end items-end" v-if="userStore.pay_settings">
              {{ formatCurrency(item.paid_amount, "INR") }}
            </div>
            <div v-show="item.fee_valid" class="flex justify-end items-end" v-if="userStore.pay_settings">
              Free Follow-Up
            </div>
          </div>

          <div class="flex items-end justify-end">
            <Button
              @click="appointment.next()"
              v-show="appointment.hasNextPage"
              :variant="'outline'"
              theme="green"
              >More Records</Button
            >
          </div>
          <div class="flex items-end justify-end">
            <Button
              @click="appointment.reload()"
              v-show="!appointment.hasNextPage"
              :variant="'outline'"
              theme="green"
              >Refresh</Button
            >
          </div>
        </div>
        <div v-else class="font-mono text-xs">No Past Appointment</div>
      </div>
      <!-- <div class="m-1 bg-white rounded-xl drop-shadow-lg p-2">
          <div>Labs History</div>
          <LabHistory :Pat_id="pat_id"  :Request_from= "route.name"/>
        </div>         -->
      <div class="m-1 bg-white rounded-xl drop-shadow-lg p-2" v-if="userStore.pay_settings">
        <div>Payment History</div>
        <PaymentHistory :Pat_id="pat_id" :Request_from="route.name" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { useRoute } from "vue-router";
import MedicalHistory from "@/component/shared/MedicalHistory.vue";
import PaymentHistory from "@/component/shared/PaymentHistory.vue";
import LabHistory from "@/component/shared/LabHistory.vue";
import VitalsHistory from "@/component/shared/VitalsHistory.vue";
import { useUserStore } from "@/stores/userStore";

import {
  Badge,
  FormControl,
  Button,
  createListResource,
  createDocumentResource,
  Dialog,
  Textarea,
} from "frappe-ui";
import {
  User,
  ChevronsLeft,
  ChevronsRight,
  Phone,
  Siren,
  Pencil,
  SquarePlus,
} from "lucide-vue-next";
import { ref } from "vue";
import { formatCurrency } from "@/utils.js";
import PatientPanel from "@/component/ui/PatientPanel.vue";
const route = useRoute();
const pat_id = route.params.pat_id;
const userStore = useUserStore();
let appointment = createListResource({
  doctype: "Patient Appointment",
  fields: ["*"],
  filters: {
    //status: ["in","Open,Confirmed,Scheduled"],
    patient: pat_id,
    status: ["!=", "Cancelled"],
  },
  pageLength: 10,
  orderBy: "creation desc",
  auto: true,
  realtime: true,
  transform(data) {},
});

const statusToColor = {
  Cancelled: "red",
  Scheduled: "blue",
  Open: "blue",
  0: "green",
  Draft: "gray",
  Confirmed: "orange",
  Closed: "gray",
  "No Show": "red",
  1: "red",
};
</script>
