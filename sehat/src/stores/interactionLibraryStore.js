import { defineStore } from "pinia";
import { createListResource } from "frappe-ui";
import { ref,shallowRef } from "vue";

const full_db = ref(new Map());
const sym_db = ref([]);
const sym_map = ref(new Map());
const diag_map = ref(new Map());
const diag_db = ref([]);
const lab_map = ref(new Map());
const lab_db = ref([]);
const meds_map = ref(new Map());
const meds_form_map = ref(new Map());
const med_db = ref([]);
const surg_map = ref(new Map());
const surg_db = ref([]);
const dosage_db = ref([]);
const med_dosage = ref(new Map());
const all_allergy = ref(new Map());
const allergy_db = ref([]);
const med_duration = ref(new Map());
const duration_db = ref([]);
const dosage_form = ref(new Map());
const form_db = ref([]);
const temp_form_based_meds = ref([]);

export const useinteractionLibraryStore = defineStore("library", () => {
  const symptoms = createListResource({
    doctype: "Complaint",
    fields: ["*"],
    filters: {
      disabled: false,
    },
    orderBy: "score asc",
    auto: true,
    pageLength: 500000,
    transform(data) {
      data.forEach((d) => {
        full_db.value.set(
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
        sym_db.value.push({
          label: d.complaints,
          value: d.complaints,
          description: d.complaint,
        });
      });
    },
  });
  const dosage_form_1 = createListResource({
    doctype: "Dosage Form",
    fields: ["*"],
    auto: true,
    pageLength: 2000,
    transform(data) {
      for (let d of data) {
        //full_db.value.set(d.name.trim().toLowerCase(),["Dosage",d.name ]);
        dosage_form.value.set(
          d.name
            .trim()
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]/g, ""),
          d.name,
        );
        console.log("i building all medical lexicon")
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
    auto: true,
    filters: {
      disabled: false,
    },
    orderBy: "score asc",
    pageLength: 500000,
    transform(data) {
      data.forEach((d) => {
        full_db.value.set(
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
        diag_db.value.push({
          label: d.diagnosis,
          value: d.diagnosis,
          description: d.diagnosis,
        });
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
    auto: true,
    pageLength: 500000,
    transform(data) {
      data.forEach((d) => {
        full_db.value.set(
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
        if (d.lab_test_template_type == "Single") {
          lab_db.value.push({
            label: d.lab_test_name,
            value: d.name,
            description: d.lab_test_uom,
            type: d.lab_test_template_type,
            min: d.min_normal_range,
            max: d.max_normal_range,
            uom: d.lab_test_uom,
            result: "",
          });
        }
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
    auto: true,
    pageLength: 500000,
    transform(data) {
      data.forEach((d) => {
        full_db.value.set(
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
          d.dosage_form.trim().toLowerCase() +
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
            d.manufacturer
          ],
        );
        //working to build a collection based on medicine form
        temp_form_based_meds.value.push({
          d_form: d.dosage_form.trim().toLowerCase(),
          m_brand: d.medicine_brand
            .trim()
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]/g, ""),
          f_string: [
            "Meds",
            d.name,
            d.dosage_form,
            d.generic_name,
            d.default_duration,
            d.default_dosage,
            d.special_instruction,
            d.medicine_brand,
          ],
        });
        med_db.value.push({
          label: d.dosage_form + " " + d.medicine_brand,
          value: d.name,
          description: d.generic_name,
        });
      });
    },
  });
  //console.log(temp_form_based_meds.value)
  const surg = createListResource({
    doctype: "Clinical Procedure Template",
    fields: ["*"],
    filters: {
      disabled: false,
    },
    orderBy: "score asc",
    auto: true,
    pageLength: 500000,
    transform(data) {
      data.forEach((d) => {
        full_db.value.set(
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
        surg_db.value.push({
          label: d.template,
          value: d.name,
          description: d.template,
        });
      });
    },
  });
  const dosage = createListResource({
    doctype: "Prescription Dosage",
    fields: ["*"],
    auto: true,
    pageLength: 2000,
    transform(data) {
      for (let d of data) {
        // full_db.value.set(d.dosage.trim().toLowerCase(),["dosage",d.dosage ]);
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
    auto: true,
    pageLength: 20000,
    transform(data) {
      for (let d of data) {
        full_db.value.set(
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
          full_db.value.set(
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
        allergy_db.value.push({
          label: d.name,
          value: d.name,
          description: d.name,
        });
      }
    },
  });
  const duration = createListResource({
    doctype: "Prescription Duration",
    fields: ["*"],
    auto: true,
    pageLength: 2000,
    transform(data) {
      for (let d of data) {
        // full_db.value.set(d.name.trim().toLowerCase(),["Duration",d.name ]);
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
  if (refreshing) return;
  refreshing = true;

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

  refreshing = false;
}

function reset_library() {
  // Clear all Maps
  full_db.value.clear();
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
  sym_db.value = [];
  diag_db.value = [];
  lab_db.value = [];
  med_db.value = [];
  surg_db.value = [];
  dosage_db.value = [];
  allergy_db.value = [];
  duration_db.value = [];
  form_db.value = [];
}

  return {
    full_db,
    sym_map,
    sym_db,
    diag_map,
    diag_db,
    lab_map,
    lab_db,
    meds_map,
    med_db,
    meds_form_map,
    surg_map,
    surg_db,
    med_dosage,
    dosage_db,
    all_allergy,
    allergy_db,
    med_duration,
    duration_db,
    dosage_form,
    form_db,
    temp_form_based_meds,
    refresh_library,
  };
});
