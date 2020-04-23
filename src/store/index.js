import Vue from "vue";
import Vuex from "vuex";
import vendor from "./modules/vendor";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    vendor,
  },
});
