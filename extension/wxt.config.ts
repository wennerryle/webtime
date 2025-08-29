import { defineConfig } from "wxt";
import preact from "@preact/preset-vite";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    name: "WebTime",
    permissions: ["tabs", "storage"],
  },
  vite: (env) => ({
    plugins: [preact()],
  }),
});
