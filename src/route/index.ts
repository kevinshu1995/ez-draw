import { createRouter, createWebHistory } from "vue-router";

const routes = [
    { path: "/", name: "Home", component: () => import("src/view/Home.vue") },
    { path: "/dashboard", name: "Dashboard", component: () => import("src/view/Dashboard.vue") },
    { path: "/instagram", name: "Instagram", component: () => import("src/view/Instagram.vue") },
    { path: "/setting", name: "Setting", component: () => import("src/view/Setting.vue") },
    { path: "/redirect/:action", name: "Redirect", component: () => import("src/view/Redirect.vue") },
    { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(_, __, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { top: 0, behavior: "smooth" };
        }
    },
});

export default router;

