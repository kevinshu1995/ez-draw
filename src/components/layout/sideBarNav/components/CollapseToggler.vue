<template>
    <label class="swap swap-rotate btn btn-ghost text-xl">
        <input type="checkbox" v-model="keepExpanded" />

        <SvgIcon name="menu" class="swap-off w-6 h-6" />

        <SvgIcon name="layout-sidebar-left-collapse" class="swap-on w-6 h-6" />
    </label>
</template>

<script setup lang="ts">
import { inject } from "vue";

const keepExpanded = inject("keepExpanded");
</script>

