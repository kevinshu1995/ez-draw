<script setup lang="ts">
import { useUser } from "src/store/user";
const userStore = useUser();
</script>

<template>
    <button @click="userStore.goGetIgOAuth" class="btn btn-primary">
        <slot />
    </button>
</template>

