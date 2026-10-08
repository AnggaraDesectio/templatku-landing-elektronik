<?php

namespace App\Support;

/**
 * Satu-satunya sumber data demo: kumpulan data contoh yang koheren
 * (karyawan, pelanggan, produk). Semua angka ditulis eksplisit
 * (tanpa rumus modulo) supaya total konsisten dengan harga katalog.
 *
 * Di proyek nyata, ganti dengan query Eloquent / API masing-masing.
 * Kontrak: nama + signature method publik di bawah dipakai controller
 * dan JANGAN diubah; status/stage berbentuk ['label' => .., 'tone' => ..]
 * (tanpa HTML) dengan tone: success | warning | destructive | info.
 */
class DemoData
{
    /* ============================ Dunia demo ============================ */

    /** Karyawan contoh (nama + jabatan realistis). */
    public static function employees(): array
    {
        return [
            ['name' => 'Budi Santoso',   'role' => 'Direktur'],
            ['name' => 'Siti Aminah',    'role' => 'Manajer Operasional'],
            ['name' => 'Agus Wijaya',    'role' => 'Sales B2B'],
            ['name' => 'Dewi Lestari',   'role' => 'Admin Keuangan'],
            ['name' => 'Rudi Hartono',   'role' => 'Kepala Gudang'],
            ['name' => 'Maya Putri',     'role' => 'Customer Service'],
            ['name' => 'Joko Prasetyo',  'role' => 'Kurir'],
            ['name' => 'Rina Wulandari', 'role' => 'Staff Gudang'],
            ['name' => 'Dedi Kurniawan', 'role' => 'Sales Lapangan'],
            ['name' => 'Fitri Handayani','role' => 'Akuntan'],
            ['name' => 'Hendra Gunawan', 'role' => 'Sopir Armada'],
            ['name' => 'Nina Marlina',   'role' => 'Staff Admin'],
        ];
    }

    /** Pelanggan reseller (warung / toko / kafe). */
    public static function customers(): array
    {
        return [
            ['name' => 'Toko Berkah Jaya',      'type' => 'Toko'],
            ['name' => 'Warung Sederhana',      'type' => 'Warung'],
            ['name' => 'Kafe Aroma',            'type' => 'Kafe'],
            ['name' => 'Toko Kelontong Maju',   'type' => 'Toko'],
            ['name' => 'RM Padang Sari Rasa',   'type' => 'RM'],
            ['name' => 'Kafe Kopi Kita',        'type' => 'Kafe'],
            ['name' => 'Toko Sembako Barokah',  'type' => 'Toko'],
            ['name' => 'Warung Kopi Nusantara', 'type' => 'Warung'],
            ['name' => 'Toko Oleh-Oleh Khas',   'type' => 'Toko'],
            ['name' => 'Kantin Sejahtera',      'type' => 'Kantin'],
        ];
    }

    /** Katalog produk tetap dengan harga realistis (rupiah, integer). */
    public static function products(): array
    {
        return [
            ['name' => 'Kopi Arabika 250g',   'price' => 68000, 'unit' => '250g',  'category' => 'Minuman'],
            ['name' => 'Teh Melati 100g',     'price' => 24500, 'unit' => '100g',  'category' => 'Minuman'],
            ['name' => 'Gula Aren 500g',      'price' => 32000, 'unit' => '500g',  'category' => 'Bahan Dapur'],
            ['name' => 'Madu Hutan 350ml',    'price' => 95000, 'unit' => '350ml', 'category' => 'Bahan Dapur'],
            ['name' => 'Keripik Singkong 200g','price' => 18000, 'unit' => '200g',  'category' => 'Snack'],
            ['name' => 'Sambal Bawang 150g',  'price' => 27500, 'unit' => '150g',  'category' => 'Bumbu'],
            ['name' => 'Kopi Robusta 500g',   'price' => 85000, 'unit' => '500g',  'category' => 'Minuman'],
            ['name' => 'Beras Merah 1kg',     'price' => 42000, 'unit' => '1kg',   'category' => 'Bahan Dapur'],
        ];
    }

    /* ============================ Tabel pesanan ============================ */

    private static function rp(int $value): string
    {
        return 'Rp'.number_format($value, 0, ',', '.');
    }

    /** Header untuk demo data-table. */
    public static function orderHeaders(): array
    {
        return [
            ['key' => 'id',       'label' => 'ID',       'sortable' => true],
            ['key' => 'customer', 'label' => 'Pelanggan', 'sortable' => true],
            ['key' => 'product',  'label' => 'Produk',    'sortable' => true],
            ['key' => 'total',    'label' => 'Total',     'sortable' => true],
            ['key' => 'status',   'label' => 'Status'],
        ];
    }

    /**
     * 24 pesanan ditulis eksplisit dari katalog (total = harga × qty).
     * Distribusi status: Lunas 12, Diproses 6, Menunggu 4, Batal 2.
     */
    public static function orders(int $count = 24): array
    {
        $rows = [
            ['id' => '#ORD-0001', 'customer' => 'Toko Berkah Jaya',      'product' => 'Kopi Arabika 250g × 40',    'total' => self::rp(2720000), 'status' => ['label' => 'Lunas',    'tone' => 'success']],
            ['id' => '#ORD-0002', 'customer' => 'Warung Sederhana',      'product' => 'Gula Aren 500g × 25',       'total' => self::rp(800000),  'status' => ['label' => 'Diproses', 'tone' => 'info']],
            ['id' => '#ORD-0003', 'customer' => 'Kafe Aroma',            'product' => 'Kopi Robusta 500g × 30',    'total' => self::rp(2550000), 'status' => ['label' => 'Lunas',    'tone' => 'success']],
            ['id' => '#ORD-0004', 'customer' => 'Toko Kelontong Maju',   'product' => 'Teh Melati 100g × 60',      'total' => self::rp(1470000), 'status' => ['label' => 'Menunggu', 'tone' => 'warning']],
            ['id' => '#ORD-0005', 'customer' => 'RM Padang Sari Rasa',   'product' => 'Sambal Bawang 150g × 45',   'total' => self::rp(1237500), 'status' => ['label' => 'Lunas',    'tone' => 'success']],
            ['id' => '#ORD-0006', 'customer' => 'Kafe Kopi Kita',        'product' => 'Kopi Arabika 250g × 25',    'total' => self::rp(1700000), 'status' => ['label' => 'Diproses', 'tone' => 'info']],
            ['id' => '#ORD-0007', 'customer' => 'Toko Sembako Barokah',  'product' => 'Beras Merah 1kg × 50',      'total' => self::rp(2100000), 'status' => ['label' => 'Lunas',    'tone' => 'success']],
            ['id' => '#ORD-0008', 'customer' => 'Warung Kopi Nusantara', 'product' => 'Kopi Robusta 500g × 12',    'total' => self::rp(1020000), 'status' => ['label' => 'Menunggu', 'tone' => 'warning']],
            ['id' => '#ORD-0009', 'customer' => 'Toko Oleh-Oleh Khas',   'product' => 'Madu Hutan 350ml × 18',     'total' => self::rp(1710000), 'status' => ['label' => 'Lunas',    'tone' => 'success']],
            ['id' => '#ORD-0010', 'customer' => 'Kantin Sejahtera',      'product' => 'Keripik Singkong 200g × 80','total' => self::rp(1440000), 'status' => ['label' => 'Lunas',    'tone' => 'success']],
            ['id' => '#ORD-0011', 'customer' => 'Toko Berkah Jaya',      'product' => 'Teh Melati 100g × 100',     'total' => self::rp(2450000), 'status' => ['label' => 'Diproses', 'tone' => 'info']],
            ['id' => '#ORD-0012', 'customer' => 'Warung Sederhana',      'product' => 'Kopi Arabika 250g × 15',    'total' => self::rp(1020000), 'status' => ['label' => 'Batal',    'tone' => 'destructive']],
            ['id' => '#ORD-0013', 'customer' => 'Kafe Aroma',            'product' => 'Gula Aren 500g × 40',       'total' => self::rp(1280000), 'status' => ['label' => 'Lunas',    'tone' => 'success']],
            ['id' => '#ORD-0014', 'customer' => 'Toko Kelontong Maju',   'product' => 'Keripik Singkong 200g × 120','total' => self::rp(2160000),'status' => ['label' => 'Lunas',    'tone' => 'success']],
            ['id' => '#ORD-0015', 'customer' => 'RM Padang Sari Rasa',   'product' => 'Sambal Bawang 150g × 60',   'total' => self::rp(1650000), 'status' => ['label' => 'Diproses', 'tone' => 'info']],
            ['id' => '#ORD-0016', 'customer' => 'Kafe Kopi Kita',        'product' => 'Madu Hutan 350ml × 10',     'total' => self::rp(950000),  'status' => ['label' => 'Menunggu', 'tone' => 'warning']],
            ['id' => '#ORD-0017', 'customer' => 'Toko Sembako Barokah',  'product' => 'Kopi Robusta 500g × 20',    'total' => self::rp(1700000), 'status' => ['label' => 'Lunas',    'tone' => 'success']],
            ['id' => '#ORD-0018', 'customer' => 'Warung Kopi Nusantara', 'product' => 'Teh Melati 100g × 40',      'total' => self::rp(980000),  'status' => ['label' => 'Lunas',    'tone' => 'success']],
            ['id' => '#ORD-0019', 'customer' => 'Toko Oleh-Oleh Khas',   'product' => 'Keripik Singkong 200g × 150','total' => self::rp(2700000),'status' => ['label' => 'Diproses', 'tone' => 'info']],
            ['id' => '#ORD-0020', 'customer' => 'Kantin Sejahtera',      'product' => 'Beras Merah 1kg × 30',      'total' => self::rp(1260000), 'status' => ['label' => 'Menunggu', 'tone' => 'warning']],
            ['id' => '#ORD-0021', 'customer' => 'Toko Berkah Jaya',      'product' => 'Madu Hutan 350ml × 24',     'total' => self::rp(2280000), 'status' => ['label' => 'Lunas',    'tone' => 'success']],
            ['id' => '#ORD-0022', 'customer' => 'Warung Sederhana',      'product' => 'Sambal Bawang 150g × 30',   'total' => self::rp(825000),  'status' => ['label' => 'Batal',    'tone' => 'destructive']],
            ['id' => '#ORD-0023', 'customer' => 'Kafe Aroma',            'product' => 'Kopi Arabika 250g × 35',    'total' => self::rp(2380000), 'status' => ['label' => 'Diproses', 'tone' => 'info']],
            ['id' => '#ORD-0024', 'customer' => 'Toko Kelontong Maju',   'product' => 'Gula Aren 500g × 50',       'total' => self::rp(1600000), 'status' => ['label' => 'Lunas',    'tone' => 'success']],
        ];

        return array_slice($rows, 0, max(0, $count));
    }

    /**
     * Data donut "Pesanan per Status", diturunkan dari status orders(),
     * jadi selalu konsisten dengan tabel pesanan.
     */
    public static function orderStatusChart(): array
    {
        $order = ['Lunas', 'Menunggu', 'Diproses', 'Batal'];
        $palette = [
            'Lunas'    => '#22c55e',
            'Menunggu' => '#f59e0b',
            'Diproses' => '#0066cd',
            'Batal'    => '#ef4444',
        ];

        $counts = array_fill_keys($order, 0);
        foreach (self::orders() as $row) {
            $label = $row['status']['label'];
            if (array_key_exists($label, $counts)) {
                $counts[$label]++;
            }
        }

        return [
            'labels'   => $order,
            'datasets' => [[
                'data'            => array_values($counts),
                'backgroundColor' => array_map(fn (string $label) => $palette[$label], $order),
            ]],
        ];
    }

    /* ============================ Grafik ============================ */

    public static function salesChart(): array
    {
        return [
            'labels' => ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
            'datasets' => [
                [
                    'label' => 'Penjualan (juta Rp)',
                    'data' => [12, 19, 14, 22, 28, 24],
                    'borderColor' => '#0066cd', // --primary / --chart-1
                    'backgroundColor' => 'rgba(0, 102, 205, 0.15)',
                    'fill' => true,
                    'tension' => 0.4,
                ],
            ],
        ];
    }

    public static function categoryChart(): array
    {
        return [
            'labels' => ['Minuman', 'Makanan', 'Snack', 'Lainnya'],
            'datasets' => [
                [
                    'data' => [35, 30, 20, 15],
                    'backgroundColor' => ['#0066cd', '#22c55e', '#f59e0b', '#94a3b8'],
                ],
            ],
        ];
    }

    /* ------------------------- Varian dashboard ------------------------- */

    /** Analytics: sesi harian + sumber traffic. */
    public static function analyticsSessions(): array
    {
        return [
            'labels' => ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
            'datasets' => [
                ['label' => 'Sesi', 'data' => [1240, 1890, 1620, 2100, 2450, 1980, 1740], 'tension' => 0.4, 'fill' => true],
                ['label' => 'Pengguna baru', 'data' => [320, 410, 380, 520, 610, 480, 390], 'tension' => 0.4],
            ],
        ];
    }

    public static function analyticsSources(): array
    {
        return [
            'labels' => ['Organik', 'Media Sosial', 'Iklan', 'Referral', 'Langsung'],
            'datasets' => [['data' => [38, 24, 16, 12, 10]]], // tanpa warna: ikut palet tema
        ];
    }

    /** eCommerce: penjualan bulanan + kategori terlaris. */
    public static function ecommerceSales(): array
    {
        return [
            'labels' => ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
            'datasets' => [
                ['label' => 'Penjualan (juta Rp)', 'data' => [42, 55, 48, 66, 74, 69]],
                ['label' => 'Target (juta Rp)', 'data' => [40, 45, 50, 55, 60, 65], 'type' => 'line', 'tension' => 0.4],
            ],
        ];
    }

    /** CRM: pipeline deals per tahap (funnel horizontal). */
    public static function crmPipeline(): array
    {
        return [
            'labels' => ['Kualifikasi', 'Proposal', 'Negosiasi', 'Closing'],
            'datasets' => [['label' => 'Deals (juta Rp)', 'data' => [120, 85, 54, 32]]],
        ];
    }

    /** Aktivitas CRM dari karyawan & pelanggan dunia demo. */
    public static function crmActivity(): array
    {
        return [
            ['name' => 'Agus Wijaya',   'action' => 'mengirim proposal pasokan kopi ke Kafe Aroma',        'time' => '10 mnt lalu'],
            ['name' => 'Dedi Kurniawan','action' => 'follow-up PO Gula Aren dari Warung Sederhana',        'time' => '1 jam lalu'],
            ['name' => 'Maya Putri',    'action' => 'closing deal Rp18,4 jt dengan Kafe Aroma',             'time' => '3 jam lalu'],
            ['name' => 'Rudi Hartono',  'action' => 'menyiapkan 200kg Kopi Arabika untuk Toko Berkah Jaya', 'time' => 'Kemarin'],
        ];
    }

    public static function dealsHeaders(): array
    {
        return [
            ['key' => 'deal', 'label' => 'Deal', 'sortable' => true],
            ['key' => 'company', 'label' => 'Perusahaan', 'sortable' => true],
            ['key' => 'value', 'label' => 'Nilai', 'sortable' => true],
            ['key' => 'stage', 'label' => 'Tahap'],
            ['key' => 'owner', 'label' => 'Pemilik'],
        ];
    }

    /** 12 deal B2B ditulis eksplisit (perusahaan + owner dari dunia demo). */
    public static function deals(int $count = 12): array
    {
        $rows = [
            ['id' => 1,  'deal' => 'Pasokan Kopi Arabika, Kafe Aroma',      'company' => 'Kafe Aroma',            'value' => self::rp(18400000), 'stage' => ['label' => 'Negosiasi',   'tone' => 'warning'],     'owner' => 'Agus Wijaya'],
            ['id' => 2,  'deal' => 'Kontrak Gula Aren Bulanan, Warung Sederhana','company' => 'Warung Sederhana', 'value' => self::rp(9600000),  'stage' => ['label' => 'Closing',     'tone' => 'success'],     'owner' => 'Dedi Kurniawan'],
            ['id' => 3,  'deal' => 'Pengadaan Beras Merah, Kantin Sejahtera','company' => 'Kantin Sejahtera',     'value' => self::rp(12600000), 'stage' => ['label' => 'Proposal',    'tone' => 'warning'],     'owner' => 'Agus Wijaya'],
            ['id' => 4,  'deal' => 'Suplai Sambal Bawang, RM Padang Sari Rasa','company' => 'RM Padang Sari Rasa','value' => self::rp(7425000),  'stage' => ['label' => 'Negosiasi',   'tone' => 'warning'],     'owner' => 'Dedi Kurniawan'],
            ['id' => 5,  'deal' => 'Kemitraan Kopi Robusta, Warung Kopi Nusantara','company' => 'Warung Kopi Nusantara','value' => self::rp(15300000),'stage' => ['label' => 'Kualifikasi','tone' => 'info'],        'owner' => 'Agus Wijaya'],
            ['id' => 6,  'deal' => 'Restock Madu Hutan, Toko Oleh-Oleh Khas','company' => 'Toko Oleh-Oleh Khas',  'value' => self::rp(11400000), 'stage' => ['label' => 'Closing',     'tone' => 'success'],     'owner' => 'Dedi Kurniawan'],
            ['id' => 7,  'deal' => 'Pasokan Teh Melati, Toko Kelontong Maju','company' => 'Toko Kelontong Maju',  'value' => self::rp(4900000),  'stage' => ['label' => 'Proposal',    'tone' => 'warning'],     'owner' => 'Agus Wijaya'],
            ['id' => 8,  'deal' => 'Keripik Singkong Grosir, Toko Berkah Jaya','company' => 'Toko Berkah Jaya',   'value' => self::rp(21600000), 'stage' => ['label' => 'Negosiasi',   'tone' => 'warning'],     'owner' => 'Dedi Kurniawan'],
            ['id' => 9,  'deal' => 'Program Kopi Kantor, Kafe Kopi Kita',   'company' => 'Kafe Kopi Kita',        'value' => self::rp(8500000),  'stage' => ['label' => 'Kualifikasi', 'tone' => 'info'],        'owner' => 'Agus Wijaya'],
            ['id' => 10, 'deal' => 'Sembako Rutin, Toko Sembako Barokah',   'company' => 'Toko Sembako Barokah',  'value' => self::rp(6720000),  'stage' => ['label' => 'Closing',     'tone' => 'success'],     'owner' => 'Dedi Kurniawan'],
            ['id' => 11, 'deal' => 'Kopi Arabika Premium, Kafe Aroma',      'company' => 'Kafe Aroma',            'value' => self::rp(27200000), 'stage' => ['label' => 'Batal',       'tone' => 'destructive'], 'owner' => 'Agus Wijaya'],
            ['id' => 12, 'deal' => 'Paket Oleh-Oleh, Toko Oleh-Oleh Khas',  'company' => 'Toko Oleh-Oleh Khas',   'value' => self::rp(13680000), 'stage' => ['label' => 'Kualifikasi', 'tone' => 'info'],        'owner' => 'Dedi Kurniawan'],
        ];

        return array_slice($rows, 0, max(0, $count));
    }

    /* ------------------------- Kanban & kalender ------------------------- */

    /** Tugas operasional gudang & penjualan per kolom kanban. */
    public static function kanbanTasks(): array
    {
        return [
            'Antrian' => [
                'Kemas 200kg Kopi Arabika untuk Toko Berkah Jaya',
                'Cetak faktur 12 pesanan minggu ini',
                'Stok opname gudang, Keripik Singkong',
            ],
            'Dikerjakan' => [
                'Follow-up PO Kafe Aroma',
                'Kirim Gula Aren ke Warung Sederhana (jadwal Kamis)',
                'Negosiasi kontrak Beras Merah, Kantin Sejahtera',
            ],
            'Selesai' => [
                'Kirim Sambal Bawang ke RM Padang Sari Rasa',
                'Restock Madu Hutan, Toko Oleh-Oleh Khas',
                'Update harga katalog Oktober',
            ],
        ];
    }

    /** Jadwal pengiriman & operasional. */
    public static function calendarEvents(): array
    {
        return [
            ['title' => 'Pengiriman Kopi Arabika, Toko Berkah Jaya', 'date' => '2026-10-09', 'tag' => 'Pengiriman'],
            ['title' => 'Stok opname gudang',                         'date' => '2026-10-10', 'tag' => 'Gudang'],
            ['title' => 'Pengiriman Gula Aren, Warung Sederhana',    'date' => '2026-10-12', 'tag' => 'Pengiriman'],
            ['title' => 'Meeting sales mingguan',                     'date' => '2026-10-13', 'tag' => 'Rapat'],
            ['title' => 'Restock Madu Hutan dari pemasok',             'date' => '2026-10-14', 'tag' => 'Pemasok'],
            ['title' => 'Pengiriman Beras Merah, Kantin Sejahtera',  'date' => '2026-10-15', 'tag' => 'Pengiriman'],
        ];
    }

    /* ------------------------- Halaman pendukung ------------------------- */

    public static function pricingPlans(): array
    {
        return [
            [
                'name' => 'Gratis', 'price' => 'Rp0', 'period' => '/selamanya',
                'description' => 'Untuk mencoba dan proyek kecil.',
                'features' => ['1 proyek', 'Komponen dasar', 'Dukungan komunitas'],
                'cta' => 'Mulai Gratis', 'highlight' => false,
            ],
            [
                'name' => 'Pro', 'price' => 'Rp99rb', 'period' => '/bulan',
                'description' => 'Untuk tim dan produk yang serius.',
                'features' => ['Proyek tanpa batas', 'Semua komponen + varian dashboard', 'Dukungan prioritas', 'Update selamanya'],
                'cta' => 'Pilih Pro', 'highlight' => true,
            ],
            [
                'name' => 'Enterprise', 'price' => 'Hubungi kami', 'period' => '',
                'description' => 'Untuk kebutuhan khusus perusahaan.',
                'features' => ['Semua fitur Pro', 'SSO & audit log', 'SLA 99,9%', 'Manajer akun khusus'],
                'cta' => 'Hubungi Sales', 'highlight' => false,
            ],
        ];
    }

    public static function faqs(): array
    {
        return [
            ['q' => 'Apakah template ini gratis dipakai untuk proyek komersial?',
             'a' => 'Ya. Template ini bebas dipakai untuk proyek pribadi maupun komersial. Anda boleh memodifikasi, menjual hasil akhirnya, dan menghapus kredit template.'],
            ['q' => 'Bagaimana cara menambah halaman baru?',
             'a' => 'Buat file di resources/js/pages/NamaHalaman.tsx, daftarkan route Inertia di routes/web.php, lalu tambah satu entry di resources/js/lib/nav.ts agar muncul di sidebar. Ikuti pola halaman yang sudah ada.'],
            ['q' => 'Apakah mendukung dark mode?',
             'a' => 'Ya. Toggle ada di header, pilihan tersimpan di localStorage, dan chart otomatis mengikuti tema aktif karena memakai CSS variable.'],
            ['q' => 'Bagaimana cara memakai komponen UI?',
             'a' => 'Tinggal import dari alias @/components/ui, contoh: import { Button } from "@/components/ui/button". Semua komponen bergaya shadcn + Tailwind v4.'],
            ['q' => 'Bagaimana cara ganti warna tema?',
             'a' => 'Ubah variabel --primary (dan --chart-1, --sidebar-primary) di blok :root dan .dark pada resources/css/app.css, lalu samakan nilai primaryOklch di resources/js/config/brand.ts. Semua komponen ikut otomatis.'],
        ];
    }

    /* ------------------------- Template: Landing Page ------------------------- */

    public static function landingFeatures(): array
    {
        return [
            ['icon' => 'layout-dashboard', 'title' => 'Siap pakai, tinggal tarik',
             'text' => '26 komponen React shadcn-style yang langsung bisa dipakai: import { Button } from "@/components/ui/button".'],
            ['icon' => 'moon', 'title' => 'Dark mode tanpa ribet',
             'text' => 'Theming via CSS variable: toggle sekali klik, tersimpan otomatis, chart ikut berganti warna.'],
            ['icon' => 'smartphone', 'title' => 'Responsif mobile-first',
             'text' => 'Sidebar jadi drawer + bottom-nav di HP, tabel otomatis jadi kartu, target sentuh minimal 44px.'],
            ['icon' => 'zap', 'title' => 'Ringan & cepat',
             'text' => 'Inertia.js: SPA tanpa API ganda. Satu codebase Laravel + React, navigasi tanpa reload.'],
            ['icon' => 'shield-check', 'title' => 'Pola backend rapi',
             'text' => 'Controller tipis, FormRequest per aksi, Service per domain, envelope API konsisten.'],
            ['icon' => 'sparkles', 'title' => 'Desain teruji',
             'text' => 'Bahasa desain yang sudah dipakai di aplikasi administrasi produksi, bukan tebakan.'],
        ];
    }

    /**
     * Angka diverifikasi dari repo (2026-10-08):
     * 26 file di resources/js/components/ui,
     * 18 halaman di resources/js/pages (13 .tsx top-level + 5 subdirektori),
     * 98 test (56 Pest, hasil `php artisan test`, + 42 Vitest).
     */
    public static function landingStats(): array
    {
        return [
            ['value' => '26',   'label' => 'Komponen siap pakai'],
            ['value' => '18',   'label' => 'Halaman demo'],
            ['value' => '98',   'label' => 'Test otomatis hijau'],
            ['value' => '100%', 'label' => 'Responsif mobile'],
        ];
    }

    /** Strip "dibangun dengan" untuk landing page. */
    public static function landingStack(): array
    {
        return [
            ['name' => 'Laravel 13',  'desc' => 'Backend, queue & API'],
            ['name' => 'Inertia v3',  'desc' => 'SPA tanpa API ganda'],
            ['name' => 'React 18',    'desc' => 'Komponen UI interaktif'],
            ['name' => 'Tailwind v4', 'desc' => 'Styling via CSS variable'],
        ];
    }
}
