import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // .env.development and .env.production are read from client/ dir by default.
  // Do NOT use envDir: '../' — breaks Cloudflare Pages builds.
  plugins: [
    react(),
    tailwindcss(),
  ],
})
