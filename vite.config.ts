import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { VitePWA } from 'vite-plugin-pwa'
import tsconfigPaths from 'vite-tsconfig-paths'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import netlify from '@netlify/vite-plugin-tanstack-start'

const config = defineConfig({
  plugins: [
		VitePWA({
			registerType: "autoUpdate",
			injectRegister: "auto",
			manifest: {
				name: "Waktunya Puasa Kuala Lumpur",
				short_name: "Waktunya Puasa",
				description: "Pengingat Ramadan + fitur puasa untuk Kuala Lumpur.",
				start_url: "/",
				scope: "/",
				display: "standalone",
				background_color: "#0b1220",
				theme_color: "#0ea5e9",
				icons: [
					{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
					{ src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
					{ src: "/icons/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
				],
			},
			workbox: {
				globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff2}"],
			},
		}),

    devtools(),
    netlify(),
    tsconfigPaths({ projects: ['./tsconfig.json'] }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
  server: {
    proxy: {
      '/api/prayer-time': {
        target: 'https://www.e-solat.gov.my',
        changeOrigin: true,
        rewrite: () => '/index.php?r=esolatApi/takwimsolat&period=week&zone=SGR01',
      },
    },
  },
})

export default config
