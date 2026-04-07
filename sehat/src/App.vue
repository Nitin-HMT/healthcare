<script setup>
import Sidebar from "@/component/ui/Sidebar.vue";
import PageHeader from "@/component/ui/PageHeader.vue";
import { useUiStore } from "@/stores/UiStore";
import { useUserStore } from "@/stores/userStore";
import {Dialog,Spinner} from "frappe-ui";

import { useinteractionLibraryStore } from "@/stores/interactionLibraryStore.js";
const library = useinteractionLibraryStore();

const ui = useUiStore();
const user =useUserStore();

setTimeout(() => {
      // refreshing after 2 secs of new lex creation
      //console.log(user.);
      if(user.role){
library.refresh_library();}
      //OPD Doctor
    }, 100);
  //building medical lexicon
  
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-gray-50">
    <Sidebar v-if="user.name"/>
    
    <div
      class="flex-1 h-screen overflow-hidden bg-gray-50 flex flex-col transition-all duration-300"
      :class="[
        'ml-0',
        {
          'md:ml-16': ui.isSidebarCollapsed,
          'md:ml-64': !ui.isSidebarCollapsed,
        },
      ]"
    >
      <PageHeader v-if="user.name"/>
      <div v-else class="text-xs text-teal-700 pt-2">Welcome {{user.name}}!!</div>
      
      <!-- RouterView takes remaining height after header -->
      <RouterView class="mt-14 min-h-0 overflow-hidden" />
    </div>
  </div>
  
    <Dialog v-model="library.loading_library" :options="{ size: 'md' }">
    <template #body-title>
      <div />
    </template>
    <template #body-content>
      <div class="flex items-center justify-center flex-col">
        <div class="text-sm text-gray-500">
          Building Libraries, Please Wait...
        </div>
        <Spinner class="w-12 text-gray-500" v-if="library.loading_library" />
      </div>
    </template>
  </Dialog>
</template>
