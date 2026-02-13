import { ref } from "vue";
import { createResource } from "frappe-ui";
import { useAppointmentStore } from "@/stores/appointmentStore.js";

const appointStore = useAppointmentStore();

let interaction_flag = ref(false);
let interaction_id = ref([]);

export function createInteraction() {
  let error_interaction = ref("");
  let interaction_load = ref(false);

  const make_newInteraction = async (
    flag,
    data,
    result,
    comments,
    reason,
    consult_time,
  ) => {

    return new Promise((resolve, reject) => {
      let pat_id = data[3];
      let app_id = data[4];
      let failed_trans = !flag;

      let appoint_map = appointStore.app_map;
      let appoint_full_string = appoint_map.get(app_id);

      const create_interaction = createResource({
        url: "healthcare.api.make_prescripton",

        makeParams() {
          return {
            patient: pat_id,
            appoint: app_id,
            appoint_string: appoint_full_string,
            data: data,
            comment: comments,
            reason: reason,
            result: result,
            flag: failed_trans,
            time: consult_time,
          };
        },

        onSuccess: (id) => {
          interaction_load.value = false;
          interaction_id.value = id.name;

          appointStore.setAppointments();

          resolve(true); // 🔑 resolves promise
        },

        onError(error) {
          error_interaction.value = error;
          interaction_load.value = false;
          resolve(false); // 🔑 rejects promise
        },
      });

      interaction_load.value = true;

      create_interaction.submit();
    });
  };

  return {
    make_newInteraction,
    error_interaction,
    interaction_load,
    interaction_flag,
    interaction_id,
  };
}
