import { reactive, computed, watch } from "vue";
import type { FnToggleAlert, FnOpenAlert, FnCloseAlert } from "./type";

export default function useAlert() {
    const states = reactive({
        display: false,
        message: "",
        clickOutsideToClose: false,
        closeBtnText: "關閉",
    });

    const isVisible = computed(() => states.display);

    watch(
        () => states.display,
        val => {
            if (val === false) {
                states.message = "";
            }
        }
    );

    const toggleAlert: FnToggleAlert = (forceState?: boolean) => {
        if (forceState !== undefined) {
            states.display = forceState;
            return;
        }
        states.display = !states.display;
    };

    const openAlert: FnOpenAlert = ({ message, clickOutsideToClose, closeBtnText }) => {
        states.message = message;
        states.clickOutsideToClose = clickOutsideToClose || false;
        states.closeBtnText = closeBtnText || "關閉";
        toggleAlert(true);
    };

    const closeAlert: FnCloseAlert = () => {
        toggleAlert(false);
    };

    return {
        states,
        isVisible, // getter
        toggleAlert,
        openAlert,
        closeAlert,
    };
}

