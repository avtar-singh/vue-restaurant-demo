import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import DashboardLayout from '@/layout/DashboardLayout'
import AuthLayout from '@/layout/AuthLayout'
Vue.use(Router)

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
    if (to.fullPath != "/") {
      next({ name: "Login", query: { redirect: to.fullPath } });
    } else {
      next({ name: "Login"})
    }
  }
};

export default new Router({
  mode: "history",
  linkExactActiveClass: "active",
  routes: [
    {
      path: "/",
      redirect: "vendors",
      component: DashboardLayout,
      beforeEnter: ifAuthenticated,
      children: [
        {
          path: "/users",
          name: "List of Users",
          component: () => import("./views/Users/List.vue"),
          beforeEnter: ifAuthenticated,
        },
        {
          path: "/users/:id",
          name: "View User Information",
          component: () => import("./views/Users/View.vue"),
          beforeEnter: ifAuthenticated,
        },
        {
          path: "/vendors",
          name: "List of Vendors",
          component: () => import("./views/Vendors/List.vue"),
          beforeEnter: ifAuthenticated,
        },
        {
          path: "/vendors/create",
          name: "Create New Vendor",
          component: () => import("./views/Vendors/Add.vue"),
          beforeEnter: ifAuthenticated,
        },
        {
          path: "/vendors/:id",
          name: "Update Vendor",
          component: () => import("./views/Vendors/Edit.vue"),
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
          component: () => import("./views/Login.vue"),
          beforeEnter: ifNotAuthenticated,
        },
      ],
    },
  ],
});
