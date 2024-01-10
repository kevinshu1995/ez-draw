<template>
    <dialog :class="['modal', props.states.display && 'modal-open']">
        <div class="modal-box">
            <p class="pt-8 pb-4 text-center">{{ props.states.message }}</p>
            <div class="modal-action">
                <button class="btn" @click="props.toggleAlert(false)">{{ props.states.closeBtnText }}</button>
            </div>
        </div>
        <div v-show="props.states.clickOutsideToClose" class="modal-backdrop" @click="props.toggleAlert(false)"></div>
    </dialog>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";
import type { AlertStates } from "./type";

const props = defineProps({
    states: {
        type: Object as PropType<AlertStates>,
        required: true,
    },
    toggleAlert: {
        type: Function,
        required: true,
    },
});
</script>

