// uno.config.ts
import { defineConfig } from "unocss";
import presetUno from "@unocss/preset-uno";
import transformerDirectives from "@unocss/transformer-directives";

import { presetDaisy } from "unocss-preset-daisy";

export default defineConfig({
    presets: [presetUno(), presetDaisy()],
    transformers: [transformerDirectives()],
});

