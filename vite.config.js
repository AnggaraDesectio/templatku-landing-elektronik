import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

// Alias '@' -> resources/js, dipakai di seluruh kode frontend.
// (Didefinisikan eksplisit agar build SSR — yang tidak memakai
// laravel-vite-plugin — memakai resolusi yang sama dengan build klien.)
const alias = {
    '@': path.resolve(import.meta.dirname, 'resources/js'),
};

export default defineConfig(({ isSsrBuild }) => {
    // Build SSR (npm run build:ssr): bundel server Node dari
    // resources/js/ssr.tsx ke bootstrap/ssr/. Laravel plugin sengaja tidak
    // dipakai di sini — tidak ada manifest/input klien yang diproses.
    if (isSsrBuild) {
        return {
            plugins: [
                react({
                    jsxRuntime: 'automatic',
                }),
            ],
            resolve: { alias },
            // Jangan salin public/ ke output SSR (tidak dibutuhkan server Node).
            publicDir: false,
            // Bundel SEMUA dependensi ke ssr.js (jangan external): server
            // produksi tidak punya node_modules, jadi import eksternal
            // akan crash dengan ERR_MODULE_NOT_FOUND.
            ssr: { noExternal: true },
            build: {
                outDir: 'bootstrap/ssr',
                emptyOutDir: true,
            },
        };
    }

    // Build klien default (npm run build) — tidak berubah.
    return {
        plugins: [
            laravel({
                input: ['resources/css/app.css', 'resources/js/app.tsx'],
                refresh: true,
            }),
            react({
                jsxRuntime: 'automatic',
            }),
            tailwindcss(),
        ],
        resolve: { alias },
    };
});
