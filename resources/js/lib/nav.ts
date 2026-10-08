// Daftar menu sidebar + bottom-nav mobile.
// Untuk menambah halaman: tambah route di routes/web.php,
// lalu tambah satu entry di sini.
// Label tampil diterjemahkan via lib/i18n (labelKey), `label`
// adalah fallback Bahasa Indonesia bila key belum ada.
import {
    AlertCircle,
    ArrowLeftRight,
    Beef,
    Bell,
    Blocks,
    BookOpen,
    Boxes,
    Briefcase,
    Building2,
    CalendarCheck,
    CalendarDays,
    CalendarClock,
    Car,
    ChartLine,
    ChefHat,
    ClipboardList,
    Cloud,
    Coffee,
    Cog,
    CreditCard,
    Dumbbell,
    Eye,
    FileBarChart,
    FileSignature,
    FileText,
    Filter,
    Globe,
    GraduationCap,
    HandCoins,
    Headphones,
    HeartHandshake,
    HelpCircle,
    Home,
    KeyRound,
    LayoutDashboard,
    ListChecks,
    ListOrdered,
    Map,
    Megaphone,
    MousePointerClick,
    Package,
    PawPrint,
    Percent,
    PiggyBank,
    Pill,
    Receipt,
    Route,
    Scissors,
    Settings,
    ShieldCheck,
    Shirt,
    ShoppingBag,
    ShoppingCart,
    Sparkles,
    SquareKanban,
    Stethoscope,
    Store,
    Syringe,
    Table2,
    Target,
    Ticket,
    Timer,
    TrendingUp,
    Truck,
    Tv,
    User,
    Users,
    UtensilsCrossed,
    Wallet,
    Warehouse,
    WashingMachine,
    Waves,
    Wrench,
    BedDouble,
    type LucideIcon,
} from 'lucide-react';
import type { TemplateNavItem, TemplateNavSection } from '@/types/template';

export interface NavItem {
    to: string;
    label: string;
    /** Key kamus i18n, mis. 'nav.dashboard'. Opsional, bila kosong, `label` dipakai apa adanya. */
    labelKey?: string;
    icon: LucideIcon;
    /** Item ke-4 pertama tampil di bottom-nav mobile. */
    mobile?: boolean;
}

export interface NavSection {
    /** Kunci stabil untuk filter flavor, mis. 'dashboards'. */
    key?: string;
    label?: string;
    /** Key kamus i18n untuk label section, mis. 'nav.section.demo'. */
    labelKey?: string;
    items: NavItem[];
}

export const navSections: NavSection[] = [
    {
        key: 'dashboards',
        items: [
            {
                to: '/',
                label: 'Dashboard',
                labelKey: 'nav.dashboard',
                icon: LayoutDashboard,
                mobile: true,
            },
            {
                to: '/analytics',
                label: 'Analytics',
                labelKey: 'nav.analytics',
                icon: Home,
            },
            {
                to: '/ecommerce',
                label: 'eCommerce',
                labelKey: 'nav.ecommerce',
                icon: Wallet,
            },
            {
                to: '/crm',
                label: 'CRM',
                labelKey: 'nav.crm',
                icon: User,
            },
            {
                to: '/logistik',
                label: 'Logistik',
                labelKey: 'nav.logistik',
                icon: Truck,
            },
            {
                to: '/hr',
                label: 'HR & SDM',
                labelKey: 'nav.hr',
                icon: Briefcase,
            },
            {
                to: '/pos',
                label: 'Kasir (POS)',
                labelKey: 'nav.pos',
                icon: ShoppingCart,
            },
            {
                to: '/proyek',
                label: 'Proyek',
                labelKey: 'nav.proyek',
                icon: ListChecks,
            },
            {
                to: '/akademik',
                label: 'Akademik',
                labelKey: 'nav.akademik',
                icon: GraduationCap,
            },
            {
                to: '/klinik',
                label: 'Klinik',
                labelKey: 'nav.klinik',
                icon: Stethoscope,
            },
            {
                to: '/inventory',
                label: 'Inventori',
                labelKey: 'nav.inventory',
                icon: Warehouse,
            },
            {
                to: '/marketing',
                label: 'Marketing',
                labelKey: 'nav.marketing',
                icon: Megaphone,
            },
            {
                to: '/rental',
                label: 'Rental',
                labelKey: 'nav.rental',
                icon: Car,
            },
            {
                to: '/laundry',
                label: 'Laundry',
                labelKey: 'nav.laundry',
                icon: WashingMachine,
            },
        ],
    },
    {
        key: 'landings',
        label: 'Landing Page',
        labelKey: 'nav.section.landings',
        items: [
            {
                to: '/landings/fashion',
                label: 'Fashion',
                labelKey: 'nav.landing.fashion',
                icon: Shirt,
            },
            {
                to: '/landings/saas',
                label: 'SaaS',
                labelKey: 'nav.landing.saas',
                icon: Cloud,
            },
            {
                to: '/landings/gadget',
                label: 'Gadget',
                labelKey: 'nav.landing.gadget',
                icon: Headphones,
            },
            {
                to: '/landings/perkakas',
                label: 'Perkakas',
                labelKey: 'nav.landing.perkakas',
                icon: Wrench,
            },
            {
                to: '/landings/elektronik',
                label: 'Elektronik',
                labelKey: 'nav.landing.elektronik',
                icon: Tv,
            },
            {
                to: '/landings/ecommerce',
                label: 'E-commerce',
                labelKey: 'nav.landing.ecommerce',
                icon: Store,
            },
            {
                to: '/landings/fnb',
                label: 'Kuliner (F&B)',
                labelKey: 'nav.landing.fnb',
                icon: Coffee,
            },
            {
                to: '/landings/jasa',
                label: 'Jasa',
                labelKey: 'nav.landing.jasa',
                icon: Sparkles,
            },
            {
                to: '/landings/properti',
                label: 'Properti',
                labelKey: 'nav.landing.properti',
                icon: Building2,
            },
        ],
    },
    {
        key: 'management',
        label: 'Manajemen',
        labelKey: 'nav.section.management',
        items: [
            {
                to: '/users',
                label: 'Pengguna',
                labelKey: 'nav.users',
                icon: Users,
            },
            {
                to: '/roles',
                label: 'Peran & Izin',
                labelKey: 'nav.roles',
                icon: ShieldCheck,
            },
        ],
    },
    {
        key: 'situs',
        label: 'Situs',
        items: [
            {
                to: '/dashboard',
                label: 'Dashboard CMS',
                icon: LayoutDashboard,
            },
            {
                to: '/admin/templates',
                label: 'Template',
                icon: Globe,
            },
            {
                to: '/admin/analytics',
                label: 'Analitik',
                icon: ChartLine,
            },
            {
                to: '/admin/pages',
                label: 'Konten Halaman',
                icon: FileText,
            },
        ],
    },
    {
        key: 'components',
        label: 'Komponen',
        labelKey: 'nav.section.components',
        items: [
            {
                to: '/components',
                label: 'Galeri Komponen',
                labelKey: 'nav.components',
                icon: Blocks,
            },
        ],
    },
    {
        key: 'productivity',
        label: 'Produktivitas',
        labelKey: 'nav.section.productivity',
        items: [
            {
                to: '/kanban',
                label: 'Kanban',
                labelKey: 'nav.kanban',
                icon: SquareKanban,
            },
            {
                to: '/calendar',
                label: 'Kalender',
                labelKey: 'nav.calendar',
                icon: CalendarDays,
            },
            {
                to: '/invoices',
                label: 'Invoice',
                labelKey: 'nav.invoices',
                icon: Receipt,
            },
        ],
    },
    {
        key: 'demo',
        label: 'Demo',
        labelKey: 'nav.section.demo',
        items: [
            {
                to: '/tables',
                label: 'Tabel',
                labelKey: 'nav.tables',
                icon: Table2,
                mobile: true,
            },
            {
                to: '/forms',
                label: 'Form',
                labelKey: 'nav.forms',
                icon: CreditCard,
                mobile: true,
            },
        ],
    },
    {
        key: 'pages',
        label: 'Halaman',
        labelKey: 'nav.section.pages',
        items: [
            {
                to: '/pricing',
                label: 'Harga',
                labelKey: 'nav.pricing',
                icon: CreditCard,
            },
            {
                to: '/faq',
                label: 'FAQ',
                labelKey: 'nav.faq',
                icon: HelpCircle,
            },
            {
                to: '/templates',
                label: 'Galeri Template',
                labelKey: 'nav.templates',
                icon: LayoutDashboard,
            },
        ],
    },
    {
        key: 'account',
        label: 'Akun',
        labelKey: 'nav.section.account',
        items: [
            {
                to: '/settings',
                label: 'Pengaturan',
                labelKey: 'nav.settings',
                icon: Settings,
            },
        ],
    },
];

/** Empat item pertama untuk bottom-nav mobile + tombol "Menu". */
export function mobileNavItems(): NavItem[] {
    const flat = navSections.flatMap((s) => s.items);
    return flat.filter((i) => i.mobile).slice(0, 4);
}

// ============================================================================
// ACTIVE STATE, sinkron dengan nested route.
//
// `usePage().url` bisa membawa query/hash (mis. /users?page=2); bandingkan
// path yang sudah dibersihkan supaya state aktif tidak hilang saat
// filter/paginasi. Section nav selalu dirender penuh (bukan akordeon), jadi
// tidak ada grup yang perlu dibuka otomatis, prefix match di bawah sudah
// menandai item induk saat route nested aktif.
// ============================================================================

/** Path tanpa query/hash dan tanpa trailing slash (kecuali root). */
export function activePath(url: string): string {
    const p = url.split(/[?#]/, 1)[0] || '/';
    return p.length > 1 ? p.replace(/\/+$/, '') : p;
}

/**
 * True bila item nav cocok dengan URL saat ini, exact atau nested
 * (mis. item '/crm' aktif di '/crm/deals'). Root '/' hanya exact-match
 * supaya tidak menandai semua halaman sebagai Dashboard.
 */
export function isNavActive(url: string, to: string): boolean {
    const path = activePath(url);
    const target = activePath(to);
    if (path === target) return true;
    return target !== '/' && path.startsWith(target + '/');
}

/**
 * SATU `to` nav yang paling cocok dengan URL saat ini (exact menang,
 * kalau tidak ada yang exact maka prefix terpanjang dengan batas segmen).
 * Dipakai supaya highlight biru tidak pernah dobel: mis. di '/crm/kontak'
 * hanya 'Kontak' yang biru, bukan 'Dashboard' (/crm) ikut-ikutan.
 */
export function bestNavMatch(url: string, tos: string[]): string | null {
    const path = activePath(url);
    let best: string | null = null;
    let bestLen = -1;
    for (const raw of tos) {
        const target = activePath(raw);
        const match =
            path === target || (target !== '/' && path.startsWith(target + '/'));
        if (match && target.length > bestLen) {
            best = raw;
            bestLen = target.length;
        }
    }
    return best;
}

// ============================================================================
// NAV FLAVOR, sections sidebar dari shared prop `template.nav`.
//
// config/template.php mengirim array PENUH section per flavor:
//   [['label' => 'CRM', 'items' => [['label' => 'Dashboard',
//                                    'to' => '/crm',
//                                    'icon' => 'LayoutDashboard'], ...]], ...]
// 'icon' adalah string nama komponen lucide-react; registry di bawah
// memetakannya ke komponen. Nama yang tidak dikenal → LayoutDashboard.
//
// Bila shared prop bukan array (string 'all' atau tidak ada), kembalikan
// null supaya pemanggil memakai navSections statis seperti biasa.
// ============================================================================

const templateIconRegistry: Record<string, LucideIcon> = {
    LayoutDashboard,
    Users,
    Building2,
    SquareKanban,
    ListChecks,
    ChartLine,
    ShoppingCart,
    ShoppingBag,
    Truck,
    Car,
    Route,
    CalendarDays,
    Wallet,
    ClipboardList,
    Store,
    Receipt,
    Timer,
    Stethoscope,
    Warehouse,
    Boxes,
    Megaphone,
    Target,
    Filter,
    KeyRound,
    WashingMachine,
    Shirt,
    Globe,
    MousePointerClick,
    Eye,
    Home,
    Settings,
    ShieldCheck,
    User,
    GraduationCap,
    BookOpen,
    Pill,
    PawPrint,
    Syringe,
    Scissors,
    BedDouble,
    FileText,
    AlertCircle,
    Bell,
    CalendarCheck,
    ArrowLeftRight,
    Sparkles,
    ChefHat,
    UtensilsCrossed,
    Package,
    ListOrdered,
    Wrench,
    Cog,
    Map,
    Ticket,
    Dumbbell,
    PiggyBank,
    HandCoins,
    CalendarClock,
    HeartHandshake,
    Beef,
    FileBarChart,
    Percent,
    Waves,
    TrendingUp,
    Briefcase,
    FileSignature,
};

/** Label tampil untuk NavItem: pakai i18n bila ada labelKey, kalau tidak label mentah. */
export function navItemLabel(t: (key: string) => string, item: Pick<NavItem, 'label' | 'labelKey'>): string {
    return item.labelKey ? t(item.labelKey) : item.label;
}

export function resolveTemplateNav(nav: unknown): NavSection[] | null {
    if (!Array.isArray(nav) || nav.length === 0) return null;

    const sections: NavSection[] = [];
    for (const raw of nav as TemplateNavSection[]) {
        if (!raw || !Array.isArray(raw.items)) continue;
        const items: NavItem[] = [];
        for (const it of raw.items as TemplateNavItem[]) {
            if (!it || typeof it.to !== 'string' || typeof it.label !== 'string') continue;
            items.push({
                to: it.to,
                label: it.label,
                // Tanpa labelKey: label dipakai apa adanya (tanpa i18n).
                icon: templateIconRegistry[it.icon] ?? LayoutDashboard,
            });
        }
        if (items.length === 0) continue;
        sections.push({
            label: typeof raw.label === 'string' ? raw.label : undefined,
            items,
        });
    }

    return sections.length > 0 ? sections : null;
}
