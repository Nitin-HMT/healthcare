<template>
    <div class="bg-green-50 bg-opacity-30 y-2 grid grid-cols-2">
       <!--- <div>
        <Avatar class="mx-6"
        :shape="'square'"
        :ref_for="true"
        image="https://github.com/BuildWithHussain/vtf-training/assets/34810212/f2574fab-2878-4c63-a721-6e30535cd4ce"
        label="EY"
        size="2xl"
        />
        </div>-->
        <div><h2 class=" mt-3 font-bold font-sans text-md text-gray-700 px-2">Hello {{x[0]}}!</h2></div>
        <div class=" mx-6 mt-3 flex justify-end ">
        <Dropdown
            :options="[
                {
                label: 'Switch to Desk',
                onClick: () => {
                    reDirect()
                    },
                },
                {
                label: 'Logout',
                onClick: () => {
                    session.logout.submit()
                    },
                },
            ]"
            >
            <Button>
                <template #icon>
                    <Avatar v-if="image" class="mx-2"
                    :shape="'circle'"
                    :ref_for="true"
                    :image="image"
                    label="avatar"
                    size="md"
                    />
                </template>
            </Button>
        </Dropdown>
    </div>
    </div>
    <!--<Button @click="router.push({ 'name' : 'home'})">Go to Home</Button>-->
</template>
<script setup>
import { Avatar, Dropdown,Button, createListResource } from 'frappe-ui';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { sessionUser, session } from '@/data/session';

const router = useRouter();
const user_res = sessionUser();

const cookies = new URLSearchParams(document.cookie.split('; ').join('&'))
let full_names = cookies.get('full_name')
let image = cookies.get('user_image')
let x =ref([]);
let user = createListResource ({
  doctype: 'Employee',
  fields: ['salutation', 'first_name', 'last_name'],
  filters: {
        user_id: cookies.get('user_id')
    },
    auto: true,
    transform(data) {
    data.forEach(d => {
      let y = d.salutation+" "+d.first_name+" "+d.last_name
      x.value.push(y);
    });
  }
})


function reDirect(){
    window.location.href = "/app";
}
</script>