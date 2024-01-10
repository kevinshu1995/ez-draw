import { readonly, InjectionKey } from "vue";
import type { App } from "vue";
import type { AlertInjectInstance } from "./type";
import BaseAlert from "./BaseAlert.vue";
import useAlert from "./useAlert";
import { createAppElement } from "./../createApp";

export const AlertSymbol = Symbol() as InjectionKey<AlertInjectInstance>;

const AlertPlugin = {
    install: (app: App) => {
        const { states, isVisible, toggleAlert, openAlert, closeAlert } = useAlert();

        const { mount } = createAppElement(BaseAlert, "custom-alert-container", { states: states, toggleAlert });

        const instance: AlertInjectInstance = {
            isVisible: readonly(isVisible),
            openAlert,
            closeAlert,
        };

        app.config.globalProperties.alert = instance;
        app.provide(AlertSymbol, instance);
        mount();
    },
};

export default AlertPlugin;

