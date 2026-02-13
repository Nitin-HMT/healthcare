<template>
  <div>
    <!--List View from Frappe will give a better look and feel-->

    <div v-if="result.length > 0">
      <!-- <div class="grid grid-cols-2 border text-base bg-gradient-to-br from-teal-700/85 to-teal-900 text-white py-2 px-1 rounded-md">
            <div class="col-span-2">Period</div>
            <div>Impressions</div>
            <div>History</div>
            <div>More Information</div>
        </div> -->
      <div
        v-for="item in result"
        class="capitalize text-sm py-2 my-1 px-1 rounded-md"
        :key="item.name"
      >
        <div
          @click="item.expanded = !item.expanded"
          class="grid grid-cols-2 border font-semibold bg-gradient-to-t from-teal-900/85 to-teal-600 text-white py-1.5 px-2 mb-2 rounded-md"
        >
          <div>{{ item.format_date }} ({{ item.date }})</div>
          <div class="flex justify-end items-end">
            {{ item.doctor }}
            <ChevronDown class="h-4" v-show="!item.expanded" />
            <ChevronUp class="h-4" v-show="item.expanded" />
          </div>
        </div>
        <div
          :class="item.expanded ? 'h-auto' : 'h-0'"
          class="grid grid-cols-7 gap-2 transition-all duration-300 ease-in-out"
          v-show="item.expanded"
        >
          <!-- collapse on click -->
          <div class="flex flex-col col-span-3 px-2">
            <div class="font-semibold pb-1">Obx & Rx:</div>
            <div>{{ item.imp }}</div>
          </div>
          <!-- better view -->
          <div class="flex flex-col col-span-3 px-2">
            <div class="font-semibold pb-1">History:</div>
            <div>{{ item.hist }}</div>
          </div>
          <!-- better view -->
          <Button
            class="col-span-1 rounded-full"
            @click="printed(item.name)"
            :theme="'green'"
            :variant="'ghost'"
          >
            <Printer class="h-6 w-6 font-black text-teal-700" />
          </Button>
          <div class="col-span-6 grid grid-cols-2 text-base rounded-md">
            <div class="flex px-2" v-show="item.refer">
              <div class="font-semibold pr-1">Reffered To:</div>
              {{ item.refer }}
            </div>
            <div class="flex px-2" v-show="item.follow > 0">
              <div class="font-semibold pr-1">Follow Up Advised:</div>
              {{ item.follow }} days
            </div>
          </div>
        </div>
        <!-- <div>{{ item.name }}</div> -->
      </div>
      <div class="flex items-end justify-end">
        <Button
          @click="med_history.next()"
          v-show="med_history.hasNextPage"
          :variant="'outline'"
          theme="green"
          >More Records</Button
        >
      </div>
    </div>
    <div v-else class="font-mono text-xs">No History</div>
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
} from "frappe-ui";
import { Printer, ChevronDown, ChevronUp } from "lucide-vue-next";
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
//let start_time=dayjs().subtract(3, 'month');
const props = defineProps({
  Pat_id: String,
  App_id: String,
  Room_id: String,
  Request_from: String,
});
let med_history = createListResource({
  doctype: "Patient Encounter",
  fields: ["*"],
  filters: {
    patient: props.Pat_id,
    // creation: [">",start_time],
    docstatus: 1,
  },
  pageLength: 3,
  orderBy: "encounter_date desc",
  auto: true,
  transform(data) {
    result.value.splice(0);
    for (let d of data) {
      let date = dayjs(d.encounter_date).fromNow();
      let firstElements = "";
      if (d.refer_to) {
        firstElements = d.refer_to.split("-"); // Split the string by the comma
        // return firstElements[0]; // Take the first element of the resulting array
      }
      if (d.docstatus != 2) {
        let expanded_flag = ref(true);
        if (props.Request_from == "pat_dash") {
          expanded_flag.value = false;
        }
        result.value.push({
          date: date,
          format_date: dayjs(d.encounter_date).format("DD/MM/YYYY"),
          imp: d.stream_of_thought_input,
          doctor: d.practitioner_name,
          hist: d.pat_hist_string,
          name: d.name,
          refer: firstElements[0],
          follow: d.follow_up,
          expanded: expanded_flag.value,
        });
      }
    }
  },
});
function printed(prescription) {
  window.open("/app/print/Patient Encounter/" + prescription, "_blank");
  // /printview?doctype=Patient Encounter&name=OC-APP-0525-002&trigger_print=1&format=New_Prescription&no_letterhead=1&letterhead=No Letterhead&settings={}&_lang=en
}
onMounted(() => {
  med_history.fetch();
});
</script>
