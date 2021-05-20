import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import VueYoutube from "vue-youtube";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faMapMarkerAlt,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faChevronDown,
  faPlus,
  faMinus,
  faInfoCircle
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(
  faMapMarkerAlt,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faChevronDown,
  faPlus,
  faMinus,
  faInfoCircle
);

Vue.component("fontAwesomeIcon", FontAwesomeIcon);

require("@/assets/sass/style.sass");

Vue.use(VueYoutube);

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
