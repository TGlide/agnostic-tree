import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro";
import react from "@astrojs/react";
import svelte from "@astrojs/svelte";
import vue from "@astrojs/vue";
import solidJs from "@astrojs/solid-js";

// https://astro.build/config
export default defineConfig({
  integrations: [
    UnoCSS({
      injectReset: true, // or a path to the reset file
    }),
    svelte(),
    vue(),
    react({
      include: ["**/*.react.jsx", "**/*.react.tsx"],
    }),
    solidJs({
      include: ["**/*.solid.jsx", "**/*.solid.tsx"],
    }),
  ],
});
