import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        react(),
    ],
    resolve: {
        alias: {
            "react-map-gl": "@vis.gl/react-mapbox", // Corrige l'import de Mapbox
        },
    },
    server: {
        host: '0.0.0.0',
        proxy: {
            '/api': {
                target: 'http://localhost:4006',
                ws: true,
            }
        }
    }
});
