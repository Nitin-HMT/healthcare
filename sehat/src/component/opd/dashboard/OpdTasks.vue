<template>
  <div>
    <div class="grid grid-cols-3">Quick Tasks</div>
  </div>
  <div class="grid grid-cols-2 gap-1" v-if="!vital_flag && !pay_flag">
    <div :class="[userStore.pay_settings?'':'col-span-2']" v-if="appointStore.vitals_pending.length > 0">
      <ol
        class="rounded-xl text-sm font-medium border gap-2 py-2 my-1 bg-gradient-to-r from-teal-700/80 to-teal-700/90 text-white"
      >
        <div class="pl-3 flex gap-2 col-span-2">
          <div>Vitals</div>
        </div>
      </ol>
      <div class="pr-1.5">
        <ol
          v-for="(item, index) in appointStore.vitals_pending"
          @click="vitalsqueue(item)"
          class="text-sm border gap-2 py-2 my-1 hover:shadow-md hover:bg-gradient-to-r from-teal-200/20 to-teal-300/80 rounded-full"
        >
          <div class="pl-3 flex gap-2 col-span-2">
            <User
              class="w-4 h-4"
              :class="[
                item.gender === 'Female' ? 'text-pink-700' : 'text-blue-700',
              ]"
            />
            {{ item.label }}
          </div>
        </ol>
      </div>
    </div>
    <div class="" v-if="appointStore.payment_pending.length > 0" v-show="userStore.pay_settings">
      <ol
        class="rounded-xl grid grid-cols-2 text-sm font-medium border gap-2 py-2 my-1 bg-gradient-to-r from-teal-700/90 to-teal-700/80 text-white"
      >
        <div class="pl-3 flex gap-2 col-span-2">
          <div>Pending Payment</div>
        </div>
      </ol>
      <div class="pl-1.5">
        <ol
          v-for="(item, index) in appointStore.payment_pending"
          @click="payqueue(item)"
          class="grid grid-cols-2 text-sm border gap-2 py-2 my-1 hover:shadow-md hover:bg-gradient-to-r from-teal-200/20 to-teal-300/80 rounded-full"
        >
          <div class="pl-3 flex gap-2 col-span-1">
            <User
              class="w-4 h-4"
              :class="[
                item.gender === 'Female' ? 'text-pink-700' : 'text-blue-700',
              ]"
            />
            {{ item.patient }}
          </div>
          <div class="justify-self-end pr-2" v-if="!item.pos && !item.invoice">
            ₹ {{ item.bill }}
          </div>
        </ol>
      </div>
    </div>
    <div
      class="col-span-2"
      v-if="appointStore.payment_complete.length > 0"
      v-show="userStore.pay_settings"
    >
      <ol
        class="rounded-xl grid grid-cols-2 text-sm font-medium border gap-2 py-2 my-1 bg-gradient-to-r from-gray-700/70 from-0% to-teal-700/90 to-90% text-white"
      >
        <div
          class="pl-3 grid grid-cols-2 col-span-2"
          @click="exp_pay_hist = true"
          v-if="!exp_pay_hist"
        >
          <div>Today's Payment History</div>
          <ChevronDown class="justify-self-end pr-2 h-4 w-8" />
        </div>
        <div
          class="pl-3 grid grid-cols-2 col-span-2"
          @click="exp_pay_hist = false"
          v-if="exp_pay_hist"
        >
          <div>Today's Payment History</div>
          <ChevronUp class="justify-self-end pr-2 h-4 w-8" />
        </div>
      </ol>
      <div class="pl-1.5 grid grid-cols-2 gap-2" v-if="exp_pay_hist">
        <ol
          v-for="(item, index) in appointStore.payment_complete"
          @click="payqueue(item)"
          class="grid grid-cols-2 text-sm border gap-2 py-2 my-1 hover:shadow-md hover:bg-gradient-to-r from-teal-200/20 to-teal-300/80 rounded-full"
        >
          <div class="pl-3 flex gap-2 col-span-1">
            {{ index + 1 }}. {{ item.patient }}
            <!-- <User class="w-4 h-4" :class="[item.gender === 'Female' ? 'text-pink-700' :'text-blue-700']" /> -->
          </div>
          <div
            class="justify-self-end pr-2 text-xs text-amber-500"
            v-if="item.pos"
          >
            <i>No Charge</i>
          </div>
          <div
            class="justify-self-end pr-2 text-xs text-green-500"
            v-if="item.invoice"
          >
            ₹ {{ item.bill }}
          </div>
        </ol>
      </div>
    </div>
    <div />
    <!-- <div class="" v-if="appointStore.followup_pending.length>0">
    <ol class="rounded-xl grid grid-cols-2 text-sm font-medium border gap-2 py-2 my-1 bg-gradient-to-r from-amber-500/80 to-amber-400/80 text-white">
        <div class="pl-3 flex gap-2 col-span-2">
        <div>Follow-Up</div>
        </div>
    </ol>
    <div class="pl-1.5">
    <ol v-for="(item,index) in appointStore.followup_pending"  @click="appointqueue(item.pat_id)"
    class="grid grid-cols-2 text-sm border gap-2 py-1 my-1 hover:shadow-md hover:bg-amber-200/20 rounded-full">
        <div class="pl-3 flex gap-2 col-span-2">
        <User class="w-4 h-4" :class="[item.gender === 'Female' ? 'text-pink-700' :'text-blue-700']"/>
        {{item.patient}}
        </div>
    </ol>
    </div></div> -->
  </div>
  <div v-if="vital_flag" class="grid grid-cols-1">
    <Button
      @click="vital_flag = false"
      class="justify-self-end flex bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white transition-all"
      ><X
    /></Button>
    <Vitals />
  </div>
  <div v-if="pay_flag" class="grid grid-cols-1">
    <Button
      @click="pay_flag = false"
      class="justify-self-end flex bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white transition-all"
      ><X
    /></Button>
    <Payments />
  </div>
</template>
<script setup>
import { useAppointmentStore } from "@/stores/appointmentStore.js";
import { Button } from "frappe-ui";
import { User, X, ChevronDown, ChevronUp } from "lucide-vue-next";
import { ref } from "vue";
import Vitals from "@/component/shared/VitalsEntry.vue";
import Payments from "@/component/opd/dashboard/OpdPayment.vue";
import { vitals } from "@/composables/useVitals.js";
import { payment } from "@/composables/useOpdPayment.js";
import { useUserStore } from "@/stores/userStore";

const appointStore = useAppointmentStore();
const userStore = useUserStore();
const exp_pay_hist = ref(false);
const {
  make_newVital,
  error_vital,
  vital_create,
  Vital_load,
  vital_flag,
  vitals_patient,
} = vitals();
const { pay_flag } = payment();

function vitalsqueue(pat_id_vitals) {
  appointStore.setsel_app(pat_id_vitals);
  vitals_patient.value = pat_id_vitals;
  vital_flag.value = true;
}

function payqueue(pat_id_pay) {
  appointStore.setsel_app(pat_id_pay);
  // vitals_patient.value=pat_id_vitals;
  pay_flag.value = true;
}
</script>
