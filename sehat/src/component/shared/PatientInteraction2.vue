<template>
  <!-- Release 1<br />
   α 5- Schema Change & logout
   allergy not getting added to history
  -->
  <!--   
  β 1.Stop Submit if Medicine dosage isnt updated- and update the same if blanks - UPDATE FUNCTION NEEDS TO BE MADE<br/>
    a. i removed doctor pvt notes from patient panel, need to fix that, and fix the whole patient panel now
  γ 2. Develop *Fuzy Match* and Aliases or Near Matches, abbreviations, may be lookup using generic name as well<br/>
  β 3. Develop Medical Templates/Treatment Plans/Energy Points<br/>
  β 4. make the font smaller or better fitting for smaller screens and larger prescription<br/>
  γ 5. edit db easily<br/>      
  β 6. develop one master drug and several ways to order it by doctors??<br/>
  γ 7. break the patient interaction code into smaller pieces.<br/>
 -->
  <div
    class="flex-grow border pt-2 text-sm bg-white rounded-b-lg border-x-8 border-teal-50"
  >
    <!-- <Progress
      size="md"
      :value="submit_progress"
      label=""
      :intervals="false"
      :interval-count="4"
      class="px-20 pb-1"
      v-if="false"
    /> -->
    <!-- Custom Progress Bar -->
    <div class="px-20 pb-1 rounded-full">
    <div class="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
    <div
      :style="{ width: submit_progress+ '%' }"
      class="h-full bg-teal-800 transition-all duration-1000 ease-out rounded-full"
    ></div>
  </div></div>
    <!--Structured Notes -->
    <div class="px-2">
      <div class="text-base font-semibold pb-1">Interaction Notes</div>
      <div class="col-span-1 grid grid-cols-4 gap-2 gap-x-3 tracking-wide" :key="result_grouped">
        <!-- Unknown Terms Display -->
        <div
          class="col-span-4 grid grid-cols-6 gap-1 border-gray-800 rounded-lg pb-1"
          v-if="result_grouped && result_grouped.Unknown"
        >
          <p
            class="text-2xs font-medium px-1 gap-2 pl-1 my-1 col-span-6 underline"
          >
            I didn't Understand these Terms:
          </p>
          <div
            v-for="(item, index) in result_grouped.Unknown"
            class="flex flex-wrap gap-x-2 p-0.5 pl-2 align-center bg-yellow-300 rounded-full cursor-pointer"
          >
            <Pencil
              class="h-3 text-gray-800 cursor-pointer -mr-1 text-xs"
              @click="phraseCorrection(item)"
            />
            <div
              @click="create_new_element(item)"
              class="flex flex-wrap text-xs tracking-wider"
            >
              {{ item.Functional }}
              <!-- <Badge :variant="'outline'" size="sm" theme="red" @click="create_new_element(item)" class="cursor-pointer">Fix</Badge> -->
              <!-- <Badge
                :variant="'solid'"
                size="sm"
                @click="create_new_element(item)"
                class="cursor-pointer bg-yellow-700 text-white px-3"
                >Fix</Badge
              > -->
            </div>
          </div>
          <div class="text-2xs text-gray-700 pl-2 pb-1 col-span-6">
            Couldn't Transcribe the above, Please Review them, Create a new
            Medical Terminology as Required.
          </div>
        </div>
        <!-- All Obx -->
        <div class="flex flex-col">
          Obx,
          <!-- Vitals Display -->
          <VitalsPanel
            :Pat_id="props.Pat_id"
            :App_id="props.App_id"
            Collapse="true"
            Request_from="OPD"
          />
          <!-- Symptoms Display -->
          <div
            class="grid grid-cols-1 gap-1 py-0.5"
            v-if="result_grouped && result_grouped.Symptoms"
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
              <div
                v-if="item.new"
                class="bg-yellow-300 rounded-full cursor-pointer px-1"
                @click="create_new_element(item)"
              >
                {{ item.Functional }}
              </div>
              <div v-else class="align-baseline flex gap-x-2">
                {{ item.note}}
              </div>
            </div>
          </div>
          <!-- Diagnosis Display -->
          <div
            class="grid grid-cols-1 gap-1 py-0.5"
            v-if="result_grouped && result_grouped.Diagnosis"
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
              <div
                v-if="item.new"
                class="bg-yellow-300 rounded-full cursor-pointer px-1"
                @click="create_new_element(item)"
              >
                {{ item.Functional }}
              </div>
              <div v-else class="align-baseline flex gap-x-2">
                {{ item.note}}
              </div>
              <Switch
                size="sm"
                label=""
                :disabled="false"
                v-model="item.is_historic"
                @click="change_history(item)"
              />
            </div>
          </div>

          <!-- Allergy Display- Switched off -->
          <div
            class="grid grid-cols-1 gap-1 py-2"
            v-if="result_grouped && result_grouped.Allergy"
          >
            <p
              class="text-sm font-medium px-1 gap-2 pl-1 my-0.5 flex-grow underline"
            >
              Allergy:
            </p>
            <div
              v-for="(item, index) in result_grouped.Allergy"
              class="flex gap-x-2 pt-0.5 pl-2 align-baseline"
            >
              <Pencil
                class="h-4 text-teal-800 cursor-pointer -mr-2"
                @click="phraseCorrection(item)"
              />
              <div
                v-if="item.new"
                class="bg-yellow-300 rounded-full cursor-pointer px-1"
                @click="create_new_element(item)"
              >
                {{ item.Functional }}
              </div>
              <div v-else class="align-baseline flex gap-x-2 Capitalise">
                {{ item.note}}
              </div>
              <Switch
                size="sm"
                label=""
                :disabled="false"
                v-model="item.is_historic"
                @click="change_history(item)"
              />
            </div>
          </div>
        </div>
        <!-- All Rx -->
        <div class="col-span-2">
          Rx,
          <!-- Labs Display -->
          <div
            class="grid grid-cols-1 gap-1 py-0.5"
            v-if="result_grouped && result_grouped.labs"
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
              <div
                v-if="item.new"
                class="bg-yellow-300 rounded-full cursor-pointer px-1"
                @click="create_new_element(item)"
              >
                {{ item.Functional }}
              </div>
              <div v-else class="align-baseline flex gap-x-2">
                {{ item.note}}
              </div>
            </div>
          </div>
          <!-- Procedure Display -->
          <div
            class="grid grid-cols-1 gap-1 py-0.5"
            v-if="result_grouped && result_grouped.surg"
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
              <div
                v-if="item.new"
                class="bg-yellow-300 rounded-full cursor-pointer px-1"
                @click="create_new_element(item)"
              >
                {{ item.Functional }}
              </div>
              <div v-else class="align-baseline flex gap-x-2 Capitalise">
                {{ item.note}}
              </div>
              <Switch
                size="sm"
                label=""
                :disabled="false"
                v-model="item.is_historic"
                @click="change_history(item)"
              />
            </div>
          </div>
          <!-- Medicine Display -->
          <div
            class="grid grid-cols-1 gap-1 py-0.5"
            v-if="result_grouped && result_grouped.Meds"
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
              <div class="align-baseline flex flex-wrap">
                <div
                  v-if="item.new"
                  class="bg-yellow-300 rounded-full cursor-pointer px-1.5 flex flex-wrap"
                  @click="create_new_element(item)"
                >
                  {{ item.Functional }}
                  <div v-if="item.Qualifier[0]" class="pr-0.5">
                    {{ item.Qualifier[0].medicine_form }}
                  </div>
                </div>
                <div
                  v-else-if="
                    !item.Qualifier[0] ||
                    !(
                      item.Qualifier[0] &&
                      item.Qualifier[0].medicine_form != null &&
                      item.Qualifier[0].dosage != null &&
                      item.Qualifier[0].period != null
                    )
                  "
                  class=""
                >
                  <div
                    class="bg-yellow-300 rounded-full cursor-pointer px-1.5"
                    @click="create_new_element(item)"
                  >
                   {{ item.Item[7] }} {{ item.Qualifier[0].medicine_form }}
                  </div>
                  <i class="text-2xs">Please Add Qualifiers</i>
                </div>
                <div v-else class="col-span-2 flex gap-x-2">
                  <div class="flex">
                    {{ item.note}}
                  </div>
                
                <Switch
                  size="sm"
                  label=""
                  :disabled="false"
                  v-model="item.is_historic"
                  @click="change_history(item)"
                />
              </div>
              </div>
            </div>
          </div>
        </div>
        <!-- More Information and Referal -->
        <div>
          <p
            class="text-sm font-medium px-1 gap-2 pl-1 my-1 flex-grow underline"
            v-if="comments || interaction.follow_up || selrefdr.label"
          >
            More Information:
          </p>
          <div class="flex flex-col gap-y-2 align-baseline">
            <div
            class="grid grid-cols-1 gap-1 py-0.5"
            v-if="result_grouped && result_grouped.Comments"
          >
            <b
              class="text-sm font-medium px-1 gap-2 pl-1 my-0.5 flex-grow"
            >
              Comments:
          </b>
            <div
              v-for="(item, index) in result_grouped.Comments"
              class="flex gap-x-2 pt-0.5 pl-2 align-baseline"
            >
              <Pencil
                class="h-4 text-teal-800 cursor-pointer -mr-2"
                @click="phraseCorrection(item)"
              />
              <div class="align-baseline flex gap-x-2">
                {{ item.Item }}
              </div>
            </div>
          </div>

            <div class="grid grid-cols-2 gap-2">
              <FormControl
                variant="outline"
                type="autocomplete"
                :options="referdr"
                v-model="selrefdr"
                placeholder="Refer To"
                class="col-span-4 rounded-full"
              />
              <Button
                :variant="'outline'"
                size="md"
                label="+"
                class="rounded-lg bg-white border border-teal-800 text-teal-800"
                @click="refer_create = true"
              />
              <div class="col-span-2"></div>
              <FormControl
                variant="outline"
                :type="'number'"
                :ref_for="true"
                placeholder="Follow-up (In Days)"
                v-model="interaction.follow_up"
                class="col-span-5"
              />
            </div>
            <div
              v-if="new_terms"
              class="font-normal text-2xs font-mono col-span-3 flex flex-wrap text-gray-700 leading-4"
            >
              Review new terms; categorized items will be saved to the
              lexicon.<br />
              Note: Comments and qualifiers are ignored/unrecognised.<br />
              Uncategorized terms will default to "Doctor’s Comments."
              <!-- <br/>Review new medicines now to prevent manual verification later. -->
            </div>
          </div>
        </div>
      </div>

      <div class="m-3 flex flex-grow items-end justify-end pr-8 gap-x-2">
        <!-- <div class="py-2 text-sm grid grid-cols-1">{{interaction.notes}}</div> 
              v-if="!stop_submit"
             -->
        <!-- <Button :variant="'subtle'" size="md" label="Back"
                class="rounded-full bg-white border border-teal-800 text-teal-800" @click="review=false;"/> -->
        <!-- v-if="!interaction_flag && (!interaction_flag && new_terms) && !stop_submit" -->
        <ErrorMessage
          message="Error: Lexicon Creation Error<br/>
                  You can try again by clicking 'Create New Lexicon'<br/>
                  if the error persisits, remove the new term, report the issue"
          v-if="error_lexicon"
        />
        <ErrorMessage :message="error_lexicon" />

        <Button
          :variant="'subtle'"
          v-if="
            !interaction_flag &&
            !interaction_flag &&
            !stop_submit &&
            prescription_created == false
          "
          size="md"
          label="Submit"
          class="rounded-full bg-teal-800 border border-white text-white hover:text-teal-800 hover:border-teal-800 hover:bg-white"
          @click="
            (time_differnce(start_time),
            (interaction_flag = true),
            (submit_progress = 25))
          "
        />
        <Badge
          v-else-if="stop_submit"
          label="New Meds, Add to Lexicon to Proceed"
          disabled="true"
          :theme="'red'"
        />
      </div>
    </div>
    <!-- Chat Window & Submission -->
    <!-- Chat Window -->
    <div v-if="!interaction_flag">
      <OPDButtons
        :Pat_id="pat_id"
        :App_id="app_id"
        Collapse="true"
        :Request_from="route.name"
      />
      <div class="p-1.5 py-4 text-sm bg-teal-50">
        <div>
          <!-- <div class="text-md font-semibold">Impression & Advise</div> -->
          <div class="grid grid-cols-10 gap-3">
            <div class="col-span-9">
              <Popover>
                <template #target="{ togglePopover }">
                  <Textarea
                    :variant="'outline'"
                    placeholder='You can use symbols to force match (optional): 
@ symptoms, # Meds, $ labs, ^ Diagnosis, * Procedure, ! Allergy, "" Descriptive Comments'
                    class="w-full h-20 resize-none text-sm col-span-9"
                    @keydown.stop="handleKeydown"
                    @focus="togglePopover()"
                    @input="chat_search"
                    v-model="interaction.chat"
                  />
                  <!-- @keyup.stop="chat_search(interaction.chat)" -->
                </template>
                <template #body-main v-if="continuos_input.show_result">
                  <div
  v-for="(item, index) in all_search"
  :key="index"
  :ref="el => resultRefs[index] = el"
  @click="selectItem(item)"
  :class="[
    'py-1.5 px-2 text-xs text-gray-900 rounded-sm cursor-pointer',
    activeIndex === index
      ? 'bg-gray-100/50 font-semibold hover:bg-gray-200'
      : 'hover:bg-gray-200'
  ]"
>

                    <div v-if="item[0] == 'Meds'" class="grid grid-cols-8">
                      <div
                        class="col-span-2 flex items-center gap-x-1"
                      >
                        <!-- +' '+item[5]+' '+item[4] -->
                        <Avatar
                          :shape="'square'"
                          :image="'/files/pill_yellow.jpg'"
                          size="xs"
                        />
                        {{ item[7] }} {{ item[2] }}
                      </div>
                      <div>{{ item[5] }}</div>
                      <div>{{ item[4] }}</div>
                      <div class="col-span-2 text-2xs flex item-start 
                      justify-start text-gray-600">{{ item[8] }}</div>
                      <div
                        class="col-span-2 text-2xs flex item-end justify-end text-gray-700"
                      >
                        {{ item[3] }}
                      </div>
                    </div>
                    <div
                      v-else-if="item[0] == 'Symptoms'"
                    >
                      <div class="flex items-center gap-x-1">
                        <Avatar
                          :shape="'square'"
                          :image="'/files/symptoms.jpg'"
                          size="xs"
                        />
                        {{ item[1] }}
                      </div>
                    </div>
                    <div
                      v-else-if="item[0] == 'Diagnosis'"
            
                    >
                      <div class="flex items-center gap-x-1">
                        <Avatar
                          :shape="'square'"
                          :image="'/files/diagnosis.jpg'"
                          size="xs"
                        />
                        {{ item[1] }}
                      </div>
                    </div>
                    <div
                      v-else-if="item[0] == 'labs'"

                    >
                      <div class="flex items-center gap-x-1">
                        <Avatar
                          :shape="'square'"
                          :image="'/files/lab_test_blue_2.jpg'"
                          size="xs"
                        />
                        {{ item[2] }}
                      </div>
                    </div>
                    <div
                      v-else-if="item[0] == 'surg'"
                    >
                      <div class="flex items-center gap-x-1">
                        <Avatar
                          :shape="'square'"
                          :image="'/files/surgery _red.jpg'"
                          size="xs"
                        />
                        {{ item[2] }}
                      </div>
                    </div>
                    <div
                      v-else-if="item[0] == 'Allergy'"
                    >
                      <div class="flex items-center gap-x-1">
                        <Avatar
                          :shape="'square'"
                          :image="'/files/allergy.png'"
                          size="xs"
                        />
                        {{ item[1] }}
                      </div>
                    </div>
                    <div v-else>{{ item }}</div>
                    <!-- {{item}} -->
                  </div>
                </template>
              </Popover>
            </div>
            <div
              class="flex flex-grow items-center justify-center rounded-md hover:bg-teal-800/70 bg-teal-800 text-white text-base"
              @click="
                chat_Append(interaction.chat);
                review = true;
              "
            >
              Confirm
            </div>
          </div>
          <div v-if="true"
            class="text-xs text-gray-600 font-light font-mono mt-2 flex items-end justify-end"
          >
            {{ interaction.notes }}
          </div>
          <div v-if="true"
            class="text-xs text-gray-600 font-light font-mono mt-2 flex items-end justify-end"
          >
            Hx-> {{ interaction.history }}
          </div>
          
        </div>
      </div>
    </div>
    <!-- Submission -->
    <div
      v-else
      class="grid grid-cols-3 gap-x-3 gap-y-2 p-2 border-b-8 border-teal-50 bg-blue-50/30"
    >
      <div
        class="font-bold text-teal-700 text-lg col-span-3 flex items-center justify-center"
      >
        Review, Submit & Print
      </div>
      <div class="text-sm col-span-3 flex items-center justify-center">
        Please Confirm that the transcriptions are correct.
      </div>
      <div class="flex col-span-1 items-center justify-start">
        <!--<div
          class="text-sm text-blue-800 capitalize flex flex-wrap items-center justify-center"
        >
          Please Save history and Pvt notes before submitting; they cannot be
          accessed afterward.
        </div>-->
      </div>
      <div
        class="text-xs pt-2 text-gray-800 capitalize flex flex-wrap item-center justify-center"
      >
        Consultation Time: {{ time_diff }} mins
      </div>
      <Switch
        size="sm"
        label="I confirm The Transcription"
        :disabled="false"
        v-model="submit_choice"
        class="bg-green-100 hover:bg-teal-200/60 active:bg-teal-200/60"
      />

      <!-- <Progress
  size="sm"
  :value="submit_progress"
  label="Prescription Creation"
  :intervals="false"
  :interval-count="4"
/>
{{submit_progress}} 
<FormControl variant="outline" :type="'number'" :ref_for="true" size="sm" placeholder="Follow-up (In Days)"
                v-model="submit_progress" class="col-span-5"/>-->
      <!-- <FormControl :type="'textarea'" v-model="submit_comments" 
      v-show="submit_choice==false" placeholder="Please tell us about the transcription error"/> -->
      <div v-if="submit_choice == true" />
      <div v-if="submit_choice == true" class="text-sm capitalize flex gap-x-2">
        <!-- Create Treatment Plan from this transcription?
        <span class="text-blue-700 underline">Yes</span> -->
      </div>
      <div
        class="text-sm text-red-700 capitalize flex flex-wrap items-center justify-center"
        v-if="submit_choice == false"
      >
        Transcription error? A blank form with your Impressions will print for
        manual entry.
      </div>
      <FormControl
        :type="'textarea'"
        v-model="submit_comments"
        v-show="submit_choice == false"
        placeholder="Please tell us about the transcription error"
      />

      <div class="flex flex-row items-center justify-center">
        <Button
          @click="final_submission_dialog = true; make_prescription(submit_choice)"
          v-if="submit_choice == false && submit_comments.length > 0"
          :loading="interaction_load"
          class="rounded-full text-xs bg-white border border-red-800 text-red-800 hover:bg-red-800/30"
        >
          Submit Prescription & Report Discrepancy
        </Button>
        <!-- make_prescription(true); -->
        <Button
          @click="final_submission_dialog = true; make_prescription(submit_choice)"
          v-if="
            submit_choice == true &&
            new_terms == false &&
            prescription_created == false
          "
          :loading="interaction_load"
          class="rounded-full text-xs bg-teal-800 border text-white hover:bg-teal-500"
        >
          Approve Transcript
        </Button>
        <Button
          :variant="'solid'"
          @click="new_lexiconcheck()"
          v-if="submit_choice == true && new_terms == true"
          :loading="lexicon_stop_flag"
          class="rounded-full text-xs bg-orange-800 border text-white hover:bg-orange-500"
        >
          Create New Lexicon
        </Button>
        <Button
          @click="
            interaction_flag = false;
            submit_choice = false;
            submit_comments = '';
            submit_progress = 15;
          "
          class="rounded-full text-xs ml-2"
          :variant="'solid'"
          theme="gray"
        >
          Back to Chat
        </Button>
      </div>
      <ErrorMessage :message="error_interaction" />
      <ErrorMessage
        message="Error: To Move Ahead- <br/>Please switch off the confirm transcription<br/> and complete submission, we will review it further"
        v-if="error_interaction"
      />
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
  <!-- Dialog to Correct -->
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
  <!-- Dialog for creating new terms -->
  <Dialog
    v-model="lexicon_flag"
    :options="{ size: '4xl' }"
    :disable-outside-click-to-close="true"
    v-if="!lexicon_stop_flag"
  >
    <template #body-title>
      <h3 class="text-lg font-semibold pb-1">Add to Medical Lexicon</h3>
    </template>
    <template #body-content>
      <NewLexicon :Phrase="under_operation" />
      <ErrorMessage
        message="Error: Lexicon Creation Error<br/>
                  You can try again by clicking 'Create New Lexicon'<br/>
                  if the error persisits, remove the new term, report the issue"
        v-if="error_lexicon"
      />
      <ErrorMessage :message="error_lexicon" />
    </template>
  </Dialog>
  <Dialog v-model="lexicon_stop_flag" :options="{ size: 'md' }">
    <template #body-title>
      <div />
    </template>
    <template #body-content>
      <div class="flex items-center justify-center flex-col">
        <div class="text-sm text-gray-500">
          Processing, Please Wait...
        </div>
        <Spinner class="w-12 text-gray-500" v-if="lexicon_stop_flag" />
      </div>
    </template>
  </Dialog>
  <Dialog
    v-model="final_submission_dialog"
    :options="{ size: '4xl' }"
    :disable-outside-click-to-close="true"
  >
    <template #body-title>
      <div />
    </template>
    <template #body-content>
      <!-- <div
        class="flex items-center justify-center flex-col"
        v-if="
          prescription_created == false &&
          !interaction_load &&
          error_interaction.length < 1
        "
      >

        <div class="text-md text-gray-800 capitalize">
          Are you sure you want to submit?
        </div>
        <div class="flex flex-row-reverse gap-2">
          <Button variant="outline" @click="final_submission_dialog = false"
            >No</Button
          >
          <Button
            variant="solid"
            class="bg-teal-800 text-white hover:bg-teal-500"
            @click="make_prescription(submit_choice)"
            >Yes</Button
          >
        </div>
      </div> -->
      <div class="grid grid-cols-2 px-2 border">
        <div
          v-if="interaction_load && !prescription_created"
          class="py-12 flex items-center justify-center flex-col"
        >
          <Spinner class="w-12 text-gray-500" v-if="interaction_load" />
          <div class="text-sm text-gray-500">
            Creating Prescription, Please Wait ...
          </div>
        </div>
        <div
          v-if="!interaction_load && prescription_created"
          class="text-base text-gray-700 items-center justify-center flex flex-col"
        >
          <p>Prescription Successfully Created!!</p>
          <p>Prescription Id: {{ interaction_id }}</p>
          <Button
            variant="solid"
            class="bg-teal-800 text-white hover:bg-teal-500 mt-1"
            @click="print(interaction_id)"
            >Print Advise</Button
          >
        </div>
        <div
          v-if="!interaction_load && error_interaction != ''"
          class="py-12 text-sm text-gray-700 items-center justify-center flex flex-col gap-1"
        >
          <div class="text-red-800 text-base font-medium">
            Prescription Creation Failed!!
          </div>
          <div>Error Message: {{ error_interaction }}</div>
          <div>
            Action: You can create this Interaction by Hand by submitting as
            transcription failed.
          </div>
          <Switch
            size="sm"
            label="I confirm The Transcription"
            :disabled="true"
            v-model="submit_choice"
            class="bg-green-100 hover:bg-teal-200/60 active:bg-teal-200/60"
          />
          <!-- <div v-if="!interaction_load && error_interaction!=''"> -->
          <FormControl
            :type="'textarea'"
            v-model="submit_comments"
            v-show="submit_choice == false"
            :disabled="true"
            placeholder="Error"
          />
          <Button
            @click="
              error_interaction = '';
              make_prescription(false);
            "
            v-if="submit_choice == false"
            :loading="interaction_load"
            class="rounded-full text-xs bg-white border border-red-800 text-red-800 hover:bg-red-800/30"
          >
            Re-Submit Errored Transcription
          </Button>
        </div>

        <div>
          <div
            class="m-2 p-2 bg-white drop-shadow-xl rounded-md transition-all duration-300 ease-in-out"
          >
            <div class="">Next Appointments</div>
            <AppointQueue
              v-if="!appoint_flag"
              class="transition-opacity duration-3000 ease-in-out"
            />
            <NewAppointment
              v-else
              class="transition-opacity duration-3000 ease-in-out"
            />
          </div>
        </div>
      </div>
    </template>
  </Dialog>
</template>
<script setup>
import { reactive, ref, watch, onMounted, nextTick } from "vue";
import {
  Avatar,
  Textarea,
  Button,
  FormControl,
  Dialog,
  Badge,
  Switch,
  ErrorMessage,
  Progress,
  Spinner,
  Popover,
  createDocumentResource
} from "frappe-ui";
import { referral } from "@/composables/useReferralUtils.js";
import { direct_out } from "@/composables/useInteractionNotesDirect.js";
import { suggest } from "@/composables/useInteractionNotesSuggest.js";
import VitalsPanel from "@/component/shared/VitalsDisplay.vue";
import NewLexicon from "@/component/shared/NewMedicalLexicon.vue";
import { createInteraction } from "@/composables/useCreateInteraction.js";
import { createLexicon } from "@/composables/useCreateLexicon.js";
import { Pencil } from "lucide-vue-next";
import dayjs from "dayjs";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import OPDButtons from "@/component/opd/dashboard/OpdButtons.vue";
import AppointQueue from "@/component/opd/dashboard/AppointmentQueue.vue";
import { appoint } from "@/composables/useAppointmentUtils.js";
import NewAppointment from "@/component/opd/patient/NewAppointment.vue";

const route = useRoute();
const app_id = route.params.app_id;
const pat_id = route.params.pat_id;
const { appoint_flag } = appoint();
const activeIndex = ref(-1);
const resultRefs = ref([]);
const router = useRouter();
const start_time = dayjs();
const time_diff = ref("");
const final_submission_dialog = ref(false);
const prescription_created = ref(false);

const { referdr, make_newRef, selrefdr, refer_create, error_ref } = referral();
const {
  interation_direct,
  library,
  comments
} = direct_out();
const { search_direct, search_result, all_search } = suggest();
const {
  make_newInteraction,
  error_interaction,
  interaction_load,
  interaction_flag,
  interaction_id,
} = createInteraction();
const {
  make_newLexicon,
  error_lexicon,
  lexicon_flag,
  lexicon_load,
  lexicon_id,
} = createLexicon();
const review = ref(true);
const correction = ref(false);
const submit_choice = ref(false);
const submit_sp_dialog_flag = ref(true);
const submit_comments = ref("");
const lexicon_stop_flag = ref(false); // double control on lexicon dialog, stops from popping up during batch create
const submit_progress = ref(1);
const under_operation = reactive({
  Display: "",
  Category: "",
  Name: "",
  Life_sty: "",
  lab_type: "No Result",
  surg_adv: "",
  med_panel: ["", "", "", "", ""],
  correction: "",
  original: "",
  symbol: "",
  pos:1000000,
  is_historic: false
});
const props = defineProps({
  Pat_id: String,
  App_id: String,
  Room_id: String,
  Request_from: String,
});

const result = ref([]);
const result_hist = ref([]);
const result_grouped = ref();
const stop_submit = ref(false);
const new_terms = ref(false);

const interaction = reactive({
  //notes:"Fever 2d; Seasonal Flu, CBC \n Inhalation, tab azithromycin OD x5d \n Amputation of Toe",
  //notes:'"plenty of rest required" fever;@bloody nose;cough 2 days;seasonal flu more comment;cbc;test;stamlo 5mg test test;thyronorm 75 once daily 3 months;exercise;amputation of toe comment',
  notes: "",
  history:"",
  chat: "",
  follow_up: null,
});
const continuos_input = reactive({
  //search_result:[1,2,3,4,5,6,7],
  show_result: false,
});
function print(idx) {
  // window.open("/app/print/Patient Encounter/" + idx, "_blank");
  window.open(
    "/printview?doctype=Patient Encounter&name=" +
      idx +
      "&trigger_print=1&format=New_Prescription&no_letterhead=1&letterhead=No Letterhead&settings={}&_lang=en",
    "_blank",
  );
}
watch(all_search, () => {
  activeIndex.value = -1;
  resultRefs.value = [];
});

function create_new_element(phrase) {
  lexicon_flag.value = true;
  under_operation.Display = phrase.note;
  under_operation.Category = phrase.Item[0];
  under_operation.Name = phrase.Item[1];
  if (under_operation.Category == "Meds" && phrase.Qualifier.length) {
    under_operation.med_panel[0] = phrase.Qualifier[0].medicine_form;
    under_operation.med_panel[2] = phrase.Qualifier[0].dosage;
    under_operation.med_panel[3] = phrase.Qualifier[0].period;
  }
}
function phraseCorrection(item, history_flag=false) {
  correction.value = true;
  under_operation.original = item.Original || '"' + item + '"';
  under_operation.correction = item.Original || '"' + item + '"';
  under_operation.pos =item.pos[0];
  under_operation.is_historic=item.is_historic;
  if(history_flag){
    under_operation.is_historic=!under_operation.is_historic;
  }
}
function remove_phrase() {
  if(!under_operation.is_historic){
  result.value.splice(under_operation.pos,1);
  interaction.notes="";
    for(let i in result.value){
    if(result.value[i].Category!="Junk"){
    interaction.notes = interaction.notes +result.value[i].note+ "; ";}
  }
    result.value=renormalise_input(result.value);
    
  }else{
    result_hist.value.splice(under_operation.pos,1);
    interaction.history =""
    for(let i in result_hist.value){
      if(result_hist.value[i].Category!="Junk"){
      interaction.history = interaction.history +result_hist.value[i].note+ "; ";}
    }
    result_hist.value=renormalise_input(result_hist.value);
  }
  result_grouped.value = groupby_category([...result_hist.value, ...result.value]);
  correction.value = false;
  under_operation.original = "";
  under_operation.correction = "";
  under_operation.pos=1000000;
  under_operation.is_historic=false;

}
function correct_phrase() {

if(!under_operation.is_historic){
  result.value.splice(under_operation.pos,1);
  interaction.notes="";
  for(let i in result.value){
    if(result.value[i].Category!="Junk"){
    interaction.notes = interaction.notes +result.value[i].note+ "; ";}
  }
  chat_Append(under_operation.correction);
}else{
  result_hist.value.splice(under_operation.pos,1);
  interaction.history =""
  for(let i in result_hist.value){
    if(result_hist.value[i].Category!="Junk"){
      interaction.history = interaction.history +result_hist.value[i].note+ "; ";}
    }
    chat_Append(under_operation.correction,false,true);
  }
  correction.value = false;
  under_operation.original = "";
  under_operation.correction = "";
  under_operation.pos=1000000;
  under_operation.is_historic=false;

}
 function remake_original(phrase_array){
  let final_ph=""
  if(phrase_array?.length>0){
    for(let i=0;i<phrase_array?.length;i++){
      final_ph= (final_ph ?? "") +phrase_array[i]?.Original+ "; ";
    }
  }
  return final_ph
 }


async function make_prescription(correct_flag) {
  const data = ref([]);
  const create_flag = ref(false);
  //await library.refresh_library();
  let final_str = chat_Append(interaction.notes,true);
  let final_history = chat_Append(interaction.history,true,true);
  if(!correct_flag){
    //transcription_Failed
    interaction.notes="";
    interaction.history="";
    interaction.history=remake_original(result_hist.value);
    interaction.notes=remake_original(result.value);
  }
  if(interaction.history?.length>0){
  patient_x.setValue.submit({
    pat_hist: interaction.history})}
  data.value = [
    interaction.notes,
    interaction.follow_up,
    selrefdr.value.name,
    props.Pat_id,
    props.App_id,
    props.Room_id,
    props.Request_from,
    interaction.history
  ];
  submit_progress.value = 75;

  create_flag.value = await make_newInteraction(
    correct_flag,
    data.value,
    final_str,
    comments.value,
    submit_comments.value,
    time_diff.value,
    final_history
  );
  if (create_flag.value) {
    //new prescription
    review.value = true;
    submit_progress.value = 100;
    interaction_load.value = false;
    interaction_flag.value = false;
    submit_choice.value = false;
    prescription_created.value = true;
    interaction.notes = "";
    submit_comments.value = "";

    // router.push('/opd');
    // Navigating by named route
    // router.push({ name: 'UserDetail', params: { id: 123 } });
    //get next patient
  } else {
    submit_choice.value = false;
    interaction_load.value = false;
    interaction_flag.value = false;
    submit_comments.value = error_interaction.value;
    prescription_created.value = false;
  }
  return;
}
const refer_new = reactive({
  refer: [null, null],
});
function time_differnce(start) {
  const date1 = dayjs();
  time_diff.value = date1.diff(start, "minute");
}

watch(lexicon_flag, async (lexicon_flag) => {
  // making the dialog pop to null after every entry
  if (!lexicon_flag) {
    under_operation.Display = "";
    under_operation.Category = "";
    under_operation.Name = "";
    under_operation.Life_sty = "";
    under_operation.lab_type = "No Result";
    under_operation.surg_adv = "";
    under_operation.med_panel = ["", "", "", "", ""];
    setTimeout(() => {
      // refreshing after 2 secs of new lex creation
      chat_Append(interaction.history,true,true);
      chat_Append(interaction.notes,true,false);
    }, 2000);
  }
});

function chat_Append(chat, bulk_run=false,history=false) {
  // adding to interaction summary the individual chat
  
  let r=""
  if (chat?.length > 1) {
    chat=chat.trim()
    submit_progress.value += 2
    if(bulk_run){
      if(!history){
      result.value=[];
      interaction.notes =""}
      else{
        result_hist.value=[];
        interaction.history ="";
      }
      result_grouped.value=[];
    }
    if(!history){
    let x= interation_direct(chat);
    for(let i in x){
      if(x[i].Category=="Allergy"){
      result_hist.value.push(x[i]);
      x[i].is_historic=true;
      interaction.history = (interaction.history ?? "") + x[i].note + "; ";;
      result_hist.value=renormalise_input(result_hist.value);
    }
      else if(x[i].Category!="Junk"){
      result.value.push(x[i]);
      x[i].is_historic=false;
      interaction.notes = (interaction.notes ?? "") +x[i].note+ "; ";}
    }
    result.value=renormalise_input(result.value);
    r=result.value;
    
    //console.log(result.value);
  }else{
    let y= interation_direct(chat);
    for(let i in y){
      result_hist.value.push(y[i]);
      y[i].is_historic=true;
      if(y[i].Category!="Junk"){
      interaction.history = (interaction.history ?? "") + y[i].note + "; ";}
    }
    result_hist.value=renormalise_input(result_hist.value);
    //console.log(result.value);
    r=result_hist.value;
  }    
  }
  interaction.chat = "";
  continuos_input.show_result = false;
  result_grouped.value = groupby_category([...result_hist.value, ...result.value]);
  //renormalise_input([...result_hist.value, ...result.value])
  return r;
}

async function new_lexiconcheck() {
  //check and create new lexicons
  if (result.value && submit_choice.value) {
    // only approved transcription will be added to lexicon
    //rechecking for any missed entries
    chat_Append(interaction.history,true,true);
    chat_Append(interaction.notes,true,false);
    let count = 1;
    let full_array= [...result_hist.value, ...result.value]
    full_array=renormalise_input(full_array)
    for (const key in full_array) {
      lexicon_stop_flag.value = true;
      if (full_array[key].new && full_array[key].Category == "Unknown") {
        //adding unknowns to comment
        interaction.notes = interaction.notes
          .replace(
            full_array[key].Original + ";",
            '"' + full_array[key].Original + '";',
          )
          .trim();
      } else if (
        full_array[key].new &&
        full_array[key].Category == "Meds"
      ) {
        lexicon_stop_flag.value = false;
        break; // breaking just incase of new meds added
      } else if (full_array[key].new) {
        submit_sp_dialog_flag.value = false;
        create_new_element(full_array[key]);
        await make_newLexicon(under_operation);
        count++;
        //  all other
      }
      // this for medicines without qualifiers-- need to stopped and then updated, a backup function is required to complete this
      // else if(!result.value[key].new && result.value[key].Category=="Meds" && !result.value[key].Qualifier[0] && (!result.value[key].Qualifier[0].medicine_form==null ||
      //  !result.value[key].Qualifier[0].dosage==null || !result.value[key].Qualifier[0].period==null)){
      //   //old added medicine, not having default qualifier
      //   create_new_element(result.value[key])
      //   break;
      //  }
      //
      if (key == full_array.length - 1) {
        setTimeout(
          () => {
            chat_Append(interaction.history,true,true);
            chat_Append(interaction.notes,true,false);
            submit_progress.value = 50;
            lexicon_stop_flag.value = false;
          },
          1000 * (count + 1),
        );
      }
    }
  } else {
    submit_progress.value = 50;
  }
  return;
}
function chat_search() {
  const chat = interaction.chat;

  if (chat.length > 2 && chat.indexOf('"')) {
    continuos_input.show_result = true;
    search_direct(chat);
  } else {
    continuos_input.show_result = false;
  }
}

function groupby_category(final_array) {
    return final_array.reduce((acc, item) => {
      if (!acc[item.Category]) {
        acc[item.Category] = [];
      }
      acc[item.Category].push(item);
      return acc;
    }, {});
  }
function renormalise_input(input){
  if(input.length>0){
    stop_submit.value = false;
    new_terms.value = false;
    let count =0;

    for (const i of input) {
      if (i.new && i.Functional.length>1) {
        if (i.Category == "Meds") {
          stop_submit.value = true;
        } else {
          new_terms.value = true;
        }
        // console.log(i.Item)
        // here we will start the fuzzy match in v2, fuzzy match will also introduce abbrv etc
      }
      //renumbering
      i.pos.splice(0);
      i.pos.push(count)
      count++;
    }
  }
  return input;
}

//patient history workings
let patient_x = createDocumentResource({
  doctype: 'Patient',
  name: props.Pat_id,
  setValue: {
    onSuccess(id) {
      patient_x.reload()
     // pat_hit_dialog.value=false
    },
    onError(errors) {
      //error.value=errors;
    },
  },
})
function change_history(node){
if(node.Category!="Allergy"){
  chat_Append(node.Original,false,node.is_historic);
  phraseCorrection(node, true);
  correction.value=false;
  remove_phrase()}
else{
  node.is_historic=true;
}
}

onMounted(() => {
lexicon_stop_flag.value=true;
  setTimeout(async() => {
      // refreshing after 2 secs of new lex creation
      patient_x.reload()
      interaction.history=patient_x.doc?.pat_hist;
      await library.refresh_library();
      chat_Append(interaction.history,true,true);
      lexicon_stop_flag.value=false;
    }, 2500);
  
  // You can also perform API calls here
  
});


function handleKeydown(e) {
  if (!continuos_input.show_result || !all_search.value?.length) {
    // If dropdown closed → Enter behaves normally
    if (e.key === "Enter") {
      chat_Append(interaction.chat);
    }
    return;
  }

  switch (e.key) {
    case "ArrowDown":
      e.preventDefault();
      activeIndex.value =
        (activeIndex.value + 1) % all_search.value.length;
      scrollIntoView();
      break;

    case "ArrowUp":
      e.preventDefault();
      activeIndex.value =
        (activeIndex.value - 1 + all_search.value.length) %
        all_search.value.length;
      scrollIntoView();
      break;

    case "Enter":
      e.preventDefault();
      if (activeIndex.value >= 0) {
        selectItem(all_search.value[activeIndex.value]);
      } else {
        chat_Append(interaction.chat);
      }
      break;

    case "Escape":
      continuos_input.show_result = false;
      activeIndex.value = -1;
      break;
  }
}


function scrollIntoView() {
  nextTick(() => {
    const el = resultRefs.value[activeIndex.value];
    el?.scrollIntoView({ block: "nearest" });
  });
}

function selectItem(item) {
  if (item[0] === "Meds") {
    interaction.chat = item[7] + " " + item[2];
    continuos_input.show_result = false;
  }

  else if (item[0] === "Symptoms") {
    interaction.chat = item[1];
    continuos_input.show_result = false;
  }

  else if (item[0] === "Diagnosis") {
    interaction.chat = item[1];
    continuos_input.show_result = false;
  }

  else if (item[0] === "labs") {
    interaction.chat = item[2];
    continuos_input.show_result = false;
  }

  else if (item[0] === "surg") {
    interaction.chat = item[2];
    continuos_input.show_result = false;
  }

  else if (item[0] === "Allergy") {
    interaction.chat = item[1];
    continuos_input.show_result = false;
  }

  activeIndex.value = -1;
}


</script>
