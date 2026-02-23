import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const name = ref("");
  const role = ref([]);
  const avatar = ref("");
  const pay_settings = ref(false);

  function setUser(payload) {
    name.value = payload.name || "";
    role.value = payload.role || [];
    avatar.value = payload.avatar || "";
  }

  return { name, role, avatar, setUser, pay_settings };
});
