import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icons/*.png'],
      manifest: {
        name: 'Smart Shopping List',
        short_name: 'ShopOracle',
        description: 'AI-powered price oracle for your shopping list',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        // Cache the API list endpoint for offline use
        runtimeCaching: [
          {
            urlPattern: /\/api\/items$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-items-cache',
              expiration: { maxEntries: 1, maxAgeSeconds: 60 * 60 * 24 },
              networkTimeoutSeconds: 5,
            }
          },
          {
            urlPattern: /\.(?:js|css|html|png|svg|ico)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-assets',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 }
            }
          }
        ]
      }
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
});
