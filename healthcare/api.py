import frappe
from datetime import date

@frappe.whitelist()
def make_prescripton(patient,appoint,appoint_string,data,comment,reason,result,flag,time,hist_result):
    if not patient:
        frappe.throw("Patient Is Empty, Please Add Patient")
    app_vitals=appoint_string["Vitals"]
    cur_sex= appoint_string["gender"]
    cur_age= appoint_string["age"]
    cur_doctor= appoint_string["doctor"]
    interact_notes=data[0]
    interaction_follow=data[1]
    referal_dr=data[2]
    room=data[5]
    request_page=data[6]
    interaction_hist=data[7]
    cur_sym=[]
    cur_diag=[]
    cur_lab=[]
    cur_proc=[]
    cur_meds=[]
    history_tab=[]

    if not flag:
        for x in result:
            original_phrase=x["Original"]
            q=x["Qualifier"]
            notes=""
            if len(q) > 0:
                qualifier=q[0]
                notes=qualifier["comments"]
            # notes=qualifie["comments"]
            if x["Category"] == "Symptoms":
                label=x["Functional"]
                #notes=qualifie["comments"]
                negation=x["negation"]
                cur_sym.append({"complaint":label, "comments": notes,"symptom_negated":negation,"phrase":original_phrase,"operation_string":str(x)})
            if x["Category"] == "Diagnosis":
                label=x["Functional"]
                #notes=qualifier["comments"]
                cur_diag.append({"diagnosis":label, "comments": notes,"phrase":original_phrase,"operation_string":str(x)})
            if x["Category"] == "labs":
                label=x["Functional"]
                #notes=qualifier["comments"]
                cur_lab.append({"lab_test_code":label, "lab_test_comment": notes,"phrase":original_phrase,"operation_string":str(x)})
            if x["Category"] == "surg":
                label=x["Functional"]
            # Date=x["additional_attr"]
                #notes=qualifier["comments"]
                cur_proc.append({"procedure":label, "comments": notes,"phrase":original_phrase,"operation__string":str(x)})
            if x["Category"] == "Meds":
                label=x["Functional"]
                form=qualifier["medicine_form"]
                dose=qualifier["dosage"]
                period=qualifier["period"]
                sp_notes=qualifier["comments"]
                cur_meds.append({"medicine":label, "medicine_form":form, "dosage":dose, "period":period,"comments":sp_notes,"phrase":original_phrase,"operation_string":str(x) })
        for y in hist_result:
            original_phrase=y["Original"]
            q=y["Qualifier"]
            i=y["Item"]
            notes=""
            advise=""
            if len(q) > 0:
                qualifier=q[0]
                notes=qualifier["comments"]
            if y["Category"] == "Diagnosis":
                label=y["Functional"]
                if len(i) > 2:
                    advise=i[2]
                history_tab.append({"history_type":"PED", "history_doctype": "Diagnosis","details":label, "comments": notes,"lifestyle_advise":advise,"phrase":original_phrase,"operation_string":str(y)})
            if y["Category"] == "Allergy":
                label=y["Functional"]
                history_tab.append({"history_type":"Allergy", "history_doctype": "Patient Allergy","details":label, "comments": notes,"lifestyle_advise":advise,"phrase":original_phrase,"operation_string":str(y)})
            if y["Category"] == "surg":
                label=y["Functional"]
                history_tab.append({"history_type":"Surgical History", "history_doctype": "Clinical Procedure Template","details":label, "comments": notes,"lifestyle_advise":advise,"phrase":original_phrase,"operation_string":str(y)})
            if y["Category"] == "Meds":
                label=y["Functional"]
                if len(i) > 3:
                    med_str=i[3] +" | "+ qualifier["dosage"] + " | " + qualifier["period"] +" | "+ notes
                history_tab.append({"history_type":"Medication", "history_doctype": "OPD Medication","details":label, "comments": med_str,"lifestyle_advise":advise,"phrase":original_phrase,"operation_string":str(y)})
            

    # [{name: "", qty: ""}]
    new_prescription = frappe.new_doc("Patient Encounter")
    new_prescription.appointment = appoint
    new_prescription.patient = patient
    new_prescription.patient_sex = cur_sex
    new_prescription.patient_age = cur_age
    new_prescription.practitioner= cur_doctor
    new_prescription.bp= app_vitals[0]
    new_prescription.pulse= app_vitals[1]
    new_prescription.spo2= app_vitals[2]
    new_prescription.height= app_vitals[3]
    new_prescription.weight= app_vitals[4]
    new_prescription.bmi= app_vitals[5]
    new_prescription.temperature = app_vitals[6]
    new_prescription.nutrition_note = app_vitals[8]
    new_prescription.referred_doctor = app_vitals[9]
    new_prescription.fee_valid = app_vitals[10]
    new_prescription.vital_signs_note = app_vitals[7]
    new_prescription.follow_up = interaction_follow
    new_prescription.refer_to= referal_dr
    new_prescription.stream_of_thought_input=interact_notes
    new_prescription.pat_hist_string=interaction_hist
    new_prescription.transcription_result=str(result)
    new_prescription.history_transcription_result=str(hist_result)
    new_prescription.transcription_failed=flag
    new_prescription.reason=reason
    new_prescription.consult_time=time
    if not flag:
        new_prescription.set("present_complaint", cur_sym)
        new_prescription.set("diagnosis", cur_diag)
        new_prescription.set("lab_test_prescription", cur_lab)
        new_prescription.set("procedure_prescription", cur_proc)
        new_prescription.set("opd_medication", cur_meds)
        new_prescription.set("patient_history",history_tab)
        new_prescription.further_advice = comment
    new_prescription.insert(ignore_permissions=True)
    new_prescription.submit()
    #return new_order
    return new_prescription

@frappe.whitelist()
def make_symptoms(name):
    if not name:
        frappe.throw("Symptom Name not entered")
    new_symptom = frappe.new_doc("Complaint")
    new_symptom.complaints=name
    new_symptom.insert(ignore_permissions=True)
    return new_symptom

@frappe.whitelist()
def make_diagnosis(name,desc):
    if not name:
        frappe.throw("Diagnosis Name not entered")
    new_diagnosis = frappe.new_doc("Diagnosis")
    new_diagnosis.diagnosis=name
    new_diagnosis.lifestyle_advise=desc
    new_diagnosis.insert(ignore_permissions=True)
    return new_diagnosis

@frappe.whitelist()
def make_labs(name):
    if not name:
        frappe.throw("Lab Name not entered")
    new_labs = frappe.new_doc("Lab Test Template")
    new_labs.lab_test_name=name
    new_labs.lab_test_code=name
    new_labs.department="Diagnostic"
    new_labs.insert(ignore_permissions=True)
    return new_labs

@frappe.whitelist()
def make_medicine(name,form,dosage,duration,generic,sp_inst):
    if not name:
        frappe.throw("Medicine not entered")
    new_medicine = frappe.new_doc("OPD Medication")
    new_medicine.medicine_brand=name
    new_medicine.generic_name=generic
    new_medicine.dosage_form=form
    new_medicine.default_duration=duration
    new_medicine.default_dosage=dosage
    new_medicine.special_instruction=sp_inst
    new_medicine.insert(ignore_permissions=True)
    return new_medicine

@frappe.whitelist()
def make_refer(name,desc):
    if not name:
        frappe.throw("Referal not entered")
    new_refer = frappe.new_doc("Referring Doctor")
    new_refer.doctor_name=name
    if desc:
        new_refer.more_information=desc
    new_refer.insert(ignore_permissions=True)
    return new_refer

@frappe.whitelist()
def make_allergy(name):
    if not name:
        frappe.throw("Allergy not entered")
    new_allergy = frappe.new_doc("Patient Allergy")
    new_allergy.name=name
    new_allergy.insert(ignore_permissions=True)
    return new_allergy

@frappe.whitelist()
def make_procedure(name):
    if not name:
        frappe.throw("Procedure not entered")
    new_procedure = frappe.new_doc("Clinical Procedure Template")
    new_procedure.template=name
    new_procedure.item_code=name
    new_procedure.item_group="Services"
    new_procedure.insert(ignore_permissions=True)
    return new_procedure

@frappe.whitelist()
def make_patient(ptname,new_pt):
    # selected:UMSM2400001 new_pat:[ "first", "middle", "last", "32", "Male", "O Positive", "8954615456", null ]
    if not new_pt[0] or not new_pt[3]  or not new_pt[4]  or not new_pt[6]:
        frappe.throw("Mandatory Field not entered")
    if not ptname:
    #print ("new_pt")
        new_ptr= frappe.new_doc("Patient")
        new_ptr.first_name= new_pt[0]
        new_ptr.middle_name= new_pt[1]
        new_ptr.last_name= new_pt[2]
        new_ptr.aged= int(new_pt[3])
        new_ptr.sex= new_pt[4]
        new_ptr.blood_group= new_pt[5]
        new_ptr.mobile= new_pt[6]
        new_ptr.insert(ignore_permissions=True)
        return new_ptr
    if ptname:
        exist= ptname["name"]
        new_ptr = frappe.get_doc('Patient', exist)
        new_ptr.first_name= new_pt[0]
        new_ptr.middle_name= new_pt[1]
        new_ptr.last_name= new_pt[2]
        new_ptr.aged= int(new_pt[3])
        new_ptr.sex= new_pt[4]
        new_ptr.blood_group= new_pt[5]
        new_ptr.mobile= new_pt[6]
        new_ptr.save()
        return new_ptr

@frappe.whitelist()
def update_lab_uom(op,lab,uom,min_range,max_range):
    if not lab or not uom:
        frappe.throw("Uom Update Unsuccessful, Contact Developer")
    if op == "new":
        new_labs = frappe.new_doc("Lab Test Template")
        new_labs.lab_test_name=lab
        new_labs.lab_test_code=lab
        new_labs.department="Diagnostic"
        new_labs.lab_test_uom = uom
        new_labs.min_normal_range = min_range
        new_labs.max_normal_range = max_range
        new_labs.insert(ignore_permissions=True)
        return new_labs
    else:
        lab_temp = frappe.get_doc('Lab Test Template', lab)
        lab_temp.lab_test_uom = uom
        lab_temp.min_normal_range = min_range
        lab_temp.max_normal_range = max_range
        lab_temp.save()
        return lab_temp

@frappe.whitelist()
def make_lab_results(patient,date,data_x):
    if not date or not data_x or not patient:
        frappe.throw("Lab Data Missing, Contact Developer")
    labs=[]
    for d in data_x:
        uom_x=d["uom"]
        labs.append({"test_name":d["value"], "result":d["result"],"uom":uom_x["value"]})
    lab_temp = frappe.new_doc("Lab Test")
    lab_temp.patient = patient["name"]
    lab_temp.patient_sex = patient["gender"]
    lab_temp.result_date = date
    lab_temp.set("lab_test_entry", labs)
    lab_temp.insert(ignore_permissions=True)
    lab_temp.submit()
    #return new_order
    return lab_temp

@frappe.whitelist()
def cancel_lab_result(lab):
    new_lab = frappe.get_doc('Lab Test', lab)
    new_lab.cancel()
    return new_lab

@frappe.whitelist()
def make_vitals(patient_data):
    if not patient_data:
        frappe.throw("Vitals Data Missing, Contact Developer")
    #{ "value": "Anand Kr Soni", 
    # "name": "DLM-APNT-1224-0054", 
    # "Vitals": [ "120/80 mmHg", "72", "99", "1.83", "80", "23.89", "96.5", "vfcg", "Normal", null, 1 ] }
    pt_name=patient_data["value"]
    ap_name=patient_data["name"]
    vt_array=patient_data["Vitals"]
    vitals = frappe.new_doc("Vital Signs")
    vitals.patient = pt_name
    #vitals.signs_date = date
    vitals.appointment=ap_name
    if vt_array[0].find("/"):
        x= vt_array[0].split("/")
        vitals.bp_systolic=x[0]
        vitals.bp_diastolic=x[1]
    else:
        frappe.throw("BP Format incorrect, / not found")
    vitals.bp = vt_array[0] +" mmHg"
    vitals.pulse = vt_array[1]
    vitals.spo2 = vt_array[2]
    vitals.height = vt_array[3]
    vitals.weight = vt_array[4]
    vitals.bmi = vt_array[5]
    vitals.temperature = vt_array[6]
    vitals.vital_signs_note = vt_array[7]
    vitals.nutrition_note = vt_array[8]
    vitals.insert(ignore_permissions=True)
    vitals.submit()
    #return new_order
    return vitals.name 

@frappe.whitelist()
def cancel_sales_inv(inv):
    new_lab = frappe.get_doc('Sales Invoice', inv)
    new_lab.cancel()
    return new_lab

# Under development
@frappe.whitelist()
def make_appoint(datas,patient):
    #{ "label": "Nitin Agarwal", "description": "Nitin Agarwal | 34 Yrs", 
    # "value": "Nitin Agarwal,8954615456", "gender": "Male", "gen_abbr": "M", 
    # "name": "UMSM2400001", 
    # "new": [ "Nitin Agarwal", null, null, "34", "Male", "O Positive", "8954615456", null ] }
    full_doc = datas["doctor"]
    doctor = full_doc["value"]
    item= full_doc["item"]
    charge= full_doc["charge"]
    schedule= full_doc["schedule"]
    unit= full_doc["service_unit"]
    ref_dr=""
    ref_prac = datas["ref_dr"]
    if ref_prac:
        ref_dr=ref_prac["value"]

    if not patient:
        frappe.throw("Patient Is Empty, Please Add something")
    new_appoint = frappe.new_doc("Patient Appointment")
    new_appoint.appointment_type=datas["appnt_type"]
    new_appoint.practitioner=doctor
    new_appoint.patient=patient["name"]
    new_appoint.referring_practitioner=ref_dr
    new_appoint.fee_valid=datas["appoint_type"]
    # new_appoint.appointment_datetime=date.today()
    new_appoint.billing_item=item
    new_appoint.service_unit=unit
    # new_appoint.appointment_date= date.today()
    # new_procedure.item_code=name
    # new_procedure.item_group="Services"
    new_appoint.insert(ignore_permissions=True)
    return new_appoint

@frappe.whitelist()
def get_roles(user_x):
    roles =  frappe.get_roles(user_x)
    return roles