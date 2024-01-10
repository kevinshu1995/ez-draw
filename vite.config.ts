import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import UnoCSS from "unocss/vite";
import svgLoader from "vite-svg-loader";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), UnoCSS(), svgLoader()],
    server: {
        proxy: {
            "/api-instagram": {
                target: "https://api.instagram.com/",
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api-instagram/, ""),
            },

            "/graph-instagram": {
                target: "https://graph.instagram.com/",
                changeOrigin: true,
                rewrite: path => path.replace(/^\/graph-instagram/, ""),
            },
        },
    },
    resolve: {
        alias: {
            src: path.resolve(__dirname, "./src/"),
        },
    },
});

