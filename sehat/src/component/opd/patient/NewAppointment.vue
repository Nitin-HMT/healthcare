<template>
  <div class="grid grid-cols-1">
    <Button
      :variant="'solid'"
      class="justify-self-end bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white transition-all"
      size="sm"
      :disabled="false"
      v-if="appoint_flag"
      @click="appoint_flag = false"
      ><X
    /></Button>
  </div>
  <div
    class="p-1 mt-1 bg-gradient-to-br from-teal-50 via-white to-teal-100 rounded-md"
  >
    <div
      class="mt-1 flex justify-center items-center font-semibold tracking-wider text-lg"
    >
      New Appointment
    </div>
    <PatientSearch class="bg-white" />
    <div
      v-if="!patientStore.sel_pat"
      class="mt-4 flex item-center justify-center gap-3 p-3"
    >
      <Badge
        :variant="'solid'"
        class="block w-full rounded-full px-2 py-2 font-serif item-center justify-center bg-gradient-to-r from-teal-800 to-teal-700 text-white transition-all"
        size="lg"
        label="No Patient Selected"
      />
    </div>
    <div v-else class="grid grid-cols-2 gap-5 m-4 text-sm">
      <div class="flex flex-col gap-5">
        <Autocomplete
          v-if="healthcare_pr.length > 1"
          :options="healthcare_pr"
          v-model="data.doctor"
          class="block w-full rounded-full px-2 py-2 font-serif bg-gray-100 border-solid border border-gray-100 hover:bg-gray-200/90 transition-all"
          placeholder="Appointment For"
        >
        </Autocomplete>
        <div
          v-else
          class="block w-full rounded-full px-2 py-2 font-serif bg-gray-100 border-solid border border-gray-100 hover:bg-gray-200/90 transition-all"
        >
          {{ data.doctor.label }}
        </div>
        <span
          class="block w-full rounded-full px-2 py-2 font-mono bg-gray-100 border-solid border border-gray-100 hover:bg-gray-200/90 transition-all"
          >{{ dateformat(data.appoint, "DD/MM/YYYY HH:mm") }}</span
        >
        <Switch
          class="block w-full rounded-full py-2 font-serif bg-gray-100 border-solid border border-gray-100 hover:bg-gray-200/90 transition-all"
          v-model="data.appoint_type"
          label="Free Visit"
          size="sm"
        />
      </div>
      <div class="flex flex-col gap-5">
        <FormControl
          type="select"
          :options="[
            { label: 'OPD Appointment', value: 'OPD Appointment' },
            { label: 'Labs', disabled: true },
            { label: 'Procedure/OT', disabled: true },
          ]"
          v-model="data.appnt_type"
          class="block w-full rounded-full px-2 py-2 font-serif bg-gray-100 border-solid border border-gray-100 hover:bg-gray-200/90 transition-all"
        />
        <!-- <FormControl type="date" v-model="data.appoint" placeholder="Appointment Date & Time" class="block w-full rounded-full px-2 py-1.5 font-mono 
      bg-gray-100 border-solid border border-gray-100 hover:bg-gray-200/90 transition-all"/> -->
        <div class="grid grid-cols-4 gap-2">
          <FormControl
            type="autocomplete"
            :options="referdr"
            v-model="selrefdr"
            placeholder="Referred By"
            class="block col-span-3 w-full rounded-full px-2 py-2 font-serif bg-gray-100 border-solid border border-gray-100 hover:bg-gray-200/90 transition-all"
          />
          <Button
            :variant="'subtle'"
            size="xl"
            label="+"
            class="w-full rounded-full py-2 mt-1 bg-gray-300 border-solid border hover:bg-gray-400 text-lg transition-all"
            @click="refer_create = true"
          />
        </div>

        <!--       
      <span v-if="data.doctor && !data.appoint_type" class="block w-full rounded-full px-2 py-2 font-mono 
      bg-gray-100 border-solid border border-gray-100 hover:bg-gray-200/90 transition-all ">{{ formatCurrency(data.doctor.charge,"INR") }}</span>
      --></div>

      <div class="col-span-2">
        <Button
          v-if="data.doctor"
          :variant="'subtle'"
          size="xl"
          label="Book Appointment"
          class="col-span-2 block w-full rounded-full px-2 py-2 font-serif item-center justify-center bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white transition-all"
          @click="make_newAppoint(data, patientStore.sel_pat)"
          :loading="appoint_load"
        />
        <Button
          v-else
          :variant="'subtle'"
          size="lg"
          label="Doctor Not Selected"
          class="col-span-2 block w-full rounded-full px-2 py-2 item-center justify-center"
          :disabled="true"
        />
      </div>
    </div>
    <Dialog v-model="refer_create">
      <template #body-title>
        <h3>Create Referal Doctor</h3>
      </template>
      <template #body-content>
        <div class="flex flex-col gap-3">
          <ErrorMessage :message="error_ref" />
          <FormControl
            v-model="data.refer[0]"
            type="text"
            label="Doctor Name"
            placeholder="Referred To Doctor Name"
          />
          <FormControl
            v-model="data.refer[1]"
            type="textarea"
            label="More Info"
            placeholder="More Info eg Speciallity, Mobile No."
          />
        </div>
      </template>
      <template #actions>
        <Button
          variant="solid"
          @click="make_newRef(data.refer[0], data.refer[1])"
          v-if="data.refer[0]"
        >
          Confirm
        </Button>
      </template>
    </Dialog>

    <ErrorMessage :message="error_appoint" />
  </div>
</template>

<script setup>
import PatientSearch from "@/component/opd/patient/PatientSearch.vue";
import { usePatientStore } from "@/stores/patientStore";
import {
  Autocomplete,
  Switch,
  createResource,
  FormControl,
  Badge,
  Dialog,
  ErrorMessage,
} from "frappe-ui";
import { reactive, ref, watch, inject, onMounted } from "vue";
import { dateformat, formatCurrency } from "@/utils.js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import updateLocale from "dayjs/plugin/updateLocale";
import { referral } from "@/composables/useReferralUtils.js";
import { appoint } from "@/composables/useAppointmentUtils.js";
import { useAppointmentStore } from "@/stores/appointmentStore.js";
import { X } from "lucide-vue-next";
dayjs.extend(relativeTime);
dayjs.extend(LocalizedFormat);
dayjs.extend(updateLocale);

const { referdr, make_newRef, selrefdr, refer_create, error_ref } = referral();
const {
  healthcare_pr,
  make_newAppoint,
  error_appoint,
  appoint_create,
  appoint_load,
  appoint_flag,
} = appoint();
const patientStore = usePatientStore();
const appointStore = useAppointmentStore();

const data = reactive({
  appnt_type: "OPD Appointment",
  doctor: "",
  ref_dr: "",
  appoint: dayjs(),
  appoint_type: false,
  refer: [null, null],
});
onMounted(() => {
  setTimeout(() => {
    console.log(healthcare_pr.value.length);
    if (healthcare_pr.value.length == 1) {
      data.doctor = healthcare_pr.value[0];
    }
  }, 500);
});

watch(selrefdr, (newValue, oldValue) => {
  data.ref_dr = selrefdr;
  data.refer = [null, null];
});
watch(appoint_create, (newValue, oldValue) => {
  if (appoint_create) {
    data.doctor = "";
    data.ref_dr = "";
    data.appoint = dayjs();
    data.appoint_type = 0;
    data.refer.splice(0);
    patientStore.clearSel_pat();
    appoint_create.value = false;
    appoint_flag.value = false;
    appointStore.setAppointments();
  }
});
</script>
