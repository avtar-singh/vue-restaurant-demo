/*!

=========================================================
* Vue Argon Dashboard - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import './registerServiceWorker'
import ArgonDashboard from './plugins/argon-dashboard'
import VueProgressBar from "vue-progressbar";

Vue.config.productionTip = false

// Register Components globally
Vue.use(VueProgressBar, {
  color: "#2dce89",
  // color: "linear-gradient(to right, #e5405e 0%, #ffdb3a 25%, #3fffa2 50%, #3fffa2 50%, #1a9be0 73%, #ba68ed 100%)",
  failedColor: "red",
  thickness: "0.24rem",
  location: "bottom",
});

Vue.use(ArgonDashboard)
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
