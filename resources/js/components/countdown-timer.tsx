import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

// Hitung mundur live ke sebuah target waktu: kotak DD:HH:MM:SS
// dengan label Indonesia. Melewati target -> tampil "Berakhir".

function toMs(target: Date | string | number): number {
    if (target instanceof Date) return target.getTime();
    if (typeof target === 'number') return target;
    const t = Date.parse(target);
    return Number.isNaN(t) ? 0 : t;
}

function parts(remainingMs: number) {
    const total = Math.max(0, Math.floor(remainingMs / 1000));
    return {
        days: Math.floor(total / 86400),
        hours: Math.floor((total % 86400) / 3600),
        minutes: Math.floor((total % 3600) / 60),
        seconds: total % 60,
    };
}

const UNITS: { key: keyof ReturnType<typeof parts>; label: string }[] = [
    { key: 'days', label: 'Hari' },
    { key: 'hours', label: 'Jam' },
    { key: 'minutes', label: 'Mnt' },
    { key: 'seconds', label: 'Dtk' },
];

export function CountdownTimer({ target, className }: { target: Date | string | number; className?: string }) {
    // `now` diisi setelah mount: Date.now() saat render selalu berbeda
    // antara SSR & klien (hydration mismatch). Selama null, tampil 00.
    const [now, setNow] = useState<number | null>(null);
    const targetMs = toMs(target);
    const expired = now !== null && targetMs <= now;

    // Tick tiap detik; berhenti sendiri saat sudah berakhir.
    useEffect(() => {
        setNow(Date.now());
        if (expired) return;
        const id = window.setInterval(() => setNow(Date.now()), 1000);
        return () => window.clearInterval(id);
    }, [expired, targetMs]);

    if (expired) {
        return (
            <span className={cn('text-sm font-medium text-muted-foreground', className)}>
                Berakhir
            </span>
        );
    }

    const p = parts(targetMs - (now ?? targetMs));

    return (
        <div className={cn('flex items-start gap-1.5', className)} role="timer" aria-live="off">
            {UNITS.map(({ key, label }, i) => (
                <div key={key} className="flex items-start gap-1.5">
                    <div className="flex flex-col items-center">
                        <span className="tnum rounded-md bg-muted px-2 py-1.5 text-lg font-bold tabular-nums">
                            {String(p[key]).padStart(2, '0')}
                        </span>
                        <span className="mt-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                            {label}
                        </span>
                    </div>
                    {i < UNITS.length - 1 && (
                        <span className="pt-1.5 text-lg font-bold text-muted-foreground" aria-hidden>
                            :
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
}

export function CountdownTimerDemo() {
    // Demo: 2 hari 5 jam dari sekarang (flash sale toko).
    const target = Date.now() + (2 * 24 + 5) * 3600 * 1000 + 42 * 60 * 1000;
    return (
        <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Flash Sale 11.11 berakhir dalam:</p>
            <CountdownTimer target={target} />
        </div>
    );
}
