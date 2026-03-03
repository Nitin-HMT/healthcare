import { defineStore } from "pinia";
import { createListResource } from "frappe-ui";
import { ref,shallowRef } from "vue";

const full_map = ref(new Map());
const sym_map = ref(new Map());
const diag_map = ref(new Map());
const lab_map = ref(new Map());
const meds_map = ref(new Map());
const meds_form_map = ref(new Map());
const surg_map = ref(new Map());
const dosage_db = ref([]);
const med_dosage = ref(new Map());
const all_allergy = ref(new Map());
const med_duration = ref(new Map());
const duration_db = ref([]);
const dosage_form = ref(new Map());
const form_db = ref([]);
const loading_library=ref(false);

export const useinteractionLibraryStore = defineStore("library", () => {
  const symptoms = createListResource({
    doctype: "Complaint",
    fields: ["*"],
    filters: {
      disabled: false,
    },
    orderBy: "score asc",
   // auto: true,
    pageLength: 1000,
    transform(data) {
      data.forEach((d) => {
        full_map.value.set(
          d.complaints
            .trim()
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]/g, ""),
          ["Symptoms", d.complaints],
        );
        sym_map.value.set(
          d.complaints
            .trim()
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]/g, ""),
          ["Symptoms", d.complaints],
        );
      });
    },
  });
  const dosage_form_1 = createListResource({
    doctype: "Dosage Form",
    fields: ["*"],
    // auto: true,
    pageLength: 2000,
    transform(data) {
      for (let d of data) {
        dosage_form.value.set(
          d.name
            .trim()
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]/g, ""),
          d.name,
        );
        form_db.value.push({
          label: d.name,
          value: d.name,
          description: d.name,
        });
      }
    },
  });
  const diagnosis = createListResource({
    doctype: "Diagnosis",
    fields: ["*"],
   // auto: true,
    filters: {
      disabled: false,
    },
    orderBy: "score asc",
    pageLength: 1000,
    transform(data) {
      data.forEach((d) => {
        full_map.value.set(
          d.diagnosis
            .trim()
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]/g, ""),
          ["Diagnosis", d.diagnosis, d.lifestyle_advise,d.diagnosis],
        );
        diag_map.value.set(
          d.diagnosis
            .trim()
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]/g, ""),
          ["Diagnosis", d.diagnosis, d.lifestyle_advise,d.diagnosis],
        );
      });
    },
  });
  const labs = createListResource({
    doctype: "Lab Test Template",
    fields: ["*"],
    filters: {
      disabled: false,
    },
    orderBy: "score asc",
   // auto: true,
    pageLength: 1000,
    transform(data) {
      data.forEach((d) => {
        full_map.value.set(
          d.lab_test_name
            .trim()
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]/g, ""),
          ["labs", d.name, d.lab_test_name],
        );
        lab_map.value.set(
          d.lab_test_name
            .trim()
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]/g, ""),
          ["labs", d.name, d.lab_test_name],
        );
      });
    },
  });
  const medicine = createListResource({
    doctype: "OPD Medication",
    fields: ["*"],
    filters: {
      disabled: false,
    },
    orderBy: "score desc",
   // auto: true,
    pageLength: 50000,
    transform(data) {
      data.forEach((d, index, array) => {
        full_map.value.set(
          d.medicine_brand
            .trim()
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]/g, ""),
          [
            "Meds",
            d.name,
            d.dosage_form,
            d.generic_name,
            d.default_duration,
            d.default_dosage,
            d.special_instruction,
            d.medicine_brand,
          ],
        );
        meds_map.value.set(
          d.medicine_brand
            .trim()
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]/g, ""),
          [
            "Meds",
            d.name,
            d.dosage_form,
            d.generic_name,
            d.default_duration,
            d.default_dosage,
            d.special_instruction,
            d.medicine_brand,
          ],
        );
        meds_form_map.value.set(
            d.medicine_brand
              .trim()
              .toLowerCase()
              .replace(/[^a-zA-Z0-9]/g, "")+
              d.dosage_form.trim().toLowerCase(),
          [
            "Meds",
            d.name,
            d.dosage_form,
            d.generic_name,
            d.default_duration,
            d.default_dosage,
            d.special_instruction,
            d.medicine_brand,
            
          ],
        );

        if (index === array.length - 1) {
        console.log("Last element count: "+index);
        loading_library.value=false;
    }
      });
    },
  });
  const surg = createListResource({
    doctype: "Clinical Procedure Template",
    fields: ["*"],
    filters: {
      disabled: false,
    },
    orderBy: "score asc",
   // auto: true,
    pageLength: 500000,
    transform(data) {
      data.forEach((d) => {
        full_map.value.set(
          d.template
            .trim()
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]/g, ""),
          ["surg", d.name, d.template],
        );
        surg_map.value.set(
          d.template
            .trim()
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]/g, ""),
          ["surg", d.name, d.template],
        );
      });
    },
  });
  const dosage = createListResource({
    doctype: "Prescription Dosage",
    fields: ["*"],
   // auto: true,
    pageLength: 2000,
    transform(data) {
      for (let d of data) {
        med_dosage.value.set(
          d.dosage
            .trim()
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]/g, ""),
          d.dosage,
        );
        dosage_db.value.push({
          label: d.dosage,
          value: d.dosage,
          description: d.dosage,
        });
      }
    },
  });
  const allergy = createListResource({
    doctype: "Patient Allergy",
    fields: ["*"],
    filters: {
      disabled: false,
    },
    orderBy: "score asc",
  //  auto: true,
    pageLength: 20000,
    transform(data) {
      for (let d of data) {
        full_map.value.set(
          d.name
            .trim()
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]/g, ""),
          ["Allergy", d.name],
        );
        all_allergy.value.set(
          d.name
            .trim()
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]/g, ""),
          ["Allergy", d.name],
        );
        if (d.name.toLowerCase().includes("allergy")) {
          full_map.value.set(
            d.name
              .trim()
              .toLowerCase()
              .replace("allergy", "")
              .replace(/[^a-zA-Z0-9]/g, "")
              .trim(),
            ["Allergy", d.name],
          );
          all_allergy.value.set(
            d.name
              .trim()
              .toLowerCase()
              .replace("allergy", "")
              .replace(/[^a-zA-Z0-9]/g, "")
              .trim(),
            ["Allergy", d.name],
          );
        }
      }
    },
  });
  const duration = createListResource({
    doctype: "Prescription Duration",
    fields: ["*"],
  //  auto: true,
    pageLength: 2000,
    transform(data) {
      for (let d of data) {
        med_duration.value.set(
          d.name
            .trim()
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]/g, ""),
          d.name,
        );
        duration_db.value.push({
          label: d.name,
          value: d.name,
          description: d.name,
        });
      }
    },
  });

let refreshing = false;

async function refresh_library() {
  if (refreshing){
    return
  }else{
    refreshing =true;
    loading_library.value=true;
      reset_library();
  await Promise.all([
    symptoms.fetch(),
    dosage_form_1.fetch(),
    diagnosis.fetch(),
    labs.fetch(),
    medicine.fetch(),
    surg.fetch(),
    dosage.fetch(),
    allergy.fetch(),
    duration.fetch(),
  ]);
}
refreshing = false;


}

function reset_library() {
  // Clear all Maps
  full_map.value.clear();
  sym_map.value.clear();
  diag_map.value.clear();
  lab_map.value.clear();
  meds_map.value.clear();
  meds_form_map.value.clear();
  surg_map.value.clear();
  med_dosage.value.clear();
  all_allergy.value.clear();
  med_duration.value.clear();
  dosage_form.value.clear();

  // Reset all reactive arrays
  dosage_db.value = [];
  duration_db.value = [];
  form_db.value = [];
}

  return {
    full_map,
    sym_map,
    diag_map,
    lab_map,
    meds_map,
    meds_form_map,
    surg_map,
    med_dosage,
    dosage_db,
    all_allergy,
    med_duration,
    duration_db,
    dosage_form,
    form_db,
    refresh_library,
    loading_library,
  };
});
