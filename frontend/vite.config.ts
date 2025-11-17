import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "fullstack.test",
    port: 5174,
    strictPort: true,
    proxy: {
      "/sanctum": {
        target: "http://fullstack.test",
        changeOrigin: true,
        secure: false,
        // Ensure cookies from the backend are rewritten to the dev server's domain
        // so the browser accepts Set-Cookie headers when using the Vite proxy.
        cookieDomainRewrite: "",
      },
      "/api": {
        target: "http://fullstack.test",
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: "",
      },
    },
  },
});
