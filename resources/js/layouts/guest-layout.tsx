import { useBrand } from '@/hooks/use-brand';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { ChartLine, ReceiptText, Warehouse } from 'lucide-react';
import type { PropsWithChildren } from 'react';

const bullets = [
    { icon: ReceiptText, text: 'Kelola pesanan & invoice' },
    { icon: Warehouse, text: 'Pantau stok gudang' },
    { icon: ChartLine, text: 'Laporan penjualan real-time' },
];

/** Layout halaman auth: panel brand di kiri, kartu form di kanan. */
export default function GuestLayout({ children }: PropsWithChildren) {
    const brand = useBrand();
    return (
        <div className="grid min-h-screen lg:grid-cols-2">
            {/* Panel brand, desktop */}
            <div className="bg-primary text-primary-foreground relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-12">
                <img
                    src="/images/auth/side.jpg"
                    alt=""
                    aria-hidden
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-primary/30" />
                <Link href="/" className="relative flex items-center gap-3">
                    <span className="bg-primary-foreground/15 flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold backdrop-blur">
                        {brand.initials}
                    </span>
                    <span>
                        <span className="block text-lg font-semibold tracking-tight">
                            {brand.name}
                        </span>
                        <span className="block text-sm opacity-80">{brand.tagline}</span>
                    </span>
                </Link>
                <div className="relative">
                    <h2 className="max-w-md text-3xl font-bold tracking-tight">
                        Semua urusan distribusi, dalam satu dashboard.
                    </h2>
                    <ul className="mt-8 space-y-4">
                        {bullets.map((b) => (
                            <li key={b.text} className="flex items-center gap-3">
                                <span className="bg-primary-foreground/15 flex h-9 w-9 items-center justify-center rounded-lg backdrop-blur">
                                    <b.icon className="h-4.5 w-4.5" />
                                </span>
                                <span className="text-sm font-medium">{b.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <p className="relative text-xs opacity-70">
                    © 2026 {brand.name}. {brand.tagline}.
                </p>
            </div>

            {/* Form */}
            <div className="bg-muted/30 flex flex-col items-center justify-center p-4">
                {/* Brand ringkas, mobile */}
                <Link href="/" className="mb-6 flex items-center gap-2.5 lg:hidden">
                    <span className="bg-primary text-primary-foreground flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold">
                        {brand.initials}
                    </span>
                    <span className="text-base font-semibold tracking-tight">
                        {brand.name}
                    </span>
                </Link>
                <Card className="w-full max-w-md shadow-lg">
                    <CardContent className="p-6 sm:p-8">{children}</CardContent>
                </Card>
                <p className="text-muted-foreground mt-6 hidden text-center text-xs lg:block">
                    {brand.tagline}
                </p>
            </div>
        </div>
    );
}
