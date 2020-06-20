import Vue from "vue";
import Router from "vue-router";


Vue.use(Router);

export default new Router({
  routes: [
    {
      name: "home",
      path: "/",
      component: () => import("@/views/Home")
    },
    {
      name: "NewDoc",
      path: "/NewDoc",
      component: () => import("@/views/NewDoc")
    },
    {
      name: "MasterData",
      path: "/MasterData",
      component: () => import("@/views/MasterData")
    },
  ]
});