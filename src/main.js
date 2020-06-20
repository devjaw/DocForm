import Vue from "vue";
import App from "./App.vue";
import router from "./router";
//import store from "./store";
import vuetify from './plugins/vuetify';
import NewDoc from './views/NewDoc.vue';
import VuetifyConfirm from "vuetify-confirm";

Vue.component('NewDoc', NewDoc);
Vue.use(VuetifyConfirm, { vuetify })

Vue.config.productionTip = false;



new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");