import './index.css'

import { createApp, reactive } from 'vue'
import router from './router'
import App from './App.vue'
import Chart from "vue-frappe-chart"

import {
  Button,
  Card,
  Input,
  setConfig,
  frappeRequest,
  resourcesPlugin,
} from 'frappe-ui'

let app = createApp(App)
const patient = reactive({
    details:"",
    appoint:"",
    ref_flag:false
});

app.provide("patient", patient)

setConfig('resourceFetcher', frappeRequest)

app.use(router)
app.use(resourcesPlugin)
app.use(Chart)
app.component('Button', Button)
app.component('Card', Card)
app.component('Input', Input)

app.mount('#app')
