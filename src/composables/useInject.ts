import { inject } from "vue";
import type { InjectionKey } from "vue";

import { ToastSymbol, AlertSymbol, LoadingSymbol } from "src/plugins/symbols";

function injectStrict<T>(key: InjectionKey<T>, fallback?: T) {
    const resolved = inject(key, fallback);
    if (!resolved) {
        throw new Error(`Could not resolve ${key.description}`);
    }
    return resolved;
}

export function useToast() {
    return injectStrict(ToastSymbol);
}

export function useAlert() {
    return injectStrict(AlertSymbol);
}

export function useLoading() {
    return injectStrict(LoadingSymbol);
}

