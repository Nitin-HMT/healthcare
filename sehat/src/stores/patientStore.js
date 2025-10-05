// // 📁 src/stores/patientStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePatientStore = defineStore('pat', () => {
  const patients = ref([])
  const sel_pat =ref("")

  function setPatients(data) {
    patients.value.push(data)
  }
  function modPat(i,new_string){
    patients.value.splice(i,1,new_string)
  }
  function setSel_pat(data) {
    sel_pat.value=""
    sel_pat.value = data || ""
    //console.log("I am firing!!!!!!")
  }
  function clearSel_pat() {
    sel_pat.value = ""
  }

  return { patients, setPatients,setSel_pat,sel_pat,clearSel_pat,modPat }
})


// import { defineStore } from 'pinia'
// // import { ref } from 'vue'

// export const usePatientStore = defineStore('patient', {
//   state: () => ({
//     patients: [],
//     selectedPatient: null,
//   }),
//   actions: {
//     setPatients(patients) {
//       this.patients = patients
//     },
//     setSelectedPatient(patient) {
//       this.selectedPatient = patient
//     },
//     clearSelectedPatient() {
//       this.selectedPatient = null
//     }
//   }
// })
