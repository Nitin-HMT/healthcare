import { ref } from "vue";
import { createListResource, createResource } from "frappe-ui";
import { useAppointmentStore } from "@/stores/appointmentStore.js";
const appointStore = useAppointmentStore();

let pay_flag = ref(false);
export function payment() {
  return { pay_flag };
}
