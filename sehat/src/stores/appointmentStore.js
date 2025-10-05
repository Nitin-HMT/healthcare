import { defineStore } from 'pinia'
import { ref } from 'vue'
import { dateformat} from "@/utils.js";
import { createListResource} from 'frappe-ui'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import updateLocale from 'dayjs/plugin/updateLocale';

// dayjs config
dayjs.extend(relativeTime)
dayjs.extend(LocalizedFormat)
dayjs.extend(updateLocale)



export const useAppointmentStore = defineStore('appointments', () => {
  let appointments = ref([])
  let vitals_pending =ref([])
  let payment_pending = ref([])
  let payment_complete = ref([])
  let followup_pending = ref([])
  let appoint_stats =ref([]);
  let waittime =ref(0);
  let avg_Wait=ref(0)
  let patient_count=ref(0);
  let collection=ref(0);
  const sel_app =ref("");
  const app_map=ref(new Map());
//setting Initial Data
let lab_tests=ref([]);
  lab_tests = createListResource({
doctype: "Patient Appointment",
fields: ["*"],
filters:{
  //status: ["in","Open,Confirmed,Scheduled"],
  status: ["in","Open,Confirmed,Scheduled,Checked In,Checked Out,Closed"],
  appointment_date: dayjs().format('L LT'),
},
orderBy: 'creation asc',
auto: false,
realtime: true,
transform(data) {
  appointments.value.splice(0);
  vitals_pending.value.splice(0);
  payment_pending.value.splice(0);
  payment_complete.value.splice(0);
  followup_pending.value.splice(0);
  collection.value=0.0;
      for (let d of data) {
if(d.status=="Open"||d.status=="Confirmed"||d.status=="Scheduled"){
        patient_count.value++;
        let appoint= dayjs(d.creation);
        let now= dayjs()
        let differ = now.diff(appoint,"minute")
        waittime.value=waittime.value+differ;
        //avg_Wait.value=Math.round(waittime.value/patient_count.value)
        let vitals =[d.bp,d.pulse,d.spo2,d.height,d.weight,d.bmi,d.temperature,d.vital_sign_notes,
        d.nutrition_note,d.referring_practitioner,d.fee_valid];
        if(!d.vital_sign){
            let label = d.patient_name;
            let value= d.patient;
            
            let pt = { "label": label, "vital_record": d.vital_sign,
              "doctor": d.practitioner, "age": d.patient_age,  "value": value,
               "gender": d.patient_sex,"gen_abbr": d.patient_sex, "name":d.name, 
            "Vitals":vitals};
            //all_searches_x.value.push(pt);
            //selected_vitals.value=pt;
          vitals_pending.value.push(pt)
        }
        app_map.value.set(d.name,{ "label": d.patient_name, "vital_record": d.vital_sign,
          "doctor": d.practitioner, "age": d.patient_age,  "value": d.patient, 
          "gender": d.patient_sex,"gen_abbr": d.patient_sex, "name":d.name, 
            "Vitals":vitals});
        // if(d.fee_valid){
        //   followup_pending.value.push({pat_id: d.patient,patient: d.patient_name,invoice:d.invoiced,pos:d.fee_valid,gender: d.patient_sex})
        // }
        //d.creation = dateformat(d.creation,"DD/MM/YYYY");
        let test_name= d.practitioner;
        const existingLabGroup = appointments.value.find(group => group.label === test_name);
if (existingLabGroup) {
  // If the group exists, push the new result into the tests array
  existingLabGroup.details.push({
    pat_id: d.patient,
    patient: d.patient_name,
    gender: d.patient_sex,
    age: d.patient_age,
    status:d.status,
    opd:d.fee_valid,
    date: dayjs(d.creation).fromNow(),
    vitals:d.vital_sign,
    invoice:d.invoiced,
    appnt_id: d.name,
    invoice_no: d.ref_sales_invoice
  });
} else {
  // If no matching group is found, create a new entry
  appointments.value.push({
    label: test_name,
    details: [{
      pat_id: d.patient,
      patient: d.patient_name,
      gender: d.patient_sex,
      age: d.patient_age,
      status:d.status,
      opd:d.fee_valid,
      date: dayjs(d.creation).fromNow(),
      vitals:d.vital_sign,
      invoice:d.invoiced,
      appnt_id: d.name,
      invoice_no: d.ref_sales_invoice
    }]
  });
}
}
//Making Payments list, Will need a way to divide them somehow
if(true)
          {
            if(d.ref_sales_invoice && d.invoiced ){
              collection.value=collection.value+d.paid_amount;
            }
            let label = d.patient_name;
            let value = d.patient;
            let full_string = d;
            let name= d.name;
            let refer = d.referring_practitioner.split("-");
            let refering_dr= refer[0]
            let pt= {"label": label, "value": value, "full_string": full_string}
            // if(d.fee_valid){
            //   followup_pending.value.push({"name":name,"pat_id": d.patient,"patient": d.patient_name,
            // "invoice":d.invoiced, "pos":d.fee_valid,"gender": d.patient_sex,"bill":d.paid_amount,
            // "inv_id":d.ref_sales_invoice, "pay_mode": d.mode_of_payment, "status":d.status,"age": d.patient_age
            // })
            // }
            if(!d.fee_valid && !d.invoiced){
          payment_pending.value.push({"name":name,"pat_id": d.patient,"patient": d.patient_name,
            "invoice":d.invoiced, "pos":d.fee_valid,"gender": d.patient_sex,"bill":d.paid_amount,
            "inv_id":d.ref_sales_invoice, "pay_mode": d.mode_of_payment, "status":d.status,"age": d.patient_age, "refer": refering_dr
            })}else{
              payment_complete.value.push({"name":name,"pat_id": d.patient,"patient": d.patient_name,
            "invoice":d.invoiced, "pos":d.fee_valid,"gender": d.patient_sex,"bill":d.paid_amount,
            "inv_id":d.ref_sales_invoice, "pay_mode": d.mode_of_payment, "status":d.status,"age": d.patient_age, "refer": refering_dr
            })
            }
        }
      }
      
      // waittime.value=waittime.value+d.patient+" ";
    },
});
let prescription = createListResource({
doctype: "Patient Encounter",
fields: ["*"],
filters:{
  consult_time: [">","0"],
  docstatus:1,
},
transform(data) {
  let x=0
  let count=0
  for (let d of data) {
    let y=d.encounter_date.split(" ")
    if(y[0]==dayjs().format('YYYY-MM-DD')){
    x=x+d.consult_time;
    count++;
  }
  }
  if(x>0 && count>0){
  avg_Wait.value= Math.round(x/count);}
 // Math.round(waittime.value/patient_count.value)
}
})


lab_tests.fetch();
prescription.fetch();
appoint_stats.value=[patient_count,avg_Wait,collection]


  function setAppointments() {
    patient_count.value=0;
    waittime.value=0;
    avg_Wait.value=0;
    collection.value=0;
    lab_tests.fetch();
    prescription.fetch();
   // appointments.value.push(data)
  }

  function setsel_app(data) {
    sel_app.value=""
    sel_app.value = data || ""
    //console.log("I am firing!!!!!!")
  }
  function clearsel_app() {
    sel_app.value = ""
  }

  return { appointments, setAppointments,vitals_pending,payment_pending,payment_complete,followup_pending,appoint_stats,clearsel_app,setsel_app,sel_app,app_map }
})
