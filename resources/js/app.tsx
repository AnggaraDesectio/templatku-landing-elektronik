import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { hydrateRoot } from 'react-dom/client';
import { ErrorBoundary } from './components/error-boundary';
import { brand } from './config/brand';

const appName = import.meta.env.VITE_APP_NAME || brand.name;

// Eager glob: type-safe di Inertia v3 (resolvePageComponent punya
// masalah overload dengan React 19).
const pages = import.meta.glob('./pages/**/*.tsx', { eager: true }) as Record<
    string,
    { default: React.ComponentType }
>;

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => {
        const page = pages[`./pages/${name}.tsx`];
        if (!page) throw new Error(`Halaman Inertia tidak ditemukan: ${name}`);
        return page;
    },
    setup({ el, App, props }) {
        // Pola resmi Inertia v3 SSR ("Client-Side Hydration"): hydrateRoot,
        // bukan createRoot. Bila halaman di-render server (SSR aktif),
        // React meng-hydrate markup yang sudah ada. Bila SSR mati dan `el`
        // kosong, hydrateRoot berperilaku seperti render biasa — jadi satu
        // entry ini aman dipakai untuk kedua mode.
        hydrateRoot(
            el,
            <ErrorBoundary>
                <App {...props} />
            </ErrorBoundary>,
        );
    },
    progress: {
        color: '#2563eb',
    },
});
