import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    css: {
        postcss: {
          plugins: [
            require('tailwindcss'),
            require('autoprefixer'),
          ],
        },
      },
    resolve: {
        alias: {
            "react-map-gl": "@vis.gl/react-mapbox", // Corrige l'import de Mapbox
        },
    },
    server: {
        host: '0.0.0.0',
        port: 5173, // Ajoute un port fixe pour éviter les conflits
        strictPort: true, // Empêche le changement de port automatique
        watch: {
            usePolling: true, // Assure une meilleure compatibilité sur Docker et WSL
        },
        proxy: {
            '/api': {
                target: 'http://localhost:4006',
                changeOrigin: true,
                secure: false, // Désactive SSL pour éviter les erreurs locales
                ws: true,
            }
        }
    },
    build: {
        target: "es2020", // ✅ On revient à ES2020 pour la compatibilité
        minify: "esbuild", // ✅ Utilise esbuild pour une minification rapide
        sourcemap: false, // ✅ Désactive les maps pour réduire la taille finale
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('react')) return 'react';   // ✅ Sépare React
                        if (id.includes('antd')) return 'antd';     // ✅ Sépare Ant Design
                        if (id.includes('@vis.gl/react-mapbox')) return 'mapbox'; // ✅ Sépare Mapbox
                        return 'vendor'; // ✅ Met le reste des dépendances dans un fichier séparé
                    }
                },
            },
        },
        chunkSizeWarningLimit: 1500 // ✅ Augmente la limite pour éviter les warnings inutiles
    },
    optimizeDeps: {
        include: ["react", "react-dom", "antd"], // ✅ Précharge les modules essentiels
        exclude: ["@vis.gl/react-mapbox"], // ✅ Évite de précompiler Mapbox pour améliorer la perf
    }
});
