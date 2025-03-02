import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
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
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('react')) return 'react';   // Séparer React
                        if (id.includes('antd')) return 'antd';     // Séparer Ant Design
                        if (id.includes('mapbox-gl')) return 'mapbox'; // Séparer Mapbox
                        return 'vendor'; // Met le reste des dépendances dans un fichier séparé
                    }
                },
            },
        },
        chunkSizeWarningLimit: 1000, // Évite les avertissements inutiles
    },
});
