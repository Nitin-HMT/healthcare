<template>
  <div>
    {{ appointStore.sel_app }}
    <h3>Enter Payment Details</h3>
    <div>
      <div>
        <span v-if="appoint.fee_valid" class="grid grid-cols-3">
          <Switch size="sm" label="Free Visit" v-model="appoint.fee_valid" />
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <Button :variant="'solid'" @click="make_free()">Update</Button>
        </span>
        <span v-else>
          <span
            v-if="appoint.invoiced"
            class="flex flex-col justify-between items-center"
          >
            <div class="text-base text-red-900 my-2">
              First the previous Payment Should be cancelled and then a new
              Payment Created.
            </div>
            <Button
              :variant="'solid'"
              @click="
                cancel(appoint.ref_sales_invoice);
                pay_load = true;
              "
              :loading="pay_load"
              class="bg-gradient-to-r from-red-600 to-red-900"
              >Cancel Previous Payment</Button
            >
          </span>
          <span v-else class="grid grid-cols-2 gap-4">
            <p>
              Consult Charges:
              {{ formatCurrency(appointStore.sel_app.bill, "INR") }}
            </p>
            <p>
              Total Payable :
              {{ formatCurrency(appointStore.sel_app.bill - discount, "INR") }}
            </p>
            <Switch size="sm" label="Free Visit" v-model="appoint.fee_valid" />
            <FormControl
              :type="'number'"
              size="sm"
              variant="subtle"
              label="Discount Amount"
              v-model="discount"
            />
            <div></div>
            <FormControl
              :type="'select'"
              :required="true"
              :options="[
                { label: 'Cash', value: 'Cash' },
                { label: 'UPI', value: 'UPI' },
                { label: 'Credit Card', value: 'Credit Card' },
                { label: '3rd Party', value: '3rd Party' },
              ]"
              size="sm"
              variant="subtle"
              label="Mode of Payment"
              v-model="appoint.mode_of_payment"
            />
            <Button :variant="'subtle'" @click="clear">Clear</Button>
            <Button
              v-if="
                appoint.mode_of_payment &&
                appointStore.sel_app.bill - discount > 0
              "
              :variant="'solid'"
              @click="
                make_paid();
                pay_load = true;
              "
              :loading="pay_load"
              class="bg-gradient-to-r from-green-600 to-green-900"
              >Make Invoice & Payment</Button
            >
          </span>
        </span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref, computed, watch, inject } from "vue";
import {
  FeatherIcon,
  createListResource,
  Badge,
  Dialog,
  Switch,
  FormControl,
  createResource,
} from "frappe-ui";
import { formatCurrency } from "@/utils.js";
import { usePatientStore } from "@/stores/patientStore";
import { useAppointmentStore } from "@/stores/appointmentStore.js";
const appointStore = useAppointmentStore();

const patientStore = usePatientStore();

const patient_x = computed(() => patientStore.currentPatient);

defineProps({
  Patient: Object,
});
let sel_pat = inject("patient");
let appoint = ref("");
appoint.value = sel_pat.appoint;
let all_appointment = ref([]);
let payment_flag = ref(false);
let discount = ref(0.0);
let pay_load = ref(false);

let all_appoint = createListResource({
  doctype: "Patient Appointment",
  fields: ["*"],
  setValue: {
    onSuccess() {
      console.log("Im an ndkjnd");
      make_invoice();
    },
  },
});

function get_appnt(patient_x) {
  if (patient_x) {
    //console.log(patient_x);
    all_appointment.value.splice(0);
    let appointments = createListResource({
      doctype: "Patient Appointment",
      fields: ["*"],
      filters: {
        status: ["in", "Open,Confirmed,Scheduled"],
        patient: patient_x,
      },
      orderBy: "modified asc",
      pageLength: 1,
      auto: true,
      transform(data) {
        for (let d of data) {
          let label = d.patient_name;
          let description = d.patient_age;
          let refer = d.referring_practitioner.split("-");
          let refering_dr = refer[0];
          let pay_type = d.fee_valid;
          let vitals = [
            d.bp,
            d.pulse,
            d.spo2,
            d.height,
            d.weight,
            d.bmi,
            d.temperature,
            d.vital_sign_notes,
            d.nutrition_note,
          ];
          let pt = {
            label: label,
            Vitals: vitals,
            gender: d.patient_sex,
            patient_id: d.patient,
            value: d.name,
            description: description,
            type: "Patient",
            refer: refering_dr,
            is_free: pay_type,
            vitals_ref: d.vital_sign,
            full_string: d,
          };
          all_appointment.value.push(pt);
          sel_pat.appoint = d;
          appoint.value = sel_pat.appoint;
        }
      },
    });
  }
}

watch(
  () => sel_pat.ref_flag,
  (ref_flag) => {
    if (ref_flag) {
      appoint.value = "";
      get_appnt(sel_pat.details.name);
      sel_pat.ref_flag = false;
    }
  },
);

function make_free() {
  all_appoint.setValue.submit({
    name: appoint.value.name,
    fee_valid: appoint.value.fee_valid,
    mode_of_payment: "",
  });
  payment_flag.value = false;
}
function make_paid() {
  console.log(appoint.value.mode_of_payment);
  all_appoint.setValue.submit({
    name: appoint.value.name,
    fee_valid: appoint.value.fee_valid,
    mode_of_payment: appoint.value.mode_of_payment,
  });
}
function make_invoice() {
  if (!appoint.value.fee_valid) {
    console.log("print");
    const make_invoice = createResource({
      url: "healthcare.healthcare.doctype.patient_appointment.patient_appointment.invoice_appointment",
      makeParams() {
        return {
          appointment_name: appoint.value.name,
          discount_percentage: 0,
          discount_amount: discount.value,
        };
      },
      onSuccess: (data_refer) => {
        console.log("success in dr refer" + data_refer);
        all_appointment.value.splice(0);
        discount.value = 0.0;
        sel_pat.ref_flag = true;
        payment_flag.value = false;
        pay_load.value = false;
      },
    });
    make_invoice.submit();
  }
}
function printed(prescription) {
  window.open("/app/print/Sales Invoice/" + prescription, "_blank");
}
function clear() {
  discount.value = 0.0;
  appoint.value.mode_of_payment = "";
}
function updatePatient() {
  sel_pat.details = "";
  sel_pat.appoint = "";
  sel_pat.ref_flag = true;
}
function cancel(sinv) {
  //console.log("inside cancel"+lab_name)
  const cancel_labs = createResource({
    url: "healthcare.api.cancel_sales_inv",
    makeParams() {
      return {
        inv: sinv,
      };
    },
    onSuccess: (data_referjj) => {
      appoint.invoiced = 0;
      appoint.ref_sales_invoice = "";
      //console.log("x"+data_referjj);.
      sel_pat.ref_flag = true;
      console.log("x");
      pay_load.value = false;
    },
  });
  cancel_labs.submit();
}
</script>
