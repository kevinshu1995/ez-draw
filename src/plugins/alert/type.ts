import type { DeepReadonly, Ref } from "vue";

export interface AlertStates {
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
    message: string;
    clickOutsideToClose?: boolean;
    closeBtnText?: string;
};

export type FnOpenAlert = (args: FnOpenAlertArgs) => void;

export type FnCloseAlert = () => void;

