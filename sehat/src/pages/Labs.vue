<template>
 
   <div v-if="!sel_pat.details" class="mt-4 md:mx-[200px] flex item-center justify-center gap-3 p-3">
    <Badge :variant="'solid'" class=" block w-full rounded-full px-2 py-2 font-serif item-center justify-center
    bg-gradient-to-r from-red-800 to-red-600 hover:from-red-900 hover:to-red-700 text-white transition-all" size="xl" label="No Patient Selected"/>
  </div>
  <div v-else-if="!result.length" class="mt-4 md:mx-[200px] flex flex-row item-center justify-center gap-3 p-3">
    <Badge :variant="'solid'" class=" block w-full rounded-full px-2 py-2 font-serif item-center justify-center
    bg-gradient-to-r from-red-800 to-red-600 hover:from-red-900 hover:to-red-700 text-white transition-all" size="xl" label="No Results"/>
    <Badge :variant="'solid'" class=" block w-full rounded-full px-2 py-2 font-serif item-center justify-center
    bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-900 hover:to-blue-700 text-white transition-all" 
    size="xl" label="+ Add New Labs" @click="create_result=true"/>
  </div>
    <div v-else>
      <div class="mt-3 grid grid-cols-5 gap-3 p-3">
        <Switch size="sm" label="Show Results By Test Results" description="" :disabled="false" v-model="show_bytest"/>
        <div class="col-span-3"></div>
        <Badge :variant="'solid'" class=" block w-full rounded-full font-serif item-center justify-center
    bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-900 hover:to-blue-700 text-white transition-all" 
    size="lg" label="+ Add New Labs" @click="create_result=true"/>
      </div>
    <Tabs v-if="!show_bytest"
      as="div"
      class="border bg-gray-50/10 font-seriff"
      :tabs="result"
    vertical>
      <template #tab-panel="{ tab }">
        <div class="p-5 grid grid-cols-10">
            
          <!--<div v-html="tab.full"></div>-->
          <div class="col-span-4">
            <ul v-for="(item) in tab.tests" class="grid grid-cols-3 justify-start items-center border">
              <li>{{item.test}}</li>
              <li>{{ item.result }}</li>
              <li>{{ item.uom }}</li>
            </ul>

          </div>
          <div class="col-span-4"></div>
          <Button
          @click="cancel_confirm(tab.name)"
          :variant="'solid'"
          theme="red"
          size="md"
          :loadingText="null"
          :link="null"
        >
        <FeatherIcon class="w-6 h-6 rounded-full text-white"  name="trash-2"/>
        </Button>
    
    </div>
      </template>
    </Tabs>
    <Tabs v-if="show_bytest"
      as="div"
      class="border bg-yellow-100/80 font-seriff"
      :tabs="test_array"
    vertical>
      <template #tab-panel="{ tab }">
        <div class="p-5 grid grid-cols-10 gap-2 bg-yellow-50">
            
          <!--<div v-html="tab.full"></div>-->
          <div class="col-span-4 pt-5 ">
            <ul v-for="(item) in tab.tests" class="grid grid-cols-3 justify-start items-center border">
              <li>{{item.date}}</li>
              <li>{{ item.result }}</li>
              <li>{{ item.uom }}</li>
            </ul>
          </div>
          <div class="col-span-6 pt-5"> 
            <v-frappe-chart class=""
    type="line"
    :labels="tab.dates"
    :title="tab.label"
    :data="[{ name: tab.uom, values: tab.resultss },]"
    :colors="get_color()"
    :line-options="{dotSize: 4, regionFill: 1 }"
    :axis-options= "{ xAxisMode: 'tick'}"
    :y-regions="[
    {
      label: 'Reference Range',
      start: tab.min,
      end: tab.max,
      options: { labelPos: 'right' },
    },
  ]"
    />
</div>
        </div>
      </template>
    </Tabs>
  </div>
  <Dialog v-model="create_result" :options="{title: 'Add Lab Results', size: '3xl'}">
  <template #body-content>
    <div class="flex flex-col gap-3">
      <div class="grid grid-cols-2 pr-[60px]">
      <FormControl :type="'date'"  variant="outline" label="Result Date" :required="true" v-model="lab_result_date"/>
      </div>
      <div class="grid grid-cols-6 gap-2">
        <div class="col-span-5 font-mono">
        <Autocomplete  :options="all_labs" v-model="lab_result_line" placeholder="Select All Lab Results" :multiple="true"/>
        <!-- <FormControl :type="'text'" variant="outline"  placeholder="Test Result" v-model="lab_result_line[1]" />
        <FormControl :type="autocomplete" :options="all_uom" variant="outline" placeholder="UOM" v-model="lab_result_line[2]"/>
        <button>add line</button> --></div>
        <Button @click="make_new_lab=true" v-if="!make_new_lab" >+New Lab</Button>
        <Button @click="make_new_lab=false" v-if="make_new_lab">- Clear</Button>
      </div>
      <div v-if="make_new_lab">
        Create a New Lab
        <span class="grid md:grid-cols-5 gap-2 text-xs font-mono border p-2 hover:shadow-md bg-green-100/30">
              <FormControl :type="'text'" variant="outline"  placeholder="Test Name" v-model="new_lab[0]" class="col-span-2" />
              <Autocomplete :options="all_uom" variant="outline" placeholder="UOM" v-model="new_lab[1]"/>
              <FormControl :type="'number'" variant="outline"  placeholder="Min Range" v-model="new_lab[2]" />
              <FormControl :type="'number'" variant="outline"  placeholder="Max Range" v-model="new_lab[3]" />
              <div v-if="!new_lab[0]" class="font-2xs text-red-700 col-span-2" >Add Lab Name,Dont Use "-"</div> 
              <div v-if="!new_lab[1]" class="font-2xs text-red-700">Add Lab UOM</div>
              <div v-if="!new_lab[2]" class="font-2xs text-red-700">Add Min Range</div>
              <div v-if="!new_lab[3]" class="font-2xs text-red-700">Add Max Range</div>
              <Button variant="solid" @click="update_uom('new',new_lab[0],new_lab[1].label,new_lab[2],new_lab[3])" theme="green">Add New Lab</Button>
              <Button variant="subtle" class="ml-5" @click="clear_new" theme="green">Clear</Button>

        </span>
      </div>
      <div v-if="!make_new_lab">
            <ul class= "pt-3">
            <li v-for="(item) in lab_result_line" class="p-1"> 
            <span class="grid md:grid-cols-5 gap-2 text-xs font-mono border p-2 hover:shadow-md bg-blue-100/30">
              <p class="font-serif flex justify-center items-center p-1">{{item.label}}</p>
              <FormControl :type="'number'" variant="outline"  placeholder="Test Result" v-model="item.result" />
              <Autocomplete :options="all_uom" variant="outline" placeholder="UOM" v-model="item.uom"/>
              <FormControl :type="'number'" variant="outline"  placeholder="Min Range" v-model="item.min_range" />
              <FormControl :type="'number'" variant="outline"  placeholder="Max Range" v-model="item.max_range" />
              <div></div>
              <div v-if="!item.result" class="font-2xs text-red-700">Add Result</div>
              <div v-if="!item.uom" class="font-2xs text-red-700">Please Add UOM</div>
              <div v-if="!item.min_range" class="font-2xs text-red-700">Add Min Range</div>
              <div v-if="!item.max_range" class="font-2xs text-red-700">Please Max Range</div>
          </span>
          </li>
        </ul>
      </div>
      <div class="font-2xs text-red-700">{{ error }}</div>
      <ErrorMessage :message="update_uom.error"/>
      <ErrorMessage :message="make_labss.error"/>
    </div>
  </template>
  <template #actions v-if="!make_new_lab">
    <Button variant="solid" @click="submit_labs" theme="blue">
      Confirm
    </Button>
    <Button variant="subtle" class="ml-5" @click="clear" theme="blue">
      Clear
    </Button>
  </template>
</Dialog>
<Dialog
  :options="{
    title: 'Confirm Deletion',
    message: 'Are you sure you want to Delete?',
    size: 'lg',
    icon: {
      name: 'alert-triangle',
      appearance: 'warning',
    },
    actions: [
      {
        label: 'Delete',
        variant: 'solid',
        theme: 'red',
        onClick: () => {
                      return cancel_lab(cancel_doc);
                    },
      },
      {
        label: 'Cancel',
        variant: 'solid',
        onClick: () => {
                      return cancel=false;
                    },
      },
    ],
  }"
  v-model="cancel"
/>
    </template>
    <script setup>
        import { onMounted, ref, watch, inject} from 'vue';
        import { Tabs,Switch,Button,Autocomplete,Badge,Dialog, FormControl,ErrorMessage,FeatherIcon } from 'frappe-ui';
        import { createListResource,createResource } from 'frappe-ui';
        import dayjs from 'dayjs';
        
        //Declaring Variable
        let lab_tests=ref([]);
        let sel_pat=inject("patient");
        let result=ref([]);
        let test_array=ref([]);
        let show_bytest=ref(false);
        let create_result=ref(false);
        let lab_result_date=ref("");
        let lab_result_line=ref([]);
        let all_labs=ref([])
        let all_uom=ref([])
        let error=ref("")
        let cancel=ref(false)
        let cancel_doc=ref("")
        let make_new_lab=ref(false)
        let new_lab=ref([null,null,null,null])
        //let color = ['#00bdff', '#1b3bff', '#8F00FF', '#ff0011', '#ff7300', '#ffd600', '#00c30e', '#65ff00', '#d200ff', '#FF00FF', '#7d7d7d', '#5d5d5d'];
    
        watch(() => sel_pat.details,
            (details) => {
            if (details) {
            get_lab();
        }
        else{
          result.value.splice(0);
          test_array.value.splice(0);
        }
        }
        );
function get_lab(){
lab_tests = createListResource({
doctype: "Lab Test",
fields: ["name","result_date","`tabQuick Create Lab Results`.test_name",
"`tabQuick Create Lab Results`.result","`tabQuick Create Lab Results`.uom","`tabQuick Create Lab Results`.min_normal_range","`tabQuick Create Lab Results`.max_normal_range"],
filters: {
  patient: sel_pat.details.name,
  docstatus: 1
},
pageLength: 200000,
orderBy: 'result_date asc',
auto: true,
transform(data) {
result.value.splice(0);
test_array.value.splice(0);
for (let d of data) {
let label= dayjs(d.result_date).format("DD/MM/YYYY");
let test_name= d.test_name;
if(d.test_name){
let arr= test_name.split("-").map(function(item) {
          return item.trim();
        });
test_name=arr[0];}

const existingDateGroup = result.value.find(group => group.label === label);
if (existingDateGroup) {
  existingDateGroup.tests.push({ test: test_name, result: d.result, uom: d.uom });
} else {
  result.value.push({
    label: label,
    name: d.name,
    tests: [{ test: test_name, result: d.result, uom: d.uom }]
  });
}

const existingLabGroup = test_array.value.find(group => group.label === test_name);
if (existingLabGroup) {
  // If the group exists, push the new result into the tests array
  existingLabGroup.tests.push({
    date: label,
    result: d.result,
    uom: d.uom
  });
  existingLabGroup.dates.push(label);
  existingLabGroup.resultss.push(d.result);

} else {
  // If no matching group is found, create a new entry
  test_array.value.push({
    label: test_name,
    tests: [{
      date: label,
      result: d.result,
      uom: d.uom
    }],
    dates:[label],
    resultss:[d.result],
    uom: d.uom,
    min: d.min_normal_range,
    max: d.max_normal_range,
  });
}
}
}
});
}
onMounted(() => {
  get_lab()
})
const labs = createListResource({
  doctype: "Lab Test Template",
  fields: ["lab_test_name","name","lab_test_uom","min_normal_range","max_normal_range"],
  filters:{
    disabled: 0,
    lab_test_template_type: "Single"
  },
  auto: true,
  pageLength: 500,
  transform(data) {
        for (let d of data) {
            let label = d.lab_test_name;
            let value = d.name;
            let uom = { "label": d.lab_test_uom, "value": d.lab_test_uom };
            let min_range =d.min_normal_range;
            let max_range =d.max_normal_range;
            let pt = { "label": label, "description": uom.label, "value": value, "uom": uom, "min_range": min_range, "max_range": max_range, "result":""};
            all_labs.value.push(pt);
        }
        }
});
const lab_uom = createListResource({
  doctype: "Lab Test UOM",
  fields: ["name"],
  auto: true,
  pageLength: 200,
  transform(data) {
        for (let d of data) {
            let label = d.name;
            let pt = { "label": label, "value": label};
            all_uom.value.push(pt);
        }
        }
});
function update_uom(op,item,uom,min,max){
  console.log(uom);
const update_labs = createResource({
    url: 'healthcare.api.update_lab_uom',
    makeParams(){
        return {
            op: op,
            lab: item,
            uom: uom,
            min_range:min,
            max_range:max,
        }
    },
    onSuccess: (lab_temp) => {
      if(make_new_lab.value){
        all_labs.value.splice(0);
        new_lab.value.splice(0);
        labs.fetch();
        make_new_lab.value=false
      }
      
      
    console.log("success in"+lab_temp);  
  }   
})
update_labs.submit(op,item,uom,min,max)
}

const make_labss = createResource({
    url: 'healthcare.api.make_lab_results',
    makeParams(){
        return {
            patient:sel_pat.details,
            date: lab_result_date.value,
            data_x: lab_result_line.value
        }
    },
    onSuccess: (data_referjj) => {
      lab_result_date.value="";
      lab_result_line.value.splice(0);
      create_result.value=false;

      get_lab();
    console.log(data_referjj);  
  }   
})


function submit_labs(){
  if(lab_result_date.value && lab_result_line.value.length){
    error.value="";
    for(let item of lab_result_line.value){
      if(item.uom && item.result){
        console.log("i am inside submit labs")
       update_uom("update",item.value,item.uom.label,item.min_range,item.max_range);
      }else{
        error.value=error.value+" "+item.label+": Uom or result is not entered";
      }
    }
    if(!error.value){
      make_labss.submit();}
  }else{
    error.value="Please Add Date and at least 1 lab result";
  }
}

function clear_new(){
  //lab_result_date.value="";
  new_lab.value.splice(0);
}
function get_color(){
  let color = ['#00bdff', '#1b3bff', '#8F00FF', '#ff0011', '#ff7300', '#ffd600', '#00c30e', '#65ff00', '#d200ff', '#FF00FF', '#de980b', '#380404'];
  let idx = Math.floor(Math.random() * color.length);
  let x=[]
  x.push(color[idx])
  return x

}
function cancel_lab(lab_name){
  //console.log("inside cancel"+lab_name)
  const cancel_labs = createResource({
    url: 'healthcare.api.cancel_lab_result',
    makeParams(){
        return {
          lab:lab_name,
        }
    },
    onSuccess: (data_referjj) => {
    get_lab();
    cancel_doc.value="";
    cancel.value=false;
    //console.log(data_referjj);  
  }   
})
cancel_labs.submit()
}
function cancel_confirm(doc_name){
  cancel_doc.value=doc_name;
  cancel.value=true
}

</script>