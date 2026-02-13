<template>
  <div v-if="!props.create_new && !create_result">
    <div class="flex justify-end items-end pb-1">
      <Button :variant="'outline'" theme="green" @click="create_result = true"
        >+ New Lab</Button
      >
    </div>
    <div
      class="text-sm font-light tracking-wide capitalize"
      v-if="result.length || test_array.length"
    >
      <div class="grid grid-cols-3">
        <Switch
          size="sm"
          label="Show Results By Test Results"
          v-model="show_bytest"
          v-show="props.Request_from != 'pat_dash'"
        />
      </div>
      <Tabs
        v-if="!show_bytest"
        as="div"
        class="border font-seriff"
        :tabs="result"
        vertical
      >
        <template #tab-panel="{ tab }">
          <div class="p-5 grid grid-cols-10">
            <!--<div v-html="tab.full"></div>-->
            <div class="col-span-9">
              <div
                class="text-gray-600 font-thin text-xs flex justify-end items-end pb-1"
              >
                {{ tab.name }}
              </div>
              <ul
                v-for="item in tab.tests"
                class="grid grid-cols-3 border bg-gray-50/60 justify-start items-center my-1 py-1 pl-1 rounded-md"
              >
                <li class="col-span-1">{{ item.test }}</li>
                <li class="col-span-1">{{ item.result }} {{ item.uom }}</li>
                <!-- <li>{{ item.uom }}</li> -->
                <li class="col-span-1">
                  (Ref Range: {{ item.min }}-{{ item.max }})
                </li>
              </ul>
            </div>
            <!-- <div class="col-span-1"></div> -->
            <Button
              @click="
                lab_tests.runDocMethod.submit({
                  method: 'cancel',
                  name: tab.name,
                })
              "
              :loadingText="null"
              :link="null"
              :theme="'red'"
              class="bg-white"
            >
              <Trash2
                class="w-4 h-4 rounded-full text-red-600"
                name="trash-2"
              />
            </Button>
          </div>
        </template>
      </Tabs>
      <Tabs
        v-else-if="show_bytest"
        as="div"
        class="border font-seriff"
        :tabs="test_array"
        vertical
      >
        <template #tab-panel="{ tab }">
          <div class="p-5 grid grid-cols-10 gap-2">
            <!--<div v-html="tab.full"></div>-->
            <!-- <div class="col-span-4 pt-5 ">
                <ul v-for="(item) in tab.tests" class="grid grid-cols-3 justify-start items-center border">
                  <li>{{item.date}}</li>
                  <li>{{ item.result }}</li>
                  <li>{{ item.uom }}</li>
                  
                </ul>
              </div> -->
            <div class="col-span-7 pt-5">
              <v-frappe-chart
                class=""
                type="line"
                :labels="tab.dates"
                :title="tab.label"
                :data="[{ name: tab.uom, values: tab.resultss }]"
                :colors="get_color()"
                :line-options="{ dotSize: 4, regionFill: 1 }"
                :axis-options="{ xAxisMode: 'tick' }"
                :y-regions="[
                  {
                    label: 'Reference Range',
                    start: tab.min,
                    end: tab.max,
                    options: { labelPos: 'right' },
                  },
                ]"
              />
            </div>
            <div class="col-span-3 pt-5">
              <ul
                v-for="item in tab.tests"
                class="grid grid-cols-2 justify-start items-center py-1 text-sm"
              >
                <li>{{ item.date }}</li>
                <li>{{ item.result }} {{ item.uom }}</li>
              </ul>
            </div>
          </div>
        </template>
      </Tabs>
    </div>
    <div
      v-else
      class="font-mono text-xs py-2 flex flex-row items-center justify-between"
    >
      No Labs
    </div>
  </div>
  <!-- Create a New Lab Test -->
  <div v-else>
    <div class="font-bold font-serif text-xl pl-2 pr-4 grid grid-cols-5 mt-5">
      <p class="flex col-span-4">Add Lab Results</p>
      <Badge
        :variant="'solid'"
        class="block w-full rounded-full font-serif item-center justify-center bg-gradient-to-r from-gray-800 to-teal-600 hover:from-teal-900 hover:to-teal-700 text-white transition-all"
        size="lg"
        label="Go Back"
        @click="create_result = false"
        v-if="!props.create_new"
      />
    </div>
    <div class="grid grid-cols-3 gap-1 font-mono">
      <div class="col-span-2 m-3">
        <div class="grid grid-cols-4 gap-2">
          <FormControl
            :type="'date'"
            variant="outline"
            label="Result Date"
            :required="true"
            v-model="lab_result_date"
          />
          <div class="col-span-3 font-mono">
            <FormControl
              :type="'autocomplete'"
              :options="library.lab_db"
              v-model="lab_result_line"
              label="Search Labs"
              placeholder="Select All Lab Results"
              :multiple="true"
            />
          </div>
        </div>
        <div>
          <ul class="pt-1">
            <li v-for="item in lab_result_line" class="p-0.5">
              <span
                class="grid md:grid-cols-5 gap-1 text-xs font-mono border p-2 hover:drop-shadow-md rounded-md"
              >
                <p class="font-serif flex justify-center items-center p-1">
                  {{ item.label }}
                </p>
                <FormControl
                  :type="'number'"
                  variant="outline"
                  placeholder="Test Result"
                  v-model="item.result"
                />
                <Autocomplete
                  :options="all_uom"
                  variant="outline"
                  placeholder="UOM"
                  v-model="item.uom"
                />
                <FormControl
                  :type="'number'"
                  variant="outline"
                  placeholder="Min Range"
                  v-model="item.min"
                />
                <FormControl
                  :type="'number'"
                  variant="outline"
                  placeholder="Max Range"
                  v-model="item.max"
                />
                <div></div>
                <div v-if="!item.result" class="font-2xs text-red-700">
                  Add Result
                </div>
                <div v-else></div>
                <div v-if="!item.uom" class="font-2xs text-red-700">
                  Please Add UOM{{ item.uom }}
                </div>
                <div v-else></div>
                <div v-if="!item.min" class="font-2xs text-red-700">
                  Add Min Range {{}}
                </div>
                <div v-else></div>
                <div v-if="!item.max" class="font-2xs text-red-700">
                  Please Max Range
                </div>
                <div v-else></div>
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div class="pr-2">
        <p class="font-semibold font-sans text-lg pr-2 mt-3">
          Create a New Lab Test
        </p>
        <span
          class="grid md:grid-cols-3 gap-2 text-xs font-sans border p-1 hover:shadow-md rounded-md bg-green-100/30"
        >
          <FormControl
            :type="'text'"
            variant="outline"
            placeholder="Test Name"
            v-model="new_lab[0]"
            class="col-span-2"
          />
          <Autocomplete
            :options="all_uom"
            variant="outline"
            placeholder="UOM"
            v-model="new_lab[1]"
          />
          <FormControl
            :type="'number'"
            variant="outline"
            placeholder="Min"
            v-model="new_lab[2]"
          />
          <FormControl
            :type="'number'"
            variant="outline"
            placeholder="Max"
            v-model="new_lab[3]"
          />
          <!-- <div v-if="!new_lab[0]" class="font-2xs text-red-700 col-span-2" >Add Lab Name,Dont Use "-"</div> <div class="col-span-2" v-else></div>
              <div v-if="!new_lab[1]" class="font-2xs text-red-700">Add Lab UOM</div><div v-else></div>
              <div v-if="!new_lab[2]" class="font-2xs text-red-700">Add Min Range</div><div v-else></div>
              <div v-if="!new_lab[3]" class="font-2xs text-red-700">Add Max Range</div><div v-else></div> -->
          <!-- <div class="flex items-center col-span-5">
                <Button variant="solid" @click="update_uom('new',new_lab[0],new_lab[1].label,new_lab[2],new_lab[3])" theme="green">Add New Lab</Button>
                <Button variant="subtle" class="ml-5" @click="clear_new" theme="green">Clear</Button>
              </div> -->
        </span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, watch, inject } from "vue";
import {
  Tabs,
  Switch,
  Button,
  Autocomplete,
  Badge,
  Dialog,
  FormControl,
  ErrorMessage,
} from "frappe-ui";
import { Trash2 } from "lucide-vue-next";
import { createListResource, createResource } from "frappe-ui";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import updateLocale from "dayjs/plugin/updateLocale";
import { useinteractionLibraryStore } from "@/stores/interactionLibraryStore.js";
const library = useinteractionLibraryStore();

dayjs.extend(relativeTime);
dayjs.extend(LocalizedFormat);
dayjs.extend(updateLocale);

//Declaring Variable
let lab_tests = ref([]);
let result = ref([]);
let test_array = ref([]);
let show_bytest = ref(false);
let create_result = ref(false);
let lab_result_date = ref("");
let lab_result_line = ref([]);
let all_labs = ref([]);
let all_uom = ref([]);
let error = ref("");
let cancel = ref(false);
let cancel_doc = ref("");
let make_new_lab = ref(false);
let new_lab = ref([null, null, null, null]);

const props = defineProps({
  Pat_id: String,
  App_id: String,
  Room_id: String,
  Request_from: String,
  create_new: Boolean,
});
const lab_uom = createListResource({
  doctype: "Lab Test UOM",
  fields: ["name"],
  auto: true,
  pageLength: 200,
  transform(data) {
    for (let d of data) {
      let label = d.name;
      let pt = { label: label, value: label };
      all_uom.value.push(pt);
    }
  },
});
function get_lab() {
  lab_tests = createListResource({
    doctype: "Lab Test",
    fields: [
      "name",
      "result_date",
      "`tabQuick Create Lab Results`.test_name",
      "`tabQuick Create Lab Results`.result",
      "`tabQuick Create Lab Results`.uom",
      "`tabQuick Create Lab Results`.min_normal_range",
      "`tabQuick Create Lab Results`.max_normal_range",
    ],
    filters: {
      patient: props.Pat_id,
      docstatus: 1,
    },
    pageLength: 200000,
    orderBy: "result_date asc",
    auto: true,
    transform(data) {
      result.value.splice(0);
      test_array.value.splice(0);
      for (let d of data) {
        if (d.docstatus != 2) {
          console.log("fired");
          let label = dayjs(d.result_date).format("DD/MM/YYYY");
          let test_name = d.test_name;
          if (d.test_name) {
            let arr = test_name.split("-").map(function (item) {
              return item.trim();
            });
            test_name = arr[0];
          }

          const existingDateGroup = result.value.find(
            (group) => group.label === label,
          );
          if (existingDateGroup) {
            existingDateGroup.tests.push({
              test: test_name,
              result: d.result,
              uom: d.uom,
            });
          } else {
            result.value.push({
              label: label,
              name: d.name,
              tests: [
                {
                  test: test_name,
                  result: d.result,
                  uom: d.uom,
                  min: d.min_normal_range,
                  max: d.max_normal_range,
                },
              ],
            });
          }

          const existingLabGroup = test_array.value.find(
            (group) => group.label === test_name,
          );
          if (existingLabGroup) {
            // If the group exists, push the new result into the tests array
            existingLabGroup.tests.push({
              date: label,
              result: d.result,
              uom: d.uom,
            });
            existingLabGroup.dates.push(label);
            existingLabGroup.resultss.push(d.result);
          } else {
            // If no matching group is found, create a new entry
            test_array.value.push({
              label: test_name,
              tests: [
                {
                  date: label,
                  result: d.result,
                  uom: d.uom,
                },
              ],
              dates: [label],
              resultss: [d.result],
              uom: d.uom,
              min: d.min_normal_range,
              max: d.max_normal_range,
            });
          }
        }
      }
    },
  });
}
onMounted(() => {
  get_lab();
});
function get_color() {
  let color = [
    "#00bdff",
    "#1b3bff",
    "#8F00FF",
    "#ff0011",
    "#ff7300",
    "#ffd600",
    "#00c30e",
    "#65ff00",
    "#d200ff",
    "#FF00FF",
    "#de980b",
    "#380404",
  ];
  let idx = Math.floor(Math.random() * color.length);
  let x = [];
  x.push(color[idx]);
  return x;
}
</script>
