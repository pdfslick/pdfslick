import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [
    tailwindcss(), 
    solidPlugin()
  ],
  server: {
    port: 3002,
  },
  build: {
    target: "esnext",
  },
});
