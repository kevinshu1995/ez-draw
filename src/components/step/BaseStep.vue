<template>
    <div>
        <div class="overflow-x-auto w-full flex justify-center">
            <ul class="steps">
                <li v-for="(step, stepIndex) in props.steps" :key="step.title" :class="['step transition-all', stepIndex <= currentStep && 'step-primary']">
                    <span class="px-4">{{ step.title }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
type Step = {
    title: string;
    textIcon?: string;
};

interface Props {
    currentStep: number;
    steps: Step[];
}

const props = defineProps<Props>();
</script>

