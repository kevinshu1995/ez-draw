import { h, createApp } from "vue";
import type { Component } from "vue";

export function createAppElement(component: Component, key: string, props: any) {
    const vNode = h(component, props);
    const container = document.createElement("div");
    container.id = key;
    document.body.appendChild(container);

    const pluginApp = createApp(vNode);

    return {
        app: pluginApp,
        mount() {
            pluginApp.mount(container);
        },
    };
}

