<?php

namespace App\Http\Middleware;

use App\Support\TemplateFlavor;
use Illuminate\Http\Request;
use Inertia\Middleware;

// Share data global ke semua halaman Inertia:
// - auth.user: user demo (template belum punya auth beneran,
//   ganti dengan Auth::user() saat Breeze/Fortify dipasang)
// - notifications: contoh notifikasi untuk dropdown header
// - flash: pesan session → toast otomatis di AuthenticatedLayout
// - template: flavor aktif (config/template.php), brand + sections nav
//   sidebar, dibaca hook useBrand() dan sidebar AuthenticatedLayout.
class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                // TODO: ganti dengan $request->user() setelah auth dipasang.
                'user' => [
                    'name' => 'Admin Utama',
                    'role' => 'Administrator',
                ],
            ],
            'notifications' => [
                [
                    'id'    => 'n1',
                    'title' => 'Pesanan baru #ORD-0042',
                    'message' => 'Budi Santoso memesan Kopi Arabika 250g.',
                    'time'  => '5 menit lalu',
                ],
                [
                    'id'    => 'n2',
                    'title' => 'Stok menipis',
                    'message' => 'Teh Melati 100g tersisa 3 pcs.',
                    'time'  => '1 jam lalu',
                ],
                [
                    'id'    => 'n3',
                    'title' => 'Pengguna baru',
                    'message' => 'Siti Aminah mendaftar sebagai pelanggan.',
                    'time'  => '3 jam lalu',
                ],
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
                'warning' => fn () => $request->session()->get('warning'),
                'info'    => fn () => $request->session()->get('info'),
            ],
            // Bahasa tampilan aktif (id/en), dibaca hook useT()/useLocale()
            // di resources/js/lib/i18n.ts.
            'locale' => fn () => app()->getLocale(),
            // Flavor template aktif, brand + nav yang difilter.
            // Dibaca hook useBrand() (resources/js/hooks/use-brand.ts)
            // dan sidebar (resources/js/layouts/authenticated-layout.tsx,
            // lewat resolver template-nav di resources/js/lib/nav.ts).
            // 'nav' adalah string 'all' (semua menu, perilaku full template)
            // atau array PENUH section dari config/template.php:
            //   [['label' => 'CRM',
            //     'items' => [['label' => 'Dashboard', 'to' => '/crm',
            //                 'icon' => 'LayoutDashboard'], ...]], ...]
            'template' => fn () => [
                'flavor' => TemplateFlavor::current(),
                'brand'  => TemplateFlavor::brand(),
                'nav'    => TemplateFlavor::nav(),
            ],
        ]);
    }
}
