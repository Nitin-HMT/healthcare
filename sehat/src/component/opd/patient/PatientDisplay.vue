<template>
  <div
    v-if="patientStore.sel_pat"
    class="p-1 pt-4 grid gap-2 space-y-2 justify-between flex-col"
  >
    <span class="flex gap-2">
      <UserRound
        class="w-5 h-6"
        :class="[
          patientStore.sel_pat.gen_abbr === 'F'
            ? 'text-pink-700'
            : 'text-blue-700',
        ]"
      />
      <p
        class="flex items-center justify-between flex-row font-sans text-lg"
        v-if="patientStore.sel_pat"
      >
        {{ patientStore.sel_pat.label }} | {{ patientStore.sel_pat.gen_abbr }} |
        {{ patientStore.sel_pat.new[3] }} yrs | <Phone class="h-4" />
        {{ patientStore.sel_pat.new[6] }}
      </p>
    </span>
  </div>
</template>

<script setup>
import { FeatherIcon } from "frappe-ui";
import { Phone, UserRound } from "lucide-vue-next";
import { usePatientStore } from "@/stores/patientStore";

const patientStore = usePatientStore();
</script>
