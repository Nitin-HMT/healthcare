import { ref } from "vue";
import { createListResource } from "frappe-ui";
import { direct_out } from "@/composables/useInteractionNotesDirect.js";

const {
  library
} = direct_out();
let lexicon_flag = ref(false);
let history_flag = ref(false);
let lexicon_id = ref([]);
export function createLexicon() {
  let error_lexicon = ref("");
  let lexicon_load = ref(false);

  const make_newLexicon = (under_operation) => {
    return new Promise((resolve, reject) => {
      let category = under_operation.Category;
      let name = under_operation.Name;
      let life = under_operation.Life_sty;
      let lab_type = under_operation.lab_type?.value;
      let surg_adv = under_operation.surg_adv;
      let med_panel = under_operation.med_panel || [];

      let med_form = med_panel[0]?.value ?? med_panel[0];
      let generic = med_panel[1];
      let dosage = med_panel[2]?.value ?? med_panel[2];
      let duration = med_panel[3]?.value ?? med_panel[3];
      let sp_comments = med_panel[4];

      // ================= SYMPTOMS =================
      if (category === "Symptoms") {
        let symptom = createListResource({
          doctype: "Complaint",
          insert: {
            onSuccess: async (id) => {
              try {
                await library.refresh_library(); // 🔒 wait till DB is visible
                resolve(id.name); // 🎟️ DONE
                lexicon_flag.value = false;
                history_flag.value = false;
                lexicon_id.value = id.name;
              } catch (e) {
                reject(e);
              }
            },
            onError(error) {
              error_lexicon.value = error;
              reject(error);
            },
          },
        });

        symptom.insert.submit({ complaints: name });
        lexicon_load.value = symptom.list.loading;
        return;
      }

      // ================= DIAGNOSIS =================
      if (category === "Diagnosis") {
        let diagnosis = createListResource({
          doctype: "Diagnosis",
          insert: {
            onSuccess: async (id) => {
              try {
                await library.refresh_library();
                resolve(id.name);
                lexicon_flag.value = false;
                history_flag.value = false;
                lexicon_id.value = id.name;
              } catch (e) {
                reject(e);
              }
            },
            onError(error) {
              error_lexicon.value = error;
              reject(error);
            },
          },
        });

        diagnosis.insert.submit({
          diagnosis: name,
          lifestyle_advise: life,
        });
        lexicon_load.value = diagnosis.list.loading;
        return;
      }

      // ================= LABS =================
      if (category === "labs") {
        let labs = createListResource({
          doctype: "Lab Test Template",
          insert: {
            onSuccess: async (id) => {
              try {
                lexicon_flag.value = false;
                history_flag.value = false;
                lexicon_id.value = id.name;
                await library.refresh_library();
                resolve(id.name);
              } catch (e) {
                reject(e);
              }
            },
            onError(error) {
              error_lexicon.value = error;
              reject(error);
            },
          },
        });

        labs.insert.submit({
          lab_test_name: name,
          lab_test_template_type: lab_type,
          lab_test_code: name,
          lab_test_group: "Laboratory",
          lab_test_rate: 1,
          department: "Diagnostic",
        });
        lexicon_load.value = labs.list.loading;
        return;
      }

      // ================= MEDS =================
      if (category === "Meds") {
        let meds = createListResource({
          doctype: "OPD Medication",
          insert: {
            onSuccess: async (id) => {
              try {
                await library.refresh_library();
                resolve(id.name);
                lexicon_flag.value = false;
                history_flag.value = false;
                lexicon_id.value = id.name;
              } catch (e) {
                reject(e);
              }
            },
            onError(error) {
              error_lexicon.value = error;
              reject(error);
            },
          },
        });

        meds.insert.submit({
          medicine_brand: name,
          generic_name: generic,
          dosage_form: med_form,
          default_duration: duration,
          default_dosage: dosage,
          special_instruction: sp_comments,
        });
        lexicon_load.value = meds.list.loading;
        return;
      }

      // ================= PROCEDURE =================
      if (category === "surg") {
        let surg = createListResource({
          doctype: "Clinical Procedure Template",
          insert: {
            onSuccess: async (id) => {
              try {
                await library.refresh_library();
                resolve(id.name);
                lexicon_flag.value = false;
                history_flag.value = false;
                lexicon_id.value = id.name;
              } catch (e) {
                reject(e);
              }
            },
            onError(error) {
              error_lexicon.value = error;
              reject(error);
            },
          },
        });

        surg.insert.submit({
          template: name,
          item_code: name,
          item_group: "Services",
          description: surg_adv,
        });
        lexicon_load.value = surg.list.loading;
        return;
      }

      // ================= ALLERGY =================
      if (category === "Allergy") {
        let allergy = createListResource({
          doctype: "Patient Allergy",
          insert: {
            onSuccess: async (id) => {
              try {
                await library.refresh_library();
                resolve(id.name);
                lexicon_flag.value = false;
                history_flag.value = false;
                lexicon_id.value = id.name;
              } catch (e) {
                reject(e);
              }
            },
            onError(error) {
              error_lexicon.value = error;
              reject(error);
            },
          },
        });

        allergy.insert.submit({ name: name });
        lexicon_load.value = allergy.list.loading;
        return;
      }

      // Fallback (should never hit)
      reject("Unknown lexicon category");
    });
  };

  return {
    make_newLexicon,
    error_lexicon,
    lexicon_flag,
    lexicon_load,
    lexicon_id,
    history_flag,
  };
}
