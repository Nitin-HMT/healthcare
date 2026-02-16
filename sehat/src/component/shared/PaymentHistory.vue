<template>
  <div>
    <!--List View from Frappe will give a better look and feel-->

    <div v-if="result.length > 0">
      <div
        class="grid grid-cols-5 border text-base bg-gradient-to-br from-teal-700/85 to-teal-900 text-white py-2 px-1 rounded-md"
      >
        <div>Date</div>
        <div>Invoice</div>
        <div class="flex justify-end items-end">Rounded Total</div>
        <div class="flex justify-end items-end">Paid Total</div>
        <div class="flex item-end justify-end">Print</div>
      </div>
      <div
        v-for="item in result"
        class="capitalize rounded-md py-0.5 text-xs"
        :key="item.name"
      >
        <div class="grid grid-cols-5 border font-light px-2 gap-y-1 rounded-md">
          <div class="flex justify-start items-center">
            {{ item.format_date }}
          </div>
          <div class="text-[10px] flex justify-end items-center">
            {{ item.name }}
          </div>
          <div class="flex justify-end items-center">
            {{ formatCurrency(item.rounded, "INR") }}
          </div>
          <div class="flex justify-end items-center">
            {{ formatCurrency(item.paid, "INR") }}
          </div>
          <div class="flex item-end justify-end">
            <Button
              class="col-span-1 rounded-full"
              @click="printed(item.name)"
              :theme="'green'"
              :variant="'ghost'"
            >
              <Printer class="h-4 w-4 font-light text-teal-700" />
            </Button>
          </div>
        </div>
      </div>
      <div class="flex items-end justify-end">
        <Button
          @click="sales_inv.next()"
          v-show="sales_inv.hasNextPage"
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
import { Printer } from "lucide-vue-next";
import { createListResource, createResource } from "frappe-ui";
import { formatCurrency } from "@/utils.js";
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
let sales_inv = createListResource({
  doctype: "Sales Invoice",
  fields: ["*"],
  filters: {
    patient: props.Pat_id,
    // creation: [">",start_time],
    docstatus: 1,
  },
  pageLength: 5,
  orderBy: "posting_date desc",
  auto: true,
  transform(data) {
    result.value.splice(0);
    for (let d of data) {
      let date = dayjs(d.posting_date + " " + d.posting_time).fromNow();
      if (d.docstatus != 2) {
        result.value.push({
          date: date,
          format_date: dayjs(d.posting_date).format("DD/MM/YYYY"),
          rounded: d.rounded_total,
          paid: d.paid_amount,
          name: d.name,
        });
      }
    }
  },
});
function printed(prescription) {
  window.open(
    "/printview?doctype=Sales Invoice&name=" +
      prescription +
      "&trigger_print=1&format=Patient Bill&no_letterhead=1&letterhead=No Letterhead&settings={}&_lang=en",
    "_blank",
  );

  //window.open("/app/print/Sales Invoice/" + prescription, "_blank");
  // /printview?doctype=Patient Encounter&name=OC-APP-0525-002&trigger_print=1&format=New_Prescription&no_letterhead=1&letterhead=No Letterhead&settings={}&_lang=en
// /printview?doctype=Sales Invoice&name=ACC-SINV-2026-00008&trigger_print=1&format=Sales Auditing Voucher&no_letterhead=1&letterhead=No Letterhead&settings={}&_lang=en
}
onMounted(() => {
  sales_inv.fetch();
});
</script>
