import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

// Linimasa vertikal: kolom titik/ikon dengan garis penghubung,
// judul + deskripsi + stempel waktu di kanan.

// Warna titik mengikuti nada (tone) tiap item.
export interface TimelineItem {
    id: string | number;
    title: string;
    description?: string;
    time: string;
    icon?: LucideIcon;
    tone?: 'default' | 'success' | 'warning' | 'destructive' | 'info';
}

const TONE_STYLES: Record<NonNullable<TimelineItem['tone']>, { dot: string; line: string }> = {
    default: { dot: 'bg-muted-foreground/30 text-muted-foreground', line: 'bg-border' },
    success: { dot: 'bg-success/15 text-success', line: 'bg-success/30' },
    warning: { dot: 'bg-warning/15 text-warning', line: 'bg-warning/30' },
    destructive: { dot: 'bg-destructive/15 text-destructive', line: 'bg-destructive/30' },
    info: { dot: 'bg-info/15 text-info', line: 'bg-info/30' },
};

export function Timeline({ items, className }: { items: TimelineItem[]; className?: string }) {
    if (items.length === 0) {
        return <p className="text-sm text-muted-foreground">Belum ada aktivitas.</p>;
    }

    return (
        <ol className={cn('flex flex-col', className)}>
            {items.map((item, i) => {
                const tone = TONE_STYLES[item.tone ?? 'default'];
                const Icon = item.icon;
                const isLast = i === items.length - 1;
                return (
                    <li key={item.id} className="relative flex gap-4">
                        {/* Kolom titik + garis penghubung */}
                        <div className="flex flex-col items-center">
                            <span className={cn('z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full', tone.dot)}>
                                {Icon && <Icon className="h-4 w-4" />}
                            </span>
                            {!isLast && <span className={cn('w-px flex-1', tone.line)} aria-hidden />}
                        </div>
                        <div className={cn('min-w-0 flex-1', !isLast && 'pb-6')}>
                            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                                <p className="text-sm font-medium">{item.title}</p>
                                <time className="tnum shrink-0 text-xs text-muted-foreground">{item.time}</time>
                            </div>
                            {item.description && (
                                <p className="mt-0.5 text-sm text-muted-foreground">{item.description}</p>
                            )}
                        </div>
                    </li>
                );
            })}
        </ol>
    );
}

export function TimelineDemo() {
    const items: TimelineItem[] = [
        { id: 1, title: 'Pesanan #INV-2026-1042 dibuat', description: 'Budi Santoso memesan 3 item via kasir Surabaya', time: '09.12', tone: 'info' },
        { id: 2, title: 'Pembayaran diterima', description: 'QRIS Rp 187.500, Midtrans', time: '09.15', tone: 'success' },
        { id: 3, title: 'Stok menipis: Kopi Robusta 250g', description: 'Sisa 8 bungkus di gudang Bandung', time: '10.03', tone: 'warning' },
        { id: 4, title: 'Pesanan #INV-2026-1039 dibatalkan', description: 'Pelanggan membatalkan sebelum pembayaran', time: '10.47', tone: 'destructive' },
    ];
    return (
        <div className="max-w-md">
            <Timeline items={items} />
        </div>
    );
}
