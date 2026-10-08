// Hook brand aktif: baca `usePage().props.template.brand` dari backend
// (config/template.php, berubah mengikuti TEMPLATE_FLAVOR), dengan
// fallback ke brand statis @/config/brand bila prop belum ada (mis. SSR
// awal atau halaman yang dirender tanpa middleware Inertia).
import { usePage } from '@inertiajs/react';
import { brand as staticBrand } from '@/config/brand';
import type { TemplateBrand } from '@/types/template';

export function useBrand(): TemplateBrand {
    const props = usePage().props as Record<string, unknown>;
    const template = props.template as { brand?: Partial<TemplateBrand> } | undefined;
    const b = template?.brand;

    if (b && typeof b.name === 'string' && b.name.length > 0) {
        return {
            name: b.name,
            tagline: typeof b.tagline === 'string' ? b.tagline : staticBrand.tagline,
            initials: typeof b.initials === 'string' ? b.initials : staticBrand.initials,
        };
    }

    return {
        name: staticBrand.name,
        tagline: staticBrand.tagline,
        initials: staticBrand.initials,
    };
}
