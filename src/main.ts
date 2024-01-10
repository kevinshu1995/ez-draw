import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import Router from "./route";
import { createPinia } from "pinia";

import "virtual:uno.css";
import "@unocss/reset/tailwind.css";

import SvgIcon from "./components/global/SvgIcon.vue";

import PluginToast from "./plugins/toast";
import PluginAlert from "./plugins/alert";
import PluginLoading from "./plugins/loading";

const pinia = createPinia();

const app = createApp(App);

// global components
app.component("SvgIcon", SvgIcon);

// third party plugins
app.use(Router).use(pinia);

// custom plugins
app.use(PluginToast, {}).use(PluginAlert).use(PluginLoading);

app.mount("#app");

