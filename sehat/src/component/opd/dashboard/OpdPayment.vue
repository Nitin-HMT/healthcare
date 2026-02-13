<template>
  <div
    class="p-1 bg-gradient-to-br from-gray-50 via-white to-gray-100 rounded-md"
  >
    <div class="p-1 grid grid-cols-3 gap-2">
      <div class="flex-row col-span-2">
        <b>{{ vitals_all.patient }}</b> | {{ vitals_all.gender }} |
        {{ vitals_all.age }} yrs
      </div>
      <div class="text-xs text-gray-500 justify-self-end pr-2">
        {{ vitals_all.name }}
      </div>
      <div class="col-span-3 grid grid-cols-3 gap-2" v-if="vitals_all.pos">
        <Switch size="sm" label="Free Visit" v-model="vitals_all.pos" />
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <Button
          :variant="'solid'"
          @click="
            make_free();
            pay_load = true;
          "
          :loading="pay_load"
          >Update</Button
        >
      </div>
      <div v-else class="col-span-3">
        <span
          v-if="vitals_all.invoice"
          class="flex flex-col justify-between items-center"
        >
          <div class="text-base text-red-900 my-2">
            To change Payments, First the previous Payment Should be cancelled
            and then a new Payment Created.
          </div>
          <Button
            :variant="'solid'"
            @click="
              cancel(vitals_all.inv_id);
              pay_load = true;
            "
            :loading="pay_load"
            class="bg-gradient-to-r from-red-600 to-red-900"
            >Cancel Previous Payment</Button
          >
        </span>
        <span v-else class="grid grid-cols-2 gap-4">
          <p>Consult Charges: {{ formatCurrency(vitals_all.bill, "INR") }}</p>
          <p>
            Total Payable :
            {{ formatCurrency(vitals_all.bill - discount, "INR") }}
          </p>
          <Switch size="sm" label="Free Visit" v-model="vitals_all.pos" />
          <FormControl
            :type="'number'"
            size="sm"
            variant="subtle"
            label="Discount Amount"
            v-model="discount"
          />

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
            v-model="vitals_all.pay_mode"
          />
          <div />

          <Button
            v-if="vitals_all.pay_mode && vitals_all.bill - discount > 0"
            :variant="'solid'"
            @click="
              make_paid();
              pay_load = true;
            "
            :loading="pay_load"
            class="bg-gradient-to-r from-green-600 to-green-900"
            >Make Invoice & Payment</Button
          >
          <Button :variant="'ghost'" @click="clear">Clear</Button>
        </span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useAppointmentStore } from "@/stores/appointmentStore.js";
import { ref } from "vue";
import {
  Switch,
  Button,
  FormControl,
  createListResource,
  createResource,
} from "frappe-ui";
import { formatCurrency } from "@/utils.js";
import { payment } from "@/composables/useOpdPayment.js";
const { pay_flag } = payment();

let discount = ref(0.0);
let pay_load = ref(false);
const appointStore = useAppointmentStore();
const vitals_all = ref([]);
vitals_all.value = appointStore.sel_app;

let all_appoint = createListResource({
  doctype: "Patient Appointment",
  fields: ["*"],
  setValue: {
    onSuccess() {
      //console.log("Im an ndkjnd")
      make_invoice();
    },
  },
});

function make_free() {
  all_appoint.setValue.submit({
    name: vitals_all.value.name,
    fee_valid: vitals_all.value.pos,
    mode_of_payment: "",
  });
  pay_load.value = false;
  appointStore.setAppointments();
  appointStore.clearsel_app();
  pay_flag.value = false;
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
      appointStore.setAppointments();
      appointStore.clearsel_app();
      pay_load.value = false;
      pay_flag.value = false;
    },
  });
  cancel_labs.submit();
}
function clear() {
  discount.value = 0.0;
  vitals_all.value.pay_mode = "";
}
function make_paid() {
  //console.log(appoint.value.mode_of_payment);
  all_appoint.setValue.submit({
    name: vitals_all.value.name,
    fee_valid: vitals_all.value.pos,
    mode_of_payment: vitals_all.value.pay_mode,
  });
}

function make_invoice() {
  if (!vitals_all.value.pos) {
    //console.log("print")
    const make_invoice = createResource({
      url: "healthcare.healthcare.doctype.patient_appointment.patient_appointment.invoice_appointment",
      makeParams() {
        return {
          appointment_name: vitals_all.value.name,
          discount_percentage: 0,
          discount_amount: discount.value,
        };
      },
      onSuccess: (data_refer) => {
        //console.log("success in dr refer"+data_refer);
        discount.value = 0.0;
        pay_load.value = false;
        appointStore.setAppointments();
        appointStore.clearsel_app();
        pay_flag.value = false;
      },
    });
    make_invoice.submit();
  } else {
    pay_load.value = false;
    appointStore.setAppointments();
    appointStore.clearsel_app();
    pay_flag.value = false;
  }
}
</script>
