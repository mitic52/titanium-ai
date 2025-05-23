import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["b478-2a06-63c5-8e0b-6b00-207b-5b0-7672-7855.ngrok-free.app"],
  },
});
