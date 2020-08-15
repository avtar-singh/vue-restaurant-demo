import Vue from "vue";
import Router from "vue-router";
import store from "../store";
import DashboardLayout from "@/layout/DashboardLayout";
import AuthLayout from "@/layout/AuthLayout";
Vue.use(Router);

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next();
    return;
  } else {
    next("/");
  }
};

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next();
    return;
  } else {
    next({ name: "Login" });
  }
};

export default new Router({
  mode: "history",
  linkExactActiveClass: "active",
  routes: [
    {
      path: "/",
      redirect: "restaurants",
      component: DashboardLayout,
      beforeEnter: ifAuthenticated,
      children: [
        {
          path: "/restaurants",
          name: "List of Restaurants",
          component: () => import("../views/Restaurants/List.vue"),
          beforeEnter: ifAuthenticated,
        },
        {
          path: "/restaurants/create",
          name: "Create New Restaurant",
          component: () => import("../views/Restaurants/Add.vue"),
          beforeEnter: ifAuthenticated,
        },
      ],
    },
    {
      path: "/",
      redirect: "login",
      component: AuthLayout,
      beforeEnter: ifNotAuthenticated,
      children: [
        {
          path: "/login",
          name: "Login",
          component: () => import("../views/Login.vue"),
          beforeEnter: ifNotAuthenticated,
        },
      ],
    },
  ],
});
