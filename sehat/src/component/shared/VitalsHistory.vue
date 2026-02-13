<template>
  <div>
    <!--List View from Frappe will give a better look and feel-->
    <div v-if="result.length > 0">
      <div
        class="grid grid-cols-9 border text-base bg-gradient-to-br from-teal-700/85 to-teal-900 text-white py-2 px-1 rounded-md"
      >
        <div class="col-span-2">Period</div>
        <div>BP</div>
        <div>Pulse</div>
        <div>Temp</div>
        <div>Spo2</div>
        <div>Wt</div>
        <div>BMI</div>
        <div>Action</div>
      </div>
      <div
        v-for="item in result"
        class="grid grid-cols-9 text-xs border py-2 my-1 px-1 rounded-md"
        :key="item.name"
      >
        <div class="col-span-2">{{ item.date }}</div>
        <div>{{ item.bp_sys }}/{{ item.bp_dias }}</div>
        <div v-if="item.pulse > 0">{{ item.pulse }}</div>
        <div class="text-xs text-gray-600" v-else>N.R.</div>
        <div v-if="item.temp > 0">{{ item.temp }} °F</div>
        <div class="text-xs text-gray-600" v-else>N.R.</div>
        <div v-if="item.spo2 > 0">{{ item.spo2 }} %</div>
        <div class="text-xs text-gray-600" v-else>N.R.</div>
        <div v-if="item.wt > 0">{{ item.wt }} Kg</div>
        <div class="text-xs text-gray-600" v-else>N.R.</div>
        <div
          v-if="item.bmi > 0"
          :class="[item.note != 'Normal' ? 'text-red-700' : 'text-gray-900']"
        >
          {{ item.bmi }}
        </div>
        <div class="text-xs text-gray-600" v-else>N.R.</div>
        <div>
          <Badge
            class="cursor-pointer"
            @click="
              vitals.runDocMethod.submit({ method: 'cancel', name: item.name })
            "
            :theme="'red'"
            >Cancel</Badge
          >
        </div>
        <!-- De-link vitals with interaction and appointment -->
      </div>
      <Button
        @click="vitals.next()"
        v-show="vitals.hasNextPage"
        :variant="'outline'"
        theme="green"
        >More Records</Button
      >
    </div>
    <div v-else class="font-mono text-xs">No Vitals</div>
  </div>
</template>
<script setup>
import { onMounted, ref, watch, inject } from "vue";
import {
  ListView,
  Switch,
  Button,
  Autocomplete,
  Badge,
  Dialog,
  FormControl,
  ErrorMessage,
  FeatherIcon,
} from "frappe-ui";
import { createListResource, createResource } from "frappe-ui";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import updateLocale from "dayjs/plugin/updateLocale";
dayjs.extend(relativeTime);
dayjs.extend(LocalizedFormat);
dayjs.extend(updateLocale);

//Declaring Variable
//let vitals=ref([]);
let result = ref([]);
let start_time = dayjs().subtract(3, "month");
const props = defineProps({
  Pat_id: String,
  App_id: String,
  Room_id: String,
  Request_from: String,
});
let vitals = createListResource({
  doctype: "Vital Signs",
  fields: ["*"],
  filters: {
    patient: props.Pat_id,
    creation: [">", start_time],
    docstatus: 1,
  },
  pageLength: 5,
  orderBy: "signs_date desc",
  auto: true,
  transform(data) {
    result.value.splice(0);
    for (let d of data) {
      let date = dayjs(d.signs_date + " " + d.signs_time).fromNow();
      if (d.docstatus != 2) {
        result.value.push({
          date: date,
          bp_sys: d.bp_systolic,
          bp_dias: d.bp_diastolic,
          pulse: d.pulse,
          temp: d.temperature,
          spo2: d.spo2,
          ht: d.height,
          wt: d.weight,
          bmi: d.bmi,
          note: d.nutrition_note,
          name: d.name,
          appnt: d.appointment,
          enc: d.encounter,
        });
      }
    }
  },
});

onMounted(() => {
  vitals.fetch();
});
</script>
