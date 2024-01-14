/// <reference types="vite/client" />
/// <reference types="vite-svg-loader" />

interface ImportMetaEnv {
    readonly VITE_INSTAGRAM_CLIENT_ID: string;
    readonly VITE_INSTAGRAM_CLIENT_SECRET: string;
    readonly VITE_INSTAGRAM_REDIRECT_URL: string;
    readonly VITE_FACEBOOK_APP_ID: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

declare module "src/configs" {
    export const facebook: {
        sdkVersion: string;
    };
}

