import { reactive, computed } from "vue";

export default function useLoading() {
    const states = reactive({
        display: false,
    });

    const toggleDisplay = (forceState?: boolean) => {
        if (forceState !== undefined) {
            states.display = forceState;
            return;
        }
        states.display = !states.display;
    };

    const isDisplay = computed(() => states.display);

    return {
        states,
        isDisplay,
        toggleDisplay,
    };
}

