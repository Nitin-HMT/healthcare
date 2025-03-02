<template>
  <div>
    <Header></Header>
    <Ptsearch/>
    <OPD/>
    <router-view/>
  </div>
</template>
<script setup>
import Header from '@/component/Header.vue';
import Ptsearch from '@/component/Patient_search.vue';
import OPD from '@/component/OPD.vue';
</script>
