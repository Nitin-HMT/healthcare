import { ref } from 'vue';
import { createListResource,createResource } from 'frappe-ui';
import { useAppointmentStore } from '@/stores/appointmentStore.js'
const appointStore = useAppointmentStore()

let appoint_flag=ref(false);
export function appoint() {
    // Healthcare Practitioners
  let healthcare_pr= ref([]);
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

// Referal Doctors
let error_appoint= ref("");
let appoint_create= ref(false);
let appoint_load= ref(false)
let appoint_cancel_load= ref(false)


  const make_newAppoint = (data, patient) => {
    
    const make_apppoint = createResource({
    url: 'healthcare.api.make_appoint',
    makeParams(){
        return {
            datas: data,
            patient: patient
        }
    },
    onSuccess: (data_refer) => {
      appoint_create.value=true
      appointStore.setAppointments();
  },
  onError(error) {
        error_appoint.value=error
        },   
})
    make_apppoint.submit();
    appoint_load.value=make_apppoint.loading;
    
  };

const cancel_appoint = (appoint_rec) => {
  const cancel_appoint_x = createResource({
    url: 'healthcare.healthcare.doctype.patient_appointment.patient_appointment.update_status',
    makeParams(){
        return {
          appointment_id: appoint_rec,
          status: 'Cancelled'
        }
    },
    onSuccess: (data_refer) => {
      console.log("Cancelled Successfully")
      appointStore.setAppointments();
      appoint_cancel_load.value= false;
  }   
})
cancel_appoint_x.submit();
appoint_cancel_load.value = cancel_appoint_x.loading
}


return { healthcare_pr, make_newAppoint,cancel_appoint,appoint_cancel_load, error_appoint,appoint_create,appoint_load,appoint_flag }
}
