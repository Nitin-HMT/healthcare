<template>
  <div v-if="!sel_pat.details" class="mt-4 md:mx-[300px] flex item-center justify-center gap-3 p-3">
    <Badge :variant="'solid'" class=" block w-full rounded-full px-2 py-2 font-serif item-center justify-center
    bg-gradient-to-r from-red-800 to-red-600 hover:from-red-900 hover:to-red-700 text-white transition-all" size="xl" label="No Patient Selected"/>
  </div>
  <div v-else class="grid grid-cols-4 gap-5 m-4 text-sm">
    <div class="flex flex-col gap-5">
      <Autocomplete :options="healthcare_pr" v-model="data.doctor" class="block w-full rounded-full px-2 py-3 font-serif 
      bg-gray-100 border-solid border border-gray-100 hover:bg-gray-200/90 transition-all" placeholder="Appointment For">
      </Autocomplete>
      <span class="block w-full rounded-full px-2 py-3 font-mono 
      bg-gray-100 border-solid border border-gray-100 hover:bg-gray-200/90 transition-all ">{{dateformat(data.appoint,"DD/MM/YYYY HH:mm")}}</span>
      <Switch class="block w-full rounded-full py-3 font-serif 
      bg-gray-100 border-solid border border-gray-100 hover:bg-gray-200/90 transition-all  " 
      v-model="data.appoint_type" label="Free Visit" size="sm" />
    </div>
    <div class="flex flex-col gap-5">
      <FormControl type="select" :options="[{label: 'OPD Appointment', value: 'OPD Appointment',},{label: 'Labs', disabled: true,},
      {label: 'Procedure/OT', disabled: true,},]" v-model="data.appnt_type" class="block w-full rounded-full px-2 py-3 font-serif 
      bg-gray-100 border-solid border border-gray-100 hover:bg-gray-200/90 transition-all"/>
      <!-- <FormControl type="date" v-model="data.appoint" placeholder="Appointment Date & Time" class="block w-full rounded-full px-2 py-1.5 font-mono 
      bg-gray-100 border-solid border border-gray-100 hover:bg-gray-200/90 transition-all"/> -->
      <div class="grid grid-cols-4 gap-2">
      <FormControl type="select" :options="referdr" v-model="data.ref_dr" placeholder="Referred By" class="block col-span-3 w-full rounded-full px-2 py-3 font-serif 
      bg-gray-100 border-solid border border-gray-100 hover:bg-gray-200/90 transition-all"/>      
      <Button :variant="'subtle'" size="xl" label="+" class="w-full rounded-full py-2 mt-1 
      bg-gray-300 border-solid border hover:bg-gray-400 text-lg transition-all" @click="refer_dial=true"/></div>
      <span v-if="data.doctor" class="block w-full rounded-full px-2 py-3 font-mono 
      bg-gray-100 border-solid border border-gray-100 hover:bg-gray-200/90 transition-all ">{{ formatCurrency(data.doctor.charge,"INR") }}</span>
    </div>
<Dialog v-model="refer_dial">
  <template #body-title>
    <h3>Create Referal Doctor</h3>
  </template>
  <template #body-content>
    <div class="flex flex-col gap-3">
      <ErrorMessage :message="make_refer.error"/>
<FormControl v-model="data.refer[0]" type="text" label="Doctor Name" placeholder="Referred To Doctor Name" />
<FormControl v-model="data.refer[1]" type="textarea" label="More Info" placeholder="More Info eg Speciallity, Mobile No." />
</div>
  </template>
  <template #actions>
    <Button variant="solid" @click="make_refer.submit()" :loading="make_refer.loading" v-if="data.refer[0]">
      Confirm
    </Button>
    <Button variant="subtle" @click="clear" class="ml-2">
      Clear
    </Button>
  </template>
</Dialog>
    <div class="col-span-2">
      <ListView v-if="lab_tests.list.data"
    class="h-[200px]"
    :columns="[
      {
        label: '',
        key: 'fee_valid',
        width: '6px',
      },
      {
        label: '',
        key: 'name',
        width: '2px',
      },
      {
        label: 'Date',
        key: 'creation',
        width: '100px',
      },
      {
        label: 'Doctor',
        key: 'practitioner',
        width: '200px',
      },
      {
        label: 'Status',
        key: 'status',
        width: '80px',
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
      emptyState: {
        title: 'No Previous Appointments found',
        description: 'Create a new Appointment to get started'
      },
    }"
    row-key="name"
  >
    <template #cell="{ item, row, column }">
      <span>
        <Button v-if="column.key == 'cancel' && (row.status == 'Scheduled'|| row.status == 'Confirmed'|| row.status == 'Open')" class="rounded-md" size="sm" :variant="'solid'" theme="red"
        @click="cancel_appoint(row.name)"> <!--@click="printed(row.name) -->
          <FeatherIcon class="w-5 h-5 text-white" name="x"/>
        </Button>
        <Badge variant="subtle" :theme="statusToColor[row.status]" v-else-if="column.key == 'status'">{{ item }}</Badge>
        <Badge variant="solid" class="rounded-full" size="sm" :theme="statusToColor[row.fee_valid]" v-else-if="column.key == 'fee_valid'">&nbsp;</Badge>
        <span class="font-xs font-light text-gray-900" v-else-if="column.key == 'practitioner'">{{ item }}</span>
        <span class="font-xs font-light text-gray-900" v-else-if="column.key == 'creation'">{{ item }}</span>
        <span class="font-xs font-light text-gray-900" v-else></span>
      </span>
    </template>

  </ListView>
    </div>
    <Button v-if="!appoint_x && data.doctor" :variant="'subtle'" size="xl" label="Book Appointment" class="col-span-2 block w-full rounded-full px-2 py-2 font-serif item-center justify-center 
      bg-gradient-to-r from-pink-500 to-blue-600 hover:from-pink-600 hover:to-blue-700 text-white transition-all" @click="make_apppoint.submit()" :loading="make_apppoint.loading"/>
      <Button v-else :variant="'subtle'" size="lg" label="Doctor Not Selected or Appointment already exists" 
      class="col-span-2 block w-full rounded-full px-2 py-2 item-center justify-center" :disabled="true" />
   </div>
  <ErrorMessage :message="make_apppoint.error"/>
</template>
<script setup>
import { reactive, ref,watch,inject,onMounted } from 'vue';
import { Button,Autocomplete,Switch,Dialog,FormControl, Badge,DateTimePicker,FeatherIcon, ListView } from 'frappe-ui';
import { createListResource,createResource, ErrorMessage } from 'frappe-ui';
import { dateformat,formatCurrency} from "@/utils.js";
import dayjs from 'dayjs';

let sel_pat=inject("patient");
let appoint_x = ref(true);
const data= reactive({
  appnt_type: "OPD Appointment",
  doctor:"",
  ref_dr:"",
  appoint:dayjs(),
  appoint_type:false,
  refer:[]
});
let healthcare_pr= ref([]);
let referdr=ref([]);
let lab_tests=ref([]);
let result=ref([]);
let refer_dial=ref(false);

const doctors= createListResource({
        doctype: "Healthcare Practitioner",
        fields: ["practitioner_name","name","department","op_consulting_charge_item","op_consulting_charge","image","`tabPractitioner Service Unit Schedule`.schedule","`tabPractitioner Service Unit Schedule`.service_unit"],
        filters: {
            status: 'Active'
        },
        auto: true,
        pageLength: 200,
        transform(data) {
        for (let d of data) {
            let label = d.practitioner_name;
            let value = d.name;
            let dept = d.department;
            let item =d.op_consulting_charge_item;
            let charge =d.op_consulting_charge;
            let description = "₹ "+charge;
            let pt = { "label": label, "description": description, "value": value, "dept": dept, "item": item,
              "charge": charge,"schedule": d.schedule,"service_unit": d.service_unit};
            healthcare_pr.value.push(pt);
        }
        }
    });
    
const refferal = createListResource({
  doctype: "Referring Doctor",
  fields: ["*"],
  auto: true,
  pageLength: 200,
  transform(data) {
    for (let d of data) {
      let label = d.doctor_name;
      let description = d.more_information;
      let name = d.name;
      let pt = { "label": label, "name":name, "value": name, "description": description};
      referdr.value.push(pt);
    }
  }
});

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
  watch(() => sel_pat.appoint,
      (appoint) => {
      if (appoint) {
        console.log("iam de")
        appoint_x.value=true
      }
      else{
        appoint_x.value=false
      }
  }
  );
  onMounted(() => {
    if (sel_pat.appoint) {
        console.log("iam de")
        appoint_x.value=true
      }
      else{
        appoint_x.value=false
      }
})
function create_lab(){
lab_tests = createListResource({
doctype: "Patient Appointment",
fields: ["name","creation","practitioner", "fee_valid", "status"],
filters: {
patient: sel_pat.details.name,
},
orderBy: 'creation desc',
pageLength: 20,
auto: true,
transform(data) {
      for (let d of data) {
        d.creation = dateformat(d.creation,"DD/MM/YYYY");
        result.value.push(d);
      }
      return data
    },
});
}
create_lab()
const make_refer = createResource({
    url: 'healthcare.api.make_refer',
    makeParams(){
        return {
            name:data.refer[0],
            desc:data.refer[1]
        }
    },
    onSuccess: (data_refer) => {
   // data.appointment_name=data_Z.name;
    referdr.value.splice(0);
    refferal.fetch();
    data.refer=[];
    data.refer_dial=false;
    console.log("success in dr refer");  
  }   
})

function printed(prescription){
        window.open("/app/print/Patient Appointment/"+prescription, "_blank");
    }
const statusToColor = {
        "Cancelled": "red",
        "Scheduled": "blue",
        "Open":"blue",
        "0": "green",
        "Draft": "gray",
        "Confirmed": "orange",
        "Closed":"gray",
        "No Show":"red",
        "1": "red"
    }

    const make_apppoint = createResource({
    url: 'healthcare.api.make_appoint',
    makeParams(){
        return {
            datas: data,
            patient: sel_pat.details
        }
    },
    onSuccess: (data_refer) => {
      data.doctor="";
      data.ref_dr="";
      data.appoint=dayjs();
      data.appoint_type=0;
      data.refer.splice(0);
      sel_pat.appoint=data_refer;
      sel_pat.ref_flag=true;
      create_lab();
    console.log("success in dr refer"+data_refer);
    console.log("success in dr refer"+sel_pat.details); 
    console.log("success in dr refer"+sel_pat.appoint);   
  }   
})

function cancel_appoint(appoint_rec){
  const cancel_appoint = createResource({
    url: 'healthcare.healthcare.doctype.patient_appointment.patient_appointment.update_status',
    makeParams(){
        return {
          appointment_id: appoint_rec,
          status: 'Cancelled'
        }
    },
    onSuccess: (data_refer) => {
      console.log(lab_tests.list.data)
      lab_tests.value=""
      lab_tests.fetch();
      sel_pat.appoint="";
      sel_pat.ref_flag=true;
      console.log("success in dr refer"+data_refer);
  }   
})
cancel_appoint.submit();
}
function clear(){
  data.refer.splice(0)
}

</script>