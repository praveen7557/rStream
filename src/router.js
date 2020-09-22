import { createRouter, createWebHistory } from "vue-router";
import Home from "./components/Home.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/r/:sub", component: Home },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
