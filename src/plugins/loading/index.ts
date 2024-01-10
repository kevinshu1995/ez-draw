import { readonly, InjectionKey } from "vue";
import type { App } from "vue";
import type { LoadingInjectInstance } from "./type";
import BaseLoading from "./BaseLoading.vue";
import useLoading from "./useLoading";
import { createAppElement } from "../createApp";

export const LoadingSymbol = Symbol() as InjectionKey<LoadingInjectInstance>;

const LoadingPlugin = {
    install: (app: App) => {
        const { states, toggleDisplay, isDisplay } = useLoading();

        const { mount } = createAppElement(BaseLoading, "custom-loading-container", { states: states, toggleDisplay });

        const instance = {
            display: readonly(isDisplay),
            toggleDisplay,
        };

        app.config.globalProperties.loading = instance;
        app.provide(LoadingSymbol, instance);
        mount();
    },
};

export default LoadingPlugin;

