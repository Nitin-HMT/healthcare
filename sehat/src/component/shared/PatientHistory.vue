<template>
    <Button @click="pat_hit_dialog=false">Back</Button>
    {{ Pat_id }} {{App_id}} {{Request_from  }} ==={{ Room_id }}===
  <!-- <Dialog v-model="pat_hit_dialog" :options="{ size: '2xl' }">
    <template #body-title>
      <h3>Patient History & Notes</h3>
    </template>
    <template #body-content>
      <div class="grid grid-cols-2 gap-1">
        <div class="flex flex-col gap-3" v-show="!history_flag">
          <Textarea
            v-model="notes"
            label="Patient History (Hx)"
            placeholder='Enter Details as you would in any conversation(Pressing "Enter" or "," or ";" after every thought)
Whatever cant be transcribed will be corrected in next step

You can use symbols to force match (optional): 
# Continuos Medication, 
^ Pre-existing Disease, 
* Past Surgeries, 
! Allergies
"" Descriptive Comments'
            class="h-40 rounded-lg text-sm mb-6"
          />
        </div>
        <div>
          <Rating v-model="rating" v-show="false" />
          <Textarea
            v-model="pvtNotes"
            label="Pvt Notes"
            placeholder="Your Pvt Notes"
            class="h-40 rounded-lg text-sm mb-6"
          />
        </div>
        <div>
          <div
            v-if="
              result_grouped && (result_grouped.Symptoms || result_grouped.labs)
            "
            class="text-sm px-1 gap-2 pl-1 my-0.5 flex-grow text-amber-800"
          >
            The History Input Contains Symptoms and/or Labs, these will not be
            processed, please add them to Obx, Rx instead
          </div>
          <div v-if="result">
            <div v-for="item in result" v-show="!history_flag">
              <div
                class="flex flex-wrap gap-1 py-0.5 text-sm"
                v-if="
                  item.Category == 'Unknown' ||
                  (item.new &&
                    item.Category != 'Symptoms' &&
                    item.Category != 'labs')
                "
              >
                {{ item.Display
                }}<Badge
                  :variant="'outline'"
                  size="sm"
                  theme="orange"
                  @click="create_new_element(item)"
                  class="cursor-pointer"
                  >Fix</Badge
                >
              </div>
            </div>
            <NewLexicon
              :Phrase="under_operation"
              v-if="history_flag"
              class="border border-gray-900"
            />
            <Button
              v-if="history_flag"
              @click="history_flag = false"
              variant="solid"
              >Back</Button
            >
          </div>
        </div>
        <span
          class="flex flex-row item-center justify-center mt-3"
          v-show="!history_flag"
        >
          <Button
            @click="update_patient()"
            :loading="patient.get.loading"
            class="rounded-full bg-white border border-teal-800 text-teal-800"
          >
            Update Patient</Button
          ></span
        >
      </div>
    </template>

  </Dialog> -->
  <!-- {{ error }} -->
    </template>
    <script setup>
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import {
  Badge,
  FormControl,
  Button,
  Rating,
  createDocumentResource,
  Dialog,
  Textarea,
} from "frappe-ui";
import { patient_panel } from "@/composables/usePatientStore.js";
const route = useRoute();
const app_id = route.params.app_id;
const pat_id = route.params.pat_id;
const props = defineProps({
  Pat_id: String,
  App_id: String,
  Room_id: String,
  Request_from: String,
});
const { patientPanel_flag, pvtNotes, rating, pat_hit_dialog } = patient_panel();
</script>