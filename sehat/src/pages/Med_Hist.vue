<template>
  <div v-if="!sel_pat.details" class="mt-4 md:mx-[200px] flex item-center justify-center gap-3 p-3">
    <Badge :variant="'solid'" class=" block w-full rounded-full px-2 py-2 font-serif item-center justify-center
    bg-gradient-to-r from-red-800 to-red-600 hover:from-red-900 hover:to-red-700 text-white transition-all" size="xl" label="No Patient Selected"/>
  </div>
  <div v-else-if="!all_labs.length" class="mt-4 md:mx-[200px] flex item-center justify-center gap-3 p-3">
    <Badge :variant="'solid'" class=" block w-full rounded-full px-2 py-2 font-serif item-center justify-center
    bg-gradient-to-r from-red-800 to-red-600 hover:from-red-900 hover:to-red-700 text-white transition-all" size="xl" label="No History"/>
  </div>

<Tabs v-else
  as="div"
  class="border bg-gray-50/10 font-seriff"
  :tabs=all_labs
vertical>
  <template #tab-panel="{ tab }">
    <div class="p-5 grid grid-cols-10">
      <!--<div v-html="tab.full"></div>-->
      <div class="col-span-8"><TextEditor
    editor-class="prose-sm min-h-[4rem]"
    :content="tab.full"
    @change="(val) => value = val"
    :bubbleMenu="true"
    :fixed-menu="false"
  /></div>
  <div><Button class="rounded-full"
    :ref_for="true"
    size="lg"
    :variant="'outline'"
    theme="gray"
    :loading="false"
    :loadingText="null"
    :disabled="false"
    :link="null"
    @click="printed(tab.ref_name)">
      <FeatherIcon class="w-5 h-5 text-black" name="printer"/>
    </Button></div>

</div>
  </template>
</Tabs>
</template>
<script setup>
    import { reactive, ref, watch, inject } from 'vue';
    import { Tabs,TextEditor,Button,FeatherIcon,Badge } from 'frappe-ui';
    import { createListResource } from 'frappe-ui';
    import dayjs from 'dayjs';
    
    //Declaring Variable
    
    let all_labs = ref([]);
    let sel_pat=inject("patient");
    let lab_tests=ref([]);

    watch(() => sel_pat.details,
        (details) => {
        if (details) {
        lab_tests = createListResource({
        doctype: "Patient Medical Record",
        fields: ["*"],
        filters: {
            patient: sel_pat.details.name,
            reference_doctype: "Patient Encounter",
        },
        orderBy: 'communication_date desc',
        auto: true,
        transform(data) {
            all_labs.value.splice(0);
        for (let d of data) {
            let label= dayjs(d.communication_date).format("DD/MM/YYYY");
            let pt = { "label": label,"full":d.subject, "ref_name":d.reference_name};
            all_labs.value.push(pt);
        }
        }
    });
    }
    else{
      all_labs.value.splice(0);
    }
    }
    );
    function printed(prescription){
        window.open("/app/print/Patient Encounter/"+prescription, "_blank");
    }
    
    lab_tests = createListResource({
        doctype: "Patient Medical Record",
        fields: ["*"],
        filters: {
            patient: sel_pat.details.name,
            reference_doctype: "Patient Encounter",
        },
        orderBy: 'communication_date desc',
        auto: true,
        transform(data) {
            all_labs.value.splice(0);
        for (let d of data) {
            let label= dayjs(d.communication_date).format("DD/MM/YYYY");
            let pt = { "label": label,"full":d.subject, "ref_name":d.reference_name};
            all_labs.value.push(pt);
        }
        }
    });
</script>