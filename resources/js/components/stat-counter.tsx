import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

// Angka yang menghitung naik (count-up) saat pertama kali terlihat
// di viewport, dengan easing ease-out. Berjalan sekali saja.

// Easing ease-out cubic: cepat di awal, melambat di akhir.
function easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
}

export function StatCounter({
    value,
    prefix = '',
    suffix = '',
    duration = 1200,
    className,
}: {
    value: number;
    prefix?: string;
    suffix?: string;
    duration?: number;
    className?: string;
}) {
    const ref = useRef<HTMLSpanElement>(null);
    const [display, setDisplay] = useState(0);
    const started = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el || started.current) return;

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduced) {
            started.current = true;
            setDisplay(value);
            return;
        }

        let raf = 0;
        const observer = new IntersectionObserver(
            (entries) => {
                if (!entries[0].isIntersecting || started.current) return;
                started.current = true;
                const t0 = performance.now();
                const tick = (t: number) => {
                    const p = Math.min(1, (t - t0) / duration);
                    setDisplay(Math.round(value * easeOutCubic(p)));
                    if (p < 1) raf = requestAnimationFrame(tick);
                };
                raf = requestAnimationFrame(tick);
                observer.disconnect();
            },
            { threshold: 0.4 },
        );
        observer.observe(el);
        return () => {
            observer.disconnect();
            cancelAnimationFrame(raf);
        };
    }, [value, duration]);

    return (
        <span ref={ref} className={cn('tnum tabular-nums', className)}>
            {prefix}
            {display.toLocaleString('id-ID')}
            {suffix}
        </span>
    );
}

export function StatCounterDemo() {
    return (
        <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">Omzet bulan ini</p>
                <StatCounter value={125750000} prefix="Rp " className="text-xl font-bold" duration={1500} />
            </div>
            <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">Pelanggan aktif</p>
                <StatCounter value={8420} className="text-xl font-bold" duration={1500} />
            </div>
            <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">Tingkat kepuasan</p>
                <StatCounter value={98} suffix="%" className="text-xl font-bold" duration={1500} />
            </div>
        </div>
    );
}
