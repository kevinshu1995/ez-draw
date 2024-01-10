import type { DeepReadonly, Ref } from "vue";

export interface AlertStates {
    title: string;
    display: boolean;
    message: string;
    clickOutsideToClose: boolean;
    closeBtnText: string;
}

export interface AlertInjectInstance {
    isVisible: DeepReadonly<Ref<AlertStates["display"]>>;
    openAlert: FnOpenAlert;
    closeAlert: FnCloseAlert;
}

export type FnToggleAlert = (forceState?: boolean) => void;

export type FnOpenAlertArgs = {
    title?: string;
    message: string;
    clickOutsideToClose?: boolean;
    closeBtnText?: string;
};

export type FnOpenAlert = (args: FnOpenAlertArgs) => void;

export type FnCloseAlert = () => void;

