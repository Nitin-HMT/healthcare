import { ref } from "vue";
import { createListResource, createResource } from "frappe-ui";
import { useAppointmentStore } from "@/stores/appointmentStore.js";
const appointStore = useAppointmentStore();

let vital_flag = ref(false);
let vitals_patient = ref([]);
export function vitals() {
  // Referal Doctors
  let error_vital = ref("");
  let vital_create = ref(false);
  let Vital_load = ref(false);

  let appointments = createListResource({
    doctype: "Patient Appointment",
    fields: ["*"],
    setValue: {
      onSuccess() {
        console.log("Successfully Created");
        // all_searches_x.value.splice(0);
        // selected_vitals.value=[];
        // patDialogshown.value=false;
        // get_appoint();
      },
    },
  });

  const make_newVital = (data) => {
    let create_vitals = createResource({
      url: "healthcare.api.make_vitals",
      makeParams() {
        return {
          patient_data: data,
        };
      },
      onSuccess: (vital_id) => {
        appointments.setValue.submit({
          name: data.name,
          status: "Confirmed",
          vital_sign: vital_id,
        });
        vital_flag.value = false;
        vital_create.value = true;
        appointStore.setAppointments();
        appointStore.clearsel_app();
      },
      onError(error) {
        error_vital.value = error;
      },
    });

    create_vitals.submit();
    Vital_load.value = create_vitals.loading;
  };

  return {
    make_newVital,
    error_vital,
    vital_create,
    Vital_load,
    vital_flag,
    vitals_patient,
  };
}
