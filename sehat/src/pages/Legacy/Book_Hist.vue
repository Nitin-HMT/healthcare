<template>
  <div v-if="!sel_pat.details" class="mt-4 md:mx-[200px] flex item-center justify-center gap-3 p-3">
    <Badge :variant="'solid'" class=" block w-full rounded-full px-2 py-2 font-serif item-center justify-center
    bg-gradient-to-r from-red-800 to-red-600 hover:from-red-900 hover:to-red-700 text-white transition-all" size="xl" label="No Patient Selected"/>
  </div>
  <div v-else-if="!lab_tests.data.length" class="mt-4 md:mx-[200px] flex item-center justify-center gap-3 p-3">
    <Badge :variant="'solid'" class=" block w-full rounded-full px-2 py-2 font-serif item-center justify-center
    bg-gradient-to-r from-red-800 to-red-600 hover:from-red-900 hover:to-red-700 text-white transition-all" size="xl" label="No Bills"/>
  </div>
  <div v-else>
  <ListView
    class="h-[250px]"
    :columns="[
      {
        label: 'Name',
        key: 'name',
        width: '200px',
        
      },
      {
        label: 'Date',
        key: 'posting_date',
        width: '200px',
      },
      {
        label: 'Amount',
        key: 'grand_total',
        width: '100px',
      },
      {
        label: 'Status',
        key: 'status',
        width: '70px',
      },
      {
        label: 'Patient',
        key: 'patient_name',
        width: '200px',
      },
      {
        label: '',
        key: 'print',
        width: '70px',
      },
      {
        label: '',
        key: 'cancel',
        width: '50px',
      },
    ]"
    :rows="lab_tests.data"
    :options="{
      selectable: false,
      showTooltip: false,
      resizeColumn: false,
    }"
    row-key="name"
  >
    <template #cell="{ item, row, column }">
      <span>
        <Button v-if="column.key == 'print'" class="rounded-md" size="sm" :variant="'solid'" theme="gray"
        @click="printed(row.name)">
          <FeatherIcon class="w-5 h-5 text-white" name="printer"/>
        </Button>
        <Button v-else-if="column.key == 'cancel'" class="rounded-md" size="sm" :variant="'solid'" theme="red"
        @click="cancel(row.name)">
          <FeatherIcon class="w-5 h-5 text-white" name="x"/>
        </Button>
        <Badge variant="subtle" :theme="statusToColor[row.status]" v-else-if="column.key == 'status'">{{ item }}</Badge>
        <span v-if="column.key == 'grand_total'">{{ formatCurrency (row.grand_total, "INR")}}</span>
        <span class="font-xs font-light text-gray-900" v-else-if="column.key == 'name'">{{ item }}</span>
        <span class="font-xs font-light text-gray-900" v-else-if="column.key == 'posting_date'">{{ item }}</span>
        <span class="font-xs font-light text-gray-900" v-else-if="column.key == 'patient_name'">{{ item }}</span>
      </span>
    </template>

  </ListView>
</div>
  </template>
  <script setup>
  import { reactive, ref, watch, inject, onMounted } from 'vue';
  import { ListView,Badge,Button,FeatherIcon } from 'frappe-ui';
  import { createListResource,createResource } from 'frappe-ui';
  import {formatCurrency, dateformat} from "@/utils.js";
  
  //Declaring Variable
  let lab_tests=ref([]);
  let sel_pat=inject("patient");
  let result=ref([]);
  let test_array=ref([]);
  let show_bytest=ref(false);
  

  watch(() => sel_pat.details,
      (details) => {
      if (details) {
      create_lab();
      }
      else{
        result.value.splice(0);
      }
  }
  );
function create_lab(){
lab_tests = createListResource({
doctype: "Sales Invoice",
fields: ["name","posting_date","grand_total","status","patient_name"],
filters: {
patient: sel_pat.details.name,
docstatus: 1
},
pageLength: 100,
orderBy: 'posting_date desc',
auto: true,
transform(data) {
      for (let d of data) {
        d.posting_date = dateformat(d.posting_date,"DD/MM/YYYY");
        result.value.push(d);
      }
      return data
    },
});
}
onMounted(() => {
  create_lab();
})
create_lab();
function printed(prescription){
        window.open("/app/print/Sales Invoice/"+prescription, "_blank");
    }

  function cancel(sinv){
  //console.log("inside cancel"+lab_name)
  const cancel_labs = createResource({
    url: 'healthcare.api.cancel_sales_inv',
    makeParams(){
        return {
          inv:sinv,
        }
    },
    onSuccess: (data_referjj) => {
    create_lab();
    //console.log("x"+data_referjj);.
    sel_pat.ref_flag=true;
    console.log("x")

  }   
})
cancel_labs.submit()
}

const statusToColor = {
        "Cancelled": "red",
        "Unpaid": "orange",
        "Paid": "green",
        "Draft": "gray"
    }
</script>