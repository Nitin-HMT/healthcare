import frappe
@frappe.whitelist()
def make_prescripton(patient,appointment,selected,extras,History):
    if not patient:
        frappe.throw("Patient Is Empty, Please Add something")
    full_app_string=appointment["full_string"]
    app_vitals=appointment["Vitals"]
    current_appointment = appointment["value"]
    cur_patient = full_app_string["patient"]
    cur_sex= full_app_string["patient_sex"]
    cur_age= full_app_string["patient_age"]
    cur_doctor= full_app_string["practitioner"]
    cur_sym=[]
    cur_diag=[]
    cur_lab=[]
    cur_proc=[]
    cur_meds=[]
    hist=[]
    for h in History:
        if h["history_type"] == "Medication":
            hist.append({"history_type":h["history_type"], "history_doctype":"OPD Medication","details":h["value"], "duration":h["since"],"comments":h["comment"] })
        if h["history_type"] == "Allergy":
            hist.append({"history_type":h["history_type"], "history_doctype":"Patient Allergy","details":h["value"], "duration":h["since"],"comments":h["comment"] })
        if h["history_type"] == "Surgical History":
            hist.append({"history_type":h["history_type"], "history_doctype":"Clinical Procedure Template","details":h["value"] ,"duration":h["since"],"comments":h["comment"] })
        if h["history_type"] == "PED":
            hist.append({"history_type":h["history_type"], "history_doctype":"Diagnosis","details":h["value"], "duration":h["since"],"comments":h["comment"] })
    for x in selected:
        if x["type"] == "Complaint":
            label=x["label"]
            notes=x["additional_attr"]
            cur_sym.append({"complaint":label, "comments": notes})
        if x["type"] == "Diagnosis":
            label=x["label"]
            notes=x["additional_attr"]
            cur_diag.append({"diagnosis":label, "lifestyle_advise": notes})
        if x["type"] == "labs":
            label=x["added"]
            #notes=x["additional_attr"]
            cur_lab.append({"lab_test_code":label})
        if x["type"] == "surg":
            label=x["added"]
            Date=x["additional_attr"]
            notes=x["additional_attr_2"]
            cur_proc.append({"procedure":label, "date":Date, "comments":notes})
        if x["type"] == "Meds":
            y=x["added"]
            label=y[0]
            form=y[1]
            dose=x["additional_attr"]
            period=x["additional_attr_2"]
            cur_meds.append({"medicine":label, "medicine_form":form, "dosage":dose, "period":period })
    refer=extras["add_referal"]
    dr_value=""
    if refer:
        dr_value=refer["name"]
    # [{name: "", qty: ""}]
    new_prescription = frappe.new_doc("Patient Encounter")
    new_prescription.appointment = current_appointment
    new_prescription.patient = cur_patient
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
    new_prescription.vital_sign_notes = app_vitals[7]
    new_prescription.further_description = extras["add_sym"]
    new_prescription.further_advice = extras["add_advise"]
    new_prescription.follow_up = extras["add_followup"]
    new_prescription.encounter_comment= extras["pvt_notes"]
    new_prescription.refer_to= dr_value
    new_prescription.set("present_complaint", cur_sym)
    new_prescription.set("diagnosis", cur_diag)
    new_prescription.set("lab_test_prescription", cur_lab)
    new_prescription.set("procedure_prescription", cur_proc)
    new_prescription.set("opd_medication", cur_meds)
    new_prescription.set("patient_history", hist)
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