<?php

namespace App\Support;

use Illuminate\Support\Facades\Route;

// Helper kecil untuk konsep "template flavor" (config/template.php).
// Dipakai middleware Inertia, route "/", dan command template:zip.
class TemplateFlavor
{
    /** Nama flavor aktif, mis. "crm". Selalu fallback ke "full".
     *
     * Resolusi berlapis (khusus HTTP; console selalu pakai env):
     *  1. Path prefix project (mis. /crm/* → "crm"), dikunci sticky di session.
     *  2. Halaman hub (/, /templates/*) dan /admin/*, reset, pakai env.
     *  3. Sticky session, navigasi dalam satu project (mis. /users dari sidebar CRM
     *     tetap tampil sebagai project CRM).
     *  4. Env TEMPLATE_FLAVOR (dipakai ZIP download).
     *
     * Tujuannya: tiap template tampil sebagai SATU PROJECT utuh di demo,
     * sidebar, header/brand, halaman, dan route-nya milik template itu sendiri.
     */
    public static function current(): string
    {
        if (app()->runningInConsole()) {
            return self::fromEnv();
        }

        $request = request();
        $path = '/'.ltrim($request->path(), '/');

        // Halaman hub & area admin: bukan bagian project mana pun.
        if ($path === '/'
            || $path === '/templates' || str_starts_with($path, '/templates/')
            || $path === '/admin' || str_starts_with($path, '/admin/')
        ) {
            $request->session()->forget('template_flavor');

            return self::fromEnv();
        }

        // Masuk ke project → kunci sticky.
        if ($flavor = self::fromPath($path)) {
            $request->session()->put('template_flavor', $flavor);

            return $flavor;
        }

        // Masih dalam project yang sama (navigasi via sidebar).
        $sticky = $request->session()->get('template_flavor');
        if (is_string($sticky) && self::exists($sticky)) {
            return $sticky;
        }

        return self::fromEnv();
    }

    /** Flavor dari env saja (untuk console / ZIP). */
    private static function fromEnv(): string
    {
        $flavor = (string) config('template.flavor', 'full');

        return self::exists($flavor) ? $flavor : 'full';
    }

    /** Deteksi flavor dari prefix path. Null bila bukan area project. */
    public static function fromPath(string $path): ?string
    {
        $best = null;
        $bestLen = 0;
        foreach (self::all() as $flavor) {
            $prefix = self::prefix($flavor);
            if ($prefix === null) {
                continue;
            }
            if ($path === $prefix || str_starts_with($path, $prefix.'/')) {
                if (strlen($prefix) > $bestLen) {
                    $best = $flavor;
                    $bestLen = strlen($prefix);
                }
            }
        }

        return $best;
    }

    /** Prefix path untuk satu flavor. Konvensi: /{key}, landing → /landings/{nama}. */
    public static function prefix(string $flavor): ?string
    {
        if ($flavor === 'full' || ! self::exists($flavor)) {
            return null;
        }
        if (str_starts_with($flavor, 'landing-')) {
            return '/landings/'.substr($flavor, strlen('landing-'));
        }

        return '/'.$flavor;
    }

    public static function exists(string $flavor): bool
    {
        return is_array(config("template.flavors.{$flavor}"));
    }

    /** Daftar nama semua flavor. */
    public static function all(): array
    {
        return array_keys(config('template.flavors', []));
    }

    /** Konfigurasi satu flavor (selalu array, fallback ke "full"). */
    public static function config(?string $flavor = null): array
    {
        $flavor ??= self::current();

        return config("template.flavors.{$flavor}", config('template.flavors.full', []));
    }

    /** Brand aktif untuk ditampilkan di UI. */
    public static function brand(?string $flavor = null): array
    {
        $cfg = self::config($flavor);

        return [
            'name'     => $cfg['brand_name'] ?? 'TemplateKu',
            'tagline'  => $cfg['brand_tagline'] ?? 'Dashboard siap pakai',
            'initials' => $cfg['brand_initials'] ?? 'TK',
        ];
    }

    /** Nama route tujuan redirect "/" (fallback ke "dashboard"). */
    public static function homeRoute(?string $flavor = null): string
    {
        $home = self::config($flavor)['home'] ?? 'dashboard';

        return Route::has($home) ? $home : 'dashboard';
    }

    /** Hex accent flavor aktif, dipakai untuk --primary, --ring, dsb.
     *  Fallback '#1d4ed8' bila tidak diset / tidak valid. */
    public static function accent(?string $flavor = null): string
    {
        $accent = self::config($flavor)['accent'] ?? null;

        return is_string($accent) && preg_match('/^#[0-9a-fA-F]{6}$/', $accent)
            ? $accent
            : '#1d4ed8';
    }

    /** Kategori flavor (kesehatan, bisnis, teknologi, ...). Null untuk 'full'. */
    public static function category(?string $flavor = null): ?string
    {
        $cat = self::config($flavor)['category'] ?? null;

        return is_string($cat) ? $cat : null;
    }

    /** Pairing font Google Fonts per kategori: ['display' => ..., 'body' => ...].
     *  Dipakai app.blade.php untuk <link> font + --font-sans/--font-display. */
    public static function fontPairing(?string $flavor = null): array
    {
        return match (self::category($flavor)) {
            'kuliner', 'kreatif'              => ['display' => 'Fraunces', 'body' => 'Plus Jakarta Sans'],
            'teknologi', 'bisnis'             => ['display' => 'Space Grotesk', 'body' => 'IBM Plex Sans'],
            'kesehatan', 'pendidikan', 'keuangan' => ['display' => 'Sora', 'body' => 'Public Sans'],
            'properti', 'jasa'                => ['display' => 'Bricolage Grotesque', 'body' => 'Plus Jakarta Sans'],
            default                           => ['display' => 'Sora', 'body' => 'Plus Jakarta Sans'],
        };
    }

    /** Palet 5 hex untuk --chart-1..--chart-5, satu ramp harmonis per kategori.
     *  chart-1 selalu accent (atau turunannya). */
    public static function chartPalette(?string $flavor = null): array
    {
        return match (self::category($flavor)) {
            'kesehatan'  => ['#0f766e', '#0d9488', '#14b8a6', '#2dd4bf', '#5eead4'],
            'pendidikan' => ['#0369a1', '#0284c7', '#0891b2', '#38bdf8', '#7dd3fc'],
            'properti'   => ['#9a3412', '#c2410c', '#ea580c', '#fb923c', '#fdba74'],
            'kuliner'    => ['#991b1b', '#b91c1c', '#dc2626', '#f87171', '#fca5a5'],
            'jasa'       => ['#78350f', '#92400e', '#b45309', '#d97706', '#fbbf24'],
            'keuangan'   => ['#065f46', '#047857', '#059669', '#34d399', '#6ee7b7'],
            'bisnis'     => ['#1e3a8a', '#1d4ed8', '#3b82f6', '#60a5fa', '#93c5fd'],
            'teknologi'  => ['#0e7490', '#0891b2', '#06b6d4', '#22d3ee', '#67e8f9'],
            'kreatif'    => ['#831843', '#be185d', '#ec4899', '#f472b6', '#f9a8d4'],
            default      => ['#1e40af', '#1d4ed8', '#3b82f6', '#60a5fa', '#93c5fd'],
        };
    }

    /** Nav sidebar untuk flavor: 'all' atau array section (tanpa wrapper). */
    public static function nav(): array|string
    {
        $nav = self::config()['nav'] ?? 'all';
        if (is_array($nav)) {
            return $nav['sections'] ?? [];
        }

        return $nav;
    }

    /** Nama file ZIP untuk satu flavor. */
    public static function zipFilename(string $flavor): string
    {
        return "laravel-dashboard-template-{$flavor}.zip";
    }
}
