import Vue from "vue";
import Vuex from "vuex";
import restaurants from "./modules/restaurants";
import authentication from "./modules/authentication";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    authentication,
    restaurants,
  },
});
