import type { DeepReadonly, Ref } from "vue";

export interface ParamsNewToast {
    status: "info" | "success" | "warn" | "error";
    message: string;
}

export interface ToastList extends ParamsNewToast {
    id: string;
}

export interface ToastInjectInstance {
    toasts: DeepReadonly<Ref<ToastList[]>>;
    toastDisappearTime: DeepReadonly<Ref<number>>;
    addNewToast: (paramsNewToast: ParamsNewToast) => void;
}

