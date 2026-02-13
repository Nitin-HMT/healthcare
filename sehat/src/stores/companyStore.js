import { defineStore } from "pinia";
import { ref } from "vue";

export const useCompanyStore = defineStore("company", () => {
  const company = ref("");

  function setCompany(value) {
    company.value = value || "";
  }

  return { company, setCompany };
});
