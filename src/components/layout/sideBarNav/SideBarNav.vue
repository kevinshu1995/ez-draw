<template>
    <div class="relative">
        <div :class="['absolute left-0 top-0 w-full h-full z-2 backdrop-blur bg-base-200/10 cursor-pointer', !isMobileOpen && 'hidden']" @click="forceCloseOnMobile"></div>
        <!-- TODO Mobile style -->
        <aside
            :class="[isExpanding && 'w-64', !isMobileOpen && '-translate-x-full', 'fixed top-0 left-0 z-3 h-screen sm:translate-x-0 bg-base-200 transition-all']"
            @mouseenter="expandSideBar"
            @mouseleave="collapseSideBar"
        >
            <div class="h-full px-2 py-2 overflow-y-auto">
                <div class="flex flex-col items-stretch">
                    <div class="flex-grow flex flex-col items-stretch mb-20">
                        <div class="flex gap-2">
                            <MenuItem v-show="isExpanding" class="flex-grow !w-auto" tag="RouterLink" to="/">
                                <div class="flex gap-4 w-full flex-grow">
                                    <SvgIcon name="home" class="w-6 h-6" />
                                    <span class="flex items-center flex-grow">daisyUI</span>
                                </div>
                            </MenuItem>
                            <div class="sr-only sm:not-sr-only">
                                <CollapseToggler />
                            </div>
                        </div>
                        <div class="divider my-0"></div>
                        <MenuItem icon="layout-dashboard" tag="RouterLink" :to="{ name: 'Dashboard' }">主控版</MenuItem>
                        <MenuItem icon="brand-instagram" tag="RouterLink" :to="{ name: 'Instagram' }">Instagram 抽獎</MenuItem>
                    </div>
                    <div class="absolute left-0 bottom-0 w-full bg-base-200 p-2 border-t border-t-base-100">
                        <MenuItem icon="settings" tag="RouterLink" :to="{ name: 'Setting' }">設定</MenuItem>
                    </div>
                </div>
            </div>
        </aside>
        <div :class="[isExpanding ? 'sm:pl-64' : 'sm:pl-18.5', 'transition-all relative z-1']">
            <div class="navbar bg-base-100 sticky z-2 top-0 left-0 w-full shadow-lg">
                <div class="navbar-start">
                    <button class="btn btn-ghost btn-circle sm:sr-only" @click="() => toggleOpenOnMobile()">
                        <SvgIcon name="menu" class="w-6 h-6" />
                    </button>
                </div>
                <div class="navbar-center">
                    <RouterLink to="/" class="btn btn-ghost text-xl">daisyUI</RouterLink>
                </div>
                <div class="navbar-end">
                    <div class="dropdown dropdown-end">
                        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
                            <div class="w-10 rounded-full p-2">
                                <SvgIcon name="dots" class="w-full h-full" />
                            </div>
                        </div>
                        <ul tabindex="0" class="mt-3 z-[1] p-2 shadow-lg menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                            <li>
                                <a class="justify-between">
                                    Profile
                                    <span class="badge">New</span>
                                </a>
                            </li>
                            <li><a>Settings</a></li>
                            <li><a>Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="relative z-1">
                <slot name="default" :forceOpenOnMobile="forceOpenOnMobile" :forceCloseOnMobile="forceCloseOnMobile" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, provide } from "vue";
import MenuItem from "./components/MenuItem.vue";
import CollapseToggler from "./components/CollapseToggler.vue";
import { useWindowSize, watchThrottled } from "@vueuse/core";
import { useRoute } from "vue-router";

const route = useRoute();
const { width: windowWidth } = useWindowSize();

const isHovering = ref(false);
const keepExpanded = ref(false);
const isMobileOpen = ref(false);

const isExpanding = computed(() => {
    return keepExpanded.value || isHovering.value;
});

watchThrottled(
    windowWidth,
    val => {
        if (val >= 640) {
            isMobileOpen.value = false;
        }
    },
    { throttle: 500 }
);
watchThrottled(
    () => route.path,
    () => {
        isMobileOpen.value = false;
    },
    { throttle: 300 }
);

provide("isExpanding", isExpanding);
provide("keepExpanded", keepExpanded);

const collapseTimer = ref<ReturnType<typeof setTimeout> | null>(null);

watch(collapseTimer, (newTimer, oldTimer) => {
    if (newTimer === null && oldTimer !== null) {
        clearTimeout(oldTimer);
    }
});

function expandSideBar() {
    collapseTimer.value = null;
    isHovering.value = true;
}

function collapseSideBar() {
    collapseTimer.value = setTimeout(() => {
        isHovering.value = false;
    }, 500);
}

function toggleOpenOnMobile(forceState?: boolean) {
    if (forceState === undefined) {
        const targetValue = !isMobileOpen.value;
        isMobileOpen.value = targetValue;
        isHovering.value = targetValue;
        keepExpanded.value = targetValue;
        return;
    }
    isMobileOpen.value = forceState;
    isHovering.value = forceState;
    keepExpanded.value = forceState;
}

function forceOpenOnMobile() {
    toggleOpenOnMobile(true);
}
function forceCloseOnMobile() {
    toggleOpenOnMobile(false);
}
</script>

