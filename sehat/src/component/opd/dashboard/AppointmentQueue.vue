<template>
  <div class="flex flex-row gap-x-3 item-end justify-end">
    <Button
      :variant="'solid'"
      class="justify-self-end flex bg-gradient-to-br from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white transition-all"
      size="sm"
      v-if="!appoint_flag"
      @click="appointStore.setAppointments()"
      ><RotateCw class="h-5"
    /></Button>
    <Button
      :variant="'solid'"
      class="justify-self-end flex bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white transition-all"
      size="sm"
      v-if="!appoint_flag"
      @click="appoint_flag = true"
      ><Plus
    /></Button>
  </div>
  <div>
    <p class="mt-2" v-if="test_array.length">
      <Tabs
        as="div"
        class="border bg-white font-seriff rounded-lg"
        :tabs="test_array"
      >
        <template #tab-panel="{ tab }">
          <div class="p-3 bg-white">
            <!--<div v-html="tab.full"></div>-->
            <div class="" v-if="tab.details.length">
              <ol v-for="(item, index) in tab.details">
                <Popover
                  class="grid grid-cols-3 rounded-full text-sm border gap-2 py-2 px-1 mt-1 hover:shadow-md hover:bg-gradient-to-r from-teal-200/20 to-teal-300/80"
                >
                  <template #target="{ togglePopover }">
                    <div
                      class="pl-3 flex gap-2 col-span-2"
                      @click="togglePopover()"
                    >
                      <div>
                        <Badge
                          variant="subtle"
                          class="rounded-full"
                          size="sm"
                          :theme="statusToColor[item.opd]"
                          >{{ index + 1 }}</Badge
                        >
                      </div>
                      <div class="relative">
                        <User
                          class="w-5 h-5"
                          :class="[
                            item.gender === 'Female'
                              ? 'text-pink-700'
                              : 'text-blue-700',
                          ]"
                        />

                        <CheckCheck
                          class="w-4 h-5 text-amber-500 absolute top-1/2 left-1/2 translate-x-0.5 -translate-y-5 z-10"
                          v-if="item.opd && item.vitals"
                        />
                        <Check
                          class="w-4 h-5 text-amber-500 absolute top-1/2 left-1/2 translate-x-0.5 -translate-y-5 z-10"
                          v-if="item.opd && !item.vitals"
                        />
                        <CheckCheck
                          class="w-4 h-5 text-green-500 absolute top-1/2 left-1/2 translate-x-0.5 -translate-y-5 z-10"
                          v-else-if="item.vitals && item.invoice"
                        />
                        <Check
                          class="w-4 h-5 text-green-500 absolute top-1/2 left-1/2 translate-x-0.5 -translate-y-5 z-10"
                          v-else-if="item.invoice"
                        />
                        <Check
                          class="w-4 h-5 text-gray-500 absolute top-1/2 left-1/2 translate-x-0.5 -translate-y-5 z-10"
                          v-else-if="item.vitals && !item.opd && !item.invoice"
                        />
                      </div>
                      {{ item.patient }}, {{ item.age }}
                    </div>
                    <div class="justify-self-end pr-1" @click="togglePopover()">
                      {{ item.date }}
                    </div>
                  </template>
                  <template #body-main>
                    <div>
                      <div
                        class="p-2 text-base hover:shadow-md hover:bg-gradient-to-r from-teal-200/20 to-teal-300/80 rounded-sm"
                      >
                        <router-link
                          :to="{
                            name: 'opd_consult',
                            params: {
                              app_id: item.appnt_id,
                              pat_id: item.pat_id,
                            },
                          }"
                          class="flex justify-between flex-col"
                          >Start Consult</router-link
                        >
                      </div>
                      <div
                        v-if="item.invoice"
                        @click="printed(item.invoice_no)"
                        class="p-2 text-base hover:shadow-md hover:bg-gradient-to-r from-teal-200/20 to-teal-300/80 rounded-sm cursor-pointer"
                      >
                        Print Current Bill
                      </div>
                      <div
                        class="p-2 text-base hover:shadow-md hover:bg-gradient-to-r from-teal-200/20 to-teal-300/80 rounded-sm cursor-pointer"
                      >
                        <router-link
                          :to="{
                            name: 'pat_dash',
                            params: {
                              pat_id: item.pat_id,
                            },
                          }"
                          class="flex justify-between flex-col"
                          >Patient Dashboard</router-link
                        >
                      </div>
                      <div
                        @click="cancel_appoint(item.appnt_id)"
                        class="p-2 flex text-base hover:shadow-md hover:bg-gradient-to-r from-red-600 to-red-900 hover:text-white rounded-sm cursor-pointer"
                      >
                        <Spinner
                          class="w-4 text-gray-500"
                          v-if="appoint_cancel_load"
                        />
                        Cancel
                      </div>
                    </div>
                  </template>
                </Popover>
              </ol>
            </div>
            <div v-else>
              <Badge
                :variant="'solid'"
                class="block w-full rounded-full px-2 py-2 font-serif item-center justify-center bg-gradient-to-r from-red-800 to-red-600 hover:from-red-900 hover:to-red-700 text-white transition-all"
                size="xl"
                label="No Appointments"
              />
            </div>
          </div>
        </template>
      </Tabs>
    </p>
    <div v-else>
      <Badge
        :variant="'solid'"
        class="mt-2 block w-full rounded-full px-2 py-2 font-serif item-center justify-center bg-gradient-to-r from-red-800 to-red-600 hover:from-red-900 hover:to-red-700 text-white transition-all"
        size="xl"
        label="No Appointments"
      />
    </div>
  </div>
</template>
<script setup>
import { useAppointmentStore } from "@/stores/appointmentStore.js";
import { Button, Dialog, Spinner, Tabs, Badge, Popover } from "frappe-ui";
import { ref, onMounted, onUnmounted } from "vue";
import { appoint } from "@/composables/useAppointmentUtils.js";
const { appoint_flag, cancel_appoint, appoint_cancel_load } = appoint();
import { Plus, User, Check, CheckCheck, RotateCw } from "lucide-vue-next";
import { usePatientStore } from "@/stores/patientStore";

const appointStore = useAppointmentStore();
const patientStore = usePatientStore();
let test_array = ref();
test_array.value = appointStore.appointments;
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
function printed(prescription) {
  window.open("/app/print/Sales Invoice/" + prescription, "_blank");
}
</script>
