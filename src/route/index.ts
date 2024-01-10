import { createRouter, createWebHistory } from "vue-router";

const routes = [
    { path: "/", name: "Home", component: () => import("src/view/Home.vue") },
    { path: "/instagram", name: "Instagram", component: () => import("src/view/Instagram.vue") },
    { path: "/redirect/:action", name: "Redirect", component: () => import("src/view/Redirect.vue") },
    { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;

