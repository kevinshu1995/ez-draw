<template>
    <div>
        <TransitionGroup tag="ul" name="toast" class="toast toast-start w-full min-w-auto max-w-100">
            <li :class="['alert text-wrap', getToastStatusClass(toast).class]" v-for="toast in props.toasts" :key="toast.id">
                <SvgIcon :name="getToastStatusClass(toast).icon" class="w-6 h-6" />
                <span>{{ toast.message }}</span>
            </li>
        </TransitionGroup>
    </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import type { ToastList } from "./type";

const props = defineProps({
    toasts: {
        type: Array as PropType<ToastList[]>,
        required: true,
    },
});

function getToastStatusClass(toast: ToastList) {
    switch (toast.status) {
        case "info":
            return {
                class: "alert-info",
                icon: "information-circle",
            };
        case "success":
            return { class: "alert-success", icon: "check-circle" };
        case "warn":
            return { class: "alert-warning", icon: "exclamation-circle" };
        case "error":
            return { class: "alert-error", icon: "x-circle" };
    }
}
</script>

<style>
.toast-move,
.toast-enter-active,
.toast-leave-active {
    transition: all 1s cubic-bezier(0.55, 0, 0.1, 1);
}
.toast-enter-from,
.toast-leave-to {
    opacity: 0 !important;
    transform: translateX(-30px) !important;
}
</style>

