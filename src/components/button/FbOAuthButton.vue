<script setup lang="ts">
import { useFb } from "src/store/fb";
const storeFb = useFb();
</script>

<template>
    <button @click="storeFb.goGetFbOAuth" class="btn btn-primary">
        <slot />
    </button>
</template>

