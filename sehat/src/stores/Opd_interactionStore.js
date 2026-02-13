Need to store:
1. all patient medical history, as the result_grouped, which will be queried and displayed in patient panel
2. need it to hold the current prescriptions
3. need it to hold internal flags to maintain stages of consultation
4. maybe need to hold some appointment information?




// // // 📁 src/stores/patientStore.js
// import { defineStore } from "pinia";
// import { ref } from "vue";

// export const usePatientStore = defineStore("pat", () => {
//   const patients = ref([]);
//   const sel_pat = ref("");

//   function setPatients(data) {
//     patients.value.push(data);
//   }
//   function modPat(i, new_string) {
//     patients.value.splice(i, 1, new_string);
//   }
//   function setSel_pat(data) {
//     sel_pat.value = "";
//     sel_pat.value = data || "";
//     //console.log("I am firing!!!!!!")
//   }
//   function clearSel_pat() {
//     sel_pat.value = "";
//   }

//   return { patients, setPatients, setSel_pat, sel_pat, clearSel_pat, modPat };
// });

// // import { defineStore } from 'pinia'
// // // import { ref } from 'vue'

// // export const usePatientStore = defineStore('patient', {
// //   state: () => ({
// //     patients: [],
// //     selectedPatient: null,
// //   }),
// //   actions: {
// //     setPatients(patients) {
// //       this.patients = patients
// //     },
// //     setSelectedPatient(patient) {
// //       this.selectedPatient = patient
// //     },
// //     clearSelectedPatient() {
// //       this.selectedPatient = null
// //     }
// //   }
// // })
