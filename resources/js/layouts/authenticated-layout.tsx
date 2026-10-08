// Layout utama area CMS: sidebar (desktop) + drawer & bottom-nav (mobile).
// Bahasa desain diambil 1:1 dari si_administrasi (Amides), sudah digeneralisasi:
// tanpa string brand/role spesifik, semua dari @/config/brand.ts dan props.
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { AppLogo } from '@/components/app-logo';
import { CommandPalette } from '@/components/command-palette';
import { bestNavMatch, mobileNavItems, navItemLabel, navSections, resolveTemplateNav } from '@/lib/nav';
import { useT } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { Link, router, usePage } from '@inertiajs/react';
import {
    Bell,
    ChevronsLeft,
    ChevronsRight,
    LogOut,
    Menu,
    Moon,
    Search,
    Sun,
} from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { Toaster, toast } from 'sonner';

export interface TemplateUser {
    name: string;
    role?: string;
}

function initialsOf(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

function NavList({
    onNavigate,
    collapsed = false,
}: {
    onNavigate?: () => void;
    collapsed?: boolean;
}) {
    const { url, props } = usePage();
    const t = useT();
    // Flavor non-full mengirim sections nav penuh dari backend
    // (config/template.php → shared prop `template.nav`). Bila ada,
    // sidebar dirender dari situ; bila 'all'/tidak ada, pakai
    // navSections statis seperti sekarang.
    const template = (props as Record<string, any>).template as
        | { nav?: unknown }
        | undefined;
    const sections = resolveTemplateNav(template?.nav) ?? navSections;
    // Satu-satunya item yang boleh biru: yang `to`-nya paling cocok
    // dengan URL (exact menang, lalu prefix terpanjang).
    const activeTo = bestNavMatch(
        url,
        sections.flatMap((s) => s.items.map((i) => i.to)),
    );
    return (
        <nav className="flex flex-col gap-1 px-2">
            {sections.map((section, si) => (
                <div key={si} className={cn(si > 0 && 'mt-4 nav-section')}>
                    {section.label && !collapsed && (
                        <p className="nav-section-label text-muted-foreground px-3 pb-1.5 text-[11px] font-medium tracking-wide uppercase">
                            {section.labelKey ? t(section.labelKey) : section.label}
                        </p>
                    )}
                    <div className="flex flex-col gap-0.5">
                        {section.items.map((it) => {
                            // Hanya SATU item yang biru (lihat activeTo di atas).
                            const active = it.to === activeTo;
                            const Icon = it.icon;
                            const label = navItemLabel(t, it);
                            return (
                                <Link
                                    key={it.to}
                                    href={it.to}
                                    prefetch
                                    onClick={onNavigate}
                                    // Halaman aktif ditandai untuk screen reader.
                                    aria-current={active ? 'page' : undefined}
                                    // Saat sidebar diciutkan hanya ikon yang terlihat.
                                    aria-label={collapsed ? label : undefined}
                                    className={cn(
                                        'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                        active
                                            ? 'bg-primary text-primary-foreground shadow-sm'
                                            : 'text-foreground/70 hover:bg-accent hover:text-accent-foreground',
                                        collapsed && 'justify-center px-2',
                                    )}
                                    title={collapsed ? label : undefined}
                                >
                                    <Icon className="h-4 w-4 shrink-0" />
                                    {!collapsed && (
                                        <span className="truncate">
                                            {label}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ))}
        </nav>
    );
}

function UserBadge({
    user,
    collapsed = false,
}: {
    user: TemplateUser;
    collapsed?: boolean;
}) {
    const initials = initialsOf(user.name);
    if (collapsed) {
        return (
            <div className="flex justify-center p-3">
                <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {initials}
                    </AvatarFallback>
                </Avatar>
            </div>
        );
    }
    return (
        <div className="bg-card mx-2 mb-2 rounded-xl border p-3">
            <div className="flex items-center gap-2">
                <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {initials}
                    </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                    <div className="truncate text-sm font-medium">
                        {user.name}
                    </div>
                    {user.role && (
                        <div className="text-muted-foreground truncate text-xs">
                            {user.role}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export interface NotificationItem {
    id: string;
    title: string;
    message: string;
    time: string;
}

function NotificationsDropdown({
    items,
}: {
    items: NotificationItem[];
}) {
    const [read, setRead] = useState<Set<string>>(new Set());
    const unread = items.filter((i) => !read.has(i.id)).length;
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Notifikasi"
                    className="relative"
                >
                    <Bell className="h-5 w-5" />
                    {unread > 0 && (
                        <span className="bg-destructive text-destructive-foreground absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold">
                            {unread > 9 ? '9+' : unread}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-[calc(100vw-2rem)] p-0 shadow-xl sm:w-96"
            >
                <div className="bg-muted/40 flex items-center justify-between border-b px-4 py-3">
                    <span className="text-sm font-semibold">Notifikasi</span>
                    {unread > 0 && (
                        <button
                            onClick={() =>
                                setRead(new Set(items.map((i) => i.id)))
                            }
                            className="text-primary text-xs font-medium hover:underline"
                        >
                            Tandai semua dibaca
                        </button>
                    )}
                </div>
                <div className="divide-border max-h-[350px] divide-y overflow-y-auto">
                    {items.length === 0 ? (
                        <div className="text-muted-foreground py-8 text-center text-xs">
                            <Bell className="mx-auto mb-2 h-8 w-8 opacity-30" />
                            Tidak ada notifikasi.
                        </div>
                    ) : (
                        items.map((item) => (
                            <button
                                key={item.id}
                                onClick={() =>
                                    setRead((s) => new Set(s).add(item.id))
                                }
                                className={cn(
                                    'hover:bg-muted/60 flex w-full items-start gap-3 p-3 text-left text-xs transition',
                                    !read.has(item.id) && 'bg-primary/5',
                                )}
                            >
                                <div className="bg-primary/10 text-primary mt-0.5 shrink-0 rounded-full p-1.5">
                                    <Bell className="h-3.5 w-3.5" />
                                </div>
                                <div className="min-w-0 flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-foreground truncate font-semibold">
                                            {item.title}
                                        </span>
                                        {!read.has(item.id) && (
                                            <span className="bg-primary h-2 w-2 shrink-0 rounded-full" />
                                        )}
                                    </div>
                                    <p className="text-muted-foreground line-clamp-2 text-[11px]">
                                        {item.message}
                                    </p>
                                    <p className="text-muted-foreground/70 text-[10px]">
                                        {item.time}
                                    </p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default function AuthenticatedLayout({
    children,
}: {
    children?: ReactNode;
}) {
    const page = usePage();
    const props = page.props as any;
    const user: TemplateUser | undefined = props.auth?.user;
    const notifications: NotificationItem[] = props.notifications ?? [];
    const flash = props.flash as
        | { success?: string; error?: string; warning?: string; info?: string }
        | undefined;

    // Sidebar collapse dipersist ke localStorage. Lazy initializer dibaca
    // sebelum paint pertama (render client Inertia) → tidak ada layout shift.
    const [collapsed, setCollapsed] = useState<boolean>(() => {
        // Guard eksplisit: initializer jalan juga saat SSR (Node),
        // di mana `localStorage` tidak ada.
        if (typeof window === 'undefined') return false;
        try {
            return localStorage.getItem('tpl-sidebar-collapsed') === '1';
        } catch {
            return false;
        }
    });
    const [mobileOpen, setMobileOpen] = useState(false);
    const [paletteOpen, setPaletteOpen] = useState(false);

    const toggleCollapsed = () => {
        const next = !collapsed;
        setCollapsed(next);
        try {
            localStorage.setItem('tpl-sidebar-collapsed', next ? '1' : '0');
        } catch {
            /* abaikan */
        }
    };

    // Command palette: buka/tutup dengan Ctrl+K atau ⌘+K.
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setPaletteOpen((o) => !o);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    // Tangkap flash message dari backend Laravel → toast.
    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
        if (flash?.warning) toast.warning(flash.warning);
        if (flash?.info) toast.info(flash.info);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flash?.success, flash?.error, flash?.warning, flash?.info]);

    const handleLogout = () => {
        router.post('/logout');
    };

    const displayUser: TemplateUser = user ?? {
        name: 'Demo User',
        role: 'Administrator',
    };
    const initials = initialsOf(displayUser.name);

    return (
        <div className="bg-muted/30 text-foreground flex min-h-screen w-full">
            <Toaster position="top-right" richColors closeButton />
            <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
            {/* Skip link: muncul saat fokus keyboard, melompat ke konten utama. */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
            >
                Lewati ke konten utama
            </a>

            {/* Sidebar desktop */}
            <aside
                className={cn(
                    'bg-sidebar sticky top-0 hidden h-screen shrink-0 border-r transition-[width] duration-300 md:flex md:flex-col',
                    collapsed ? 'w-[72px]' : 'w-64',
                )}
            >
                <div className="flex h-14 items-center px-3">
                    <AppLogo collapsed={collapsed} />
                </div>
                <div className="flex-1 overflow-y-auto py-2">
                    <NavList collapsed={collapsed} />
                </div>
                <div className="border-t">
                    <UserBadge user={displayUser} collapsed={collapsed} />
                    <div className="flex items-center justify-between px-2 pb-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleCollapsed}
                            className="h-8 w-8 p-0"
                            aria-label={collapsed ? 'Bentangkan sidebar' : 'Ciutkan sidebar'}
                            aria-expanded={!collapsed}
                        >
                            {collapsed ? (
                                <ChevronsRight className="h-4 w-4" />
                            ) : (
                                <ChevronsLeft className="h-4 w-4" />
                            )}
                        </Button>
                        {!collapsed && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleLogout}
                                className="text-muted-foreground hover:text-foreground h-8 gap-2 text-xs"
                            >
                                <LogOut className="h-3.5 w-3.5" /> Keluar
                            </Button>
                        )}
                    </div>
                </div>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
                {/* Top bar */}
                <header className="bg-background/80 sticky top-0 z-30 flex h-14 items-center gap-2 border-b px-3 backdrop-blur md:px-6">
                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden"
                                aria-label="Buka menu"
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-72 p-0">
                            <SheetTitle className="sr-only">Menu</SheetTitle>
                            <div className="flex h-full flex-col">
                                <div className="flex h-14 items-center px-3">
                                    <AppLogo />
                                </div>
                                <div className="flex-1 overflow-y-auto py-2">
                                    <NavList
                                        onNavigate={() => setMobileOpen(false)}
                                    />
                                </div>
                                <div className="border-t">
                                    <UserBadge user={displayUser} />
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>

                    <div className="flex items-center md:hidden">
                        <AppLogo />
                    </div>

                    {/* Pemicu command palette (⌘K) */}
                    <button
                        onClick={() => setPaletteOpen(true)}
                        className="text-muted-foreground hover:text-foreground hover:bg-muted hidden items-center gap-2 rounded-lg border px-3 py-1.5 text-xs md:flex"
                    >
                        <Search className="h-3.5 w-3.5" />
                        <span>Cari halaman…</span>
                        <kbd className="bg-muted rounded px-1.5 py-0.5 text-[10px] font-medium">
                            ⌘K
                        </kbd>
                    </button>

                    <div className="ml-auto flex items-center gap-1">
                        <LocaleSwitcher />
                        <ThemeToggle />
                        <NotificationsDropdown items={notifications} />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="h-9 gap-2 px-2"
                                >
                                    <Avatar className="h-7 w-7">
                                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="hidden text-sm font-medium sm:inline">
                                        {displayUser.name.split(' ')[0]}
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>
                                    <div className="text-sm">
                                        {displayUser.name}
                                    </div>
                                    {displayUser.role && (
                                        <div className="text-muted-foreground text-xs font-normal">
                                            {displayUser.role}
                                        </div>
                                    )}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/profile"
                                        className="cursor-pointer"
                                    >
                                        Profil Saya
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/settings"
                                        className="cursor-pointer"
                                    >
                                        Pengaturan
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-destructive cursor-pointer"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="mr-2 h-4 w-4" /> Keluar
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                <main
                    id="main-content"
                    // Bisa difokuskan programatik oleh skip link.
                    tabIndex={-1}
                    className="min-w-0 flex-1 pb-20 outline-none md:pb-6"
                >
                    <div className="mx-auto w-full max-w-7xl p-4 md:p-6">
                        {children}
                    </div>
                </main>

                <MobileBottomNav />
            </div>
        </div>
    );
}

// Toggle bahasa ID/EN, locale disimpan di session via /locale/{id|en},
// dibagikan ke semua halaman sebagai Inertia prop `locale`.
function LocaleSwitcher() {
    const props = usePage().props as { locale?: string };
    const current = props.locale === 'en' ? 'en' : 'id';
    return (
        <div
            className="bg-muted flex items-center rounded-lg p-0.5"
            role="group"
            aria-label="Pilih bahasa"
        >
            {(['id', 'en'] as const).map((l) => (
                <button
                    key={l}
                    onClick={() => router.visit(`/locale/${l}`)}
                    aria-pressed={current === l}
                    className={cn(
                        'rounded-md px-2 py-1 text-[11px] font-semibold uppercase transition-colors',
                        current === l
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground',
                    )}
                >
                    {l}
                </button>
            ))}
        </div>
    );
}

function ThemeToggle() {
    const [dark, setDark] = useState<boolean>(() =>
        typeof document !== 'undefined'
            ? document.documentElement.classList.contains('dark')
            : false,
    );
    // Terapkan ke <html> + simpan pilihan.
    useEffect(() => {
        document.documentElement.classList.toggle('dark', dark);
        try {
            localStorage.setItem('tpl-theme', dark ? 'dark' : 'light');
        } catch {
            /* abaikan */
        }
    }, [dark]);
    // Init dari localStorage / prefers-color-scheme (sekali saja).
    useEffect(() => {
        try {
            const saved = localStorage.getItem('tpl-theme');
            if (saved) setDark(saved === 'dark');
            else if (window.matchMedia('(prefers-color-scheme: dark)').matches)
                setDark(true);
        } catch {
            /* abaikan */
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <Button
            variant="ghost"
            size="icon"
            aria-label="Ganti tema"
            onClick={() => setDark((d) => !d)}
        >
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
    );
}

function MobileBottomNav() {
    const { url } = usePage();
    const t = useT();
    const items = mobileNavItems();
    const activeTo = bestNavMatch(
        url,
        items.map((i) => i.to),
    );
    // Sheet "Menu" dibuat controlled supaya tertutup otomatis setelah
    // navigasi (navigasi Inertia tidak reload halaman).
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <nav className="bg-background/95 fixed inset-x-0 bottom-0 z-30 border-t backdrop-blur md:hidden">
            <div className="grid grid-cols-5">
                {items.map((it) => {
                    const active = it.to === activeTo;
                    const Icon = it.icon;
                    const label = navItemLabel(t, it);
                    return (
                        <Link
                            key={it.to}
                            href={it.to}
                            prefetch
                            aria-current={active ? 'page' : undefined}
                            className={cn(
                                'flex min-h-[56px] flex-col items-center justify-center gap-1 text-[10px] font-medium',
                                active
                                    ? 'text-primary'
                                    : 'text-muted-foreground',
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            <span className="truncate px-1">
                                {label.split(' ')[0]}
                            </span>
                        </Link>
                    );
                })}
                <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                    <SheetTrigger asChild>
                        <button className="text-muted-foreground flex min-h-[56px] flex-col items-center justify-center gap-1 text-[10px] font-medium">
                            <Menu className="h-5 w-5" />
                            <span>Menu</span>
                        </button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-72 p-0">
                        <SheetTitle className="sr-only">Semua menu</SheetTitle>
                        <div className="flex h-full flex-col">
                            <div className="flex h-14 items-center px-3">
                                <AppLogo />
                            </div>
                            <div className="flex-1 overflow-y-auto py-2">
                                <NavList
                                    onNavigate={() => setMenuOpen(false)}
                                />
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    );
}
