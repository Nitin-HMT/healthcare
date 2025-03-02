<template>
    <div :class="cardClass">
      <span :class="underlineColor">
        <Avatar
          :shape="'circle'"
          :ref_for="true"
          :image="image"
          label="EY"
          size="xl"
        />
        {{ title }}
        <!--<button @click="cartDialogshown=true" class="flex flex-start">
        <FeatherIcon class="h-6 text-pink-900/80" name="shopping-cart"/>
      </button> -->
      </span>
      <span v-for="item in items" :key="item.value" class="flex items-center justify-between font-sans">
        <p v-if="title=='Diagnosis'">{{ item.label }}</p>
        <p v-else-if="title=='Medicine'">{{ item.label }} | {{ item.additional_attr }} | {{ item.additional_attr_2 }}</p>
        <p v-else-if="title=='Procedures'">{{ item.label }} | {{ dateformat(item.additional_attr,"DD/MM/YYYY HH:mm") }} | {{ item.additional_attr_2 }}</p>
         <p v-else>{{ item.label }} {{ item.additional_attr }} {{ item.additional_attr_2 }}</p> <!--{{ dateformat(item.additional_attr,"DD/MM/YYYY") }} -->
      </span>
    </div>
  </template>
  
  <script setup>
  import { Avatar } from 'frappe-ui';
  import { dateformat} from "@/utils.js";
  defineProps({
    title: String,
    items: Array,
    image: String,
    underlineColor: String,
    cardClass: String,
  });
  </script>  