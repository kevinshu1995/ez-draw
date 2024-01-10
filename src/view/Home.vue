<script setup lang="ts">
import { useToast, useAlert, useLoading } from "src/composables/useInject";

const toast = useToast();
const alert = useAlert();
const loading = useLoading();
function addToast() {
    toast.addNewToast({
        message: "test",
        status: "info",
    });
}
function addAlert() {
    alert.openAlert({
        message: "test",
    });
}
function addLoading() {
    loading.toggleDisplay();
    setTimeout(() => {
        loading.toggleDisplay();
    }, 3000);
}
</script>

<template>
    <div class="container mx-auto px-4">
        <RouterLink :to="{ path: 'Instagram' }" class="link">Instagram</RouterLink>

        <div class="flex gap-4">
            <button class="btn" @click="addToast">toast</button>
            <button class="btn" @click="addAlert">alert</button>
            <button class="btn" @click="addLoading">loading</button>
        </div>
    </div>
</template>

