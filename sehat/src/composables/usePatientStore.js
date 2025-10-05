import { ref } from 'vue';
import { createListResource,createResource } from 'frappe-ui';
import { useAppointmentStore } from '@/stores/appointmentStore.js'
const appointStore = useAppointmentStore()

let patientPanel_flag=ref(false);
let vitals_flag=ref(true);
let pvtNotes=ref("");
let rating =ref(0);
export function patient_panel() {
return { patientPanel_flag,pvtNotes,rating,vitals_flag }
}
