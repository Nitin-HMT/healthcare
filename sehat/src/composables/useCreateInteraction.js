import { ref } from 'vue';
import { createListResource,createResource } from 'frappe-ui';
import { useAppointmentStore } from '@/stores/appointmentStore.js';

const appointStore = useAppointmentStore()

let interaction_flag=ref(false);
let interaction_id=ref([]);
export function createInteraction() {
// Referal Doctors
let error_interaction= ref("");
let interaction_load= ref(false)

  const make_newInteraction = (flag,data,result,comments,reason,consult_time) => {
    let pat_id=data[3]
    let app_id=data[4]
    let failed_trans=!flag
    let appoint_map=appointStore.app_map;
    let appoint_full_string=appoint_map.get(app_id);
    console.log(appoint_full_string);

    let create_interaction=createResource({
    url: 'healthcare.api.make_prescripton',
    makeParams(){
        return {
          patient: pat_id,
          appoint: app_id,
          appoint_string: appoint_full_string,
          data: data,
          comment: comments,
          reason: reason,
          result:result,
          flag:failed_trans,
          time:consult_time
        }
    },
    onSuccess: (id) => {
      interaction_flag.value=false;
      interaction_id.value=id.name;
      console.log("success")
      //interaction_load.value=false;
      window.open("/app/print/Patient Encounter/"+id.name, "_blank");
      appointStore.setAppointments();
      console.log(id);
      return true;
    },
  onError(error) {
        error_interaction.value=error
         //interaction_load.value=false;
         return false;
        }  
})
    
     create_interaction.submit();
     interaction_load.value=make_newInteraction.loading;
  };

return { make_newInteraction, error_interaction,interaction_load,interaction_flag,interaction_id }
}
