// Landing page VOLTARA, toko elektronik.
// Halaman ini TIDAK memakai AuthenticatedLayout, header/nav + footer inline, self-contained.
// Tidak menerima props. Badge diskon dihitung otomatis dari harga coret.
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CountdownTimer } from '@/components/countdown-timer';
import { StickyMobileCta } from '@/components/sticky-mobile-cta';
import {
    AirVent,
    ArrowRight,
    BadgePercent,
    Check,
    ChefHat,
    CreditCard,
    Menu,
    MonitorPlay,
    Phone,
    Plug,
    Refrigerator,
    Search,
    ShieldCheck,
    ShoppingCart,
    Smartphone,
    Star,
    Truck,
    WashingMachine,
    X,
    Zap,
    type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Format rupiah gaya Indonesia: 4299000 -> "Rp4.299.000"
const rupiah = (n: number) => `Rp${n.toLocaleString('id-ID')}`;

// ---------- Data ----------

interface Kategori {
    nama: string;
    icon: LucideIcon;
    jumlah: string;
}

const KATEGORI: Kategori[] = [
    { nama: 'TV & Audio', icon: MonitorPlay, jumlah: '320+ produk' },
    { nama: 'Kulkas', icon: Refrigerator, jumlah: '180+ produk' },
    { nama: 'Mesin Cuci', icon: WashingMachine, jumlah: '140+ produk' },
    { nama: 'AC & Kipas', icon: AirVent, jumlah: '210+ produk' },
    { nama: 'Dapur', icon: ChefHat, jumlah: '260+ produk' },
    { nama: 'Gadget', icon: Smartphone, jumlah: '450+ produk' },
];

interface Produk {
    nama: string;
    merek: string;
    kategori: string;
    harga: number;
    hargaCoret: number;
    rating: number;
    terjual: number; // unit terjual
    stok: number; // sisa stok untuk progress bar
    foto: string; // foto lokal di public/images/landing-elektronik/
}

// Persen diskon dihitung otomatis: Math.round((1 - harga/hargaCoret) * 100)
const FLASH_DEALS: Produk[] = [
    { nama: 'Smart TV 43" 4K UHD Google TV', merek: 'Voltara Signature', kategori: 'TV & Audio', harga: 4299000, hargaCoret: 5999000, rating: 4.8, terjual: 342, stok: 58, foto: '/images/landing-elektronik/produk-tv.jpg' },
    { nama: 'Kulkas 2 Pintu 220L Inverter', merek: 'Voltara Cool', kategori: 'Kulkas', harga: 3899000, hargaCoret: 4799000, rating: 4.9, terjual: 518, stok: 34, foto: '/images/landing-elektronik/produk-kulkas.jpg' },
    { nama: 'Mesin Cuci Front Load 8kg', merek: 'Voltara Wash', kategori: 'Mesin Cuci', harga: 2749000, hargaCoret: 3499000, rating: 4.7, terjual: 296, stok: 71, foto: '/images/landing-elektronik/produk-mesin-cuci.jpg' },
    { nama: 'AC Split 1 PK Inverter', merek: 'Voltara Air', kategori: 'AC & Kipas', harga: 3199000, hargaCoret: 4199000, rating: 4.8, terjual: 410, stok: 45, foto: '/images/landing-elektronik/produk-ac.jpg' },
];

// Nama merek sebagai teks polos (bukan logo)
const MEREK = ['Samsung', 'LG', 'Sharp', 'Polytron', 'Panasonic', 'Daikin', 'Aqua', 'Hisense'];

const NAV_KATEGORI = ['TV & Audio', 'Kulkas', 'Mesin Cuci', 'AC & Kipas', 'Dapur', 'Gadget'];

// ---------- Komponen kecil ----------

function Bintang({ nilai }: { nilai: number }) {
    return (
        <span className="flex items-center gap-0.5" aria-label={`Rating ${nilai} dari 5`}>
            {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className={cn('h-3.5 w-3.5', i <= Math.round(nilai) ? 'fill-amber-400 text-amber-400' : 'text-slate-300')} />
            ))}
        </span>
    );
}

function KartuFlashDeal({ p, ditambah, onTambah }: { p: Produk; ditambah: boolean; onTambah: () => void }) {
    // Diskon dihitung otomatis dari harga coret, selalu konsisten
    const diskon = Math.round((1 - p.harga / p.hargaCoret) * 100);
    const total = p.terjual + p.stok;
    const persenTerjual = Math.round((p.terjual / total) * 100);

    return (
        <Card className="group overflow-hidden border-slate-200 transition hover:-translate-y-1 hover:shadow-xl">
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={p.foto}
                    alt={p.nama}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <Badge className="absolute left-3 top-3 bg-rose-600 hover:bg-rose-600">−{diskon}%</Badge>
                <span className="absolute bottom-3 right-3 rounded-lg bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
                    {p.merek}
                </span>
            </div>
            <CardContent className="p-4">
                <h3 className="line-clamp-2 min-h-10 text-sm font-semibold text-slate-900">{p.nama}</h3>
                <div className="mt-2 flex items-center gap-1.5">
                    <Bintang nilai={p.rating} />
                    <span className="text-xs text-slate-500">{p.rating} · {p.terjual} terjual</span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                    <span className="tnum text-lg font-extrabold text-rose-600">{rupiah(p.harga)}</span>
                    <span className="tnum text-xs text-slate-400 line-through">{rupiah(p.hargaCoret)}</span>
                </div>
                {/* Progress bar stok terjual */}
                <div className="mt-3">
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-rose-500" style={{ width: `${persenTerjual}%` }} />
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500">{persenTerjual}% terjual · sisa {p.stok} unit</p>
                </div>
                <Button
                    className={cn('mt-3 w-full', ditambah ? 'bg-emerald-600 hover:bg-emerald-600' : 'bg-slate-900 hover:bg-slate-700')}
                    size="sm"
                    onClick={onTambah}
                    disabled={ditambah}
                >
                    {ditambah ? (
                        <><Check className="mr-2 h-4 w-4" /> Di Keranjang</>
                    ) : (
                        <><ShoppingCart className="mr-2 h-4 w-4" /> Tambah ke Keranjang</>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}

// ---------- Halaman ----------

export default function Elektronik() {
    const [menuBuka, setMenuBuka] = useState(false);
    const [kataKunci, setKataKunci] = useState('');
    const [kategoriAktif, setKategoriAktif] = useState<string | null>(null);
    const [keranjang, setKeranjang] = useState<string[]>([]);

    // Countdown flash sale: berakhir ~14 jam dari sekarang
    const targetFlash = useMemo(() => Date.now() + 14 * 60 * 60 * 1000 + 22 * 60 * 1000, []);

    const scrollKe = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

    const tambahKeKeranjang = (nama: string) => {
        if (!keranjang.includes(nama)) setKeranjang((k) => [...k, nama]);
    };

    // Pencarian & filter kategori benar-benar menyaring daftar flash deal.
    const dealsTampil = FLASH_DEALS.filter((p) => {
        const cocokKata = kataKunci.trim() === '' || p.nama.toLowerCase().includes(kataKunci.toLowerCase());
        const cocokKategori = kategoriAktif === null || p.kategori === kategoriAktif;
        return cocokKata && cocokKategori;
    });

    const pilihKategori = (k: string) => {
        setKategoriAktif((aktif) => (aktif === k ? null : k));
        scrollKe('flash');
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
            {/* Bilah promo */}
            <div className="bg-gradient-to-r from-rose-600 via-rose-500 to-orange-500 px-4 py-2 text-center text-xs font-bold uppercase tracking-widest text-white">
                <span className="inline-flex items-center gap-1.5">
                    <BadgePercent className="h-4 w-4" /> Flash Sale 10.10, diskon hingga 45% + gratis ongkir
                </span>
            </div>

            {/* Navbar + pencarian fungsional */}
            <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
                <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
                    <a href="#atas" className="flex shrink-0 items-center gap-2">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                            <Plug className="h-5 w-5" />
                        </span>
                        <span className="text-xl font-black tracking-[0.12em]">VOLTARA</span>
                    </a>
                    <form
                        className="hidden flex-1 md:flex"
                        onSubmit={(e) => { e.preventDefault(); scrollKe('flash'); }}
                        role="search"
                    >
                        <div className="relative w-full max-w-xl">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                value={kataKunci}
                                onChange={(e) => setKataKunci(e.target.value)}
                                placeholder="Cari TV, kulkas, mesin cuci, AC…"
                                className="h-11 w-full rounded-full bg-slate-100 pl-10 pr-4"
                            />
                        </div>
                    </form>
                    <div className="ml-auto flex items-center gap-1">
                        <Button variant="ghost" size="icon" aria-label="Keranjang" className="relative" onClick={() => scrollKe('flash')}>
                            <ShoppingCart className="h-5 w-5" />
                            {keranjang.length > 0 && (
                                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white">
                                    {keranjang.length}
                                </span>
                            )}
                        </Button>
                        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu" onClick={() => setMenuBuka((v) => !v)}>
                            {menuBuka ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>
                {/* Navigasi kategori */}
                <nav className="hidden border-t border-slate-100 md:block">
                    <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 sm:px-6">
                        {NAV_KATEGORI.map((k) => (
                            <button
                                key={k}
                                onClick={() => pilihKategori(k)}
                                className={cn(
                                    'whitespace-nowrap px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:text-blue-700',
                                    kategoriAktif === k && 'font-bold text-blue-700',
                                )}
                            >
                                {k}
                            </button>
                        ))}
                    </div>
                </nav>
                {menuBuka && (
                    <div className="border-t border-slate-100 bg-white px-4 py-3 md:hidden">
                        <form onSubmit={(e) => { e.preventDefault(); setMenuBuka(false); scrollKe('flash'); }} className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                value={kataKunci}
                                onChange={(e) => setKataKunci(e.target.value)}
                                placeholder="Cari elektronik…"
                                className="h-11 w-full rounded-full bg-slate-100 pl-10"
                            />
                        </form>
                        <div className="mt-2 grid grid-cols-2 gap-1">
                            {NAV_KATEGORI.map((k) => (
                                <button
                                    key={k}
                                    onClick={() => { pilihKategori(k); setMenuBuka(false); }}
                                    className="rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
                                >
                                    {k}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </header>

            {/* Hero banner promo, 1 proposisi konkret */}
            <section id="atas" className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 p-8 text-white sm:p-12">
                    <div
                        className="pointer-events-none absolute inset-0 opacity-25"
                        style={{
                            backgroundImage: 'radial-gradient(circle at 85% 20%, rgba(255,255,255,0.5) 0, transparent 30%), radial-gradient(circle at 10% 90%, rgba(255,255,255,0.35) 0, transparent 35%)',
                        }}
                    />
                    {/* Foto TV di ruang keluarga */}
                    <div className="pointer-events-none absolute -right-6 top-1/2 hidden w-72 -translate-y-1/2 md:block lg:w-96">
                        <img
                            src="/images/landing-elektronik/hero.jpg"
                            alt="Ruang keluarga modern dengan Smart TV"
                            className="aspect-video w-full rounded-xl object-cover shadow-2xl"
                        />
                    </div>
                    <div className="relative max-w-xl">
                        <h1 className="font-display text-3xl font-black leading-tight sm:text-5xl">
                            Smart TV 4K Rp4,2 jutaan, gratis instalasi & braket hari ini.
                        </h1>
                        <p className="mt-4 text-blue-100">
                            Flash Sale 10.10: diskon sampai jutaan rupiah, cicilan 0% hingga 12 bulan,
                            dan semua produk bergaransi resmi.
                        </p>
                        <div className="mt-6 flex flex-wrap items-center gap-4">
                            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50" onClick={() => scrollKe('flash')}>
                                Serbu Flash Sale <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            <button onClick={() => scrollKe('kategori')} className="text-sm font-semibold text-blue-100 underline decoration-white/50 underline-offset-4 hover:text-white">
                                Lihat semua kategori
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Grid kategori, tile berfungsi sebagai filter flash deal */}
            <section id="kategori" className="mx-auto max-w-7xl scroll-mt-32 px-4 py-12 sm:px-6">
                <h2 className="font-display text-xl font-extrabold tracking-tight sm:text-2xl">Belanja berdasarkan kategori</h2>
                <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4 lg:grid-cols-6">
                    {KATEGORI.map((k) => (
                        <button
                            key={k.nama}
                            onClick={() => pilihKategori(k.nama)}
                            aria-pressed={kategoriAktif === k.nama}
                            className={cn(
                                'group flex flex-col items-center rounded-2xl border bg-white p-4 text-center transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg sm:p-6',
                                kategoriAktif === k.nama ? 'border-blue-500 ring-2 ring-blue-200' : 'border-slate-200',
                            )}
                        >
                            <span className={cn(
                                'flex h-12 w-12 items-center justify-center rounded-2xl transition sm:h-14 sm:w-14',
                                kategoriAktif === k.nama ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
                            )}>
                                <k.icon className="h-6 w-6" />
                            </span>
                            <span className="mt-3 text-xs font-bold sm:text-sm">{k.nama}</span>
                            <span className="mt-0.5 text-[11px] text-slate-400">{k.jumlah}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Flash deals, tersaring oleh pencarian & kategori */}
            <section id="flash" className="scroll-mt-32 border-y border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                                <Zap className="h-6 w-6" />
                            </span>
                            <div>
                                <h2 className="font-display text-xl font-extrabold tracking-tight sm:text-2xl">Flash Deals</h2>
                                <p className="text-xs text-slate-500">
                                    {kategoriAktif ? `Kategori: ${kategoriAktif} · ` : ''}
                                    {kataKunci.trim() ? `Hasil untuk "${kataKunci}" · ` : ''}
                                    Stok terbatas, harga kembali normal setelah timer habis
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5">
                            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Berakhir dalam</span>
                            <CountdownTimer target={targetFlash} className="text-sm text-white" />
                        </div>
                    </div>
                    {(kategoriAktif || kataKunci.trim()) && (
                        <button
                            onClick={() => { setKategoriAktif(null); setKataKunci(''); }}
                            className="mt-4 text-xs font-semibold text-blue-700 hover:underline"
                        >
                            Hapus filter, tampilkan semua
                        </button>
                    )}
                    {dealsTampil.length === 0 ? (
                        <p className="mt-8 rounded-xl bg-slate-50 p-8 text-center text-sm text-slate-500">
                            Tidak ada flash deal yang cocok. Coba kata kunci atau kategori lain.
                        </p>
                    ) : (
                        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
                            {dealsTampil.map((p) => (
                                <KartuFlashDeal
                                    key={p.nama}
                                    p={p}
                                    ditambah={keranjang.includes(p.nama)}
                                    onTambah={() => tambahKeKeranjang(p.nama)}
                                />
                            ))}
                        </div>
                    )}
                    {/* Bukti teratribusi di dekat konversi */}
                    <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
                        <div className="flex items-start gap-4">
                            <Bintang nilai={5} />
                            <div>
                                <p className="text-sm italic leading-relaxed text-slate-700">
                                    "Pesan TV Senin pagi, Selasa siang sudah terpasang lengkap dengan braket.
                                    Teknisi-nya rapi dan menjelaskan garansinya dengan jelas."
                                </p>
                                <p className="mt-2 text-xs font-semibold text-slate-900">
                                    Dewi Lestari, Surabaya · membeli Smart TV 43" 4K, 12 Juni 2026
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Strip merek teks polos */}
            <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
                <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                    100% produk original dari merek resmi
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
                    {MEREK.map((m) => (
                        <span key={m} className="text-lg font-bold tracking-tight text-slate-300 transition hover:text-slate-500">
                            {m}
                        </span>
                    ))}
                </div>
            </section>

            {/* Trust badges */}
            <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6">
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {[
                        { icon: ShieldCheck, judul: 'Garansi Resmi', deskripsi: 'Klaim mudah di 85 service center' },
                        { icon: CreditCard, judul: 'Cicilan 0%', deskripsi: 'Hingga 12 bulan semua kartu' },
                        { icon: Truck, judul: 'Gratis Ongkir', deskripsi: 'Pulau Jawa, min. belanja Rp500rb' },
                        { icon: BadgePercent, judul: 'Harga Terbaik', deskripsi: 'Selisih harga kami ganti 2× lipat' },
                    ].map((t) => (
                        <div key={t.judul} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <t.icon className="h-6 w-6" />
                            </span>
                            <div>
                                <p className="text-sm font-bold">{t.judul}</p>
                                <p className="mt-0.5 text-xs text-slate-500">{t.deskripsi}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-950 text-slate-400">
                <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
                    <div>
                        <span className="flex items-center gap-2">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                                <Plug className="h-5 w-5" />
                            </span>
                            <span className="text-xl font-black tracking-[0.12em] text-white">VOLTARA</span>
                        </span>
                        <p className="mt-3 text-sm leading-relaxed">
                            Toko elektronik modern dengan 28 gerai di Jabodetabek, Bandung, Surabaya, dan Medan.
                        </p>
                        <p className="mt-3 flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4" /> 1500-220 (setiap hari 08.00–22.00)
                        </p>
                    </div>
                    {[
                        { h: 'Belanja', l: ['Flash Sale', 'Semua kategori', 'Promo bank', 'Voucher saya', 'Pre-order'] },
                        { h: 'Layanan', l: ['Lacak pesanan', 'Pengiriman & instalasi', 'Klaim garansi', 'Pengembalian', 'Bantuan'] },
                        { h: 'Perusahaan', l: ['Tentang Voltara', 'Gerai kami', 'Karier', 'Kebijakan privasi', 'Syarat & ketentuan'] },
                    ].map((kol) => (
                        <div key={kol.h}>
                            <h4 className="text-sm font-semibold uppercase tracking-widest text-white">{kol.h}</h4>
                            <ul className="mt-4 space-y-2 text-sm">
                                {kol.l.map((l) => (
                                    <li key={l}><span>{l}</span></li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="border-t border-white/10">
                    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:px-6">
                        <span>© 2026 PT Voltara Ritel Indonesia.</span>
                        <span>Harga dapat berubah sewaktu-waktu tanpa pemberitahuan.</span>
                    </div>
                </div>
            </footer>

            <StickyMobileCta
                variant="cart"
                title="Keranjang Belanja"
                subtitle={keranjang.length > 0 ? `${keranjang.length} item di keranjangmu` : 'Ketuk produk untuk menambah'}
                actionLabel="Lihat Flash Sale"
                onAction={() => scrollKe('flash')}
            />
        </div>
    );
}
