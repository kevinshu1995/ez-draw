import { readonly, InjectionKey } from "vue";
import type { App } from "vue";
import type { ToastInjectInstance } from "./type";
import BaseToast from "./BaseToast.vue";
import useToast from "./useToast";
import { createAppElement } from "./../createApp";

import SvgIcon from "src/components/global/SvgIcon.vue";

type ToastPluginOptions = {
    toastDisappearTime?: number;
};

export const ToastSymbol = Symbol() as InjectionKey<ToastInjectInstance>;

const ToastPlugin = {
    install: (app: App, options: ToastPluginOptions) => {
        const { toasts, addNewToast, toastDisappearTime } = useToast({ toastDisappearTime: options?.toastDisappearTime ?? 5000 });

        const { app: toastApp, mount } = createAppElement(BaseToast, "custom-toast-container", { toasts: toasts.value });

        toastApp.component("SvgIcon", SvgIcon);

        const instance: ToastInjectInstance = {
            toasts: readonly(toasts),
            toastDisappearTime: readonly(toastDisappearTime),
            addNewToast,
        };

        app.config.globalProperties.toast = instance;
        app.provide(ToastSymbol, instance);
        mount();
    },
};

export default ToastPlugin;

