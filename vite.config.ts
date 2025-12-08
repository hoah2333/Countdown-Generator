import tailwindcss from "@tailwindcss/vite";
import devtoolsJson from "vite-plugin-devtools-json";
import mkcert from "vite-plugin-mkcert";

import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), sveltekit(), mkcert(), devtoolsJson()],
  build: { rollupOptions: { external: ["cssstyle"] } },
});
