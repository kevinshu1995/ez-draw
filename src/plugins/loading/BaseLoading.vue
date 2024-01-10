<template>
    <Transition
        tag="div"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0 -translate-y-4"
        enter-active-class="transition-all"
        leave-active-class="transition-all"
        class="fixed z-1000 inset-0 size-full flex items-center justify-center bg-base-300/10 backdrop-blur-sm"
        v-show="props.states.display"
    >
        <div class="flex flex-col gap-2 items-center">
            <span class="loading loading-ring loading-md"></span>
            <span class="bg-base-100 tracking-wider">LOADING</span>
        </div>
    </Transition>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";
import type { LoadingStates } from "./type";

const props = defineProps({
    states: {
        type: Object as PropType<LoadingStates>,
        required: true,
    },
    toggleDisplay: {
        type: Function,
        required: true,
    },
});
</script>

