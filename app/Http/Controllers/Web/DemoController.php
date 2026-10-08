<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Support\DemoData;
use App\Support\TemplateFlavor;
use Inertia\Inertia;
use Inertia\Response;

/** Halaman-halaman demo template (Inertia). */
class DemoController extends Controller
{
    public function tables(): Response
    {
        return Inertia::render('tables', [
            'orders' => DemoData::orders(24),
        ]);
    }

    public function forms(): Response
    {
        return Inertia::render('forms');
    }

    public function components(): Response
    {
        return Inertia::render('components');
    }

    public function kanban(): Response
    {
        return Inertia::render('kanban');
    }

    public function calendar(): Response
    {
        return Inertia::render('calendar');
    }

    public function profile(): Response
    {
        return Inertia::render('profile');
    }

    public function settings(): Response
    {
        return Inertia::render('settings');
    }

    public function pricing(): Response
    {
        return Inertia::render('pricing', [
            'plans' => DemoData::pricingPlans(),
        ]);
    }

    public function faq(): Response
    {
        return Inertia::render('faq', [
            'faqs' => DemoData::faqs(),
        ]);
    }

    public function templates(): Response
    {
        return Inertia::render('templates');
    }

    /**
     * Unduh arsip ZIP template per flavor: /download/zip/{flavor?}.
     * File dibuat oleh `php artisan template:zip` (dijalankan di server,
     * BUKAN on-request), kalau belum ada / flavor tidak valid, 404 jelas.
     */
    public function downloadZip(?string $flavor = null): \Symfony\Component\HttpFoundation\BinaryFileResponse
    {
        $flavor ??= 'full';

        abort_unless(
            TemplateFlavor::exists($flavor),
            404,
            "Flavor '{$flavor}' tidak dikenal."
        );

        $filename = TemplateFlavor::zipFilename($flavor);
        $path = public_path("download/{$filename}");

        abort_unless(
            is_file($path),
            404,
            'File ZIP belum tersedia. Jalankan `php artisan template:zip` di server untuk membuatnya.'
        );

        return response()->download($path, $filename);
    }

    public function landing(): Response
    {
        return Inertia::render('landing', [
            'features'     => DemoData::landingFeatures(),
            'stats'        => DemoData::landingStats(),
            'stack'        => DemoData::landingStack(),
            'plans'        => DemoData::pricingPlans(),
            'faqs'         => DemoData::faqs(),
        ]);
    }

    public function errorDemo(int $code): Response
    {
        abort($code);
    }

    // ---- Varian landing (Inertia, data demo default di file masing-masing) ----
    public function landingFashion(): Response { return Inertia::render('landings/fashion'); }
    public function landingSaas(): Response { return Inertia::render('landings/saas'); }
    public function landingGadget(): Response { return Inertia::render('landings/gadget'); }
    public function landingPerkakas(): Response { return Inertia::render('landings/perkakas'); }
    public function landingElektronik(): Response { return Inertia::render('landings/elektronik'); }
    public function landingEcommerce(): Response { return Inertia::render('landings/ecommerce'); }
    public function landingFnb(): Response { return Inertia::render('landings/fnb'); }
    public function landingJasa(): Response { return Inertia::render('landings/jasa'); }
    public function landingProperti(): Response { return Inertia::render('landings/properti'); }
    public function landingKlinik(): Response { return Inertia::render('landings/klinik'); }
    public function landingApotek(): Response { return Inertia::render('landings/apotek'); }
    public function landingSekolah(): Response { return Inertia::render('landings/sekolah'); }
    public function landingKursus(): Response { return Inertia::render('landings/kursus'); }
    public function landingKos(): Response { return Inertia::render('landings/kos'); }
    public function landingVilla(): Response { return Inertia::render('landings/villa'); }
    public function landingRestoran(): Response { return Inertia::render('landings/restoran'); }
    public function landingKatering(): Response { return Inertia::render('landings/katering'); }
    public function landingTravel(): Response { return Inertia::render('landings/travel'); }
    public function landingDonasi(): Response { return Inertia::render('landings/donasi'); }
    public function landingFintech(): Response { return Inertia::render('landings/fintech'); }
    public function landingCompany(): Response { return Inertia::render('landings/company'); }
    public function landingApp(): Response { return Inertia::render('landings/app'); }
    public function landingWebinar(): Response { return Inertia::render('landings/webinar'); }
    public function landingAgensi(): Response { return Inertia::render('landings/agensi'); }
    public function landingPortofolio(): Response { return Inertia::render('landings/portofolio'); }
    public function landingWedding(): Response { return Inertia::render('landings/wedding'); }
    public function landingFotografer(): Response { return Inertia::render('landings/fotografer'); }

    // ---- Varian dashboard (Inertia, data demo default di file masing-masing) ----
    public function dashboardLogistik(): Response { return Inertia::render('dashboards/logistik'); }
    public function dashboardHr(): Response { return Inertia::render('dashboards/hr'); }
    public function dashboardPos(): Response { return Inertia::render('dashboards/pos'); }
    public function dashboardProyek(): Response { return Inertia::render('dashboards/proyek'); }
    public function dashboardAkademik(): Response { return Inertia::render('dashboards/akademik'); }
    public function dashboardKlinik(): Response { return Inertia::render('dashboards/klinik'); }
    public function dashboardInventory(): Response { return Inertia::render('dashboards/inventory'); }
    public function dashboardMarketing(): Response { return Inertia::render('dashboards/marketing'); }
    public function dashboardRental(): Response { return Inertia::render('dashboards/rental'); }
    public function dashboardLaundry(): Response { return Inertia::render('dashboards/laundry'); }
}
