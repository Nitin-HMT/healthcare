<!-- Trimmings from patient panel, this is for the aside panel -->
   <aside
    v-show="props.Request_from == 'opd_consult7'"
    class="hidden divide-gray-300 p-1 md:flex flex-col first-line:text-base fixed h-screen inset-y-0 top-0 right-0 bg-white drop-shadow-2xl transition-all duration-300 ease-in-out pt-16"
    :class="patientPanel_flag ? 'w-16' : 'w-64'"
  >
    <div
      class="divide-y divide-gray-300"
      v-if="!patientPanel_flag && patient.doc"
    >
      <div class="p-4 flex flex-col items-center justify-center space-x-2">
        <div
          class="rounded-full w-20 h-20 border"
          :class="[patient.doc.sex === 'Other' ? 'bg-yellow-300' : 'bg-white']"
        >
          <User
            class="p-2 w-20 h-20"
            :class="[
              patient.doc.sex === 'Female'
                ? 'text-pink-600/80'
                : 'text-blue-700',
            ]"
          />
        </div>
      </div>
      <div
        class="text-xs text-gray-400 flex flex-row px-1 items-center justify-center"
      >
        <i>{{ Pat_id }}</i>
      </div>
      <!-- Middle: Navigation -->
      <div
        class="flex flex-col items-center justify-center text-gray-900 bg-white mx-1 p-1 text-base space-y-1"
      >
        <div>
          {{ patient.doc.patient_name }}, {{ patient.doc.aged }}yrs,
          {{ patient.doc.sex }}
        </div>
        <div class="text-red-800">{{ patient.doc.blood_group }}</div>
        <div class="text-sm flex">
          <Phone class="w-3 h-3 mr-1" />{{ patient.doc.mobile }}
        </div>
        <div
          class="text-sm flex text-white bg-orange-500 p-1 font-semibold rounded-full"
          v-if="patient.doc.emergency"
        >
          <Siren class="w-4 h-4 mr-1" />{{ patient.doc.emergency }}
        </div>
      </div>

      <!-- Bottom: Avatar + Collapse Button -->
      <div
        class="p-1 pb-0.5 items-center justify-center space-x-1 space-y-1.5 capitalize"
      >
        <div
          class="text-sm text-gray-600 flex flex-row px-1 items-center justify-center"
        >
          Chronic/Past Conditions
          <Button
            class="flex items-end justify-end bg-white"
            @click="pat_hit_dialog = true"
          >
            <Pencil v-if="result_grouped" class="h-4 text-gray-600" />
            <SquarePlus v-else class="h-5 text-gray-600" />
          </Button>
        </div>
        <div v-if="result_grouped" @click="pat_hit_dialog = true">
          <span
            v-for="(item, index) in result_grouped.Allergy"
            class="space-x-1"
          >
            <Badge
              :variant="'outline'"
              theme="red"
              size="sm"
              v-if="item.Item && !item.new"
              >{{ item.Display }}</Badge
            >
          </span>
          <span v-for="(item, index) in result_grouped.Meds" class="space-x-1">
            <Badge
              :variant="'outline'"
              theme="blue"
              size="sm"
              v-if="item.Item && !item.new"
              class="flex flex-wrap"
              >{{ item.Item[7]
              }}<!--({{  (item.Item[3]) }})--></Badge
            >
          </span>
          <span
            v-for="(item, index) in result_grouped.Diagnosis"
            class="space-x-1"
          >
            <Badge
              :variant="'outline'"
              theme="orange"
              size="sm"
              v-if="item.Item && !item.new"
              >{{ item.Display }}</Badge
            >
          </span>
          <span v-for="(item, index) in result_grouped.surg" class="space-x-1">
            <Badge
              :variant="'outline'"
              theme="green"
              size="sm"
              v-if="item.Item && !item.new"
              >{{ item.Display }}</Badge
            >
          </span>
        </div>
      </div>
      <div
        class="p-2 flex flex-col items-center justify-center space-x-1 space-y-1.5"
      >
        <Rating v-model="rating" v-show="false" />
        <Textarea
          :variant="'outline'"
          size="sm"
          placeholder="Your Pvt Notes"
          class="h-20"
          v-model="pvtNotes"
        />
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
    </div>
    <div v-else-if="patientPanel_flag && patient.doc">
      <div
        class="leading-none [writing-mode:vertical-rl] p-2 text-sm flex flex-grow gap-2 items-center justify-between"
      >
        <div class="bg-white rounded-full w-8 h-8 border">
          <User
            class="p-2 w-8 h-8"
            :class="[
              patient.doc.sex === 'Female'
                ? 'text-pink-600/80'
                : 'text-blue-700',
            ]"
          />
        </div>
        {{ patient.doc.patient_name }}, {{ patient.doc.aged }}yrs,
        {{ patient.doc.sex }}
        <div class="text-red-800">{{ patient.doc.blood_group }}</div>
        <div class="text-xs flex">
          <Phone class="w-3 h-3 m-1 rotate-90" />{{ patient.doc.mobile }}
        </div>
        <div
          class="text-xs flex text-white bg-orange-900 p-1 font-semibold rounded-full"
          v-if="patient.doc.emergency"
        >
          <Siren class="w-4 h-4 mb-1 rotate-90" /> {{ patient.doc.emergency }}
        </div>
      </div>
    </div>
    <div class="p-4 flex items-end space-y-2">
      <button
        @click="patientPanel_flag = !patientPanel_flag"
        class="text-teal-700 hover:text-teal-600 transition"
      >
        <ChevronsRight class="w-6 h-6" v-if="!patientPanel_flag" />
        <ChevronsLeft class="w-6 h-6" v-if="patientPanel_flag" />
      </button>
    </div>
  </aside>

  <!-- trimming from lexicon creation in opd, pulled out meds part as meds are being forced to be created -->
   if (result.value[key].Qualifier.length > 0) {
          let qual = result.value[key].Qualifier[0];
          //if all qualifiers are present, allow to create the lexicon and go ahead in the loop
          if ("medicine_form" in qual && "dosage" in qual && "period" in qual) {
            console.log(
              "all qualifiers present but will even then need to stop for sanity check",
            );
            create_new_element(result.value[key]);
            creation_submission_flag.value = false;
            interaction_flag.value = false;
            submit_choice.value = false;
            lexicon_stop_flag.value = false;
            break;
          } else {
            console.log("Incomplete Qualifier- User to Input");
            // Incomplete Qualifiers found, the submit Protocol is stopped and elements are needed to be entered
            create_new_element(result.value[key]);
            creation_submission_flag.value = false;
            interaction_flag.value = false;
            submit_choice.value = false;
            lexicon_stop_flag.value = false;
            break;
          }
          //else break
        } else {
          console.log("No Qualifier- User to Input");
          // No Qualifiers found, the submit Protocol is stopped and elements are needed to be entered
          create_new_element(result.value[key]);
          creation_submission_flag.value = false;
          interaction_flag.value = false;
          submit_choice.value = false;
          lexicon_stop_flag.value = false;
          break;
        }
// submission dialog from patient interact
<!-- Dialog Submission Process And printing -->
  <!-- <Dialog v-model="interaction_flag_s" :options="{size: 'xl'}">
    <template #body-title>
      <h3>Submit & Print</h3>
    </template>
    <template #body-content>
      <div class="flex flex-col gap-3">
        <!-- review=false;
       <div class="text-sm"> Please Confirm that the transcriptions are correct. </div>
              
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
  <div class="text-sm text-gray-700" v-if="submit_choice=='Incorrect'">Incase of incorrect transcription, a Blank prescrption will be printed with your Impressions,
         You can make the Prescription by hand</div>
      <FormControl :type="'textarea'" v-model="submit_comments" 
      v-show="submit_choice=='Incorrect'" placeholder="Please tell us about the transcription error"/>
      </div>
      <div class="text-xs pt-2 text-gray-800 capitalize flex flex-wrap item-center justify-center"> Please save the patient history & notes from the patient panel before confirming transcription, 
        you will not get chance to do so after submission</div>
        <div class="text-xs pt-2 text-gray-800 capitalize flex flex-wrap item-center justify-center">Consultation Time: {{time_diff}} mins</div>
      <ErrorMessage :message="error_interaction" />
    <ErrorMessage message="Error: Please select transcription failed and complete submission, we will review it further" v-if="error_interaction" />
    </template>
    <template #actions>
      <div class="flex flex-row items-center justify-center">
      <Button @click="make_prescription(false)" v-if="submit_choice=='Incorrect' && submit_comments.length>0" :loading="interaction_load"
      class="rounded-full bg-white border border-red-800 text-red-800 hover:bg-red-800/30" >
       Submit Prescription & Report Discrepancy
      </Button>
      <Button @click="make_prescription(true)" v-if="submit_choice=='Correct'" :loading="interaction_load"
      class="rounded-full bg-teal-800 border text-white hover:bg-teal-500" >
         Approve Transcript
      </Button>
      <Button @click="interaction_flag=false" 
      class="rounded-full ml-2" :variant="'solid'" theme="gray">
        Close
      </Button></div>
    </template>
    
  </Dialog> -->




  async function new_lexiconcheck() {
  if (!result.value || !submit_choice.value) {
    submit_progress.value = 50;
    console.log("2 fired");
    return;
  }

  lexicon_stop_flag.value = true;

  for (let i = 0; i < result.value.length; i++) {
    const item = result.value[i];

    if (item.new && item.Category === "Unknown") {
      interaction.notes = interaction.notes
        .replace(item.Original + ";", `"${item.Original}";`)
        .trim();
    }

    else if (item.new && item.Category === "Meds") {
      lexicon_stop_flag.value = false;
      break;
    }

    else if (item.new) {
      submit_sp_dialog_flag.value = false;
      create_new_element(item);
      await make_newLexicon(under_operation); // ✅ this WILL wait
    }
  }

  // ✅ Runs AFTER ALL awaited DB writes
  interation_direct(interaction.notes);
  submit_progress.value = 50;
  lexicon_stop_flag.value = false;

  console.log("2 fired");
}



<Button :variant="'subtle'" 
        v-if="!interaction_flag && (!interaction_flag && new_terms) && !stop_submit" 
        size="md" 
        label="Create New Lexicon" 
        class="rounded-full bg-teal-800 border 
        border-white text-white hover:text-teal-800 
        hover:border-teal-800 hover:bg-white" 
        @click="new_lexiconcheck();" :loading="lexicon_stop_flag"/> 
        <Button :variant="'subtle'" 
        v-else-if="!interaction_flag && (!interaction_flag && !stop_submit)" 
        size="md" label="Submit" 
        class="rounded-full bg-teal-800 border border-white text-white 
        hover:text-teal-800 hover:border-teal-800 hover:bg-white" 
        @click="time_differnce(start_time),interaction_flag=true"/> 
        <Badge v-else-if="stop_submit" label="New Meds, Add to Lexicon to Proceed" 
        disabled="true" :theme="'red'"/>

//this is for up down search functionality

        function chat_search_S(e) {
  const ignoredKeys = [
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "Enter",
    "Escape",
    "Shift",
    "Control",
    "Alt",
    "Meta"
  ];

  if (ignoredKeys.includes(e.key)) {
    return; // do NOT re-trigger search
  }

  const chat = interaction.chat;

  if (chat.length > 2 && chat.indexOf('"')) {
    continuos_input.show_result = true;
    search_direct(chat);
  } else {
    continuos_input.show_result = false;
  }
}