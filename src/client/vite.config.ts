import { defineConfig } from 'vite';
import { resolve } from 'path';
import tailwind from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {mockDevServerPlugin} from "vite-plugin-mock-dev-server";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tailwind(), mockDevServerPlugin()],
    publicDir: '../../public',
    build: {
        outDir: '../../dist/client',
        sourcemap: true,
        rollupOptions: {
            input: {
                landing: resolve(__dirname, 'landing.html'),
                landingContainer: resolve(__dirname, 'landing-container.html'),
                dashboard: resolve(__dirname, 'dashboard.html')
            },
            output: {
                entryFileNames: '[name].js',
                chunkFileNames: '[name].js',
                assetFileNames: '[name][extname]',
                sourcemapFileNames: '[name].js.map',
            },
        },
    },
    server: {
        host: true,
        proxy: {
            '/api': {
                target: 'http://localhost:7575',
                changeOrigin: true
            }
        }
    },
});
