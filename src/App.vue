<script setup lang="ts">
import SideBarNav from "src/components/layout/sideBarNav/SideBarNav.vue";
import BaseContentContainer from "src/components/layout/baseContentContainer/BaseContentContainer.vue";
</script>

<template>
    <div>
        <SideBarNav>
            <RouterView v-slot="{ Component, route }">
                <transition
                    enter-from-class="opacity-0 translate-x-8"
                    enter-to-class="opacity-100"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0 -translate-x-8"
                    enter-active-class="transition-all"
                    leave-active-class="transition-all absolute inset-0 size-full"
                >
                    <div :key="route.path">
                        <BaseContentContainer>
                            <component :is="Component" />
                        </BaseContentContainer>
                    </div>
                </transition>
            </RouterView>
        </SideBarNav>
    </div>
</template>

