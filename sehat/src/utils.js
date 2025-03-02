import { toast } from 'frappe-ui'
import dayjs from 'dayjs';
import { reactive, ref, computed, watch,inject,onMounted } from 'vue';
import { createListResource,createResource, ErrorMessage } from 'frappe-ui';

export function createToast(options) {
	toast({
	  position: 'bottom-right',
	  ...options,
	})
  }
  export function formatCurrency(amount,currency){
    return new Intl.NumberFormat('en-In', {style: 'currency', currency: currency}).format(amount)
}
export function dateformat(datestring, format){
	const date =dayjs(datestring).format(format);
	return date;
}

export function getAllAppointments(resultformat,patientx){
	let sel_pat=inject("patient");
	let all_appoint=[]
	let appointment = createListResource({
		doctype: "Patient Appointment",
		fields: ["*"],
		filters: {
			status: ["in","Open,Confirmed,Scheduled"],
			patient: patientx,
		},
		orderBy: 'time_of_payment asc',
		pageLength: 30,
		auto: true,
		realtime: true,
		transform(data) {
			for (let d of data) {
				let label = d.patient_name;
				let description = d.patient_age;
				let refering_dr = d.referring_practitioner;
				let pay_type = d.fee_valid;
				let vitals =[d.bp,d.pulse,d.spo2,d.height,d.weight,d.bmi,d.temperature,d.vital_sign_notes,d.nutrition_note]
				let pt = { 
							"label": label, 
							"Vitals":vitals, 
							"gender":d.patient_sex ,
							"patient_id":d.patient,
							"value": d.name , 
							"description": description, 
							"type": "Patient",
							"refer": refering_dr,
							"is_free":pay_type,
							"full_string": d 
						};
				all_appoint.push(pt);
			}
		}
	})
	console.log("im working"+all_appoint)
	 if(resultformat=="full"){
	 	return appointment;
	 }else{
		return all_appoint;
	}
}

export function getAllPatients(resultformat){
	let sel_pat=inject("patient");
	let all_patient=[]
	let Patient_details = createListResource({
		doctype: "Patient",
		fields: ["*"],
		filters: {
			status: 'Active',
			name: sel_pat.details.name
		},
		auto: true,
		realtime:true,
		pageLength: 200000,
		transform(data) {
		for (let d of data) {
			let label = d.patient_name;
			let description = d.patient_name+" | "+d.aged+" Yrs";
			let value= label+","+d.mobile;
			let pt = { "label": label, "description": description, "value": value, "gender": d.sex,"gen_abbr": d.gen_abbr, "name":d.name, 
			"new":[d.first_name,d.middle_name,d.last_name,d.aged,d.sex,d.blood_group,d.mobile,d.email] };
			all_patient.push(pt);
		}
		}
	}); 
	if(resultformat=="full"){
		return Patient_details;
	}else{
		return all_patient;
	}
} 