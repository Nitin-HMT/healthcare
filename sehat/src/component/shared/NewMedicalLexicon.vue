<template>
  <div class="grid grid-cols-4 gap-3 capitalize">
    <div class="text-md font-semibold pb-1 col-span-1">
      {{ props.Phrase.Name }}
    </div>

    <TabButtons
      :buttons="[
        { label: 'Symptoms', value: 'Symptoms' },
        { label: 'Diagnosis', value: 'Diagnosis' },
        { label: 'Lab Test', value: 'labs' },
        { label: 'Medicine', value: 'Meds' },
        { label: 'Therapy/Procedure', value: 'surg' },
        { label: 'Allergy', value: 'Allergy' },
      ]"
      v-model="props.Phrase.Category"
      class="col-span-3"
    />
    <div />
    <FormControl
      :type="'text'"
      label="Name"
      required="true"
      size="sm"
      variant="subtle"
      placeholder="Name"
      v-model="props.Phrase.Name"
      class="col-span-3"
    />
    <!-- v-if="props.Phrase.Category=='Meds'" -->

    <!-- <FormControl type="select" class="col-span-1"
    :options="[
      {label: 'Symptoms',value: 'Symptoms',},
      {label: 'Diagnosis',value: 'Diagnosis',},
      {label: 'Lab Test',value: 'labs',},
      {label: 'Medicine',value: 'Meds',},
      {label: 'Therapy/Procedure',value: 'surg',},
      {label: 'Allergy',value: 'Allergy',},
    ]"
    size="sm"
    variant="subtle"
    label="Type"
    required="true"
    v-model="props.Phrase.Category"
  /> -->
    <div class="" />
    <FormControl
      :type="'autocomplete'"
      :options="library.form_db"
      label="Form"
      required="true"
      v-if="props.Phrase.Category == 'Meds'"
      size="sm"
      variant="outline"
      placeholder="Form"
      v-model="props.Phrase.med_panel[0]"
    />
    <!-- <FormControl type="text" size="sm" variant="subtle" placeholder="Name" label="Name" required="true" v-model="props.Phrase.Name"/> -->
    <FormControl
      type="textarea"
      v-if="props.Phrase.Category == 'Diagnosis'"
      size="sm"
      variant="subtle"
      placeholder="lifestyle advise"
      v-model="props.Phrase.Life_sty"
    />
    <FormControl
      type="autocomplete"
      v-if="props.Phrase.Category == 'labs'"
      :options="[
        {
          label: 'UnCategorised/No Result',
          value: 'No Result',
          description: 'Unassigned',
        },
        { label: 'Quantative', value: 'Single', description: 'eg. Hb' },
        {
          label: 'Descriptive',
          value: 'Descriptive',
          description: 'eg. USG/X-Ray',
        },
        { label: 'Panel/Grouped', value: 'Grouped', description: 'eg. cbc' },
      ]"
      size="sm"
      variant="subtle"
      placeholder="Type of Test"
      label="Type"
      v-model="props.Phrase.lab_type"
    />
    <FormControl
      type="textarea"
      v-if="props.Phrase.Category == 'surg'"
      size="sm"
      variant="subtle"
      placeholder="General Advise about the Procedure"
      v-model="props.Phrase.surg_adv"
    />

    <FormControl
      :type="'autocomplete'"
      :options="library.dosage_db"
      label="Default Dose"
      required="true"
      v-if="props.Phrase.Category == 'Meds'"
      size="sm"
      variant="outline"
      placeholder="Dose"
      v-model="props.Phrase.med_panel[2]"
    />
    <FormControl
      :type="'autocomplete'"
      :options="library.duration_db"
      label="Default Duration"
      required="true"
      v-if="props.Phrase.Category == 'Meds'"
      size="sm"
      variant="outline"
      placeholder="Period"
      v-model="props.Phrase.med_panel[3]"
    />
    <div v-if="props.Phrase.Category == 'Meds'" />
    <FormControl
      type="text"
      size="sm"
      variant="subtle"
      v-if="props.Phrase.Category == 'Meds'"
      placeholder="Generic Name"
      v-model="props.Phrase.med_panel[1]"
    />
    <FormControl
      type="textarea"
      v-if="props.Phrase.Category == 'Meds'"
      size="sm"
      variant="subtle"
      placeholder="General Instructions (if Any)"
      v-model="props.Phrase.med_panel[4]"
    />
    <ErrorMessage
          message="Error: Lexicon Creation Error<br/>
                  You can try again by clicking 'Create New Lexicon'<br/>
                  if the error persisits, remove the new term, report the issue"
          v-if="error_lexicon.length>1"
        />
    <ErrorMessage :message="Error(error_lexicon)" />
  </div>

  <div class="text-sm capitalize py-2" v-if="props.Phrase.Category == 'Meds'">
    Fill in details such that it can be used universally for all future
    interactions, not this specific one.
  </div>
  <div class="text-sm capitalize pb-1" v-if="false">
    Any comments or qualifiers that you may have used will be picked up after
    you save this new term
  </div>

  <div class="flex items-end justify-end pr-6">
    <div v-if="props.Phrase.Category == 'Unknown'" class="text-red-800 text-xs">
      Please Select a Type
    </div>
    <Button
      @click="make_newLexicon(props.Phrase)"
      v-if="
        (props.Phrase.Category != 'Meds' &&
          props.Phrase.Category != 'Unknown') ||
        (props.Phrase.Category == 'Meds' &&
          props.Phrase.med_panel[0] &&
          props.Phrase.med_panel[2] &&
          props.Phrase.med_panel[3])
      "
      :loading="lexicon_load"
      class="rounded-full bg-white border border-teal-800 text-teal-800"
    >
      Add to Medical Lexicon
    </Button>
  </div>
</template>
<script setup>
import { reactive, ref } from "vue";
import {
  Textarea,
  Button,
  FormControl,
  Dialog,
  Badge,
  TabButtons,
  ErrorMessage,
} from "frappe-ui";
import { createLexicon } from "@/composables/useCreateLexicon.js";
import { Pencil } from "lucide-vue-next";
import { useinteractionLibraryStore } from "@/stores/interactionLibraryStore.js";
import { onMounted, onUnmounted } from 'vue';
const library = useinteractionLibraryStore();

const props = defineProps({
  Phrase: Object,
});

const {
  make_newLexicon,
  error_lexicon,
  lexicon_flag,
  lexicon_load,
  lexicon_id,
} = createLexicon();

onUnmounted(() => {
  error_lexicon.value="";
});

</script>
