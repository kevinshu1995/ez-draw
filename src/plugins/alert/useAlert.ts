import { reactive, computed, watch } from "vue";
import type { AlertStates, FnToggleAlert, FnOpenAlert, FnCloseAlert } from "./type";

export default function useAlert() {
    const states = reactive<AlertStates>({
        display: false,
        title: "",
        message: "",
        clickOutsideToClose: false,
        closeBtnText: "關閉",
    });

    const isVisible = computed(() => states.display);

    watch(
        () => states.display,
        val => {
            if (val === false) {
                states.title = "";
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

    const openAlert: FnOpenAlert = ({ title, message, clickOutsideToClose, closeBtnText }) => {
        states.title = title ?? "";
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

