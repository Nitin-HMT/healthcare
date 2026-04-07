<template>
  <div>
    <Dropdown
      :options
    >
      <Button class="bg-white rounded-full">
        <template #icon>
          <Avatar
            v-if="user.avatar"
            :shape="'circle'"
            :ref_for="true"
            :image="user.avatar"
            label="avatar"
            size="md"
          />
        </template>
      </Button>
      <span
        v-if="!collapsed"
        class="truncate px-2 text-xl font-medium text-white hover:text-gray-900"
      >
        {{ user.name }}
      </span>
    </Dropdown>
  </div>
</template>

<script setup>
import { Avatar, Dropdown, Button } from "frappe-ui";
import { useRouter } from "vue-router";
import { session } from "@/data/session";
import { useUserStore } from "@/stores/userStore";

const props = defineProps({
  collapsed: Boolean,
});

const router = useRouter();
const user = useUserStore();
const options = [
        // {
        //   label: 'Open Sales',
        //   onClick: () => {
        //     reDirect();
        //   },
        // },
        // {
        //   label: 'Settings',
        //   onClick: () => {
        //     reDirect();
        //   },
        // },
        {
          label: 'Logout',
          onClick: () => {
            session.logout.submit();
          },
        },
      
]
if(user.role.includes('Sales Manager')){
  options.unshift({
          label: 'Open Sales',
          onClick: () => {
            reDirect();
          },
        })
}

function reDirect() {
 // window.location.href = "/app";
 if(user.role.includes('Sales Manager')){
  window.open("/app", '_blank', 'noreferrer');
 }
   
}
</script>
