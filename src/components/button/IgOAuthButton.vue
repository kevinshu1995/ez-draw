<script setup lang="ts">
import { useUser } from "src/store/user";
const userStore = useUser();
</script>

<template>
    <button @click="userStore.goGetIgOAuth">ig oauth</button>
</template>

