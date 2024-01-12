<template>
    <component class="btn items-center justify-between w-full gap-4" :class="[isActiveRouterLink ? ' btn-neutral btn-active' : 'btn-ghost']" :is="props.tag ?? 'a'">
        <slot name="icon" :is-expanded="isExpanding">
            <span v-if="props.icon" class="flex items-center"><SvgIcon :name="props.icon" class="w-6 h-6" /></span>
        </slot>
        <span v-show="isExpanding" :class="['block flex-grow text-left transition-all']">
            <slot name="default" :is-expanded="isExpanding" />
        </span>
    </component>
</template>

<script setup lang="ts">
import { inject, computed, useAttrs } from "vue";
import type { Component } from "vue";
import { useRoute, useLink } from "vue-router";

const route = useRoute();
const isExpanding = inject("isExpanding");

interface Props {
    icon?: string;
    tag?: String | Component;
}

const props = defineProps<Props>();
const attrs = useAttrs();

const { isActive } = useLink(attrs);

const isActiveRouterLink = computed(() => {
    if (isActive.value) return true;
    return false;
});
</script>

