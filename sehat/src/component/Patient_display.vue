<template>
    <div v-if="Patient" :class="[Patient.gen_abbr === 'F' ? 'bg-pink-200/40 hover:shadow-md transition-all' :'bg-blue-200/40 hover:shadow-md transition-all']"
    class="p-3 grid md:grid-cols-6 gap-2 space-y-2 justify-between flex-col">
      <span class="flex gap-2 col-span-2">
        <FeatherIcon class="w-8 h-8" :class="[
            Patient.gen_abbr === 'F' ? 'text-pink-700' :'text-blue-700'
        ]"  name="user"/>
       <p class="font-mono font-bold underline decoration-gray-600 flex gap-4">Patient Details:</p>
        <p class="flex items-center justify-between flex-col font-sans text-lg" v-if="Patient">
          {{ Patient.label }} | {{  Patient.gen_abbr }} | {{ Patient.new[3] }} yrs</p>
      </span>
      <div v-if="appoint.name" class="flex col-span-2">
      <div  @click="payment_flag=true">
      <span v-if="appoint.name" class="flex col-span-2">
        <span class="flex gap-2 item-center justify-between flex-col">
          <div class="flex gap-3 flex-row">
          <Badge :variant="'solid'" class="bg-gradient-to-r from-orange-800 to-orange-600" size="lg" label="Free Visit" v-if="appoint.fee_valid"/>
          <Badge :variant="'solid'" class="bg-gradient-to-r from-green-600 to-green-800" size="lg" label="Paid Visit" v-if="!appoint.fee_valid"/>
        <p class="flex items-center justify-between flex-col font-sans text-lg" v-if="!appoint.fee_valid && !appoint.invoiced">
          <Badge :variant="'solid'" class="bg-gradient-to-r from-pink-800 to-pink-600" size="lg" label="Payment Pending"/>
        </p>
        <p class="flex items-center justify-between flex-col font-sans text-lg" v-if="!appoint.fee_valid && appoint.invoiced">
          <Badge :variant="'solid'" class="bg-gradient-to-r from-teal-900 to-teal-700" size="lg" label="Payment Done"/>
        </p>
     <!-- </div>
        <div class="flex gap-3 flex-row">-->
            <!--<p class="flex items-center justify-between flex-col font-sans text-lg" v-if="!appoint.fee_valid && appoint.invoiced">
              <Badge :variant="'subtle'" class="bg-gradient-to-r from-cyan-800 to-cyan-600 text-white" size="lg">{{appoint.ref_sales_invoice}}</Badge>
            </p>-->
            <p class="flex items-center justify-between flex-col font-sans text-lg" v-if="!appoint.fee_valid">
              <Badge :variant="'subtle'" class="text-white bg-gradient-to-r from-cyan-600 to-cyan-800" size="lg">{{formatCurrency(appoint.paid_amount,"INR")}}</Badge>
            </p>
        </div>
      </span>
      </span>
    </div>
      </div>
      <div v-else class="flex col-span-2"></div>
      <span class="text-sm flex items-center justify-end" v-if="appoint.ref_sales_invoice">
      <Button variant="solid" @click="printed(appoint.ref_sales_invoice)">
        <FeatherIcon class="w-4 h-4 text-white" name="printer"/>
      </Button>
      </span><span v-else></span>
      <span class="font-light text-sm flex items-center justify-end">
          <!-- <div class="text-red-800 ">{{ Patient.new[5] }} </div> -->
          <div> {{ Patient.new[6] }} </div>
          <!-- <div class="text-gray-700"> {{ Patient.name }}</div> -->
      </span>
    </div>
    
    <div v-if="appoint.name" :class="[Patient.gen_abbr === 'F' ? 'bg-pink-200/40' :'bg-blue-200/40']"
    class="px-2 flex justify-center items-center">
      <span class="flex gap-2 py-1">
        <span class="flex gap-2 item-center justify-between">
          <span class="flex font-sans font-light text-xs" v-if="all_appointment[0].vitals_ref">
          {{ all_appointment[0].Vitals[0]}}| {{all_appointment[0].Vitals[1] }}bpm | 
          SpO2 : {{ all_appointment[0].Vitals[2] }}%  | Ht: {{ all_appointment[0].Vitals[3] }}m | 
          Wt: {{ all_appointment[0].Vitals[4] }}Kg |Temp: {{ all_appointment[0].Vitals[6] }}|
          BMI: {{ all_appointment[0].Vitals[5] }}-{{ all_appointment[0].Vitals[8] }}|
          Refferring Dr: {{ all_appointment[0].refer }}
          {{ all_appointment[0].Vitals[7] }}
        </span>
      </span>
    </span>
    </div>
<Dialog v-model="payment_flag" :options="{size: '2xl'}">
      <template #body-title>
        <h3>Enter Payment Details</h3>
      </template>
      <template #body-content>
        <div>
          <div>
            <span v-if="appoint.fee_valid" class="grid grid-cols-3">
              <Switch size="sm" label="Free Visit" v-model="appoint.fee_valid"/>
              <div></div><div></div><div></div><div></div>
              <Button :variant="'solid'" @click="make_free()">Update</Button>
            </span>
            <span v-else>
              <span v-if="appoint.invoiced" class="flex flex-col justify-between items-center">
              <div class="text-base text-red-900 my-2">First the previous Payment Should be cancelled and then a new Payment Created.</div> 
                <Button :variant="'solid'" @click="cancel(appoint.ref_sales_invoice); pay_load=true;" :loading="pay_load" class="bg-gradient-to-r from-red-600 to-red-900">Cancel Previous Payment</Button>
              </span>
              <span v-else class="grid grid-cols-2 gap-4">
                <p>Consult Charges: {{formatCurrency(appoint.paid_amount ,"INR")}}</p>
                <p>Total Payable : {{formatCurrency((appoint.paid_amount-discount) ,"INR")}}</p>
                <Switch size="sm" label="Free Visit" v-model="appoint.fee_valid"/>
                <FormControl :type="'number'" size="sm"  variant="subtle" label="Discount Amount" v-model="discount"/>
                <div></div>
                <FormControl :type="'select'" :required="true" :options="[{label: 'Cash',value: 'Cash',},{label: 'UPI',value: 'UPI',},{label: 'Credit Card',value: 'Credit Card',},{label: '3rd Party',value: '3rd Party',},]" size="sm"  variant="subtle" label="Mode of Payment" v-model="appoint.mode_of_payment"/>
                <Button v-if="appoint.mode_of_payment && (appoint.paid_amount-discount)>0" :variant="'solid'" @click="make_paid(); pay_load=true;" :loading="pay_load" class="bg-gradient-to-r from-green-600 to-green-900">Make Invoice & Payment</Button>
                <Button :variant="'subtle'" @click="clear">Clear</Button>
              </span>
            </span>
          </div>
        </div>
      </template>
</Dialog>
<!-- {{ appoint.name }} {{all_appointment}} -->
  </template>
  
  <script setup>
  import { reactive, ref, computed, watch,inject } from 'vue';
  import { FeatherIcon,createListResource,Badge,Dialog,Switch,FormControl,createResource } from 'frappe-ui';
  import {formatCurrency} from "@/utils.js";

  defineProps({
    Patient: Object,
  });
  let sel_pat=inject("patient");
  let appoint = ref("");
  appoint.value=sel_pat.appoint;
  let all_appointment= ref([]);
  let payment_flag=ref(false);
  let discount= ref(0.00); 
  let pay_load=ref(false)
  let all_appoint=createListResource({
  doctype: "Patient Appointment",
  fields: ["*"],
  setValue: {
        onSuccess() {
          console.log("Im an ndkjnd")
          make_invoice()
        },
    },
})

function get_appnt(patient_x){
  if(patient_x){
    //console.log(patient_x);
    all_appointment.value.splice(0)
  let appointments=createListResource({
  doctype: "Patient Appointment",
  fields: ["*"],
  filters:{
    status: ["in","Open,Confirmed,Scheduled"],
  patient: patient_x,
},
orderBy: 'modified asc',
pageLength: 1,
  auto: true,
		transform(data) {
			for (let d of data) {
				let label = d.patient_name;
				let description = d.patient_age;
				let refer = d.referring_practitioner.split("-");
        let refering_dr= refer[0]
				let pay_type = d.fee_valid;
				let vitals =[d.bp,d.pulse,d.spo2,d.height,d.weight,d.bmi,d.temperature,d.vital_sign_notes,d.nutrition_note]
				let pt = { 
							"label": label, 
							"Vitals":vitals, 
							"gender":d.patient_sex ,
							"patient_id":d.patient,
							"value": d.name , 
							"description": description, 
							"type": "Patient",
							"refer": refering_dr,
							"is_free":pay_type,
              "vitals_ref": d.vital_sign,
							"full_string": d 
						};
            all_appointment.value.push(pt);
            sel_pat.appoint=d;
            appoint.value=sel_pat.appoint;
			}
		}
	})
}
}

watch(() => sel_pat.ref_flag,
    (ref_flag) => {
    if (ref_flag) {
      appoint.value=""
      get_appnt(sel_pat.details.name)
      sel_pat.ref_flag=false   
}
}
);

  
  function make_free(){
    all_appoint.setValue.submit({
     name: appoint.value.name,
     fee_valid: appoint.value.fee_valid,
     mode_of_payment: ""
    })
    payment_flag.value=false; 
  }
  function make_paid(){
    console.log(appoint.value.mode_of_payment);
    all_appoint.setValue.submit({
     name: appoint.value.name,
     fee_valid: appoint.value.fee_valid,
     mode_of_payment: appoint.value.mode_of_payment
    })
  }
  function make_invoice(){
  if(!appoint.value.fee_valid){
    console.log("print")
    const make_invoice = createResource({
    url: 'healthcare.healthcare.doctype.patient_appointment.patient_appointment.invoice_appointment',
    makeParams(){
        return {
          appointment_name:appoint.value.name,
          discount_percentage:0,
          discount_amount:discount.value
        }
    },
    onSuccess: (data_refer) => {
    console.log("success in dr refer"+data_refer);
    all_appointment.value.splice(0);
    discount.value=0.00;
    sel_pat.ref_flag=true;
    payment_flag.value=false; 
    pay_load.value=false;   
  }   
})
make_invoice.submit();
}
}
function printed(prescription){
        window.open("/app/print/Sales Invoice/"+prescription, "_blank");
    }
function clear(){
  discount.value= 0.00;
  appoint.value.mode_of_payment=""
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
      appoint.invoiced=0;
      appoint.ref_sales_invoice=""
    //console.log("x"+data_referjj);.
    sel_pat.ref_flag=true;
    console.log("x");
    pay_load.value=false; 

  }   
})
cancel_labs.submit()
}
  </script>  