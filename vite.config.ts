import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      disable: true,
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: "I'm Entrepreneur",
        short_name: "IamEntrepreneur",
        description: "Startup PWA Operating System - Beyond Guidance Accelerator Hub",
        theme_color: "#0B1B3F",
        background_color: "#FBF6EC",
        display: "standalone",
        orientation: "portrait",
        start_url: ".",
        icons: [
          {
            src: "favicon.svg",
            sizes: "192x192",
            type: "image/svg+xml",
            purpose: "any maskable"
          },
          {
            src: "favicon.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "any maskable"
          }
        ]
      }
    })
  ],
})
