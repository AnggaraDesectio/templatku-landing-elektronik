// Komponen SEO terpusat: title, meta description, canonical, OG, Twitter card,
// dan JSON-LD. Murni props, tanpa akses window/document sehingga aman untuk SSR.
import { Head } from '@inertiajs/react';

interface SeoHeadProps {
    title: string;
    description: string;
    /** URL absolut, wajib. */
    canonical: string;
    /** URL absolut untuk og:image / image schema. */
    ogImage?: string;
    ogType?: 'website' | 'article';
    siteName?: string;
    /** Satu objek atau array objek schema.org; tiap objek jadi satu <script>. */
    jsonLd?: object | object[];
}

export default function SeoHead({
    title,
    description,
    canonical,
    ogImage,
    ogType = 'website',
    siteName = 'TemplatKu',
    jsonLd,
}: SeoHeadProps) {
    const jsonLdList = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={canonical} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={canonical} />
            <meta property="og:site_name" content={siteName} />
            {ogImage && <meta property="og:image" content={ogImage} />}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            {jsonLdList.map((schema, i) => (
                <script key={i} type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            ))}
        </Head>
    );
}
