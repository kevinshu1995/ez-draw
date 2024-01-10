<script setup lang="ts"></script>

<template>
    <div>
        <RouterView v-slot="{ Component, route }">
            <transition
                enter-from-class="opacity-0 translate-x-8"
                enter-to-class="opacity-100"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0 -translate-x-8"
                enter-active-class="transition-all"
                leave-active-class="transition-all absolute inset-0 size-0"
            >
                <component :is="Component" :key="route.path" />
            </transition>
        </RouterView>
    </div>
</template>

