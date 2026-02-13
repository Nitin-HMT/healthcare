// // 📁 src/stores/patientStore.js
import { defineStore } from "pinia";
import { ref } from "vue";

export const usePractitionerStore = defineStore("pract", () => {
  const doctor = ref([]);
  const sel_doctor = ref("");

  function setdoctor(data) {
    doctor.value.push(data);
  }
  function setSel_doc(data) {
    sel_doctor.value = "";
    sel_doctor.value = data || "";
    //console.log("I am firing!!!!!!")
  }
  function clearSel_doc() {
    sel_doctor.value = "";
  }

  return { doctor, setdoctor, setSel_doc, sel_doctor, clearSel_doc };
});
