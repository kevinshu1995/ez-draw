<template>
    <svgComponent />
</template>

<script lang="ts" setup>
import { defineAsyncComponent } from "vue";

const props = defineProps({
    name: {
        type: String,
        required: true,
    },
});

const svgComponent = defineAsyncComponent(() => import(`../../assets/svg/${props.name}.svg`));
</script>

