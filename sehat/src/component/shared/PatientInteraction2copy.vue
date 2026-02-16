<template>
  <div class="space-y-4 pt-20">
      {{ x }}

  </div>
</template>
<script setup>
import { createListResource } from 'frappe-ui'
import { ref, onMounted, computed } from "vue";
const x= ref()
let todos = createListResource({
  doctype: 'Patient History',
  fields: ['*'],
  orderBy: 'creation desc',
  pageLength: 200000000,
  parent: 'Patient Encounter',
  transform(data) {
      x.value=groupby_category(data)
    },
})
todos.fetch()

function groupby_category(final_array) {
    return final_array.reduce((acc, item) => {
      if (!acc[item.parent]) {
        acc[item.parent] = [];
      }
      acc[item.parent].push(item.history_type+","+item.details);
      return acc;
    }, {});
  }
</script>