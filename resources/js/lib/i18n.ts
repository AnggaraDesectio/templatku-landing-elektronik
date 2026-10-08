// i18n ringan untuk template: kamus ID/EN + fungsi t().
// BUKAN bundle i18n berat, hanya lookup key → string.
// Locale aktif dibagikan backend via shared Inertia prop `locale`
// (lihat HandleInertiaRequests). Cara pakai di komponen:
//
//   const t = useT();
//   <h1>{t('dashboard.title')}</h1>
//
// Menambah key baru: tambah di KEDUA objek di bawah (id & en),
// lalu dokumentasikan di README bagian "Multi-bahasa (ID/EN)".
import { usePage } from '@inertiajs/react';

export type Locale = 'id' | 'en';

const dict = {
    id: {
        // Sidebar
        'nav.dashboard': 'Dashboard',
        'nav.analytics': 'Analytics',
        'nav.ecommerce': 'eCommerce',
        'nav.crm': 'CRM',
        'nav.components': 'Galeri Komponen',
        'nav.tables': 'Tabel',
        'nav.forms': 'Form',
        'nav.kanban': 'Kanban',
        'nav.calendar': 'Kalender',
        'nav.invoices': 'Invoice',
        'nav.pricing': 'Harga',
        'nav.faq': 'FAQ',
        'nav.templates': 'Galeri Template',
        'nav.settings': 'Pengaturan',
        'nav.users': 'Pengguna',
        'nav.roles': 'Peran & Izin',
        'nav.section.management': 'Manajemen',
        'nav.section.components': 'Komponen',
        'nav.section.demo': 'Demo',
        'nav.section.productivity': 'Produktivitas',
        'nav.section.pages': 'Halaman',
        'nav.section.account': 'Akun',
        'nav.section.landings': 'Landing Page',
        // Varian dashboard per industri
        'nav.logistik': 'Logistik',
        'nav.hr': 'HR & SDM',
        'nav.pos': 'Kasir (POS)',
        'nav.proyek': 'Proyek',
        'nav.akademik': 'Akademik',
        'nav.klinik': 'Klinik',
        'nav.inventory': 'Inventori',
        'nav.marketing': 'Marketing',
        'nav.rental': 'Rental',
        'nav.laundry': 'Laundry',
        // Varian landing per vertikal
        'nav.landing.fashion': 'Fashion',
        'nav.landing.saas': 'SaaS',
        'nav.landing.gadget': 'Gadget',
        'nav.landing.perkakas': 'Perkakas',
        'nav.landing.elektronik': 'Elektronik',
        'nav.landing.ecommerce': 'E-commerce',
        'nav.landing.fnb': 'Kuliner (F&B)',
        'nav.landing.jasa': 'Jasa',
        'nav.landing.properti': 'Properti',
        // Dashboard
        'dashboard.title': 'Dashboard',
        'dashboard.greeting': 'Halo, {name}',
        'dashboard.subtitle': '{role} · Berikut ringkasan hari ini.',
        'dashboard.download': 'Unduh Laporan',
        'dashboard.tab.sales': 'Grafik Penjualan',
        'dashboard.tab.categories': 'Grafik Kategori',
        'dashboard.sales.title': 'Penjualan 6 Bulan Terakhir',
        'dashboard.sales.desc': 'Perbandingan penjualan per bulan.',
        'dashboard.category.title': 'Komposisi Kategori',
        'dashboard.category.desc': 'Distribusi penjualan per kategori produk.',
        'dashboard.status.title': 'Pesanan per Status',
        'dashboard.status.desc': 'Ringkasan status pesanan aktif.',
        'dashboard.recent.title': 'Pesanan Terbaru',
        'dashboard.recent.desc': 'Pesanan yang baru masuk ke sistem.',
        'dashboard.agenda.title': 'Agenda Kegiatan Terdekat',
        'dashboard.agenda.desc': 'Jadwal 7 hari ke depan',
        'dashboard.view_all': 'Lihat semua',
        // Pesanan
        'orders.empty': 'Belum ada pesanan, tambahkan pesanan pertama',
        // Kalender
        'calendar.title': 'Kalender',
        'calendar.today': 'Hari Ini',
        'calendar.events_on': 'Kegiatan {date}',
        'calendar.no_events': 'Tidak ada kegiatan pada tanggal ini.',
        // Kanban
        'kanban.title': 'Kanban',
        // Pengguna & Peran
        'users.title': 'Pengguna',
        'users.description': 'Kelola akun pengguna beserta perannya.',
        'users.detail': 'Detail Pengguna',
        'users.edit_title': 'Ubah Pengguna',
        'roles.title': 'Peran & Izin',
        'roles.description': 'Kelola peran dan matriks izin aplikasi.',
    },
    en: {
        // Sidebar
        'nav.dashboard': 'Dashboard',
        'nav.analytics': 'Analytics',
        'nav.ecommerce': 'eCommerce',
        'nav.crm': 'CRM',
        'nav.components': 'Component Gallery',
        'nav.tables': 'Tables',
        'nav.forms': 'Forms',
        'nav.kanban': 'Kanban',
        'nav.calendar': 'Calendar',
        'nav.invoices': 'Invoices',
        'nav.pricing': 'Pricing',
        'nav.faq': 'FAQ',
        'nav.templates': 'Template Gallery',
        'nav.settings': 'Settings',
        'nav.users': 'Users',
        'nav.roles': 'Roles & Permissions',
        'nav.section.management': 'Management',
        'nav.section.components': 'Components',
        'nav.section.demo': 'Demo',
        'nav.section.productivity': 'Productivity',
        'nav.section.pages': 'Pages',
        'nav.section.account': 'Account',
        'nav.section.landings': 'Landing Pages',
        // Industry dashboard variants
        'nav.logistik': 'Logistics',
        'nav.hr': 'HR',
        'nav.pos': 'POS',
        'nav.proyek': 'Projects',
        'nav.akademik': 'Academic',
        'nav.klinik': 'Clinic',
        'nav.inventory': 'Inventory',
        'nav.marketing': 'Marketing',
        'nav.rental': 'Rental',
        'nav.laundry': 'Laundry',
        // Landing variants per vertical
        'nav.landing.fashion': 'Fashion',
        'nav.landing.saas': 'SaaS',
        'nav.landing.gadget': 'Gadget',
        'nav.landing.perkakas': 'Tools',
        'nav.landing.elektronik': 'Electronics',
        'nav.landing.ecommerce': 'E-commerce',
        'nav.landing.fnb': 'F&B',
        'nav.landing.jasa': 'Services',
        'nav.landing.properti': 'Property',
        // Dashboard
        'dashboard.title': 'Dashboard',
        'dashboard.greeting': 'Hello, {name}',
        'dashboard.subtitle': "{role} · Here's today's summary.",
        'dashboard.download': 'Download Report',
        'dashboard.tab.sales': 'Sales Chart',
        'dashboard.tab.categories': 'Category Chart',
        'dashboard.sales.title': 'Sales, Last 6 Months',
        'dashboard.sales.desc': 'Monthly sales comparison.',
        'dashboard.category.title': 'Category Composition',
        'dashboard.category.desc': 'Sales distribution by product category.',
        'dashboard.status.title': 'Orders by Status',
        'dashboard.status.desc': 'Summary of active order statuses.',
        'dashboard.recent.title': 'Recent Orders',
        'dashboard.recent.desc': 'Orders most recently entered into the system.',
        'dashboard.agenda.title': 'Upcoming Agenda',
        'dashboard.agenda.desc': 'Schedule for the next 7 days',
        'dashboard.view_all': 'View all',
        // Orders
        'orders.empty': 'No orders yet, add your first order',
        // Calendar
        'calendar.title': 'Calendar',
        'calendar.today': 'Today',
        'calendar.events_on': 'Events on {date}',
        'calendar.no_events': 'No events on this date.',
        // Kanban
        'kanban.title': 'Kanban',
        // Users & Roles
        'users.title': 'Users',
        'users.description': 'Manage user accounts and their roles.',
        'users.detail': 'User Detail',
        'users.edit_title': 'Edit User',
        'roles.title': 'Roles & Permissions',
        'roles.description': 'Manage roles and the application permission matrix.',
    },
} as const;

type DictKey = keyof (typeof dict)['id'];

/** Ambil string terjemahan. Fallback: ID → key apa adanya. */
export function t(key: string, locale: Locale = 'id'): string {
    const table = (dict[locale] ?? dict.id) as Record<string, string>;
    if (table[key] !== undefined) return table[key];
    const fallback = (dict.id as Record<string, string>)[key];
    return fallback ?? key;
}

/** Cek sebuah key terdaftar di kamus (berguna untuk test). */
export function hasKey(key: string): key is DictKey {
    return key in dict.id;
}

/** Locale aktif dari shared Inertia prop. Default 'id'. */
export function useLocale(): Locale {
    const props = usePage().props as { locale?: string };
    return props.locale === 'en' ? 'en' : 'id';
}

/** Hook t() yang sudah terikat ke locale aktif halaman. */
export function useT(): (key: string) => string {
    const locale = useLocale();
    return (key: string) => t(key, locale);
}

/** Nama hari Senin–Minggu sesuai locale (untuk grid kalender). */
export function weekdayNames(locale: Locale): string[] {
    return locale === 'en'
        ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        : ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
}
