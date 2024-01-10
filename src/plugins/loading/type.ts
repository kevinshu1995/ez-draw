import type { DeepReadonly, Ref } from "vue";

export interface LoadingStates {
    display: boolean;
}

export interface LoadingInjectInstance {
    display: DeepReadonly<Ref<LoadingStates["display"]>>;
    toggleDisplay: FnToggleVisible;
}

export type FnToggleVisible = (forceState?: boolean) => void;

