import { Card, CardContent } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

// Kartu KPI baku: label kecil, angka besar tabular, badge tren
// (▲/▼ + nilai), SATU kalimat penjelas via `hint`.
// Maksimal satu warna aksen (ikon); badge tren netral agar tidak
// bersaing dengan aksen lain di halaman.
export function StatCard({
    label,
    value,
    delta,
    trend = 'flat',
    icon: Icon,
    hint,
}: {
    label: string;
    value: string;
    delta?: string;
    trend?: 'up' | 'down' | 'flat';
    icon: LucideIcon;
    hint?: string;
}) {
    return (
        <Card className="shadow-sm">
            <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                            {label}
                        </p>
                        <p className="tnum mt-1.5 truncate text-2xl font-bold tracking-tight">
                            {value}
                        </p>
                        {delta && (
                            <span className="bg-muted mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold">
                                <span aria-hidden>
                                    {trend === 'up'
                                        ? '▲'
                                        : trend === 'down'
                                          ? '▼'
                                          : '–'}
                                </span>
                                {delta}
                            </span>
                        )}
                        {hint && (
                            <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">
                                {hint}
                            </p>
                        )}
                    </div>
                    <div className="bg-primary/10 text-primary shrink-0 rounded-xl p-2.5">
                        <Icon className="h-5 w-5" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
