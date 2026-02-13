<template>
  <div
    class="flex-grow border p-1.5 m-1 mt-2 py-4 text-sm bg-white rounded-md drop-shadow-lg"
  >
    <div class="grid grid-cols-2 gap-2" v-if="!review">
      <div class="col-span-1 space-y-2">
        <div class="text-md font-semibold">Impression & Advise</div>
        <Textarea
          placeholder='Enter Details as you would in any conversation(Pressing "Enter" or "," or ";" after every thought)
Whatever cant be transcribed will be corrected in next step

You can use symbols to force match (optional): 
@ symptoms, 
# Meds, 
$ labs, 
^ Diagnosis, 
* Procedure, 
! Allergy
"" Descriptive Comments'
          class="h-64 rounded-lg text-sm"
          @keyup.enter="interation_direct(interaction.notes)"
          @keyup.,="interation_direct(interaction.notes)"
          @keyup.;="interation_direct(interaction.notes)"
          @keyup.tab="interation_direct(interaction.notes)"
          @keyup.delete="interation_direct(interaction.notes)"
          v-model="interaction.notes"
        />
        <div class="space-y-2">
          <div class="grid grid-cols-8 gap-2">
            <FormControl
              type="autocomplete"
              :options="referdr"
              v-model="selrefdr"
              placeholder="Refer To"
              class="col-span-7 rounded-full"
            />
            <Button
              :variant="'subtle'"
              size="md"
              label="+"
              class="rounded-full bg-white border border-teal-800 text-teal-800"
              @click="refer_create = true"
            />
          </div>
          <FormControl
            :type="'number'"
            :ref_for="true"
            size="sm"
            placeholder="Follow-up (In Days)"
            v-model="interaction.follow_up"
          />
        </div>
      </div>
      <div class="col-span-1">
        <div
          class="col-span-1 space-y-1.5 tracking-wide capitalize"
          v-if="result_grouped"
        >
          <div
            class="flex flex-wrap gap-1 py-0.5"
            v-if="result_grouped.Symptoms"
          >
            <p class="font-semibold underline decoration-red-800 decoration-2">
              Symptoms:
            </p>
            <div v-for="item in result_grouped.Symptoms">
              {{ item.Display
              }}<Badge
                :variant="'outline'"
                size="sm"
                theme="green"
                @click="create_new_element(item)"
                class="cursor-pointer"
                v-if="item.new"
                >New</Badge
              >,
            </div>
          </div>
          <div
            class="flex flex-wrap gap-1 py-0.5"
            v-if="result_grouped.Diagnosis"
          >
            <p class="font-semibold underline decoration-red-600 decoration-2">
              Diagnosis:
            </p>
            <div v-for="item in result_grouped.Diagnosis">
              {{ item.Display
              }}<Badge
                :variant="'outline'"
                size="sm"
                theme="green"
                @click="create_new_element(item)"
                class="cursor-pointer"
                v-if="item.new"
                >New</Badge
              >,
            </div>
          </div>
          <div class="flex flex-wrap gap-1 py-0.5" v-if="result_grouped.labs">
            <p
              class="font-semibold underline decoration-amber-600 decoration-2"
            >
              Labs:
            </p>
            <div v-for="item in result_grouped.labs">
              {{ item.Display
              }}<Badge
                :variant="'outline'"
                size="sm"
                theme="green"
                @click="create_new_element(item)"
                class="cursor-pointer"
                v-if="item.new"
                >New</Badge
              >,
            </div>
          </div>
          <div class="flex flex-wrap gap-1 py-0.5" v-if="result_grouped.surg">
            <p class="font-semibold underline decoration-cyan-800 decoration-2">
              Procedure:
            </p>
            <div v-for="item in result_grouped.surg">
              {{ item.Display
              }}<Badge
                :variant="'outline'"
                size="sm"
                theme="green"
                @click="create_new_element(item)"
                class="cursor-pointer"
                v-if="item.new"
                >New</Badge
              >,
            </div>
          </div>
          <div class="flex flex-wrap gap-1 py-0.5" v-if="result_grouped.Meds">
            <p
              class="font-semibold underline decoration-green-700 decoration-2"
            >
              Medicine:
            </p>
            <div v-for="item in result_grouped.Meds">
              {{ item.Display
              }}<Badge
                :variant="'outline'"
                size="sm"
                theme="green"
                @click="create_new_element(item)"
                class="cursor-pointer"
                v-if="item.new"
                >New</Badge
              >,
            </div>
          </div>
          <div
            class="flex flex-wrap gap-1 py-0.5"
            v-if="result_grouped.Unknown"
          >
            <p class="font-semibold">Uncategorised:</p>
            <div v-for="item in result_grouped.Unknown">
              {{ item.Display
              }}<Badge
                :variant="'outline'"
                size="sm"
                theme="orange"
                @click="create_new_element(item)"
                class="cursor-pointer"
                >Fix</Badge
              >,
            </div>
          </div>
          <div class="flex flex-wrap gap-1 py-0.5" v-if="comments">
            <p class="font-semibold">Comments:</p>
            <div>
              {{ comments }}
            </div>
          </div>
          <div
            class="grid grid-cols-1 gap-1 py-2"
            v-if="result_grouped.Allergy"
          >
            <p class="text-sm px-1 gap-2 pl-1 my-0.5 flex-grow text-red-500">
              Allergy Terminology used, Not Processed, Please add these to
              Patient History via Patient Panel
            </p>
          </div>
        </div>

        <div
          class="m-3 flex flex-grow items-end justify-end pr-8"
          v-if="result_grouped || interaction.follow_up || selrefdr.label"
        >
          <Button
            :variant="'subtle'"
            size="md"
            label="Review"
            class="rounded-full bg-white border border-teal-800 text-teal-800"
            @click="
              interation_direct(interaction.notes);
              review = true;
              patientPanel_flag = true;
              vitals_flag = false;
            "
          />
        </div>
      </div>
    </div>
    <div
      class="flex flex-row capitalize border-2 border-dotted rounded border-gray-500 p-2"
      v-if="review"
    >
      <div>
        <div class="text-xl font-semibold pb-1">Review Interaction</div>
        <div
          class="text-sm p-1 font-medium tracking-wide bg-white text-teal-800 rounded-md pl-2"
        >
          Please Review if all your Obx & Rx have been Transcribed Correctly
        </div>
        <div
          class="col-span-1 grid grid-cols-4 gap-2 gap-x-3 tracking-wide"
          v-if="result_grouped"
        >
          <div
            class="col-span-4 grid grid-cols-8 gap-1 border border-red-600 rounded-lg pb-1"
            v-if="result_grouped.Unknown"
          >
            <p
              class="text-sm font-medium px-1 gap-2 pl-1 my-1 col-span-8 underline"
            >
              Uncategorised:
            </p>
            <div
              class="text-sm font-medium tracking-wide text-red-600 pl-2 pb-1 col-span-8"
            >
              Couldn't Transcribe these, Please Review them, Create a new
              Medical Terminology if Required
            </div>
            <div
              v-for="(item, index) in result_grouped.Unknown"
              class="flex flex-wrap gap-x-2 pt-1 pl-2 align-baseline"
            >
              <Pencil
                class="h-4 text-teal-800 cursor-pointer -mr-1"
                @click="phraseCorrection(item)"
              />
              {{ item.Functional }}
              <Badge
                :variant="'outline'"
                size="sm"
                theme="orange"
                @click="create_new_element(item)"
                class="cursor-pointer"
                >Fix</Badge
              >
            </div>
          </div>

          <div class="flex flex-col">
            Obx,
            <div
              class="grid grid-cols-1 gap-1 py-0.5"
              v-if="result_grouped.Symptoms"
            >
              <p
                class="text-sm font-medium px-1 gap-2 pl-1 my-0.5 flex-grow underline"
              >
                Symptoms & Obx:
              </p>
              <div
                v-for="(item, index) in result_grouped.Symptoms"
                class="flex gap-x-2 pt-0.5 pl-2 align-baseline"
              >
                <Pencil
                  class="h-4 text-teal-800 cursor-pointer -mr-2"
                  @click="phraseCorrection(item)"
                />
                <div v-if="item.new">
                  {{ item.Functional
                  }}<Badge
                    :variant="'outline'"
                    size="sm"
                    theme="orange"
                    @click="create_new_element(item)"
                    class="cursor-pointer"
                    >Fix</Badge
                  >
                </div>
                <div v-else class="align-baseline flex gap-x-2">
                  {{ item.Item[1] }}
                  <FormControl
                    :type="'text'"
                    disabled="true"
                    v-if="item.Qualifier[0]"
                    size="sm"
                    variant="outline"
                    placeholder="Comments"
                    v-model="item.Qualifier[0].comments"
                  />
                </div>
              </div>
            </div>
            <div
              class="grid grid-cols-1 gap-1 py-0.5"
              v-if="result_grouped.Diagnosis"
            >
              <p
                class="text-sm font-medium px-1 gap-2 pl-1 my-0.5 flex-grow underline"
              >
                Diagnosis:
              </p>
              <div
                v-for="(item, index) in result_grouped.Diagnosis"
                class="flex gap-x-2 pt-0.5 pl-2 align-baseline"
              >
                <Pencil
                  class="h-4 text-teal-800 cursor-pointer -mr-2"
                  @click="phraseCorrection(item)"
                />
                <div v-if="item.new">
                  {{ item.Functional
                  }}<Badge
                    :variant="'outline'"
                    size="sm"
                    theme="orange"
                    @click="create_new_element(item)"
                    class="cursor-pointer"
                    >Fix</Badge
                  >
                </div>
                <div v-else class="align-baseline flex gap-x-2">
                  {{ item.Item[1] }}
                  <FormControl
                    :type="'text'"
                    disabled="true"
                    v-if="item.Qualifier[0]"
                    size="sm"
                    variant="outline"
                    placeholder="Comments"
                    v-model="item.Qualifier[0].comments"
                  />
                </div>
              </div>
            </div>
            <VitalsPanel
              :Pat_id="props.Pat_id"
              :App_id="props.App_id"
              Collapse="true"
              Request_from="OPD"
            />
          </div>
          <div class="col-span-3">
            Rx,
            <div
              class="grid grid-cols-1 gap-1 py-0.5"
              v-if="result_grouped.labs"
            >
              <p
                class="text-sm font-medium px-1 gap-2 pl-1 my-0.5 flex-grow underline"
              >
                Labs:
              </p>
              <div
                v-for="(item, index) in result_grouped.labs"
                class="flex gap-x-2 pt-0.5 pl-2 align-baseline"
              >
                <Pencil
                  class="h-4 text-teal-800 cursor-pointer -mr-2"
                  @click="phraseCorrection(item)"
                />
                <div v-if="item.new">
                  {{ item.Functional
                  }}<Badge
                    :variant="'outline'"
                    size="sm"
                    theme="orange"
                    @click="create_new_element(item)"
                    class="cursor-pointer"
                    >Fix</Badge
                  >
                </div>
                <div v-else class="align-baseline flex gap-x-2">
                  {{ item.Item[2] }}
                  <FormControl
                    :type="'text'"
                    disabled="true"
                    v-if="item.Qualifier[0]"
                    size="sm"
                    variant="outline"
                    placeholder="Comments"
                    v-model="item.Qualifier[0].comments"
                  />
                </div>
              </div>
            </div>
            <div
              class="grid grid-cols-1 gap-1 py-0.5"
              v-if="result_grouped.surg"
            >
              <p
                class="text-sm font-medium px-1 gap-2 pl-1 my-0.5 flex-grow underline"
              >
                Procedure:
              </p>
              <div
                v-for="(item, index) in result_grouped.surg"
                class="flex gap-x-2 pt-0.5 pl-2 align-baseline"
              >
                <Pencil
                  class="h-4 text-teal-800 cursor-pointer -mr-2"
                  @click="phraseCorrection(item)"
                />
                <div v-if="item.new">
                  {{ item.Functional
                  }}<Badge
                    :variant="'outline'"
                    size="sm"
                    theme="orange"
                    @click="create_new_element(item)"
                    class="cursor-pointer"
                    >Fix</Badge
                  >
                </div>
                <div v-else class="align-baseline flex gap-x-2">
                  {{ item.Item[2] }}
                  <FormControl
                    :type="'text'"
                    disabled="true"
                    v-if="item.Qualifier[0]"
                    size="sm"
                    variant="outline"
                    placeholder="Comments"
                    v-model="item.Qualifier[0].comments"
                  />
                </div>
              </div>
            </div>
            <div
              class="grid grid-cols-1 gap-1 py-0.5"
              v-if="result_grouped.Meds"
            >
              <p
                class="text-sm font-medium px-1 gap-2 pl-1 my-0.5 flex-grow underline"
              >
                Medicine:
              </p>
              <div
                v-for="(item, index) in result_grouped.Meds"
                class="flex gap-x-2 pt-0.5 pl-2 align-baseline"
              >
                <Pencil
                  class="h-4 text-teal-800 cursor-pointer -mr-1"
                  @click="phraseCorrection(item)"
                />
                <div v-if="item.new">
                  {{ item.Functional
                  }}<Badge
                    :variant="'outline'"
                    size="sm"
                    theme="orange"
                    @click="create_new_element(item)"
                    class="cursor-pointer"
                    >Fix</Badge
                  >
                </div>
                <div v-else class="align-baseline grid grid-cols-6 gap-x-1">
                  <div class="col-span-2 flex gap-x-2">
                    <div v-if="item.Qualifier[0]" class="pr-0.5">
                      {{ item.Qualifier[0].medicine_form }}
                    </div>
                    {{ item.Item[7] }}
                  </div>
                  <FormControl
                    :type="'text'"
                    disabled="true"
                    :options="library.dosage_db"
                    v-if="item.Qualifier[0]"
                    size="sm"
                    variant="outline"
                    placeholder="Dose"
                    v-model="item.Qualifier[0].dosage"
                  />
                  <FormControl
                    :type="'text'"
                    disabled="true"
                    :options="library.duration_db"
                    v-if="item.Qualifier[0]"
                    size="sm"
                    variant="outline"
                    placeholder="Period"
                    v-model="item.Qualifier[0].period"
                  />
                  <FormControl
                    :type="'text'"
                    class="col-span-2 flex"
                    disabled="true"
                    v-if="item.Qualifier[0]"
                    size="sm"
                    variant="outline"
                    placeholder="Comments"
                    v-model="item.Qualifier[0].comments"
                  />
                </div>
              </div>
            </div>
            <div
              class="grid grid-cols-1 gap-1 py-2"
              v-if="result_grouped.Allergy"
            >
              <p
                class="text-sm px-1 gap-2 pl-1 my-0.5 flex-grow text-amber-500"
              >
                Allergy Terminology used, Not Processed, Please add these to
                Patient History via Patient Panel
              </p>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-4 gap-1 py-0.5">
          <div />
          <div class="col-span-3">
            <p
              class="text-sm font-medium px-1 gap-2 pl-1 my-1 flex-grow underline"
              v-if="comments || interaction.follow_up || selrefdr.label"
            >
              More Information:
            </p>
            <div class="flex flex-col gap-1 pt-1 pl-2 align-baseline">
              <div v-if="comments" class="flex">
                <b>Comments:</b> {{ comments }}
              </div>
              <div v-if="interaction.follow_up">
                <b>Follow Up</b>: {{ interaction.follow_up }} days
              </div>
              <div v-if="selrefdr.label">
                <b>Reffered To:</b> {{ selrefdr.label }}
              </div>
            </div>
          </div>
        </div>
        <div class="m-3 flex flex-grow items-end justify-end pr-8 gap-x-2">
          <!-- <div class="py-2 text-sm grid grid-cols-1">{{interaction.notes}}</div> -->
          <Button
            :variant="'subtle'"
            size="md"
            label="Back"
            class="rounded-full bg-white border border-teal-800 text-teal-800"
            @click="
              review = false;
              patientPanel_flag = false;
              vitals_flag = true;
            "
          />
          <Button
            :variant="'subtle'"
            size="md"
            label="Submit"
            v-if="!stop_submit"
            class="rounded-full bg-teal-800 border border-white text-white hover:text-teal-800 hover:border-teal-800 hover:bg-white"
            @click="(time_differnce(start_time), (interaction_flag = true))"
          />
          <Badge
            v-else
            label="Unrecognised Terms, Please Fix to Submit"
            disabled="true"
            :theme="'red'"
          />
        </div>
      </div>
    </div>
  </div>
  <!-- Dialog to create a new reffering doctor/ department-->
  <Dialog v-model="refer_create">
    <template #body-title>
      <h3>Create Referal Doctor</h3>
    </template>
    <template #body-content>
      <div class="flex flex-col gap-3">
        <ErrorMessage :message="error_ref" />
        <FormControl
          v-model="refer_new.refer[0]"
          type="text"
          label="Doctor Name"
          placeholder="Referred To Doctor Name"
        />
        <FormControl
          v-model="refer_new.refer[1]"
          type="textarea"
          label="More Info"
          placeholder="More Info eg Speciallity, Mobile No."
        />
      </div>
    </template>
    <template #actions>
      <Button
        @click="make_newRef(refer_new.refer[0], refer_new.refer[1])"
        v-if="refer_new.refer[0]"
        class="rounded-full bg-white border border-teal-800 text-teal-800"
      >
        Confirm
      </Button>
    </template>
  </Dialog>

  <Dialog v-model="correction">
    <template #body-title>
      <h3>Edit Phrase</h3>
    </template>
    <template #body-content>
      <div class="flex flex-col gap-3">
        <FormControl
          v-model="under_operation.correction"
          type="textarea"
          label="Phrase Correction"
        />
      </div>
    </template>
    <template #actions>
      <Button
        @click="correct_phrase()"
        class="rounded-full bg-white border border-teal-800 text-teal-800 mr-1"
      >
        Confirm
      </Button>
      <Button
        @click="remove_phrase()"
        class="rounded-full bg-white border border-red-800 text-red-800 mr-1"
      >
        Delete
      </Button>
      <Button
        @click="
          correction = false;
          under_operation.original = '';
          under_operation.correction = '';
        "
        class="rounded-full bg-white border border-teal-800 text-teal-800 mr-1"
      >
        Close
      </Button>
    </template>
  </Dialog>

  <Dialog v-model="lexicon_flag" :options="{ size: '4xl' }">
    <template #body-title>
      <h3 class="text-lg font-semibold pb-1">Add to Medical Lexicon</h3>
    </template>
    <template #body-content>
      <NewLexicon :Phrase="under_operation" />
    </template>
  </Dialog>

  <Dialog v-model="interaction_flag" :options="{ size: 'xl' }">
    <template #body-title>
      <h3>Submit & Print</h3>
    </template>
    <template #body-content>
      <div class="flex flex-col gap-3">
        <!-- review=false;patientPanel_flag=false;vitals_flag=true -->
        <div class="text-sm">
          Please Confirm that the transcriptions are correct.
        </div>

        <TabButtons
          :buttons="[
            {
              label: 'Confirm',
              value: 'Correct',
            },
            {
              label: 'Incorrect',
              value: 'Incorrect',
            },
          ]"
          v-model="submit_choice"
        />
        <div class="text-sm text-gray-700" v-if="submit_choice == 'Incorrect'">
          Incase of incorrect transcription, a Blank prescrption will be printed
          with your Impressions, You can make the Prescription by hand
        </div>
        <FormControl
          :type="'textarea'"
          v-model="submit_comments"
          v-show="submit_choice == 'Incorrect'"
          placeholder="Please tell us about the transcription error"
        />
      </div>
      <div
        class="text-xs pt-2 text-gray-800 capitalize flex flex-wrap item-center justify-center"
      >
        Please save the patient history & notes from the patient panel before
        confirming transcription, you will not get chance to do so after
        submission
      </div>
      <div
        class="text-xs pt-2 text-gray-800 capitalize flex flex-wrap item-center justify-center"
      >
        Consultation Time: {{ time_diff }} mins
      </div>
      <ErrorMessage :message="error_interaction" />
      <ErrorMessage
        message="Error: Please select transcription failed and complete submission, we will review it further"
        v-if="error_interaction"
      />
    </template>
    <template #actions>
      <div class="flex flex-row items-center justify-center">
        <Button
          @click="make_prescription(false)"
          v-if="submit_choice == 'Incorrect' && submit_comments.length > 0"
          :loading="interaction_load"
          class="rounded-full bg-white border border-red-800 text-red-800 hover:bg-red-800/30"
        >
          Submit Prescription & Report Discrepancy
        </Button>
        <Button
          @click="make_prescription(true)"
          v-if="submit_choice == 'Correct'"
          :loading="interaction_load"
          class="rounded-full bg-teal-800 border text-white hover:bg-teal-500"
        >
          Approve Transcript
        </Button>
        <Button
          @click="interaction_flag = false"
          class="rounded-full ml-2"
          :variant="'solid'"
          theme="gray"
        >
          Close
        </Button>
      </div>
    </template>
  </Dialog>
</template>
<script setup>
import { reactive, ref, watch } from "vue";
import {
  Textarea,
  Button,
  FormControl,
  Dialog,
  Badge,
  TabButtons,
  ErrorMessage,
} from "frappe-ui";
import { referral } from "@/composables/useReferralUtils.js";
import { direct_out } from "@/composables/useInteractionNotesDirect.js";
import { patient_panel } from "@/composables/usePatientStore.js";
import VitalsPanel from "@/component/shared/VitalsDisplay.vue";
import NewLexicon from "@/component/shared/NewMedicalLexicon.vue";
import { createInteraction } from "@/composables/useCreateInteraction.js";
import { createLexicon } from "@/composables/useCreateLexicon.js";
import { Pencil } from "lucide-vue-next";
import dayjs from "dayjs";
import { useRouter } from "vue-router";

const router = useRouter();
const start_time = dayjs();
const time_diff = ref("");
const { patientPanel_flag, vitals_flag } = patient_panel();
const { referdr, make_newRef, selrefdr, refer_create, error_ref } = referral();
const {
  result,
  interation_direct,
  result_grouped,
  comments,
  library,
  stop_submit,
} = direct_out();
const {
  make_newInteraction,
  error_interaction,
  interaction_load,
  interaction_flag,
  interaction_id,
} = createInteraction();
const { lexicon_flag } = createLexicon();
const review = ref(false);
const correction = ref(false);
const submit_choice = ref("Incorrect");
const submit_comments = ref("");
const under_operation = reactive({
  Display: "",
  Category: "",
  Name: "",
  Life_sty: "",
  lab_type: "",
  surg_adv: "",
  med_panel: ["", "", "", "", ""],
  correction: "",
  original: "",
  symbol: "",
});
const props = defineProps({
  Pat_id: String,
  App_id: String,
  Room_id: String,
  Request_from: String,
});
const interaction = reactive({
  //notes:"Fever 2d; Seasonal Flu, CBC \n Inhalation, tab azithromycin OD x5d \n Amputation of Toe",
  //notes:'"plenty of rest required" fever;@bloody nose;cough 2 days;seasonal flu more comment;cbc;test;stamlo 5mg test test;thyronorm 75 once daily 3 months;exercise;amputation of toe comment',
  notes: "",
  follow_up: null,
});
function create_new_element(phrase) {
  lexicon_flag.value = true;
  under_operation.Display = phrase.Display;
  under_operation.Category = phrase.Item[0];
  under_operation.Name = phrase.Item[1];
}
function phraseCorrection(item) {
  correction.value = true;
  under_operation.original = item.Original;
  under_operation.correction = item.Original;
}
function remove_phrase() {
  const step_1 = interaction.notes
    .trim()
    .replace(/\r\n?/g, "\n")
    .replace(/\u2028|\u2029/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/([@#%^$;,&*!])\1+/g, "$1")
    .toLowerCase();
  const new_string = step_1
    .replace(under_operation.original, "")
    .trim()
    .replace(/\r\n?/g, "\n")
    .replace(/\u2028|\u2029/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/([@#%^$;,&*!])\1+/g, "$1")
    .toLowerCase();
  interaction.notes = new_string;
  interation_direct(new_string);
  correction.value = false;
  under_operation.original = "";
  under_operation.correction = "";
}
function correct_phrase() {
  const step_1 = interaction.notes
    .trim()
    .replace(/\r\n?/g, "\n")
    .replace(/\u2028|\u2029/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/([@#%^$;,&*!])\1+/g, "$1")
    .toLowerCase();
  const new_string = step_1
    .replace(under_operation.original, under_operation.correction + ";")
    .trim()
    .replace(/\r\n?/g, "\n")
    .replace(/\u2028|\u2029/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/([@#%^$;,&*!])\1+/g, "$1")
    .toLowerCase();
  interaction.notes = new_string;
  interation_direct(new_string);
  correction.value = false;
  under_operation.original = "";
  under_operation.correction = "";
}
function make_prescription(correct_flag) {
  const data = ref([]);
  const create_flag = ref(false);
  data.value = [
    interaction.notes,
    interaction.follow_up,
    selrefdr.value.name,
    props.Pat_id,
    props.App_id,
    props.Room_id,
    props.Request_from,
  ];
  create_flag.value = make_newInteraction(
    correct_flag,
    data.value,
    result.value,
    comments.value,
    submit_comments.value,
    time_diff.value,
  );
  if (create_flag) {
    //new prescription
    review.value = false;
    patientPanel_flag.value = false;
    vitals_flag.value = false;
    router.push("/opd");
    // Navigating by named route
    // router.push({ name: 'UserDetail', params: { id: 123 } });
    //get next patient
  }
  //
}
const refer_new = reactive({
  refer: [null, null],
});
function time_differnce(start) {
  const date1 = dayjs();
  time_diff.value = date1.diff(start, "minute");
}

watch(lexicon_flag, async (lexicon_flag) => {
  if (!lexicon_flag) {
    setTimeout(() => {
      interation_direct(interaction.notes);
    }, 1000);
  }
});
</script>
