import "./index.css";

import { createApp, reactive } from "vue";
import router from "./router";
import App from "./App.vue";
import { createPinia } from "pinia";
import Chart from "vue-frappe-chart";
import { fetchInitialData } from "@/data/initialdata";

import {
  Button,
  Card,
  Input,
  setConfig,
  frappeRequest,
  resourcesPlugin,
} from "frappe-ui";

let app = createApp(App);
const patient = reactive({
  details: "",
  appoint: "",
  ref_flag: false,
});

app.provide("patient", patient);

setConfig("resourceFetcher", frappeRequest);

app.use(router);
app.use(resourcesPlugin);
app.use(Chart);
app.component("Button", Button);
app.component("Card", Card);
app.component("Input", Input);
app.use(createPinia());
app.mount("#app");
fetchInitialData()
  .then(() => console.log("Initial data loaded"))
  .catch((err) => console.error("Failed to load initial data:", err));
